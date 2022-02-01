var grid;
var grid_new;
var score = 0;
function blankGrid() {
	return [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
	];
}

function setup() {
	createCanvas(800, 800);
	noLoop();
	grid = blankGrid();
	grid_new = blankGrid();
	addNumber();
	addNumber();
	document.getElementById("canvas__2048").prepend(canvas)
	document.getElementById("score").style.visibility ="visible";
	var ctx = canvas.getContext('2d');
	updateCanvas();
}

function addNumber() {
	var options = [];
	for ( var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid[i][j] === 0) {
				options.push({
					x: i,
					y: j
				});
			}
		}
	}
	if (options.length > 0);
	var spot = random(options);
	var r = random(1);
	grid[spot.x][spot.y] = r > 0.1 ? 2 : 4;
	grid_new[spot.x][spot.y] = 1;
}

function compare(a,b) {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (a[i][j] !== b[i][j]) {
				return true;
			}
		}
	}
	return false;
}

//Ein Zug / eine Bewegung
function keyPressed() {
	var flipped = false;
	var rotated = false;
	var played = true;

	switch (keyCode) {
		case 83:
		//do nothing
		break;

		case 87:
		grid = flipGrid(grid);
		flipped = true;
		break;

		case 68:
		grid = transposeGrid(grid);
		rotated = true;
		break;

		case 65:
		grid = transposeGrid(grid);
		grid = flipGrid(grid);
		rotated = true;
		flipped = true;
		break;

		default:
		played = false;
	}

	if (played == true) {
		var past = copyGrid(grid);
		for (var i = 0; i < 4; i++) {
			grid[i] = operate(grid[i]);
		}
	var changed = compare(past, grid);
    if (flipped) {
      grid = flipGrid(grid);
    }
    if (rotated) {
      grid = transposeGrid(grid);
    }
    if (changed) {
      addNumber();
    }
    updateCanvas();

    var gameover = isGameOver();
    if (gameover) {
      alert('GAME OVER');
    }

    var gamewon = isGameWon();
    if (gamewon) {
      alert('GAME WON');
			let person = prompt("Game Over! \nMöchten Sie Ihren Score in die Datenbank eintragen?", "Ihr Name");
			if (person == null || person == "") {

			} else {
				var name = person;
				var game = "2048";
				var highscore = score;
				if(name!="" && game!="" && highscore>0){
					$.ajax({
						url: "save.php",
						type: "POST",
						data: {
							name: name,
							game: game,
							highscore: highscore

						},
						cache: false,
						success: function(dataResult){
							var dataResult = JSON.parse(dataResult);
							if(dataResult.statusCode==200){
								alert("Score erfolgreich gespeichert");
							}
							else if(dataResult.statusCode==201){
								alert("Etwas ist schief gelaufen");
							} }
					}); }
					else{
						alert("Bitte alle Felder ausfüllen!");
					} }
				}
    }
	}


function isGameWon() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (grid[i][j] == 2048) {
        return true;
      }
    }
  }
  return false;
}

function isGameOver() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (grid[i][j] == 0) {
        return false;
      }
      if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
        return false;
      }
      if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
        return false;
      }
    }
  }

  return true;
}


function operate(row) {
	row = slide(row);
	row = combine(row);
	row = slide(row);
	return row;
}

function draw() {
	background(255);
	drawGrid();

}

//Erstellt ein Array
function slide(row) {
	var arr = row.filter(value => value);
	var missing = 4 - arr.length;
	var zeros = Array(missing).fill(0);
	arr = zeros.concat(arr);
	return arr;
}

//Areiten am gerade erstellten Array
function combine(row) {
	for (var i = 3; i >= 1; i--) {
	var a = row[i];
	var b = row[i - 1];
	if (a == b) {
		row[i] = a + b;
		score += row[i];
		row[i - 1] = 0;
		}
	}
	return row;
}

function updateCanvas() {
	background(255);
	drawGrid();
	document.getElementById("score").innerHTML = "Score: "+score;
	document.getElementById("save").onclick = function(){
			//fragt den User nach seinem Namen und speichert seinen Score
			let person = prompt("Game Over! \nMöchten Sie Ihren Score in die Datenbank eintragen?", "Ihr Name");
			if (person == null || person == "") {

			} else {
				var name = person;
				var game = "2048";
				var highscore = score;
				if(name!="" && game!="" && highscore>0){
					$.ajax({
						url: "save.php",
						type: "POST",
						data: {
							name: name,
							game: game,
							highscore: highscore

						},
						cache: false,
						success: function(dataResult){
							var dataResult = JSON.parse(dataResult);
							if(dataResult.statusCode==200){
								alert("Score erfolgreich gespeichert");
							}
							else if(dataResult.statusCode==201){
								alert("Etwas ist schief gelaufen");
							} }
					}); }
					else{
						alert("Bitte alle Felder ausfüllen!");
					} }
        }
}

function drawGrid() {
	var w = 200;
	for ( var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			noFill();
			strokeWeight(2);
			var value = grid[i][j];
			var s = value.toString();
			if (grid_new[i][j] === 1) {
				stroke(400, 0, 400);
				strokeWeight(16);
				grid_new[i][j] = 0;
			} else {
				strokeWeight(4);
				stroke(0);
			}

		if (value != 0) {
        fill(colorsSizes[s].color);
		} else {
        noFill();
		}
		rect(i * w, j * w, w, w, 30);
		if (value !==0) {
			textAlign(CENTER, CENTER);
			noStroke();
			fill(0);
			textSize(colorsSizes[s].size);
			text(value, i * w + w / 2, j * w + w / 2);
		}
	}
}
}

function flipGrid(grid) {
	for (var i = 0; i < 4; i++) {
		grid[i].reverse();
	}
	return grid;
}

function transposeGrid(grid) {
	var newGrid = blankGrid();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			newGrid[i][j] = grid[j][i];
		}
	}
	return newGrid;
}

function copyGrid(grid){
	var extra = blankGrid();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			extra[i][j] = grid[i][j];
		}
	}
	return extra;
}

let colorsSizes = {
  '2': {
    size: 64,
    color: '#F35956'
  },
  '4': {
    size: 64,
    color: '#F35956'
  },
  '8': {
    size: 64,
    color: '#49BB6C'
  },
  '16': {
    size: 64,
    color: '#2494C1'
  },
  '32': {
    size: 64,
    color: '#9659A7'
  },
  '64': {
    size: 64,
    color: '#F1C500'
  },
  '128': {
    size: 36,
    color: '#FF5956'
  },
  '256': {
    size: 36,
    color: '#F1C5FF'
  },
  '512': {
    size: 36,
    color: '#00000'
  },
  '1024': {
    size: 64,
    color: '#24FFC1'
  },
  '2048': {
    size: 64,
    color: '#A659A9'
  }
};
