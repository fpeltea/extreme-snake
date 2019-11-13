// Modify this to use a different scores URL
const scoresAddress = "127.0.0.1:3000";
// // // // // // // // // // // // // // // // // // // //

var canvas;
var scoreCanvas;
var ctx;
var ctxScore;

// game speed in ms
const defaultGameSpeed = 280;
let gameSpeed = 280;

let currentMenu = "main";
let currentSelection = 0;
let score = 0;
let gameMode = 0;
let gameOngoing = false;
let topScores = [];
let topHardScores = [];
let nameField = [];
let newTail = 0;
let headPos = { x: 5, y: 5 };
let facing = "none";
let nextFacing = "none";
let reverseNext = false;
let snakeTail = [];
let tailLength = 0;
let coords = [];
let food = [];

canvas = document.getElementById("gameCanvas");
scoreCanvas = document.getElementById("scoreCanvas");
ctx = canvas.getContext("2d");
ctxScore = scoreCanvas.getContext("2d");
getTopScores();
document.addEventListener('keydown', keyboardHandler);
renderMainMenu();

ctx.scale(15, 15);

var gameInterval = window.setInterval(gameTick, 300);
clearInterval(gameInterval);

function keyboardHandler(event) {

  switch (event.key) {
    case "ArrowLeft":
      if (gameOngoing === true && facing != "left" && facing != "right") {
        nextFacing = "left";
        /*
        clearInterval(gameInterval);
        gameTick();
        gameInterval = setInterval(gameTick, 300);
        */
      };
      break;
    case "ArrowRight":
      if (gameOngoing === true && facing != "right" && facing != "left") {
        nextFacing = "right";
        /*
        clearInterval(gameInterval);
        gameTick();
        gameInterval = setInterval(gameTick, 300);
        */
      };
      break;
    case "ArrowUp":
      if (gameOngoing === true && facing != "up" && facing != "down") {
        nextFacing = "up";
        /*
        clearInterval(gameInterval);
        gameTick();
        gameInterval = setInterval(gameTick, 300);
        */
      };
      if (gameOngoing === false && currentSelection != 0) {
        currentSelection--;
        menu[currentMenu].render();
      };
      break;
    case "ArrowDown":
      if (gameOngoing === true && facing != "down" && facing != "up") {
        nextFacing = "down";
        /*
        clearInterval(gameInterval);
        gameTick();
        gameInterval = setInterval(gameTick, 300);
        */
      };
      if (gameOngoing === false && currentSelection < Object.keys(menu[currentMenu]).length - 2) {
        currentSelection++;
        menu[currentMenu].render();
      };
      break;
    case "Enter":
      menu[currentMenu][currentSelection]();
      break;
    case "Backspace":
      if (currentMenu == "name") {
        nameField.pop();
        renderNameMenu();
      };
      break;
  };
  if (/[a-zA-Z0-9]/.test(event.key) && event.key.length === 1 && currentMenu === "name" && nameField.length < 11) {
    nameField.push(event.key);
    renderNameMenu();
  };
};


const menu = {
  "main": {
    0: function () {
      currentMenu = "mode";
      currentSelection = 0;
      renderModeSelect()
    },
    1: function () {
      currentMenu = "scores";
      currentSelection = 0;
      renderScoresMenuLoad()
    },
    2: function () {
      currentMenu = "credits";
      currentSelection = 0;
      renderCredits()
    },
    render: function () {
      renderMainMenu()
    }
  },
  "mode": {
    0: function () {
      currentMenu = "none";
      gameMode = 0;
      startGame()
    },
    1: function () {
      currentMenu = "none";
      gameMode = 1;
      startGame()
    },
    render: function () {
      renderModeSelect()
    }
  },
  "end": {
    0: function () {
      currentMenu = "name";
      currentSelection = 0;
      renderNameMenu()
    },
    1: function () {
      currentMenu = "main";
      currentSelection = 0;
      renderMainMenu()
    },
    render: function () {
      renderEndMenu()
    }
  },
  "name": {
    0: function () {
      if (nameField.length > 0) {
        currentMenu = "scores";
        currentSelection = 0;
        submitScore()
      };
    },
    1: function () {
      currentMenu = "end";
      currentSelection = 0;
      renderEndMenu()
    },
    render: function () {
      renderNameMenu()
    }
  },
  "scores": {
    0: function () {
      currentMenu = "hardScores";
      currentSelection = 0;
      renderHardScoresMenuLoad()
    },
    1: function () {
      currentMenu = "main";
      currentSelection = 0;
      renderMainMenu()
    },
    render: function () {
      renderScoresMenu()
    }
  },
  "hardScores": {
    0: function () {
      currentMenu = "scores";
      currentSelection = 0;
      renderScoresMenuLoad()
    },
    1: function () {
      currentMenu = "main";
      currentSelection = 0;
      renderMainMenu()
    },
    render: function () {
      renderHardScoresMenu()
    }
  },
  "credits": {
    0: function () {
      currentMenu = "main";
      currentSelection = 0;
      renderMainMenu()
    },
    render: function () {
      renderCredits()
    }
  }
};


