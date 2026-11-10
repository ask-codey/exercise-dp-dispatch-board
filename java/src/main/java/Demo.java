// A demo: tries your code on a morning at the dispatch desk. You don't need to change it.
// Run it with: java src/main/java/Demo.java
public class Demo {
    public static void main(String[] args) {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.assign(42, "Dana");
        dispatcher.assign(43, "Leo");
        dispatcher.assign(42, "Leo");
        dispatcher.undo();
        dispatcher.redo();
        for (String line : dispatcher.log) {
            System.out.println(line);
        }
        System.out.println(board.describe());
    }
}
