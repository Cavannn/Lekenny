# Overview

This project was built for TikTok TechJam 2025, Track 4: Building UI for the AI era with Lynx.

It is a proof-of-concept AI-driven search engine for e-commerce (inspired by TikTok Shop). Instead of relying on tedious manual filters, users simply enter a natural language query, and the system:

Sends the query to a FastAPI backend.

The backend uses OpenAI APIs to process the request and return structured product recommendations.

The frontend displays an AI-generated summary of results and dynamically updates the product catalogue.


# Features

## 1. AI-Powered Search

Users type free-form queries like “hoodie under $30, shipping 3 days”.
The AI parses intent, extracts key product requirements, and returns a ranked list.

How it’s implemented:

The query is managed in frontend state (message in App.tsx) via Lynx’s useState.

On submit (handleSubmit):

Sends a POST request to the backend with { message }.

Uses AbortController with a 12s timeout to prevent hanging.

Displays loading, error, or response text states depending on fetch outcome.

The backend:

Exposes a FastAPI /chat endpoint.

Forwards the query to OpenAI’s API.

Uses regex post-processing to extract structured product info into JSON.

Responds with { response: <summary>, products: <array> }.

Frontend parses the array with toUIProduct → converts OpenAI’s fields (title, price, image_url, description) into strongly typed Product objects.

## 2. Product Grid

Products are displayed in a scrollable two-column grid. Each product is shown as a card with:

Image (default fallback from picsum.photos if missing).

Title (truncated at 48 chars).

Price (parsed into number, formatted to 2 decimals).

Shipping details (if available).

Tags (up to 3 visible, truncated at 12 chars).

Action button: “Add to cart”.

How it’s implemented:

Grid is rendered via a map() over the products state.

Utility functions:

parsePrice: extracts numbers from messy strings ("$12.99 USD" → 12.99).

truncate: ensures long text doesn’t break layout.

## 3. Product Detail Page

Clicking a product opens a dedicated page with full details and action buttons.

How it’s implemented:

Navigation handled by:

selectedProduct state (holds product object).

showProductPage state (toggles between grid view & detail view).

When showProductPage === true:

App.tsx returns <ProductPage /> instead of main grid.

<ProductPage /> (separate component):

Shows larger image, tags, price, shipping, etc.

Includes “Back” button (calls handleBackFromProduct).

Includes actions: handleAddToCart and handleBuyNow.

These currently log to console but are ready to connect to checkout flow.

## 4. Loading & Error Handling

Provides feedback to users during fetch requests.

How it’s implemented:

loading state shows “Loading…” message.

error state shows red error message, e.g. “Request timed out. Check backend URL and network.”

Error types handled:

Timeout (AbortError).

Non-200 responses (HTTP errors).

Network errors (backend unreachable).

# Tech Stack
## Frontend

LynxJS
 – React-like framework.

Hooks: useState, useEffect, useCallback.

TypeScript – strong typing for Product model.

CSS – responsive cards, grid layout, and branding.

## Backend

FastAPI – web server & API routing.

Pydantic – schema validation.

Requests – calls OpenAI API.

dotenv – environment key management.

Regex – parses AI response JSON.

CORSMiddleware – frontend-backend communication.

## Tools

Git for version control

VS Code as IDE

# Setup & Installation
## 1. Clone Repository

'''bash
git clone https://github.com/<your-repo>/tiktok-techjam-2025.git
cd tiktok-techjam-2025
'''

## 2. Backend Setup (FastAPI)
'''bash
cd backend
python -m venv venv

# Activate venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic requests python-dotenv
'''


## Required: Create .env file in /backend with your OpenAI key:

OPENAI_API_KEY=sk-xxxxxxx


Run backend:

'''bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
'''


Backend now available at:
http://localhost:8000/chat

3. Frontend Setup (Lynx)
'''bash
cd frontend
npm install
npm run dev
'''


package.json already contains all required dependencies:

@lynx-js/react (runtime)

@lynx-js/rspeedy (build tool)

@lynx-js/preact-devtools, typescript, vitest (dev/test)

Open browser at link provided in terminal (e.g. http://localhost:3000).

