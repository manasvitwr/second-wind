# Second Wind
⚡ A minimal, structured productivity app to break down big tasks into organized subtasks, track daily progress, and build better habits with ease. Designed for fast input, clear overviews, and flexible recurring task management.

## Features
- **Task Breakdown** - Create main tasks and split them into subtasks for clarity
- **Task Summary** - Tap the tasks heading to see a donut chart overview of your progress at a glance
- **Dual Tracking** - Track both daily and long-term goals with activity-based habit prioritization
- **Analytics** - Dedicated analytics view for habit insights and trends (coming soon)
- **Quick Navigation** - Instantly switch between Active, Completed, and Analytics views
- **Interactive Management** - Edit, reorder, or check off items with a single tap; habits managed via Settings
- **Streak Freezes** - Protect your streaks with configurable freeze allowances (1–10 per month)
- **Immersive Experience** - Clean, dark-themed UI with sound effects for focused task management
- **Progress Overview** - Quick glance at what needs to get done, what's ongoing, and what's completed

## Installation
### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Setup Instructions
1. Clone the repository
```bash
   git clone https://github.com/manasvitwr/second-wind.git
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
   Navigate to http://localhost:5173 to see the app in action

Or visit the live app at [second-wind-tracker.vercel.app](https://second-wind-tracker.vercel.app)

## Available Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Usage Guide
### Getting Started
- **Creating Tasks**: Use the main task input to create new projects or goals
- **Adding Subtasks**: Break down complex tasks into manageable steps; habit completion is driven by subtask progress
- **Habit Management**: Add and configure habits (reset time, streak freezes) via the Settings page

### Habit & Streak Management
- Open **Settings** to add, edit, or delete habits
- Set a custom **reset time** per habit with a live countdown to the next reset (default: 9 PM)
- Enable **streak freezes** to protect streaks on off days — configurable from 1 to 10 per month, persisted across sessions
- Habits are sorted to the top of the task list based on activity

### Task Summary
- Tap the **tasks heading triangle** to open a donut chart summarizing your leaf-node task completion
- The summary modal auto-closes on scroll, swipe, or any tap outside

### Workflow Optimization
- Switch between Active, Completed, and Analytics tabs to maintain focus
- Edit tasks inline for quick adjustments without disrupting workflow
- Reorder tasks to match your current priorities and energy levels
- Use the clean interface to minimize distractions and maximize productivity

### Advanced Usage
- Create main tasks for project outlines and subtasks for specific actions
- Establish habit streaks by consistently completing daily recurring tasks
- Use streak freezes strategically to maintain long-term consistency without breaking chains
- Utilize the dark theme for extended work sessions without eye strain
