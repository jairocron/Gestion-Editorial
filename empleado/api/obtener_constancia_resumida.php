<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'mensaje' => 'No autorizado']);
    exit;
}

require_once __DIR__ . '/../../shared/config/conexion.php';

$empleado_id = $_SESSION['user_id'];

// Obtener datos del empleado
$stmt = $conexion->prepare("SELECT nombre, apellido, email FROM empleados WHERE id = ?");
$stmt->bind_param("i", $empleado_id);
$stmt->execute();
$empleado = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Obtener estadísticas de actividades cerradas
$stmt = $conexion->prepare("
    SELECT 
        COUNT(*) as total_actividades,
        SUM(tiempo_real) as tiempo_total,
        AVG(calificacion) as calificacion_promedio,
        MIN(fecha_inicio) as primera_actividad,
        MAX(fecha_finalizacion) as ultima_actividad
    FROM actividades 
    WHERE empleado_id = ? AND estado = 'cerrada'
");
$stmt->bind_param("i", $empleado_id);
$stmt->execute();
$estadisticas = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Obtener distribución de calificaciones
$stmt = $conexion->prepare("
    SELECT 
        COUNT(CASE WHEN calificacion >= 90 THEN 1 END) as excelente,
        COUNT(CASE WHEN calificacion >= 70 AND calificacion < 90 THEN 1 END) as bueno,
        COUNT(CASE WHEN calificacion >= 50 AND calificacion < 70 THEN 1 END) as regular,
        COUNT(CASE WHEN calificacion < 50 THEN 1 END) as deficiente
    FROM actividades 
    WHERE empleado_id = ? AND estado = 'cerrada'
");
$stmt->bind_param("i", $empleado_id);
$stmt->execute();
$distribucion = $stmt->get_result()->fetch_assoc();
$stmt->close();

$conexion->close();

echo json_encode([
    'success' => true,
    'empleado' => $empleado,
    'estadisticas' => $estadisticas,
    'distribucion' => $distribucion
]);
?>
