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

// Obtener actividades cerradas con información de tarea
$stmt = $conexion->prepare("
    SELECT 
        a.id,
        a.nombre,
        a.descripcion,
        a.tiempo_estimado,
        a.tiempo_real,
        a.calificacion,
        a.observacion,
        a.fecha_inicio,
        a.fecha_finalizacion,
        t.nombre as tarea_nombre,
        t.descripcion as tarea_descripcion,
        t.id as tarea_id
    FROM actividades a
    INNER JOIN tareas t ON a.tarea_id = t.id
    WHERE a.empleado_id = ? AND a.estado = 'cerrada'
    ORDER BY t.id, a.fecha_finalizacion DESC
");
$stmt->bind_param("i", $empleado_id);
$stmt->execute();
$result = $stmt->get_result();

$actividades = [];
while ($row = $result->fetch_assoc()) {
    $actividades[] = $row;
}

$stmt->close();
$conexion->close();

echo json_encode([
    'success' => true,
    'empleado' => $empleado,
    'actividades' => $actividades
]);
?>
