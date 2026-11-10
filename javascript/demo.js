// A demo: tries your code on a morning at the dispatch desk. You don't need to change it.
import { DispatchBoard, Dispatcher } from "./dispatch.js";

const board = new DispatchBoard();
const dispatcher = new Dispatcher(board);
dispatcher.assign(42, "Dana");
dispatcher.assign(43, "Leo");
dispatcher.assign(42, "Leo");
dispatcher.undo();
dispatcher.redo();
for (const line of dispatcher.log) {
  console.log(line);
}
console.log(board.describe());
