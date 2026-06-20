# Glossary

Short explanations for common BF6 Portal documentation terms.

## Action block

A Rules Editor block that performs an operation.

Example:

```ts
mod.PlayMusic(mod.MusicEvents.Core_PhaseBegin);
```

## Value block

A block that returns a value and is usually used inside another block.

Example:

```text
GetPlayerKills(eventPlayer)
MusicEventsItem
SoldierClassItem
```

## Selection List

A dropdown-like block that provides one allowed value from a fixed list.

Usually maps to a TypeScript enum.

## Enum

A fixed list of allowed values.

Example:

```ts
mod.SoldierClass.Engineer
```

## Raw string

A normal text value like `"Engineer"`.

Do not use raw strings for enum values unless the API explicitly expects a string.

## Rules Editor

The visual block editor used to create Portal logic.

## API function

A script function available through the BF6 Portal scripting API.

Example:

```ts
mod.DisplayNotificationMessage(...)
```

## Validated behavior

Behavior that was practically tested in the editor or in-game.

## Observed behavior

Behavior that was seen in the editor, export, or UI, but may still need more testing.

## Needs verification

A note or assumption that should be tested before being treated as reliable.

## Spatial / Godot

The map-layout editing side of Portal. This includes topics like spawnpoints, objectives, map objects, and Spatial JSON exports.

This is separate from Rules Editor scripting.
