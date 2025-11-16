<?php
// eliminar_empleado.php

// Conectar a la base de datos
include '../../shared/config/conexion.php';
header('Content-Type: application/json');


// Obtener ID del empleado a eliminar desde JSON
$input = json_decode(file_get_contents('php://input'), true);
error_log('Input recibido: ' . file_get_contents('php://input')); 
$id = $input['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID de empleado no recibido']);
    exit;
}

// Preparar y ejecutar la consulta
$stmt = $conexion->prepare("DELETE FROM empleados WHERE id = ?");
$stmt->bind_param("i", $id);


if ($stmt->execute()) {
    error_log('Filas afectadas: ' . $stmt->affected_rows);
    echo json_encode(['success' => true, 'message' => 'Empleado eliminado correctamente']);
} else {
    error_log('Error SQL: ' . $stmt->error);
    echo json_encode(['success' => false, 'message' => 'Error al eliminar empleado']);
}

$stmt->close();
$conexion->close();
?>
