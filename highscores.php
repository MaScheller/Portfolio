<?php
include 'database.php';
  $game=$_POST['game'];
	$sql = "SELECT `Game`, `Name`, `Score` FROM `userdata` WHERE `Game` = '".$game."' ORDER BY `userdata`.`Score` DESC LIMIT 5";
	$result = $conn->query($sql);
	if ($result !== false && $result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
?>
		<tr>
			<td><?=$row['Name'];?></td>
			<td><?=$row['Score'];?></td>
		</tr>
<?php
	}
	}
	else {

	}
	mysqli_close($conn);
?>
