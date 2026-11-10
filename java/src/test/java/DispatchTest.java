import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

// The tests for your code. You don't need to change this file.
// Each message says what was expected, so a failing test tells you what to look at.
class DispatchTest {
    // An action the planning team wrote, outside the dispatch code.
    static class UnassignPackage implements DispatchCommand {
        private final DispatchBoard board;
        private final int pkg;
        private String driverBefore = "nobody";

        UnassignPackage(DispatchBoard board, int pkg) { this.board = board; this.pkg = pkg; }

        public void execute() { driverBefore = board.driverFor(pkg); board.unassign(pkg); }
        public void undo() { if (!driverBefore.equals("nobody")) { board.assign(pkg, driverBefore); } }
        public String describe() { return "Unassign package " + pkg; }
    }

    private static String last(List<String> log) {
        return log.isEmpty() ? "" : log.get(log.size() - 1);
    }

    // What the dispatch board does today. These pass before you change anything: keep them passing.

    @Test
    void assigningAPackageGivesItToTheDriver() {
        DispatchBoard board = new DispatchBoard();
        new Dispatcher(board).assign(42, "Dana");
        assertEquals("Dana", board.driverFor(42), "Keep this working: after \"Assign package 42 to Dana\", Dana has package 42.");
    }

    @Test
    void assigningItAgainMovesIt() {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.assign(42, "Dana");
        dispatcher.assign(42, "Leo");
        assertEquals("Leo", board.driverFor(42), "Keep this working: assigning package 42 to Leo moves it from Dana to Leo.");
    }

    @Test
    void theLogListsEveryAssignmentInOrder() {
        Dispatcher dispatcher = new Dispatcher(new DispatchBoard());
        dispatcher.assign(42, "Dana");
        dispatcher.assign(43, "Leo");
        assertEquals(List.of("Assign package 42 to Dana", "Assign package 43 to Leo"), dispatcher.log,
            "Keep this working: the log lists both assignments, in the order they were made.");
    }

    @Test
    void aPackageNobodyHasAssignedIsWithNobody() {
        assertEquals("nobody", new DispatchBoard().driverFor(99), "Keep this working: a package nobody has assigned is with \"nobody\".");
    }

    // The ticket's new requirements. These fail until the work is done.

    @Test
    void undoTakesBackThreeStepsNewestFirst() {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.assign(42, "Dana");
        dispatcher.assign(43, "Leo");
        dispatcher.assign(44, "Dana");
        dispatcher.assign(42, "Leo");
        dispatcher.undo();
        dispatcher.undo();
        dispatcher.undo();
        assertEquals("Dana", board.driverFor(42), "Not yet: three undos take package 42 back from Leo to Dana.");
        assertEquals("nobody", board.driverFor(43), "Not yet: three undos take package 43 back from Leo.");
        assertEquals("nobody", board.driverFor(44), "Not yet: three undos take package 44 back from Dana.");
        assertEquals(List.of("Undo: Assign package 42 to Leo", "Undo: Assign package 44 to Dana", "Undo: Assign package 43 to Leo"),
            dispatcher.log.subList(Math.min(4, dispatcher.log.size()), dispatcher.log.size()), "Not yet: the log shows the three undos, newest first.");
    }

    @Test
    void redoPutsBackTheLastUndo() {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.assign(42, "Dana");
        dispatcher.assign(43, "Leo");
        dispatcher.assign(44, "Dana");
        dispatcher.assign(42, "Leo");
        dispatcher.undo();
        dispatcher.undo();
        dispatcher.undo();
        dispatcher.redo();
        assertEquals("Leo", board.driverFor(43), "Not yet: one redo gives package 43 back to Leo.");
        assertEquals("nobody", board.driverFor(44), "Not yet: one redo puts back only the last undo, so package 44 stays with nobody.");
        assertEquals("Redo: Assign package 43 to Leo", last(dispatcher.log), "Not yet: the log ends with \"Redo: Assign package 43 to Leo\".");
    }

    @Test
    void aNewAssignmentAfterAnUndoClearsRedo() {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.assign(42, "Dana");
        dispatcher.undo();
        dispatcher.assign(43, "Leo");
        dispatcher.redo();
        assertEquals("nobody", board.driverFor(42), "Not yet: after a new assignment, redo has nothing left to redo, so package 42 stays with nobody.");
        assertEquals("Nothing to redo", last(dispatcher.log), "Not yet: the log ends with \"Nothing to redo\".");
    }

    @Test
    void anActionWrittenOutsideCanBeRunAndUndone() {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.assign(42, "Dana");
        dispatcher.run(new UnassignPackage(board, 42));
        assertEquals("nobody", board.driverFor(42), "Not yet: running the planning team's \"Unassign package 42\" takes it from Dana.");
        assertEquals("Unassign package 42", last(dispatcher.log), "Not yet: the log shows \"Unassign package 42\".");
        dispatcher.undo();
        assertEquals("Dana", board.driverFor(42), "Not yet: undo gives package 42 back to Dana.");
    }
}
