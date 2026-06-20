# API Reference

This page explains how the BF6 Portal API/reference data is organized in this documentation.

The detailed machine-readable reference data is stored in the `data/` folder.

## Data sources

Current reference files:

```text id="8mv2uc"
data/
├── bf6_block_api_reference_merged.json
├── bf6_mod_api_functions.json
├── bf6_help_blocks_clean.json
└── bf6_selection_list_enum_map.json
```

## What these files contain

### `bf6_mod_api_functions.json`

Contains extracted `mod.*` API function information.

Use this file to check:

* function names
* parameters
* return types
* TypeScript-style signatures

### `bf6_block_api_reference_merged.json`

Contains merged Rules Editor block/API reference information.

Use this file to connect:

* block names
* categories
* API usage
* editor-related metadata

### `bf6_help_blocks_clean.json`

Contains cleaned Help/Rules Editor block information.

Use this file to understand:

* block descriptions
* editor-facing behavior
* Blockly-style examples where available

### `bf6_selection_list_enum_map.json`

Contains Selection-List / `*Item` block mappings.

Use this file to understand:

* dropdown blocks
* matching TypeScript enums
* allowed enum values
* likely usage targets

## Important rule

Do not invent API functions or enum values.

Check the reference data first.

Example:

```ts id="6vwbbl"
mod.SpawnAIFromAISpawner(spawner, mod.SoldierClass.Engineer);
```

Prefer this over raw strings like:

```ts id="qequvj"
mod.SpawnAIFromAISpawner(spawner, "Engineer");
```

## Future viewer

A searchable API/reference viewer is planned.

The viewer should allow users to search:

* functions
* blocks
* categories
* Selection Lists
* enum values
* validated notes

The viewer should support the handbook, not replace it.
