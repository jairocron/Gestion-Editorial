<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'mensaje' => 'No autorizado']);
    exit;
}

require_once __DIR__ . '/../../shared/config/conexion.php';

$tarea_id = isset($_GET['tarea_id']) ? intval($_GET['tarea_id']) : 0;

if ($tarea_id === 0) {
    echo json_encode(['success' => false, 'mensaje' => 'ID de tarea no válido']);
    exit;
}

// Obtener empleados involucrados con su promedio de calificaciones
$sql = "
    SELECT 
        e.id,
        e.nombre,
        e.apellido,
        e.email,
        COUNT(a.id) as total_actividades,
        AVG(a.calificacion) as promedio_calificacion,
        SUM(a.tiempo_real) as tiempo_total
    FROM empleados e
    INNER JOIN actividades a ON e.id = a.empleado_id
    WHERE a.tarea_id = ? AND a.estado = 'cerrada'
    GROUP BY e.id, e.nombre, e.apellido, e.email
    ORDER BY promedio_calificacion DESC
";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $tarea_id);
$stmt->execute();
$result = $stmt->get_result();

$empleados = [];
while ($row = $result->fetch_assoc()) {
    $empleados[] = $row;
}

$stmt->close();
$conexion->close();

echo json_encode([
    'success' => true,
    'empleados' => $empleados
]);
?>
