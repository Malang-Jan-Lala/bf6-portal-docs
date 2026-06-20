# BF6 Portal Update Workflow

Stand: 2026-06-16

Ziel: Wenn EA/DICE BF6 Portal aktualisiert, sollen alte Daten nicht überschrieben werden. Stattdessen wird ein neuer Snapshot erstellt und mit dem alten Stand verglichen.

---

## 1. Empfohlene Ordnerstruktur für Updates

Aktuell:

```text
BF 6 Portal/
├─ 00_raw/
├─ 01_extracted/
└─ 02_ai_docs/
```

Später besser:

```text
BF 6 Portal/
├─ 00_raw/
│  ├─ 2026-06-16/
│  └─ 2026-xx-xx/
├─ 01_extracted/
│  ├─ 2026-06-16/
│  └─ 2026-xx-xx/
├─ 02_ai_docs/
└─ 04_versions/
```

Für jetzt ist aber auch okay:

```text
00_raw/
├─ bf6_all_help_md_from_browser_2026-06-16.json
├─ bf6_all_help_md_from_browser_2026-xx-xx.json
```

Wichtig: **Niemals alte Rohdaten überschreiben.**

---

## 2. Was bei einem neuen Portal-Update neu extrahiert werden muss

Wenn Portal aktualisiert wurde, diese Dateien neu erzeugen:

### Aus Browser

```text
bf6_block_names_from_browser.json
bf6_all_help_md_from_browser.json
```

### Aus Portal/API-Dateien

```text
index.d.ts
index.ts
ea_portal_main_bundle.js
```

### Daraus neu erzeugen

```text
bf6_help_blocks_clean.json
bf6_mod_api_functions.json
bf6_modlib_functions.json
bf6_block_api_reference_merged.json
bf6_block_api_reference_summary.json
codex_context.md
rules_editor_reference_ai.md
bf6_portal_ai_build_guide.md
```

---

## 3. Was verglichen werden soll

Bei Updates vergleichen:

```text
Blocknamen:
+ neue Blocks
- entfernte Blocks

Help:
+ neue Help-Dateien
- entfernte Help-Dateien
~ geänderte Help-Texte

API:
+ neue mod.* Funktionen
- entfernte mod.* Funktionen
~ geänderte Parameter
~ geänderte Rückgabetypen
~ geänderte Kommentare
```

---

## 4. Update-Regel für Codex

Codex darf nicht einfach die alte Doku weiterverwenden, wenn neue Daten existieren.

Guter Prompt:

```text
Vergleiche den alten und neuen BF6-Portal-Stand.
Liste neue, entfernte und geänderte Funktionen.
Aktualisiere danach codex_context.md.
Erfinde keine Funktionen.
```

---

## 5. Minimale Update-Checkliste

1. Portal öffnen.
2. Browser-Dumps neu ausführen.
3. Neue Rohdaten in `00_raw` sichern.
4. Neue Extraktion in `01_extracted` erzeugen.
5. Alten und neuen Stand vergleichen.
6. `02_ai_docs` aktualisieren.
7. Erst danach neues Gameplay bauen.

---

## 6. Wichtig für dein Projekt

Die aktuelle Doku ist Stand `2026-06-16`.

Wenn später ein Update kommt, behandeln wir es als neuen Stand, nicht als Ersatz ohne Kontrolle.
