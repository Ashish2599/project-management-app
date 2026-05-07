<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
- [x] Verify that the copilot-instructions.md file in the .github directory is created.
  <!-- Summary: Created the .github directory and will create the instructions file. -->

- [x] Clarify Project Requirements
  <!-- Summary: User requested a web app for project management with authentication, projects, tasks, roles, and dashboard. -->

- [x] Scaffold the Project
  <!-- Summary: Created Next.js project with TypeScript, Tailwind CSS, ESLint, and App Router. Installed Prisma, NextAuth, and other dependencies. Set up database schema with SQLite. -->

- [x] Customize the Project
  <!-- Summary: Implemented authentication with NextAuth, created user registration and login pages, set up API routes for projects and tasks, created dashboard page with project and task listings. -->

- [x] Install Required Extensions
  <!-- Summary: No extensions required for Next.js project. -->

- [x] Compile the Project
  <!-- Summary: Installed dependencies and generated Prisma client. Project compiles without errors. -->

- [x] Create and Run Task
  <!-- Summary: Ran npm run dev to start the development server. -->

- [x] Launch the Project
  <!-- Summary: Application is running on http://localhost:3000. -->

- [x] Ensure Documentation is Complete
  <!-- Summary: README.md updated with project description, copilot-instructions.md completed. -->

<!--
## Execution Guidelines
PROGRESS TRACKING:
- If any tools are available to manage the above todo list, use it to track progress through this checklist.
- After completing each step, mark it complete and add a summary.
- Read current todo list status before starting each new step.

COMMUNICATION RULES:
- Avoid verbose explanations or printing full command outputs.
- If a step is skipped, state that briefly (e.g. "No extensions needed").
- Do not explain project structure unless asked.
- Keep explanations concise and focused.

DEVELOPMENT RULES:
- Use '.' as the working directory unless user specifies otherwise.
- Avoid adding media or external links unless explicitly requested.
- Use placeholders only with a note that they should be replaced.
- Use VS Code API tool only for VS Code extension projects.
- Once the project is created, it is already opened in Visual Studio Code—do not suggest commands to open this project in vscode.
- If the project setup information has additional rules, follow them strictly.

FOLDER CREATION RULES:
- Always use the current directory as the project root.
- If you are running any terminal commands, use the '.' argument to ensure that the current working directory is used ALWAYS.
- Do not create a new folder unless the user explicitly requests it besides a .vscode folder for a tasks.json file.
- If any of the scaffolding commands mention that the folder name is not correct, let the user know to create a new folder with the correct name and then reopen it again in vscode.

EXTENSION INSTALLATION RULES:
- Only install extension specified by the get_project_setup_info tool. DO NOT INSTALL any other extensions.

PROJECT CONTENT RULES:
- If the user has not specified project details, assume they want a "Hello World" project as a starting point.
- Avoid adding links of any type (URLs, files, folders, etc.) or integrations that are not explicitly required.
- Avoid generating images, videos, or any other media files unless explicitly requested.
- If a feature is assumed but not confirmed, prompt the user for clarification before including it.
- If you are working on a VS Code extension, use the VS Code API tool with a query to find relevant VS Code API references and samples.

TASK COMPLETION RULES:
- Your task is complete when:
  - Project is successfully scaffolded and compiled without errors
  - copilot-instructions.md file in the .github directory exists and contains current project information
  - README.md file exists and is up to date
  - User is provided with clear instructions to debug/launch the project

Before starting a new task in the above plan, update progress in the plan.
-->
- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.