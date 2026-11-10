// Lakeside Parcel's dispatch board. Read the ticket in README.md first.

// Which driver has which package.
export class DispatchBoard {
  #drivers = new Map();
  driverFor(pkg) { return this.#drivers.get(pkg) ?? "nobody"; }
  assign(pkg, driver) { this.#drivers.set(pkg, driver); }
  unassign(pkg) { this.#drivers.delete(pkg); }
  describe() {
    const pkgs = [...this.#drivers.keys()].sort((a, b) => a - b);
    return "Board: " + pkgs.map((pkg) => `package ${pkg} with ${this.#drivers.get(pkg)}`).join(", ");
  }
}

// The planning team writes its own actions with three methods: execute(), undo() and describe().

// What the dispatcher's buttons call.
export class Dispatcher {
  log = [];

  constructor(board) { this.board = board; }

  // The "Assign" button.
  assign(pkg, driver) {
    this.board.assign(pkg, driver);
    this.log.push(`Assign package ${pkg} to ${driver}`);
  }

  // The planning team's code calls this with an action it wrote. It does nothing yet.
  run(command) { }

  // The new Undo and Redo buttons call these. They do nothing yet.
  undo() { }
  redo() { }
}
