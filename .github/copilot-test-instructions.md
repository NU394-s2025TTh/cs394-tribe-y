
Always use vitest and never jest.
Mock sub components using `vi.mock` and not `jest.mock`.
create mock sub components rather than using the real ones unless specified otherwise.
Place all tests in a describe block. Create sub describe blocks for specific methods or functionality within the component.
Indicate you are using these copilot test instructions in the first line of your test file.

# File: OverviewView.tsx

## Goal
Write tests for the OverviewView component using Vitest and @testing-library/react.

## Test 1: Basic render
- Mock the `useJsonData` hook to return:
  - A file name (e.g. test.json)
  - Empty colorBlocks / data
- Render the OverviewView component.
- Expect the file name to appear in the DOM.

## Test 2: Copy to Clipboard
- Mock navigator.clipboard.writeText.
- Click the "Copy" button.
- Expect clipboard to be written with JSON string.

## Test 3: Download functionality
- Mock Blob and URL.createObjectURL.
- Click the "Download" button.
- Expect a download link to be triggered.

## Test 4: Query statistics
- Provide response times (e.g., 1.5 and 2.5).
- Check that mean = 2.00, median = 2.00 appear in the DOM.

## Test 5: Warnings and questions
- Provide a span with `severity_text: WARN` and a user question.
- Expect the user question to appear under "Warnings".

## Test 6: Step durations
- Provide spans named "chat", "DF to MD" with startTimes.
- Expect durations to be calculated and displayed.
