-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL,
    goal TEXT NOT NULL,
    backstory TEXT,
    allow_delegation BOOLEAN DEFAULT false,
    verbose BOOLEAN DEFAULT false,
    memory JSONB,
    llm TEXT DEFAULT 'gpt-4',
    tools JSONB[],
    human_input BOOLEAN DEFAULT false,
    max_iterations INTEGER,
    max_rpm INTEGER,
    temperature FLOAT,
    is_hierarchical BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    agent_role TEXT,
    expected_output TEXT,
    tools JSONB[],
    async_execution BOOLEAN DEFAULT false,
    output_file TEXT,
    context JSONB,
    human_validation BOOLEAN DEFAULT false,
    dependencies TEXT[],
    priority INTEGER DEFAULT 0,
    is_hierarchical BOOLEAN DEFAULT false,
    subtasks JSONB[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create crews table
CREATE TABLE IF NOT EXISTS crews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agents JSONB[],
    tasks JSONB[],
    process TEXT,
    verbose BOOLEAN DEFAULT false,
    max_rpm INTEGER,
    temperature FLOAT,
    cache BOOLEAN DEFAULT true,
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crews_updated_at
    BEFORE UPDATE ON crews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
