import os
from typing import Dict, TypedDict
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langgraph.graph import StateGraph, END
from dotenv import load_dotenv

load_dotenv()

# --- Config ---
CHROMA_PATH = "chroma_db"
# Use the same embedding model as ingestion
EMBEDDING_MODEL = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

# --- State ---
class GraphState(TypedDict):
    question: str
    context: str
    answer: str

# --- Nodes ---
def retrieve(state: GraphState):
    print("---RETRIEVE---")
    question = state["question"]
    try:
        # Initialize Chroma with the Google embeddings
        db = Chroma(persist_directory=CHROMA_PATH, embedding_function=EMBEDDING_MODEL)
        retriever = db.as_retriever()
        # Use invoke instead of get_relevant_documents
        documents = retriever.invoke(question)
        context = "\n\n".join([doc.page_content for doc in documents])
        print(f"Retrieved {len(documents)} context documents.")
        return {"context": context}
    except Exception as e:
        print(f"Error in retrieve: {str(e)}")
        raise e

def generate(state: GraphState):
    print("---GENERATE---")
    question = state["question"]
    context = state["context"]

    if not context:
        return {"answer": "I couldn't find any relevant information in the training data to answer your question."}

    # RAG Prompt
    template = """You are a helpful AI agent. Answer the question based ONLY on the following context.
    
    Context:
    {context}

    Question: {question}
    """
    prompt = ChatPromptTemplate.from_template(template)
    
    # Use Gemini 2.5 Flash
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    
    try:
        chain = prompt | llm | StrOutputParser()
        answer = chain.invoke({"context": context, "question": question})
    except Exception as e:
        answer = f"Error generating answer: {str(e)}"
        
    return {"answer": answer}

# --- Graph ---
workflow = StateGraph(GraphState)

workflow.add_node("retrieve", retrieve)
workflow.add_node("generate", generate)

workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

app_graph = workflow.compile()
