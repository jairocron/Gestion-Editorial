<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config/conexion.php';

$input = json_decode(file_get_contents('php://input'), true);

$nombre = isset($input['nombre']) ? trim($input['nombre']) : '';
$apellido = isset($input['apellido']) ? trim($input['apellido']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';

// Validaciones
if (empty($nombre) || empty($apellido) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'mensaje' => 'Todos los campos son obligatorios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'mensaje' => 'Email inválido']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'mensaje' => 'La contraseña debe tener al menos 6 caracteres']);
    exit;
}

// Verificar si el email ya existe
$stmt = $conexion->prepare("SELECT id FROM empleados WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'mensaje' => 'Este email ya está registrado']);
    $stmt->close();
    $conexion->close();
    exit;
}
$stmt->close();

// Hashear contraseña
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Insertar nuevo empleado con estado "pendiente"
$stmt = $conexion->prepare("INSERT INTO empleados (nombre, apellido, email, password, rol, estado) VALUES (?, ?, ?, ?, 'NORMAL', 'pendiente')");
$stmt->bind_param("ssss", $nombre, $apellido, $email, $password_hash);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true, 
        'mensaje' => '¡Registro exitoso! Tu cuenta está pendiente de activación por un administrador. Te notificaremos cuando esté lista.'
    ]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al crear la cuenta. Intenta nuevamente.']);
}

$stmt->close();
$conexion->close();
?>
