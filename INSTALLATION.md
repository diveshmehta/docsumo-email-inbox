# Installation Guide for Email Inbox Prototype

This guide will help you set up and run the Email Inbox prototype locally on your machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (version 18 or higher)
   - Check if installed: `node --version`
   - Download from: https://nodejs.org/

2. **npm** (comes with Node.js) or **yarn**
   - Check if installed: `npm --version`
   - npm is included with Node.js installation

3. **Git** (optional, for version control)
   - Check if installed: `git --version`
   - Download from: https://git-scm.com/

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd "/Users/diveshmehta/Documents/Case Project"
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install:
- React 18 and React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- shadcn/ui components and dependencies
- React Router
- Lucide React (icons)
- date-fns (date formatting)
- And other required dependencies

### 3. Verify Installation

After installation completes, verify that all dependencies are installed correctly:

```bash
npm list --depth=0
```

You should see all packages listed without errors.

## Running the Prototype

### Start Development Server

```bash
npm run dev
```

This will:
- Start the Vite development server
- Open the application (usually at `http://localhost:5173`)
- Enable hot module replacement (HMR) for instant updates

### Access the Application

Once the server starts, you can:

1. **Open in browser**: Navigate to the URL shown in the terminal (typically `http://localhost:5173`)
2. **Navigate to Email Inbox**: Click on "Email Inbox" in the sidebar, or go directly to `http://localhost:5173/inbox`

## Features to Test

The Email Inbox prototype includes:

1. **Email List View** (Left Panel)
   - View all emails with classification badges
   - See workflow status indicators
   - Filter by document type (BOL, Tender, Lumper Receipt)
   - Search functionality

2. **Email Detail View** (Center Panel)
   - Full email content
   - Attachments list
   - Extracted data display
   - Email metadata

3. **Classification & Workflow Panel** (Right Panel)
   - Document classification with confidence scores
   - Workflow execution status
   - Action details
   - Case links

## Mock Data

The prototype uses realistic mock data including:
- 5 sample emails with different classifications
- BOL (Bill of Lading) documents
- Tender submissions
- Lumper receipts
- Various workflow states (pending, in_progress, completed)
- Extracted data fields
- Case associations

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual port number.

### Module Not Found Errors

If you encounter "module not found" errors:

```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### TypeScript Errors

If you see TypeScript errors, ensure TypeScript is properly installed:

```bash
npm install -D typescript @types/react @types/react-dom
```

### Build Errors

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
Case Project/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   └── Layout.tsx   # Main layout component
│   ├── pages/
│   │   └── EmailInbox.tsx  # Email inbox prototype
│   ├── hooks/
│   │   └── useEmailData.ts  # Mock data hook
│   ├── lib/
│   │   └── utils.ts     # Utility functions
│   └── App.tsx          # Main app component
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Additional Commands

- **Lint code**: `npm run lint`
- **Type check**: `npx tsc --noEmit`
- **Format code**: Consider adding Prettier for code formatting

## Next Steps

After running the prototype:

1. Explore the email inbox interface
2. Click on different emails to see details
3. Test the classification filters
4. Review workflow execution statuses
5. Check extracted data for each document type

## Support

If you encounter any issues:
1. Check that all dependencies are installed correctly
2. Ensure Node.js version is 18 or higher
3. Try clearing the cache: `npm cache clean --force`
4. Reinstall dependencies as shown in troubleshooting section
