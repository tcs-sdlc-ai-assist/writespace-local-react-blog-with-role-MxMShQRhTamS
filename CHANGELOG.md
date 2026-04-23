# Changelog

All notable changes to the WriteSpace Blog project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2024-12-01

### Added

- **Public Landing Page** — Hero section with gradient background, feature cards highlighting Write Freely, Build Community, and Admin Tools, and a latest posts preview section for unauthenticated visitors.
- **User Authentication** — Login and registration forms with client-side session management using localStorage. Authenticated sessions are stored under the `writespace_session` key.
- **Default Admin Account** — Hard-coded admin credentials (`admin` / `admin123`) available out of the box for immediate access to admin features.
- **Role-Based Access Control** — Two roles (`admin` and `user`) with route guards via the `ProtectedRoute` component. Admin-only routes redirect non-admin users to `/blogs`. Unauthenticated users are redirected to `/login`.
- **Avatar System** — Role-aware avatar component displaying a crown emoji (👑) for admins and a book emoji (📖) for regular users, used consistently across the navbar, blog cards, user rows, and post views.
- **Blog CRUD Operations** — Full create, read, update, and delete functionality for blog posts. Users can create and manage their own posts. Admins can edit and delete any post. Posts are persisted in localStorage under the `writespace_posts` key.
- **Blog Listing Page** — Authenticated home page (`/blogs`) displaying all posts in reverse chronological order as styled cards with accent color borders, truncated content previews, author avatars, and edit shortcuts.
- **Single Blog Post View** — Dedicated read page (`/blog/:id`) with full post content, author information, date display, and inline edit/delete actions with a confirmation dialog for deletions.
- **Write/Edit Blog Form** — Shared form component for creating new posts and editing existing ones, with title and content fields, character count display, client-side validation, and ownership checks for edit mode.
- **Admin Dashboard** — Overview page (`/dashboard`) with stat cards showing total posts, total users, admin count, and member count. Includes quick action buttons and a recent posts table with edit and delete capabilities.
- **User Management** — Admin interface (`/users`) for creating new users with display name, username, password, and role selection. Displays all users in a table with role badges, join dates, and delete actions. Prevents deletion of the default admin account and self-deletion.
- **Navigation System** — Authenticated navbar (`Navbar`) with desktop dropdown menu, mobile hamburger menu, role-aware navigation links, and logout functionality. Public navbar (`PublicNavbar`) with login/register links for unauthenticated visitors.
- **localStorage Persistence** — All data (sessions, posts, users) stored in the browser's localStorage with JSON serialization. Utility modules (`auth.js` and `storage.js`) provide a clean API for all storage operations.
- **Responsive Design** — Fully responsive UI built with Tailwind CSS v3, supporting mobile, tablet, and desktop viewports across all pages and components.
- **Vercel Deployment Configuration** — `vercel.json` with SPA rewrite rules to support client-side routing on Vercel hosting.
- **Vite Build Setup** — Vite v6 configuration with React plugin, PostCSS, Autoprefixer, and Tailwind CSS for fast development and optimized production builds.