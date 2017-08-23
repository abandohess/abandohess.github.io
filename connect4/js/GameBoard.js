
/**
* Creates an instance of a gameBoard.
*
* @constructor
* @this {GameBoard}
* @param {Game} gameStatus Keeps track of game stats (depth, rows/cols/ etc)
* @param {array} gameBoard Holds chip positions in 2d array
*/
function GameBoard(game, matrix) {
  this.gameStatus = game;
  this.gameMatrix = matrix;
}

/**
* Inserts a chip in specified column, only changes chip color
* if changeColor is true
*/
GameBoard.prototype.placeChip = function(column, player, changeColor) {
  // make sure move is valid
  if (this.gameMatrix[column][0] == 0 && column >= 0 && column < this.gameStatus.columns) {
    // find the right place to leave the chip
    for (var y = this.gameStatus.rows-1; y >= 0; y--) {
      if (this.gameMatrix[column][y] == 0) {
        this.gameMatrix[column][y] = player;
        if (changeColor) {
          $(document.getElementById(column + "," + y)).toggleClass("clicked" + player);
        }
        //this.gameStatus.switchPlayer();
        //console.log(this.gameStatus.player)
        break;
      }
    }
    return true;
  } else {
    return false;
  }
}

/**
* Creates a copy of the gameboard to be used while the minimax progresses
* through the game tree
*/
GameBoard.prototype.copyBoard = function() {
  var copyMatrix = new Array(this.gameStatus.columns);
  for (var i=0; i < this.gameStatus.columns; i++) {
    var row = new Array(this.gameStatus.rows);
    copyMatrix[i] = row;
    for (var j=0; j < this.gameStatus.rows; j++) {
      copyMatrix[i][j] = this.gameMatrix[i][j];
    }
  }
  return new GameBoard(this.gameStatus, copyMatrix);
}

/**
* Check if minimax has gone far enough
*/
GameBoard.prototype.isFinished = function(depth, score) {
  if (depth == 0 || score == this.gameStatus.winningScore || score == -this.gameStatus.winningScore) {
    return true;
  }
  return false;
}

/**
* Print board for Debugging
*/
GameBoard.prototype.print = function() {
  for (var x=0; x<this.gameStatus.columns; x++) {
    if (x != 0) console.log("\n");
    for (var y=0; y<this.gameStatus.rows; y++ ) {
      console.log("[" + this.gameMatrix[x][y] + "]");
    }
  }
}

/**
* Algorithm for ranking a particular board
*/
GameBoard.prototype.getScore = function() {
  var verticalScore = 0;
  var horizontalScore = 0;
  var increasingDiagonalScore = 0;
  var decreasingDiagonalScore = 0;

  // first, check for vertical sequences of 4
  for (var x=0; x<this.gameStatus.columns; x++) {
    for (var y=0; y <this.gameStatus.rows-3; y++) {
      var score = this.getScoreHelper(x, y, 0, 1);
      if (score == this.gameStatus.winningScore) return this.gameStatus.winningScore;
      if (score == -this.gameStatus.winningScore) return -this.gameStatus.winningScore;
      verticalScore += score;
    }
  }
  // second, check for horizontal sequences of 4
  for (var x=0; x<this.gameStatus.columns-3; x++) {
    for (var y=0; y <this.gameStatus.rows; y++) {
      var score = this.getScoreHelper(x, y, 1, 0);
      if (score == this.gameStatus.winningScore) return this.gameStatus.winningScore;
      if (score == -this.gameStatus.winningScore) return -this.gameStatus.winningScore;
      horizontalScore += score;
    }
  }
  // third, check for increasing diagonal sequences of 4
  for (var x=0; x<this.gameStatus.columns-3; x++) {
    for (var y=this.gameStatus.rows-1; y>this.gameStatus.rows-4; y--) {
      var score = this.getScoreHelper(x, y, 1, -1);
      if (score == this.gameStatus.winningScore) return this.gameStatus.winningScore;
      if (score == -this.gameStatus.winningScore) return -this.gameStatus.winningScore;
      increasingDiagonalScore += score;
    }
  }
  // fourth, check for decreasing diagonal sequences of 4
  for (var x=0; x<this.gameStatus.columns-3; x++) {
    for (var y=0; y<this.gameStatus.rows-3; y++) {
      var score = this.getScoreHelper(x, y, 1, 1);
      if (score == this.gameStatus.winningScore) return this.gameStatus.winningScore;
      if (score == -this.gameStatus.winningScore) return -this.gameStatus.winningScore;
      decreasingDiagonalScore += score;
    }
  }

  var totalScore = verticalScore + horizontalScore + increasingDiagonalScore + decreasingDiagonalScore;
  return totalScore;
}

/**
* Scores a particular position on the board; deltaX and deltaY determine
* whether we are checking verticaly, horizontally, or diagonally.
*/
GameBoard.prototype.getScoreHelper = function(xCoord, yCoord, deltaX, deltaY) {
  var playerPoints = 0;
  var AIPoints = 0;
  var playerWinningPositions = [];
  var AIWinningPositions = [];
  // look for strings of four in a row
  for (var i=0; i < 4; i++) {
    // player-controlled position
    if (this.gameMatrix[xCoord][yCoord] == 1) {
      playerPoints += 1;
      playerWinningPositions.push([xCoord, yCoord]);
    // computer-controlled position
    } else if (this.gameMatrix[xCoord][yCoord] == 2) {
      AIPoints += 1;
      AIWinningPositions.push([xCoord, yCoord]);
    }
    // incrememnt to next position
    xCoord += deltaX;
    yCoord += deltaY;
  }
  // now look for a winner
  if (playerPoints == 4) {
    this.gameStatus.winningPositions = playerWinningPositions;
    return -this.gameStatus.winningScore;
  } else if (AIPoints == 4) {
    this.gameStatus.winningPositions = AIWinningPositions;
    return this.gameStatus.winningScore;
  } else {
    // if no winner, return AI's points
    return AIPoints;
  }
}
