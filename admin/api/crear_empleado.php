<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Incluir conexión
include '../../shared/config/conexion.php';

// Obtener datos JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'No se recibieron datos']);
    exit;
}

// Extraer datos
$nombre = $input['nombre'] ?? '';
$apellido = $input['apellido'] ?? '';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
// Hashear la contraseña antes de guardar
$password_hash = password_hash($password, PASSWORD_DEFAULT);
$rol = $input['rol'] ?? 'empleado';
$estado = $input['estado'] ?? 'activo';

// Validar datos obligatorios
if (empty($nombre) || empty($apellido) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
    exit;
}

// Verificar si el email ya existe
$checkEmail = "SELECT id FROM empleados WHERE email = ?";
$stmt = $conexion->prepare($checkEmail);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
    exit;
}

// Insertar nuevo empleado
$sql = "INSERT INTO empleados (nombre, apellido, email, password, rol, estado) VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssssss", $nombre, $apellido, $email, $password_hash, $rol, $estado);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Empleado creado exitosamente', 'id' => $conexion->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al crear empleado: ' . $conexion->error]);
}

$stmt->close();
$conexion->close();
?>