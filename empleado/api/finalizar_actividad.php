<?php
session_start();
include '../../shared/config/conexion.php';
header('Content-Type: application/json; charset=utf-8');
if (!ob_get_level()) { ob_start(); }

// Verificar que sea empleado
if (!isset($_SESSION['user_id'])) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Sesión no iniciada']);
    exit;
}

$empleado_id = $_SESSION['user_id'];
$input = json_decode(file_get_contents('php://input'), true);
$actividad_id = isset($input['id']) ? (int)$input['id'] : 0;

if ($actividad_id <= 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'ID de actividad no válido']);
    exit;
}

// Verificar que la actividad esté asignada a este empleado y en desarrollo
$sqlCheck = "SELECT estado, empleado_id, fecha_inicio FROM actividades WHERE id = ?";
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

if ($actividad['empleado_id'] != $empleado_id) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Esta actividad no está asignada a ti']);
    exit;
}

if ($actividad['estado'] != 'en_desarrollo') {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Esta actividad no está en desarrollo']);
    exit;
}

// Calcular tiempo real (diferencia entre fecha_inicio y ahora)
$fecha_inicio = $actividad['fecha_inicio'];
$sql = "UPDATE actividades SET estado = 'finalizada', fecha_finalizacion = NOW(), tiempo_real = TIMESTAMPDIFF(HOUR, ?, NOW()) WHERE id = ?";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error en preparación: ' . $conexion->error]);
    exit;
}

$stmt->bind_param("si", $fecha_inicio, $actividad_id);

if ($stmt->execute()) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => true, 'mensaje' => 'Actividad marcada como finalizada']);
} else {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error al finalizar actividad: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
