# Image Recoloring Tool

A modern web application that allows users to upload images and selectively recolor specific colors within the image. The tool provides an intuitive interface for selecting colors from the image and changing them to new colors with real-time preview.

## Features

- Image upload and processing
- Color quantization and extraction from images
- Interactive color selection and editing
- Similar color detection and batch recoloring
- Real-time image preview
- Processing progress indication
- Undo functionality
- Download recolored images

## Technology Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue.js)
- **UI Components**: [Nuxt UI](https://ui.nuxt.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **Image Processing**: Canvas API

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
