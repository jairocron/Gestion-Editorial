diff --cc README.md
index 1b27075,090c4e1..0000000
--- a/README.md
+++ b/README.md
@@@ -1,2 -1,262 +1,267 @@@
++<<<<<<< HEAD
 +# Gesti-n-Editorial
 +Proyecto de plataforma de gesti+¦n editorial 
++=======
+ # ­ƒôÜ Sistema de Gesti+¦n Editorial
+ 
+ Sistema web completo para la gesti+¦n de tareas editoriales con roles de administrador y empleado, desarrollado con PHP, MySQL y Bootstrap 5.
+ 
+ ![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?style=flat&logo=php)
+ ![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat&logo=mysql&logoColor=white)
+ ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat&logo=bootstrap&logoColor=white)
+ 
+ ## ­ƒÜÇ Caracter+¡sticas Principales
+ 
+ ### Para Administradores
+ - Ô£à Gesti+¦n completa de empleados (crear, editar, eliminar, activar)
+ - Ô£à Creaci+¦n y asignaci+¦n de tareas editoriales
+ - Ô£à Gesti+¦n de actividades por tarea
+ - Ô£à Dashboard de seguimiento de tareas (asignadas, en progreso, cerradas)
+ - Ô£à Aprobaci+¦n de empleados pendientes (auto-registro)
+ - Ô£à Restablecer contrase+¦as de empleados
+ - Ô£à Visualizaci+¦n de empleados involucrados en tareas cerradas
+ - Ô£à Subida de fotos de perfil
+ 
+ ### Para Empleados
+ - Ô£à Visualizaci+¦n de actividades asignadas
+ - Ô£à Aceptar y finalizar actividades
+ - Ô£à Consultar actividades en desarrollo y finalizadas
+ - Ô£à Generar constancias de trabajo (resumida y detallada)
+ - Ô£à Gesti+¦n de foto de perfil
+ 
+ ### Caracter+¡sticas Generales
+ - ­ƒöÉ Sistema de autenticaci+¦n con sesiones PHP
+ - ­ƒæÑ Roles de usuario (ADMIN / NORMAL)
+ - ­ƒô© Avatares con fotos de perfil o iniciales generadas
+ - ­ƒôä Generaci+¦n de constancias imprimibles
+ - ­ƒîô Modo claro/oscuro
+ - ­ƒô¦ Dise+¦o responsive con Bootstrap 5
+ - ­ƒÄ¿ Interfaz moderna y amigable
+ 
+ ## ­ƒôï Requisitos del Sistema
+ 
+ - **Servidor Web**: Apache 2.4+ (XAMPP recomendado)
+ - **PHP**: 8.0 o superior
+ - **MySQL**: 8.0 o superior
+ - **Extensiones PHP requeridas**: mysqli, json, session
+ 
+ ## ­ƒøá´©Å Instalaci+¦n
+ 
+ ### 1. Clonar el repositorio
+ ```bash
+ git clone https://github.com/tu-usuario/gestion-editorial.git
+ cd gestion-editorial
+ ```
+ 
+ ### 2. Configurar la base de datos
+ 
+ Crear la base de datos en MySQL:
+ ```sql
+ CREATE DATABASE gestion_editorial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
+ ```
+ 
+ Importar el esquema inicial:
+ ```bash
+ mysql -u root -p gestion_editorial < database/schema.sql
+ ```
+ 
+ Aplicar migraciones (en orden):
+ ```bash
+ mysql -u root -p gestion_editorial < utils/001_agregar_campo_foto_perfil_APLICADO.sql
+ ```
+ 
+ ### 3. Configurar la conexi+¦n
+ 
+ Editar `shared/config/conexion.php` con tus credenciales:
+ ```php
+ $host = 'localhost';
+ $usuario = 'root';
+ $password = 'tu_password';
+ $base_datos = 'gestion_editorial';
+ ```
+ 
+ ### 4. Configurar permisos
+ 
+ Crear carpeta de uploads y dar permisos de escritura:
+ ```bash
+ mkdir uploads
+ chmod 755 uploads
+ ```
+ 
+ ### 5. Iniciar el servidor
+ 
+ Con XAMPP:
+ - Colocar el proyecto en `C:\xampp\htdocs\gestion-editorial`
+ - Iniciar Apache y MySQL desde el panel de control de XAMPP
+ - Acceder a `http://localhost/gestion-editorial/`
+ 
+ ## ­ƒôü Estructura del Proyecto
+ 
+ ```
+ gestion-editorial/
+ Ôö£ÔöÇÔöÇ index.php                      # Entrada principal con redirecci+¦n por sesi+¦n
+ Ôöé
+ Ôö£ÔöÇÔöÇ public/                        # Landing p+¦blica (sin autenticaci+¦n)
+ Ôöé   ÔööÔöÇÔöÇ index.html                 # P+ígina de bienvenida
+ Ôöé
+ Ôö£ÔöÇÔöÇ admin/                         # M+¦dulo de Administrador
+ Ôöé   Ôö£ÔöÇÔöÇ panel_admin.php            # Panel principal del admin
+ Ôöé   ÔööÔöÇÔöÇ api/                       # Endpoints exclusivos de admin
+ Ôöé       Ôö£ÔöÇÔöÇ crear_empleado.php
+ Ôöé       Ôö£ÔöÇÔöÇ editar_empleado.php
+ Ôöé       Ôö£ÔöÇÔöÇ eliminar_empleado.php
+ Ôöé       Ôö£ÔöÇÔöÇ activar_empleado.php
+ Ôöé       Ôö£ÔöÇÔöÇ crear_tarea.php
+ Ôöé       Ôö£ÔöÇÔöÇ cerrar_tarea.php
+ Ôöé       Ôö£ÔöÇÔöÇ crear_actividades.php
+ Ôöé       Ôö£ÔöÇÔöÇ editar_actividad.php
+ Ôöé       Ôö£ÔöÇÔöÇ eliminar_actividad.php
+ Ôöé       Ôö£ÔöÇÔöÇ evaluar_actividad.php
+ Ôöé       Ôö£ÔöÇÔöÇ clonar_actividad.php
+ Ôöé       Ôö£ÔöÇÔöÇ empleados_pendientes.php
+ Ôöé       Ôö£ÔöÇÔöÇ obtener_empleados_pendientes.php
+ Ôöé       Ôö£ÔöÇÔöÇ restablecer_password.php
+ Ôöé       ÔööÔöÇÔöÇ subir_foto_perfil.php
+ Ôöé
+ Ôö£ÔöÇÔöÇ empleado/                      # M+¦dulo de Empleado
+ Ôöé   Ôö£ÔöÇÔöÇ panel_empleado.php         # Panel principal del empleado
+ Ôöé   ÔööÔöÇÔöÇ api/                       # Endpoints exclusivos de empleado
+ Ôöé       Ôö£ÔöÇÔöÇ aceptar_actividad.php
+ Ôöé       Ôö£ÔöÇÔöÇ finalizar_actividad.php
+ Ôöé       Ôö£ÔöÇÔöÇ obtener_constancia_resumida.php
+ Ôöé       ÔööÔöÇÔöÇ obtener_constancia_detallada.php
+ Ôöé
+ Ôö£ÔöÇÔöÇ shared/                        # Recursos compartidos
+ Ôöé   Ôö£ÔöÇÔöÇ index.php                  # P+ígina de login con redirecci+¦n por sesi+¦n
+ Ôöé   Ôö£ÔöÇÔöÇ login.php                  # API de autenticaci+¦n
+ Ôöé   Ôö£ÔöÇÔöÇ logout.php                 # Cerrar sesi+¦n
+ Ôöé   Ôö£ÔöÇÔöÇ registro_form.php          # Formulario de auto-registro
+ Ôöé   Ôö£ÔöÇÔöÇ registro.php               # API de registro
+ Ôöé   Ôö£ÔöÇÔöÇ validar_empleado.php       # Validaci+¦n de empleados
+ Ôöé   Ôö£ÔöÇÔöÇ config/
+ Ôöé   Ôöé   ÔööÔöÇÔöÇ conexion.php           # Configuraci+¦n de BD
+ Ôöé   Ôö£ÔöÇÔöÇ api/                       # Endpoints compartidos
+ Ôöé   Ôöé   Ôö£ÔöÇÔöÇ obtener_actividades.php
+ Ôöé   Ôöé   Ôö£ÔöÇÔöÇ obtener_empleados.php
+ Ôöé   Ôöé   Ôö£ÔöÇÔöÇ obtener_tareas.php
+ Ôöé   Ôöé   ÔööÔöÇÔöÇ obtener_empleados_tarea.php
+ Ôöé   ÔööÔöÇÔöÇ assets/
+ Ôöé       Ôö£ÔöÇÔöÇ css/
+ Ôöé       Ôöé   ÔööÔöÇÔöÇ styles.css         # Estilos globales
+ Ôöé       Ôö£ÔöÇÔöÇ js/
+ Ôöé       Ôöé   ÔööÔöÇÔöÇ script.js          # L+¦gica frontend
+ Ôöé       ÔööÔöÇÔöÇ img/
+ Ôöé           ÔööÔöÇÔöÇ background.jpg     # Imagen de fondo
+ Ôöé
+ Ôö£ÔöÇÔöÇ uploads/                       # Fotos de perfil de usuarios
+ Ôö£ÔöÇÔöÇ utils/                         # Scripts de utilidad y migraciones
+ Ôöé   ÔööÔöÇÔöÇ 001_agregar_campo_foto_perfil_APLICADO.sql
+ Ôö£ÔöÇÔöÇ docs/                          # Documentaci+¦n adicional
+ Ôöé   ÔööÔöÇÔöÇ README.md
+ ÔööÔöÇÔöÇ .gitignore
+ ```
+ 
+ ## ­ƒöæ Credenciales de Prueba
+ 
+ Despu+®s de instalar, crear un usuario administrador manualmente en la BD:
+ 
+ ```sql
+ INSERT INTO empleados (nombre, apellido, email, password, rol, estado) 
+ VALUES ('Admin', 'Sistema', 'admin@gestion.com', 
+         '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
+         'ADMIN', 'activo');
+ -- Password: password
+ ```
+ 
+ ## ­ƒîÉ URLs del Sistema
+ 
+ - **P+¦blico**: `http://localhost/gestion-editorial/`
+ - **Login**: `http://localhost/gestion-editorial/shared/index.php`
+ - **Registro**: `http://localhost/gestion-editorial/shared/registro_form.php`
+ - **Panel Admin**: `http://localhost/gestion-editorial/admin/panel_admin.php`
+ - **Panel Empleado**: `http://localhost/gestion-editorial/empleado/panel_empleado.php`
+ 
+ ## ­ƒöÉ Seguridad
+ 
+ - Ô£à Contrase+¦as hasheadas con `password_hash()` (bcrypt)
+ - Ô£à Validaci+¦n de roles en cada panel
+ - Ô£à Protecci+¦n contra inyecci+¦n SQL con prepared statements
+ - Ô£à Validaci+¦n de sesiones en todas las p+íginas protegidas
+ - Ô£à Sanitizaci+¦n de inputs en formularios
+ 
+ ## ­ƒôè Base de Datos
+ 
+ ### Tablas principales:
+ 
+ **empleados**
+ - Gesti+¦n de usuarios del sistema
+ - Campos: id, nombre, apellido, email, password, rol, estado, foto_perfil
+ 
+ **tareas**
+ - Tareas editoriales principales
+ - Campos: id, nombre, descripcion, fecha_creacion, estado
+ 
+ **actividades**
+ - Actividades dentro de cada tarea
+ - Campos: id, tarea_id, empleado_id, descripcion, estado, fecha_inicio, fecha_fin, calificacion
+ 
+ **tareas_empleados**
+ - Relaci+¦n muchos a muchos entre tareas y empleados
+ 
+ ## ­ƒÄ¿ Personalizaci+¦n
+ 
+ ### Cambiar colores del tema
+ Editar `shared/assets/css/styles.css`:
+ ```css
+ :root {
+     --color-primary: #0d6efd;
+     --color-secondary: #6c757d;
+     --color-success: #198754;
+     /* ... m+ís variables */
+ }
+ ```
+ 
+ ### Modificar landing p+¦blica
+ Editar `public/index.html` con tu contenido personalizado.
+ 
+ ## ­ƒÉø Soluci+¦n de Problemas
+ 
+ ### Error de conexi+¦n a la base de datos
+ - Verificar credenciales en `shared/config/conexion.php`
+ - Confirmar que MySQL est+í ejecut+índose
+ - Verificar que la base de datos existe
+ 
+ ### Las fotos de perfil no se suben
+ - Verificar permisos de escritura en carpeta `uploads/`
+ - Confirmar l+¡mite de tama+¦o en `php.ini`: `upload_max_filesize` y `post_max_size`
+ 
+ ### Sesiones no funcionan
+ - Verificar que `session_start()` est+® al inicio de los archivos PHP
+ - Comprobar configuraci+¦n de sesiones en `php.ini`
+ 
+ ## ­ƒñØ Contribuir
+ 
+ 1. Fork el proyecto
+ 2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
+ 3. Commit tus cambios (`git commit -m 'Agregar nueva caracter+¡stica'`)
+ 4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
+ 5. Abre un Pull Request
+ 
+ ## ­ƒôØ Licencia
+ 
+ Este proyecto est+í bajo la Licencia MIT. Ver archivo `LICENSE` para m+ís detalles.
+ 
+ ## ­ƒæÑ Autores
+ 
+ - **Tu Nombre** - *Desarrollo inicial* - [Tu GitHub](https://github.com/tu-usuario)
+ 
+ ## ­ƒÖÅ Agradecimientos
+ 
+ - Bootstrap 5 por el framework CSS
+ - UI Avatars por la generaci+¦n de avatares
+ - XAMPP por el entorno de desarrollo local
+ 
+ ---
+ 
+ **Desarrollado con ÔØñ´©Å para optimizar la gesti+¦n editorial**
++>>>>>>> 28f485f (inicializando repositorio)

