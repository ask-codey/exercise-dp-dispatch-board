using Dispatch;

namespace Dispatch.Tests;

// The tests for your code. You don't need to change this file.
// Each message says what was expected, so a failing test tells you what to look at.

// An action the planning team wrote, outside the dispatch code.
public class UnassignPackage : IDispatchCommand
{
    private readonly DispatchBoard board;
    private readonly int package;
    private string driverBefore = "nobody";

    public UnassignPackage(DispatchBoard board, int package) { this.board = board; this.package = package; }

    public void Execute() { driverBefore = board.DriverFor(package); board.Unassign(package); }
    public void Undo() { if (driverBefore != "nobody") { board.Assign(package, driverBefore); } }
    public string Describe() => $"Unassign package {package}";
}

[TestClass]
public class DispatchTests
{
    // What the dispatch board does today. These pass before you change anything: keep them passing.

    [TestMethod]
    public void AssigningAPackageGivesItToTheDriver()
    {
        DispatchBoard board = new DispatchBoard();
        new Dispatcher(board).Assign(42, "Dana");
        Assert.AreEqual("Dana", board.DriverFor(42), "Keep this working: after \"Assign package 42 to Dana\", Dana has package 42.");
    }

    [TestMethod]
    public void AssigningItAgainMovesIt()
    {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.Assign(42, "Dana");
        dispatcher.Assign(42, "Leo");
        Assert.AreEqual("Leo", board.DriverFor(42), "Keep this working: assigning package 42 to Leo moves it from Dana to Leo.");
    }

    [TestMethod]
    public void TheLogListsEveryAssignmentInOrder()
    {
        Dispatcher dispatcher = new Dispatcher(new DispatchBoard());
        dispatcher.Assign(42, "Dana");
        dispatcher.Assign(43, "Leo");
        CollectionAssert.AreEqual(new List<string> { "Assign package 42 to Dana", "Assign package 43 to Leo" }, dispatcher.Log,
            "Keep this working: the log lists both assignments, in the order they were made.");
    }

    [TestMethod]
    public void APackageNobodyHasAssignedIsWithNobody()
    {
        Assert.AreEqual("nobody", new DispatchBoard().DriverFor(99), "Keep this working: a package nobody has assigned is with \"nobody\".");
    }

    // The ticket's new requirements. These fail until the work is done.

    [TestMethod]
    public void UndoTakesBackThreeStepsNewestFirst()
    {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.Assign(42, "Dana");
        dispatcher.Assign(43, "Leo");
        dispatcher.Assign(44, "Dana");
        dispatcher.Assign(42, "Leo");
        dispatcher.Undo();
        dispatcher.Undo();
        dispatcher.Undo();
        Assert.AreEqual("Dana", board.DriverFor(42), "Not yet: three undos take package 42 back from Leo to Dana.");
        Assert.AreEqual("nobody", board.DriverFor(43), "Not yet: three undos take package 43 back from Leo.");
        Assert.AreEqual("nobody", board.DriverFor(44), "Not yet: three undos take package 44 back from Dana.");
        CollectionAssert.AreEqual(
            new List<string> { "Undo: Assign package 42 to Leo", "Undo: Assign package 44 to Dana", "Undo: Assign package 43 to Leo" },
            dispatcher.Log.Skip(4).ToList(), "Not yet: the log shows the three undos, newest first.");
    }

    [TestMethod]
    public void RedoPutsBackTheLastUndo()
    {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.Assign(42, "Dana");
        dispatcher.Assign(43, "Leo");
        dispatcher.Assign(44, "Dana");
        dispatcher.Assign(42, "Leo");
        dispatcher.Undo();
        dispatcher.Undo();
        dispatcher.Undo();
        dispatcher.Redo();
        Assert.AreEqual("Leo", board.DriverFor(43), "Not yet: one redo gives package 43 back to Leo.");
        Assert.AreEqual("nobody", board.DriverFor(44), "Not yet: one redo puts back only the last undo, so package 44 stays with nobody.");
        Assert.AreEqual("Redo: Assign package 43 to Leo", dispatcher.Log.Last(), "Not yet: the log ends with \"Redo: Assign package 43 to Leo\".");
    }

    [TestMethod]
    public void ANewAssignmentAfterAnUndoClearsRedo()
    {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.Assign(42, "Dana");
        dispatcher.Undo();
        dispatcher.Assign(43, "Leo");
        dispatcher.Redo();
        Assert.AreEqual("nobody", board.DriverFor(42), "Not yet: after a new assignment, redo has nothing left to redo, so package 42 stays with nobody.");
        Assert.AreEqual("Nothing to redo", dispatcher.Log.Last(), "Not yet: the log ends with \"Nothing to redo\".");
    }

    [TestMethod]
    public void AnActionWrittenOutsideCanBeRunAndUndone()
    {
        DispatchBoard board = new DispatchBoard();
        Dispatcher dispatcher = new Dispatcher(board);
        dispatcher.Assign(42, "Dana");
        dispatcher.Run(new UnassignPackage(board, 42));
        Assert.AreEqual("nobody", board.DriverFor(42), "Not yet: running the planning team's \"Unassign package 42\" takes it from Dana.");
        Assert.AreEqual("Unassign package 42", dispatcher.Log.Last(), "Not yet: the log shows \"Unassign package 42\".");
        dispatcher.Undo();
        Assert.AreEqual("Dana", board.DriverFor(42), "Not yet: undo gives package 42 back to Dana.");
    }
}
