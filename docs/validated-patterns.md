# BF6 Portal – Validated Command Notes

Stand: 2026-06-18

## Zweck dieser Datei

Diese Datei ist keine Prototype-Liste und kein Spielkonzept.

Ziel ist eine saubere, KI-lesbare Zusatzdokumentation zur extrahierten BF6-Portal-API.  
Sie erklärt, welche Befehle, Events und Muster im Spiel praktisch bestätigt wurden, welche Nutzung sicher wirkt und welche Muster vermieden werden sollten.

Diese Datei ergänzt:

- `01_extracted/bf6_block_api_reference_merged.json`
- `01_extracted/bf6_mod_api_functions.json`
- `01_extracted/bf6_help_blocks_clean.json`
- `01_extracted/bf6_selection_list_enum_map.json`

Community-Code wird nicht 1:1 übernommen. Community-Beispiele dienen nur zur Musteranalyse.

---

## Dokumentationsschema

Ein Befehl oder Muster sollte möglichst so dokumentiert werden:

- Name
- Kategorie
- Kurzbeschreibung
- Bestätigtes Verhalten
- Sichere Nutzung
- Warnungen / Anti-Patterns
- Offene Fragen

---

## Selection Lists / Enum Mapping

Die Datei `01_extracted/bf6_selection_list_enum_map.json` verbindet Blockly-Selection-List- / `*Item`-Blöcke mit TypeScript-Enums, erlaubten Werten und passenden API-Funktionen.

Diese Datei ist wichtig für Codex und andere Coding-KIs, weil Selection-List-Werte nicht als freie Strings geraten werden sollen.

Beispiel:

```ts
mod.SpawnAIFromAISpawner(spawner, mod.SoldierClass.Engineer);
```

Nicht verwenden:

```ts
mod.SpawnAIFromAISpawner(spawner, "Engineer");
```

Die Map wurde automatisch aus diesen Quellen erzeugt:

```text
00_raw/index.d.ts
01_extracted/bf6_help_blocks_clean.json
01_extracted/bf6_block_api_reference_merged.json
```

Aktueller Stand:

* 70 TypeScript-Enums
* 593 Funktionen
* 67 Selection-List- / `*Item`-Blöcke
* 67 davon mit Enum-Zuordnung
* 0 ohne Enum-Zuordnung

Warnungen innerhalb der Map müssen bei Nutzung geprüft werden, z. B. wenn ein Help-Beispiel nicht exakt zum geparsten Enum passt oder kein Usage Target automatisch gefunden wurde.


# Validierte Befehle und Muster

## DisplayNotificationMessage

Kategorie: UI / Debug / Spielerfeedback

Kurzbeschreibung:  
Zeigt eine Benachrichtigung im Spiel an. Die Nachricht erscheint rechts unten in einer grünen Box.

Bestätigtes Verhalten:

- Einfache numerische Nachrichten funktionieren.
- Nachrichten können global angezeigt werden.
- Nachrichten können gezielt an `eventPlayer` gesendet werden.
- Spielerbezogene Nachrichten erscheinen beim betreffenden Spieler, z. B. beim Deploy/Respawn.

Sichere Nutzung:

- Debug-Meldungen
- Missionshinweise
- Fortschrittsanzeigen
- Spielerbezogene Events

Warnungen:

- Notifications werden in einer Queue/Pipeline angezeigt.
- Mehrere schnelle Events erscheinen verzögert, ungefähr nacheinander.
- Eine spät angezeigte Message gehört nicht zwingend zum aktuellen Ereignis.

Empfehlung:

- Für Debugging kurze Zahlen nutzen.
- Für echte Inhalte später `strings.json` verwenden.
- Wenn möglich an `eventPlayer` senden statt global, damit Bot-Events nicht den Spieler mit globalen Meldungen stören.

---

## OnGameModeStarted

Kategorie: Event / Rundenstart

Kurzbeschreibung:  
Wird ausgelöst, wenn der Modus bzw. die Runde startet.

