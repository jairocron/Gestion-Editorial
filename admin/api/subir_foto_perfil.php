<?php
session_start();
header('Content-Type: application/json');

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'mensaje' => 'No autorizado']);
    exit;
}

require_once __DIR__ . '/../../shared/config/conexion.php';

// Verificar que se recibió un archivo y el ID del empleado
if (!isset($_FILES['foto']) || !isset($_POST['empleado_id'])) {
    echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
    exit;
}

$empleado_id = intval($_POST['empleado_id']);
$archivo = $_FILES['foto'];

// Validar que el archivo es una imagen
$tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($archivo['type'], $tiposPermitidos)) {
    echo json_encode(['success' => false, 'mensaje' => 'Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)']);
    exit;
}

// Validar tamaño (máximo 5MB)
if ($archivo['size'] > 5 * 1024 * 1024) {
    echo json_encode(['success' => false, 'mensaje' => 'La imagen no puede pesar más de 5MB']);
    exit;
}

// Crear directorio de fotos si no existe
$directorioFotos = __DIR__ . '/../../uploads/fotos_perfil/';
if (!is_dir($directorioFotos)) {
    mkdir($directorioFotos, 0755, true);
}

// Generar nombre único para el archivo
$extension = pathinfo($archivo['name'], PATHINFO_EXTENSION);
$nombreArchivo = 'empleado_' . $empleado_id . '_' . time() . '.' . $extension;
$rutaDestino = $directorioFotos . $nombreArchivo;

// Mover el archivo
if (move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
    // Guardar la ruta en la base de datos
    $rutaRelativa = 'uploads/fotos_perfil/' . $nombreArchivo;
    
    $stmt = $conexion->prepare("UPDATE empleados SET foto_perfil = ? WHERE id = ?");
    $stmt->bind_param("si", $rutaRelativa, $empleado_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'mensaje' => 'Foto de perfil actualizada correctamente',
            'foto_url' => $rutaRelativa
        ]);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar la base de datos']);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al subir el archivo']);
}

$conexion->close();
?>
