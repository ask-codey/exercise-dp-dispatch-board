using Dispatch;

// A demo: tries your code on a morning at the dispatch desk. You don't need to change it.
DispatchBoard board = new DispatchBoard();
Dispatcher dispatcher = new Dispatcher(board);
dispatcher.Assign(42, "Dana");
dispatcher.Assign(43, "Leo");
dispatcher.Assign(42, "Leo");
dispatcher.Undo();
dispatcher.Redo();
foreach (string line in dispatcher.Log)
{
    Console.WriteLine(line);
}
Console.WriteLine(board.Describe());