Bestätigtes Verhalten:

- Das Event löst aus.
- Eine Start-Notification kann angezeigt werden.
- In Bot-Setups können Bots schon aktiv sein, bevor der menschliche Spieler wirklich deployed ist.

Sichere Nutzung:

- globale Initialisierung
- UI vorbereiten
- Startvariablen setzen
- kontrollierte Startsequenzen

Warnungen:

- Nicht davon ausgehen, dass der menschliche Spieler schon bereit ist.
- Für Human-spezifische Logik besser zusätzlich auf Human-Deploy warten.

Empfehlung:

- Für globale Initialisierung nutzen.
- Für Spielstart mit Bots später ein Human-Deploy- oder AI-Start-Control-Muster einbauen.

---

## OnPlayerDeployed

Kategorie: Event / Spieler-Spawn

Kurzbeschreibung:  
Wird ausgelöst, wenn ein Spieler oder Bot deployed/spawnt.

Bestätigtes Verhalten:

- Löst beim menschlichen Spieler beim Spawn aus.
- Löst auch nach Tod/Respawn wieder aus.
- Spielerbezogene Message an `eventPlayer` funktioniert.
- Bots können dieses Event ebenfalls auslösen.

Sichere Nutzung:

- Spielerbezogene Startmeldung
- Objective-Hinweis beim Spawn
- Initialisierung pro Spieler
- Respawn-Hinweise

Warnungen:

- `eventPlayer` kann ein Bot sein.
- In aktuellen Tests waren Bots teilweise schon vor dem menschlichen Deploy im Spiel.
- Nicht automatisch als Human-Only-Event behandeln.

Empfehlung:

- Für UI/Missionshinweise an `eventPlayer` senden.
- Für reine Human-Logik später Human-vs-AI-Prüfung einbauen.

---

## OnPlayerEarnedKill

Kategorie: Event / Kill-Logik

Kurzbeschreibung:  
Wird ausgelöst, wenn ein Spieler einen Kill erzielt.

Bestätigtes Verhalten:

- `eventPlayer` ist der Killer.
- `eventOtherPlayer` ist das Opfer.
- Löst auch bei Bot-Kills aus.
- Funktioniert zuverlässig für Kill-Ziele und Fortschrittslogik.

Sichere Nutzung:

- Kill-Missionen
- Score-/Objective-Systeme
- Fortschrittsprüfung
- Auswertung von Killer/Opfer

Warnungen:

- Bot-Kills lösen das Event ebenfalls aus.
- Ein globaler eigener Counter wird durch Bot-Kills verfälscht.

Empfehlung:

- Für spielerbezogene Kill-Ziele `GetPlayerKills(eventPlayer)` verwenden.
- Keine einfachen globalen Kill-Counter verwenden, wenn Bots aktiv sind.
- Für Opferbezug `eventOtherPlayer` verwenden.

---

## OnPlayerDied

Kategorie: Event / Death-Logik

Kurzbeschreibung:  
Wird ausgelöst, wenn ein Spieler stirbt.

Bestätigtes Verhalten:

- `eventPlayer` ist das Opfer.
- `eventOtherPlayer` ist der Killer.
- Funktioniert für Death-Messages und Missionsreaktionen.
- Löst auch bei Bot-Toden aus.

Sichere Nutzung:

- Tod anzeigen
- Respawn-/Fail-Logik
- Death-abhängige Missionen
- Opfer/Killer-Zuordnung prüfen

Warnungen:

- Auch Bot-Tode können dieses Event auslösen.
- Für Kill-Fortschritt ist `OnPlayerEarnedKill` direkter.

Empfehlung:

- Reaktionen auf Tod an `eventPlayer` senden.
- Kill-Ziele über `OnPlayerEarnedKill` behandeln.

---

## OnMandown

Kategorie: Event / Downed-State / Revive

Kurzbeschreibung:  
Wird ausgelöst, wenn ein Spieler in den Mandown-Zustand geht.

