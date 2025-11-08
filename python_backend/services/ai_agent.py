"""
AI Agent Service - Gemini Integration
Handles code analysis, topic extraction, and learning insights
"""
import os
from typing import Dict, List, Optional
from pydantic import BaseModel

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

class AIAgent:
    """AI Agent using Gemini for code analysis"""
    
    def __init__(self):
        """Initialize Gemini model"""
        api_key = os.getenv("GOOGLE_API_KEY")
        self.api_key_available = bool(api_key)
        
        if self.api_key_available:
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-2.0-flash-exp",
                    temperature=0.3
                )
                # Structured output LLM for analysis
                self.structured_llm = self.llm.with_structured_output(LearningAnalysis)
            except Exception as e:
                print(f"Warning: Failed to initialize Gemini: {e}")
                self.api_key_available = False
        
        if not self.api_key_available:
            print("⚠️  Running in mock mode - GOOGLE_API_KEY not configured")
            self.llm = None
            self.structured_llm = None
    
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
        
        try:
            # Get structured analysis
            analysis = self.structured_llm.invoke([system_prompt, user_prompt])
            
            # Type guard - ensure analysis is LearningAnalysis
            if isinstance(analysis, dict):
                return {
                    "filename": filename,
                    "filepath": filepath,
                    "topics": analysis.get("topics", []),
                    "difficulty": analysis.get("difficulty", "intermediate"),
                    "concepts": analysis.get("concepts", []),
                    "potential_struggles": analysis.get("potential_struggles", []),
                    "summary": analysis.get("summary", "")
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
                    "summary": analysis.summary
                }
        except Exception as e:
            # Fallback to mock analysis
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
            "summary": f"Working on {filename} - {len(code_content)} characters of code"
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
        prompt = f"""Based on a learner's recent activity:

Topics: {', '.join(topics)}
Potential Struggles: {', '.join(struggles)}
Recent Work: {recent_code_summary}

Generate 3-5 specific, actionable learning recommendations. For each recommendation:
1. Title of the resource/tutorial
2. Brief description
3. Why it's relevant to their learning
4. Estimated time to complete
5. Difficulty level (beginner/intermediate/advanced)
6. Resource type (tutorial/documentation/video/article)

Format as a clear list."""
        
        # Mock mode fallback
        if not self.api_key_available or not self.llm:
            return self._mock_recommendations(topics)
        
        try:
            from langchain_core.messages import HumanMessage
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            
            # Parse response into structured recommendations
            content = ""
            if isinstance(response.content, str):
                content = response.content
            elif isinstance(response.content, list):
                # Extract text from list of content blocks
                for block in response.content:
                    if isinstance(block, str):
                        content += block
                    elif isinstance(block, dict) and "text" in block:
                        content += str(block.get("text", ""))
            
            return self._parse_recommendations(content, topics)
        except Exception as e:
            return [{
                "title": "Continue Learning",
                "description": "Keep practicing and building projects",
                "reason": f"Error generating recommendations: {str(e)}",
                "estimated_time": "ongoing",
                "difficulty": "intermediate",
                "resource_type": "practice"
            }]
    
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
        
        try:
            from langchain_core.messages import HumanMessage
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            
            return {
                "summary": response.content,
                "topics_learned": unique_topics[:10],  # Top 10
                "struggling_topics": unique_struggles[:5],  # Top 5
                "total_sessions": len(sessions)
            }
        except Exception as e:
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
        """Provide mock recommendations when API is not available"""
        return [{
            "title": f"Learn more about {topics[0] if topics else 'programming'}",
            "description": "Continue practicing and exploring this topic to build mastery",
            "reason": "Mock recommendation - configure GOOGLE_API_KEY for AI-powered suggestions",
            "estimated_time": "ongoing",
            "difficulty": "intermediate",
            "resource_type": "tutorial",
            "topics": topics[:3]
        }]

# Lazy singleton - only initialize when first accessed
_ai_agent_instance = None

def get_ai_agent():
    global _ai_agent_instance
    if _ai_agent_instance is None:
        _ai_agent_instance = AIAgent()
    return _ai_agent_instance

# For backwards compatibility
ai_agent = None  # Will be set on first import by routes
