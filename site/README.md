# BF6 Portal Docs Site

## What This Folder Is

`site/` is the first MVP of the interactive BF6 Portal handbook/reference viewer.

It uses local JSON data from `site/data/`.

## Start Locally

Do not open `index.html` directly by double click. Browser security may block JSON loading.

Use a local server instead.

PowerShell example:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/site/
```

## Easy Community Files

These files can be extended later:

- `site/data/templates.json`
- `site/data/known_bugs.json`

## Do Not Edit Manually

Avoid manual edits to:

- extracted API/reference JSON files unless regenerated from source data
- `app.js` unless changing viewer logic

## Public Content Rules

- only own screenshots/images
- no raw EA/DICE bundles
- no copied EA/DICE UI assets or logos
- no copied creator scripts
- no private Discord raw text

## Future Goals

- clickable handbook concepts
- API/reference search
- template builder with editable values and copyable code
- known bugs/workarounds linked to API, templates, versions, and topics
- easier image/screenshot contribution workflow
