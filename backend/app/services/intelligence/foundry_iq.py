from typing import List, Dict, Any
import logging
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings  # type: ignore
from langchain_core.documents import Document
from app.core.config import settings

logger = logging.getLogger(__name__)

class FoundryIQService:
    """
    Simulates Microsoft Foundry IQ capabilities: Indexing, Retrieval, and Grounded Answers.
    Powered by Google Gemini Embeddings.
    """
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GEMINI_API_KEY
        )
        self.vector_store = None
        
    def index_documents(self, documents: List[Dict[str, str]]):
        """
        Processes and indexes certification documents.
        """
        logger.info(f"Indexing {len(documents)} documents into Foundry IQ...")
        docs = [Document(page_content=d["content"], metadata=d["metadata"]) for d in documents]
        if not self.vector_store:
            self.vector_store = FAISS.from_documents(docs, self.embeddings)
        else:
            self.vector_store.add_documents(docs)
        logger.info("Indexing complete.")

    def retrieve_grounded_answer(self, query: str) -> Dict[str, Any]:
        """
        Retrieves relevant context and generates an answer with citations.
        """
        if not self.vector_store:
            return {"answer": "No knowledge base indexed.", "citations": []}

        # 1. Retrieval
        related_docs = self.vector_store.similarity_search(query, k=3)
        
        # 2. Context Construction
        context = "\n\n".join([f"[Source: {d.metadata['source']}] {d.page_content}" for d in related_docs])
        
        # 3. Citation Mapping
        citations = [d.metadata for d in related_docs]
        
        return {
            "query": query,
            "context": context,
            "citations": citations
        }

foundry_iq = FoundryIQService()
