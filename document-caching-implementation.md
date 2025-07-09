# Document Caching Implementation

## Overview
Implemented indefinite caching for document queries in the DocumentCollectionStats component, with a manual refresh option to fetch fresh data when needed.

## Changes Made

### 1. Enhanced React Query Configuration
- **Indefinite Caching**: Added `staleTime: Infinity` and `gcTime: Infinity` to the query configuration
- **Manual Refresh**: Exposed `refetch` and `isFetching` from the useQuery hook

### 2. Added Refresh Button UI
- **Icon**: Imported `RefreshCw` icon from lucide-react
- **Button Component**: Added a secondary variant button with refresh functionality
- **Visual Feedback**: 
  - Icon spins during refresh (`animate-spin` class)
  - Button text changes from "Refresh" to "Refreshing..."
  - Button is disabled during fetch operation

### 3. Layout Improvements
- **Header Layout**: Changed from single title to flex layout with title and refresh button
- **Responsive Design**: Button maintains proper spacing and alignment

## Technical Details

### Query Configuration
```tsx
const { data, isLoading, isError, refetch, isFetching } = useQuery({
  queryKey: ["all-documents-stats"],
  queryFn: async () => { /* ... */ },
  staleTime: Infinity,    // Cache indefinitely
  gcTime: Infinity,       // Keep in memory indefinitely
});
```

### Refresh Handler
```tsx
const handleRefresh = () => {
  refetch();
};
```

### UI Components Used
- **Button**: `variant="secondary"`, `size="default"`
- **Icon**: `RefreshCw` from lucide-react with conditional animation
- **Layout**: Flexbox for header alignment

## Benefits

1. **Performance**: Documents are cached indefinitely, reducing unnecessary API calls
2. **User Control**: Users can manually refresh when they know documents have been updated
3. **Visual Feedback**: Clear indication when refresh is in progress
4. **Data Freshness**: On-demand refresh ensures users can get the latest data when needed

## File Modified
- `src/components/document/DocumentCollectionStats.tsx`

## Dependencies Used
- `@tanstack/react-query` (existing)
- `lucide-react` (existing)
- Local UI components: `Button`