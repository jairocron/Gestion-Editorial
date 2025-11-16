<?php
include '../../shared/config/conexion.php';
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;
$nombre = $input['nombre'] ?? '';
$apellido = $input['apellido'] ?? '';
$email = $input['email'] ?? '';

if (!$id || !$nombre || !$apellido || !$email) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

$sql = "UPDATE empleados SET nombre = ?, apellido = ?, email = ? WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sssi", $nombre, $apellido, $email, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Empleado actualizado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar empleado']);
}

$stmt->close();
$conexion->close();
?>