Bestätigtes Verhalten:

- Event existiert und löst aus.
- Im Test erschienen beim eigenen Down/Death beide Parameter-Messages.
- Für eindeutige Kill-/Death-Logik war es weniger klar als `OnPlayerEarnedKill` und `OnPlayerDied`.

Sichere Nutzung:

- Downed-/Revive-Systeme
- Rettungsmissionen
- Verwundetenlogik

Warnungen:

- Nicht als primäre Kill-/Death-Logik nutzen.
- Parameterverhalten kann je nach Situation unklar wirken.

Empfehlung:

- Für Kill/Death besser `OnPlayerEarnedKill` und `OnPlayerDied` verwenden.
- `OnMandown` später separat für Revive-/Downed-Systeme dokumentieren.

---

## GetPlayerKills

Kategorie: Player Stats / Mission Progress

Kurzbeschreibung:  
Liest die Killanzahl eines Spielers.

Bestätigtes Verhalten:

- Stimmt mit dem Scoreboard überein.
- Assists zählen nicht als Kills.
- Tod setzt den Wert nicht zurück.
- Respawn behält den Runden-Killstand.
- Funktioniert zuverlässig für einfache Kill-Fortschritte.

Sichere Nutzung:

- „Töte X Gegner“
- Missionsphasen auf Basis von Runden-Kills
- spielerbezogene Fortschrittsprüfung

Warnungen:

- Zählt Runden-Kills, nicht automatisch Kills seit Missionsstart.
- Für „Kills ohne zu sterben“ oder „Kills ab Phase X“ braucht man eigene Logik.

Empfehlung:

- Für einfache Kill-Ziele bevorzugen.
- Nicht durch globale Counter ersetzen, wenn Bots aktiv sind.

---

## OngoingPlayer

Kategorie: Loop / fortlaufende Spielerprüfung

Kurzbeschreibung:  
Wird fortlaufend im Spieler-Kontext ausgeführt.

Bestätigtes Verhalten:

- Leerer `OngoingPlayer` war stabil.
- Read-only-Abfragen wie `GetPlayerVehicleSeat(eventPlayer)` waren stabil.
- Positions-/Distanzprüfungen können darin funktionieren.

Sichere Nutzung:

- read-only Checks
- Distanzprüfung
- Positionsprüfung
- Statusabfragen

Warnungen:

- Keine gefährlichen State-Änderungen dauerhaft ausführen.
- Spawn-, Deploy-, Team- und AI-Änderungen können im Loop riskant sein.

Empfehlung:

- In `OngoingPlayer` bevorzugt nur lesen und prüfen.
- Änderungen nur mit klaren Guards/Bedingungen oder eventbasiert ausführen.

---

## GetPlayerVehicleSeat

Kategorie: Player / Vehicle State

Kurzbeschreibung:  
Liest den aktuellen Fahrzeugsitz des Spielers.

Bestätigtes Verhalten:

- Read-only-Nutzung in `OngoingPlayer` war stabil.
- Kein Crash beobachtet.

Sichere Nutzung:

- prüfen, ob Spieler in Fahrzeug/Sitz ist
- spätere Fahrzeugziele
- Fahrzeug-Missionslogik

Warnungen:

- Allein noch nicht ausreichend für komplexe Fahrzeugmissionen.
- Semantik der Rückgabewerte sollte später genauer dokumentiert werden.

---

## EnablePlayerDeploy

Kategorie: Deploy / Spawn Control

Kurzbeschreibung:  
Erlaubt oder blockiert Deploy für einen Spieler.

Bestätigte Warnung:

- Dauerhafte Ausführung in `OngoingPlayer` war wahrscheinlich Crash-Auslöser.
- Diese Nutzung nicht wiederholen.

Gefährliches Muster:

```ts
export function OngoingPlayer(eventPlayer: mod.Player) {
    mod.EnablePlayerDeploy(eventPlayer, true);
}
```

