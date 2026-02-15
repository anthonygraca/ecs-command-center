# Contributing to Titan Software Studio

Welcome to the engineering team. This document outlines the standards, workflows, and expectations for contributing to the **ECS Command Center**.

We operate as a professional software consultancy. We value **clarity**, **consistency**, and **clean code**.

---

## 🏗 The Golden Rules

1.  **No Broken Windows:** Do not commit broken code. If the CI pipeline fails, the PR cannot be merged.
2.  **One Ticket, One Branch:** Every piece of work must start with a GitHub Issue.
3.  **Code for Humans:** Write code that is easy to read, not just easy to write. Comment "why," not "what."

---

## 🔄 The Workflow (The "Titan Cycle")

We follow a strict Feature Branch workflow.

### 1. Pick a Ticket
* Go to the **Project Board**.
* Move a ticket from **Todo** to **In Progress**.
* Assign yourself to the issue.

### 2. Create a Branch
* Create a branch from `main`.
* **Naming Convention:** `type/short-description`
    * `feat/user-login` (New features)
    * `fix/navbar-overlap` (Bug fixes)
    * `docs/update-readme` (Documentation)
    * `chore/update-deps` (Maintenance)

### 3. Develop & Commit
* Make small, atomic commits.
* **Commit Message Format:** `type: subject`
    * ✅ `feat: add logout button to navbar`
    * ❌ `wip` or `fixed stuff`

### 4. Open a Pull Request (PR)
* Push your branch to GitHub.
* Open a PR against `main`.
* **Link the Issue:** In the description, type `Closes #123` (where 123 is your issue number). This automatically moves the ticket on the board.
* **Request Review:** Tag **@anthonygraca** (or anyone else) for review.

### 5. The Review Cycle
* Wait for the CI checks (Lint/Test/Build) to turn 🟢 Green.
* Address any comments left by the reviewer.
* Once approved, **Squash and Merge**.

---

## 🛠 Tech Stack & Standards

### Frontend (React)
* **Styling:** We use Tailwind CSS. Avoid inline styles.
* **State:** Use React Context or Hooks for local state.
* **Linting:** `npm run lint` must pass before pushing.

### Backend (Flask)
* **Structure:** Follow the Application Factory pattern.
* **Database:** Use SQLAlchemy models for all database interactions.
* **Testing:** New endpoints should include a basic `pytest` case.

---

## 🚨 Troubleshooting

**"The CI Failed!"**
1.  Click "Details" on the failed check in your PR.
2.  Read the log. It usually points to a specific line number (e.g., a missing semicolon or unused variable).
3.  Fix it locally, commit, and push again. The check will re-run automatically.

**"I'm Stuck."**
* **15-Minute Rule:** If you are stuck for more than 15 minutes, ask for help in Discord.
* Don't spin your wheels. We are a team.
