<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Agregar headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');


// Incluir el archivo de conexión
include '../config/conexion.php';

// Consulta SQL para obtener empleados
$sql = "SELECT id, nombre, apellido, email, rol, estado FROM empleados";
$resultado = $conexion->query($sql);

// Array para guardar los datos
$empleados = array();

// Si hay resultados, los agregamos al array
if ($resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()) {
        $empleados[] = $fila;
    }
}

// Configurar que la respuesta sea JSON
header('Content-Type: application/json');

// Convertir array PHP a JSON y enviarlo
echo json_encode($empleados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

// Cerrar conexión
$conexion->close();
?>