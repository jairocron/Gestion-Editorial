<?php
// Script para generar el hash de la contraseña "admin123"
$hash = password_hash("admin123", PASSWORD_DEFAULT);
echo $hash;
?>
