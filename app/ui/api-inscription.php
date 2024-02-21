<?php
// Ce fichier serait votre point de terminaison API pour l'inscription

header('Content-Type: application/json');
$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

// Informations d'identification
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'registration');

// Connexion à la base de données MySQL
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Vérifiez la connexion
if($conn->connect_error){
    echo json_encode(["success" => false, "message" => "Connexion à la base de données échouée"]);
    exit();
}

// Insérer un nouvel utilisateur
$email = $conn->real_escape_string($_POST['email']);
$password = password_hash($conn->real_escape_string($_POST['password']), PASSWORD_DEFAULT); // Hash le mot de passe

$query = "INSERT INTO users (email, password) VALUES ('$email', '$password')";

if ($conn->query($query) === TRUE) {
    echo json_encode(["success" => true, "message" => "Inscription réussie"]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur lors de l'inscription"]);
}

$conn->close();
?>
