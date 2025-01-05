# CrewAI Frontend Platform

## Overview
AI Orchestration Platform built with Next.js, focusing on crew and agent management with a mobile-first approach.

## Project Structure
```
crewai-frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # Reusable UI components
│   ├── features/           # Feature-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and helpers
│   ├── styles/             # Global styles and themes
│   └── types/              # TypeScript type definitions
├── docs/                   # Documentation
│   ├── architecture/       # Architecture decisions
│   ├── debugging/          # Debugging guides
│   └── development/        # Development guides
├── logs/                   # Build and debug logs
├── tests/                  # Test files
└── scripts/               # Build and utility scripts
```

## Development Phases

### Phase 1 (MVP)
- Basic crew/agent management
- Simple workflow execution
- Mobile-responsive dashboard
- Essential CRUD operations

### Phase 2 (Enhanced Features)
- Visual workflow builder
- Real-time monitoring
- Advanced agent configuration
- Performance metrics

### Phase 3 (Platform Maturity)
- Team collaboration
- Template marketplace
- Advanced security
- Custom deployments

### Phase 4 (Optimization)
- Advanced caching
- Resource optimization
- Full API integration
- Performance analytics

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Development Guidelines

#### Code Style
- Follow TypeScript best practices
- Use functional components
- Implement mobile-first design
- Follow accessibility guidelines

#### Commit Convention
```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style updates
refactor: Code refactoring
test: Test updates
chore: Build tasks, etc.
```

#### Branch Strategy
- main: Production-ready code
- develop: Development branch
- feature/*: New features
- bugfix/*: Bug fixes
- release/*: Release preparation

## Testing
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run lint checks
npm run lint
```

## Debugging

### Debug Logs
- Location: `/logs/debug/`
- Format: `YYYY-MM-DD-HH-debug.log`
- Level: INFO, WARN, ERROR, DEBUG

### Build Logs
- Location: `/logs/build/`
- Format: `YYYY-MM-DD-build.log`
- Includes: Build errors, warnings, performance metrics

## Deployment

### Development
```bash
npm run dev
```

### Staging
```bash
npm run build:staging
npm run start:staging
```

### Production
```bash
npm run build
npm run start
```

## Documentation
- [Architecture Guide](./docs/architecture/README.md)
- [Development Guide](./docs/development/README.md)
- [Debugging Guide](./docs/debugging/README.md)
- [API Documentation](./docs/api/README.md)

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
[License Type] - See LICENSE file for details 