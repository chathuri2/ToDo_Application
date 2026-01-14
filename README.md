# Welcome to Taskflow! 🚀

Hi there! Welcome to the repository for **Taskflow**, a modern and secure Todo Application designed to help you organize your life while keeping things safe with Role-Based Access Control (ABAC).

Whether you're an Admin, a Manager, or a standard User, this app adapts to *you*.

## ✨ Features that Make it Shine

-   **Secure & Smart**: Built with [Better Auth](https://better-auth.com) for rock-solid security.
-   **Role-Based Access**: different powers for different people (Admins, Managers, and Users).
-   **Beautiful UI**: Crafted with [Tailwind CSS](https://tailwindcss.com) and a sprinkle of love for a premium feel.
-   **Fast & Responsive**: Powered by [Next.js](https://nextjs.org) for snappy performance.
-   **Local Database**: Uses SQLite with [Prisma](https://www.prisma.io) for easy setup and management.

## 🛠️ Tech Stack

We used some of the best tools in the box:
-   **Framework**: Next.js 16 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Database**: SQLite + Prisma ORM
-   **Auth**: Better Auth

## 🏁 Getting Started

Ready to take it for a spin? Follow these simple steps:

### 1. Prerequisities
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Clone & Install
Grab the code and install the dependencies:

```bash
git clone <your-repo-url>
cd todolist
npm install
```

### 3. Set up the Database
We use Prisma with a local SQLite database, so setup is a breeze. Just push the schema to your local DB:

```bash
npx prisma db push
```

### 4. Run the App!
Start the development server:

```bash
npm run dev
```

Open your browser and head over to [http://localhost:3000](http://localhost:3000). You're in! 🎉

## 📝 How to Use

1.  **Sign Up**: Create a new account on the signup page.
2.  **Explore**: Create tasks, manage your list, and see your dashboard light up.
3.  **Roles**: If you're a developer, you can modify roles in the database to test different permission levels.

## 🤝 Contributing

Found a bug? Have a cool idea? Feel free to open an issue or submit a pull request. We love hearing from you!

---
*Happy Organizing!* ✨
