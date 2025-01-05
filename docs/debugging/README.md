# Debugging Guide

## Logging System

### Log Levels
```typescript
{
  ERROR: 0,   // Application errors
  WARN: 1,    // Warning conditions
  INFO: 2,    // General information
  DEBUG: 3,   // Detailed debugging
  TRACE: 4    // Very detailed debugging
}
```

### Log Categories

#### 1. Build Logs
- Location: `/logs/build/`
- Format: `YYYY-MM-DD-build.log`
- Purpose: Track build process, errors, and performance
```typescript
interface BuildLog {
  timestamp: string;
  level: LogLevel;
  phase: 'prebuild' | 'build' | 'postbuild';
  duration: number;
  memory: {
    heapUsed: number;
    heapTotal: number;
  };
  errors?: BuildError[];
  warnings?: BuildWarning[];
}
```

#### 2. Runtime Logs
- Location: `/logs/runtime/`
- Format: `YYYY-MM-DD-HH-runtime.log`
- Purpose: Application runtime behavior
```typescript
interface RuntimeLog {
  timestamp: string;
  level: LogLevel;
  context: {
    component?: string;
    function?: string;
    userId?: string;
  };
  message: string;
  metadata?: Record<string, any>;
}
```

#### 3. Performance Logs
- Location: `/logs/performance/`
- Format: `YYYY-MM-DD-performance.log`
- Purpose: Track performance metrics
```typescript
interface PerformanceLog {
  timestamp: string;
  metric: 'FCP' | 'LCP' | 'CLS' | 'FID';
  value: number;
  path: string;
  deviceType: 'mobile' | 'desktop';
}
```

### Common Issues and Solutions

#### 1. Build Failures
```typescript
// Common Build Error Patterns
interface BuildError {
  code: string;
  message: string;
  file?: string;
  line?: number;
  solution: string;
}

const commonBuildErrors = {
  'TS2307': {
    description: 'Cannot find module or its corresponding type declarations',
    solution: 'Check import path and install missing dependencies'
  },
  // Add more common errors
};
```

#### 2. Runtime Issues
```typescript
// Runtime Error Handling
interface RuntimeError {
  type: string;
  context: string;
  stackTrace: string;
  recommendation: string;
}

const commonRuntimeErrors = {
  'NEXT_NOT_FOUND': {
    description: 'Page not found in Next.js routes',
    solution: 'Verify route configuration and file structure'
  },
  // Add more common errors
};
```

### Debugging Tools

#### 1. Development Tools
```bash
# Performance monitoring
npm run analyze

# Type checking
npm run type-check

# Lint specific paths
npm run lint -- --fix --dir src/features/
```

#### 2. Browser DevTools
- React DevTools for component inspection
- Network tab for API calls
- Performance tab for runtime metrics
- Application tab for storage inspection

### Logging Best Practices

1. **Structured Logging**
```typescript
// Good
logger.info({
  action: 'crew_creation',
  crewId: crew.id,
  agentCount: crew.agents.length
});

// Avoid
logger.info(`Created crew ${crew.id} with ${crew.agents.length} agents`);
```

2. **Error Handling**
```typescript
try {
  await createCrew(crewData);
} catch (error) {
  logger.error({
    action: 'crew_creation_failed',
    error: error.message,
    data: crewData,
    stack: error.stack
  });
  throw error;
}
```

3. **Performance Monitoring**
```typescript
const startTime = performance.now();
try {
  await operation();
} finally {
  logger.debug({
    action: 'operation_duration',
    duration: performance.now() - startTime
  });
}
```

### Automated Error Detection

1. **Error Patterns**
```typescript
interface ErrorPattern {
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high';
  action: 'ignore' | 'warn' | 'alert';
}

const errorPatterns: ErrorPattern[] = [
  {
    pattern: /Memory.*exceeded/i,
    severity: 'high',
    action: 'alert'
  },
  // Add more patterns
];
```

2. **Automated Responses**
```typescript
interface AutomatedResponse {
  condition: (log: any) => boolean;
  action: () => Promise<void>;
}

const automatedResponses: AutomatedResponse[] = [
  {
    condition: (log) => log.memory.heapUsed > threshold,
    action: async () => {
      // Implement memory cleanup
    }
  },
  // Add more responses
];
```

## Monitoring Dashboard

### Metrics to Track
1. Build Performance
   - Build time
   - Bundle size
   - Chunk count
   - Memory usage

2. Runtime Performance
   - Page load time
   - Time to interactive
   - Memory usage
   - API response times

3. Error Rates
   - Build errors
   - Runtime errors
   - API errors
   - UI errors

### Alert Thresholds
```typescript
const alertThresholds = {
  build: {
    duration: 120000, // 2 minutes
    memoryUsage: 1024 * 1024 * 1024, // 1GB
    errorCount: 5
  },
  runtime: {
    pageLoad: 3000, // 3 seconds
    apiResponse: 1000, // 1 second
    errorRate: 0.01 // 1%
  }
};
``` 