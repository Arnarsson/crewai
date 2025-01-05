# Configuration Guide

## Environment Variables

### API Keys
```env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```
Required for model access. Obtain from [OpenAI](https://platform.openai.com) and [Anthropic](https://console.anthropic.com).

### Model Configuration
```env
NEXT_PUBLIC_DEFAULT_MODEL=gpt-4-turbo
NEXT_PUBLIC_ENABLE_HUMAN_VALIDATION=true
```
- `NEXT_PUBLIC_DEFAULT_MODEL`: Default model for agents without specific model assignment
- `NEXT_PUBLIC_ENABLE_HUMAN_VALIDATION`: Enable human validation for task results

### CrewAI Configuration
```env
NEXT_PUBLIC_CREWAI_PROCESS=sequential
NEXT_PUBLIC_MAX_RETRIES=3
NEXT_PUBLIC_RETRY_DELAY=1000
NEXT_PUBLIC_TOOL_TIMEOUT=30000
```
- `NEXT_PUBLIC_CREWAI_PROCESS`: Task execution process ('sequential', 'hierarchical', 'parallel')
- `NEXT_PUBLIC_MAX_RETRIES`: Maximum retry attempts for failed operations
- `NEXT_PUBLIC_RETRY_DELAY`: Initial delay between retries in milliseconds
- `NEXT_PUBLIC_TOOL_TIMEOUT`: Tool execution timeout in milliseconds

### Memory Configuration
```env
NEXT_PUBLIC_MEMORY_PATH=./memory
NEXT_PUBLIC_SHORT_TERM_TTL=3600
NEXT_PUBLIC_LONG_TERM_MAX_SIZE=1GB
```
- `NEXT_PUBLIC_MEMORY_PATH`: Path for storing agent memory files
- `NEXT_PUBLIC_SHORT_TERM_TTL`: Short-term memory TTL in seconds
- `NEXT_PUBLIC_LONG_TERM_MAX_SIZE`: Maximum size for long-term memory storage

### Rate Limiting
```env
NEXT_PUBLIC_RATE_LIMIT_MAX_REQUESTS=100
NEXT_PUBLIC_RATE_LIMIT_WINDOW=60
```
- `NEXT_PUBLIC_RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window
- `NEXT_PUBLIC_RATE_LIMIT_WINDOW`: Time window in seconds

### Logging
```env
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_ENABLE_DEBUG=false
```
- `NEXT_PUBLIC_LOG_LEVEL`: Logging level ('debug', 'info', 'warn', 'error')
- `NEXT_PUBLIC_ENABLE_DEBUG`: Enable debug logging

## Tool Configuration

### Default Tool Settings
```typescript
const TOOL_DEFAULTS = {
  timeout: 30000,
  retries: 3,
  rateLimiting: {
    maxRequests: 100,
    perSeconds: 60,
  }
};
```

### Memory Configuration
```typescript
const MEMORY_CONFIG = {
  shortTerm: {
    maxItems: 100,
    ttl: 3600,
  },
  longTerm: {
    storage: 'file',
    basePath: './memory',
    maxSize: '1GB',
  }
};
```

## Error Handling

### Error Types
- `MISSING_API_KEY`: API key not found in environment
- `EXECUTION_ERROR`: Task execution failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `TIMEOUT`: Operation timed out

### Retry Strategy
- Exponential backoff with configurable initial delay
- Maximum retry attempts configurable
- Detailed error logging with context

## Logging

### Log Levels
- `debug`: Detailed debugging information
- `info`: General operational information
- `warn`: Warning messages for potential issues
- `error`: Error messages for failed operations

### Log Format
```typescript
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}
```

### Monitoring
- Task execution metrics
- Model usage tracking
- Error rate monitoring
- Performance metrics 