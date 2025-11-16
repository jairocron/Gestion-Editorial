-- Script para agregar el campo foto_perfil a la tabla empleados
-- Ejecutar este script en phpMyAdmin o desde la línea de comandos de MySQL

ALTER TABLE empleados 
ADD COLUMN foto_perfil VARCHAR(500) NULL AFTER estado;

-- Verificar que se agregó correctamente
DESCRIBE empleados;
