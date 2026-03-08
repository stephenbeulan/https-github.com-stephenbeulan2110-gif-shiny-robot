<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'vaxtracker');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if not exists
$sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
if (!$conn->query($sql)) {
    die("Error creating database: " . $conn->error);
}

// Select database
$conn->select_db(DB_NAME);

// Create tables
$tables = [
    "CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('parent', 'hospital', 'admin') DEFAULT 'parent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    
    "CREATE TABLE IF NOT EXISTS children (
        id INT PRIMARY KEY AUTO_INCREMENT,
        parent_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender ENUM('M', 'F') NOT NULL,
        blood_group VARCHAR(5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES users(id)
    )",
    
    "CREATE TABLE IF NOT EXISTS vaccinations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        child_id INT NOT NULL,
        vaccine_name VARCHAR(100) NOT NULL,
        dose_number INT,
        scheduled_date DATE NOT NULL,
        status ENUM('pending', 'completed', 'overdue') DEFAULT 'pending',
        completed_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id)
    )"
];

foreach ($tables as $table) {
    if (!$conn->query($table)) {
        die("Error creating table: " . $conn->error);
    }
}

?>
