var board;
var canvas;
var context;
var type_black = 0;
var type1 = 1;
var type2 = 2;
var type3 = 3;
var score = 0;

var currentx = 0;
var currenty = 0;
var count_combo = 0;

var currentblocks = Array(2);

function onLoaded() {
  main();
}

function update_score() {
  score++;
  score_board = document.getElementById("score");
  score_board.innerText = score;
}

function random_color() {
  switch (Math.round(Math.random(300) * 100) % 4) {
    case 0:
      color = "white";
      break;
    case 1:
      color = "gray";
      break;
    case 2:
      color = "#f66";
      break;
    case 3:
      color = "#ff0";
      break;
    default:
      color = "white";
      break;
  }
  return color;
}

function make_board() {
  var board = Array(6);
  for (var i = 0; i < 6; i++) {
    board[i] = Array(11);
  }

  for (var i = 0; i < board.length; i++) {
    for (j = 0; j < board[0].length; j++) {
      board[i][j] = "black";
    }
  }

  return board;
}

function init() {
  board = Array(6);
  for (var i = 0; i < 6; i++) {
    board[i] = Array(11);
  }

  for (var i = 0; i < board.length; i++) {
    for (j = 0; j < board[0].length; j++) {
      board[i][j] = "black";
    }
  }
  canvas = document.getElementsByTagName("canvas")[0];
  context = canvas.getContext("2d");

  document.addEventListener("keypress", keyPressed, true);

  //	currentblocks[0] = {x: 0, y: 0, color: random_color()};
  //	currentblocks[1] = {x: 1, y: 0, color: random_color()};
  generate_block();

  draw();
}

function main() {
  init();

  canvasExample();

  draw();
}

function draw() {
  for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[x].length; y++) {
      switch (board[x][y]) {
        case "black":
          color = "black";
          break;
        case "white":
          color = "white";
          break;
        default:
          color = board[x][y];
      }

      context.fillStyle = color;
      context.fillRect(x * 20, y * 20, 10, 10);
    }
  }
  x = currentblocks[0].x;
  y = currentblocks[0].y;
  context.fillStyle = currentblocks[0].color;
  context.fillRect(x * 20, y * 20, 10, 10);
  x = currentblocks[1].x;
  y = currentblocks[1].y;
  context.fillStyle = currentblocks[1].color;
  context.fillRect(x * 20, y * 20, 10, 10);
}

function canvasExample() {
  // canvas is a reference to a <canvas> element
  canvas = document.getElementsByTagName("canvas")[0];
  var context = canvas.getContext("2d");
  context.fillRect(0, 0, 50, 350);
  canvas.setAttribute("width", "512"); // clears the canvas
  context.fillRect(0, 100, 50, 50);
  canvas.width = canvas.width; // clears the canvas
  context.fillStyle = "red";
  context.fillRect(0, 0, 512, 512); // only this square remains
}

