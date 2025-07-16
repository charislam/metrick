# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests with Vitest
- `npx @biomejs/biome check` - Run linter and formatter checks
- `npx @biomejs/biome format --write` - Format code
- `npx @biomejs/biome lint --write` - Lint and auto-fix

## Architecture Overview

This is a React application for LLM evaluation and annotation built with:

- **React 19** with TypeScript
- **TanStack Router** for file-based routing
- **TanStack Query** for server state management
- **Jotai** for client-side state management
- **Tailwind CSS** with dark mode support
- **Biome** for linting and formatting
- **IndexedDB** for local data persistence
- **Vite** for build tooling
- **shadcn/ui** for UI component library

## Core Domain Models

The application centers around document annotation and evaluation:

- **Document**: Content with metadata (guide, reference, troubleshooting types)
- **DocumentSample**: Collections of documents with sampling criteria
- **Question**: Generated or manual questions linked to document samples
- **Annotation**: Relevancy scores (0-3) for question-document pairs
- **AnnotationSession**: Complete annotation workflows with progress tracking

## Key Components Structure

- `src/routes/` - File-based routing with index pages for each section
- `src/components/document/` - Document sampling and management
- `src/components/question/` - Question generation and curation
- `src/components/annotation/` - Annotation interface and session management
- `src/components/ui/` - Reusable UI components (shadcn/ui style)
- `src/lib/indexed-db.ts` - Local database management
- `src/lib/error.ts` - Result type system for error handling
- `src/types/index.ts` - TypeScript type definitions

## Data Flow

1. **Document Sampling**: Create document samples with specific criteria
2. **Question Generation**: Generate questions via LLM or manual input
3. **Question Curation**: Review and approve/reject generated questions
4. **Annotation Sessions**: Create sessions pairing questions with documents
5. **Relevancy Scoring**: Annotate question-document pairs with relevancy scores

## Important Implementation Details

- Uses IndexedDB for offline-first data persistence
- Implements automatic database migrations (currently version 4)
- File-based routing with TanStack Router generates `src/routeTree.gen.ts`
- Path alias `@/` maps to `src/`
- Theme system with dark mode support via CSS variables
- Biome excludes generated route tree from linting

## Development Guidelines

### Error Handling (from .cursor/rules/error-handling-with-result.mdc)
- **MUST use Result<T, E> pattern** from `src/lib/error.ts` for all error handling
- Return `Result.ok(value)` for success, `Result.err(error)` for failures
- Use `isOk()`, `isErr()`, `unwrapOr()`, `map()`, `andThen()` for safe handling
- **DO NOT throw errors** for expected error conditions or business logic
- Only throw for truly exceptional, unrecoverable situations
- Use custom error types: `DatabaseError`, `UnknownError`

### Data Fetching (from .cursor/rules/query.mdc)
- **MUST use TanStack Query** for all async data operations in `.tsx`/`.jsx` files
- Use `useQuery`, `useMutation`, `useQueryClient` instead of `useEffect` or direct calls
- Query keys are all defined in `src/lib/query-keys.ts` and should never be written as inline strings
- For working with Results, use `unwrapRaw()` to throw underlying errors, like so:
  ```
  const result = useQuery({
    // ...other fields
    queryFn: () => (await functionReturningResult()).unwrapRaw()
  })
  ```
- Never fetch or mutate data directly in components

### UI Components (from .cursor/rules/shadcn-design.mdc)
- **MUST use shadcn/ui components** as primary design system
- Use shadcn components (Button, Card, Input, Dialog, Badge, etc.) for all UI
- Avoid custom CSS or third-party components unless shadcn doesn't provide suitable alternative
- When extending components, extend shadcn primitives and patterns

### Independent Operation (from .cursor/rules/independent-operation.mdc)
- Continue working until implementation is complete
- **MUST fix ALL linter errors** before stopping
- Check project diagnostics, typecheck (with tsc), and Biome before finishing
- Format with Biome before finishing

### React Component Refactoring Principles
- **Single Responsibility Principle (SRP)**: Each component should have one clear, focused purpose. Extract components when a single component handles multiple concerns (e.g., `SessionCard` for individual session display, `EmptyState` for no-data scenarios)
- **Custom Hook Extraction**: Extract data fetching and business logic into reusable custom hooks. Separate concerns by moving state management and side effects out of UI components (e.g., `useAnnotationSessionQuery`, `useSessionNavigation`)
- **Component Composition over Complexity**: Break down large components into smaller, composable pieces. Use conditional rendering with dedicated components instead of complex inline JSX blocks
- **Presentation vs. Container Separation**: Keep UI components focused on presentation. Move state management and side effects to custom hooks. Pass data and callbacks as props to maintain component purity
- **Declarative Component Naming**: Use descriptive component names that explain their purpose (e.g., `LoadingState`, `EmptyState`, `SessionCard` are self-documenting)
- **Props Interface Design**: Design minimal, focused prop interfaces. Use callback props for parent-child communication. Maintain prop consistency across similar components
- **Code Organization**: Group related functionality (hooks in `/src/hooks/`, components by feature). Maintain consistent file structure and naming conventions. Keep imports organized and minimal
