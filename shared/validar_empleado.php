<?php
// ...conexión y headers...
include 'config/conexion.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;

// Validar que el id existe
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID de empleado requerido']);
    exit;
}

// Actualizar estado a 'activo'
$sql = "UPDATE empleados SET estado = 'activo', fecha_validacion = NOW() WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Empleado validado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al validar empleado']);
}

$stmt->close();
$conexion->close();
?>