function keyPressed(e) {
  //	board[currentblocks[0].x][currentblocks[0].y] = 'black';
  //	board[currentblocks[1].x][currentblocks[1].y] = 'black';

  console.log(e.charCode);
  //	switch (e.keyCode) {
  //		case KeyEvent.DOM_VK_UP:
  //			currentblocks[0].y++;
  //			break;
  //		case KeyEvent.DOM_VK_DOWN:
  //			currentblocks[0].y--;
  //			break;
  //		case KeyEvent.DOM_VK_LEFT:
  //			currentblocks[0].x++;
  //			break;
  //		case KeyEvent.DOM_VK_RIGHT:
  //			currentblocks[0].x++;
  //			break;
  //	}

  switch (e.charCode) {
    case "k":
    case 107:
      currentblocks[0].y--;
      currentblocks[1].y--;
      break;
    case "j":
    case 106:
      currentblocks[0].y++;
      currentblocks[1].y++;
      break;
    case "h":
    case 104:
      currentblocks[0].x--;
      currentblocks[1].x--;
      break;
    case "l":
    case 108:
      currentblocks[0].x++;
      currentblocks[1].x++;
      break;
    case "r":
    case 114:
      function rotate_block() {
        x0 = currentblocks[0].x;
        x1 = currentblocks[1].x;
        y0 = currentblocks[0].y;
        y1 = currentblocks[1].y;
        if (y0 == y1) {
          /*
           * -----
           * --**-
           */
          if (x0 > x1) right = 0;
          else right = 1;

          currentblocks[right].x--;
          currentblocks[right].y++;
          if (
            currentblocks[right].x < 0 ||
            currentblocks[right].y >= board[0].length
          ) {
            currentblocks[right].x++;
            currentblocks[right].y--;
          }
        } else {
          /*
           * --*--
           * --*--
           */
          if (y0 < y1) upside = 0;
          else upside = 1;

          currentblocks[upside].x++;
          currentblocks[upside].y++;
          if (
            currentblocks[upside].x >= board.length ||
            currentblocks[upside].y < 0
          ) {
            currentblocks[upside].x--;
            currentblocks[upside].y--;
          }
        }
      }
      rotate_block();
      break;
    case "s":
    case 115:
      function set_block() {
        board[currentblocks[0].x][currentblocks[0].y] = currentblocks[0].color;
        board[currentblocks[1].x][currentblocks[1].y] = currentblocks[1].color;
      }
      function after_set() {
        count_combo++;
        var erased = kill_chains();
        draw();
        if (erased)
          setTimeout(function() {
            after_set();
          }, 1000);
        update_score();
      }
      set_block();
      earth_gravity();
      after_set();
      update_score();
      generate_block();
      count_combo = 0;
      break;
  }

  if (currentblocks[0].x < 0 || currentblocks[1].x < 0) {
    currentblocks[0].x++;
    currentblocks[1].x++;
  }
  if (currentblocks[0].y < 0 || currentblocks[1].y < 0) {
    currentblocks[0].y++;
    currentblocks[1].y++;
  }
  if (
    currentblocks[0].x >= board.length ||
    currentblocks[1].x >= board.length
  ) {
    currentblocks[0].x--;
    currentblocks[1].x--;
  }
  if (
    currentblocks[0].y >= board[0].length ||
    currentblocks[1].y >= board[0].length
  ) {
    currentblocks[0].y--;
    currentblocks[1].y--;
  }

  //	board[currentblocks[0].x][currentblocks[0].y] = 'white';
  //	board[currentblocks[1].x][currentblocks[1].y] = 'white';
  draw();
}

function keyPressedTest(e) {
  switch (e.keyIdentifier) {
    case "Up":
      break;
    case "Down":
      break;
    case "Left":
      break;
    case "Right":
      break;
  }
}

function generate_block() {
  currentblocks[0] = { x: 2, y: 0 };
  currentblocks[0].color = random_color();
  currentblocks[1] = { x: 2, y: 1 };
  currentblocks[1].color = random_color();

  draw();
}

function earth_gravity() {
  for (var x = 0; x < board.length; x++)
    for (var y = board[0].length - 2; y >= 0; y--) {
      for (var ty = y; ty < board[0].length - 1; ty++) {
        if (board[x][ty + 1] == "black") {
          tmp = board[x][ty + 1];
          board[x][ty + 1] = board[x][ty];
          board[x][ty] = tmp;
        }
      }
    }
}

function kill_chains() {
  function count_chains(x, y, color, scaned_board) {
    if (x < 0 || y < 0) return 0;
    if (x >= board.length || y >= board[0].length) return 0;

    if (board[x][y] == "black") return 0;
    if (scaned_board[x][y] == "scaned") return 0;
    if (board[x][y] != color) return 0;
    scaned_board[x][y] = "scaned";

    count = 1;
    return (
      count +
      count_chains(x, y + 1, color, scaned_board) +
      count_chains(x, y - 1, color, scaned_board) +
      count_chains(x - 1, y, color, scaned_board) +
      count_chains(x + 1, y, color, scaned_board)
    );
  }

  var break_flg;
  var erased = false;
  var erase_candidate = make_board();
  for (var x = 0; x < board.length; x++)
    for (var y = 0; y < board[0].length; y++) {
      color = board[x][y];
      scaned_board = make_board();
      count = count_chains(x, y, color, scaned_board);

      console.log("count:" + count);
      if (count >= 4) {
        for (var x = 0; x < board.length; x++)
          for (var y = 0; y < board[0].length; y++) {
            if (scaned_board[x][y] == "scaned") erase_candidate[x][y] = "erase";
          }
        erased = true;
      }
    }
  function kill_chain() {
    for (var x = 0; x < board.length; x++)
      for (var y = 0; y < board[0].length; y++) {
        if (erase_candidate[x][y] == "erase") {
          board[x][y] = "black";
          score += 10 * count_combo;
        }
      }
  }
  kill_chain();
  earth_gravity();
  return erased;
}
