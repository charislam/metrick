# Phase 3: Annotation System - Implementation Plan

## Overview

Complete annotation interface for manual relevancy ranking of document-question pairs with four core features:

1. Annotation workspace with efficient keyboard shortcuts and batch processing
2. Progress tracking and session management
3. Annotation guidelines

## Core Requirements

- 4-point relevancy scale (0-3) with clear descriptions and examples
- Keyboard shortcuts for rapid annotation
  - Modal-style keyboard shortcuts, with a modifier+key to toggle annotation mode
  - In annotation mode:
    - HJKL, in order, corresponds to relevacy scores 0-3
    - U goes to previous and I goes to next
- Integration with existing document samples and question libraries

## User Flow

1. Navigate to `/annotation` → Shows annotation session picker
2. Select/create session → Navigate to `/annotation?session={sessionId}` → Shows annotation workspace
3. Configure annotation settings → Start annotation process
4. Annotate question-document pairs → Real-time progress updates
5. Review and validate annotations → Export or continue session

## Implementation Tasks

### 1. Data Extensions

**Tasks:**

- Extend `Annotation` interface in `src/types/index.ts`:
  - Add `sessionId: string` field for session association
    - Add an index by `sessionId` and migrate the DB for backwards compatibility
- Create `AnnotationSettings` interface:
  - `keyboardShortcuts: boolean` - enable/disable shortcuts
  - `autoSave: boolean` - auto-save annotations
  - `showGuidelines: boolean` - display guidelines during annotation
- Extend `src/lib/indexed-db.ts` with annotation storage methods:
  - `saveAnnotation(annotation: Annotation)`
  - `getAnnotationsBySession(sessionId: string)`
  - `getAnnotationProgress(sessionId: string)`
  - `saveAnnotationSession(session: AnnotationSession)`
  - `getAnnotationSessions()`
  - `updateSessionProgress(sessionId: string, progress: Progress)`

### 2. Annotation Workspace Core

**Tasks:**

- Create `src/routes/annotation/index.tsx` - main annotation page with routing logic:
  - Check for `session` query parameter
  - If no session: show AnnotationSessionPicker component
  - If session provided: validate session exists, show annotation workspace
  - Handle invalid session IDs with error message and fallback to picker
- Create `src/components/annotation/AnnotationSessionPicker.tsx`:
  - List available annotation sessions from IndexedDB
  - Create new session option with document sample and question selection
  - Session progress indicators and completion status
  - Navigate to annotation workspace with selected session ID
- Create `src/components/annotation/AnnotationWorkspace.tsx`:
  - Main annotation interface with question-document pair display
  - Relevancy scale buttons (0-3) with descriptions
  - Keyboard shortcut handling and visual feedback
  - Navigation controls (previous, next, releavcy score)
  - Real-time progress indicator
  - Auto-save functionality with visual confirmation

### 3. Annotation Interface Components

**Tasks:**

- Create `src/components/annotation/QuestionDocumentPair.tsx`:
  - Display question text with type indicator (answerable/non-answerable)
  - Document metadata display (title, type, source)
  - Responsive layout for different screen sizes
- Create `src/components/annotation/RelevancyScale.tsx`:
  - 4-point scale buttons (0-3) with clear visual hierarchy
  - On-screen descriptions for each relevancy level
  - Keyboard shortcut indicators
  - Selected state with visual feedback
  - Accessibility support (ARIA labels, focus management)
- Create `src/components/annotation/AnnotationControls.tsx`:
  - Navigation buttons (previous, next)
  - Notes/comment field for additional context
  - Save and continue functionality
- Create `src/components/annotation/ProgressTracker.tsx`:
  - Visual progress bar with completion percentage
  - Session statistics (total, completed, remaining)

### 4. Quality Validation System

**Tasks:**

- Create `src/lib/annotation-validation.ts`:
  - Consistency checking between similar question-document pairs
  - Anomaly detection for unusual annotation patterns
  - Confidence vs. time spent correlation analysis
  - Flag-based quality issue identification
  - Statistical validation rules implementation
- Create `src/components/annotation/QualityCheckPanel.tsx`:
  - Display validation warnings and suggestions
  - Confidence indicators for annotation quality
  - Review queue for flagged annotations
  - Quality metrics dashboard
- Create `src/components/annotation/AnnotationReview.tsx`:
  - Side-by-side comparison of similar annotations
  - Conflict resolution interface for multi-annotator sessions
  - Annotation history and revision tracking
  - Export validation reports

### 5. Guidelines and Help System

**Tasks:**

- Create `src/components/annotation/AnnotationGuidelines.tsx`:
  - Interactive guidelines with examples
  - Relevancy scale explanations with sample cases
  - Best practices and common pitfalls
  - Keyboard shortcut reference
  - Contextual help based on current annotation
- Create `src/components/annotation/HelpOverlay.tsx`:
  - Modal overlay with annotation instructions
  - Interactive tutorial for first-time users
  - Keyboard shortcut cheat sheet
  - FAQ and troubleshooting section
- Create `src/lib/annotation-examples.ts`:
  - Curated examples for each relevancy level
  - Edge case examples and explanations
  - Domain-specific annotation guidelines
  - Example question-document pairs for training

### 6. Session Management and Persistence

**Tasks:**

- Create `src/hooks/useAnnotationSession.ts`:
  - React Query hook for session management
  - Real-time progress updates and persistence
  - Auto-save functionality with debouncing
  - Session state recovery after page refresh
  - Multi-tab synchronization
- Create `src/hooks/useAnnotationKeyboard.ts`:
  - Keyboard shortcut handling and event management
  - Shortcut conflict resolution
  - Customizable key bindings
  - Visual feedback for key presses
  - Accessibility considerations
- Create `src/lib/annotation-persistence.ts`:
  - Optimistic updates for smooth UX
  - Conflict resolution for concurrent edits
  - Offline support with sync on reconnect
  - Data export and backup functionality

## Files to Create

### Core Files

```
src/routes/annotation/index.tsx                    # Main annotation page with routing logic
src/components/annotation/AnnotationSessionPicker.tsx # Session selection interface
src/components/annotation/AnnotationWorkspace.tsx   # Main annotation interface
src/components/annotation/QuestionDocumentPair.tsx  # Question-document display
src/components/annotation/RelevancyScale.tsx        # Relevancy scale interface
src/components/annotation/AnnotationControls.tsx    # Navigation and control buttons
src/components/annotation/ProgressTracker.tsx       # Progress tracking interface
src/components/annotation/QualityCheckPanel.tsx     # Quality validation display
src/components/annotation/AnnotationReview.tsx      # Review and comparison interface
src/components/annotation/AnnotationGuidelines.tsx  # Guidelines and help system
src/components/annotation/HelpOverlay.tsx           # Help and tutorial overlay
src/hooks/useAnnotationSession.ts                   # Session management hooks
src/hooks/useAnnotationKeyboard.ts                  # Keyboard shortcut hooks
src/lib/annotation-validation.ts                    # Quality validation logic
src/lib/annotation-examples.ts                      # Guidelines and examples
src/lib/annotation-persistence.ts                   # Data persistence utilities
```

### Files to Extend

```
src/types/index.ts                   # Add annotation session and settings interfaces
src/lib/indexed-db.ts                # Add annotation storage methods
```
