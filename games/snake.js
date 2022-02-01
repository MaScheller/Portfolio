//Wenn das Fenster vollständig geladen ist
window.onload = function(){

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var score = 0;
    var direction = 0;
    var snake = new Array(5);
    var active = false;
    var speed = 250;
    var apple = new Image();
    var body = document.getElementById('snake_buttons');
    apple.src = "/img/apple.png";
		var snakeAussehen = new Image();
		snakeAussehen.src ="/img/snakeAussehen.png";
    //0 right
    //1 left
    //2 down
    //3 up
	  //show_score();
    document.getElementById("restart").style.display = "none";
    document.getElementById("back").style.display = "none";

    if(active == false)
	{
		document.getElementById("start").addEventListener("click", function()
		{
            var e = document.getElementById("dif");
            speed = e.options[e.selectedIndex].value;
            document.getElementById("start").style.display = "none";
						//document.getElementById("tutorialText").style.display = "none";
            document.getElementById("dif").style.display = "none";
            document.getElementsByTagName("option")[0].style.display = "none";
            document.getElementById("snake_buttons").style.display = "none";
            document.getElementById("score").style.visibility = "visible";
            //body.append(canvas);
            //Funktionen die zum Aufruf des Spieles benötigt werden
            active = true;
            map = generate_snake(map);
            map = generate_food(map);
            draw_game();
		});
    }

    //Generierung des "Rasters" auf dem Spielfeld
    var map = new Array(20);
    for(var i = 0; i < map.length; i++)
	   {
        map[i] = new Array(20);
    }

    //800x800 Spielfeldgröße und je ein Block(40x40) oben und links Abstand + 4px extra Rand
    canvas.width = 800;
    canvas.height = 800;





    //Prüft und ändert die Bewegungsrichtung der Schlange
    window.addEventListener('keydown', function(e)
	{
        if(e.keyCode === 87 && (snake[0].y - 1) != snake[1].y)
		{
            direction = 2; // Up
        }
        else if(e.keyCode === 83 && (snake[1].y - 1) != snake[0].y)
		{
            direction = 3; // Down
        }
        else if(e.keyCode === 65 && (snake[0].x - 1) != snake[1].x)
		{
            direction = 1; // Left
        }
        else if(e.keyCode === 68 && (snake[1].x - 1) != snake[0].x)
		{
            direction = 0; // Right
        }
    });

    function draw_game()
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i = snake.length - 1; i >= 0; i--)
		{
            if(i === 0)
			{
                switch(direction)
				{
                    case 0: // Right
                        snake[0] = {
                            x: snake[0].x + 1, y: snake[0].y }
                        break;
                    case 1: // Left
                        snake[0] = {
                            x: snake[0].x - 1, y: snake[0].y }
                        break;
                    case 2: // Up
                        snake[0] = {
                            x: snake[0].x, y: snake[0].y - 1 }
                        break;
                    case 3: // Down
                        snake[0] = {
                            x: snake[0].x, y: snake[0].y + 1 }
                        break;
				}

               teleport();

				//Prüft ob die Schlange einen Apfel gegessen hat
				if(map[snake[0].x][snake[0].y] == 1)
				{
					if(speed == 160)
					{
						score = score + 1;
					}
					else if(speed == 130)
					{
						score = score + 2;
					}
					else if(speed == 100)
					{
						score = score + 3;
					}
					else if(speed == 50)
					{
						score = score + 5;
					}

					map = generate_food(map);

					//Macht die Schlange nach dem essen eines Apfels um einen Block länger
					snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
					map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;
					//Durch doppeltes aufrufen wird die Schlange um 2 Blöcke länger
					snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
					map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;
				}
                //Prüft ob die Schlange mit sich selbst kollidiert ist
                else if(map[snake[0].x][snake[0].y] === 2)
				{
                    show_game_over();

                    //fragt den User nach seinem Namen und speichert seinen Score
                    let person = prompt("Game Over! \nMöchten Sie Ihren Score in die Datenbank eintragen?", "Ihr Name");
                    if (person == null || person == "") {

                    } else {
                      var name = person;
                      var game = "Snake";
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
                //Jedes Feld welches die Schlange auf dem Raster belegt wird mit einer 2 gekennzeichnet/Markiert
                map[snake[0].x][snake[0].y] = 2;
            }
            else
			{
                //Jedes Feld das von der Schlange wieder verlassen wird erhält den Wert null
                if(i === (snake.length - 1))
				{
					map[snake[i].x][snake[i].y] = null;
				}
                snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
                map[snake[i].x][snake[i].y] = 2;
            }
        }



        draw_main();
        //Definiert das Aussehen der Felder die den Wert 1 (Essen) oder 2 (Schlange) haben
        for(var x = 0; x < map.length; x++)
		{
            for(var y = 0; y < map[0].length; y++)
			{
                //Definiert das Aussehen für das Essen
                if(map[x][y] === 1)
				{
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(x * 40, y * 40, 40, 40);
                    ctx.drawImage(apple, x * 40, y * 40, 40, 40);

                }
				//Definiert das Aussehen der Schlange
				else if(map[x][y] === 2)
				{
                    ctx.fillStyle = "#16e0bd";
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(x * 40, y * 40, 40, 40);
                    ctx.fillRect(x * 40, y * 40, 40, 40);
                }
            }
        }
            if(active)
			{
                setTimeout(draw_game, speed);
            }
    }

    //Setzt die Schlange auf die andere Seite des Spielfelds wenn sie mit dem Rand kollidiert
    function teleport()
    {
        if(snake[0].x > 19 && direction == 0)
		{
            console.log(snake)
            snake[0].x = 0;
        }
		else if(snake[0].x < 0 && direction == 1)
		{
            snake[0].x = 19;
        }
		else if(snake[0].y < 0 && direction == 2)
		{
            snake[0].y = 19 ;
        }
		else if(snake[0].y > 19 && direction == 3)
		{
            snake[0].y = 0 ;
        }
    }

    //Generiert die Border um das Canvas herum
    function draw_main()
    {
        document.getElementById("score").innerHTML = "Score: "+score +"";
    }

    //Erzeugt neues Essen an einer zufälligen Position, wenn es in der Schlange spawnt wird ein neuer Apfel an anderer Position erstellt
    function generate_food(map)
    {
        var X = Math.round((Math.random() * 18) + 1);
        var Y = Math.round((Math.random() * 18) + 1);
        while(map[X][Y] == 2)
		{
            X = Math.round((Math.random() * 18) + 1);
            Y = Math.round((Math.random() * 18) + 1);
		}

        if(X < 1 || X >= 20 || Y < 1 || Y >= 20)
		{
            X = Math.round((Math.random() * 18) + 1);
            Y = Math.round((Math.random() * 18) + 1);
        }
        //Das Feld mit dem Essen wird als 1 gekennzeichnet/markiert
        map[X][Y] = 1;
        return map;
    }

    //Erzeugt die Schlange zu Beginn des Spiels an einer zufälligen Position in der linken Hälfte des Spielfeldes
    function generate_snake(map)
    {
        var X = Math.round((Math.random() * 9) + 1);
        var Y = Math.round((Math.random() * 9) + 1);
        while((X - snake.length) < 0)
		{
            X = Math.round((Math.random() * 9) + 1);
        }
        for(var i = 0; i < snake.length; i++)
		{
            snake[i] = { x: X - i, y: Y };
            //Alle Felder die die Schlange einnimmt werden mit einer 2 gekennzeichnet/markiert
            map[X - i][Y] = 2;
        }
        return map;
    }

    function show_game_over()
    {
        //set_score();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        active = false;
        ctx.fillStyle = 'black';
        ctx.font = '24px sans-serif';
        ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);
        ctx.font = '24px sans-serif';
        ctx.fillText('Erreichter Score: ' + score, ((canvas.width / 2) - (ctx.measureText('Erreichter Score: ' + score).width / 2)), 70);
        document.getElementById("restart").style.display = "inline-block";
        document.getElementById("back").style.display = "inline-block";
        document.getElementById("snake_buttons").style.display = "block";
        document.getElementById("restart").onclick = function()
		{
            window.location.reload();
            document.getElementById("restart").style.display = "none";
        }
    }




    //Wenn ein Score gebrochen wird wird dieser in der Datenbank gespeichert und sofort mit erscheinen des Game Over Screens in der Highscore Tabelle angezeigt
  /*  function set_score()
    {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("scoreboard").innerHTML =  this.responseText;
        }
    };
        xmlhttp.open("POST", "score2.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send('action=save&score=' +score);
    }

    //Zeigt die 10 besten Highscores aus der Datenbank an
    function show_score() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                document.getElementById("scoreboard").innerHTML =  this.responseText;
    }
};
    xmlhttp.open("POST", "score2.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send('action=0&score=');
    }     */
};
