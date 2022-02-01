document.addEventListener("DOMContentLoaded", () => {
const grid = document.querySelector(".candy_grid");
document.getElementById("score").style.visibility ="visible";
const width = 8;
const squares = [];
let score = 0;
let started = false;

const candyColors = [
	"url(/img/red-candy.png)",
	"url(/img/yellow-candy.png)",
	"url(/img/orange-candy.png)",
	"url(/img/purple-candy.png)",
	"url(/img/green-candy.png)",
	"url(/img/blue-candy.png)"
]
//create Board
function createBoard() {
	for (let i = 0; i < width*width; i++) {
		const square = document.createElement("div");
		square.setAttribute("draggable", true);
		square.setAttribute("id", i);
		let randomColor = Math.floor(Math.random() * candyColors.length);
		square.style.backgroundImage = candyColors[randomColor];
		grid.appendChild(square);
		squares.push(square);

		let colorBeingDragged;
		let colorBeingReplaced;
		let squareIdBeingDragged;
		let squareIdBeingReplaced;
		squares.forEach(square => square.addEventListener("dragstart", dragStart));
		squares.forEach(square => square.addEventListener("dragend", dragEnd));
		squares.forEach(square => square.addEventListener("dragover", dragOver));
		squares.forEach(square => square.addEventListener("dragenter", dragEnter));
		squares.forEach(square => square.addEventListener("dragleave", dragLeave));
		squares.forEach(square => square.addEventListener("drop", dragDrop));
	}
}


function dragStart() {
	colorBeingDragged = this.style.backgroundImage;
	squareIdBeingDragged = parseInt(this.id);
	console.log(colorBeingDragged);
	console.log(this.id, "dragstart");
}

function dragOver(e) {
	e.preventDefault();
}

function dragEnter(e) {
	e.preventDefault();
}

function dragLeave() {
}

function dragDrop() {
	console.log(this.id, "dragdrop");
	colorBeingReplaced = this.style.backgroundImage;
	squareIdBeingReplaced = parseInt(this.id);
	this.style.backgroundImage = colorBeingDragged;
	squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
}

function dragEnd() {
	console.log(this.id, "dragend");
	//valid moves?
	let validMoves = [
		squareIdBeingDragged - 1, 		//Candy to the left
		squareIdBeingDragged - width,	//Candy Above
		squareIdBeingDragged + 1,		//Candy to the right
		squareIdBeingDragged + width	//Candy below
	];

	let validMove = validMoves.includes(squareIdBeingReplaced);

	if(squareIdBeingReplaced && validMove) {
		let scoredRowOfFive = checkRowForFive();
		let scoredColumnOfFive = checkColumnForFive();
		let scoredRowOfFour = checkRowForFour();
		let scoredColumnOfFour = checkColumnForFour();
		let scoredRowOfThree = checkRowForThree();
		let scoredColumnOfThree = checkColumnForThree();

		if(scoredRowOfFive || scoredColumnOfFive ||
			scoredRowOfFour || scoredColumnOfFour ||
			scoredRowOfThree || scoredColumnOfThree)
			{ squareIdBeingReplaced = null;}
	//if no combo scored swap back to original candies
		else if(!scoredRowOfFive && !scoredColumnOfFive &&
			!scoredRowOfFour && !scoredColumnOfFour &&
			!scoredRowOfThree && !scoredColumnOfThree){
		squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
		squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
	}

	} else if (squareIdBeingReplaced && !validMove) {
		squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
		squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
	} else squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
}

//Move Candies down
function moveDown() {
	for(i = 0; i <= 55; i++) {
		if (squares[i + width].style.backgroundImage === "") {
			squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
			squares[i].style.backgroundImage = "";
		}
			const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
			const isFirstRow = firstRow.includes(i);
			if(isFirstRow && (squares[i].style.backgroundImage === "")) {
				let randomColor = Math.floor(Math.random() * candyColors.length);
				squares[i].style.backgroundImage = candyColors[randomColor];
			}
		}
	}


//checking for matches
//check for row of Five Candies
function checkRowForFive (){
	for (i = 0; i <= 59; i++) {
		let rowOfFive = [i, i+1, i+2, i+3, i+4];
		let decidedColor = squares[i].style.backgroundImage;
		const isBlank = squares[i].style.backgroundImage === "";
		const notValid = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52, 53, 54, 55, 60, 61, 62, 63];
		if(notValid.includes(i)) continue;

		if (rowOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
			score += 5;
			rowOfFive.forEach(index => {
				squares[index].style.backgroundImage = "";
			})
			return true;
			moveDown();
		}
	}
	return false;
}


//check for column of Five Candies
function checkColumnForFive (){
	for (i = 0; i <= 31; i++) {
		let columnOfFive = [i, i+width, i+width*2, i+width*3, i+width*4];
		let decidedColor = squares[i].style.backgroundImage;
		const isBlank = squares[i].style.backgroundImage === "";

		if (columnOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
			score += 5;
			columnOfFive.forEach(index => {
				squares[index].style.backgroundImage = "";
			})
			return true;
			moveDown();
		}
	}
	return false;
}


//check for row of Four Candies
function checkRowForFour (){
	for (i = 0; i <= 60; i++) {
		let rowOfFour = [i, i+1, i+2, i+3];
		let decidedColor = squares[i].style.backgroundImage;
		const isBlank = squares[i].style.backgroundImage === "";
		const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
		if(notValid.includes(i)) continue;

		if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
			score += 4;
			rowOfFour.forEach(index => {
				squares[index].style.backgroundImage = "";
			})
				return true;
				moveDown();
		}
	}
		return false;
}

