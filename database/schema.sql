-- Schema inicial para el Sistema de Gestión Editorial
-- Ejecutar después de crear la base de datos

-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'NORMAL') DEFAULT 'NORMAL',
    estado ENUM('activo', 'inactivo', 'pendiente') DEFAULT 'pendiente',
    foto_perfil VARCHAR(500) NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('ASIGNADA', 'EN_PROGRESO', 'CERRADA') DEFAULT 'ASIGNADA',
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de actividades
CREATE TABLE IF NOT EXISTS actividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT NOT NULL,
    empleado_id INT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('pendiente', 'en desarrollo', 'finalizada') DEFAULT 'pendiente',
    fecha_inicio DATETIME NULL,
    fecha_fin DATETIME NULL,
    calificacion DECIMAL(3,2) NULL,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE SET NULL,
    INDEX idx_tarea (tarea_id),
    INDEX idx_empleado (empleado_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de relación tareas-empleados
CREATE TABLE IF NOT EXISTS tareas_empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT NOT NULL,
    empleado_id INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    UNIQUE KEY unique_asignacion (tarea_id, empleado_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario administrador por defecto
-- Password: password (cambiar en producción)
INSERT INTO empleados (nombre, apellido, email, password, rol, estado) 
VALUES (
    'Admin', 
    'Sistema', 
    'admin@gestion.com', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'ADMIN', 
    'activo'
) ON DUPLICATE KEY UPDATE id=id;
