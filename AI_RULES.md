# AI Development Rules

This document provides guidelines for the AI assistant to follow when developing this application. The goal is to maintain code quality, consistency, and predictability.

## Tech Stack Overview

This project is built with a modern, type-safe, and efficient technology stack:

-   **Framework**: React with Vite for a fast development experience.
-   **Language**: TypeScript for type safety and improved developer experience.
-   **UI Components**: shadcn/ui, a collection of beautifully designed, accessible, and customizable components.
-   **Styling**: Tailwind CSS for a utility-first styling approach.
-   **Routing**: React Router (`react-router-dom`) for all client-side navigation.
-   **Icons**: `lucide-react` for a comprehensive and consistent set of icons.
-   **Forms**: React Hook Form (`react-hook-form`) for performant form state management, paired with Zod for schema validation.
-   **Data Fetching**: TanStack Query (`@tanstack/react-query`) for managing server state, including caching, refetching, and mutations.
-   **Animation**: `tailwindcss-animate` for simple and declarative animations.

## Library Usage and Coding Conventions

To ensure consistency, please adhere to the following rules:

-   **UI Components**: **Always** use components from the shadcn/ui library (`@/components/ui/*`) for building the user interface. Do not introduce other component libraries like Material UI, Ant Design, or Chakra UI. If a specific component is needed, build it using Tailwind CSS and Radix UI primitives, following the shadcn/ui style.

-   **Styling**: All styling **must** be done using Tailwind CSS utility classes. Avoid writing custom CSS files or using CSS-in-JS libraries. All colors, fonts, and spacing should adhere to the theme defined in `tailwind.config.ts`.

-   **Icons**: Use icons **exclusively** from the `lucide-react` library. This ensures visual consistency across the application.

-   **Routing**: All client-side routing should be handled by `react-router-dom`. Keep route definitions centralized, preferably in `src/App.tsx` or a dedicated routing file.

-   **State Management**:
    -   For **server state** (data fetching, caching, mutations), **always** use `@tanstack/react-query`.
    -   For simple, local **client state**, use React's built-in hooks (`useState`, `useReducer`).
    -   For complex global client state, use `useContext` with `useReducer`. Do not add other state management libraries like Redux or Zustand without explicit instruction.

-   **Forms**: All forms **must** be built using `react-hook-form` for logic and `zod` for schema validation. Integrate these with the shadcn/ui `Form` components.

-   **File Structure**:
    -   Place all pages (top-level route components) in the `src/pages` directory.
    -   Place all reusable components in the `src/components` directory.
    -   Utility functions should be placed in `src/lib/utils.ts`.

-   **Code Style**: Follow the existing code style and conventions. Adhere to the rules defined in the ESLint configuration to maintain code quality.