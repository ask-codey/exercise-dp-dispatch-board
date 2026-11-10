namespace Dispatch;

// Lakeside Parcel's dispatch board. Read the ticket in README.md first.

// Which driver has which package.
public class DispatchBoard
{
    private readonly SortedDictionary<int, string> drivers = new SortedDictionary<int, string>();

    public string DriverFor(int package) => drivers.TryGetValue(package, out string? driver) ? driver : "nobody";
    public void Assign(int package, string driver) => drivers[package] = driver;
    public void Unassign(int package) => drivers.Remove(package);
    public string Describe() => "Board: " + string.Join(", ", drivers.Select(pair => $"package {pair.Key} with {pair.Value}"));
}

// The planning team writes its own actions against this promise.
public interface IDispatchCommand
{
    void Execute();
    void Undo();
    string Describe();
}

// What the dispatcher's buttons call.
public class Dispatcher
{
    private readonly DispatchBoard board;

    public List<string> Log { get; } = new List<string>();

    public Dispatcher(DispatchBoard board) { this.board = board; }

    // The "Assign" button.
    public void Assign(int package, string driver)
    {
        board.Assign(package, driver);
        Log.Add($"Assign package {package} to {driver}");
    }

    // The planning team's code calls this with an action it wrote. It does nothing yet.
    public void Run(IDispatchCommand command)
    {
    }

    // The new Undo and Redo buttons call these. They do nothing yet.
    public void Undo()
    {
    }

    public void Redo()
    {
    }
}
