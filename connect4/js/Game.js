/**
 * Object to hold status of game
 */
function Game() {
  this.depth = 4; // how far AI will look, initialize at med. difficulty
  this.rows = 6;
  this.columns = 7;
  this.winningScore = 999999;
  this.winningPositions = [];
  this.player = 1;  //human starts the game; 1 is human, 2 is AI
  that = this;
  this.gameBoard = that.initializeBoard();
  this.computerTurn = false;
}

/**
* Gets computer's move from minimax algorithm
*/
Game.prototype.makeAIMove = function() {
  // if the player just won, alert congratz!
  var score = this.gameBoard.getScore();
  if (score == -this.winningScore) {
    alert("You Win!");
  }
  // only make the AI move if the player didn't win
  else {
    var AIMove = this.maximize(this.gameBoard, this.depth);
    var column = AIMove[0];
    this.gameBoard.placeChip(column, 2, true);
    // recalculate score after AI makes move
    var score = this.gameBoard.getScore();
    if (score == this.winningScore) alert("Computer Wins!");
  }
}

/**
 * Implementation of minimax algorithm
 */
Game.prototype.maximize = function(board, depth, alpha, beta) {
  var score = board.getScore();

  // if we've found a leave in the minimax tree, return
  if (board.isFinished(depth, score)) return [null, score];
  // initialize alpha at negative infinity
  var max = [null, -999999];
  // go through all possible moves
  for (var column=0; column < that.columns; column++) {
    var copiedBoard = board.copyBoard();
    // if we successfully placed a chip at the column
    if (copiedBoard.placeChip(column, 2, false)) {
      var followingMove = that.minimize(copiedBoard, depth-1, alpha, beta);

      // check if we need to udpate alpha
      if (max[0] == null || followingMove[1] > max[1]) {
          max[0] = column;
          max[1] = followingMove[1];
          alpha = followingMove[1];
      }

      // pruning--where the magic happens
      if (alpha >= beta) return max;

    }
  }
  return max;
}

/**
 * minimize every other depth
 */
Game.prototype.minimize = function(board, depth, alpha, beta) {
  var score = board.getScore();

  // if we've found a leave in the minimax tree, return
  if (board.isFinished(depth, score)) return [null, score];
  // initialize alpha at positive infinity
  var min = [null, 999999];

  // go through all possible moves
  for (var column=0; column < that.columns; column++) {
    var copiedBoard = board.copyBoard();
    // if we successfully placed a chip at the column
    if (copiedBoard.placeChip(column, 1, false)) {
      var followingMove = that.maximize(copiedBoard, depth-1, alpha, beta);

      // check if we need to udpate alpha
      if (min[0] == null || followingMove[1] < min[1]) {
          min[0] = column;
          min[1] = followingMove[1];
          beta = followingMove[1];
      }

      // pruning--where the magic happens
      if (alpha >= beta) return min;
    }
  }
  return min;
}

// initializes empty game board to start game
Game.prototype.initializeBoard = function() {
  var newBoard = new Array(that.columns);
  for (var i=0; i < newBoard.length; i++){
      newBoard[i] = new Array(that.rows);
      for (var j=0; j < newBoard[i].length; j++)
          newBoard[i][j]=0;
  }
  var gameBoard = new GameBoard(this, newBoard);
  return gameBoard;
}

// change player
// Game.prototype.switchPlayer = function() {
//   if (this.player == 1) this.player = 2;
//   else this.player = 1;
// }

// restart game
Game.prototype.restart = function() {
  this.gameBoard = that.initializeBoard();
  $( ".clicked1" ).toggleClass("clicked1");
  $( ".clicked2" ).toggleClass("clicked2");
}
