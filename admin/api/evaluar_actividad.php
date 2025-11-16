<?php
session_start();
include '../../shared/config/conexion.php';
header('Content-Type: application/json; charset=utf-8');
if (!ob_get_level()) { ob_start(); }

// Verificar que sea administrador
if (!isset($_SESSION['user_id']) || $_SESSION['user_rol'] !== 'ADMIN') {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Acceso denegado. Solo administradores pueden evaluar actividades.']);
    exit;
}

$evaluador_id = $_SESSION['user_id'];
$input = json_decode(file_get_contents('php://input'), true);
$actividad_id = isset($input['id']) ? (int)$input['id'] : 0;
$calificacion = isset($input['calificacion']) ? (int)$input['calificacion'] : null;
$observacion = isset($input['observacion']) ? trim($input['observacion']) : '';

// Validaciones
if ($actividad_id <= 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'ID de actividad no válido']);
    exit;
}

if ($calificacion === null || $calificacion < 0 || $calificacion > 100) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'La calificación debe ser entre 0 y 100']);
    exit;
}

if (empty($observacion)) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Debe proporcionar una observación']);
    exit;
}

// Verificar que la actividad esté finalizada
$sqlCheck = "SELECT estado FROM actividades WHERE id = ?";
$stmtCheck = $conexion->prepare($sqlCheck);
$stmtCheck->bind_param("i", $actividad_id);
$stmtCheck->execute();
$result = $stmtCheck->get_result();
$actividad = $result->fetch_assoc();
$stmtCheck->close();

if (!$actividad) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Actividad no encontrada']);
    exit;
}

if ($actividad['estado'] !== 'finalizada') {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Solo se pueden evaluar actividades finalizadas']);
    exit;
}

// Actualizar actividad: marcar como cerrada, agregar calificación, observación y evaluador
$sql = "UPDATE actividades 
        SET estado = 'cerrada', 
            calificacion = ?, 
            observacion = ?, 
            evaluador_id = ? 
        WHERE id = ?";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error en preparación: ' . $conexion->error]);
    exit;
}

$stmt->bind_param("isii", $calificacion, $observacion, $evaluador_id, $actividad_id);

if ($stmt->execute()) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => true, 'mensaje' => 'Actividad evaluada y cerrada correctamente']);
} else {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error al evaluar actividad: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
