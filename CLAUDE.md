# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

```bash
# Activate virtual environment (always required)
source venv/bin/activate

# Install / sync dependencies
pip install -r requirements.txt

# Start development server (auto-reloads on file save)
python app.py
# → http://127.0.0.1:5000
```

## Architecture

Single-file Flask app (`app.py`) with Jinja2 templates and plain CSS. No build step, no bundler, no JavaScript framework.

- `app.py` — route definitions and any server-side data logic
- `templates/index.html` — single Jinja2 template; all UI lives here
- `static/css/style.css` — all styles; flexbox-based layout (column body → row sidebar+main)

**Layout structure:** `body (flex col)` → navbar (fixed height) + `content-wrapper (flex row)` → sidebar (fixed 220 px) + main (flex 1).

## Dependencies

Add new packages to `requirements.txt` and `pip install -r requirements.txt`. The `venv/` directory is local and should not be committed.
