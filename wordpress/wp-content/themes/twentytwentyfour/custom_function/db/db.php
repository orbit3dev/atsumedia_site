<?php

$dbHost = "127.0.0.1";
$dbUser = "orbitdev2";
$dbPass = "pass123";
$dbName = "atsumedia";

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
