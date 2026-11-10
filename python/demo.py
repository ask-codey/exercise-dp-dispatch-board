"""A demo: tries your code on a morning at the dispatch desk. You don't need to change it."""
from dispatch import DispatchBoard, Dispatcher

board = DispatchBoard()
dispatcher = Dispatcher(board)
dispatcher.assign(42, "Dana")
dispatcher.assign(43, "Leo")
dispatcher.assign(42, "Leo")
dispatcher.undo()
dispatcher.redo()
for line in dispatcher.log:
    print(line)
print(board.describe())
