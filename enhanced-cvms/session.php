<?php
session_start();

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Get current user
function getCurrentUser($conn) {
    if (!isLoggedIn()) {
        return null;
    }
    
    $user_id = $_SESSION['user_id'];
    $result = $conn->query("SELECT * FROM users WHERE id = $user_id");
    return $result->fetch_assoc();
}

// Require login
function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: /enhanced-cvms/login.html");
        exit;
    }
}

// Sanitize input
function sanitize($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

// Validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

?>
