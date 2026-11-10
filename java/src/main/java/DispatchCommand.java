// The planning team writes its own actions against this promise.
interface DispatchCommand {
    void execute();
    void undo();
    String describe();
}
