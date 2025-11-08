"""
Vector Store Service - ChromaDB Integration
Handles storage and retrieval of code embeddings
"""
import os
from typing import List, Dict, Optional
import chromadb
from chromadb.config import Settings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from datetime import datetime

class VectorStore:
    """ChromaDB vector store for learning sessions"""
    
    def __init__(self):
        """Initialize ChromaDB and embedding function"""
        # Create persistent ChromaDB client
        db_path = os.getenv("CHROMA_DB_PATH", "./db/chroma_store")
        os.makedirs(db_path, exist_ok=True)
        
        self.client = chromadb.PersistentClient(path=db_path)
        
        # Initialize Gemini embeddings
        api_key = os.getenv("GOOGLE_API_KEY")
        self.api_key_available = bool(api_key)
        
        if self.api_key_available:
            try:
                self.embedding_function = GoogleGenerativeAIEmbeddings(
                    model="models/text-embedding-004"
                )
            except Exception as e:
                print(f"Warning: Failed to initialize embeddings: {e}")
                self.api_key_available = False
                self.embedding_function = None
        else:
            print("⚠️  Running vector store in mock mode - GOOGLE_API_KEY not configured")
            self.embedding_function = None
        
        # Get or create collections
        self.sessions_collection = self._get_or_create_collection("learning_sessions")
        self.recommendations_collection = self._get_or_create_collection("recommendations")
    
    def _get_or_create_collection(self, name: str):
        """Get or create a ChromaDB collection"""
        try:
            return self.client.get_collection(name=name)
        except:
            return self.client.create_collection(
                name=name,
                metadata={"hnsw:space": "cosine"}
            )
    
    async def store_session(
        self,
        session_id: str,
        code_content: str,
        analysis: Dict
    ) -> None:
        """
        Store a learning session in the vector database
        
        Args:
            session_id: Unique session identifier
            code_content: The code content
            analysis: Analysis results from AI agent
        """
        if not self.api_key_available or not self.embedding_function:
            print("⚠️  Skipping vector storage - embeddings not available")
            return
        
        # Generate embedding
        embedding = self.embedding_function.embed_query(code_content)
        
        # Prepare metadata
        metadata = {
            "filename": analysis.get("filename", ""),
            "filepath": analysis.get("filepath", ""),
            "topics": ",".join(analysis.get("topics", [])),
            "difficulty": analysis.get("difficulty", "intermediate"),
            "summary": analysis.get("summary", ""),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Store in ChromaDB
        self.sessions_collection.add(
            embeddings=[embedding],
            documents=[code_content[:1000]],  # Store first 1000 chars
            metadatas=[metadata],
            ids=[session_id]
        )
    
    async def store_recommendation(
        self,
        rec_id: str,
        recommendation: Dict
    ) -> None:
        """Store a recommendation"""
        if not self.api_key_available or not self.embedding_function:
            return
        
        # Create text representation for embedding
        rec_text = f"{recommendation['title']} {recommendation['description']}"
        embedding = self.embedding_function.embed_query(rec_text)
        
        metadata = {
            "title": recommendation["title"],
            "difficulty": recommendation.get("difficulty", "intermediate"),
            "resource_type": recommendation.get("resource_type", "article"),
            "topics": ",".join(recommendation.get("topics", [])),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.recommendations_collection.add(
            embeddings=[embedding],
            documents=[rec_text],
            metadatas=[metadata],
            ids=[rec_id]
        )
    
    def get_recent_sessions(self, limit: int = 10) -> List[Dict]:
        """Get recent learning sessions"""
        try:
            results = self.sessions_collection.get(
                limit=limit,
                include=["metadatas", "documents"]
            )
            
            sessions = []
            metadatas = results.get("metadatas", [])
            documents = results.get("documents", [])
            ids = results.get("ids", [])
            
            if metadatas:
                for i, metadata in enumerate(metadatas):
                    topics_str = metadata.get("topics", "")
                    topics = topics_str.split(",") if isinstance(topics_str, str) and topics_str else []
                    
                    sessions.append({
                        "id": ids[i] if i < len(ids) else "",
                        "filename": str(metadata.get("filename", "")),
                        "filepath": str(metadata.get("filepath", "")),
                        "topics": topics,
                        "difficulty": str(metadata.get("difficulty", "intermediate")),
                        "summary": str(metadata.get("summary", "")),
                        "timestamp": str(metadata.get("timestamp", "")),
                        "content_preview": documents[i][:200] if i < len(documents) and documents[i] else ""
                    })
            
            # Sort by timestamp (most recent first)
            sessions.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
            return sessions
        except Exception as e:
            print(f"Error fetching sessions: {e}")
            return []
    
    def get_recommendations(self, limit: int = 10) -> List[Dict]:
        """Get stored recommendations"""
        try:
            results = self.recommendations_collection.get(
                limit=limit,
                include=["metadatas"]
            )
            
            recommendations = []
            metadatas = results.get("metadatas", [])
            ids = results.get("ids", [])
            
            if metadatas:
                for i, metadata in enumerate(metadatas):
                    topics_str = metadata.get("topics", "")
                    topics = topics_str.split(",") if isinstance(topics_str, str) and topics_str else []
                    
                    recommendations.append({
                        "id": ids[i] if i < len(ids) else "",
                        "title": str(metadata.get("title", "")),
                        "difficulty": str(metadata.get("difficulty", "intermediate")),
                        "resource_type": str(metadata.get("resource_type", "article")),
                        "topics": topics,
                        "timestamp": str(metadata.get("timestamp", ""))
                    })
            
            return recommendations
        except Exception as e:
            print(f"Error fetching recommendations: {e}")
            return []
    
    def search_similar_sessions(self, query: str, limit: int = 5) -> List[Dict]:
        """Search for similar learning sessions"""
        if not self.api_key_available or not self.embedding_function:
            return []
        
        try:
            embedding = self.embedding_function.embed_query(query)
            
            results = self.sessions_collection.query(
                query_embeddings=[embedding],
                n_results=limit,
                include=["metadatas", "distances"]
            )
            
            sessions = []
            result_ids = results.get("ids", [[]])
            result_metadatas = results.get("metadatas", [[]])
            result_distances = results.get("distances", [[]])
            
            if result_ids and result_ids[0]:
                for i, session_id in enumerate(result_ids[0]):
                    if result_metadatas and len(result_metadatas[0]) > i:
                        metadata = result_metadatas[0][i]
                        topics_str = metadata.get("topics", "")
                        topics = topics_str.split(",") if isinstance(topics_str, str) and topics_str else []
                        
                        distance = result_distances[0][i] if result_distances and len(result_distances[0]) > i else 0.5
                        
                        sessions.append({
                            "id": session_id,
                            "filename": str(metadata.get("filename", "")),
                            "topics": topics,
                            "summary": str(metadata.get("summary", "")),
                            "similarity": 1 - distance  # Convert distance to similarity
                        })
            
            return sessions
        except Exception as e:
            print(f"Error searching sessions: {e}")
            return []

# Singleton instance
vector_store = VectorStore()
