<?php
session_start();
// Limpiar todas las variables de sesión
$_SESSION = array();
// Destruir la sesión
session_destroy();
// Eliminar la cookie de sesión
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time()-3600, '/');
}
header('Location: /gestion-editorial/');
exit;
?>
