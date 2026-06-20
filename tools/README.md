# Tools

This folder is reserved for documentation tools and local helper utilities.

Possible future tools:

* offline API/reference viewer
* JSON-to-Markdown generator
* JSON-to-HTML generator
* changelog/diff generator
* validation/check scripts

## Offline API/reference viewer

A local offline viewer may be used to search and browse:

* API functions
* Rules Editor blocks
* Help data
* Selection Lists / Enums
* validated notes

The viewer should support the handbook, not replace it.

Goal:

```text
Handbook pages explain concepts.
The API/reference viewer helps users search and inspect details.
```

## Public tool policy

Public tools should use:

* cleaned data from `data/`
* own HTML/CSS/JS
* own labels and explanations

Public tools should not include:

* raw EA/DICE bundles
* copied EA UI assets
* official logos
* copied creator scripts
* private research files
