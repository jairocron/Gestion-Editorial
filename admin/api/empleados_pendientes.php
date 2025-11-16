<?php
include '../../shared/config/conexion.php';
header('Content-Type: application/json');

$sql = "SELECT id, nombre, apellido, email FROM empleados WHERE estado = 'pendiente'";
$result = $conexion->query($sql);

$pendientes = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $pendientes[] = $row;
    }
}
echo json_encode($pendientes);
$conexion->close();
?>