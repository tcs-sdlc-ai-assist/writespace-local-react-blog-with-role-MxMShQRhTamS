# WriteSpace Blog

A modern blogging platform built with React where users can write, share, and manage blog posts. Features role-based access control with admin and user roles, a clean UI powered by Tailwind CSS, and client-side data persistence using localStorage.

## Tech Stack

- **React 18** — UI library
- **React Router DOM v6** — Client-side routing
- **Tailwind CSS v3** — Utility-first CSS framework
- **Vite v6** — Build tool and dev server
- **localStorage** — Client-side data persistence

## Folder Structure

```
writespace-blog/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── src/
    ├── main.jsx                  # App entry point
    ├── App.jsx                   # Root component with route definitions
    ├── index.css                 # Tailwind CSS imports
    ├── components/
    │   ├── Avatar.jsx            # User avatar component based on role
    │   ├── BlogCard.jsx          # Blog post card for list views
    │   ├── Navbar.jsx            # Authenticated user navigation bar
    │   ├── ProtectedRoute.jsx    # Route guard for auth and admin access
    │   ├── PublicNavbar.jsx      # Navigation bar for public pages
    │   ├── StatCard.jsx          # Statistics display card for dashboard
    │   └── UserRow.jsx           # User table row for user management
    ├── pages/
    │   ├── AdminDashboard.jsx    # Admin overview with stats and recent posts
    │   ├── Home.jsx              # Blog listing page for authenticated users
    │   ├── LandingPage.jsx       # Public landing page with features and preview
    │   ├── LoginPage.jsx         # User login form
    │   ├── ReadBlog.jsx          # Single blog post view
    │   ├── RegisterPage.jsx      # User registration form
    │   ├── UserManagement.jsx    # Admin user CRUD interface
    │   └── WriteBlog.jsx         # Create and edit blog post form
    └── utils/
        ├── auth.js               # Session management (get, set, clear)
        └── storage.js            # localStorage CRUD for posts and users
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Opens the app at `http://localhost:5173` by default.

### Production Build

```bash
npm run build
```

Outputs optimized static files to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## Route Map

| Path             | Component        | Access          | Description                     |
| ---------------- | ---------------- | --------------- | ------------------------------- |
| `/`              | LandingPage      | Public          | Landing page with hero and features |
| `/login`         | LoginPage        | Public          | User login form                 |
| `/register`      | RegisterPage     | Public          | User registration form          |
| `/blogs`         | Home             | Authenticated   | All blog posts listing          |
| `/blog/new`      | WriteBlog        | Authenticated   | Create a new blog post          |
| `/blog/:id`      | ReadBlog         | Authenticated   | Read a single blog post         |
| `/blog/:id/edit` | WriteBlog        | Authenticated   | Edit an existing blog post      |
| `/write`         | WriteBlog        | Authenticated   | Create a new blog post (alias)  |
| `/edit/:id`      | WriteBlog        | Authenticated   | Edit a blog post (alias)        |
| `/dashboard`     | AdminDashboard   | Admin only      | Admin overview dashboard        |
| `/admin`         | AdminDashboard   | Admin only      | Admin dashboard (alias)         |
| `/users`         | UserManagement   | Admin only      | User management interface       |
| `*`              | —                | —               | Redirects to `/`                |

## Role-Based Access

### Roles

- **Admin** — Full access to all routes including the admin dashboard and user management. Can edit and delete any blog post.
- **User** — Can browse all blog posts, create new posts, and edit or delete their own posts. Cannot access admin routes.

### Default Admin Account

| Username | Password   |
| -------- | ---------- |
| `admin`  | `admin123` |

This account is hard-coded and cannot be deleted through the UI.

### Access Control

- **Public routes** (`/`, `/login`, `/register`) are accessible without authentication.
- **Authenticated routes** (`/blogs`, `/blog/*`, `/write`, `/edit/*`) require a valid session. Unauthenticated users are redirected to `/login`.
- **Admin routes** (`/dashboard`, `/admin`, `/users`) require an admin session. Non-admin users are redirected to `/blogs`.

## localStorage Schema

All data is persisted in the browser's localStorage under the following keys:

### `writespace_session`

Stores the current user session.

```json
{
  "id": "string",
  "userId": "string",
  "username": "string",
  "displayName": "string",
  "role": "admin | user"
}
```

### `writespace_posts`

Stores an array of blog posts.

```json
[
  {
    "id": "string (UUID)",
    "title": "string",
    "content": "string",
    "author": "string (username)",
    "authorId": "string",
    "authorRole": "admin | user",
    "date": "string (ISO 8601)"
  }
]
```

### `writespace_users`

Stores an array of registered users (excludes the hard-coded admin).

```json
[
  {
    "id": "string (UUID)",
    "displayName": "string",
    "username": "string",
    "password": "string (plain text)",
    "role": "admin | user",
    "createdAt": "string (ISO 8601)"
  }
]
```

## Deployment

### Vercel

The project includes a `vercel.json` configuration that rewrites all routes to `index.html` for client-side routing support.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com).
3. Vercel will auto-detect the Vite framework. Use the default settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy.

All routes will be handled correctly by the SPA rewrite rule defined in `vercel.json`.

### Other Static Hosts

For other static hosting providers, ensure that all requests are rewritten to `index.html` so that React Router can handle client-side routing. Build the project with `npm run build` and serve the `dist/` directory.

## Known Limitations

- **No backend server** — All data is stored in the browser's localStorage. Data is not shared across browsers or devices and will be lost if localStorage is cleared.
- **Plain text passwords** — User passwords are stored in localStorage without hashing or encryption. This is not suitable for production use.
- **No real authentication** — Session management is handled entirely on the client side with no server-side token validation.
- **No image uploads** — Blog posts support text content only.
- **No rich text editor** — Post content is plain text with whitespace preservation.
- **No pagination** — All posts are loaded and rendered at once.
- **No search or filtering** — Posts can only be browsed in reverse chronological order.
- **Single browser storage** — Data created in one browser is not available in another.
- **localStorage size limits** — Browsers typically limit localStorage to ~5–10 MB per origin.

## License

Private