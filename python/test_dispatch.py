"""The tests for your code. You don't need to change this file.
Each message says what was expected, so a failing test tells you what to look at."""
from dispatch import DispatchBoard, Dispatcher


class UnassignPackage:
    """An action the planning team wrote, outside the dispatch code."""

    def __init__(self, board, package):
        self.board = board
        self.package = package
        self.driver_before = "nobody"

    def execute(self):
        self.driver_before = self.board.driver_for(self.package)
        self.board.unassign(self.package)

    def undo(self):
        if self.driver_before != "nobody":
            self.board.assign(self.package, self.driver_before)

    def describe(self):
        return f"Unassign package {self.package}"


def last(log):
    return log[-1] if log else ""


# What the dispatch board does today. These pass before you change anything: keep them passing.

def test_assigning_a_package_gives_it_to_the_driver():
    board = DispatchBoard()
    Dispatcher(board).assign(42, "Dana")
    assert board.driver_for(42) == "Dana", 'Keep this working: after "Assign package 42 to Dana", Dana has package 42.'


def test_assigning_it_again_moves_it():
    board = DispatchBoard()
    dispatcher = Dispatcher(board)
    dispatcher.assign(42, "Dana")
    dispatcher.assign(42, "Leo")
    assert board.driver_for(42) == "Leo", "Keep this working: assigning package 42 to Leo moves it from Dana to Leo."


def test_the_log_lists_every_assignment_in_order():
    dispatcher = Dispatcher(DispatchBoard())
    dispatcher.assign(42, "Dana")
    dispatcher.assign(43, "Leo")
    assert dispatcher.log == ["Assign package 42 to Dana", "Assign package 43 to Leo"], \
        "Keep this working: the log lists both assignments, in the order they were made."


def test_a_package_nobody_has_assigned_is_with_nobody():
    assert DispatchBoard().driver_for(99) == "nobody", 'Keep this working: a package nobody has assigned is with "nobody".'


# The ticket's new requirements. These fail until the work is done.

def test_undo_takes_back_three_steps_newest_first():
    board = DispatchBoard()
    dispatcher = Dispatcher(board)
    dispatcher.assign(42, "Dana")
    dispatcher.assign(43, "Leo")
    dispatcher.assign(44, "Dana")
    dispatcher.assign(42, "Leo")
    dispatcher.undo()
    dispatcher.undo()
    dispatcher.undo()
    assert board.driver_for(42) == "Dana", "Not yet: three undos take package 42 back from Leo to Dana."
    assert board.driver_for(43) == "nobody", "Not yet: three undos take package 43 back from Leo."
    assert board.driver_for(44) == "nobody", "Not yet: three undos take package 44 back from Dana."
    assert dispatcher.log[4:] == ["Undo: Assign package 42 to Leo", "Undo: Assign package 44 to Dana", "Undo: Assign package 43 to Leo"], \
        "Not yet: the log shows the three undos, newest first."


def test_redo_puts_back_the_last_undo():
    board = DispatchBoard()
    dispatcher = Dispatcher(board)
    dispatcher.assign(42, "Dana")
    dispatcher.assign(43, "Leo")
    dispatcher.assign(44, "Dana")
    dispatcher.assign(42, "Leo")
    dispatcher.undo()
    dispatcher.undo()
    dispatcher.undo()
    dispatcher.redo()
    assert board.driver_for(43) == "Leo", "Not yet: one redo gives package 43 back to Leo."
    assert board.driver_for(44) == "nobody", "Not yet: one redo puts back only the last undo, so package 44 stays with nobody."
    assert last(dispatcher.log) == "Redo: Assign package 43 to Leo", 'Not yet: the log ends with "Redo: Assign package 43 to Leo".'


def test_a_new_assignment_after_an_undo_clears_redo():
    board = DispatchBoard()
    dispatcher = Dispatcher(board)
    dispatcher.assign(42, "Dana")
    dispatcher.undo()
    dispatcher.assign(43, "Leo")
    dispatcher.redo()
    assert board.driver_for(42) == "nobody", \
        "Not yet: after a new assignment, redo has nothing left to redo, so package 42 stays with nobody."
    assert last(dispatcher.log) == "Nothing to redo", 'Not yet: the log ends with "Nothing to redo".'


def test_an_action_written_outside_can_be_run_and_undone():
    board = DispatchBoard()
    dispatcher = Dispatcher(board)
    dispatcher.assign(42, "Dana")
    dispatcher.run(UnassignPackage(board, 42))
    assert board.driver_for(42) == "nobody", "Not yet: running the planning team's \"Unassign package 42\" takes it from Dana."
    assert last(dispatcher.log) == "Unassign package 42", 'Not yet: the log shows "Unassign package 42".'
    dispatcher.undo()
    assert board.driver_for(42) == "Dana", "Not yet: undo gives package 42 back to Dana."
