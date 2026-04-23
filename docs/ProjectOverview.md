# Project Overview

## **1. System Overview**

A **frontend-only React MVP** that trains fretboard knowledge through short interactive quizzes, not just visualization.

### **What it does**

- Renders a **6-string × 24-fret guitar fretboard**
- Lets user choose a **root note + scale/mode**
- Runs training in 3 modes:
    1. **Note Finder** (find all target notes)
    2. **Interval Finder** (find target intervals from root)
    3. **Mixed Random Quiz** (notes + intervals mixed)
- Validates each click instantly (correct/incorrect)
- Tracks basic session stats:
    - accuracy
    - response time
    - streak
- Saves user settings + history in **localStorage**

### **Engineering decisions (for unclear parts)**

- **Tuning:** standard guitar tuning **`E A D G B E`** (low to high)
- **Frets:** include open string (**`fret 0`**) through **`fret 24`** (25 positions per string)
- **Enharmonics:** start with sharps only (**`C#`**, not **`Db`**) for MVP consistency
- **Single-page app:** no backend/auth to keep scope tight

---

## **2. Module Breakdown**

## **A) Core Music Engine (`music/`)**

**Responsibility:** pure logic, no UI.

- Note indexing (0–11)
- Interval naming & semitone mapping
- Scale formulas
- Generate scale notes from root
- Fretboard note mapping (string, fret → note)

**Key outputs**

- **`getNoteAt(stringIndex, fret): NoteName`**
- **`getScaleNotes(root, scaleType): Set<NoteName>`**
- **`getIntervalName(semitones): string`**
- **`getTargetsForQuestion(question, context): Target[]`**

---

## **B) Quiz Engine (`quiz/`)**

**Responsibility:** question generation, validation, scoring.

- Build next question from mode + selected scale/root
- Validate user click against correct targets
- Track current streak, attempts, correctness, timing
- Emit quiz events (**`questionStarted`**, **`answered`**, **`questionCompleted`**)

---

## **C) State Layer (`state/`)**

**Responsibility:** app-wide UI + training state.

- Current configuration (root, scale, mode)
- Active question
- Session stats
- Persistence synchronization

Use React **`useReducer`** + context (simple and predictable for MVP).

---

## **D) Persistence (`storage/`)**

**Responsibility:** localStorage I/O.

- Save/load:
    - settings
    - best streak
    - rolling session summaries

No schema migration complexity; version key + safe fallback defaults.

---

## **E) UI Layer (`components/`)**

**Responsibility:** rendering + interactions.

- Fretboard grid and clickable markers
- Controls panel (root, scale/mode, training mode, start/reset)
- Prompt + feedback area
- Stats panel (accuracy/time/streak)

---

## **3. Data Model Design**

## **A) Note System**

```
typeNoteName='C'|'C#'|'D'|'D#'|'E'|'F'|'F#'|'G'|'G#'|'A'|'A#'|'B';
typeNoteIndex=0|1|2|3|4|5|6|7|8|9|10|11;
```

- Canonical chromatic array:
    
    **`['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']`**
    
- Convert by modulo arithmetic.

---

## **B) Interval System**

```
typeIntervalSemitones=0..12;
typeIntervalLabel='R'|'m2'|'M2'|'m3'|'M3'|'P4'|'TT'|'P5'|'m6'|'M6'|'m7'|'M7'|'8';
```

Mapping semitones → label is fixed table.

---

## **C) Scale Formulas**

Use semitone formulas from root:

- Major (Ionian): **`[0,2,4,5,7,9,11]`**
- Natural Minor (Aeolian): **`[0,2,3,5,7,8,10]`**
- Major Pentatonic: **`[0,2,4,7,9]`**
- Minor Pentatonic: **`[0,3,5,7,10]`**
- Modes:
    - Dorian **`[0,2,3,5,7,9,10]`**
    - Phrygian **`[0,1,3,5,7,8,10]`**
    - Lydian **`[0,2,4,6,7,9,11]`**
    - Mixolydian **`[0,2,4,5,7,9,10]`**
    - Locrian **`[0,1,3,5,6,8,10]`**

---

## **D) Fretboard Mapping Logic**

Standard tuning note indices (low E to high E):

- E(4), A(9), D(2), G(7), B(11), E(4)

Formula:

