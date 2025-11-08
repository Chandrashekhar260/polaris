"""
Upload Route - Handle file uploads (PDF, code files, etc.)
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import uuid
from datetime import datetime

from services.ai_agent import get_ai_agent
from services.vector_store import get_vector_store
from utils.text_cleaner import clean_text, clean_code

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload and analyze a file (PDF, code file, etc.)
    
    Supports:
    - PDF files (.pdf)
    - Code files (.py, .js, .ts, .jsx, .tsx, .java, .cpp, .go, .rs, etc.)
    - Text files (.txt, .md)
    """
    try:
        # Read file content
        content = await file.read()
        filename = file.filename or "unknown"
        file_extension = filename.split('.')[-1].lower() if '.' in filename else ""
        
        # Process based on file type
        if file_extension == "pdf":
            # Process PDF
            text_content = process_pdf(content)
        elif file_extension in ["py", "js", "ts", "jsx", "tsx", "java", "cpp", "go", "rs", "html", "css", "sql", "txt", "md"]:
            # Process code/text file
            try:
                text_content = content.decode('utf-8')
            except UnicodeDecodeError:
                # Try other encodings
                try:
                    text_content = content.decode('latin-1')
                except:
                    raise HTTPException(status_code=400, detail="Unable to decode file content")
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_extension}")
        
        # Clean text content
        cleaned_content = clean_text(text_content)
        
        if not cleaned_content or len(cleaned_content.strip()) < 10:
            raise HTTPException(status_code=400, detail="File content is too short or empty")
        
        # Analyze with AI
        ai_agent = get_ai_agent()
        analysis = await ai_agent.analyze_code(
            code_content=cleaned_content,
            filename=filename,
            filepath=filename
        )
        
        # Generate session ID
        session_id = str(uuid.uuid4())
        
        # Store in vector database
        vector_store = get_vector_store()
        await vector_store.store_session(
            session_id=session_id,
            code_content=cleaned_content,
            analysis=analysis
        )
        
        # Generate recommendations if there are struggles
        recommendations = []
        if analysis.get("potential_struggles") or analysis.get("topics"):
            recommendations = await ai_agent.generate_recommendations(
                topics=analysis.get("topics", []),
                struggles=analysis.get("potential_struggles", []),
                recent_code_summary=analysis.get("summary", "")
            )
            
            # Store recommendations
            for i, rec in enumerate(recommendations):
                rec_id = f"{session_id}-rec-{i}"
                await vector_store.store_recommendation(rec_id, rec)
        
        # Generate quiz if there are topics
        quiz = None
        if analysis.get("topics"):
            try:
                quiz = await ai_agent.generate_quiz(
                    topics=analysis.get("topics", []),
                    content_summary=analysis.get("summary", ""),
                    num_questions=5
                )
            except Exception as e:
                print(f"Error generating quiz: {e}")
                quiz = None
        
        return JSONResponse({
            "success": True,
            "session_id": session_id,
            "filename": filename,
            "file_type": file_extension,
            "analysis": analysis,
            "recommendations": recommendations,
            "quiz": quiz,
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


def process_pdf(content: bytes) -> str:
    """
    Extract text from PDF content
    
    Args:
        content: PDF file bytes
        
    Returns:
        Extracted text content
    """
    try:
        # Try using pypdf first
        from pypdf import PdfReader
        import io
        
        pdf_file = io.BytesIO(content)
        reader = PdfReader(pdf_file)
        
        text_parts = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        
        if text_parts:
            return "\n\n".join(text_parts)
        
        # Fallback to pdfplumber if pypdf fails
        try:
            import pdfplumber
            
            pdf_file = io.BytesIO(content)
            with pdfplumber.open(pdf_file) as pdf:
                text_parts = []
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        text_parts.append(text)
                
                if text_parts:
                    return "\n\n".join(text_parts)
        except ImportError:
            pass
        
        raise ValueError("Unable to extract text from PDF")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")

