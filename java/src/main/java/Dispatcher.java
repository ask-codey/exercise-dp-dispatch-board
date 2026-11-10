import java.util.ArrayList;
import java.util.List;

// What the dispatcher's buttons call.
class Dispatcher {
    private final DispatchBoard board;
    final List<String> log = new ArrayList<>();

    Dispatcher(DispatchBoard board) {
        this.board = board;
    }

    // The "Assign" button.
    void assign(int pkg, String driver) {
        board.assign(pkg, driver);
        log.add("Assign package " + pkg + " to " + driver);
    }

    // The planning team's code calls this with an action it wrote. It does nothing yet.
    void run(DispatchCommand command) {
    }

    // The new Undo and Redo buttons call these. They do nothing yet.
    void undo() {
    }

    void redo() {
    }
}
