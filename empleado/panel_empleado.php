<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['user_rol'] !== 'NORMAL') {
    header('Location: ../shared/');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Empleado</title>
    <link rel="stylesheet" href="../shared/assets/css/styles.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    
    
</head>
<body class="empleado-dashboard">
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
            <span style="color: white;"><h1>Sistema de Gestión Editorial</h1></span>
            <button class="btn btn-secondary" onclick="cerrarSesion()">Cerrar Sesión</button>
        </div>
    </div>
    <div class="seccion-empleado">
        <span style="color: black;"><h2>Panel Empleado</h2></span>
        <button class="btn btn-secondary" onclick="verMisActividades()">Mis Actividades</button>
        <button class="btn btn-secondary" onclick="marcarCompletada()">Marcar como Completada</button>
        <button class="btn btn-secondary" onclick="verActividadesEnDesarrollo()">Actividades en Desarrollo</button>
        <button class="btn btn-secondary" onclick="verActividadesFinalizadas()">Actividades Finalizadas</button>
        <button class="btn btn-secondary" onclick="verConstanciaResumida()"><i class="bi bi-file-earmark-text"></i> Constancia Resumida</button>
        <button class="btn btn-secondary" onclick="verConstanciaDetallada()"><i class="bi bi-file-earmark-spreadsheet"></i> Constancia Detallada</button>    
    </div>
    <div class="container mt-4">
        <div id="contenido-dinamico">
            <p>Selecciona una opción arriba para ver el contenido</p>
        </div>
    </div>
    <script src="../shared/assets/js/script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
