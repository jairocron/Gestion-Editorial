
# CHECKLIST DE FUNCIONALIDADES

Leyenda: 🟢 Implementado | 🟡 Parcial | 🔴 Pendiente

## I. Módulos y Funcionalidades Principales
- 🟢 CRUD Empleados (crear/leer/editar/eliminar)
- 🟢 CRUD Tareas (crear/leer/editar/eliminar con estados)
- 🟢 CRUD Actividades (crear/leer/editar/eliminar con máquina de estados)
- 🟢 Login con verificación de contraseña hasheada
- 🟢 Redirección por rol (admin/empleado) y protección de sesión
- 🟢 Restablecimiento de contraseña desde panel admin
- 🟢 Logout funcional con limpieza de sesión
- 🟡 Validar email único (revisar restricción única en BD; validar en backend)
- 🟡 Activar/desactivar empleados (existe activar_empleado.php y empleados_pendientes.php)
- 🟢 Scripts para actualización/restablecimiento masivo de contraseñas
- 🟢 Panel administrador con gestión completa de actividades por estado
- 🟢 Panel empleado con vistas de actividades agrupadas por estado
- 🟢 Formularios con Bootstrap y mensajes de éxito/error
- 🟢 Conexión MySQL y endpoints PHP para CRUD
- 🟢 Manejo de errores en backend con respuesta JSON limpia y ob_clean()
- 🟢 Contraseñas nunca visibles (hash)
- 🔴 Módulo de estadísticas avanzadas
- 🔴 Dashboard con KPIs visuales

II. Consideraciones y Reglas para Empleados y Administradores
A. Empleados (Generales)
- 🟡 Todos los empleados pueden modificar su perfil (hoy edición desde Admin; falta UI en panel empleado)
- 🔴 Alta de empleados por sí mismos (auto-registro pendiente - requisito m.)
- 🔴 Bloqueo de asignación hasta validación de alta (no validado en backend)

B. Administradores (Funciones Exclusivas)
- 🟢 Solo los administradores pueden crear tareas (validación de rol en backend)
- 🟢 Solo los administradores pueden crear actividades (validación de rol en backend)
- 🟢 Asignar actividades a empleados normales (completo con aceptación del empleado)
- 🟢 Un administrador puede crear tantas tareas y actividades como desee
- 🟢 Validación de altas de empleados normales (activar_empleado.php y empleados_pendientes.php)

C. Tareas y Actividades (Reglas de Desarrollo)
- 🟢 Una tarea posee una o varias actividades
- 🟢 Cumplimiento de tarea = 100% actividades completas (validado en cerrar_tarea.php)
- 🟢 Asignación de actividades a empleados (al crear actividad)
- 🟢 Aceptación de actividades por el empleado (aceptar_actividad.php - estado asignada → en_desarrollo)
- 🟢 Edición/cambio de asignación solo antes de iniciar (bloqueo implementado en editar_actividad.php)
- 🟢 Restringir edición de actividad iniciada (solo estado='asignada' puede editarse)
- 🟢 Tiempo promedio de tarea (calculado en cerrar_tarea.php - suma estimados)
- 🟢 Tiempo real de tarea (calculado en cerrar_tarea.php - suma tiempos reales con TIMESTAMPDIFF)
- 🟢 Fechas de inicio/fin al cerrar tarea (fecha_finalizacion = NOW())
- 🔴 Ver empleados involucrados y calificación promedio en tareas cerradas (requisito l. pendiente)

D. Evaluación y Cierre
- 🟢 Evaluar resultados de actividades (evaluar_actividad.php completo)
- 🟢 Calificación de actividad 0-100 con observación (validado en backend)
- 🟢 Clonar actividad para reasignación (clonar_actividad.php con actividad_origen_id)
- 🟢 Marcar actividad evaluada como cerrada (estado finalizada → cerrada al evaluar)
- 🟢 Cerrar tarea cuando todas sus actividades estén completas (cerrar_tarea.php validado)
- 🟢 Calificación y observación al cerrar tarea (calificacion 0-100 + observacion requerida)

