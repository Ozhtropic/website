create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  source_path text not null,
  chunk_index integer not null,
  title text,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536) not null,
  created_at timestamptz not null default now(),
  unique (source_path, chunk_index)
);

create index if not exists knowledge_documents_embedding_idx
  on knowledge_documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_key text not null,
  channel text not null,
  role text not null,
  content text not null,
  language text not null default 'en',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_idx on chat_messages (session_id, created_at desc);
create index if not exists chat_messages_user_idx on chat_messages (user_key, created_at desc);

create table if not exists chat_memory_facts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_key text not null,
  language text not null default 'en',
  source text not null,
  fact text not null,
  fingerprint text not null unique,
  weight numeric not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_memory_facts_user_idx on chat_memory_facts (user_key, updated_at desc);

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists chat_memory_facts_updated_at on chat_memory_facts;
create trigger chat_memory_facts_updated_at
before update on chat_memory_facts
for each row
execute function public.update_updated_at_column();

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  user_key text,
  source_channel text not null,
  language text not null default 'en',
  full_name text not null,
  email text,
  phone text,
  company text,
  interest text not null,
  preferred_contact_method text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_email_idx on leads (email);

create table if not exists registration_statuses (
  id uuid primary key default gen_random_uuid(),
  reference_code text unique,
  full_name text,
  email text,
  phone text,
  status text not null,
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists registration_statuses_updated_at on registration_statuses;
create trigger registration_statuses_updated_at
before update on registration_statuses
for each row
execute function public.update_updated_at_column();

create or replace function match_knowledge_documents(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  source_path text,
  chunk_index integer,
  title text,
  content text,
  metadata jsonb,
  similarity float
)
language sql
stable
as $$
  select
    knowledge_documents.id,
    knowledge_documents.source_path,
    knowledge_documents.chunk_index,
    knowledge_documents.title,
    knowledge_documents.content,
    knowledge_documents.metadata,
    1 - (knowledge_documents.embedding <=> query_embedding) as similarity
  from knowledge_documents
  order by knowledge_documents.embedding <=> query_embedding
  limit match_count;
$$;
