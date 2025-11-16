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

// Verificar que la actividad esté asignada a este empleado
$sqlCheck = "SELECT estado, empleado_id FROM actividades WHERE id = ?";
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

if ($actividad['estado'] != 'asignada' && $actividad['estado'] != 'ASIGNADA') {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Esta actividad ya fue aceptada o completada']);
    exit;
}

// Verificar límite de 2 actividades simultáneas
$sqlCount = "SELECT COUNT(*) as total FROM actividades WHERE empleado_id = ? AND estado = 'en_desarrollo'";
$stmtCount = $conexion->prepare($sqlCount);
$stmtCount->bind_param("i", $empleado_id);
$stmtCount->execute();
$resCount = $stmtCount->get_result();
$rowCount = $resCount->fetch_assoc();
$stmtCount->close();

if ($rowCount['total'] >= 2) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Ya tienes 2 actividades en desarrollo. Finaliza una antes de aceptar otra.']);
    exit;
}

// Actualizar estado a en_desarrollo y registrar fecha de inicio
$sql = "UPDATE actividades SET estado = 'en_desarrollo', fecha_inicio = NOW() WHERE id = ?";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error en preparación: ' . $conexion->error]);
    exit;
}

$stmt->bind_param("i", $actividad_id);

if ($stmt->execute()) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => true, 'mensaje' => 'Actividad iniciada correctamente']);
} else {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error al iniciar actividad: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
