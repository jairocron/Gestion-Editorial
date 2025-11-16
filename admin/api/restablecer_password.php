<?php
// Endpoint para restablecer la contraseña de un empleado por email
header('Content-Type: application/json');
include '../../shared/config/conexion.php';
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$newPassword = $input['newPassword'] ?? '';

if (empty($email) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Email y nueva contraseña son obligatorios']);
    exit;
}

// Verificar si el usuario existe
$sql = "SELECT id FROM empleados WHERE email = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'No existe un empleado con ese email']);
    exit;
}

// Hashear la nueva contraseña
$newHash = password_hash($newPassword, PASSWORD_DEFAULT);
$update = $conexion->prepare("UPDATE empleados SET password = ? WHERE email = ?");
$update->bind_param("ss", $newHash, $email);
if ($update->execute()) {
    echo json_encode(['success' => true, 'message' => 'Contraseña restablecida correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar la contraseña']);
}
$update->close();
$stmt->close();
$conexion->close();
?>
