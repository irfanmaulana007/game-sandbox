# Game App

A React TypeScript application built with Vite, featuring a clean architecture structure.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for bundling and development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **ESLint** for linting
- **Prettier** for code formatting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Card, etc.)
│   └── layout/         # Layout components (Header, Layout)
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
├── services/           # API services (to be implemented)
└── store/              # State management (to be implemented)
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## Features

- ✅ TypeScript support
- ✅ Tailwind CSS integration
- ✅ ESLint configuration
- ✅ Prettier configuration
- ✅ React Router setup
- ✅ Clean architecture structure
- ✅ Responsive design
- ✅ Dark mode support (structure ready)

## Next Steps

The project is set up with a clean foundation. You can now:

1. Add more pages and routes
2. Implement state management
3. Add API services
4. Create more UI components
5. Add authentication
6. Implement your game logic
