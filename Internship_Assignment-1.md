**Intern** **Task:** **AI-Assisted** **Job** **Application** **Tracker**
Stack: MERN, TypeScript, Tailwind CSS, OpenAI API Duration: 3 to 4 days

**1.** **Overview**

Build a web app where users track their job applications on a Kanban
board. AI parses job descriptions to auto-fill application details and
generate tailored resume suggestions.

**2.** **User** **Flow**

> 1\. User registers and logs in.
>
> 2\. Lands on an empty Kanban board.
>
> 3\. Clicks Add Application and pastes a job description.
>
> 4\. AI parses the JD and populates the card fields automatically. 5.
> AI generates resume bullet point suggestions for that role.
>
> 6\. User saves. Card appears under Applied.
>
> 7\. User drags cards across stages as they progress. 8. User can click
> any card to view, edit, or delete it.

**3.** **Tech** **Stack**

> • Frontend: React, TypeScript, Tailwind CSS (Vite or Next.js) •
> Backend: Node.js, Express, TypeScript
>
> • Database: MongoDB with Mongoose • Auth: JWT with bcrypt
>
> • AI: OpenAI API, JSON output mode for structured responses • State:
> React Query or Redux Toolkit

**4.** **Requirements**

**Authentication**

> • Register and login with email and password.
>
> • JWT protected routes on frontend and backend. • User stays logged in
> after page refresh.

**Kanban** **Board**

> • Five columns: Applied, Phone Screen, Interview, Offer, Rejected. •
> Cards are draggable between columns.
>
> • Each card shows company, role, date applied, and status. • Clicking
> a card opens a detail view.

**AI** **Job** **Description** **Parser**

> • User pastes a job description and clicks Parse.
>
> • Backend calls OpenAI and returns structured JSON.
>
> • Extract: company name, role, required skills, nice-to-have skills,
> seniority, location.
>
> • Populate the card fields with the extracted data. • Show a loading
> state while processing.
>
> • Handle errors if the AI returns unexpected output.

**AI** **Resume** **Suggestions**

> • After parsing, generate 3 to 5 resume bullet points tailored to the
> job. • Suggestions must be specific to that role, not generic.
>
> • Each suggestion has a copy button.

**Application** **Management**

> • Create, edit, and delete applications.
>
> • Fields: company, role, JD link, notes, date applied, status, salary
> range (optional).

**5.** **What** **We** **Look** **For**

> • TypeScript used properly. Avoid any unless necessary. • AI logic in
> a service layer, not inside route handlers.
>
> • No hardcoded API keys. Use a .env file.
>
> • Loading, error, and empty states handled on the frontend. •
> Components are structured and reusable.
>
> • App does not crash on bad input or API failures. • Commits are
> regular and meaningful.

**6.** **Stretch** **Goals**

*Optional.* *Complete* *core* *requirements* *first.* • Streaming AI
responses.

> • Dashboard with application stats.
>
> • Follow-up reminders with overdue highlights. • Search and filter on
> the Kanban board.
>
> • Export to CSV. • Dark mode.

**7.** **Submission**

> • Submit a public GitHub repository link. No ZIP files.
>
> • Include a .env.example with all required environment variables.
> Never commit your actual .env.
>
> • README must include: how to run the project, environment variables,
> and decisions you made.
>
> • Deploying the app is optional but a bonus. • Late submissions will
> not be reviewed.

*If* *you* *have* *questions,* *reach* *out* *before* *you* *start.*
*Good* *luck.*
