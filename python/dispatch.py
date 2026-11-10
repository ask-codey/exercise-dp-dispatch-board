"""Lakeside Parcel's dispatch board. Read the ticket in README.md first."""


class DispatchBoard:
    """Which driver has which package."""

    def __init__(self):
        self.drivers = {}

    def driver_for(self, package):
        return self.drivers.get(package, "nobody")

    def assign(self, package, driver):
        self.drivers[package] = driver

    def unassign(self, package):
        self.drivers.pop(package, None)

    def describe(self):
        return "Board: " + ", ".join(f"package {p} with {self.drivers[p]}" for p in sorted(self.drivers))


# The planning team writes its own actions with three methods: execute(), undo() and describe().


class Dispatcher:
    """What the dispatcher's buttons call."""

    def __init__(self, board):
        self.board = board
        self.log = []

    def assign(self, package, driver):
        """The "Assign" button."""
        self.board.assign(package, driver)
        self.log.append(f"Assign package {package} to {driver}")

    def run(self, command):
        """The planning team's code calls this with an action it wrote. It does nothing yet."""

    def undo(self):
        """The new Undo button calls this. It does nothing yet."""

    def redo(self):
        """The new Redo button calls this. It does nothing yet."""
