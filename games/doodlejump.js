document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".doodle__grid");
	const doodler = document.createElement("div");
	document.getElementById("score").style.visibility ="visible";
	let doodlerLeftSpace = 25;
	let startPoint = 150;
	let doodlerBottomSpace = startPoint;
	let isGameOver = false;
	let platformCount = 5;
	let platforms =[];
	let upTimerId;
	let downTimerId;
	let isJumping = true;
	let isGoingLeft = false;
	let isGoingRight = false;
	let leftTimerId;
	let rightTimerId;
	let score = 0;
	let started = false;


	function control(e) {
		if(e.keyCode === 65) {
			moveLeft();
		}
		else if (e.keyCode === 68) {
			moveRight();
		}
		else if (e.keyCode === 87) {
			moveStraight();
		}
	}

	function moveLeft() {
		if(isGoingRight) {
			clearInterval(rightTimerId);
			isGoingRight = false;
		}
		isGoingLeft = true;
		clearInterval(leftTimerId);
		leftTimerId = setInterval(function () {
			if(doodlerLeftSpace >= 0) {
				doodlerLeftSpace -= 5;
				doodler.style.left = doodlerLeftSpace + "px";
			} else moveRight();
		},20)
	}

		function moveRight() {
			if(isGoingLeft) {
				clearInterval(leftTimerId);
				isGoingLeft = false;
			}
			isGoingRight = true;
			clearInterval(rightTimerId);
			rightTimerId = setInterval(function() {
				if(doodlerLeftSpace <= 340) {
					doodlerLeftSpace += 5;
					doodler.style.left = doodlerLeftSpace + "px";
				} else moveLeft();
			},20)
		}

		function moveStraight() {
			isGoingLeft = false;
			isGoingRight = false;
			clearInterval(rightTimerId);
			clearInterval(leftTimerId);
		}


	function createDoodler() {
		grid.appendChild(doodler)
		doodler.classList.add("doodler");
		doodlerLeftSpace = platforms[0].left;
		doodler.style.left = doodlerLeftSpace + "px";
		doodler.style.bottom = doodlerBottomSpace + "px";
	}

	class Platform{
		constructor(newPlatBottom) {
			this.bottom = newPlatBottom;
			this.left = Math.random() * 315;
			this.visual = document.createElement("div");

			const visual = this.visual;
			visual.classList.add("doodle__platform");
			visual.style.left = this.left + "px";
			visual.style.bottom = this.bottom + "px";
			grid.appendChild(visual);
		}
	}

	function createPlatforms() {
		for (let i = 0; i < platformCount; i++) {
			let platGap = 600 / platformCount;
			let newPlatBottom = 100 + i * platGap;
			let newPlatform = new Platform(newPlatBottom);
			platforms.push(newPlatform);
			console.log(platforms);
		}
	}

	function movePlatforms() {
		if(doodlerBottomSpace > 200){
			platforms.forEach(platform => {
				platform.bottom -= 4;
				let visual = platform.visual;
				visual.style.bottom = platform.bottom + "px";

				if(platform.bottom < 10) {
					let firstPlatform = platforms[0].visual;
					firstPlatform.classList.remove("doodle__platform");
					platforms.shift();
					score++;
					document.getElementById('score').innerHTML = "Score: "+score;
					console.log(platforms);
					let newPlatform = new Platform(600);
					platforms.push(newPlatform);
				}
			})
		}
	}

	function jump() {
		clearInterval(downTimerId);
		isJumping = true;
		upTimerId = setInterval(function () {
			if(doodlerBottomSpace >= 510) {
				fall();
			} else {
				 doodlerBottomSpace +=20;
			 }
			doodler.style.bottom = doodlerBottomSpace + "px";
			if(doodlerBottomSpace > startPoint + 200 ){
				fall();
			}
		}, 30)
	}

	function fall() {
		clearInterval(upTimerId);
		isJumping = false;
		downTimerId = setInterval(function () {
			doodlerBottomSpace -= 5;
			doodler.style.bottom = doodlerBottomSpace + "px";
			if (doodlerBottomSpace <= 0) {
				gameOver();
			}
			platforms.forEach(platform => {
				if(
					(doodlerBottomSpace >= platform.bottom) &&
					(doodlerBottomSpace <= platform.bottom + 15) &&
					((doodlerLeftSpace + 60) >= platform.left) &&
					(doodlerLeftSpace <= (platform.left + 85)) &&
					(isJumping == false)
				)
				{
					console.log("landed");
					startPoint = doodlerBottomSpace;
					jump();
				}
			})

		}, 30)
	}

	function gameOver () {
		console.log("Game Over");
		isGameOver = true;
		while (grid.firstChild) {
			grid.removeChild(grid.firstChild);
		}
		grid.innerHTML = "Game Over"
		clearInterval(upTimerId);
		clearInterval(downTimerId);
		clearInterval(leftTimerId);
		clearInterval(rightTimerId);
		//fragt den User nach seinem Namen und speichert seinen Score
		let person = prompt("Game Over! \nMöchten Sie Ihren Score in die Datenbank eintragen?", "Ihr Name");
		if (person == null || person == "") {

		} else {
			var name = person;
			var game = "Doodle";
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



	function start() {
		if(isGameOver == false) {
			createPlatforms();
			createDoodler();
			setInterval(movePlatforms, 30);
			jump();
			document.addEventListener('keydown', control);

		}
	}

//attach to button
document.getElementById("start").onclick = function() {
	if(started == false) {
		start();
		document.getElementById("start").innerHTML = "Nochmal!";
		started = true;
	} else if (started == true ) {
		window.location.reload();
	}
}



})
