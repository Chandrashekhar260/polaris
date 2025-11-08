"""
Text Cleaning Utilities
"""
import re

def clean_code(code: str) -> str:
    """
    Clean code content for processing
    
    Args:
        code: Raw code string
        
    Returns:
        Cleaned code string
    """
    # Remove excessive whitespace
    code = re.sub(r'\n\s*\n\s*\n', '\n\n', code)
    
    # Limit line length for very long lines
    lines = code.split('\n')
    cleaned_lines = []
    for line in lines:
        if len(line) > 200:
            cleaned_lines.append(line[:200] + '...')
        else:
            cleaned_lines.append(line)
    
    return '\n'.join(cleaned_lines)

def extract_filename_info(filepath: str) -> dict:
    """
    Extract information from file path
    
    Args:
        filepath: Full file path
        
    Returns:
        Dictionary with filename, extension, directory
    """
    parts = filepath.split('/')
    filename = parts[-1] if parts else filepath
    
    # Get extension
    ext_parts = filename.split('.')
    extension = ext_parts[-1] if len(ext_parts) > 1 else ""
    
    # Get directory
    directory = '/'.join(parts[:-1]) if len(parts) > 1 else ""
    
    return {
        "filename": filename,
        "extension": extension,
        "directory": directory,
        "full_path": filepath
    }
