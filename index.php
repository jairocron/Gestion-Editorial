<?php
session_start();
if (isset($_SESSION['user_id']) && isset($_SESSION['user_rol'])) {
    if ($_SESSION['user_rol'] === 'ADMIN') {
        header('Location: admin/panel_admin.php');
        exit;
    } else {
        header('Location: empleado/panel_empleado.php');
        exit;
    }
}
header('Location: public/');
exit;
?>
