<?php
session_start();
include '../../shared/config/conexion.php';
header('Content-Type: application/json; charset=utf-8');
if (!ob_get_level()) { ob_start(); }

// Verificar que sea administrador
if (!isset($_SESSION['user_id']) || $_SESSION['user_rol'] !== 'ADMIN') {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Acceso denegado. Solo administradores pueden clonar actividades.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$actividad_origen_id = isset($input['id']) ? (int)$input['id'] : 0;
$nuevo_empleado_id = isset($input['empleado_id']) ? (int)$input['empleado_id'] : null;

if ($actividad_origen_id <= 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'ID de actividad no válido']);
    exit;
}

// Obtener datos de la actividad original
$sqlOrigen = "SELECT tarea_id, empleado_id, nombre, descripcion, tiempo_estimado FROM actividades WHERE id = ?";
$stmtOrigen = $conexion->prepare($sqlOrigen);
$stmtOrigen->bind_param("i", $actividad_origen_id);
$stmtOrigen->execute();
$result = $stmtOrigen->get_result();
$actividadOrigen = $result->fetch_assoc();
$stmtOrigen->close();

if (!$actividadOrigen) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Actividad no encontrada']);
    exit;
}

// Si no se especifica nuevo empleado, usar el mismo de la actividad original
$empleado_asignado = $nuevo_empleado_id ? $nuevo_empleado_id : $actividadOrigen['empleado_id'];

// Crear nueva actividad (clon) con estado 'asignada'
$sql = "INSERT INTO actividades (tarea_id, empleado_id, actividad_origen_id, nombre, descripcion, tiempo_estimado, fecha_asignacion, estado) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), 'asignada')";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error en preparación: ' . $conexion->error]);
    exit;
}

$stmt->bind_param("iiissi", 
    $actividadOrigen['tarea_id'], 
    $empleado_asignado, 
    $actividad_origen_id,
    $actividadOrigen['nombre'], 
    $actividadOrigen['descripcion'], 
    $actividadOrigen['tiempo_estimado']
);

if ($stmt->execute()) {
    $nueva_actividad_id = $conexion->insert_id;
    if (ob_get_length()) { ob_clean(); }
    echo json_encode([
        'success' => true, 
        'mensaje' => 'Actividad clonada correctamente', 
        'nueva_actividad_id' => $nueva_actividad_id
    ]);
} else {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error al clonar actividad: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
