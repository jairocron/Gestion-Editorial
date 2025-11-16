<?php
include '../config/conexion.php';
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$sql = "SELECT id, nombre, descripcion, estado, calificacion, observacion, fecha_finalizacion, tiempo_estimado, tiempo_real FROM tareas";
$result = $conexion->query($sql);

$tareas = [];
while ($row = $result->fetch_assoc()) {
    $tareas[] = $row;
}

echo json_encode($tareas);

$conexion->close();
?>