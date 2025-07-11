# LLM Evaluation Frontend App

A React-based frontend application for evaluating search quality using nDCG and MAP metrics. This application provides tools for document management, question generation, and annotation of document-question pairs.

## Features

### Document Management
- Stratified sampling of documents from database
- Document collection management
- Content type categorization (guides, reference, troubleshooting)

### Question Generation
- LLM-powered question generation
- Manual question curation
- Question library management

### Annotation Interface
- **Question-Document Pair Presentation**: Display one question with multiple candidate documents
- **Relevancy Scoring**: 4-point scale (0-3) with clear descriptions
- **Batch Processing**: Efficient annotation of multiple pairs
- **Quality Control**: Validation and consistency checks
- **Progress Tracking**: Real-time progress monitoring

### Relevancy Scale
- **0 - Not Relevant**: Document does not contain any information related to the question
- **1 - Slightly Relevant**: Document contains minimal or tangential information
- **2 - Relevant**: Document contains useful information that partially answers the question
- **3 - Highly Relevant**: Document contains comprehensive information that directly answers the question

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build
```bash
npm run build
```

## Usage

### 1. Document Management
Navigate to `/documents` to:
- Sample documents from your database
- Configure stratified sampling criteria
- View document collections and metadata

### 2. Question Generation
Navigate to `/questions` to:
- Generate questions using LLM
- Create custom questions manually
- Curate and manage question library

### 3. Annotation Interface
Navigate to `/annotation` to:
- Score document relevancy for questions
- Use keyboard shortcuts for efficient annotation
- Track progress and quality metrics

### Keyboard Shortcuts
- **Number Keys (0-3)**: Quick relevancy scoring
- **Arrow Keys**: Navigate between documents
- **Space**: Toggle document expansion
- **Enter**: Save and move to next question
- **Escape**: Skip current question
- **Ctrl+S**: Save current annotations

## Project Structure

```
src/
├── components/
│   ├── annotation/
│   │   ├── AnnotationWorkspace.tsx    # Main annotation interface
│   │   ├── AnnotationHeader.tsx       # Session info and progress
│   │   ├── QuestionPanel.tsx          # Question display and metadata
│   │   ├── DocumentList.tsx           # Document cards with scoring
│   │   ├── AnnotationFooter.tsx       # Navigation and save controls
│   │   └── AnnotationSidebar.tsx      # Progress and quality checks
│   ├── document/                      # Document management components
│   ├── question/                      # Question generation components
│   └── ui/                           # Shared UI components
├── routes/                           # Application routes
├── types/                           # TypeScript type definitions
└── lib/                             # Utility functions and configurations
```

## Data Models

### Annotation
```typescript
interface Annotation {
  id: string;
  questionId: string;
  documentId: string;
  relevancyScore: 0 | 1 | 2 | 3;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### AnnotationSession
```typescript
interface AnnotationSession {
  id: string;
  name: string;
  description: string;
  documentSampleId: string;
  questions: Question[];
  annotations: Annotation[];
  progress: {
    total: number;
    completed: number;
    remaining: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## Technical Stack

- **Framework**: React 18 with TypeScript
- **Router**: TanStack Router
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React hooks (useState, useEffect)
- **Storage**: IndexedDB (planned for production)

## Development Status

### Completed
- ✅ Annotation interface layout and components
- ✅ Question panel with metadata display
- ✅ Document list with relevancy scoring
- ✅ Progress tracking and session management
- ✅ Navigation and save functionality
- ✅ Mock data for development testing

### In Progress
- 🔄 IndexedDB integration for data persistence
- 🔄 Keyboard shortcuts implementation
- 🔄 Quality validation and consistency checks

### Planned
- 📋 Real document loading from API
- 📋 Question generation integration
- 📋 Evaluation metrics calculation
- 📋 Results visualization and export
- 📋 Multi-user annotation support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.