<?php
session_start();
include '../../shared/config/conexion.php';
header('Content-Type: application/json; charset=utf-8');
if (!ob_get_level()) { ob_start(); }

// Verificar que sea administrador
if (!isset($_SESSION['user_id']) || $_SESSION['user_rol'] !== 'ADMIN') {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Acceso denegado. Solo administradores pueden cerrar tareas.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$tarea_id = isset($input['id']) ? (int)$input['id'] : 0;
$calificacion = isset($input['calificacion']) ? (int)$input['calificacion'] : null;
$observacion = isset($input['observacion']) ? trim($input['observacion']) : '';

// Validaciones
if ($tarea_id <= 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'ID de tarea no válido']);
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

// Verificar que la tarea existe
$sqlTarea = "SELECT nombre FROM tareas WHERE id = ?";
$stmtTarea = $conexion->prepare($sqlTarea);
$stmtTarea->bind_param("i", $tarea_id);
$stmtTarea->execute();
$resultTarea = $stmtTarea->get_result();
$tarea = $resultTarea->fetch_assoc();
$stmtTarea->close();

if (!$tarea) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Tarea no encontrada']);
    exit;
}

// Verificar que todas las actividades de la tarea estén cerradas
$sqlCheck = "SELECT COUNT(*) as total, 
             SUM(CASE WHEN estado = 'cerrada' THEN 1 ELSE 0 END) as cerradas
             FROM actividades WHERE tarea_id = ?";
$stmtCheck = $conexion->prepare($sqlCheck);
$stmtCheck->bind_param("i", $tarea_id);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();
$stats = $resultCheck->fetch_assoc();
$stmtCheck->close();

if ($stats['total'] == 0) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'La tarea no tiene actividades asignadas']);
    exit;
}

if ($stats['cerradas'] != $stats['total']) {
    $pendientes = $stats['total'] - $stats['cerradas'];
    if (ob_get_length()) { ob_clean(); }
    echo json_encode([
        'success' => false, 
        'mensaje' => "No se puede cerrar la tarea. Hay {$pendientes} actividad(es) pendiente(s) de completar y evaluar."
    ]);
    exit;
}

// Calcular tiempos promedio
$sqlTiempos = "SELECT 
               SUM(tiempo_estimado) as tiempo_estimado_total,
               SUM(tiempo_real) as tiempo_real_total
               FROM actividades WHERE tarea_id = ?";
$stmtTiempos = $conexion->prepare($sqlTiempos);
$stmtTiempos->bind_param("i", $tarea_id);
$stmtTiempos->execute();
$resultTiempos = $stmtTiempos->get_result();
$tiempos = $resultTiempos->fetch_assoc();
$stmtTiempos->close();

// Obtener fecha de inicio (fecha de creación de la tarea o primera actividad iniciada)
$sqlFechaInicio = "SELECT MIN(fecha_asignacion) as fecha_inicio FROM actividades WHERE tarea_id = ?";
$stmtFechaInicio = $conexion->prepare($sqlFechaInicio);
$stmtFechaInicio->bind_param("i", $tarea_id);
$stmtFechaInicio->execute();
$resultFecha = $stmtFechaInicio->get_result();
$fechas = $resultFecha->fetch_assoc();
$stmtFechaInicio->close();

// Actualizar tarea con estado cerrado y datos de cierre
// Nota: Necesitamos agregar columnas a la tabla tareas
$sqlUpdate = "UPDATE tareas SET 
              estado = 'CERRADA',
              calificacion = ?,
              observacion = ?,
              fecha_finalizacion = NOW(),
              tiempo_estimado = ?,
              tiempo_real = ?
              WHERE id = ?";
$stmtUpdate = $conexion->prepare($sqlUpdate);

if (!$stmtUpdate) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error en preparación: ' . $conexion->error]);
    exit;
}

$stmtUpdate->bind_param("isiii", 
    $calificacion, 
    $observacion, 
    $tiempos['tiempo_estimado_total'],
    $tiempos['tiempo_real_total'],
    $tarea_id
);

if ($stmtUpdate->execute()) {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode([
        'success' => true, 
        'mensaje' => 'Tarea cerrada correctamente',
        'tiempo_estimado' => $tiempos['tiempo_estimado_total'],
        'tiempo_real' => $tiempos['tiempo_real_total']
    ]);
} else {
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'mensaje' => 'Error al cerrar tarea: ' . $stmtUpdate->error]);
}

$stmtUpdate->close();
$conexion->close();
?>
