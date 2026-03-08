<?php
header('Content-Type: application/json');
require_once 'config.php';
require_once 'session.php';

requireLogin();

$action = $_GET['action'] ?? '';
$user = getCurrentUser($conn);
$response = ['success' => false, 'message' => ''];

switch ($action) {
    case 'get-vaccinations':
        $child_id = intval($_GET['child_id'] ?? 0);
        $search = sanitize($_GET['search'] ?? '');
        $status = sanitize($_GET['status'] ?? 'all');
        $upcoming_only = intval($_GET['upcoming_only'] ?? 0);
        
        // Verify child belongs to current user
        $child_check = $conn->query("SELECT id FROM children WHERE id = $child_id AND parent_id = " . $user['id']);
        if ($child_check->num_rows === 0) {
            $response['message'] = 'Unauthorized access';
            echo json_encode($response);
            exit;
        }
        
        $query = "SELECT * FROM vaccinations WHERE child_id = $child_id";
        
        if ($search) {
            $search = $conn->real_escape_string($search);
            $query .= " AND (vaccine_name LIKE '%$search%' OR dose_number LIKE '%$search%')";
        }
        
        if ($status !== 'all') {
            $status = $conn->real_escape_string($status);
            $query .= " AND status = '$status'";
        }
        
        if ($upcoming_only) {
            $today = date('Y-m-d');
            $query .= " AND scheduled_date >= '$today' AND status != 'completed'";
        }
        
        $query .= " ORDER BY scheduled_date ASC";
        
        $result = $conn->query($query);
        $vaccinations = [];
        
        while ($vax = $result->fetch_assoc()) {
            $vaccinations[] = $vax;
        }
        
        $response['success'] = true;
        $response['vaccinations'] = $vaccinations;
        break;
        
    case 'mark-complete':
        $vax_id = intval($_POST['vax_id'] ?? 0);
        $completion_date = sanitize($_POST['completion_date'] ?? '');
        
        // Verify vaccination belongs to current user's child
        $vax_check = $conn->query("SELECT v.* FROM vaccinations v 
            JOIN children c ON v.child_id = c.id 
            WHERE v.id = $vax_id AND c.parent_id = " . $user['id']);
        
        if ($vax_check->num_rows === 0) {
            $response['message'] = 'Unauthorized access';
            echo json_encode($response);
            exit;
        }
        
        $vax_id = $conn->real_escape_string($vax_id);
        $completion_date = $conn->real_escape_string($completion_date);
        
        $update = $conn->query("UPDATE vaccinations SET status = 'completed', completed_date = '$completion_date' WHERE id = $vax_id");
        
        if ($update) {
            $response['success'] = true;
            $response['message'] = 'Vaccination marked as completed';
        } else {
            $response['message'] = 'Failed to update vaccination: ' . $conn->error;
        }
        break;
        
    case 'get-statistics':
        $child_id = intval($_GET['child_id'] ?? 0);
        
        // Verify child belongs to current user
        $child_check = $conn->query("SELECT id FROM children WHERE id = $child_id AND parent_id = " . $user['id']);
        if ($child_check->num_rows === 0) {
            $response['message'] = 'Unauthorized access';
            echo json_encode($response);
            exit;
        }
        
        $total = $conn->query("SELECT COUNT(*) as count FROM vaccinations WHERE child_id = $child_id")->fetch_assoc()['count'];
        $completed = $conn->query("SELECT COUNT(*) as count FROM vaccinations WHERE child_id = $child_id AND status = 'completed'")->fetch_assoc()['count'];
        $pending = $conn->query("SELECT COUNT(*) as count FROM vaccinations WHERE child_id = $child_id AND status = 'pending'")->fetch_assoc()['count'];
        $overdue = $conn->query("SELECT COUNT(*) as count FROM vaccinations WHERE child_id = $child_id AND status = 'overdue'")->fetch_assoc()['count'];
        
        $progress = $total > 0 ? round(($completed / $total) * 100) : 0;
        
        $response['success'] = true;
        $response['stats'] = [
            'total' => $total,
            'completed' => $completed,
            'pending' => $pending,
            'overdue' => $overdue,
            'progress' => $progress
        ];
        break;
        
    case 'export-csv':
        $child_id = intval($_GET['child_id'] ?? 0);
        
        // Verify child belongs to current user
        $child_check = $conn->query("SELECT name FROM children WHERE id = $child_id AND parent_id = " . $user['id']);
        if ($child_check->num_rows === 0) {
            $response['message'] = 'Unauthorized access';
            echo json_encode($response);
            exit;
        }
        
        $child_name = $child_check->fetch_assoc()['name'];
        
        $result = $conn->query("SELECT vaccine_name, dose_number, scheduled_date, status, completed_date FROM vaccinations WHERE child_id = $child_id ORDER BY scheduled_date");
        
        $csv_data = "Vaccine Name,Dose,Scheduled Date,Status,Completed Date\n";
        
        while ($row = $result->fetch_assoc()) {
            $csv_data .= "\"{$row['vaccine_name']}\",{$row['dose_number']},{$row['scheduled_date']},{$row['status']},{$row['completed_date']}\n";
        }
        
        $response['success'] = true;
        $response['filename'] = $child_name . '_vaccinations_' . date('Y-m-d') . '.csv';
        $response['csv_data'] = $csv_data;
        break;
        
    default:
        $response['message'] = 'Invalid action';
}

echo json_encode($response);
?>
