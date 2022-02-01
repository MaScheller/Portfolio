document.addEventListener("DOMContentLoaded", () => {
	const bird = document.querySelector(".bird");
	const gameDisplay = document.querySelector(".game-container__flappybird");
	const ground = document.querySelector(".ground");
	document.getElementById("score").style.visibility ="visible";

	let birdLeft = 220;
	let birdBottom = 100;
	let gravity = 2;
	let isGameOver = false;
	let gap = 450;
	let score = 0;
	let gameTimerId;


	function control(e) {
		if (e.keyCode === 87) {
			jump();
		}
	}

	function startGame() {
		birdBottom -= gravity;
		bird.style.bottom = birdBottom + "px";
		bird.style.left = birdLeft + "px";
	}



	function jump() {
		if (birdBottom < 500) {
			birdBottom += 50;
			bird.style.bottom = birdBottom + "px";
		}
	}
	document.addEventListener("keydown", control)


	function generateObstacle() {
		let obstacleLeft = 500;
		let randomHeight = Math.random() * 60;
		let obstacleBottom = randomHeight;
		const obstacle = document.createElement("div");
		const topObstacle = document.createElement("div");
		if(isGameOver == false) {
			obstacle.classList.add("obstacle");
			topObstacle.classList.add("topObstacle");
		}
		gameDisplay.appendChild(obstacle);
		gameDisplay.appendChild(topObstacle);
		obstacle.style.left = obstacleLeft + "px";
		topObstacle.style.left = obstacleLeft + "px";
		obstacle.style.bottom = obstacleBottom + "px";
		topObstacle.style.bottom = obstacleBottom + gap + "px";


		function moveObstacle() {
			obstacleLeft -= 2;
			obstacle.style.left = obstacleLeft + "px";
			topObstacle.style.left = obstacleLeft + "px"
			if(obstacleLeft === -60){
				clearInterval(timerId);
				gameDisplay.removeChild(obstacle);
				gameDisplay.removeChild(topObstacle);
				score += 1;
				document.getElementById("score").innerHTML = "Score: " + score;
			}
			if(
				obstacleLeft > 200 && obstacleLeft < 280 && birdLeft === 220 &&
				(birdBottom < obstacleBottom + 153 || birdBottom > obstacleBottom + gap - 200)||
				birdBottom === 0){
				clearInterval(timerId);
				gameOver();
			}
		}
		let timerId = setInterval(moveObstacle, 20);
		if(isGameOver == false){
			setTimeout(generateObstacle, 3000);
		}
	}


	function gameOver() {
		clearInterval(gameTimerId);
		isGameOver = true;
		document.removeEventListener("keydown", control);
		//fragt den User nach seinem Namen und speichert seinen Score
		let person = prompt("Game Over! \nMöchten Sie Ihren Score in die Datenbank eintragen?", "Ihr Name");
		if (person == null || person == "") {

		} else {
			var name = person;
			var game = "Flappy";
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
		//gameDisplay.innerHTML = "Game Over"
	}

	document.getElementById("start").onclick = function() {
		if(isGameOver == false) {
			gameTimerId = setInterval(startGame, 20);
			document.getElementById("start").innerHTML = "Nochmal!";
			generateObstacle();

		} else if (isGameOver == true ) {
			window.location.reload();
		}
	}

})
