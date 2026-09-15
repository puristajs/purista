CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge_documents (
  tenant_id text NOT NULL,
  collection_id text NOT NULL,
  document_id text NOT NULL,
  revision integer NOT NULL CHECK (revision > 0),
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'withdrawn')),
  embedding_model text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, collection_id, document_id)
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  tenant_id text NOT NULL,
  collection_id text NOT NULL,
  document_id text NOT NULL,
  revision integer NOT NULL CHECK (revision > 0),
  chunk_index integer NOT NULL CHECK (chunk_index >= 0),
  content text NOT NULL,
  embedding_model text NOT NULL,
  embedding vector(4) NOT NULL,
  PRIMARY KEY (tenant_id, collection_id, document_id, chunk_index),
  FOREIGN KEY (tenant_id, collection_id, document_id)
    REFERENCES knowledge_documents (tenant_id, collection_id, document_id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS knowledge_chunks_scope_idx
  ON knowledge_chunks (tenant_id, collection_id, embedding_model);
