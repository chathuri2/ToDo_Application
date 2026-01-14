# Project Overview

### Correctness
I've made sure the app ticks all the boxes. It's a full CRUD system, but the interesting part is the permissions. I didn't just hide buttons on the frontend; I implemented real ABAC checks on the backend.
- **Users**: Can create and edit their own stuff. Deletion is tricky—I restricted it to "drafts" only, just like the requirements said.
- **Managers**: Read-only access to everything.
- **Admins**: Can see everything and delete anything, but I blocked them from creating tasks to keep their role purely administrative.

### Code Quality
I tried to keep things clean and scalable.
- **Backend**: I put the ABAC policies in the API handlers so we don't repeat logic.
- **Database**: Using Prisma made the schema updates super easy, especially for the relations.
- **Structure**: Separation of concerns is key—auth logic is in `lib/`, components are reusable, and pages are just for layout.

### User Experience
I wanted it to feel snappy.
- Used **React Query** so the state updates instantly without pages refreshing.
- The UI handles errors gracefully—if you try to do something you're not allowed to, it won't crash, just let you know.
- I used **shadcn/ui** because it looks great out of the box and saves a ton of time on styling.

### Concepts (ABAC)
Implementing ABAC was the main challenge. It’s not just "Admins can do X"; it's "User can do X *if* they own the resource *and* it's in a specific state."
I handled this by checking both the user's role (from the session) and the todo's actual data (from the DB) before performing any action. This makes the security solid even if someone bypasses the UI.