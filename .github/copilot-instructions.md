Copilot Instructions

Instructions
- Use TypeScript
- Use React
- Use functional components
- Output in compatible Prettier format (see .prettierrc.cjs for configuration)
- Ensure use of types and TypeScript without linting errors

Styling
- Use TailwindCSS for styling
- Use class names for conditional styling

Testing
- Develop tests using the instructions in copilot-test-instructions.md
- Write tests first, generating vitests in the same file as the component
- Create describe blocks for each major set of tests
- Share mock components between tests within a file without duplicating code

File Structure
This is the structure of the project:

- Put new capabilities/features in their own folder inside the src directory. One component per file.
- Put shared UI components in a dedicated nx library using the nx tool.

Creating scenarios, stories, features, and workitems
- Create these using nicely formatted markdown files. Use the following structure:

    - Place files in the Backlog folder
    - Place stories in the Stories folder
    - Place workitems in the Workitems folder
    - Place scenarios in the Scenarios folder