// Lakeside Parcel's dispatch board. Read the ticket in README.md first.

// Which driver has which package.
export class DispatchBoard {
  #drivers = new Map<number, string>();
  driverFor(pkg: number): string { return this.#drivers.get(pkg) ?? "nobody"; }
  assign(pkg: number, driver: string): void { this.#drivers.set(pkg, driver); }
  unassign(pkg: number): void { this.#drivers.delete(pkg); }
  describe(): string {
    const pkgs = [...this.#drivers.keys()].sort((a, b) => a - b);
    return "Board: " + pkgs.map((pkg) => `package ${pkg} with ${this.#drivers.get(pkg)}`).join(", ");
  }
}

// The planning team writes its own actions against this promise.
export interface DispatchCommand {
  execute(): void;
  undo(): void;
  describe(): string;
}

// What the dispatcher's buttons call.
export class Dispatcher {
  board: DispatchBoard;
  log: string[] = [];

  constructor(board: DispatchBoard) { this.board = board; }

  // The "Assign" button.
  assign(pkg: number, driver: string): void {
    this.board.assign(pkg, driver);
    this.log.push(`Assign package ${pkg} to ${driver}`);
  }

  // The planning team's code calls this with an action it wrote. It does nothing yet.
  run(command: DispatchCommand): void { }

  // The new Undo and Redo buttons call these. They do nothing yet.
  undo(): void { }
  redo(): void { }
}