function renderModeSelect() {
  ctxScore.clearRect(0, 0, 240, 315);
  ctxScore.font = "35px courier new";
  ctxScore.fillText("SELECT MODE", 5, 30);
  ctxScore.font = '30px courier new';
  ctxScore.fillStyle = "black";
  ctxScore.fillText("Normal", 60, 100);
  ctxScore.fillText("Hard", 60, 140);
  ctxScore.font = '25px courier new';
  switch (currentSelection) {
    case 0:
      ctxScore.font = '30px courier new';
      ctxScore.fillText(">", 40, 100);
      ctxScore.font = '20px courier new';
      ctxScore.fillText("Snake behaves", 40, 180);
      ctxScore.fillText("as normal", 60, 200);
      break;
    case 1:
      ctxScore.font = '30px courier new';
      ctxScore.fillText(">", 40, 140);
      ctxScore.font = '20px courier new';
      ctxScore.fillText("Snake reverses", 35, 180);
      ctxScore.fillText("when you earn", 40, 200);
      ctxScore.fillText("a point", 75, 220);
      break;
  }
}


function startGame() {
  gameSpeed = defaultGameSpeed;
  ctx.clearRect(0, 0, 16, 21);
  clearInterval(gameInterval);
  gameOngoing = true;
  ctxScore.font = '300px serif';
  ctxScore.fillStyle = "darkgray";
  ctxScore.clearRect(0, 0, 240, 315);
  facing = "none";
  nextFacing = "none";
  score = 0;
  headPos = { x: 5, y: 5 };
  snakeTail = [];
  tailLength = 0;
  food.splice(0);
  coords = [];
  populateAllCoords();
  coords[headPos.x][headPos.y] = 1;
  food.push(generateFreeCoord());
  gameTick();
  gameInterval = setInterval(gameTick, gameSpeed);
};

function compareScores(a, b) {
  if (parseInt(a.score) < parseInt(b.score))
    return 1;
  if (parseInt(a.score) > parseInt(b.score))
    return -1;
  return 0;
};


function renderMainMenu() {
  ctxScore.clearRect(0, 0, 240, 315);
  ctxScore.font = '40px courier new';
  ctxScore.fillStyle = "black";
  ctxScore.fillText("EXTREME", 35, 70);
  ctxScore.fillText("SNAKE", 60, 100);
  ctxScore.font = '25px courier new';
  ctxScore.fillStyle = "black";
  ctxScore.fillText("Start game", 45, 140);
  ctxScore.fillText("High scores", 45, 170);
  ctxScore.fillText("Credits", 45, 200);
  switch (currentSelection) {
    case 0:
      ctxScore.fillText(">", 25, 140);
      break;
    case 1:
      ctxScore.fillText(">", 25, 170);
      break;
    case 2:
      ctxScore.fillText(">", 25, 200);
      break;
  }
};

function renderEndMenu() {
  ctxScore.clearRect(0, 0, 240, 315);
  ctxScore.fillStyle = "darkgray";
  ctxScore.fillRect(0, 40, 240, 120);
  ctxScore.fillStyle = "white";
  ctxScore.font = '43px courier new';
  ctxScore.fillText("GAME OVER", 0, 80);
  ctxScore.font = '26px courier new';
  ctxScore.fillText("Your score:", 30, 105);
  ctxScore.font = '50px courier new';
  ctxScore.fillText(score, 100, 150);
  ctxScore.font = '25px courier new';
  ctxScore.fillStyle = "black";
  ctxScore.fillText("Submit score", 25, 200);
  ctxScore.fillText("Return to menu", 25, 230);
  switch (currentSelection) {
    case 0:
      ctxScore.fillText(">", 5, 200);
      break;
    case 1:
      ctxScore.fillText(">", 5, 230);
      break;
  };
};

