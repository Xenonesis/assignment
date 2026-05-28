CREATE TABLE IF NOT EXISTS insights (
  id BIGSERIAL PRIMARY KEY,
  end_year INT,
  intensity INT,
  sector TEXT,
  topic TEXT,
  insight TEXT,
  url TEXT,
  region TEXT,
  start_year INT,
  impact TEXT,
  added TIMESTAMP,
  published TIMESTAMP,
  country TEXT,
  relevance INT,
  pestle TEXT,
  source TEXT,
  title TEXT,
  likelihood INT,
  city TEXT,
  swot TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_country ON insights(country);
CREATE INDEX IF NOT EXISTS idx_topic ON insights(topic);
CREATE INDEX IF NOT EXISTS idx_region ON insights(region);
CREATE INDEX IF NOT EXISTS idx_sector ON insights(sector);
CREATE INDEX IF NOT EXISTS idx_end_year ON insights(end_year);
CREATE INDEX IF NOT EXISTS idx_pestle ON insights(pestle);
CREATE INDEX IF NOT EXISTS idx_source ON insights(source);
CREATE INDEX IF NOT EXISTS idx_city ON insights(city);
CREATE INDEX IF NOT EXISTS idx_swot ON insights(swot);
CREATE INDEX IF NOT EXISTS idx_published ON insights(published);

-- Enable realtime on insights
ALTER PUBLICATION supabase_realtime ADD TABLE insights;

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preferences JSONB NOT NULL DEFAULT '{}',
  schema_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
