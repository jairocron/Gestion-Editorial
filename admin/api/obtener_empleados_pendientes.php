<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_rol']) || $_SESSION['user_rol'] !== 'ADMIN') {
    echo json_encode(['success' => false, 'mensaje' => 'No autorizado']);
    exit;
}

require_once __DIR__ . '/../../shared/config/conexion.php';

$sql = "SELECT id, nombre, apellido, email, rol, estado, fecha_creacion FROM empleados WHERE estado = 'pendiente' ORDER BY fecha_creacion DESC";
$result = $conexion->query($sql);

$empleados = [];
while ($row = $result->fetch_assoc()) {
    $empleados[] = $row;
}

$conexion->close();

echo json_encode($empleados);
?>
