import json
import os
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()


DATA_PATH = "../public/problems.json"
CHROMA_PATH = "chroma_db"

def ingest():
    if not os.path.exists(DATA_PATH):
        print(f"File not found: {DATA_PATH}")
        return

    # Check for API Key
    if not os.environ.get("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY not found in environment variables.")
        return

    print(f"Loading data from {DATA_PATH}...")
    try:
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return

    documents = []
    print(f"Processing {len(data)} problems...")
    
    for item in data:
        # Construct rich context from problem fields
        title = item.get("title", "Unknown Problem")
        difficulty = item.get("difficulty", "Unknown")
        topics = ", ".join(item.get("topics", []))
        description = item.get("description", "")
        solution = item.get("optimalSolution", "")
        
        # Create a structured document content
        page_content = f"""
Title: {title}
Difficulty: {difficulty}
Topics: {topics}
Description:
{description}

Optimal Solution:
{solution}
"""
        doc = Document(
            page_content=page_content,
            metadata={
                "source": "problems.json",
                "title": title,
                "difficulty": difficulty,
                "id": item.get("id", "") or item.get("_id", "")
            }
        )
        documents.append(doc)

    print(f"Creating embeddings for {len(documents)} documents using Google Gemini...")
    # Use the appropriate model for embeddings, e.g., "models/embedding-001"
    embedding_function = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
    

    import time

    # Ingest in smaller batches to avoid rate limits
    batch_size = 20
    total_batches = (len(documents) + batch_size - 1) // batch_size
    
    print(f"Starting ingestion of {len(documents)} documents in {total_batches} batches...")

    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        batch_num = i // batch_size + 1
        print(f"Ingesting batch {batch_num}/{total_batches} ({len(batch)} docs)...")
        
        try:
            db = Chroma.from_documents(
                documents=batch,
                embedding=embedding_function,
                persist_directory=CHROMA_PATH
            )
            # Sleep to respect rate limits
            time.sleep(2)
        except Exception as e:
            print(f"Error ingesting batch {batch_num}: {e}")
            # Optionally continue or retry
            time.sleep(5)
    
    print("Ingestion complete!")

if __name__ == "__main__":
    ingest()