Sichere Nutzung:

- Wenn überhaupt, kontrolliert und nicht dauerhaft.
- Besser einmalig/eventbasiert.
- Community-Muster nutzt eher Startabläufe mit globalem Deploy-Sperren/Freigeben.

Empfehlung:

- Nicht in `OngoingPlayer` spammen.
- Für AI-/Mission-Start eigenes kontrolliertes Startsystem bauen.

---

## EnableAllPlayerDeploy

Kategorie: Deploy / Start Flow

Kurzbeschreibung:  
Sperrt oder erlaubt Deploy global für alle Spieler.

Community-Muster:

- Am Anfang Deploy global sperren.
- UI „WAIT TO DEPLOY“ anzeigen.
- AI vorbereiten.
- Danach Deploy global freigeben.

Warnungen:

- Nicht blind übernehmen.
- Muss sauber in Startlogik eingebettet werden.
- Nicht dauerhaft in Loops ausführen.

Empfehlung:

- Für spätere AI-Startkontrolle interessant.
- Nur kontrolliert im Startablauf testen.

---

## GetSoldierState

Kategorie: Player / AI / State

Kurzbeschreibung:  
Liest Zustände eines Soldaten/Spielers.

Bestätigte Nutzung:

- Spielerposition kann für Distanz-/Zone-Ziele genutzt werden.
- Community-Muster nutzt `IsAISoldier`, um Bots zu erkennen.

Sichere Nutzung:

- Position lesen
- AI/Human unterscheiden
- Zustandsprüfungen

Warnungen:

- State-Abfragen sind sicherer als State-Änderungen, aber Semantik pro State muss dokumentiert werden.

Empfehlung:

- Wichtig für spätere Human-vs-AI-Logik.
- Besonders `IsAISoldier` weiter prüfen/dokumentieren.

---

## GetGolmudTrainLocation

Kategorie: Map-specific / Spatial / Objective

Kurzbeschreibung:  
Liefert die Position des Golmud-Zugs.

Bestätigtes Verhalten:

- Position kann gelesen werden.
- In Kombination mit Spielerposition und `DistanceBetween` als Zone/Objective nutzbar.
- Spieler konnte zum Zug laufen und eine Zielzone auslösen.

Sichere Nutzung:

- statisches Zug-Objective
- „Gehe zum Zug“
- „Sichere den Zug“
- Distanzprüfung um den Zug

Warnungen:

- Im aktuellen Custom-Setup bewegte sich der Zug trotz Option „Moving Train“ nicht.
- Vermutlich hängt echte Zugbewegung an Objective-/Conquest-/Flaggenlogik oder wird durch Custom-Setup nicht aktiviert.

Empfehlung:

- Vorerst als statisches Objective nutzbar.
- Fahrenden Zug separat als `Train Lab` untersuchen.

---

## DistanceBetween

Kategorie: Vector / Spatial / Objective

Kurzbeschreibung:  
Berechnet Abstand zwischen zwei Positionen.

Bestätigtes Verhalten:

- Funktioniert für Spielerposition zu Zugposition.
- Kann Zonen-/Objective-Erkennung ermöglichen.

Sichere Nutzung:

- Radius-Ziele
- Evac-Zonen
- Zug-Zone
- einfache Capture-/Hold-Areas

Warnungen:

- Wenn in `OngoingPlayer` genutzt, keine schweren Aktionen dauerhaft auslösen.

---

# Spatial / Godot / Map Layout

## Spawnpoints und HQs

Kategorie: Spatial Editor / Map Layout

Kurzbeschreibung:  
Spawnpunkte und HQs liegen nicht im Rules Editor, sondern im Spatial-/Godot-/Map-Layout.

Bestätigtes Verhalten:

- Spawnpunkte können im SDK/Godot verschoben werden.
- Export erfolgt über `Export Current Level`.
- Upload erfolgt im Portal Builder bei Map Rotation als Spatial JSON.