function nameFieldAlign() {
  return 110 - ((nameField.length - 1) * 11);
};



function renderNameMenu() {
  ctxScore.clearRect(0, 0, 240, 315);
  ctxScore.fillStyle = "darkgray";
  ctxScore.fillRect(0, 40, 240, 100);
  ctxScore.fillStyle = "#eee";
  ctxScore.fillRect(0, 70, 240, 60);
  ctxScore.fillStyle = "white";
  ctxScore.font = '24px courier new';
  ctxScore.fillText("Enter your name:", 5, 60);
  ctxScore.font = '36px courier new';
  ctxScore.fillStyle = "black";
  ctxScore.fillText(nameField.join(""), nameFieldAlign(), 115);
  ctxScore.font = '25px courier new';
  ctxScore.fillStyle = "black";
  ctxScore.fillText("Submit", 75, 200);
  ctxScore.fillText("Cancel", 75, 230);
  switch (currentSelection) {
    case 0:
      ctxScore.fillText(">", 55, 200);
      break;
    case 1:
      ctxScore.fillText(">", 55, 230);
      break;
  };

};

function renderScoresMenuLoad() {
  topScores.sort(compareScores);
  ctxScore.clearRect(0, 0, 240, 315);
  ctxScore.fillStyle = "black";
  ctxScore.font = "35px courier new";
  ctxScore.fillText("HIGH SCORES", 5, 30);
  ctxScore.fillText("NORMAL MODE", 5, 60);
  ctxScore.font = "20px courier new";
  ctxScore.fillText("Loading...", 60, 75);
  getTopScores().done(function (data) {
    if (currentMenu != "scores") {
      return;
    }
    ctxScore.clearRect(0, 60, 240, 120);
    topScores = data;
    for (let u = 0; u < topScores.length; u++) {
      ctxScore.fillText(1 + u + ". " + topScores[u].name, 5, 85 + (25 * u));
      ctxScore.fillText(topScores[u].score, 230 - (13 * topScores[u].score.length), 85 + (25 * u));
    };
  }).fail(function (error) {
    console.log(error);
    if (currentMenu != "scores") {
      return;
    }
    ctxScore.clearRect(0, 50, 240, 120);
    ctxScore.font = "18px courier new";
    ctxScore.fillText("Could not get scores,", 5, 75);
    ctxScore.fillText("please try again later", 5, 100);
  });

  renderScoresMenu();
}

function renderScoresMenu() {
  ctxScore.clearRect(0, 265, 240, 315);
  ctxScore.font = "20px courier new";

  if (currentSelection === 0) {
    ctxScore.fillText(">", 10, 285);
  } if (currentSelection === 1) {
    ctxScore.fillText(">", 10, 305);
  }

  ctxScore.fillText("Hard mode list", 35, 285);
  ctxScore.fillText("Return to menu", 35, 305);
};

function renderCredits() {
  ctxScore.clearRect(0, 0, 240, 315);
  ctxScore.font = "35px courier new";
  ctxScore.fillText("CREDITS", 40, 30);
  ctxScore.font = "20px courier new";
  ctxScore.fillText("Created by", 45, 100);
  ctxScore.fillText("Florin Peltea", 35, 125);
  ctxScore.fillText(">", 10, 305);
  ctxScore.fillText("Return to menu", 35, 305);

};

function renderHardScoresMenuLoad() {
  topScores.sort(compareScores);
  ctxScore.clearRect(0, 0, 240, 315);
  ctxScore.fillStyle = "black";
  ctxScore.font = "35px courier new";
  ctxScore.fillText("HIGH SCORES", 5, 30);
  ctxScore.fillText("HARD MODE", 25, 60);
  ctxScore.font = "20px courier new";
  ctxScore.fillText("Loading...", 60, 135);
  getTopHardScores().done(function (data) {
    if (currentMenu != "hardScores") {
      return;
    }
    ctxScore.clearRect(0, 60, 240, 120);
    topHardScores = data;
    for (let u = 0; u < topHardScores.length; u++) {
      ctxScore.fillText(1 + u + ". " + topHardScores[u].name, 5, 85 + (25 * u));
      ctxScore.fillText(topHardScores[u].score, 230 - (13 * topHardScores[u].score.length), 85 + (25 * u));
    };
  }).fail(function (error) {
    console.log(error);
    if (currentMenu != "scores") {
      return;
    }
    ctxScore.clearRect(0, 50, 240, 120);
    ctxScore.font = "18px courier new";
    ctxScore.fillText("Could not get scores,", 5, 75);
    ctxScore.fillText("please try again later", 5, 100);
  });

  renderHardScoresMenu();
}

