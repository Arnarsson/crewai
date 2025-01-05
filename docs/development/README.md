# Development Guide

## Project Setup

### Environment Setup
1. **Node.js and npm**
   ```bash
   # Check versions
   node --version  # Should be 18+
   npm --version   # Should be 8+
   ```

2. **Environment Variables**
   ```env
   # .env.example
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_ENVIRONMENT=development
   NEXT_PUBLIC_LOGGING_LEVEL=debug
   ```

### Development Workflow

#### 1. Branch Management
```bash
# Create feature branch
git checkout -b feature/crew-management

# Regular commits
git add .
git commit -m "feat: Add crew creation interface"

# Push changes
git push origin feature/crew-management
```

#### 2. Code Organization
```typescript
// Feature-based structure
src/
  ├── features/
  │   ├── crews/
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   ├── types/
  │   │   └── utils/
  │   └── agents/
  │       ├── components/
  │       ├── hooks/
  │       ├── types/
  │       └── utils/
  └── shared/
      ├── components/
      ├── hooks/
      ├── types/
      └── utils/
```

## Coding Standards

### 1. TypeScript Best Practices

#### Type Definitions
```typescript
// Use interfaces for objects
interface Crew {
  id: string;
  name: string;
  agents: Agent[];
  status: CrewStatus;
}

// Use type for unions
type CrewStatus = 'idle' | 'running' | 'completed' | 'failed';

// Use enums sparingly
const CrewActions = {
  CREATE: 'crew/create',
  UPDATE: 'crew/update',
  DELETE: 'crew/delete',
} as const;
```

#### Functional Components
```typescript
// Component with props interface
interface CrewCardProps {
  crew: Crew;
  onStatusChange: (status: CrewStatus) => void;
}

const CrewCard: React.FC<CrewCardProps> = ({ crew, onStatusChange }) => {
  // Implementation
};
```

### 2. Mobile-First Development

#### Responsive Design
```typescript
// Tailwind classes for responsive design
const Layout = {
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  card: 'rounded-lg shadow-sm hover:shadow-md transition-all duration-200',
};

// Media query hooks
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    // Add listener...
  }, [query]);
  return matches;
};
```

#### Touch Interactions
```typescript
// Touch event handling
const TouchableArea: React.FC = () => {
  const handleTouchStart = (e: React.TouchEvent) => {
    // Handle touch start
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Handle touch move
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="touch-none"
    >
      {/* Content */}
    </div>
  );
};
```

### 3. Performance Optimization

#### Code Splitting
```typescript
// Dynamic imports
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// Route-based code splitting
export const CrewDashboard = dynamic(() => 
  import('@/features/crews/CrewDashboard')
);
```

#### Memoization
```typescript
// Memoize expensive calculations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(deps);
}, [deps]);

// Memoize callbacks
const memoizedCallback = useCallback(() => {
  handleAction(deps);
}, [deps]);
```

### 4. Testing Strategy

#### Unit Tests
```typescript
// Component testing
describe('CrewCard', () => {
  it('renders crew details correctly', () => {
    const crew = mockCrew();
    render(<CrewCard crew={crew} />);
    expect(screen.getByText(crew.name)).toBeInTheDocument();
  });

  it('handles status changes', async () => {
    const handleStatusChange = jest.fn();
    const crew = mockCrew();
    render(
      <CrewCard 
        crew={crew} 
        onStatusChange={handleStatusChange} 
      />
    );
    // Test interactions
  });
});
```

#### Integration Tests
```typescript
// API integration testing
describe('CrewAPI', () => {
  it('creates a new crew', async () => {
    const crewData = mockCrewData();
    const response = await CrewAPI.create(crewData);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject(crewData);
  });
});
```

### 5. Documentation

#### Component Documentation
```typescript
/**
 * CrewCard displays a crew's information and status
 * @param {Crew} crew - The crew object to display
 * @param {function} onStatusChange - Callback for status changes
 * @example
 * <CrewCard
 *   crew={crewData}
 *   onStatusChange={handleStatusChange}
 * />
 */
```

#### API Documentation
```typescript
/**
 * Creates a new crew
 * @param {CrewCreateParams} params - Crew creation parameters
 * @returns {Promise<Crew>} Created crew object
 * @throws {APIError} When creation fails
 */
```

## Development Tools

### 1. VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Hero
- Error Lens

### 2. Chrome Extensions
- React Developer Tools
- Redux DevTools
- Lighthouse
- Mobile Simulator

### 3. CLI Tools
```bash
# Type checking
npm run type-check

# Lint
npm run lint

# Test
npm run test

# Build analysis
npm run analyze
```

## Deployment

### 1. Development
```bash
npm run dev
```

### 2. Staging
```bash
npm run build:staging
npm run start:staging
```

### 3. Production
```bash
npm run build
npm run start
```

## Monitoring

### 1. Performance Monitoring
```typescript
// Web Vitals
export function reportWebVitals(metric: NextWebVitals) {
  console.log(metric);
}

// Custom metrics
performance.mark('startOperation');
// ... operation
performance.mark('endOperation');
performance.measure('operation', 'startOperation', 'endOperation');
```

### 2. Error Monitoring
```typescript
// Global error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError({
      error,
      errorInfo,
      context: 'ErrorBoundary'
    });
  }
}
```

## Security

### 1. Authentication
```typescript
// Protected route
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  return { props: { session } };
};
```

### 2. Data Protection
```typescript
// Sensitive data handling
const sanitizeUserData = (userData: UserData): SafeUserData => {
  const { password, ...safeData } = userData;
  return safeData;
};
``` 