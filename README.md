# Prompt Formatter

A React web application for editing LLM prompts with markdown support.

## Features

- Upload and edit JSON files containing prompt key-value pairs
- Split-view editor with live markdown preview
- Markdown formatting toolbar
- Resizable editor with synchronized preview
- Add new keys to JSON
- Delete existing keys
- Save changes with file picker (rename support)
- Copy individual key values

## Setup

```bash
npm install
npm run dev
```

## Deployment

This app is configured for GitHub Pages deployment. See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions.

**Quick deploy:**
1. Push to GitHub: `git push origin main`
2. Enable GitHub Pages in Settings → Pages → Source: GitHub Actions
3. Your site will be live at `https://YOUR_USERNAME.github.io/prompt-md-json-formatter/`

## Usage

1. Upload a JSON file with prompt key-value pairs
2. Edit prompts using the markdown editor
3. Use formatting toolbar for quick markdown insertion
4. Add new keys or delete existing ones
5. Save changes with your preferred filename

## JSON Format

```json
{
  "prompt1": "Your prompt text here",
  "prompt2": "Another prompt with **markdown**",
  "prompt3": "# Heading\n\nMore content"
}
```