function renderHardScoresMenu() {
  ctxScore.clearRect(0, 265, 240, 315);
  ctxScore.font = "20px courier new";

  if (currentSelection === 0) {
    ctxScore.fillText(">", 10, 285);
  } if (currentSelection === 1) {
    ctxScore.fillText(">", 10, 305);
  }

  ctxScore.fillText("Normal mode list", 35, 285);
  ctxScore.fillText("Return to menu", 35, 305);
}


function populateAllCoords() {
  for (let n = 0; n < 16; n++) {
    coords.push([]);
    for (let m = 0; m < 21; m++) {
      coords[n].push(0);
    };
  };
  console.log(coords);
};

function findCoord(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] == item[0] && arr[i][1] == item[1]) {
      return i;
    };
  };
  return -1;
};

/*
  function generateCoord(minX, maxX, minY, maxY) {
  let coordX = 0;
  let coordY = 0;
  minX = Math.ceil(minX);
  maxX = Math.floor(maxX);
  minY = Math.ceil(minY);
  maxY = Math.floor(maxY);
  coordX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  coordY =  Math.floor(Math.random() * (maxY - minY + 1)) + minY;
  let newCoord = [coordX, coordY];
  return newCoord;
}; 
*/

function gameScoreFont() {
  if (score <= 9) {
    return 300;
  } else if (score > 9 && score < 100) {
    return 250;
  } else {
    return 150;
  }
};

function gameScoreAlignX() {
  if (score <= 9) {
    return 45;
  } else if (score > 9 && score < 100) {
    return 0;
  } else {
    return 5;
  }
};

function gameScoreAlignY() {
  if (score <= 9) {
    return 250;
  } else if (score > 9 && score < 100) {
    return 230;
  } else {
    return 200;
  }
};

function generateFreeCoord() {
  let newCoord = [];
  let validX = [];
  let validY = [];
  for (let x = 0; x < coords.length; x++) {
    if (coords[x].find(state => state == 0) != undefined) {
      validX.push(x);
    }
  };
  let randX = Math.floor(Math.random() * (validX.length - 0)) + 0;
  for (let y = 0; y < coords[validX[randX]].length; y++) {
    if (coords[validX[randX]][y] === 0) {
      validY.push(y);
    }
  };
  console.log(validY);
  let randY = Math.floor(Math.random() * (validY.length - 0)) + 0;
  newCoord.push(validX[randX]);
  newCoord.push(validY[randY]);
  coords[validX[randX]][validY[randY]] = 1;
  return newCoord;
};

