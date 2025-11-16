<?php
session_start();
include '../../shared/config/conexion.php';
header('Content-Type: application/json; charset=utf-8');
if (!ob_get_level()) { ob_start(); }

$input = json_decode(file_get_contents('php://input'), true);

$id = $input['id'] ?? null;
$nombre = trim($input['nombre'] ?? '');
$descripcion = trim($input['descripcion'] ?? '');
$tiempo_estimado = isset($input['tiempo_estimado']) ? (int)$input['tiempo_estimado'] : 0;
$tarea_id = isset($input['tarea_id']) ? (int)$input['tarea_id'] : null;
$empleado_id = isset($input['empleado_id']) ? (int)$input['empleado_id'] : null;

if (!$id || $nombre === '' || $tiempo_estimado <= 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
    exit;
}

// f. Verificar que la actividad NO haya sido iniciada (solo se pueden editar actividades asignadas)
$sqlCheck = "SELECT estado FROM actividades WHERE id = ?";
$stmtCheck = $conexion->prepare($sqlCheck);
$stmtCheck->bind_param("i", $id);
$stmtCheck->execute();
$result = $stmtCheck->get_result();
$actividad = $result->fetch_assoc();
$stmtCheck->close();

if (!$actividad) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Actividad no encontrada']);
    exit;
}

if ($actividad['estado'] !== 'asignada') {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'No se puede editar una actividad que ya ha sido iniciada']);
    exit;
}

// Actualizar con todos los campos disponibles
if ($tarea_id && $empleado_id) {
    $sql = "UPDATE actividades SET nombre = ?, descripcion = ?, tiempo_estimado = ?, tarea_id = ?, empleado_id = ? WHERE id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssiiii", $nombre, $descripcion, $tiempo_estimado, $tarea_id, $empleado_id, $id);
} else {
    $sql = "UPDATE actividades SET nombre = ?, descripcion = ?, tiempo_estimado = ? WHERE id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssii", $nombre, $descripcion, $tiempo_estimado, $id);
}

if ($stmt->execute()) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => true, 'mensaje' => 'Actividad actualizada correctamente']);
} else {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar actividad: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>