<?php
include '../../shared/config/conexion.php';
header('Content-Type: application/json; charset=utf-8');
if (!ob_get_level()) { ob_start(); }

$input = json_decode(file_get_contents('php://input'), true);
$actividad_id = isset($input['id']) ? (int)$input['id'] : 0;

if ($actividad_id <= 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'message' => 'ID de actividad no proporcionado']);
    exit;
}

$sql = "DELETE FROM actividades WHERE id = ?";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'message' => 'Error en preparación: ' . $conexion->error]);
    exit;
}

$stmt->bind_param("i", $actividad_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => true, 'message' => 'Actividad eliminada correctamente']);
} else {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'message' => 'No se encontró la actividad o ya fue eliminada']);
}

$stmt->close();
$conexion->close();
?> 