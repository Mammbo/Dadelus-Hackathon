# AI Agent Instructions for Dadelus-Hackathon Frontend

## Project Overview
This is a React TypeScript frontend project bootstrapped with Create React App. The project uses modern React patterns with TypeScript and includes TailwindCSS for styling.

## Key Files and Directories
- `/src/App.tsx`: Main application component
- `/src/components/`: Directory for reusable React components
- `/src/pages/`: Directory for page-level components
- `/public/`: Static assets and HTML template

## Development Setup
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

The app will run at http://localhost:3000 with hot reload enabled.

## Project Conventions
- TypeScript is strictly enforced (see `tsconfig.json`)
- Tailwind CSS is used for styling (configured with PostCSS)
- Components are organized by feature in `/src/components` and `/src/pages`
- Web vitals are tracked using the built-in `reportWebVitals` utility

## Testing
- Jest and React Testing Library are configured for testing
- Tests are co-located with components (e.g., `Component.test.tsx`)
- Run tests with `npm test`

## Styling Guidelines
- Use Tailwind utility classes for styling
- Custom CSS should be minimal and placed in component-specific CSS files
- Global styles are in `index.css` and `App.css`

## Dependencies
- React 19.2.0
- TypeScript 4.9.5
- Tailwind CSS 4.1.16
- Testing libraries (Jest, React Testing Library)

## Build and Deployment
- Production builds are created with `npm run build`
- The build output is in the `/build` directory
- All environment-specific configurations should use `.env` files

## Common Workflows
1. Creating a new component:
   - Place in appropriate directory (`components` or `pages`)
   - Use TypeScript for type safety
   - Include corresponding test file
   
2. Adding new dependencies:
   - Use `npm install` and ensure types are included
   - Update package.json with exact versions

## Notes
- Do not use `npm run eject` unless absolutely necessary
- Keep components focused and maintain clear separation of concerns
- Ensure all new code has proper TypeScript types