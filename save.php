<?php
	include 'database.php';
	$name=$_POST['name'];
	$game=$_POST['game'];
	$score=$_POST['highscore'];
	$sql = "INSERT INTO `userdata`(`ID`, `Game`, `Score`, `Name`)
	VALUES ('','$game','$score','$name')";
	if (mysqli_query($conn, $sql)) {
		echo json_encode(array("statusCode"=>200));
	}
	else {
		echo json_encode(array("statusCode"=>201));
	}
	mysqli_close($conn);
?>
