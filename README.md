<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# Second Wind

⚡A minimal, structured productivity app to break down big tasks into organized subtasks, track daily progress, and build better habits with ease. Designed for fast input, clear overviews, and flexible recurring task management.

## Features

- **Task Breakdown** - Create main tasks and split them into subtasks for clarity
- **Dual Tracking** - Track both daily and long-term goals, including recurring habits
- **Quick Navigation** - Instantly switch between active, completed, and habit lists
- **Interactive Management** - Edit, reorder, or check off items with a single tap
- **Immersive Experience** - Clean, dark-themed UI with sound effects for focused task management
- **Progress Overview** - Quick glance at what needs to get done, what's ongoing, and what's completed

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Setup Instructions

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd second-wind
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Access the application
   Navigate to http://localhost:5173 to see the app in action!

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Usage Guide

### Getting Started

- **Creating Tasks**: Use the main task input to create new projects or goals
- **Adding Subtasks**: Break down complex tasks into manageable steps by adding subtasks
- **Habit Tracking**: Create recurring habits for daily routines and long-term consistency

### Productivity Tips

- **Progressive Breakdown**: Start with broad tasks and gradually add subtasks as you work
- **Habit Stacking**: Chain new habits with existing routines for better consistency
- **Priority Management**: Use the different views to focus on what matters most each day
- **Completion Sounds**: Enjoy auditory feedback that reinforces task completion

### Workflow Optimization

- Switch between Active, Completed, and Habit tabs to maintain focus
- Edit tasks inline for quick adjustments without disrupting workflow
- Reorder tasks to match your current priorities and energy levels
- Use the clean interface to minimize distractions and maximize productivity

### Advanced Usage

- Create main tasks for project outlines and subtasks for specific actions
- Establish habit streaks by consistently completing daily recurring tasks
- Utilize the dark theme for extended work sessions without eye strain
- Leverage the quick toggle between views to maintain context awareness
>>>>>>> 5f3f2e34165266ad011508632e7613796da5369d
