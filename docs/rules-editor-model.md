# BF6 Portal – Rules Editor Model

Status: draft
Last updated: 2026-06-18

## Purpose

This document explains the observed BF6 Portal Rules Editor block model for humans and coding AIs.

It does not replace the machine-readable API files.
It explains how the visual block editor relates to TypeScript-style script generation.

Primary references:

* `01_extracted/bf6_block_api_reference_merged.json`
* `01_extracted/bf6_mod_api_functions.json`
* `01_extracted/bf6_help_blocks_clean.json`
* `01_extracted/bf6_selection_list_enum_map.json`
* `02_ai_docs/validated_command_notes.md`

This is not official EA/DICE documentation. The editor UI and API may change with future Portal updates.

---

## Core idea

The Rules Editor is a visual block-based editor.

Observed model:

* action / statement blocks do something
* value / expression blocks return something
* selection-list blocks return enum-like values
* dropdown fields restrict what values are allowed
* type icons show what kind of value a connection expects

For coding AIs, the most important rule is:

```text
Action blocks perform operations.
Value blocks provide inputs for action blocks.
Selection-list blocks usually map to TypeScript enum values.
```

---

## Terminology

Observed editor terms used in this documentation:

| Term                 | Meaning                                                                            |
| -------------------- | ---------------------------------------------------------------------------------- |
| Toolbox category     | Main category in the left sidebar, e.g. Audio, Camera, Objective, Player, Vehicles |
| Flyout               | The block list that appears after selecting a toolbox category                     |
| Flyout section       | A visual subgroup inside the flyout, e.g. Capture Point, Deploy, Game Mode         |
| Block                | A single draggable rule/editor block                                               |
| Action block         | A block that performs an operation                                                 |
| Value block          | A block that returns a value                                                       |
| Selection-list block | A value block that returns an enum-like dropdown value                             |

These terms describe observed UI behavior and are used for documentation/navigation. Script generation should still rely on extracted API signatures and help data.


## Action blocks

Action blocks are blocks that do something.

In the observed editor UI, these often appear as yellow / olive blocks.

Example:

```text
PlayMusic( MusicEventsItem )
```

Conceptually:

```ts
mod.PlayMusic(mod.MusicEvents.Core_PhaseBegin);
```

Here:

* `PlayMusic` is the action/function.
* `MusicEventsItem` provides the selected music event value.
* `Core_PhaseBegin` is the selected dropdown value.
* In TypeScript, this should be represented as `mod.MusicEvents.Core_PhaseBegin`.

---

## Value blocks

Value blocks return a value.

In the observed editor UI, these often appear as green blocks.

Examples:

```text
GetPlayerKills(eventPlayer)
GetCapturePoint(1)
MusicEventsItem
SoldierClassItem
ScreenEffectsItem
```

A value block may be used as an input to another block.

Example:

```text
MusicEventsItem
→ returns a MusicEvents value
→ can be used by PlayMusic
```

A value block placed alone may be visually possible in the editor, but it usually has no gameplay effect until another block uses its returned value.

---

## Selection Lists / `*Item` blocks

Selection-List / `*Item` blocks are value blocks that represent a limited set of allowed values.

They usually map to TypeScript enums.

Example:

```text
MusicEventsItem
→ enum: MusicEvents
→ selected value: BR_InsertionCinematic_Dropzone_Loop
```

Blockly-style export pattern:

```json
{
  "type": "MusicEventsItem",
  "fields": {
    "VALUE-0": "MusicEvents",
    "VALUE-1": "BR_InsertionCinematic_Dropzone_Loop"
  }
}
```

The random block id and x/y coordinates are editor layout data and should not be treated as semantic API data.

Important fields:

```text
type     = block type
VALUE-0  = enum / selection-list family
VALUE-1  = selected enum value
```

Correct TypeScript-style usage:

```ts
mod.MusicEvents.BR_InsertionCinematic_Dropzone_Loop
```

Do not use a raw string unless the official API explicitly expects a string or Message:

```ts
// Avoid this for enum values:
"BR_InsertionCinematic_Dropzone_Loop"
```

---

## Example: PlayMusic with MusicEventsItem

Visual idea:

```text
PlayMusic
└── MusicEventsItem
    ├── enum family: MusicEvents
    └── value: Core_PhaseBegin
```

TypeScript-style idea:

```ts
mod.PlayMusic(mod.MusicEvents.Core_PhaseBegin);
```

Meaning:

* `PlayMusic` performs the action.
* `MusicEventsItem` provides the selected enum value.
* `Core_PhaseBegin` is not a free text string.
* The correct script form should use the enum namespace.

---

## Example: SpawnAIFromAISpawner with SoldierClassItem

Visual idea:

```text
SpawnAIFromAISpawner
├── spawner
└── SoldierClassItem
    ├── enum family: SoldierClass
    └── value: Engineer
```

Correct TypeScript-style idea:

```ts
mod.SpawnAIFromAISpawner(spawner, mod.SoldierClass.Engineer);
```

Avoid:

```ts
mod.SpawnAIFromAISpawner(spawner, "Engineer");
```

Reason:

`Engineer` is an enum value, not a free string.

---

## Type icons and symbols

