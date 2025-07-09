# Phase 1: Core Infrastructure - Detailed Implementation Plan

## Overview

Phase 1 establishes the foundation for the LLM Evaluation Frontend App by implementing core infrastructure, basic data models, document management interface, and annotation workspace foundation.

## Goals

- Set up project structure and development tooling
- Implement core data models and TypeScript interfaces
- Create document management interface for sampling and collection
- Build annotation workspace foundation
- Establish database connections and state management

## Project Structure Setup

### 1. Initialize React + TypeScript Project

```bash
# Create new React app with Vite and TypeScript
pnpm create vite . --template react-ts
pnpm install

# Install core dependencies
pnpm install @tanstack/react-query @tanstack/router jotai
pnpm install @supabase/supabase-js
pnpm install react-hook-form @hookform/resolvers zod
pnpm install tailwindcss @tailwindcss/vite lucide-react

# Install dev dependencies
pnpm install -D @types/node vitest
pnpm install -D @biomejs/biome eslint-config-biome
pnpm install -D @tanstack/react-router-devtools @tanstack/router-plugin
```

For components, use `pnpm dlx shadcn` only when needed.

### 2. Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Base UI components (buttons, forms, etc.)
│   ├── document/        # Document-specific components
│   ├── annotation/      # Annotation-specific components
│   └── common/          # Common components
├── routes/              # TanStack Router route definitions
│   ├── __root.tsx       # Root route layout
│   ├── index.tsx        # Home page route
│   ├── documents/       # Document management routes
│   ├── annotation/      # Annotation routes
│   └── dashboard/       # Dashboard routes
├── hooks/               # Custom React hooks
├── lib/                 # Core utilities and configurations
│   ├── supabase.ts      # Supabase client setup
│   ├── indexed-db.ts    # IndexedDB utilities
│   ├── ai.ts            # AI client utilities
│   └── utils.ts         # General utilities
├── store/               # Jotai atoms and state management
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── routeTree.gen.ts     # Generated route tree (auto-generated)
```

## Data Models and Interfaces

### 1. Core Types (`src/types/index.ts`)

```typescript
export interface Document {
  id: string;
  title: string;
  content: string;
  contentType: "guide" | "reference" | "troubleshooting";
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  type: "answerable" | "non-answerable";
  category: string;
  generatedBy: "llm" | "manual";
  createdAt: Date;
  updatedAt: Date;
}

export interface Annotation {
  id: string;
  questionId: string;
  documentId: string;
  relevancyScore: 0 | 1 | 2 | 3;
  annotatorId: string;
  notes?: string;
  createdAt: Date;
}

export interface DocumentSample {
  id: string;
  name: string;
  description: string;
  documents: Document[];
  samplingCriteria: SamplingCriteria;
  createdAt: Date;
}

export interface SamplingCriteria {
  sampleSize: number;
  contentTypeDistribution: {
    guide: number;
    reference: number;
    troubleshooting: number;
  };
  additionalFilters?: Record<string, any>;
}

export interface AnnotationSession {
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

## Database Layer

### 1. Supabase Configuration (`src/lib/supabase.ts`)

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabasePublicKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY!;

export const supabase = createClient(supabaseUrl, supabasePublicKey);
```

### 2. IndexedDB for Local Storage (`src/lib/indexed-db.ts`)

```typescript
import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Question, DocumentSample, AnnotationSession } from "../types";

interface EvaluationDB extends DBSchema {
  questions: {
    key: string;
    value: Question;
    indexes: { "by-type": string; "by-category": string };
  };
  documentSamples: {
    key: string;
    value: DocumentSample;
  };
  annotationSessions: {
    key: string;
    value: AnnotationSession;
  };
}

class IndexedDBManager {
  private db: IDBPDatabase<EvaluationDB> | null = null;

  async init() {
    this.db = await openDB<EvaluationDB>("evaluation-db", 1, {
      upgrade(db) {
        const questionStore = db.createObjectStore("questions", {
          keyPath: "id",
        });
        questionStore.createIndex("by-type", "type");
        questionStore.createIndex("by-category", "category");

        db.createObjectStore("documentSamples", { keyPath: "id" });
        db.createObjectStore("annotationSessions", { keyPath: "id" });
      },
    });
  }

  async saveQuestion(question: Question) {
    if (!this.db) await this.init();
    return this.db!.put("questions", question);
  }

  async getQuestions(type?: string) {
    if (!this.db) await this.init();
    if (type) {
      return this.db!.getAllFromIndex("questions", "by-type", type);
    }
    return this.db!.getAll("questions");
  }

  async saveDocumentSample(sample: DocumentSample) {
    if (!this.db) await this.init();
    return this.db!.put("documentSamples", sample);
  }

  async getDocumentSamples() {
    if (!this.db) await this.init();
    return this.db!.getAll("documentSamples");
  }

  async saveAnnotationSession(session: AnnotationSession) {
    if (!this.db) await this.init();
    return this.db!.put("annotationSessions", session);
  }

  async getAnnotationSessions() {
    if (!this.db) await this.init();
    return this.db!.getAll("annotationSessions");
  }
}

export const indexedDB = new IndexedDBManager();
```

## Implementation Tasks

### Task 1: Project Setup and Configuration

- [x] Initialize Vite + React + TypeScript project
- [x] Install and configure all dependencies
- [x] Set up Tailwind CSS configuration
- [x] Configure Biome for linting and formatting
- [x] Create directory structure
- [x] Set up development and build scripts
- [x] Configure Vite environment variables

> **2024-06-10:**
> Phase 1 Task 1 completed. Project manually scaffolded with Vite + React + TypeScript, all dependencies and dev dependencies installed, Tailwind CSS and Biome configured, directory structure created, entry files and TypeScript interfaces added, Vite scripts set, and config files in place. Ready for Phase 1 Task 2.

### Task 2: Core Infrastructure

- [x] Implement TypeScript interfaces and types
- [x] Set up Supabase client and database queries (for database queries, check the local dev database for schema)
- [x] Create IndexedDB utilities for local storage
- [x] Create base UI components (Button, Card, Input, etc.)
- [x] Set up TanStack Router with route definitions
- [x] Configure router devtools and code generation

> **2024-06-11:**
> Phase 1 Task 2 completed. TypeScript interfaces and types implemented, Supabase client and IndexedDB utilities created, base UI components scaffolded, and TanStack Router placeholder set up. Ready for Task 3.

### Task 3: Document Management Implementation

- [ ] Implement DocumentSampler component
- [ ] Create DocumentCollection view
- [ ] Build document preview functionality

### Task 4: Annotation Workspace Foundation

- [ ] Create AnnotationWorkspace layout
- [ ] Implement AnnotationForm with validation
- [ ] Add keyboard shortcuts for efficiency
- [ ] Create progress tracking display
- [ ] Implement annotation navigation
- [ ] Add annotation session management

### Task 5: Integration and Testing

- [ ] Connect all components with proper state management
- [ ] Test database connections and queries
- [ ] Verify IndexedDB storage functionality
- [ ] Test form validations and user interactions

## Next Steps (Phase 2 Preview)

After Phase 1 completion, Phase 2 will focus on:

- LLM integration for question generation
- Question curation and management interface
- Advanced annotation features and validation
- Search endpoint integration for evaluation preparation
