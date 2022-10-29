<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PATCH");

include 'auth.php';

$link = mysqli_connect($hostname, $username, $password, $database);

    if (mysqli_connect_errno()) {
        echo "Connect failed: %s\n".mysqli_connect_error();
        exit();
     }

     if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $myArr = array();
        $sql = "SELECT w_id, winner_name, winner_amt, winner_choice FROM winners where deleted = 0";
        $result = mysqli_query($link,$sql) or die("Unable to select: ".mysql_error());
    
        while($row = mysqli_fetch_assoc($result)) {
            array_push($myArr, $row);
        }
    
        mysqli_close($link);
    
        $myJSON = json_encode($myArr);
     
        echo $myJSON;
    }


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json = file_get_contents("php://input");
        $data = json_decode($json);
        $winnerName = $data->winner_name;
        $winnerAmt = $data->winner_amt;
        $winnerChoice = $data->winner_choice;
        
        $title = $link->real_escape_string($title);
        $description = $link->real_escape_string($description);
    
        $sql = "INSERT INTO winners (winner_name, winner_amt, winner_choice) VALUES ('$winnerName','$winnerAmt','$winnerChoice')";
        if ($link->query($sql) === TRUE) {
            $last_id = $link->insert_id;
            $data-> g_id = $last_id;
            $myJSON = json_encode($data);
            echo $myJSON;
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $myArrOut = array();
        $sql = "SELECT w_id, winner_name, winner_amt, winner_choice FROM winners where deleted = 0";
        $result = mysqli_query($link,$sql) or die("Unable to select: ".mysql_error());
        while($row = mysqli_fetch_assoc($result)) {
            array_push($myArrOut, $row);
        }
        mysqli_close($link);
        file_put_contents('winner.json', json_encode($myArrOut));

    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

        $json = file_get_contents("php://input");
        $data = json_decode($json);
        $w_id = $data->w_id;
    
        $sql = "UPDATE winners SET deleted = 1";
        $sql .= $comma_separated; 
        $sql .= " WHERE w_id = '$w_id'"; 
    
        if ($link->query($sql) === TRUE) {
           // print $json;
           $data->result = 'success';
          } else {
           // echo "Error updating record: " . $link->error;
           $data->result = $link->error;
        }
    
          $myJSON = json_encode($data);

          $myArrOut = array();
          $sql = "SELECT w_id, winner_name, winner_amt, winner_choice FROM winners where deleted = 0";
          $result = mysqli_query($link,$sql) or die("Unable to select: ".mysql_error());
          while($row = mysqli_fetch_assoc($result)) {
              array_push($myArrOut, $row);
          }
          mysqli_close($link);
          file_put_contents('winner.json', json_encode($myArrOut));

          echo $myJSON;
    }

?>