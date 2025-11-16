<?php
session_start();
include __DIR__ . '/config/conexion.php';
header('Content-Type: application/json');
// Depuración: capturar entrada
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';
$password_ingresado = isset($input['password']) ? trim($input['password']) : '';
$debug = [];
$debug['email_recibido'] = $email;
if (empty($email) || empty($password_ingresado)) {
    echo json_encode(['success' => false, 'message' => 'Por favor, ingrese email y contraseña.', 'debug' => $debug]);
    exit;
}
// Depuración: consulta SQL
$sql = "SELECT id, password, rol, estado FROM empleados WHERE email = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 1) {
    $empleado = $result->fetch_assoc();
    $debug['hash_bd'] = $empleado['password'];
    $debug['rol_bd'] = $empleado['rol'];
    $debug['estado_bd'] = $empleado['estado'];
    $debug['password_ingresado'] = $password_ingresado;
    $debug['password_verify'] = password_verify($password_ingresado, $empleado['password']);
    if (password_verify($password_ingresado, $empleado['password'])) {
        if ($empleado['estado'] === 'activo') {
            $_SESSION['user_id'] = $empleado['id'];
            $_SESSION['user_rol'] = $empleado['rol'];
            $dashboard_url = ($empleado['rol'] === 'ADMIN') ? '../admin/panel_admin.php' : '../empleado/panel_empleado.php';
            echo json_encode([
                'success' => true,
                'message' => 'Inicio de sesión exitoso.',
                'rol' => $empleado['rol'],
                'redirect' => $dashboard_url,
                'debug' => $debug
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Su cuenta no está activa.', 'debug' => $debug]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Credenciales inválidas.', 'debug' => $debug]);
    }
} else {
    $debug['num_rows'] = $result->num_rows;
    echo json_encode(['success' => false, 'message' => 'Credenciales inválidas.', 'debug' => $debug]);
}
$stmt->close();
$conexion->close();
?>
