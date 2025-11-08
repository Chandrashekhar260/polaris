"""
AI Agent Service - Gemini Integration
Handles code analysis, topic extraction, and learning insights
"""
import os
from typing import Dict, List, Optional
from pydantic import BaseModel
from services.rate_limiter import get_rate_limiter

# Conditional imports - only if API key is available
if os.getenv("GOOGLE_API_KEY"):
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.messages import HumanMessage, SystemMessage
    except ImportError:
        pass

class LearningAnalysis(BaseModel):
    """Structured output for learning analysis"""
    topics: List[str]
    difficulty: str  # "beginner", "intermediate", "advanced"
    concepts: List[str]
    potential_struggles: List[str]
    summary: str
    errors: List[Dict] = []  # List of detected errors/issues
    weak_areas: List[str] = []  # Areas where learner needs improvement

class Recommendation(BaseModel):
    """Structured output for a single recommendation"""
    title: str
    description: str
    reason: str
    estimated_time: str
    difficulty: str  # "beginner", "intermediate", "advanced"
    resource_type: str  # "video", "article", "documentation", "tutorial", "practice", "getting-started"
    topics: List[str]

class RecommendationList(BaseModel):
    """Structured output for recommendations"""
    recommendations: List[Recommendation]

class AIAgent:
    """AI Agent using Gemini for code analysis"""
    
    def __init__(self):
        """Initialize Gemini model"""
        api_key = os.getenv("GOOGLE_API_KEY")
        self.api_key_available = bool(api_key)
        self.rate_limiter = get_rate_limiter()
        
        if self.api_key_available:
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-2.0-flash-exp",
                    temperature=0.3
                )
                # Structured output LLM for analysis
                self.structured_llm = self.llm.with_structured_output(LearningAnalysis)
                # Structured output LLM for recommendations
                self.recommendation_llm = self.llm.with_structured_output(RecommendationList)
            except Exception as e:
                print(f"Warning: Failed to initialize Gemini: {e}")
                self.api_key_available = False
        
        if not self.api_key_available:
            print("⚠️  Running in mock mode - GOOGLE_API_KEY not configured")
            self.llm = None
            self.structured_llm = None
            self.recommendation_llm = None
    
    async def analyze_code(
        self,
        code_content: str,
        filename: str,
        filepath: str
    ) -> Dict:
        """
        Analyze code and extract learning insights
        
        Args:
            code_content: The code to analyze
            filename: Name of the file
            filepath: Full path to the file
            
        Returns:
            Dictionary with analysis results
        """
        system_prompt = SystemMessage(content="""You are an expert programming tutor and learning analyst.
Analyze the provided code and identify:
1. What programming topics/concepts are being learned
2. The difficulty level (beginner/intermediate/advanced)
3. Specific concepts demonstrated in the code
4. Potential areas where the learner might struggle based on code patterns
5. A brief summary of what the learner is working on
6. Any errors, bugs, or code issues (syntax errors, logic errors, best practice violations)
7. Weak areas where the learner needs improvement (based on repeated patterns, missing concepts, etc.)

For errors, provide:
- Error type (syntax, logic, runtime, best practice)
- Line number or location (if detectable)
- Description of the issue
- Severity (critical, warning, suggestion)

For weak areas, identify:
- Concepts that are missing or misunderstood
- Patterns that indicate confusion
- Areas needing more practice

Be encouraging and specific. Focus on the learning journey.""")
        
        user_prompt = HumanMessage(content=f"""Analyze this code file:

Filename: {filename}
Path: {filepath}

Code:
```
{code_content}
```

Provide a structured analysis of what the learner is studying and working on.""")
        
        # Mock mode fallback
        if not self.api_key_available or not self.structured_llm:
            return self._mock_analysis(code_content, filename, filepath)
        
        # Check rate limit
        can_request, message = self.rate_limiter.can_make_request()
        if not can_request:
            print(f"⚠️  {message}")
            return self._mock_analysis(code_content, filename, filepath)
        
        try:
            # Get structured analysis (don't record until success)
            analysis = self.structured_llm.invoke([system_prompt, user_prompt])
            
            # Only record if successful
            self.rate_limiter.record_request()
            
            # Type guard - ensure analysis is LearningAnalysis
            if isinstance(analysis, dict):
                return {
                    "filename": filename,
                    "filepath": filepath,
                    "topics": analysis.get("topics", []),
                    "difficulty": analysis.get("difficulty", "intermediate"),
                    "concepts": analysis.get("concepts", []),
                    "potential_struggles": analysis.get("potential_struggles", []),
                    "summary": analysis.get("summary", ""),
                    "errors": analysis.get("errors", []),
                    "weak_areas": analysis.get("weak_areas", [])
                }
            else:
                # analysis is LearningAnalysis model
                return {
                    "filename": filename,
                    "filepath": filepath,
                    "topics": list(analysis.topics) if analysis.topics else [],
                    "difficulty": analysis.difficulty,
                    "concepts": list(analysis.concepts) if analysis.concepts else [],
                    "potential_struggles": list(analysis.potential_struggles) if analysis.potential_struggles else [],
                    "summary": analysis.summary,
                    "errors": list(analysis.errors) if hasattr(analysis, 'errors') and analysis.errors else [],
                    "weak_areas": list(analysis.weak_areas) if hasattr(analysis, 'weak_areas') and analysis.weak_areas else []
                }
        except Exception as e:
            # Check if it's a quota/quota error
            error_str = str(e).lower()
            if "quota" in error_str or "resourceexhausted" in error_str or "429" in error_str:
                print(f"⚠️  API quota exceeded - using mock analysis")
                return self._mock_analysis(code_content, filename, filepath)
            # Fallback to mock analysis for other errors
            print(f"Error analyzing code: {e}")
            return self._mock_analysis(code_content, filename, filepath)
    
    def _mock_analysis(self, code_content: str, filename: str, filepath: str) -> Dict:
        """Provide mock analysis when API is not available"""
        # Extract file extension for basic topic detection
        ext = filename.split('.')[-1].lower() if '.' in filename else ""
        
        topic_map = {
            'py': ['Python', 'Programming'],
            'js': ['JavaScript', 'Web Development'],
            'jsx': ['React', 'JavaScript', 'Frontend'],
            'ts': ['TypeScript', 'Programming'],
            'tsx': ['React', 'TypeScript', 'Frontend'],
            'java': ['Java', 'Programming'],
            'cpp': ['C++', 'Programming'],
            'go': ['Go', 'Programming'],
            'rs': ['Rust', 'Programming'],
            'html': ['HTML', 'Web Development'],
            'css': ['CSS', 'Styling'],
            'sql': ['SQL', 'Database']
        }
        
        topics = topic_map.get(ext, ['Programming'])
        
        return {
            "filename": filename,
            "filepath": filepath,
            "topics": topics,
            "difficulty": "intermediate",
            "concepts": ["Code structure", "Syntax"],
            "potential_struggles": [],
            "summary": f"Working on {filename} - {len(code_content)} characters of code",
            "errors": [],
            "weak_areas": []
        }
    
    async def generate_recommendations(
        self,
        topics: List[str],
        struggles: List[str],
        recent_code_summary: str
    ) -> List[Dict]:
        """
        Generate learning recommendations based on analysis
        
        Args:
            topics: List of topics being learned
            struggles: Areas where learner might struggle
            recent_code_summary: Summary of recent work
            
        Returns:
            List of recommendation dictionaries
        """
        system_prompt = SystemMessage(content="""You are an expert learning advisor who helps developers learn effectively.

Generate diverse, actionable learning recommendations with varied resource types:
- **video**: Visual tutorials, coding walkthroughs, conference talks
- **article**: Blog posts, guides, best practice articles  
- **documentation**: Official docs, API references, language specifications
- **tutorial**: Step-by-step coding tutorials, interactive lessons
- **practice**: Coding challenges, exercises, project ideas
- **getting-started**: Beginner-friendly introductions, quick starts

Provide a mix of resource types to support different learning styles. Match difficulty to learner level.""")
        
        user_prompt = HumanMessage(content=f"""Based on a learner's recent coding activity:

Topics: {', '.join(topics)}
Potential Struggles: {', '.join(struggles) if struggles else 'None identified'}
Recent Work: {recent_code_summary}

Generate 4-6 specific, actionable learning recommendations with DIVERSE resource types.
Include at least 2 videos, 1-2 articles, and mix in documentation/tutorials/practice.

For each recommendation provide:
- Compelling title of the specific resource
- Clear description (what they'll learn)
- Why it's relevant to their current work
- Realistic time estimate (e.g., "15 min", "1 hour", "2-3 hours")
- Appropriate difficulty level
- Resource type that matches the content
- Relevant topics from their learning""")
        
        # Mock mode fallback
        if not self.api_key_available or not self.recommendation_llm:
            return self._mock_recommendations(topics)
        
        # Check rate limit
        can_request, message = self.rate_limiter.can_make_request()
        if not can_request:
            print(f"⚠️  {message}")
            return self._mock_recommendations(topics)
        
        try:
            # Get structured recommendations
            result = await self.recommendation_llm.ainvoke([system_prompt, user_prompt])
            
            # Only record if successful
            self.rate_limiter.record_request()
            
            # Convert to dict format
            if isinstance(result, dict) and "recommendations" in result:
                recs = result["recommendations"]
            else:
                recs = result.recommendations if hasattr(result, 'recommendations') else []
            
            # Convert Recommendation models to dicts
            recommendations = []
            for rec in recs:
                if isinstance(rec, dict):
                    recommendations.append(rec)
                else:
                    recommendations.append({
                        "title": rec.title,
                        "description": rec.description,
                        "reason": rec.reason,
                        "estimated_time": rec.estimated_time,
                        "difficulty": rec.difficulty,
                        "resource_type": rec.resource_type,
                        "topics": list(rec.topics) if rec.topics else []
                    })
            
            return recommendations[:6]  # Return max 6
            
        except Exception as e:
            # Check if it's a quota/quota error
            error_str = str(e).lower()
            if "quota" in error_str or "resourceexhausted" in error_str or "429" in error_str:
                print(f"⚠️  API quota exceeded - using mock recommendations")
                return self._mock_recommendations(topics)
            print(f"Error generating recommendations: {e}")
            return self._mock_recommendations(topics)
    
    async def generate_summary(
        self,
        sessions: List[Dict],
        period: str = "weekly"
    ) -> Dict:
        """
        Generate learning summary for a time period
        
        Args:
            sessions: List of learning sessions
            period: Time period (daily/weekly/monthly)
            
        Returns:
            Summary dictionary
        """
        if not sessions:
            return {
                "summary": "No learning activity in this period.",
                "topics_learned": [],
                "struggling_topics": [],
                "total_sessions": 0
            }
        
        # Extract data from sessions
        all_topics = []
        all_struggles = []
        for session in sessions:
            all_topics.extend(session.get("topics", []))
            all_struggles.extend(session.get("potential_struggles", []))
        
        # Count unique topics
        unique_topics = list(set(all_topics))
        unique_struggles = list(set(all_struggles))
        
        prompt = f"""Generate a {period} learning summary for a student.

Number of sessions: {len(sessions)}
Topics covered: {', '.join(unique_topics)}
Areas of difficulty: {', '.join(unique_struggles)}

Create an encouraging, specific summary that:
1. Highlights progress made
2. Identifies main focus areas
3. Points out areas needing attention
4. Offers motivation and next steps

Keep it concise but meaningful (3-4 sentences)."""
        
        # Mock mode fallback
        if not self.api_key_available or not self.llm:
            return {
                "summary": f"Completed {len(sessions)} learning sessions covering {', '.join(unique_topics[:3])}.",
                "topics_learned": unique_topics,
                "struggling_topics": unique_struggles,
                "total_sessions": len(sessions)
            }
        
        # Check rate limit
        can_request, message = self.rate_limiter.can_make_request()
        if not can_request:
            print(f"⚠️  {message}")
            return {
                "summary": f"Completed {len(sessions)} learning sessions covering {', '.join(unique_topics[:3])}.",
                "topics_learned": unique_topics,
                "struggling_topics": unique_struggles,
                "total_sessions": len(sessions)
            }
        
        try:
            from langchain_core.messages import HumanMessage
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            
            # Only record if successful
            self.rate_limiter.record_request()
            
            return {
                "summary": response.content,
                "topics_learned": unique_topics[:10],  # Top 10
                "struggling_topics": unique_struggles[:5],  # Top 5
                "total_sessions": len(sessions)
            }
        except Exception as e:
            # Check if it's a quota/quota error
            error_str = str(e).lower()
            if "quota" in error_str or "resourceexhausted" in error_str or "429" in error_str:
                print(f"⚠️  API quota exceeded - using fallback summary")
                return {
                    "summary": f"Completed {len(sessions)} learning sessions covering {', '.join(unique_topics[:3])}.",
                    "topics_learned": unique_topics,
                    "struggling_topics": unique_struggles,
                    "total_sessions": len(sessions)
                }
            return {
                "summary": f"Summary generation error: {str(e)}",
                "topics_learned": unique_topics,
                "struggling_topics": unique_struggles,
                "total_sessions": len(sessions)
            }
    
    def _parse_recommendations(self, content: str, topics: List[str]) -> List[Dict]:
        """Parse LLM response into structured recommendations"""
        # Simplified parsing - in production, use more robust parsing
        recommendations = []
        
        # Split by numbered items or bullet points
        lines = content.split('\n')
        current_rec = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_rec:
                    recommendations.append(current_rec)
                    current_rec = {}
                continue
            
            # Try to extract structured info
            if line.startswith(('1.', '2.', '3.', '4.', '5.', '-', '*')):
                if current_rec:
                    recommendations.append(current_rec)
                current_rec = {
                    "title": line.lstrip('0123456789.-* '),
                    "description": "",
                    "reason": "Based on your recent learning activity",
                    "estimated_time": "15-30 min",
                    "difficulty": "intermediate",
                    "resource_type": "tutorial",
                    "topics": topics[:3]
                }
        
        if current_rec:
            recommendations.append(current_rec)
        
        # Ensure we have at least some recommendations
        if not recommendations:
            recommendations = [{
                "title": "Continue Practicing",
                "description": content[:200],
                "reason": "Based on your recent learning activity",
                "estimated_time": "ongoing",
                "difficulty": "intermediate",
                "resource_type": "practice",
                "topics": topics
            }]
        
        return recommendations[:5]  # Return max 5
    
    def _mock_recommendations(self, topics: List[str]) -> List[Dict]:
        """Provide mock recommendations with diverse resource types when API is not available"""
        main_topic = topics[0] if topics else 'programming'
        
        return [
            {
                "title": f"{main_topic} Video Tutorial Series",
                "description": f"Comprehensive video series covering {main_topic} fundamentals and best practices",
                "reason": "Mock recommendation - configure GOOGLE_API_KEY for AI-powered suggestions",
                "estimated_time": "2-3 hours",
                "difficulty": "intermediate",
                "resource_type": "video",
                "topics": topics[:2]
            },
            {
                "title": f"Understanding {main_topic}: Complete Guide",
                "description": f"In-depth article explaining core concepts and practical applications of {main_topic}",
                "reason": "Mock recommendation - configure GOOGLE_API_KEY for AI-powered suggestions",
                "estimated_time": "30 min",
                "difficulty": "beginner",
                "resource_type": "article",
                "topics": topics[:2]
            },
            {
                "title": f"Official {main_topic} Documentation",
                "description": f"Reference documentation and API guides for {main_topic}",
                "reason": "Mock recommendation - configure GOOGLE_API_KEY for AI-powered suggestions",
                "estimated_time": "ongoing",
                "difficulty": "intermediate",
                "resource_type": "documentation",
                "topics": topics[:2]
            },
            {
                "title": f"Hands-on {main_topic} Tutorial",
                "description": f"Step-by-step tutorial to build a real project using {main_topic}",
                "reason": "Mock recommendation - configure GOOGLE_API_KEY for AI-powered suggestions",
                "estimated_time": "1-2 hours",
                "difficulty": "intermediate",
                "resource_type": "tutorial",
                "topics": topics[:2]
            },
            {
                "title": f"{main_topic} Practice Challenges",
                "description": f"Coding exercises and challenges to reinforce {main_topic} skills",
                "reason": "Mock recommendation - configure GOOGLE_API_KEY for AI-powered suggestions",
                "estimated_time": "ongoing",
                "difficulty": "intermediate",
                "resource_type": "practice",
                "topics": topics[:3]
            }
        ]
    
    async def generate_quiz(
        self,
        topics: List[str],
        content_summary: str,
        num_questions: int = 5
    ) -> Dict:
        """
        Generate quiz questions based on topics and content
        
        Args:
            topics: List of topics to quiz on
            content_summary: Summary of the content
            num_questions: Number of questions to generate
            
        Returns:
            Dictionary with quiz questions
        """
        if not topics:
            return {
                "questions": [],
                "message": "No topics available for quiz generation"
            }
        
        prompt = f"""Generate {num_questions} quiz questions based on the following learning content:

Topics: {', '.join(topics)}
Content Summary: {content_summary}

For each question, provide:
1. Question text
2. 4 multiple choice options (A, B, C, D)
3. Correct answer (A, B, C, or D)
4. Brief explanation

Format as JSON with this structure:
{{
  "questions": [
    {{
      "question": "Question text here",
      "options": {{
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      }},
      "correct_answer": "A",
      "explanation": "Why this answer is correct"
    }}
  ]
}}"""
        
        # Mock mode fallback
        if not self.api_key_available or not self.llm:
            return self._mock_quiz(topics, num_questions)
        
        # Check rate limit
        can_request, message = self.rate_limiter.can_make_request()
        if not can_request:
            print(f"⚠️  {message}")
            return self._mock_quiz(topics, num_questions)
        
        try:
            from langchain_core.messages import HumanMessage
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            
            # Only record if successful
            self.rate_limiter.record_request()
            
            # Parse response
            content = ""
            if isinstance(response.content, str):
                content = response.content
            elif isinstance(response.content, list):
                for block in response.content:
                    if isinstance(block, str):
                        content += block
                    elif isinstance(block, dict) and "text" in block:
                        content += str(block.get("text", ""))
            
            # Try to parse JSON from response
            import json
            import re
            
            # Extract JSON from markdown code blocks if present
            json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', content, re.DOTALL)
            if json_match:
                content = json_match.group(1)
            else:
                # Try to find JSON object in content
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    content = json_match.group(0)
            
            try:
                quiz_data = json.loads(content)
                return quiz_data
            except json.JSONDecodeError:
                # Fallback: parse manually
                return self._parse_quiz_response(content, topics, num_questions)
                
        except Exception as e:
            # Check if it's a quota/quota error
            error_str = str(e).lower()
            if "quota" in error_str or "resourceexhausted" in error_str or "429" in error_str:
                print(f"⚠️  API quota exceeded - using mock quiz")
                return self._mock_quiz(topics, num_questions)
            print(f"Error generating quiz: {e}")
            return self._mock_quiz(topics, num_questions)
    
    def _parse_quiz_response(self, content: str, topics: List[str], num_questions: int) -> Dict:
        """Parse quiz response when JSON parsing fails"""
        questions = []
        lines = content.split('\n')
        current_question = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect question
            if line.startswith(('Q', 'Question', '1.', '2.', '3.', '4.', '5.')):
                if current_question:
                    questions.append(current_question)
                current_question = {
                    "question": line.lstrip('0123456789.Q '),
                    "options": {},
                    "correct_answer": "A",
                    "explanation": ""
                }
            # Detect options
            elif line.startswith(('A)', 'A.', 'B)', 'B.', 'C)', 'C.', 'D)', 'D.')):
                option_key = line[0]
                option_text = line[2:].strip()
                if current_question:
                    current_question["options"][option_key] = option_text
            # Detect correct answer
            elif 'correct' in line.lower() or 'answer' in line.lower():
                if current_question:
                    current_question["explanation"] = line
        
        if current_question:
            questions.append(current_question)
        
        # Ensure we have at least some questions
        if not questions:
            return self._mock_quiz(topics, num_questions)
        
        return {"questions": questions[:num_questions]}
    
    def _mock_quiz(self, topics: List[str], num_questions: int) -> Dict:
        """Provide mock quiz when API is not available"""
        questions = []
        for i in range(min(num_questions, 3)):
            questions.append({
                "question": f"What is a key concept in {topics[0] if topics else 'programming'}?",
                "options": {
                    "A": "Basic syntax and structure",
                    "B": "Advanced optimization",
                    "C": "Database design",
                    "D": "UI/UX principles"
                },
                "correct_answer": "A",
                "explanation": "Understanding basic syntax is fundamental to learning any programming topic."
            })
        
        return {
            "questions": questions,
            "message": "Mock quiz - configure GOOGLE_API_KEY for AI-generated questions"
        }
    
    async def generate_documentation_suggestions(
        self,
        errors: List[Dict],
        weak_areas: List[str],
        topics: List[str],
        code_content: str
    ) -> List[Dict]:
        """
        Generate documentation suggestions based on errors and weak areas
        
        Args:
            errors: List of detected errors
            weak_areas: Areas where learner needs improvement
            topics: Topics being learned
            code_content: The code content
            
        Returns:
            List of documentation suggestions with links and descriptions
        """
        if not errors and not weak_areas:
            return []
        
        prompt = f"""Based on the following code analysis, generate specific documentation suggestions:

Errors Found: {len(errors)}
{chr(10).join([f"- {e.get('type', 'Unknown')}: {e.get('description', '')}" for e in errors[:5]])}

Weak Areas: {', '.join(weak_areas[:5])}
Topics: {', '.join(topics[:5])}

For each error or weak area, provide:
1. Title of the documentation/resource
2. URL or resource identifier (MDN, official docs, Stack Overflow, etc.)
3. Brief description of why this resource helps
4. Specific section or topic to focus on
5. Difficulty level (beginner/intermediate/advanced)

Format as a clear list of 3-5 most relevant documentation resources."""
        
        # Mock mode fallback
        if not self.api_key_available or not self.llm:
            return self._mock_documentation_suggestions(errors, weak_areas, topics)
        
        # Check rate limit
        can_request, message = self.rate_limiter.can_make_request()
        if not can_request:
            print(f"⚠️  {message}")
            return self._mock_documentation_suggestions(errors, weak_areas, topics)
        
        try:
            from langchain_core.messages import HumanMessage
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            
            # Only record if successful
            self.rate_limiter.record_request()
            
            content = ""
            if isinstance(response.content, str):
                content = response.content
            elif isinstance(response.content, list):
                for block in response.content:
                    if isinstance(block, str):
                        content += block
                    elif isinstance(block, dict) and "text" in block:
                        content += str(block.get("text", ""))
            
            return self._parse_documentation_suggestions(content, errors, weak_areas, topics)
        except Exception as e:
            # Check if it's a quota/quota error
            error_str = str(e).lower()
            if "quota" in error_str or "resourceexhausted" in error_str or "429" in error_str:
                print(f"⚠️  API quota exceeded - using mock documentation suggestions")
                return self._mock_documentation_suggestions(errors, weak_areas, topics)
            print(f"Error generating documentation suggestions: {e}")
            return self._mock_documentation_suggestions(errors, weak_areas, topics)
    
    def _parse_documentation_suggestions(
        self,
        content: str,
        errors: List[Dict],
        weak_areas: List[str],
        topics: List[str]
    ) -> List[Dict]:
        """Parse documentation suggestions from LLM response"""
        suggestions = []
        lines = content.split('\n')
        current_suggestion = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_suggestion:
                    suggestions.append(current_suggestion)
                    current_suggestion = {}
                continue
            
            # Detect new suggestion
            if line.startswith(('1.', '2.', '3.', '4.', '5.', '-', '*')):
                if current_suggestion:
                    suggestions.append(current_suggestion)
                
                # Extract title
                title = line.lstrip('0123456789.-* ').split(' - ')[0]
                current_suggestion = {
                    "title": title,
                    "url": "",
                    "description": "",
                    "focus_area": weak_areas[0] if weak_areas else topics[0] if topics else "General",
                    "difficulty": "intermediate",
                    "resource_type": "documentation"
                }
            
            # Extract URL
            if 'http' in line.lower() or 'mdn' in line.lower() or 'docs' in line.lower():
                import re
                url_match = re.search(r'https?://[^\s]+', line)
                if url_match:
                    current_suggestion["url"] = url_match.group(0)
            
            # Extract description
            if current_suggestion and not current_suggestion.get("description"):
                if len(line) > 20 and not line.startswith(('http', 'www')):
                    current_suggestion["description"] = line[:200]
        
        if current_suggestion:
            suggestions.append(current_suggestion)
        
        # Ensure we have suggestions
        if not suggestions:
            return self._mock_documentation_suggestions(errors, weak_areas, topics)
        
        return suggestions[:5]  # Return max 5
    
    def _mock_documentation_suggestions(
        self,
        errors: List[Dict],
        weak_areas: List[str],
        topics: List[str]
    ) -> List[Dict]:
        """Provide mock documentation suggestions"""
        suggestions = []
        
        # Generate suggestions based on topics
        topic_docs = {
            "Python": {"url": "https://docs.python.org/3/", "title": "Python Official Documentation"},
            "JavaScript": {"url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "title": "MDN JavaScript Guide"},
            "React": {"url": "https://react.dev/", "title": "React Official Documentation"},
            "TypeScript": {"url": "https://www.typescriptlang.org/docs/", "title": "TypeScript Handbook"},
        }
        
        for topic in topics[:3]:
            if topic in topic_docs:
                suggestions.append({
                    "title": topic_docs[topic]["title"],
                    "url": topic_docs[topic]["url"],
                    "description": f"Official documentation for {topic}",
                    "focus_area": topic,
                    "difficulty": "intermediate",
                    "resource_type": "documentation"
                })
        
        if not suggestions:
            suggestions.append({
                "title": "General Programming Documentation",
                "url": "https://developer.mozilla.org/",
                "description": "Comprehensive web development documentation",
                "focus_area": topics[0] if topics else "Programming",
                "difficulty": "intermediate",
                "resource_type": "documentation"
            })
        
        return suggestions

# Lazy singleton - only initialize when first accessed
_ai_agent_instance = None

def get_ai_agent():
    global _ai_agent_instance
    if _ai_agent_instance is None:
        _ai_agent_instance = AIAgent()
    return _ai_agent_instance

# For backwards compatibility
ai_agent = None  # Will be set on first import by routes
