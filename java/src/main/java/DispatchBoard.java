import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

// Lakeside Parcel's dispatch board: which driver has which package. Read the ticket in README.md first.
class DispatchBoard {
    private final TreeMap<Integer, String> drivers = new TreeMap<>();

    String driverFor(int pkg) { return drivers.getOrDefault(pkg, "nobody"); }
    void assign(int pkg, String driver) { drivers.put(pkg, driver); }
    void unassign(int pkg) { drivers.remove(pkg); }

    String describe() {
        List<String> lines = new ArrayList<>();
        drivers.forEach((pkg, driver) -> lines.add("package " + pkg + " with " + driver));
        return "Board: " + String.join(", ", lines);
    }
}
