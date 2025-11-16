# Gesti-n-Editorial
Proyecto de plataforma de gestión editorial 
=======
# 📚 Sistema de Gestión Editorial

Sistema web completo para la gestión de tareas editoriales con roles de administrador y empleado, desarrollado con PHP, MySQL y Bootstrap 5.

![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?style=flat&logo=php)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat&logo=bootstrap&logoColor=white)

## 🚀 Características Principales

### Para Administradores
- ✅ Gestión completa de empleados (crear, editar, eliminar, activar)
- ✅ Creación y asignación de tareas editoriales
- ✅ Gestión de actividades por tarea
- ✅ Dashboard de seguimiento de tareas (asignadas, en progreso, cerradas)
- ✅ Aprobación de empleados pendientes (auto-registro)
- ✅ Restablecer contraseñas de empleados
- ✅ Visualización de empleados involucrados en tareas cerradas
- ✅ Subida de fotos de perfil

### Para Empleados
- ✅ Visualización de actividades asignadas
- ✅ Aceptar y finalizar actividades
- ✅ Consultar actividades en desarrollo y finalizadas
- ✅ Generar constancias de trabajo (resumida y detallada)
- ✅ Gestión de foto de perfil

### Características Generales
- 🔐 Sistema de autenticación con sesiones PHP
- 👥 Roles de usuario (ADMIN / NORMAL)
- 📸 Avatares con fotos de perfil o iniciales generadas
# 📚 Sistema de Gestión Editorial

Sistema web completo para la gestión de tareas editoriales con roles de administrador y empleado, desarrollado con PHP, MySQL y Bootstrap 5.

![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?style=flat&logo=php)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat&logo=bootstrap&logoColor=white)

## 🚀 Características Principales

### Para Administradores
- ✅ Gestión completa de empleados (crear, editar, eliminar, activar)
- ✅ Creación y asignación de tareas editoriales
- ✅ Gestión de actividades por tarea
- ✅ Dashboard de seguimiento de tareas (asignadas, en progreso, cerradas)
- ✅ Aprobación de empleados pendientes (auto-registro)
- ✅ Restablecer contraseñas de empleados
- ✅ Visualización de empleados involucrados en tareas cerradas
- ✅ Subida de fotos de perfil

### Para Empleados
- ✅ Visualización de actividades asignadas
- ✅ Aceptar y finalizar actividades
- ✅ Consultar actividades en desarrollo y finalizadas
- ✅ Generar constancias de trabajo (resumida y detallada)
- ✅ Gestión de foto de perfil

### Características Generales
- 🔐 Sistema de autenticación con sesiones PHP
- 👥 Roles de usuario (ADMIN / NORMAL)
- 📸 Avatares con fotos de perfil o iniciales generadas
- 📄 Generación de constancias imprimibles
- 🌓 Modo claro/oscuro
- 📱 Diseño responsive con Bootstrap 5
- 🎨 Interfaz moderna y amigable

## 📋 Requisitos del Sistema

- **Servidor Web**: Apache 2.4+ (XAMPP recomendado)
- **PHP**: 8.0 o superior
- **MySQL**: 8.0 o superior
- **Extensiones PHP requeridas**: mysqli, json, session

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/gestion-editorial.git
cd gestion-editorial
```

### 2. Configurar la base de datos

Crear la base de datos en MySQL:
```sql
CREATE DATABASE gestion_editorial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Importar el esquema inicial:
```bash
mysql -u root -p gestion_editorial < database/schema.sql
```

Aplicar migraciones (en orden):
```bash
mysql -u root -p gestion_editorial < utils/001_agregar_campo_foto_perfil_APLICADO.sql
```

### 3. Configurar la conexión

Editar `shared/config/conexion.php` con tus credenciales:
```php
$host = 'localhost';
$usuario = 'root';
$password = 'tu_password';
$base_datos = 'gestion_editorial';
```

### 4. Configurar permisos

Crear carpeta de uploads y dar permisos de escritura:
```bash
mkdir uploads
chmod 755 uploads
```

