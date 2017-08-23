$('document').ready(function($) {
  var ogColor = "#2ecc71";
  var hoverId;

  // initialize game state
  var game = new Game();

  $( ".circle" ).click(function() {
    var id = $(this).attr('id');
    var coords = id.split(",");
    var dropColumn = coords[0];
    if (game.gameBoard.placeChip(dropColumn, 1, true)) {
      game.makeAIMove();
      //game.gameBoard.print();
    }
    else alert("Invalid Move!");
  });

  $(".circle").hover(function(event){
    // grab id to locate correct column
    var id = $(this).attr('id');
    hoverId = bottomPosition(id);
    document.getElementById(hoverId).style.backgroundColor = "#e67e22";
    $(document.getElementById(hoverId)).css({ transform: 'scale(1.08)' });
    }, function(){
    document.getElementById(hoverId).style.backgroundColor = ogColor;
    $(document.getElementById(hoverId)).css({ transform: 'scale(1)' });
  });

  // menu buttons
  $(".profile").click(function() {
    game.restart();
  });
  $(".messages").click(function() {
    game.depth = 3;
    $('a.fiction').text('Difficulty: Beginner');
  });
  $(".settings").click(function() {
    game.depth = 4;
    $('a.fiction').text('Difficulty: Easy');
  });
  $(".logout").click(function() {
    game.depth = 5;
    $('a.fiction').text('Difficulty: Medium');
  });
  $(".western").click(function() {
    game.depth = 6;
    $('a.fiction').text('Difficulty: Hard');
  });


  // get id of position at bottom of current column
  function bottomPosition(id) {
    var coordinates = id.split(",");
    var x = coordinates[0];
    var y = coordinates[1];
    var stopIndex = 0;
    // find spot at bottom of coliumn
    for (var i = 0; i < 6; i ++) {
      if (game.gameBoard.gameMatrix[x][i+1] != 0) {
        stopIndex = i;
        break;
      }
    }
    var newId = x + "," + stopIndex;
    return newId;
  }

  // Collapsable Mobile Menu
  $( ".cross" ).hide();
  $( ".menu" ).hide();
  $( ".hamburger" ).click(function() {
    $( ".menu" ).slideToggle( "slow", function() {
    });
  });

  $( ".hamburgerItem" ).click(function() {
    $( ".menu" ).slideToggle( "slow", function() {
    });
  });

  // From Erick Petrucelli on Stackoverflow
  // function rgb2hex(rgb) {
  //   rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  //   function hex(x) {
  //       return ("0" + parseInt(x).toString(16)).slice(-2);
  //   }
  //   return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  // }

});
