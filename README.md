# TNE.ai Dashboard - CS 394 Spring 2025

## Project Overview

A dynamic web application designed for ML operations teams and AI engineers, offering powerful tools to monitor the performance of multiple AI models.

The platform collects and analyzes system logs, metrics, and error messages to provide a comprehensive view of model behavior across deployments. TNE.ai turns scattered low-level data into clear insights, helping teams quickly identify issues and improve system reliability.

<img src="images/Screenshot of Running App.png">

<a href="https://cs394-tribe-y-79383.web.app/">Link to Deployed App</a>
<a href="https://github.com/orgs/NU394-s2025TTh/projects/8">Link to Backlog</a>

## How to Use TNE.ai Dashboard

1. Upload a json file of the logs (e.g., log_data.json). The log metrics should now be visible
2. To view model accuracy, you must download the 'server' directory from the repository
3. Open cmd and 'cd' into 'server' directory
4. Run 'pip install -r requirements.txt'
5. Run 'uvicorn app:app --reload'. This should start the local LLM that will do the fuzzy matching.
6. Navigate to 'QA Matching' on the TNE.ai Dashboard, click 'Run LLM Match', then click 'Evaluate All Queries'. The TNE.ai model accuracy should now be displayed.
7. To view charts/graphs of the log_data.json contents and metrics, navigate to 'Charts' on the TNE.ai Dashboard
8. Adjust the X-axis and Y-axis fields to display desired metrics.

## Directory Structure (Important Files Only):

```bash
└── nu394-s2025tth-cs394-tribe-y/
    ├── README.md
    ├── server/
    │   ├── app.py
    │   ├── config.py
    │   ├── requirements.txt
    │   ├── .env
    ├── web/
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── tailwind.config.js
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   ├── vite.config.ts
    │   ├── public/
    │   │   └── data/
    │   │       ├── echo_acceptance_tests.xlsx
    │   │       └── log_data.csv
    │   ├── scripts/
    │   │   ├── convert-faqs.ts
    │   │   ├── extract-converted-queries.cjs
    │   │   ├── extract-queries.cjs
    │   │   └── extract-queries.ts
    │   └── src/
    │       ├── App.tsx
    │       ├── index.css
    │       ├── main.tsx
    │       ├── vite-env.d.ts
    │       ├── components/
    │       │   ├── Dashboard.tsx
    │       │   ├── FileUploader.tsx
    │       │   ├── Header.tsx
    │       │   ├── MainContent.tsx
    │       │   ├── Sidebar.tsx
    │       │   ├── QA_components/
    │       │   │   ├── EvaluateAllButton.tsx
    │       │   │   ├── MatchTable.tsx
    │       │   │   ├── qaStyles.module.css
    │       │   │   └── TestMatchButton.tsx
    │       │   ├── views/
    │       │   │   ├── ChartView.tsx
    │       │   │   ├── OverviewView.tsx
    │       │   │   ├── QAView.tsx
    │       │   │   └── TableView.tsx
    │       │   └── visualizations/
    │       │       └── StructureSummary.tsx
    │       ├── context/
    │       │   ├── JsonDataContext.tsx
    │       │   └── ThemeContext.tsx
    │       ├── data/
    │       │   ├── converted_log.json
    │       │   ├── extracted_queries.json
    │       │   ├── faqs_dict.json
    │       │   ├── log_data.json
    │       │   └── qa_pairs.json
    │       ├── lib/
    │       │   ├── extractQAFromLog.ts
    │       │   ├── faqMatcher.ts
    │       │   └── utils.ts
    │       └── orange-docs/
    │           ├── Backlog/
    │           │   ├── Scenarios/
    │           │   │   └── test.md
    │           │   ├── Stories/
    │           │   │   └── visualize_response_time.md
    │           │   └── Workitems/
    │           │       └── test.md
    │           └── Workitems/
    │               └── response_time_summary_workitems.md
```

## Other Documentation:

Documentation including naming, development, organization practices, etc. are located in /docs/

## Getting started

Clone the repository:

SSH:

```sh
git clone git@github.com:NU394-s2025TTh/cs394-tribe-y.git
```

HTTPS:

```sh
git clone https://github.com/NU394-s2025TTh/cs394-tribe-y.git
```

## Run the development server

Then, navigate to the cloned repository's directory:

```sh
cd cs394-tribe-y
```

To get started, run the following command to install the dependencies:

```sh
npm install
```

To run the dev server for your app, use:

```sh
npx nx serve <application name>
```

To see all available targets to run for a project, run:

```sh
npx nx show project <application name>
```

This project uses locally-hosted LLMs to conduct fuzzy matching for QA pairs. Please refer to the "How to use TNE.ai Dashboard" for initialization/set-up instructions.

## Files in this project

Here are the key files in the root directory of this workspace:

- `.editorconfig` - Defines coding styles across different editors and IDEs
- `.gitignore` - Specifies which files Git should ignore
- `.prettierignore` - Lists files to be ignored by Prettier formatting
- `.prettierrc` - Configuration for Prettier code formatting
- `eslintrc.config.mjs` - Configuration for ESLint, a tool for identifying and fixing problems in JavaScript code
- `README.md` - This file, containing project documentation
- `nx.json` - Configuration for Nx workspace
- `package-lock.json` - Lock file for npm dependencies
- `package.json` - Project metadata and dependencies
- `tsconfig.base.json` - Base TypeScript configuration shared across the workspace
- `tsconfig.json` - TypeScript configuration for the root project
- `vitest.workspace.ts` - Configuration for Vitest, a testing framework
