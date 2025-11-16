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
    <title>Sistema de Gestión Editorial</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="../shared/assets/css/styles.css">
    <style>
        body {
            background-image: url('../shared/assets/img/background.jpg'); 
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 100vh;
        }
        .login-box {
            padding: 30px;
            border-radius: 12px;
            background-color: rgba(var(--bs-body-tertiary-bg-rgb), 0.9); 
            border: 1px solid var(--bs-border-color);
            backdrop-filter: blur(5px);
        }
        .hero-content h1, .hero-content p, .hero-content li {
             color: var(--bs-body-color);
        }
    </style>
</head>
<body>
   <nav class="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold" href="../public/">
                <span class="logo-accent">GE</span> | Gestión Editorial
            </a>   
            <div class="ms-auto d-flex align-items-center gap-3">
                <a class="nav-link" href="../public/">Inicio</a>
                <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="bd-theme" data-bs-toggle="dropdown" aria-expanded="false">
                        <svg id="bd-theme-icon" class="bi my-1 theme-icon-active" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13V2a6 6 0 1 1 0 12z"/>
                        </svg>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme">
                        <li><button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light">Light</button></li>
                        <li><button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark">Dark</button></li>
                        <li><button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto">Auto</button></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
    
    <div class="container col-xxl-10 px-4 py-5 h-100 d-flex align-items-center">
        <div class="row align-items-center g-5 w-100">
            
            <div class="col-lg-7 hero-content">
                <h1 class="display-4 fw-bold lh-1 mb-3">Tu plataforma definitiva de gestión editorial.</h1>
                <p class="lead">Centraliza y optimiza cada etapa del proceso, desde la recepción de manuscritos hasta la publicación. Colaboración simplificada para autores, revisores y editores.</p>
                <ul class="list-unstyled mt-4">
                    <li><i class="bi bi-check-circle-fill me-2 text-primary"></i> Seguimiento de estado en tiempo real.</li>
                    <li><i class="bi bi-check-circle-fill me-2 text-primary"></i> Herramientas de edición colaborativa.</li>
                    <li><i class="bi bi-check-circle-fill me-2 text-primary"></i> Módulo de reportes y métricas avanzadas.</li>
                </ul>
            </div>

            <div class="col-lg-5">
                <div class="login-box shadow">
                    <h2 class="fw-bold mb-4 text-center">Acceso al Sistema</h2>
                    
                    <form id="formLogin">
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" id="email" placeholder="name@example.com" required>
                            <label for="email">Correo electrónico</label>
                        </div>
                        <div class="form-floating mb-4">
                            <input type="password" class="form-control" id="password" placeholder="Contraseña" required>
                            <label for="password">Contraseña</label>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100 py-2">Ingresar</button>
                        
                        <div id="mensajeLogin" class="mt-3 text-center"></div>
                        
                        <small class="d-block text-center mt-3 text-body-secondary">
                            <a href="#">¿Olvidaste tu contraseña?</a>
                        </small>
                     
                    </form>
                </div>
            </div>
            
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    
    <script>
        const getPreferredTheme = () => {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) { return storedTheme; }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        const setTheme = (theme) => {
            if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-bs-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-bs-theme', theme);
            }
        }

        const showActiveTheme = (theme) => {
            const themeIcon = document.querySelector('#bd-theme-icon');
            const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
            const iconOfMode = {
                'light': 'bi-sun-fill',
                'dark': 'bi-moon-stars-fill',
                'auto': 'bi-circle-half'
            };
            const activeIcon = document.documentElement.getAttribute('data-bs-theme') || 'light';
            if (themeIcon) {
                themeIcon.setAttribute('class', `bi my-1 ${iconOfMode[activeIcon]}`);
            }
            document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
                element.classList.remove('active');
            });
            if (btnToActive) {
                btnToActive.classList.add('active');
            }
        }

        document.getElementById('formLogin').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            fetch('login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    document.getElementById('mensajeLogin').innerHTML =
                        `<div class="alert alert-danger">${data.message}</div>`;
                }
            })
            .catch(() => {
                document.getElementById('mensajeLogin').innerHTML =
                    `<div class="alert alert-danger">Error de conexión</div>`;
            });
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (localStorage.getItem('theme') === 'auto') {
                setTheme(getPreferredTheme());
                showActiveTheme(getPreferredTheme());
            }
        });

        window.addEventListener('DOMContentLoaded', () => {
            setTheme(getPreferredTheme());
            showActiveTheme(getPreferredTheme());

            document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const theme = toggle.getAttribute('data-bs-theme-value');
                    localStorage.setItem('theme', theme);
                    setTheme(theme);
                    showActiveTheme(theme);
                });
            });
        });
    </script> 
</body>
</html>