The Rules Editor uses icons to show expected input/output types.

Observed examples:

| Symbol / icon            | Likely meaning                         |
| ------------------------ | -------------------------------------- |
| `abc`                    | text-like value, string, or Message    |
| `123`                    | number                                 |
| player/profile icon      | Player                                 |
| group/team icon          | Team, squad, or player group           |
| objective / A1-like icon | objective-like type, e.g. CapturePoint |
| list icon                | array/list-like value                  |
| UI icon                  | UI-related value                       |

These meanings should be treated as observed UI behavior, not as guaranteed official terminology.

For script generation, always prefer the exact API signature and extracted type information over visual guessing.

---

## Color model

The observed UI appears to use colors to separate block roles.

Approximate interpretation:

| UI color       | Observed role                                      |
| -------------- | -------------------------------------------------- |
| yellow / olive | action or statement block                          |
| green          | value, expression, getter, or selection-list block |
| orange         | subroutine-related block                           |
| purple / blue  | control action / flow-control block                |

Use this only as a human navigation aid.

For coding AIs, the reliable model is:

```text
Does the block return a value?
Does the block perform an action?
What input types does it require?
What output type does it return?
What enum values are allowed?
```

---

## Blockly export fields

Blockly exports may contain fields like:

```json
{
  "type": "MusicEventsItem",
  "id": "random-editor-id",
  "x": 328,
  "y": 906,
  "fields": {
    "VALUE-0": "MusicEvents",
    "VALUE-1": "BR_InsertionCinematic_Dropzone_Loop"
  }
}
```

Interpretation:

* `type` is important.
* `fields` are important.
* `VALUE-0` often identifies the enum or selection-list family.
* `VALUE-1` often identifies the selected dropdown value.
* `id` is editor-generated and not stable.
* `x` and `y` are editor layout positions and not gameplay logic.

---

## Important rule for coding AIs

Do not invent `mod.*` functions.

Do not invent enum values.

Do not pass selection-list values as raw strings unless the API explicitly requires a string or Message.

Use this chain:

```text
Blockly block
→ output type
→ enum name
→ allowed values
→ API parameter type
→ TypeScript usage
```

Example:

```text
MusicEventsItem
→ MusicEvents
→ Core_PhaseBegin
→ PlayMusic(musicEvent: MusicEvents)
→ mod.PlayMusic(mod.MusicEvents.Core_PhaseBegin)
```

---

## Update model

This document is explanatory and should change rarely.

When EA/DICE updates Portal, update the machine-readable sources first:

```text
00_raw/
→ new raw index/help/editor data

01_extracted/
→ regenerated API/help/selection-list JSON

02_ai_docs/
→ only update explanations when behavior or concepts changed
```

For new Portal versions, compare old vs. new generated data:

* new functions
* removed functions
* changed signatures
* new enums
* removed enum values
* new RuntimeSpawn assets
* changed Selection-List / `*Item` mappings

Validated behavior should only be added to `validated_command_notes.md` after practical testing.

---

## Public documentation note

For public HTML/GitHub documentation, prefer own diagrams, own tables, and own examples.

Avoid publishing raw EA bundles, copyrighted UI screenshots, official logos, or extracted assets unless permission and usage rights are clear.


## Observed toolbox navigation

The Rules Editor toolbox appears to use visual categories and icons.

Observed examples:

| Toolbox label   | Observed icon idea      | Likely meaning                                      |
| --------------- | ----------------------- | --------------------------------------------------- |
| Audio           | music note / audio icon | audio and music related blocks                      |
| Camera          | camera icon             | camera behavior and camera views                    |
| Effects         | sparkle / effect icon   | visual or gameplay effects                          |
| Gameplay        | gamepad icon            | general gameplay logic                              |
| Objective       | objective / target icon | capture points, deploy objects, sectors, HQs, MCOMs |
| Player          | person icon             | player-related values and actions                   |
| Transform       | transform / axis icon   | vectors, positions, rotations, transforms           |
| User Interface  | UI icon                 | messages, widgets, HUD/UI blocks                    |
| Vehicles        | jet / vehicle icon      | vehicle-related values and actions                  |
| Selection Lists | list icon               | dropdown/enum-like value blocks                     |
| Literals        | quote / literal icon    | raw values such as numbers, text, booleans          |
| Variables       | variable icon           | stored values                                       |
| Subroutines     | subroutine icon         | custom reusable logic                               |
| Control Actions | control-flow icon       | flow control and execution behavior                 |

Some toolbox categories appear more than once in different color groups.
This likely separates action/statement blocks from value/expression blocks.

Example:

```text
Yellow/olive Objective
→ action-style objective blocks

Green Objective
→ value/getter-style objective blocks
```

Observed Objective subgroups include sections such as:

```text
Capture Point
Deploy
Game Mode
```

These UI section names are useful for human navigation, but script generation should still rely on the extracted API signatures and help data.

Example:

```text
GetCaptureProgress(capturePoint)
→ Capture Point value/getter logic

GetHQ(number)
→ Deploy/HQ-related objective value

GetMCOM(number)
GetSector(number)
→ game-mode objective values
```

For public documentation, these observed UI groupings should be marked as editor navigation hints, not as guaranteed official API categories.
