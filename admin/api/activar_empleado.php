<?php
include '../../shared/config/conexion.php';
header('Content-Type: application/json');

// Obtener ID del empleado a activar desde JSON
$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;
error_log('ID recibido para activar: ' . $id);

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID de empleado no recibido']);
    exit;
}

// Preparar y ejecutar la consulta
$stmt = $conexion->prepare("UPDATE empleados SET estado = 'activo' WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    error_log('Filas afectadas: ' . $stmt->affected_rows); // <-- aquí
    echo json_encode(['success' => true, 'message' => 'Empleado activado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al activar empleado']);
}

$stmt->close();
$conexion->close();
?>