<?php
header('Content-Type: application/json');
require_once 'config.php';
require_once 'session.php';

$action = $_POST['action'] ?? '';
$response = ['success' => false, 'message' => ''];

switch ($action) {
    case 'login':
        $email = sanitize($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        
        if (!validateEmail($email) || empty($password)) {
            $response['message'] = 'Invalid email or password';
            break;
        }
        
        $email = $conn->real_escape_string($email);
        $result = $conn->query("SELECT * FROM users WHERE email = '$email'");
        
        if ($result->num_rows === 0) {
            $response['message'] = 'Invalid email or password';
            break;
        }
        
        $user = $result->fetch_assoc();
        
        if (!password_verify($password, $user['password'])) {
            $response['message'] = 'Invalid email or password';
            break;
        }
        
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_role'] = $user['role'];
        
        $response['success'] = true;
        $response['message'] = 'Login successful';
        $response['redirect'] = '/enhanced-cvms/dashboard.html';
        break;
        
    case 'signup':
        $name = sanitize($_POST['name'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirm_password = $_POST['confirm_password'] ?? '';
        
        if (empty($name) || !validateEmail($email) || empty($password) || empty($confirm_password)) {
            $response['message'] = 'All fields are required';
            break;
        }
        
        if ($password !== $confirm_password) {
            $response['message'] = 'Passwords do not match';
            break;
        }
        
        if (strlen($password) < 6) {
            $response['message'] = 'Password must be at least 6 characters';
            break;
        }
        
        $email = $conn->real_escape_string($email);
        $check = $conn->query("SELECT id FROM users WHERE email = '$email'");
        if ($check->num_rows > 0) {
            $response['message'] = 'Email already registered';
            break;
        }
        
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $name = $conn->real_escape_string($name);
        
        $insert = $conn->query("INSERT INTO users (name, email, password, role) VALUES ('$name', '$email', '$hashed_password', 'parent')");
        
        if ($insert) {
            $response['success'] = true;
            $response['message'] = 'Account created successfully';
        } else {
            $response['message'] = 'Error creating account';
        }
        break;
        
    case 'logout':
        session_destroy();
        $response['success'] = true;
        $response['message'] = 'Logged out successfully';
        $response['redirect'] = '/enhanced-cvms/index.html';
        break;
        
    default:
        $response['message'] = 'Invalid action';
}

echo json_encode($response);
?>
