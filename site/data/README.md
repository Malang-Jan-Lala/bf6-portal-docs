# Site Data

## Purpose

`site/data/` contains JSON data used by the interactive site.

Community-editable files should stay simple and readable.

## Community-Editable Files

These files may be extended later:

- `topics.json`
- `templates.json`
- `known_bugs.json`

## Do Not Edit Manually

These extracted reference files should not be changed by hand:

- `bf6_mod_api_functions.json`
- `bf6_block_api_reference_merged.json`
- `bf6_help_blocks_clean.json`
- `bf6_selection_list_enum_map.json`

They should only be updated through the extraction/update process.

## Confirmed Links vs Suggested Links

These fields are manual/confirmed links:

- `relatedApi`
- `relatedEnums`
- `relatedTemplates`
- `relatedBugs`

Suggested links are automatically inferred from tags.

Suggested links are not validated and should be treated as needs review.

## Fields

### Topics

- `id`: stable short identifier
- `title`: visible title
- `status`: current state
- `summary`: short explanation
- `tags`: simple search/linking tags
- `relatedApi`: confirmed API links
- `relatedEnums`: confirmed enum/selection-list links
- `relatedTemplates`: confirmed template links
- `relatedBugs`: confirmed known-bug links

### Templates

- `id`: stable short identifier
- `title`: visible title
- `status`: current state
- `summary`: short explanation
- `tags`: simple search/linking tags
- `relatedApi`: confirmed API links
- `relatedEnums`: confirmed enum/selection-list links
- `relatedBugs`: confirmed known-bug links

### Known Bugs

- `id`: stable short identifier
- `title`: visible title
- `status`: current state
- `summary`: short explanation
- `affectedBf6Version`: affected BF6 version, if known
- `affectedPortalSdkVersion`: affected Portal SDK version, if known
- `affectedGodotVersion`: affected Godot version, if known
- `tags`: simple search/linking tags
- `relatedApi`: confirmed API links
- `relatedTemplates`: confirmed template links
- `workaround`: known workaround, if confirmed
- `dateObserved`: when the issue was observed
- `sourceType`: source category, for example `placeholder` or `own-test`

## Status Values

- `planned`: planned but not built yet
- `research`: needs research
- `needs-verification`: needs testing or confirmation
- `confirmed`: verified enough to list as confirmed
- `workaround`: workaround exists
- `fixed`: fixed or no longer reproducible

## Public Content Rules

- only own explanations
- only own screenshots/images
- no raw Discord text
- no copied creator scripts
- no copied EA/DICE assets or logos
- external resources only after review/permission

## Short Example

```json
{
  "id": "example-template",
  "title": "Example Template",
  "status": "planned",
  "summary": "Short placeholder summary for a future template.",
  "tags": ["example", "template"],
  "relatedApi": ["ExampleApiFunction"],
  "relatedEnums": [],
  "relatedBugs": []
}
```
