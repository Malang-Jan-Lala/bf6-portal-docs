# Selection Lists / Enums

This page explains how Selection Lists and Enums are handled in this documentation.

## Purpose

Selection Lists are dropdown-like value blocks in the Rules Editor.

They are important because they restrict which values are allowed.

In script/API usage, many Selection-List values should be treated as enum values, not as raw strings.

## Main data file

The detailed mapping is stored here:

```text
data/bf6_selection_list_enum_map.json
````

This file helps connect:

* Selection-List / `*Item` block names
* enum names
* allowed values
* likely API usage targets
* TypeScript-style usage

## Example

Visual/block idea:

```text
SoldierClassItem
→ SoldierClass
→ Engineer
```

Correct TypeScript-style usage:

```ts
mod.SoldierClass.Engineer
```

Avoid using raw strings for enum values:

```ts
"Engineer"
```

## Why this matters

Selection Lists help prevent invalid values.

A future API/reference viewer should make these mappings searchable, so creators can quickly find the correct enum and allowed values.
