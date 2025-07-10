# Phase 2: Question Management - Implementation Plan

## Overview
Simple question generation and curation system with four core features:
1. Generate AI questions from document samples (answerable/non-answerable)
2. Review and accept/reject AI-generated questions
3. Add custom questions manually
4. Save questions to database with document sample association

## Core Requirements
- Use Vercel AI SDK for LLM interactions
- Abstract AI generation as reusable library component
- Follow existing codebase patterns
- Integrate with existing document sample system

## User Flow
1. Navigate to `/questions` → Shows document sample picker
2. Select sample → Navigate to `/questions?sample={sampleId}` → Shows question generator
3. Configure generation options → Generate AI questions
4. Review questions → Accept/Reject/Edit individual questions
5. Add manual questions → Save to database with sample association

## Implementation Tasks

### 1. Data Extensions
**Tasks:**
- Add `documentSampleId` field to existing Question interface in `src/types/index.ts`
- Add `status: 'pending' | 'accepted' | 'rejected'` field to Question interface
- Extend `src/lib/indexed-db.ts` with question storage methods:
  - `saveQuestion(question: Question)`
  - `getQuestionsByDocumentSample(sampleId: string)`
  - `updateQuestionStatus(questionId: string, status: 'pending' | 'accepted' | 'rejected')`
  - `getDocumentSample(sampleId: string)` - for sample validation

### 2. AI Question Generation Component
**Tasks:**
- Create `src/lib/ai-question-generator.ts` using Vercel AI SDK
- Abstract as reusable component with interface:
  - `generateQuestions(documents: Document[], options: { answerableCount: number, nonAnswerableCount: number })`
  - Return structured question objects with type and source document
- Handle streaming responses and error states

### 3. Question Generation & Curation Interface
**Tasks:**
- Create `src/routes/questions/index.tsx` - main questions page with routing logic:
  - Check for `sample` query parameter
  - If no sample: show DocumentSamplePicker component
  - If sample provided: validate sample exists, show question generator
  - Handle invalid sample IDs with error message and fallback to picker
- Create `src/components/question/DocumentSamplePicker.tsx`:
  - List available document samples from IndexedDB
  - Navigate to question generator with selected sample ID as query param
- Create `src/components/question/QuestionGenerator.tsx`:
  - AI generation controls (answerable/non-answerable counts)
  - Generate button that calls AI service
  - Display generated questions in review cards
- Create `src/components/question/QuestionReviewCard.tsx`:
  - Display generated question with source document context
  - Accept/Reject buttons
  - Edit question text inline
  - Save to database with status
- Create `src/components/question/AddQuestionForm.tsx`:
  - Simple form to add custom questions
  - Associate with current document sample
  - Question type selection (answerable/non-answerable)

### 4. Integration Hook & Routing Logic
**Tasks:**
- Create `src/hooks/useQuestionGeneration.ts`:
  - React Query hook for AI generation
  - React Query hook for saving/updating questions  
  - React Query hook for fetching document samples
  - Sample validation logic (check if sample ID exists)
  - Handle loading states and errors
  - Integrate with existing error handling patterns
- Routing behavior in questions page:
  - Use TanStack Router search params for `sample` parameter
  - Validate sample ID against IndexedDB before showing generator
  - Show error message and redirect to picker for invalid sample IDs
  - Maintain URL state for bookmarkable question generation sessions

## Files to Create

### Core Files
```
src/routes/questions/index.tsx                  # Main questions page with routing logic
src/components/question/DocumentSamplePicker.tsx # Sample selection interface
src/components/question/QuestionGenerator.tsx   # AI generation interface  
src/components/question/QuestionReviewCard.tsx  # Question review interface
src/components/question/AddQuestionForm.tsx     # Manual question creation
src/hooks/useQuestionGeneration.ts              # React Query hooks
src/lib/ai-question-generator.ts                # Vercel AI SDK integration
```

### Files to Extend
```
src/types/index.ts                   # Add documentSampleId and status fields
src/lib/indexed-db.ts                # Add question storage methods
```

## Timeline Estimation

### Week 1: Foundation
- Extend data models and storage
- Create AI question generator with Vercel AI SDK
- Basic React Query hooks

### Week 2: UI Components  
- Document sample picker component
- Question generator component with AI controls
- Question review card component
- Add question form
- Main questions page with routing logic

### Week 3: Integration & Polish
- Connect components with hooks
- Error handling and loading states
- Testing and refinements

**Total: 3 weeks for core functionality**