# LLM Evaluation Frontend App - Implementation Plan

## Overview
This document outlines the implementation plan for a frontend application to support RAG evaluation using nDCG and MAP metrics. The system will help evaluate search quality improvements by allowing users to create evaluation datasets, run evaluations, and visualize results.

## Core Requirements

### Evaluation Process
- Sample documents from database with stratified sampling across different types of documents
- Generate questions using LLM for answerable/non-answerable scenarios
- Manual relevancy ranking (0-3 scale) for document-question pairs
- Calculate nDCG and MAP metrics
- Save results to compare between different evaluation runs

### Key Features
- Document sampling and management
- Question generation and curation
- Relevancy annotation interface
- Search result evaluation
- Metrics calculation and visualization
- Evaluation history and comparison

## Technical Architecture

### Frontend Stack
- **Framework**: React with TypeScript
- **State Management**: Jotai
- **UI Components**: React components with Tailwind CSS, ShadCN, and Radix UI
- **Charts/Visualization**: D3.js or Chart.js for metrics visualization
- **Form Management**: React Hook Form for annotation forms
- **HTTP Client**: Fetch wrapped with Tanstack Query for API calls
- **Saving evaluation history**: Save in IndexedDB

### Backend Requirements
- **Database**: Postgres document database already exists, interact with it via Supabase JS SDK
- **Search Integration**: Interface with existing search via calls to <host>/docs/api/graphql. The host in development is http://localhost:3001
- **LLM Integration**: API for question generation

## Application Structure

### 1. Document Management Module
```
/documents
├── sampling/          # Document sampling interface
├── collection/        # View and manage document collections
└── metadata/          # Document metadata and categorization
```

**Features**:
- Stratified sampling configuration (guides, reference, troubleshooting)
- Sample size selection (default: 25)
- Document preview and metadata display

### 2. Question Generation Module
```
/questions
├── generate/          # LLM-powered question generation
├── curate/           # Manual question curation
└── library/          # Question library management
```

**Features**:
- Generate answerable and non-answerable questions from document sets
- Create custom questions
- Save question bank in IndexedDB

### 3. Annotation Interface
```
/annotation
├── workspace/        # Main annotation interface
├── guidelines/       # Annotation guidelines and examples
└── progress/         # Annotation progress tracking
```

**Features**:
- Question-document pair presentation
- 4-point relevancy scale (0-3) with descriptions
- Batch annotation capabilities
- Annotation quality checks and validation
- Progress tracking

### 4. Evaluation Runner
```
/evaluation
├── configure/       # Evaluation configuration
├── run/             # Execute evaluations
└── monitor/         # Real-time evaluation monitoring
```

**Features**:
- Search endpoint configuration
- Evaluation parameter settings
- Background evaluation execution
- Progress monitoring and logs

### 5. Results Dashboard
```
/results
├── metrics/          # nDCG and MAP visualization
├── comparison/       # Comparison between different evaluation runs
├── analysis/         # Detailed result analysis
└── export/          # Export results and reports
```

**Features**:
- Interactive metrics visualization
- Comparison charts and tables
- Query-level performance breakdown
- Export to CSV or Markdown formats

## Data Models

### Document
```typescript
interface Document {
  id: string;
  title: string;
  content: string;
  contentType: 'guide' | 'reference' | 'troubleshooting';
  metadata: Record<string, any>;
}
```

### Question
```typescript
interface Question {
  id: string;
  text: string;
  type: 'answerable' | 'non-answerable';
  category: string;
  generatedBy: 'llm' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}
```

### Annotation
```typescript
interface Annotation {
  id: string;
  questionId: string;
  documentId: string;
  relevancyScore: 0 | 1 | 2 | 3;
  annotatorId: string;
  notes?: string;
  createdAt: Date;
}
```

### Evaluation
```typescript
interface Evaluation {
  id: string;
  name: string;
  description: string;
  documentSampleId: string;
  searchEndpoint: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results?: EvaluationResults;
  createdAt: Date;
  completedAt?: Date;
}

interface EvaluationResults {
  nDCG: number;
  MAP: number;
  queryResults: QueryResult[];
  summary: ResultSummary;
}
```

## Key Components

### 1. DocumentSampler
- Stratified sampling logic
- Sample size configuration
- Content type distribution

### 2. QuestionGenerator
- LLM integration for question generation
- Question validation and filtering

### 3. AnnotationWorkspace
- Keyboard shortcuts for efficiency
- Real-time validation

### 4. MetricsCalculator
- nDCG calculation implementation
- MAP calculation implementation
- Confidence intervals from multiple samples of same experimental group
- Statistical significance testing

### 5. ResultsVisualizer
- Interactive charts and graphs
- Comparison overlays
- Export functionality

## Implementation Phases

### Phase 1: Core Infrastructure
- Set up project structure and tooling
- Implement basic data models
- Create document management interface
- Build annotation workspace foundation

### Phase 2: Question Management
- Implement question generation
- Build question curation interface
- Create question library management

### Phase 3: Annotation System
- Complete annotation interface
- Implement validation and quality checks
- Add progress tracking

### Phase 4: Evaluation Engine
- Build evaluation runner
- Implement metrics calculations
- Add search integration

### Phase 5: Results & Visualization
- Create results dashboard
- Implement comparison features
- Add export capabilities

### Phase 6: Polish & Testing
- UI/UX improvements
- Performance optimization
- Comprehensive testing

## Technical Considerations

### User Experience
- Keyboard shortcuts for annotation efficiency

### Scalability
- Pagination for large datasets
- Configurable evaluation parameters
- Extensible metrics framework

## Dependencies

### External Services
- Document database/search index
- LLM API for question generation
- Search endpoint for evaluation

### Development Tools
- Node.js and pnpm for package management
- TypeScript compiler
- Testing frameworks (Vitest)
- Linting and formatting tools (Biome, ESLint)

## Conclusion

This implementation plan provides a comprehensive framework for building an LLM evaluation frontend that supports the full evaluation lifecycle from document sampling to results analysis. The modular architecture ensures maintainability and extensibility while addressing the specific requirements outlined in the evaluation specification.
