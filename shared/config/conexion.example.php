<?php
/**
 * Configuración de conexión a la base de datos
 * 
 * IMPORTANTE: Este archivo contiene información sensible.
 * - NO subir al repositorio con credenciales reales
 * - Copiar como conexion.php y configurar con tus datos locales
 * - El archivo conexion.php está en .gitignore
 */

// Configuración de la base de datos
$host = 'localhost';
$usuario = 'root';
$password = '';  // Cambiar por tu password de MySQL
$base_datos = 'gestion_editorial';

// Crear conexión
$conexion = new mysqli($host, $usuario, $password, $base_datos);

// Verificar conexión
if ($conexion->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos'
    ]));
}

// Configurar charset
$conexion->set_charset("utf8mb4");

// Configuración de zona horaria (opcional)
date_default_timezone_set('America/Mexico_City');
?>