Sichere Nutzung:

- Spawnpoint-Paket zusammen verschieben.
- Originalszene nicht überschreiben.
- Mit `Save Scene As...` neue Testversion speichern.

Warnungen:

- Nicht nur Box/Volume verschieben.
- Spawnpoints müssen auf echtem Terrain liegen.
- Falsche Höhe kann dazu führen, dass Spieler unter dem Boden spawnen.
- Team-HQ, SpawnPoints und ggf. Area/Volume zusammen betrachten.

Empfohlener Workflow:

1. Portal SDK / Godot öffnen.
2. Map bearbeiten.
3. Spawnpoints/HQ-Paket seitlich verschieben.
4. Höhe möglichst nicht stark ändern.
5. `Scene > Save Scene As...`
6. `Export Current Level`
7. `Open Exports`
8. Spatial JSON im Portal Builder bei Map Rotation hochladen.

---

# Community-Muster

## AI Start Control

Kategorie: AI / Deploy / Start Flow

Quelle:

- Community-Blockly-Exports:
  - `testing_ai_deploy_wait_for_human.json`
  - `testing_ai_deploy_wait_for_timer.json`

Muster:

- Deploy am Start global sperren.
- UI „WAIT TO DEPLOY“ anzeigen.
- AI über Spawner erzeugen.
- Bots zuerst auf Idle setzen.
- Danach Deploy freigeben.
- Bots später per `AIBattlefieldBehavior` aktivieren.
- Eine Variante wartet auf den ersten Human-Deploy.

Nutzen:

- verhindert, dass Bots schon chaotisch aktiv sind, bevor der Spieler bereit ist.
- relevant für PvE-Testumgebungen und kontrollierte AI-Starts.

Warnungen:

- Community-Code nicht 1:1 übernehmen.
- Muster verstehen und eigenes Script daraus bauen.

---

## Message Strings / strings.json

Kategorie: UI / Localization / Message Parameters

Community-Erkenntnis:

- Dynamische Runtime-Strings in `mod.Message(...)` werden nicht immer korrekt in Platzhalter eingesetzt.
- Feste Werte in `strings.json` scheinen zuverlässiger zu sein.

Empfehlung:

- Objective-Buchstaben A–G als feste Stringkeys vorbereiten.
- Beispiel: `letters.a`, `letters.b`, `letters.c`.
- Für echte UI/Missionstexte nicht blind rohe TypeScript-Strings verwenden.

Offene Frage:

- Welche Parametertypen in `mod.Message(...)` zuverlässig funktionieren:
  - Zahlen
  - Stringkeys
  - Runtime-Strings
  - Player-Namen
  - Objective-Namen

---

# Offene Forschungsbereiche

## Train Lab

Ziel:

- echten Golmud-Zug verstehen
- prüfen, ob Objective-/Flaggenlogik ihn aktiviert
- prüfen, ob eigene bewegte Plattform möglich ist

Offene Tests:

1. Golmud ohne Custom Spatial testen.
2. Golmud mit/ohne Default Spatial Data testen.
3. Objective-/Conquest-/Flaggenlogik prüfen.
4. Bewegbares Objekt testen.
5. Spieler auf bewegtem Objekt testen.
6. breite Zug-/Container-Plattform prüfen.

## UI / Snake / Custom Screens

Ziel:

- Community-UI-Muster verstehen
- nicht Snake kopieren, sondern UI-Technik dokumentieren

Offen:

- UI-Container
- UI-Text
- UI-Update
- Eingabehandling
- dynamische Anzeige
- strings.json-Struktur

## AI Control

Ziel:

- Bots kontrolliert starten
- Bots erst nach Human-Deploy aktivieren
- AI-Idle/Battlefield-Behavior sauber dokumentieren

Offen:

- `AIIdleBehavior`
- `AIBattlefieldBehavior`
- `SpawnAIFromAISpawner`
- `OnSpawnerSpawned`
- Human-vs-AI-Erkennung
