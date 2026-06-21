# Contributing

Thanks for wanting to help improve this unofficial BF6 Portal community documentation.

This project is meant to help Portal creators understand the Rules Editor, API functions, Selection Lists / Enums, tested behavior, and useful scripting patterns.

## Simple ways to help

You can help by sharing:

* corrections
* tested findings
* missing information
* clearer explanations
* small original examples
* notes about Portal updates

## Keep it clean

Please do not submit copied scripts, raw EA/DICE assets, official logos, private chat logs, or content you do not have permission to share.

It is okay to learn from community discussions or creator examples, but public documentation should use our own explanations and our own small examples.

## Tested or untested?

When possible, say if something was tested.

Example:

```text
Tested: This worked in-game.
Observed: This was seen in the editor.
Needs verification: This may be true, but needs more testing.
```

## Contributing to the interactive site

The interactive site uses community-editable JSON files:

* `site/data/topics.json`
* `site/data/templates.json`
* `site/data/known_bugs.json`

These files are the preferred place for small content contributions.

Do not manually edit generated/extracted reference files:

* `site/data/bf6_mod_api_functions.json`
* `site/data/bf6_block_api_reference_merged.json`
* `site/data/bf6_help_blocks_clean.json`
* `site/data/bf6_selection_list_enum_map.json`
* `data/bf6_mod_api_functions.json`
* `data/bf6_block_api_reference_merged.json`
* `data/bf6_help_blocks_clean.json`
* `data/bf6_selection_list_enum_map.json`

Confirmed/manual links:

* `relatedApi`
* `relatedEnums`
* `relatedTemplates`
* `relatedBugs`

Suggested links are automatically inferred from tags. Suggested links are not validated and should be treated as needs review.

Contribution rules:

* Keep entries small and focused.
* Use stable lowercase IDs with hyphens.
* Add tags for search and suggested links.
* Mark untested information as `needs-verification`.
* Do not copy Discord raw text.
* Do not copy creator scripts without permission.
* Do not add EA/DICE assets, logos, or copied UI assets.
* Only add own screenshots/images later when image workflow exists.
* External resources should only be added after review/permission.

Example of a good contribution:

```json
{
  "id": "example-bug-id",
  "title": "Short bug title",
  "status": "needs-verification",
  "summary": "Short original summary of the observed issue.",
  "affectedBf6Version": "unknown",
  "affectedPortalSdkVersion": "unknown",
  "affectedGodotVersion": "unknown",
  "tags": ["example", "bug"],
  "relatedApi": ["ExampleApiFunction"],
  "relatedTemplates": ["example-template"],
  "workaround": "not confirmed yet",
  "dateObserved": "unknown",
  "sourceType": "own-test"
}
```

## Goal

The goal is simple:

```text
Help the BF6 Portal community with clean, useful, easy-to-read documentation.
```

You do not need to be an expert to contribute.
