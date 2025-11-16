<?php
include '../../shared/config/conexion.php';
header('Content-Type: application/json; charset=utf-8');
if (!ob_get_level()) { ob_start(); }

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

$nombre = trim($input['nombre'] ?? '');
$descripcion = trim($input['descripcion'] ?? '');
$tiempo_estimado = isset($input['tiempo_estimado']) ? (int)$input['tiempo_estimado'] : 0;
$tarea_id = isset($input['tarea_id']) ? (int)$input['tarea_id'] : 0;
$empleado_id = isset($input['empleado_id']) ? (int)$input['empleado_id'] : 0;

error_log("Actividad - Procesados: nombre=$nombre, desc=$descripcion, tiempo=$tiempo_estimado, tarea=$tarea_id, emp=$empleado_id");

if ($nombre === '') {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Falta el nombre de la actividad']);
    exit;
}
if ($tiempo_estimado <= 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'El tiempo estimado debe ser mayor a 0']);
    exit;
}
if ($tarea_id <= 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Debes seleccionar una tarea']);
    exit;
}
if ($empleado_id <= 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Debes seleccionar un empleado']);
    exit;
}

// Insertar nueva actividad en la base de datos (columnas seguras)
$sql = "INSERT INTO actividades (tarea_id, empleado_id, nombre, descripcion, tiempo_estimado) VALUES (?, ?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    if (ob_get_length()) { ob_clean(); }
    error_log("Error al preparar: " . $conexion->error);
    echo json_encode(['success' => false, 'mensaje' => 'Error en preparación: ' . $conexion->error]);
    exit;
}

$stmt->bind_param('iissi', $tarea_id, $empleado_id, $nombre, $descripcion, $tiempo_estimado);

if ($stmt->execute()) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => true, 'mensaje' => 'Actividad creada correctamente']);
} else {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error al guardar: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>