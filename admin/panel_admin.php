<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['user_rol'] !== 'ADMIN') {
    header('Location: ../shared/');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administrador</title>
    <link rel="stylesheet" href="../shared/assets/css/styles.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    
    <!-- Evita cachear este archivo tras migrar desde .html -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
</head>
<body class="admin-dashboard">
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
            <span style="color:white;"><h1>Sistema de Gestión Editorial</h1></span>
            <button class="btn btn-secondary" onclick="cerrarSesion()">Cerrar Sesión</button>
        </div>
    </div>
    <div class ="seccion-admin">
        <h2>Panel Administrador</h2>
        <button class="btn btn-secondary" onclick="mostrarFormularioTarea()">Crear Nueva Tarea</button>
        <button class="btn btn-secondary" onclick="verEmpleados()">Ver Empleados</button>
        <button class="btn btn-secondary" onclick="mostrarFormularioEmpleado()">Agregar Empleado</button>
        <button class="btn btn-secondary" onclick="verDashboardTareas()"> Dashboard de Tareas</button>
        <button class="btn btn-secondary" onclick="verEmpleadosPendientes()"><i class="bi bi-person-check"></i> Empleados Pendientes</button>
        <button class="btn btn-secondary" onclick="formularioActividades()">Crear Actividades</button>
        <button class="btn btn-secondary" onclick="mostrarActividadesPorTarea()">Ver Actividades por Tarea</button>
        <button class="btn btn-secondary" onclick="mostrarFormularioRestablecerPassword()">Restablecer Contraseña</button>
    </div>
    <div class="container mt-4">
        <div id="contenido-dinamico">
            <p>Selecciona una opción arriba para ver el contenido</p>
        </div>
    </div>
    <script src="../shared/assets/js/script.js"></script>
    <script>
    function mostrarFormularioRestablecerPassword() {
        document.getElementById('contenido-dinamico').innerHTML = `
        <div class=\"container mt-5\">
            <h2>Restablecer Contraseña de Empleado</h2>
            <form id=\"formResetPassword\" class=\"w-50 mx-auto\">\n\
                <div class=\"mb-3\">\n\
                    <label for=\"email\" class=\"form-label\">Correo del empleado</label>\n\
                    <input type=\"email\" class=\"form-control\" id=\"email\" name=\"email\" required>\n\
                </div>\n\
                <div class=\"mb-3\">\n\
                    <label for=\"newPassword\" class=\"form-label\">Nueva contraseña</label>\n\
                    <input type=\"text\" class=\"form-control\" id=\"newPassword\" name=\"newPassword\" required>\n\
                </div>\n\
                <button type=\"submit\" class=\"btn btn-outline-secondary\">Restablecer</button>\n\
                <div id=\"mensajeReset\" class=\"mt-3\"></div>\n\
            </form>\n\
        </div>\n\
        `;
        setTimeout(() => {
            document.getElementById('formResetPassword').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const newPassword = document.getElementById('newPassword').value;
                fetch('api/restablecer_password.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, newPassword })
                })
                .then(res => res.json())
                .then(data => {
                    document.getElementById('mensajeReset').innerHTML =
                        `<div class=\"alert ${data.success ? 'alert-success' : 'alert-danger'}\">${data.message}</div>`;
                })
                .catch(() => {
                    document.getElementById('mensajeReset').innerHTML =
                        `<div class=\"alert alert-danger\">Error de conexión</div>`;
                });
            });
        }, 100);
    }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
