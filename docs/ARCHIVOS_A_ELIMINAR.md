# Archivos de Diagnóstico y Migración - SEGUROS PARA ELIMINAR

## Archivos de diagnóstico/debug (creados para resolver problemas):
- `debug_actividades.php` - Debug de actividades
- `debug_tareas.html` - Debug visual de respuesta de tareas
- `diagnostico_estado.php` - Diagnóstico de estados de actividades
- `verificar_actividad_41.php` - Diagnóstico específico de actividad 41
- `verificar_tabla.php` - Verificación de estructura de tabla

## Archivos de migración/corrección (ejecutados una sola vez):
- `cambiar_enum_estado.php` - Migración ENUM → VARCHAR para actividades.estado
- `agregar_columnas_tareas.php` - Añade columnas a tabla tareas (estado, calificacion, etc.)
- `corregir_estados.php` - Corrección de estados inconsistentes
- `fix_estados_directo.php` - Fix directo de estados
- `normalizar_estados.php` - Normalización de estados de actividades
- `normalizar_estados_tareas.php` - Normalización de estados de tareas
- `actualizar_hash_empleados.php` - Actualización masiva de passwords (útil mantener)
- `generar_hash.php` - Generador de hash (útil mantener)

## Recomendación:
✅ **ELIMINAR** todos los archivos de diagnóstico/debug
✅ **ELIMINAR** archivos de migración ya ejecutados
⚠️ **MANTENER** actualizar_hash_empleados.php y generar_hash.php (útiles para administración)

## Total a eliminar: 11 archivos
