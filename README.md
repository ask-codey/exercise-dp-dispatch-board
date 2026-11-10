# Exercise: The Dispatch Board

Exercise code for the lesson **Exercise: The Dispatch Board** in the course *Design Patterns, Demystified* on [ask-codey.com](https://www.ask-codey.com).

## The ticket

> **From:** the dispatch desk, Lakeside Parcel
>
> 1. **Undo and Redo buttons.** The dispatcher assigns packages to drivers all day, and a mistake costs a driver a wasted trip. She needs **Undo**, as many times as she likes, newest first, and **Redo** to put back what she undid. Once she assigns something new, there's nothing left to redo. Every undo and redo goes in the log ("Undo: Assign package 42 to Leo"), and when there's nothing to undo or redo, the log says so ("Nothing to undo", "Nothing to redo").
> 2. **The planning team's own actions.** The planning team is writing actions of its own (the first is "Unassign package 42") and will hand them to the dispatcher with `dispatcher.run(action)`. Each one has three methods: `execute`, `undo` and `describe`. An action they write must run, go in the log, and be undone like any other, without anyone editing the dispatch code for it.
>
> Everything that works today has to keep working: the Assign button, and the log of every assignment.

`run`, `undo` and `redo` are already there, because the buttons and the planning team's code call them, but they don't do anything yet.

## Pick your language

The same exercise is here in five languages. Work in the folder for the language you set up; you only need one.

| Folder | The dispatch code | The tests |
|---|---|---|
| `csharp/` | `Dispatch/Dispatch.cs` | `Dispatch.Tests/DispatchTests.cs` |
| `java/` | `src/main/java/` (`Dispatcher.java`, `DispatchBoard.java`, `DispatchCommand.java`) | `src/test/java/DispatchTest.java` |
| `python/` | `dispatch.py` | `test_dispatch.py` |
| `javascript/` | `dispatch.js` | `dispatch.test.js` |
| `typescript/` | `dispatch.ts` | `dispatch.test.ts` |

The names follow each language's style: `Assign`, `Undo`, `Redo` and `DriverFor` in C#, `driver_for` in Python, and `assign`, `undo`, `redo` and `driverFor` in Java, JavaScript and TypeScript. The tests include the planning team's "Unassign package" action, written the way they'll write theirs.

Every folder also has a small demo program that runs a morning at the dispatch desk: three assignments, an undo and a redo. You don't need to change the tests or the demo.

## Run it and check your work

Open your language's folder in VS Code (**File > Open Folder**), then open its terminal (**Terminal > New Terminal**) and run these commands there.

**C#**

```bash
dotnet run --project Dispatch
dotnet test
```

**Java** (the Maven Wrapper downloads Maven the first time, so the first run takes a minute)

```bash
java src/main/java/Demo.java
./mvnw test
```

On Windows in PowerShell, write `.\mvnw test` instead of `./mvnw test`.

**Python** (once: make a virtual environment and install pytest into it)

```bash
python -m venv .venv
```

Then turn it on: `.venv\Scripts\Activate.ps1` in PowerShell on Windows, or `source .venv/bin/activate` on macOS (where the command is `python3`, not `python`). Then:

```bash
pip install -r requirements.txt
python demo.py
python -m pytest
```

**JavaScript**

```bash
node demo.js
npm test
```

**TypeScript** (once: `npm install`, which installs TypeScript)

```bash
node demo.ts
npm test
```

At first, 4 tests pass and 4 fail. The 4 that pass are what the dispatch board does today: keep them green the whole time, and run the tests after every small change. The 4 that fail are the ticket. A failing test's message starts with **Not yet:** (or **Keep this working:** if you broke something that worked) and says what it expected.

## When you're done

All 8 tests are green, and the demo prints:

```text
Assign package 42 to Dana
Assign package 43 to Leo
Assign package 42 to Leo
Undo: Assign package 42 to Leo
Redo: Assign package 42 to Leo
Board: package 42 with Leo, package 43 with Leo
```

<details>
<summary>Stuck?</summary>

- **For undo:** the Assign button calls the board directly, so once an assignment has run, nothing is left that knows what it did or how to take it back. Make each assignment an object, `AssignPackage`, with the same three methods the planning team's actions have: `execute` saves who had the package before and assigns it, `undo` puts that back, and `describe` says what it is (the **Command** pattern). (*Command: An Action You Can Hold*.)
- **For undo and redo:** keep two stacks. Running an action executes it, pushes it on the undo stack and empties the redo stack. Undo pops the undo stack, undoes it and pushes it on the redo stack; redo does the opposite. Have the Assign button make an `AssignPackage` and run it, so every action, the planning team's included, goes the same way. (*Undo and Redo with Commands*.)

</details>

## Hand it in

When it works, push your solution to a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. The lesson page shows the Git commands, step by step.
