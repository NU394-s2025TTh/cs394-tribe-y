# Work Item: Create Response Time Chart Component

## Task
Develop a new functional component (e.g. ResponseTimeChart) using TypeScript, React, Recharts, and TailwindCSS. The chart should extract average and median response times from the log data provided via the jsonData context.

## Acceptance Criteria
- The chart displays key metrics (average and median response times).
- Data is aggregated correctly from the uploaded logs.
- Tooltips provide interactivity to show exact values on hover.
- The component is formatted with Prettier and free of TypeScript errors.

## Dependencies
- Existing jsonData context
- Recharts and TailwindCSS styling

---

# Work Item: Write Vitest Tests for Response Time Chart

## Task
Implement vitest tests in the same file as the component to verify that ResponseTimeChart renders correctly and calculates metrics accurately.

## Acceptance Criteria
- Tests confirm the component renders with valid log data.
- Average and median values are computed correctly based on mocked inputs.
- Shared mock data is used within a describe block for clarity.

## Dependencies
- ResponseTimeChart component

---

# Work Item: Integrate Response Time Chart into Overview View

## Task
Update the OverviewView to include the new ResponseTimeChart component so that the chart renders automatically after a successful log upload.

## Acceptance Criteria
- The ResponseTimeChart appears within OverviewView upon receiving jsonData.
- The chart updates dynamically as the log data changes.
- The integration maintains current styling and layout of the OverviewView.

## Dependencies
- ResponseTimeChart component
