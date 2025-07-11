# Annotation Interface Specification

## Overview

The annotation interface is a critical component of the LLM evaluation system that enables users to manually assess the relevancy of document-question pairs. This interface provides an efficient, user-friendly way to annotate large datasets while maintaining annotation quality and consistency.

## Core Requirements

### Annotation Process

1. **Question-Document Pair Presentation**: Display one question with multiple candidate documents
2. **Relevancy Scoring**: 4-point scale (0-3) with clear descriptions
3. **Batch Processing**: Efficient annotation of multiple pairs
4. **Quality Control**: Validation and consistency checks
5. **Progress Tracking**: Real-time progress monitoring

### Relevancy Scale

- **0 - Not Relevant**: Document does not contain any information related to the question
- **1 - Slightly Relevant**: Document contains minimal or tangential information
- **2 - Relevant**: Document contains useful information that partially answers the question
- **3 - Highly Relevant**: Document contains comprehensive information that directly answers the question

## Interface Design

### Main Annotation Workspace

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Session Info, Progress, Navigation                  │
├─────────────────────────────────────────────────────────────┤
│ Question Panel (Left)                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Question Text                                           │ │
│ │ Question Type: [Answerable/Non-answerable]              │ │
│ │ Question Category                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Document List (Right)                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Document 1                                              │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Title                                               │ │
│ │ │ Content Preview (truncated)                         │ │
│ │ │ Content Type: [Guide/Reference/Troubleshooting]     │ │
│ │ │ ┌─┬─┬─┬─┐ Relevancy Score                           │ │
│ │ │ │0│1│2│3│                                           │ │
│ │ │ └─┴─┴─┴─┘                                           │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ Document 2                                              │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Title                                               │ │
│ │ │ Content Preview (truncated)                         │ │
│ │ │ Content Type: [Guide/Reference/Troubleshooting]     │ │
│ │ │ ┌─┬─┬─┬─┐ Relevancy Score                           │ │
│ │ │ │0│1│2│3│                                           │ │
│ │ │ └─┴─┴─┴─┘                                           │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Footer: Navigation, Save, Notes                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Previous] [Save & Next] [Skip] [Notes: ___________]   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. Question Panel
- **Question Text**: Full question display with proper formatting
- **Question Metadata**: Type, category, source
- **Question Actions**: Flag for review, add notes

#### 2. Document List
- **Document Cards**: Individual cards for each document
- **Content Preview**: Truncated content with expand/collapse
- **Metadata Display**: Title, content type, source
- **Relevancy Controls**: Radio buttons or number input for scoring

#### 3. Navigation Controls
- **Previous/Next**: Navigate between questions
- **Save**: Save current annotations
- **Skip**: Skip current question (mark for later review)
- **Progress Indicator**: Show completion percentage

#### 4. Session Information
- **Session Name**: Current annotation session
- **Progress**: X of Y questions completed
- **Time Tracking**: Time spent on current question/session

## User Experience Features

### Keyboard Shortcuts
- **Number Keys (0-3)**: Quick relevancy scoring
- **Arrow Keys**: Navigate between documents
- **Space**: Toggle document expansion
- **Enter**: Save and move to next question
- **Escape**: Skip current question
- **Ctrl+S**: Save current annotations

### Quality Assurance
- **Validation**: Ensure all documents are scored before proceeding
- **Consistency Checks**: Flag potential inconsistencies
- **Review Queue**: Questions flagged for review
- **Annotation History**: Track changes and revisions

### Accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Mode**: Support for accessibility preferences
- **Font Size Controls**: Adjustable text size

## Data Management

### Annotation Storage
- **Local Storage**: Save annotations to IndexedDB for offline work
- **Auto-save**: Automatic saving every 30 seconds
- **Conflict Resolution**: Handle concurrent edits
- **Export**: Export annotations to JSON/CSV

### Session Management
- **Session Persistence**: Resume interrupted sessions
- **Multiple Sessions**: Support for concurrent annotation sessions
- **Session Switching**: Easy navigation between sessions
- **Session Export**: Export completed sessions

## Technical Implementation

### Component Structure
```
AnnotationWorkspace/
├── AnnotationHeader/
│   ├── SessionInfo
│   ├── ProgressBar
│   └── NavigationControls
├── QuestionPanel/
│   ├── QuestionDisplay
│   ├── QuestionMetadata
│   └── QuestionActions
├── DocumentList/
│   ├── DocumentCard[]
│   │   ├── DocumentHeader
│   │   ├── DocumentContent
│   │   ├── RelevancyScore
│   │   └── DocumentActions
│   └── DocumentListControls
├── AnnotationFooter/
│   ├── NavigationButtons
│   ├── SaveButton
│   └── NotesInput
└── AnnotationSidebar/
    ├── SessionProgress
    ├── QualityChecks
    └── ReviewQueue
```

### State Management
- **Annotation State**: Current question, document scores, notes
- **Session State**: Progress, settings, metadata
- **UI State**: Expanded documents, selected elements, keyboard focus
- **Validation State**: Errors, warnings, completion status

### Performance Considerations
- **Virtual Scrolling**: For large document lists
- **Lazy Loading**: Load document content on demand
- **Debounced Saving**: Prevent excessive save operations
- **Memory Management**: Clean up unused document data

## Integration Points

### Document Management
- **Document Loading**: Load documents from document samples
- **Content Preview**: Truncate and format document content
- **Metadata Display**: Show document type, source, date

### Question Management
- **Question Loading**: Load questions from question library
- **Question Filtering**: Filter by type, category, status
- **Question Validation**: Ensure questions are properly formatted

### Evaluation Integration
- **Metrics Calculation**: Feed annotations to evaluation engine
- **Result Analysis**: Use annotations for nDCG/MAP calculations
- **Quality Assessment**: Analyze annotation consistency

## Configuration Options

### Annotation Settings
- **Default Score**: Pre-select default relevancy score
- **Auto-advance**: Automatically advance after scoring all documents
- **Show Progress**: Display progress indicators
- **Keyboard Shortcuts**: Enable/disable keyboard shortcuts

### Display Options
- **Content Preview Length**: Adjust document preview length
- **Document Card Size**: Compact or expanded view
- **Color Scheme**: Light/dark mode support
- **Font Preferences**: Font family and size settings

### Quality Settings
- **Validation Rules**: Custom validation requirements
- **Consistency Thresholds**: Flagging thresholds for inconsistencies
- **Review Triggers**: Automatic review queue triggers
- **Export Formats**: Preferred export formats

## Success Metrics

### Efficiency Metrics
- **Annotations per Hour**: Average annotation speed
- **Error Rate**: Percentage of annotations requiring correction
- **Completion Rate**: Percentage of sessions completed

### Quality Metrics
- **Inter-annotator Agreement**: Consistency between annotators
- **Validation Pass Rate**: Percentage passing quality checks
- **Review Queue Size**: Number of questions requiring review

### User Experience Metrics
- **Session Completion**: Percentage of started sessions completed
- **Feature Usage**: Usage of keyboard shortcuts, notes, etc.
- **User Satisfaction**: Feedback on interface usability