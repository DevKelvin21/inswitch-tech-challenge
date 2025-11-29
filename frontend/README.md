# React Advanced Playground

A showcase of advanced React patterns and architecture, featuring four complete feature implementations with configuration-driven components, modern state management, and production-ready patterns.

## Overview

This project demonstrates best practices in modern React development, including:

- **Configuration-First Architecture**: Every feature driven by TypeScript configuration objects
- **Container/Presentational Pattern**: Strict separation of concerns
- **Custom Hooks Composition**: Reusable, single-purpose hooks
- **Type-Safe Routing**: TanStack Router with automatic code generation
- **Modern State Management**: React Query + Zustand with Immer
- **Production-Ready Patterns**: Error boundaries, loading states, accessibility

## Tech Stack

### Core
- **React 19.2.0** - Latest React with improved concurrent rendering
- **TypeScript** - Strict type safety throughout
- **Vite 7.2.4** - Fast build tool with excellent DX

### Routing & Data
- **TanStack Router** - File-based, type-safe routing with search params validation
- **TanStack React Query** - Server state management with caching
- **TanStack React Table** - Headless table logic
- **TanStack React Virtual** - Virtual scrolling for performance

### Forms & Validation
- **React Hook Form** - Performant form state management
- **Zod** - TypeScript-first schema validation

### State Management
- **Zustand** - Lightweight global state
- **Immer** - Immutable state updates

### Styling
- **Tailwind CSS** - Utility-first styling
- **@tailwindcss/forms** - Better form styling
- **@tailwindcss/typography** - Rich text styling

## Project Structure

```
src/
├── routes/                    # TanStack Router file-based routes
│   ├── __root.tsx            # Root layout with navigation
│   ├── index.tsx             # Home page
│   ├── data-table.index.tsx  # Data table feature
│   ├── form-builder.tsx      # Form builder feature
│   ├── infinite-scroll.tsx   # Infinite scroll feature
│   └── wizard.tsx            # Multi-step wizard feature
│
├── components/
│   ├── features/             # Feature-specific components (domain-driven)
│   │   ├── DataTable/        # Advanced data table with sorting/filtering
│   │   ├── FormBuilder/      # Dynamic form builder
│   │   ├── InfiniteScroll/   # Virtualized infinite scroll
│   │   └── Wizard/           # State machine wizard
│   └── shared/               # Shared/reusable components
│
├── hooks/                    # Global custom hooks
├── services/                 # API clients
├── store/                    # Zustand stores
├── config/                   # Global configuration
├── types/                    # Shared TypeScript types
└── utils/                    # Utility functions
```

## Features

### 1. Advanced Data Table
- Multi-column sorting
- Advanced filtering and search
- Pagination with URL state sync
- Row selection
- Export to CSV/JSON
- Column resizing
- Debounced updates

**Route**: `/data-table`

### 2. Dynamic Form Builder
- Config-driven form generation
- Conditional field logic
- Auto-save to localStorage
- Dynamic array fields
- Zod validation from config
- Multi-step forms support

**Route**: `/form-builder`

### 3. Infinite Scroll with Virtualization
- Optimized infinite scrolling
- Virtual scrolling for performance
- Debounced search
- Multiple filters
- Intersection Observer pagination

**Route**: `/infinite-scroll`

### 4. Multi-Step Wizard
- State machine-driven navigation
- Linear and non-linear modes
- Per-step validation
- Progress persistence
- Skip optional steps
- Review before submit

**Route**: `/wizard`

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run type-check
```

## Development Workflow

### Adding a New Feature

1. **Create feature directory** in `src/components/features/FeatureName/`
   ```
   FeatureName/
   ├── config/           # Configuration schemas
   ├── hooks/            # Feature-specific hooks
   ├── containers/       # Container components
   ├── presentational/   # Pure UI components
   └── types/           # Feature-specific types (optional)
   ```

2. **Define configuration schema** in `config/featureConfig.ts`
   - Use TypeScript interfaces
   - Include Zod schemas for validation
   - Document all options with JSDoc comments

3. **Create API service** in `src/services/` if needed

4. **Build custom hooks** for business logic

5. **Implement container component** to orchestrate hooks and state

6. **Create presentational components** for UI rendering

7. **Add route** in `src/routes/feature-name.tsx`

8. **Update navigation** in `src/routes/__root.tsx`

### Architecture Patterns

#### Configuration-Driven Components
Every feature is driven by a configuration object:

```typescript
interface FeatureConfig {
  id: string
  features: { [key]: boolean | FeatureOptions }
  validation?: ValidationSchema
  styling?: StylingOptions
  dataSource?: DataSourceConfig
}
```

#### Container/Presentational Pattern
- **Containers**: Handle data fetching, state, and business logic
- **Presentational**: Pure components focused on rendering
- **Never mix concerns**: Presentational components never fetch data

#### Custom Hooks Composition
- Single-purpose hooks (`useTableSort`, `useTableFilter`)
- Compose into larger hooks (`useDataTable`)
- Return stable objects with values and actions

## Configuration

### Global Config (`src/config/`)

- **`api.config.ts`**: API endpoints and settings
- **`app.config.ts`**: Feature flags, pagination, UI settings

### Feature Flags

Enable/disable features in `src/config/app.config.ts`:

```typescript
export const featureFlags = {
  dataTable: true,
  formBuilder: true,
  infiniteScroll: true,
  wizard: true,
  darkMode: false,  // Experimental
}
```

## State Management

### Server State (React Query)
- All async data operations
- Automatic caching and revalidation
- 5-minute stale time (configurable)

### Client State (Zustand)
- Wizard state machines
- Global UI state (theme, modals, toasts)
- Form persistence

### Local State (useState/useReducer)
- Component-specific UI state
- Form state (via React Hook Form)

## Type Safety

- **Strict TypeScript**: `strict: true` in tsconfig
- **No `any` types**: Use `unknown` when type is truly unknown
- **Zod Integration**: Runtime validation with type inference
- **Router Types**: End-to-end type safety with TanStack Router

## Performance Optimizations

- **Virtual Scrolling**: For lists with 100+ items
- **Code Splitting**: Automatic route-based splitting
- **Debouncing**: Search and filter inputs (300ms default)
- **React Query Caching**: Stale-while-revalidate pattern
- **Memoization**: `useMemo`/`useCallback` for expensive operations

## Documentation

For detailed architecture documentation, see [`CLAUDE.md`](./CLAUDE.md)

Additional documentation:
- [`implementation.md`](./implementation.md) - Feature implementation details
- [`CODE_REVIEW_INFINITE_SCROLL.md`](./CODE_REVIEW_INFINITE_SCROLL.md) - Code review patterns
- [`REFACTORING_SUMMARY.md`](./REFACTORING_SUMMARY.md) - Refactoring notes

## API Integration

Currently uses MockAPI.io for development. To switch to a real backend:

1. Update `VITE_API_BASE_URL` in `.env`
2. Modify API endpoints in `src/config/api.config.ts`
3. Update service layer in `src/services/`

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

MIT

## Contributing

See [`CLAUDE.md`](./CLAUDE.md) for architecture guidelines and patterns to follow when contributing.
