<?php
// Script para actualizar contraseñas de empleados existentes
// Solo actualiza si la contraseña NO está hasheada (no empieza con $2y$)
include '../shared/config/conexion.php';

$sql = "SELECT id, password FROM empleados";
$result = $conexion->query($sql);
$actualizados = 0;

while ($row = $result->fetch_assoc()) {
    $id = $row['id'];
    $password = $row['password'];
    if (strpos($password, '$2y$') !== 0) {
        // No está hasheada, la hasheamos
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $update = $conexion->prepare("UPDATE empleados SET password = ? WHERE id = ?");
        $update->bind_param("si", $hash, $id);
        if ($update->execute()) {
            $actualizados++;
        }
        $update->close();
    }
}

echo "Contraseñas actualizadas: $actualizados";
$conexion->close();
?>
