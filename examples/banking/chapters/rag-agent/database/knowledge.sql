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

INSERT INTO knowledge_documents (
  tenant_id, collection_id, document_id, revision, title, status, embedding_model
) VALUES
  ('tenant-example', 'customer-help', 'transfer-guide', 1,
   'International transfer timing', 'active', 'demo-embedding-v1'),
  ('tenant-example', 'customer-help', 'card-guide', 1,
   'Missing card help', 'active', 'demo-embedding-v1')
ON CONFLICT DO NOTHING;

INSERT INTO knowledge_chunks (
  tenant_id, collection_id, document_id, revision, chunk_index, content, embedding_model, embedding
) VALUES
  ('tenant-example', 'customer-help', 'transfer-guide', 1, 0,
   'International transfers can remain pending for two business days.',
   'demo-embedding-v1',
   '[0.543315,0.524057,0.459971,0.467547]'),
  ('tenant-example', 'customer-help', 'card-guide', 1, 0,
   'A missing card can be frozen immediately after identity verification.',
   'demo-embedding-v1',
   '[0.507582,0.481218,0.482127,0.527582]')
ON CONFLICT DO NOTHING;
