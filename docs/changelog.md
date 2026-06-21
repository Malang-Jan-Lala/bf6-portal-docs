# Changelog

This file tracks documentation and data changes for the BF6 Portal community docs.

## 2026-06-19

Initial public documentation structure prepared.

## 2026-06-21 - Interactive site MVP

Added:

* GitHub Pages live site link
* interactive site MVP under `site/`
* API Reference search and overload grouping
* normalized search for terms like `soldier class`, `spawn ai`, and `play music`
* Selection Lists / Enums search
* Handbook Topics
* Templates structure
* Known Bugs / Workarounds structure
* related links between Topics, API, Enums, Templates, and Known Bugs
* suggested related links marked as needs review
* community-editable JSON files under `site/data/`
* `site/data/README.md`
* GitHub issue templates for bug reports, template requests, and documentation requests

Notes:

* External resources are not linked yet.
* BF6 Portal Book is not linked yet.
* External projects should only be added after review or permission.
* The site is still an early MVP and not a complete handbook yet.

Added:

* `README.md`
* `DISCLAIMER.md`
* `CONTRIBUTING.md`
* `docs/rules-editor-model.md`
* `docs/validated-patterns.md`
* `docs/update-workflow.md`
* `docs/glossary.md`
* `data/bf6_block_api_reference_merged.json`
* `data/bf6_mod_api_functions.json`
* `data/bf6_help_blocks_clean.json`
* `data/bf6_selection_list_enum_map.json`
* `examples/README.md`
* `tools/README.md`

Current scope:

* Rules Editor model
* API/function reference data
* Selection Lists / Enum mapping
* validated command behavior
* update workflow
* future searchable API/reference viewer

Not complete yet:

* full Spatial/Godot map-building guide
* complete spawnpoint setup guide
* complete capture point / flag setup guide
* full vehicle spawn setup guide
* full end-to-end Portal experience tutorial

## Future changelog format

For future Portal updates, record:

* new functions
* removed functions
* changed function signatures
* new enum values
* removed enum values
* changed Selection-List mappings
* changed editor behavior
* behavior that needs retesting