```
noteIndex= (openStringIndex+fret)%12
```

For all strings **`0..5`** and frets **`0..24`**, precompute board map once at init.

---

## **E) Quiz/Stats Data Structures**

```
typeTrainingMode='note'|'interval'|'mixed';

typeQuestion=
| { type:'note'; targetNote:NoteName; prompt:string; validPositions:Position[] }
| { type:'interval'; root:NoteName; interval:IntervalSemitones; prompt:string; validPositions:Position[] };

typePosition= { string:number; fret:number };

typeSessionStats= {
  attempts:number;
  correct:number;
  accuracy:number;// derived
  streak:number;
  bestStreak:number;
  avgResponseMs:number;// derived
  startedAt:number;
};
```

---

## **4. Component Architecture**

## **Proposed tree**

- **`App`**
    - **`Header`**
    - **`TrainerLayout`**
        - **`ControlPanel`**
            - root selector
            - scale/mode selector
            - training mode selector
            - start/reset
        - **`PromptPanel`**
            - current question prompt
            - correctness feedback
            - next button / auto-next toggle
        - **`Fretboard`**
            - **`StringRow`** × 6
                - **`FretCell`** × 25
        - **`StatsPanel`**
            - accuracy
            - avg response time
            - current streak / best streak
    - **`Footer`** (minimal)

## **State flow**

- **`ControlPanel`** dispatches config changes
- **`Quiz Engine`** creates question from config
- **`Fretboard`** click dispatches answer
- Reducer validates via pure functions and updates stats
- **`PromptPanel`**/**`StatsPanel`** subscribe to state
- Persistence layer writes throttled snapshots (e.g., on question completion / settings change)

## **Why this is minimal and strong**

- Pure logic isolated from UI (easy to test)
- One global reducer avoids prop-drilling
- No external state library needed

---

## **5. Step-by-step Implementation Plan**

## **Day 1 — Foundation + Music Core**

1. Initialize React + TypeScript app (Vite).
2. Create **`music`** module:
    - chromatic note mapping
    - interval labels
    - scale formulas
    - fretboard map generator
3. Add unit tests for pure logic (notes/scales/mapping).

**Deliverable:** verified core music functions with tests.

---

## **Day 2 — Basic UI + Static Fretboard**

1. Build **`Fretboard`**, **`StringRow`**, **`FretCell`**.
2. Render 6×25 clickable grid.
3. Add **`ControlPanel`** with root/scale/training mode selectors.
4. Show note labels toggle (optional debug switch).

**Deliverable:** interactive board + configurable training context (no quiz yet).

---

## **Day 3 — Quiz Engine + Validation**

1. Implement **`Question`** generator for:
    - Note Finder
    - Interval Finder
    - Mixed
2. Implement click validation against **`validPositions`**.
3. Add immediate feedback (correct/incorrect highlight and text).
4. Implement progression to next question.

**Deliverable:** fully playable training loop.

---

## **Day 4 — Stats + Persistence**

1. Add session timing measurement per question.
2. Compute accuracy, avg response, streak, best streak.
3. Build **`StatsPanel`**.
4. Persist settings + best streak + session summary via localStorage.

**Deliverable:** persistent, measurable practice experience.

---

## **Day 5 — MVP Polish + QA**

1. Keyboard accessibility basics (focusable cells, Enter/Space select).
2. Responsive layout tweaks for laptop/tablet.
3. Empty/error guards (no invalid config crashes).
4. Quick usability pass + bug fixes.

**Deliverable:** small, stable, usable MVP ready for iteration.

---

## **6. Risks & Simplifications**

## **Risks**

1. **Music notation complexity** (enharmonics/flats) can bloat scope.
2. **Too many valid positions** may confuse users in Note Finder.
3. **State complexity creep** if animations/gamification are added early.
4. **Performance concerns** if rerendering all cells on every click without memoization.

## **Simplifications (intentional)**

1. Use **sharp-only notation** initially.
2. Treat a question as correct if user clicks **any valid target position**.
3. Keep question cadence simple: one prompt, one click, immediate result.
4. LocalStorage only (no backend, no sync).
5. Minimal styling; prioritize interaction clarity over visuals.

---

If you approve this plan, next step is **Step 5: generate the MVP codebase** exactly to this architecture, in small clean commits.