//check for column of Four Candies
function checkColumnForFour (){
	for (i = 0; i <= 39; i++) {
		let columnOfFour = [i, i+width, i+width*2, i+width*3];
		let decidedColor = squares[i].style.backgroundImage;
		const isBlank = squares[i].style.backgroundImage === "";

		if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
			score += 4;
			columnOfFour.forEach(index => {
				squares[index].style.backgroundImage = "";
			})
				return true;
				moveDown();
		}
	}
		return false;
}

//check for row of Three Candies
function checkRowForThree (){
	for (i = 0; i <= 61; i++) {
		let rowOfThree = [i, i+1, i+2];
		let decidedColor = squares[i].style.backgroundImage;
		const isBlank = squares[i].style.backgroundImage === "";
		const notValid = [6, 7, 14, 15, 22, 23 ,30, 31, 38, 39, 46, 47, 54, 55];
		if(notValid.includes(i)) continue;

		if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
			score += 3;
			rowOfThree.forEach(index => {
				squares[index].style.backgroundImage = "";
			})
				return true;
				moveDown();
		}
	}
		return false;
}

//check for column of Three Candies
function checkColumnForThree (){
	for (i = 0; i <= 47; i++) {
		let columnOfThree = [i, i+width, i+width*2];
		let decidedColor = squares[i].style.backgroundImage;
		const isBlank = squares[i].style.backgroundImage === "";

		if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
			score += 3;
			columnOfThree.forEach(index => {
				squares[index].style.backgroundImage = "";
			})
				return true;
				moveDown();
		}
	}
		return false;
}



document.getElementById("start").onclick = function() {
	if(started == false) {
		createBoard();
		document.getElementById("start").innerHTML = "Score Speichern!";
		started = true;
		window.setInterval(function(){
			moveDown()
			checkRowForFive();
			checkColumnForFive();
			checkRowForFour()
			checkColumnForFour()
			checkRowForThree()
			checkColumnForThree()
			document.getElementById("score").innerHTML = "Score: " + score + "";

		}, 100) } else if(started == true){
			let person = prompt("Game Over! \nMöchten Sie Ihren Score in die Datenbank eintragen?", "Ihr Name");
			if (person == null || person == "") {

			} else {
				var name = person;
				var game = "Candy";
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




})
