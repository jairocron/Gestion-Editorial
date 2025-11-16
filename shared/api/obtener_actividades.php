<?php
session_start();
include '../config/conexion.php';
header('Content-Type: application/json; charset=utf-8');

// Si es empleado (rol NORMAL), filtrar solo sus actividades
if (isset($_SESSION['user_rol']) && $_SESSION['user_rol'] === 'NORMAL') {
    $empleado_id = $_SESSION['user_id'];
    $sql = "SELECT a.*, t.nombre as tarea_nombre 
            FROM actividades a 
            LEFT JOIN tareas t ON a.tarea_id = t.id 
            WHERE a.empleado_id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $empleado_id);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    // Si es admin o no hay sesión, mostrar todas
    $sql = "SELECT a.*, t.nombre as tarea_nombre 
            FROM actividades a 
            LEFT JOIN tareas t ON a.tarea_id = t.id";
    $result = $conexion->query($sql);
}

$actividades = [];
while ($row = $result->fetch_assoc()) {
    $actividades[] = $row;
}

echo json_encode($actividades);

$conexion->close();
?>