E. Tipos de Tareas y Seguimiento para Administradores
- 🔴 Ver tareas agrupadas por estado (requisito k. - dashboard pendiente)
- 🔴 Tareas no iniciadas (ninguna actividad aceptada)
- 🔴 Tareas en proceso (quién hace qué)
- 🔴 Tareas completadas (pendientes de cierre)
- 🟢 Tareas cerradas (mostradas con badge 🔒 CERRADA y datos completos)

III. Flujo de Trabajo para Empleados Normales (Actividades)
- 🟢 Actividades organizadas por grupos:
    - 🟢 Asignadas No Iniciadas (estado='asignada')
    - 🟢 En Desarrollo (estado='en_desarrollo' con botón Finalizar)
    - 🟢 Finalizadas (estado='finalizada' pendiente evaluación admin)
    - 🟢 Cerradas (estado='cerrada' con calificación y observación visible)
- 🟢 Ver nombre, descripción y tiempo estimado
- 🟢 Marcar actividad como iniciada (aceptar_actividad.php - botón "Aceptar e Iniciar")
- 🟢 Máximo dos actividades simultáneas por empleado (validado en aceptar_actividad.php)
- 🟢 Ver cuándo aceptó y tiempo transcurrido (fecha_inicio visible)
- 🟢 Marcar actividad como finalizada (finalizar_actividad.php - calcula tiempo_real con TIMESTAMPDIFF)
- 🟢 Ver información completa de finalizadas (fechas inicio/fin, tiempo estimado/real)
- 🟢 Calificación (0-100) y observación del administrador (visible en sección Cerradas)

IV. Constancias de Trabajo (Empleados Normales)
- 🟢 Constancia resumida (cantidad de actividades, tiempo trabajado, calificación promedio - verConstanciaTrabajo())
- 🔴 Constancia detallada (por actividad y por tarea con tiempos y calificación - requisito p. pendiente)

---

## ESTADO ACTUAL DE IMPLEMENTACIÓN (Prioridades completadas)

### ✅ Completado:
- **g. Evaluación de actividades**: evaluar_actividad.php con validación estado='finalizada', calificacion 0-100, observacion requerida, actualiza a 'cerrada' con evaluador_id
- **f. Bloquear edición**: editar_actividad.php verifica estado='asignada', rechaza si estado != 'asignada'
- **n.iv. Vista actividades cerradas**: Panel empleado muestra sección completa con calificacion/observacion
- **h. Clonar actividad**: clonar_actividad.php crea copia con actividad_origen_id, permite reasignar empleado
- **i. Cerrar tarea**: cerrar_tarea.php valida todas actividades='cerrada', calcula tiempo_estimado_total y tiempo_real_total, UPDATE tareas con estado='CERRADA', calificacion, observacion, fecha_finalizacion

### 🚧 Correcciones técnicas completadas:
- Estado actividades: ENUM → VARCHAR(50), normalizado a minúsculas (asignada, en_desarrollo, finalizada, cerrada)
- Estado tareas: MAYÚSCULAS (CERRADA, ASIGNADA) - consistencia con comparaciones frontend
- Cache-busting: obtener_tareas.php y obtener_actividades.php con timestamp + no-cache headers
- Tabla tareas extendida: estado, calificacion, observacion, fecha_finalizacion, tiempo_estimado, tiempo_real

### 🔴 Pendientes (orden de prioridad):
- **k. Vistas de tareas por estado**: Dashboard admin mostrando no iniciadas, en proceso, completadas, cerradas
- **o. Constancia resumida**: Mejorar formato y opciones de impresión/descarga
- **p. Constancia detallada**: Desglose por actividad y tarea
- **m. Auto-registro empleados**: Formulario público con estado='pendiente' hasta validación admin
- **l. Empleados involucrados**: Vista de empleados en tareas cerradas con calificación promedio