// tick function begins
function gameTick() {
  if (gameOngoing === true) {
    // managing tail
    if (gameMode === 0) {
      if (tailLength > 0) {
        if (newTail === 0) {
          coords[snakeTail[0][0]][snakeTail[0][1]] = 0;
          snakeTail.splice(0, 1);
        }
        snakeTail.push([headPos.x, headPos.y]);
        if (newTail > 0) {
          newTail--;
          if (defaultGameSpeed - (snakeTail.length * 3) >= 160) {
            gameSpeed = defaultGameSpeed - (snakeTail.length * 3);
            clearInterval(gameInterval);
            gameInterval = setInterval(gameTick, gameSpeed);
          }
        }
      }
    }

    if (gameMode === 1) {
      if (tailLength > 0) {
        if (newTail === 0) {
          coords[snakeTail[0][0]][snakeTail[0][1]] = 0;
          snakeTail.splice(0, 1);
          snakeTail.push([headPos.x, headPos.y]);
        } else {
          if (reverseNext) {

            snakeTail.push([headPos.x, headPos.y]);

            if (snakeTail.length === 1) {
              switch (facing) {
                case "up":
                  nextFacing = "down";
                  facing = "down";
                  break;
                case "down":
                  nextFacing = "up";
                  facing = "up";
                  break;
                case "left":
                  nextFacing = "right";
                  facing = "right";
                  break;
                case "right":
                  nextFacing = "left";
                  facing = "left";
                  break;
              }
            } else if (snakeTail.length > 1) {
              let xDiff = snakeTail[0][0] - snakeTail[1][0];
              let yDiff = snakeTail[0][1] - snakeTail[1][1];
              if (xDiff > 0) {
                nextFacing = "right";
                facing = "right";
              } else if (xDiff < 0) {
                nextFacing = "left";
                facing = "left";
              } else if (yDiff > 0) {
                nextFacing = "down";
                facing = "down";
              } else if (yDiff < 0) {
                nextFacing = "up";
                facing = "up";
              }
            }

            headPos.x = snakeTail[0][0];
            headPos.y = snakeTail[0][1];
            snakeTail.splice(0, 1);
            snakeTail.reverse();

          }
          if (!reverseNext) {
            snakeTail.push([headPos.x, headPos.y]);
            if (newTail > 0) {
              newTail--;
            }
            if (defaultGameSpeed - (snakeTail.length * 3) >= 160) {
              gameSpeed = defaultGameSpeed - (snakeTail.length * 3);
              clearInterval(gameInterval);
              gameInterval = setInterval(gameTick, gameSpeed);
            }
          }
        }
      }
    }
  }

  // modifying head coordinate
  if (!reverseNext) {
    switch (nextFacing) {
      case "up":
        facing = nextFacing;
        headPos.y--;
        break;
      case "down":
        facing = nextFacing;
        headPos.y++;
        break;
      case "left":
        facing = nextFacing;
        headPos.x--;
        break;
      case "right":
        facing = nextFacing;
        headPos.x++;
        break;
    }
  }

  reverseNext = false;


  // clearing game canvas
  ctx.clearRect(0, 0, 16, 21);

  // game over screen
  if ((headPos.x < 0 || headPos.x > 15 || headPos.y < 0 || headPos.y > 20) || (findCoord(snakeTail, [headPos.x, headPos.y]) != -1)) {
    clearInterval(gameInterval);
    gameOngoing = false;
    currentMenu = "end";
    menu[currentMenu].render();
    return "Game Over";
  };

  coords[headPos.x][headPos.y] = 1;

  // check if found food
  if (findCoord(food, [headPos.x, headPos.y]) !== -1) {
    food.splice(findCoord(food, [headPos.x, headPos.y]), 1);
    score++;
    tailLength++;
    newTail++;
    if (gameMode === 1) {
      reverseNext = true;
    }
    food.push(generateFreeCoord());
  }

  // render tail
  for (let l = 0; l < snakeTail.length; l++) {
    ctx.globalAlpha = 0.5 + (0.5 / (snakeTail.length - l + 1));
    ctx.fillRect(snakeTail[l][0], snakeTail[l][1], 1, 1);
  };
  ctx.globalAlpha = 1

  // render food pixels

  for (let j = 0; j < food.length; j++) {
    ctx.fillStyle = "orange";
    ctx.fillRect(food[j][0], food[j][1], 1, 1);
    ctx.fillStyle = "black";
  };

  // render head and score

  ctx.fillRect(headPos.x, headPos.y, 1, 1);
  ctxScore.font = gameScoreFont() + 'px serif';
  ctxScore.clearRect(0, 0, 240, 320);
  ctxScore.fillText(score, gameScoreAlignX(), gameScoreAlignY());

  // tick ends
};

function submitScore() {
  let scoreUrl;
  if (gameMode === 0) {
    scoreUrl = scoresAddress + "/scores";
  } else if (gameMode === 1) {
    scoreUrl = scoresAddress + "/hard-scores";
  }

  if (nameField.length > 0) {
    $.ajax({
      method: "POST",
      url: scoreUrl,
      data: { name: nameField.join(""), score: score },
      xhrFields: {
        withCredentials: false
      },
      cache: false,
      success: console.log("Score successfully submitted")
    });
    renderMainMenu();
    currentMenu = "main";
  }
};

function getTopScores() {
  return $.ajax({
    method: "GET",
    url: scoresAddress + "/scores",
    success: function (data) {
      console.log(data);
      return data.slice(0, 7);
    }
  });
};

function getTopHardScores() {
  return $.ajax({
    method: "GET",
    url: scoresAddress + "/hard-scores",
    success: function (data) {
      console.log(data);
      return data.slice(0, 7);
    }
  });
};