### 5. Iniciar el servidor

Con XAMPP:
- Colocar el proyecto en `C:\xampp\htdocs\gestion-editorial`
- Iniciar Apache y MySQL desde el panel de control de XAMPP
- Acceder a `http://localhost/gestion-editorial/`
│   ├── index.php                  # Página de login con redirección por sesión
│   ├── login.php                  # API de autenticación
│   ├── logout.php                 # Cerrar sesión
│   ├── registro_form.php          # Formulario de auto-registro
│   ├── registro.php               # API de registro
│   ├── validar_empleado.php       # Validación de empleados
│   ├── config/
│   │   └── conexion.php           # Configuración de BD
│   ├── api/                       # Endpoints compartidos
│   │   ├── obtener_actividades.php
│   │   ├── obtener_empleados.php
│   │   ├── obtener_tareas.php
│   │   └── obtener_empleados_tarea.php
│   └── assets/
│       ├── css/
│       │   └── styles.css         # Estilos globales
│       ├── js/
│       │   └── script.js          # Lógica frontend
│       └── img/
│           └── background.jpg     # Imagen de fondo
│
├── uploads/                       # Fotos de perfil de usuarios
├── utils/                         # Scripts de utilidad y migraciones
│   └── 001_agregar_campo_foto_perfil_APLICADO.sql
├── docs/                          # Documentación adicional
│   └── README.md
└── .gitignore
```

## 🔑 Credenciales de Prueba

Después de instalar, crear un usuario administrador manualmente en la BD:

```sql
INSERT INTO empleados (nombre, apellido, email, password, rol, estado) 
VALUES ('Admin', 'Sistema', 'admin@gestion.com', 
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
        'ADMIN', 'activo');
-- Password: password
```

## 🌐 URLs del Sistema

- **Público**: `http://localhost/gestion-editorial/`
- **Login**: `http://localhost/gestion-editorial/shared/index.php`
- **Registro**: `http://localhost/gestion-editorial/shared/registro_form.php`
- **Panel Admin**: `http://localhost/gestion-editorial/admin/panel_admin.php`
- **Panel Empleado**: `http://localhost/gestion-editorial/empleado/panel_empleado.php`

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con `password_hash()` (bcrypt)
- ✅ Validación de roles en cada panel
- ✅ Protección contra inyección SQL con prepared statements
- ✅ Validación de sesiones en todas las páginas protegidas
- ✅ Sanitización de inputs en formularios

## 📊 Base de Datos

### Tablas principales:

**empleados**
- Gestión de usuarios del sistema
- Campos: id, nombre, apellido, email, password, rol, estado, foto_perfil

**tareas**
- Tareas editoriales principales
- Campos: id, nombre, descripcion, fecha_creacion, estado

**actividades**
- Actividades dentro de cada tarea
- Campos: id, tarea_id, empleado_id, descripcion, estado, fecha_inicio, fecha_fin, calificacion

**tareas_empleados**
- Relación muchos a muchos entre tareas y empleados

## 🎨 Personalización

### Cambiar colores del tema
Editar `shared/assets/css/styles.css`:
```css
:root {
    --color-primary: #0d6efd;
    --color-secondary: #6c757d;
    --color-success: #198754;
    /* ... más variables */
}
```

### Modificar landing pública
Editar `public/index.html` con tu contenido personalizado.

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verificar credenciales en `shared/config/conexion.php`
- Confirmar que MySQL está ejecutándose
- Verificar que la base de datos existe

### Las fotos de perfil no se suben
- Verificar permisos de escritura en carpeta `uploads/`
- Confirmar límite de tamaño en `php.ini`: `upload_max_filesize` y `post_max_size`

### Sesiones no funcionan
- Verificar que `session_start()` esté al inicio de los archivos PHP
- Comprobar configuración de sesiones en `php.ini`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [Tu GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Bootstrap 5 por el framework CSS
- UI Avatars por la generación de avatares
- XAMPP por el entorno de desarrollo local
