# Python Interview Questions — Book

A responsive book-style web viewer for the 10-page Python Interview Questions notes.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build for production

```bash
npm run build
npm run preview
```

## Deploy to GitHub

Create a repository, then:

```bash
git init
git add .
git commit -m "Add Python interview questions book"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/python-interview-book.git
git push -u origin main
```

## Deploy to Vercel

1. Sign in to Vercel.
2. Import the GitHub repository.
3. Vercel detects Vite automatically.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click Deploy.

No backend or environment variables are required.

## Features

- Book-style page viewer
- 10 original note pages
- Page thumbnails
- Previous / next / first / last navigation
- Keyboard navigation
- Touch swipe on mobile
- Zoom controls
- Fullscreen reader
- Responsive desktop/mobile layout
