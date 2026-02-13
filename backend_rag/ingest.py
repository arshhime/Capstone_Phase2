import json
import os
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

DATA_PATH = "../qa_training_data.json"
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
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    documents = []
    for item in data:
        context = item.get("context", "")
        if context:
            doc = Document(page_content=context, metadata={"source": "qa_training_data"})
            documents.append(doc)

    print(f"Creating embeddings for {len(documents)} documents using Google Gemini...")
    # Use the appropriate model for embeddings, e.g., "models/embedding-001"
    embedding_function = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
    
    db = Chroma.from_documents(
        documents=documents,
        embedding=embedding_function,
        persist_directory=CHROMA_PATH
    )
    print("Ingestion complete!")

if __name__ == "__main__":
    ingest()
