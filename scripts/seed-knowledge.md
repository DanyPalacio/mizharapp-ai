# Knowledge Base — Ingesta
La base RAG está lista en Supabase (pgvector + knowledge_sources/knowledge_chunks + match_knowledge()).

## Para indexar los 50 artículos de venture FAQ:
1. Coloca los artículos (MD/TXT) en una carpeta.
2. Por cada artículo: trocear en chunks de 512-1024 tokens, generar embedding con
   OpenAI `text-embedding-3-large` (1536 dims), e insertar en knowledge_chunks.
3. Las fuentes externas (McKinsey, BCG, MIT, arXiv, SSRN) requieren scraping con
   respeto a robots.txt — solo indexación semántica, nunca republicar contenido.

El endpoint de análisis (/api/venture/analyze) ya puede consumir match_knowledge()
cuando la base esté poblada — agregar la consulta RAG es 1 query + inyección al prompt.
