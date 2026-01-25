-- sessions
create table if not exists sessions (
  id uuid primary key,
  created_at timestamptz not null default now()
);

-- analyses
create table if not exists analyses (
  id uuid primary key,
  session_id uuid not null references sessions(id) on delete cascade,

  status text not null default 'queued',          -- queued|running|done|error
  language text not null default 'auto',

  review_count int not null default 0,
  input_char_count int not null default 0,

  created_at timestamptz not null default now(),
  started_at timestamptz null,
  completed_at timestamptz null,

  duration_ms int null,
  error_message text null
);

create index if not exists idx_analyses_session_created
  on analyses(session_id, created_at desc);

-- review_items
create table if not exists review_items (
  id uuid primary key,
  analysis_id uuid not null references analyses(id) on delete cascade,

  text_original text not null,
  text_sanitized text not null,

  sentiment_label text null,        -- pos|neu|neg
  sentiment_score double precision null
);

create index if not exists idx_review_items_analysis
  on review_items(analysis_id);

-- analysis_module_runs
create table if not exists analysis_module_runs (
  id uuid primary key,
  analysis_id uuid not null references analyses(id) on delete cascade,

  module text not null,             -- sentiment|insights|objections
  status text not null default 'queued',
  model_version text null,

  created_at timestamptz not null default now(),
  started_at timestamptz null,
  completed_at timestamptz null,
  duration_ms int null,
  error_message text null
);

create index if not exists idx_module_runs_analysis_module
  on analysis_module_runs(analysis_id, module);

-- analysis_results
create table if not exists analysis_results (
  analysis_id uuid primary key references analyses(id) on delete cascade,
  result_schema_version int not null default 1,

  sentiment_summary jsonb null,
  insights jsonb null,
  objections jsonb null,

  created_at timestamptz not null default now()
);
