# Workflow Optimization Test

This file tests the GitHub Actions workflow optimization to prevent duplicate runs.

## Changes Made

1. **Limited push triggers**: Only main branches (develop, main, master) trigger on push
2. **Added path filters**: Skip runs for documentation-only changes  
3. **Maintained PR coverage**: All PR branches still get validated

## Expected Behavior

- **Before**: 8 duplicate jobs when pushing to PR branches
- **After**: Only 1 set of jobs runs (via pull_request trigger)
- **Resource savings**: ~50% reduction in CI usage

## Test Scenarios

- [ ] Push to PR branch → Only PR trigger runs
- [ ] Push to main branch → Only push trigger runs  
- [ ] Documentation changes → No workflow runs
- [ ] Code changes → Workflow runs normally