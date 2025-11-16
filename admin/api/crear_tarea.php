<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
include '../../shared/config/conexion.php';
header('Content-Type: application/json; charset=utf-8');
// Iniciar buffer para evitar salidas accidentales que rompan el JSON
if (!ob_get_level()) {
    ob_start();
}

$inputRaw = file_get_contents('php://input');
$input = json_decode($inputRaw, true);

$nombre = $input['nombre'] ?? '';
$descripcion = $input['descripcion'] ?? '';
$creador_id = $input['creador_id'] ?? null; // Opcional

if (!$nombre) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
    exit;
}

if ($creador_id) {
    $sql = "INSERT INTO tareas (nombre, descripcion, creador_id) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssi", $nombre, $descripcion, $creador_id);
} else {
    $sql = "INSERT INTO tareas (nombre, descripcion) VALUES (?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ss", $nombre, $descripcion);
}

if ($stmt->execute()) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => true, 'mensaje' => 'Tarea creada exitosamente']);
} else {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error al crear tarea: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>