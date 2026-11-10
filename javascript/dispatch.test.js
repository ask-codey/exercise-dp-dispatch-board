// The tests for your code. You don't need to change this file.
// Each message says what was expected, so a failing test tells you what to look at.
import assert from "node:assert/strict";
import { test } from "node:test";
import { DispatchBoard, Dispatcher } from "./dispatch.js";

// An action the planning team wrote, outside the dispatch code.
class UnassignPackage {
  #driverBefore = "nobody";
  constructor(board, pkg) { this.board = board; this.pkg = pkg; }
  execute() { this.#driverBefore = this.board.driverFor(this.pkg); this.board.unassign(this.pkg); }
  undo() { if (this.#driverBefore !== "nobody") { this.board.assign(this.pkg, this.#driverBefore); } }
  describe() { return `Unassign package ${this.pkg}`; }
}

function last(log) { return log.length === 0 ? "" : log[log.length - 1]; }

// What the dispatch board does today. These pass before you change anything: keep them passing.

test("assigning a package gives it to the driver", () => {
  const board = new DispatchBoard();
  new Dispatcher(board).assign(42, "Dana");
  assert.equal(board.driverFor(42), "Dana", 'Keep this working: after "Assign package 42 to Dana", Dana has package 42.');
});

test("assigning it again moves it", () => {
  const board = new DispatchBoard();
  const dispatcher = new Dispatcher(board);
  dispatcher.assign(42, "Dana");
  dispatcher.assign(42, "Leo");
  assert.equal(board.driverFor(42), "Leo", "Keep this working: assigning package 42 to Leo moves it from Dana to Leo.");
});

test("the log lists every assignment in order", () => {
  const dispatcher = new Dispatcher(new DispatchBoard());
  dispatcher.assign(42, "Dana");
  dispatcher.assign(43, "Leo");
  assert.deepEqual(dispatcher.log, ["Assign package 42 to Dana", "Assign package 43 to Leo"],
    "Keep this working: the log lists both assignments, in the order they were made.");
});

test("a package nobody has assigned is with nobody", () => {
  assert.equal(new DispatchBoard().driverFor(99), "nobody", 'Keep this working: a package nobody has assigned is with "nobody".');
});

// The ticket's new requirements. These fail until the work is done.

test("undo takes back three steps, newest first", () => {
  const board = new DispatchBoard();
  const dispatcher = new Dispatcher(board);
  dispatcher.assign(42, "Dana");
  dispatcher.assign(43, "Leo");
  dispatcher.assign(44, "Dana");
  dispatcher.assign(42, "Leo");
  dispatcher.undo();
  dispatcher.undo();
  dispatcher.undo();
  assert.equal(board.driverFor(42), "Dana", "Not yet: three undos take package 42 back from Leo to Dana.");
  assert.equal(board.driverFor(43), "nobody", "Not yet: three undos take package 43 back from Leo.");
  assert.equal(board.driverFor(44), "nobody", "Not yet: three undos take package 44 back from Dana.");
  assert.deepEqual(dispatcher.log.slice(4), ["Undo: Assign package 42 to Leo", "Undo: Assign package 44 to Dana", "Undo: Assign package 43 to Leo"],
    "Not yet: the log shows the three undos, newest first.");
});

test("redo puts back the last undo", () => {
  const board = new DispatchBoard();
  const dispatcher = new Dispatcher(board);
  dispatcher.assign(42, "Dana");
  dispatcher.assign(43, "Leo");
  dispatcher.assign(44, "Dana");
  dispatcher.assign(42, "Leo");
  dispatcher.undo();
  dispatcher.undo();
  dispatcher.undo();
  dispatcher.redo();
  assert.equal(board.driverFor(43), "Leo", "Not yet: one redo gives package 43 back to Leo.");
  assert.equal(board.driverFor(44), "nobody", "Not yet: one redo puts back only the last undo, so package 44 stays with nobody.");
  assert.equal(last(dispatcher.log), "Redo: Assign package 43 to Leo", 'Not yet: the log ends with "Redo: Assign package 43 to Leo".');
});

test("a new assignment after an undo clears redo", () => {
  const board = new DispatchBoard();
  const dispatcher = new Dispatcher(board);
  dispatcher.assign(42, "Dana");
  dispatcher.undo();
  dispatcher.assign(43, "Leo");
  dispatcher.redo();
  assert.equal(board.driverFor(42), "nobody", "Not yet: after a new assignment, redo has nothing left to redo, so package 42 stays with nobody.");
  assert.equal(last(dispatcher.log), "Nothing to redo", 'Not yet: the log ends with "Nothing to redo".');
});

test("an action written outside can be run and undone", () => {
  const board = new DispatchBoard();
  const dispatcher = new Dispatcher(board);
  dispatcher.assign(42, "Dana");
  dispatcher.run(new UnassignPackage(board, 42));
  assert.equal(board.driverFor(42), "nobody", 'Not yet: running the planning team\'s "Unassign package 42" takes it from Dana.');
  assert.equal(last(dispatcher.log), "Unassign package 42", 'Not yet: the log shows "Unassign package 42".');
  dispatcher.undo();
  assert.equal(board.driverFor(42), "Dana", "Not yet: undo gives package 42 back to Dana.");
});
