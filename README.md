# BF6 Portal Community Docs

Unofficial BF6 Portal community documentation based on extracted API data, editor observations, and practical testing.

Live site:
https://malang-jan-lala.github.io/bf6-portal-docs/site/

The live site is an early MVP with API search, Selection List / Enum search, Templates, Known Bugs, Handbook Topics, and related links.

Maintainer: JohnnySack (Malang-jan-Lala)

This project is intended to help Portal creators understand the BF6 Portal Rules Editor, API functions, Selection Lists / Enums, and validated scripting patterns.

## Current status

This documentation is work in progress.

Current focus:

* Rules Editor model
* API reference data
* Selection Lists / Enum mapping
* validated command behavior
* update workflow
* future human-readable handbook structure
* interactive site MVP
* Handbook Topics
* Templates and Known Bugs structure

## Current scope

This project is currently focused on BF6 Portal Rules Editor and scripting reference data.

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

These areas are planned as future research topics and should be documented separately when they are better understood.


## Project structure

```text

docs/
├── getting-started.md
├── rules-editor-model.md
├── validated-patterns.md
├── update-workflow.md
├── glossary.md
├── changelog.md
├── api-reference.md
├── selection-lists.md
├── handbook-structure.md
└── project-structure.md

data/
├── bf6_block_api_reference_merged.json
├── bf6_mod_api_functions.json
├── bf6_help_blocks_clean.json
└── bf6_selection_list_enum_map.json

examples/
└── README.md

tools/
└── README.md

site/
├── index.html
├── style.css
├── app.js
├── README.md
└── data/
    ├── bf6_block_api_reference_merged.json
    ├── bf6_mod_api_functions.json
    ├── bf6_help_blocks_clean.json
    ├── bf6_selection_list_enum_map.json
    ├── topics.json
    ├── templates.json
    ├── known_bugs.json
    └── README.md
```


## Important note

See also:
* [Disclaimer](DISCLAIMER.md)
* [License](LICENSE.md)

This is not official EA/DICE documentation.

The Portal API, Rules Editor, assets, and behavior may change with future updates or seasons.

## Public content policy

This project should use:

* own explanations
* own examples
* cleaned reference data
* practical validation notes

This project should not publish:

* raw EA/DICE bundles
* copied EA UI assets
* official logos
* copied Creator scripts
* unreviewed raw dumps


## Documentation sections

Start here:

* [Getting Started](docs/getting-started.md)
* [Rules Editor Model](docs/rules-editor-model.md)
* [API Reference](docs/api-reference.md)
* [Selection Lists / Enums](docs/selection-lists.md)
* [Validated Patterns](docs/validated-patterns.md)
* [Update Workflow](docs/update-workflow.md)
* [Glossary](docs/glossary.md)
* [Handbook Structure](docs/handbook-structure.md)
* [Project Structure](docs/project-structure.md)
* [Changelog](docs/changelog.md)
* [Contributing](CONTRIBUTING.md)
* [Disclaimer](DISCLAIMER.md)

More pages will be added later.


