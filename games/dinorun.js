document.addEventListener("DOMContentLoaded", () => {
document.getElementById("score").style.visibility ="visible";
const dino = document.querySelector(".dino");
const grid = document.querySelector(".dino_grid");
let isJumping = false;
let gravity = 0.9;
let positionY = 0;
let isGameOver = false;
let started = false;
let score = 0;

  function control(e) {
    if(e.keyCode === 87){
      if(!isJumping) {
        isJumping = true;
        jump();
      }
    }
  }

  document.addEventListener("keydown", control);

  function jump() {
    let count = 0;
    let timerId = setInterval(function (){

      if(count === 15){
        clearInterval(timerId);
        let downTimerId = setInterval(function () {
          if(count === 0){
            clearInterval(downTimerId);
            isJumping = false;
          }
          positionY -= 5;
          count--;
          positionY = positionY * gravity;
          dino.style.bottom = positionY + "px";
        },20)
      }


      positionY += 30;
      count++;
      positionY = positionY * gravity;
      dino.style.bottom = positionY + "px";
    }, 20)
  }

  function generateObstacles() {

    let randomTime = Math.random() * 4500;
    let obstaclePosition = 1000;
    const obstacle = document.createElement("div");
    if(!isGameOver){obstacle.classList.add("dino_obstacle");}
    grid.appendChild(obstacle);
    obstacle.style.left = obstaclePosition + "px";

    let timerId = setInterval(function() {
      if(obstaclePosition > 0 && obstaclePosition < 60 && positionY < 60){
        clearInterval(timerId);
        grid.innerHTML = ("Game Over");
        isGameOver = true;
        //fragt den User nach seinem Namen und speichert seinen Score
        let person = prompt("Game Over! \nMöchten Sie Ihren Score in die Datenbank eintragen?", "Ihr Name");
        if (person == null || person == "") {

        } else {
          var name = person;
          var game = "Dino";
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
                  grid.removeChild(obstacle);
                }
                else if(dataResult.statusCode==201){
                  alert("Etwas ist schief gelaufen");
                } }
            }); }
            else{
              alert("Bitte alle Felder ausfüllen!");
            } }
        //remove all children

      }

      obstaclePosition -=10;
      obstacle.style.left = obstaclePosition + "px";

      if(obstaclePosition === 0){
        grid.removeChild(obstacle);
        score += 1;
        document.getElementById("score").innerHTML = "Score: " + score + "";
      }
    },20)
    if(!isGameOver){
      setTimeout(generateObstacles, randomTime);
    }
  }



document.getElementById("start").onclick = function() {
  if(started == false){
  document.getElementById("start").innerHTML = "Nochmal!";
  started = true;
  generateObstacles();
  //scoreboard();
}
  else if(started == true){
    window.location.reload();
  }

}

})
