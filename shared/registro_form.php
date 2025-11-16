<?php
session_start();
if (isset($_SESSION['user_id']) && isset($_SESSION['user_rol'])) {
    if ($_SESSION['user_rol'] === 'ADMIN') {
        header('Location: ../admin/panel_admin.php');
        exit;
    } else {
        header('Location: ../empleado/panel_empleado.php');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="es" data-bs-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Registro - Sistema de Gestión Editorial</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">
    
    <style>
        body {
            background-image: url('assets/img/background.jpg'); 
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .registro-box {
            max-width: 500px;
            padding: 30px;
            border-radius: 12px;
            background-color: rgba(var(--bs-body-tertiary-bg-rgb), 0.95); 
            border: 1px solid var(--bs-border-color);
            backdrop-filter: blur(10px);
        }
    </style>
    
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="registro-box shadow">
                    <div class="text-center mb-4">
                        <h2 class="fw-bold">Crear Cuenta</h2>
                        <p class="text-muted">Regístrate para acceder al sistema</p>
                    </div>
                    
                    <form id="formRegistro">
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre *</label>
                            <input type="text" class="form-control" id="nombre" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="apellido" class="form-label">Apellido *</label>
                            <input type="text" class="form-control" id="apellido" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="email" class="form-label">Correo Electrónico *</label>
                            <input type="email" class="form-control" id="email" required>
                            <small class="text-muted">Será tu usuario para iniciar sesión</small>
                        </div>
                        
                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña *</label>
                            <input type="password" class="form-control" id="password" required minlength="6">
                            <small class="text-muted">Mínimo 6 caracteres</small>
                        </div>
                        
                        <div class="mb-3">
                            <label for="password_confirm" class="form-label">Confirmar Contraseña *</label>
                            <input type="password" class="form-control" id="password_confirm" required minlength="6">
                        </div>
                        
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle"></i> Tu cuenta quedará pendiente de activación. Un administrador la revisará y activará.
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100 py-2 mb-3">
                            <i class="bi bi-person-plus"></i> Registrarse
                        </button>
                        
                        <div id="mensajeRegistro"></div>
                        
                        <div class="text-center mt-3">
                            <small>¿Ya tienes cuenta? <a href="index.php">Iniciar Sesión</a></small>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('formRegistro').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password_confirm').value;
            
            if (password !== passwordConfirm) {
                document.getElementById('mensajeRegistro').innerHTML = 
                    '<div class="alert alert-danger">Las contraseñas no coinciden</div>';
                return;
            }
            
            const datos = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                email: document.getElementById('email').value,
                password: password
            };
            
            fetch('registro.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(data => {
                const msgEl = document.getElementById('mensajeRegistro');
                if (data.success) {
                    msgEl.innerHTML = `<div class="alert alert-success">${data.mensaje}</div>`;
                    this.reset();
                    setTimeout(() => {
                        window.location.href = 'index.php';
                    }, 3000);
                } else {
                    msgEl.innerHTML = `<div class="alert alert-danger">${data.mensaje}</div>`;
                }
            })
            .catch(() => {
                document.getElementById('mensajeRegistro').innerHTML = 
                    '<div class="alert alert-danger">Error de conexión</div>';
            });
        });
    </script>
</body>
</html>
