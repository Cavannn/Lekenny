## Overview

For the TechJam, our team built a simple AI-powered search engine using Lynx for the UI and OpenAI APIs for AI capabilities.

The goal:
Instead of manually fiddling with filters on platforms like TikTok Shop, users can type a single sentence describing what they want, and our system will return the most relevant products with only key information in a clean, simple, and efficient manner.


## Features

Clean home page
Displays an overview of all products with a prominent search bar and action button.

AI-powered search
Processes user queries and returns a list of products with relevant key metrics, avoiding unnecessary clutter.

Dynamic product grid
Products are displayed in a sleek, responsive grid, sorted by relevance.

Detailed product view
Clicking a product card opens an enlarged view with detailed bubble-style information.

Smooth user experience
Includes timeout handling for slow connections and optimized UI rendering.

## Tech Stack
Frontend

LynxJS – React-like framework for building responsive UI

TypeScript – Strong typing for cleaner and safer code

State management – useState, useEffect, and useCallback for managing query state, responses, and navigation

Styling – App.css with responsive, modern design using grids, rounded corners, and spacing

Backend

Python with FastAPI

Pydantic for request and response modeling

Requests for OpenAI API calls

Regex (re) for parsing and formatting API responses

dotenv for secure API key management

CORS middleware for cross-origin access by the frontend

Tools

Git for version control

VS Code as IDE
## Rspeedy project

This is a ReactLynx project bootstrapped with `create-rspeedy`.

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Scan the QRCode in the terminal with your LynxExplorer App to see the result.

You can start editing the page by modifying `src/App.tsx`. The page auto-updates as you edit the file.
