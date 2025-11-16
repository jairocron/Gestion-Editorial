// Obtener empleados y llenar el select de creador
async function obtenerEmpleadosSelect() {
    try {
        const response = await fetch('../shared/api/obtener_empleados.php');
        const empleados = await response.json();
        let options = '<option value="">Seleccione un empleado</option>';
        empleados.forEach(emp => {
            options += `<option value="${emp.id}">${emp.nombre} ${emp.apellido ? emp.apellido : ''}</option>`;
        });
        return options;
    } catch (error) {
        return '<option value="">Error al cargar empleados</option>';
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    if (confirm('¿Deseas cerrar sesión?')) {
        window.location.href = '../shared/logout.php';
    }
}

console.log("Sistema de Gestión Editorial iniciado");

// Función para mostrar formulario de nuevo empleado
function mostrarFormularioEmpleado() {
    const contenido = document.getElementById('contenido-dinamico');
    contenido.innerHTML = `
        <h3>Agregar Nuevo Empleado</h3>
        <form id="formularioEmpleado">
        <div class="container mb-3">
            <div class="mb-3">
                <label>Nombre:</label><br>
                <input type="text" id="nombre" name="nombre" class="form-control" required>
            </div>
            
            <div class="mb-3">
                <label>Apellido:</label><br>
                <input type="text" id="apellido" name="apellido" class="form-control" required>
            </div>

            <div class="mb-3">
                <label>Email:</label><br>
                <input type="email" id="email" name="email" class="form-control" required>
            </div>

            <div class="mb-3">
                <label>Contraseña:</label><br>
                <input type="password" id="password" name="password" class="form-control" required>
            </div>
            
            <div class="mb-3">
                <label>Rol:</label><br>
                <select id="rol" name="rol" class="form-select">
                    <option value="ADMIN">Administrador</option>
                    <option value="NORMAL">Empleado</option>
                </select>
            </div>
            
            <div class="mb-3">
                <label>Estado:</label><br>
                <select id="estado" name="estado" class="form-select">
                    <option value="activo">Activo</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </div>
            
            <button type="button" onclick="guardarEmpleado()" class="btn btn-success">
                Guardar Empleado
            </button>
            
            <button type="button" onclick="verEmpleados()" class="btn btn-secondary">
                Cancelar
            </button>
        </form>
    `;
}
    // Función para mostrar el formulario de creación de actividad
    function formularioActividades() {
        const contenido = document.getElementById('contenido-dinamico');
        // Obtener tareas y empleados en paralelo
        Promise.all([
            fetch('../shared/api/obtener_tareas.php').then(r => r.json()),
            fetch('../shared/api/obtener_empleados.php').then(r => r.json())
        ]).then(([tareas, empleados]) => {
            let tareasOptions = tareas.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('');
            let empleadosOptions = empleados.map(e => `<option value="${e.id}">${e.nombre} ${e.apellido}</option>`).join('');
            contenido.innerHTML = `
                <h3>Crear Nueva Actividad</h3>
                <form id="formActividad">
                <div class="container mb-3">
                    <div class="mb-3">
                        <label for="nombre">Nombre de la actividad:</label><br>
                        <input type="text" id="nombre" name="nombre" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="descripcion">Descripción:</label><br>
                        <textarea id="descripcion" name="descripcion" class="form-control" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="tiempo_estimado">Tiempo estimado (horas):</label><br>
                        <input type="number" id="tiempo_estimado" name="tiempo_estimado" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="tarea_id">Tarea asociada:</label><br>
                        <select id="tarea_id" name="tarea_id" required class="form-select">
                            <option value="">Selecciona una tarea</option>
                            ${tareasOptions}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="empleado_id">Empleado asignado:</label><br>
                        <select id="empleado_id" name="empleado_id" required class="form-select">
                            <option value="">Selecciona un empleado</option>
                            ${empleadosOptions}
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar actividad</button>
                </form>
                <div id="mensajeActividad"></div>
            `;
            document.getElementById('formActividad').addEventListener('submit', function(e) {
                e.preventDefault();
                const msgEl = document.getElementById('mensajeActividad');
                msgEl.innerHTML = ''; // Limpiar mensajes previos
                
                const datos = {
                    nombre: document.getElementById('nombre').value,
                    descripcion: document.getElementById('descripcion').value,
                    tiempo_estimado: document.getElementById('tiempo_estimado').value,
                    tarea_id: document.getElementById('tarea_id').value,
                    empleado_id: document.getElementById('empleado_id').value
                };
                fetch('../admin/api/crear_actividades.php', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    body: JSON.stringify(datos)
                })
                .then(async res => {
                    const text = await res.text();
                    try { return JSON.parse(text); }
                    catch (e) { return { success: false, mensaje: text && text.trim() ? text : 'Respuesta no válida del servidor' }; }
                })
                .then(respuesta => {
                    const el = document.getElementById('mensajeActividad');
                    el.innerHTML = `<div class="alert alert-${respuesta.success ? 'success' : 'danger'}">${respuesta.mensaje || 'Operación realizada'}</div>`;
                    if (respuesta.success) {
                        this.reset();
                        setTimeout(() => { el.innerHTML = ''; }, 3000); // Limpiar después de 3 seg
                    }
                })
                .catch((err) => {
                    document.getElementById('mensajeActividad').innerHTML = '<div class="alert alert-danger">Error de conexión al crear actividad.</div>';
                });
            });
        });
    }
// Funcion para formulario de edicion de actividades
function mostrarFormularioActividades(id, nombre, descripcion, tiempo_estimado) {
  const contenido = document.getElementById('contenido-dinamico');
  contenido.innerHTML = `
        <h3>Editar Actividad</h3>
        <form id="formularioEdicion">
        <div class="container mb-3">
            <div class="mb-3">
                <label>Nombre:</label><br>
                <input type="text" id="nombreEdicion" name="nombreEdicion" value="${nombre}" required class="form-control">
            </div>
            <div class="mb-3">
                <label>Apellido:</label><br>
                <input type="text" id="apellidoEdicion" name="apellidoEdicion" value="${apellido}" required class="form-control">
            </div>
            <div class="mb-3">
                <label>Email:</label><br>
                <input type="email" id="emailEdicion" name="emailEdicion" value="${email}" required class="form-control">
            </div>
            <button type="button" onclick="guardarEdicion(${id})" class="btn btn-success">
                Guardar Cambios
            </button>
            <button type="button" onclick="verEmpleados()" class="btn btn-secondary">
                Cancelar
            </button>
        </form>
    `;
}
// Función para activar empleado
async function activarEmpleado(id) {
    try {
        const response = await fetch('../admin/api/activar_empleado.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const resultado = await response.json();
        if (resultado.success) {
            alert('Empleado activado correctamente');
            verEmpleados();
        } else {
            alert('Error: ' + resultado.message);
        }
    } catch (error) {
        alert('Error de conexión al activar empleado');
    }
}
// Función para mostrar actividades por tarea, con acciones para editar/eliminar la tarea
async function mostrarActividadesPorTarea() {
    try {
        // Obtener todas las actividades con cache-busting
        const response = await fetch('../shared/api/obtener_actividades.php?t=' + Date.now(), {
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const actividades = await response.json();
        // Agrupar por tarea_id
        const tareasAgrupadas = {};
        actividades.forEach(act => {
            if (!tareasAgrupadas[act.tarea_id]) tareasAgrupadas[act.tarea_id] = [];
            tareasAgrupadas[act.tarea_id].push(act);
        });
        // Obtener nombres/estado de tareas con cache-busting
        fetch('../shared/api/obtener_tareas.php?t=' + Date.now(), { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } })
            .then(r => r.json())
            .then(tareas => {
            let html = '<h3>Actividades agrupadas por tarea</h3>';
            Object.keys(tareasAgrupadas).forEach(tareaId => {
                const tarea = tareas.find(t => t.id == tareaId);
                const tareaNombre = tarea ? tarea.nombre : `Tarea ID: ${tareaId}`;
                const tareaDesc = tarea ? (tarea.descripcion || '') : '';
                const tareaEstado = tarea ? tarea.estado : null;
                
                // Contar actividades por estado
                const actividadesTarea = tareasAgrupadas[tareaId];
                const totalActividades = actividadesTarea.length;
                const cerradas = actividadesTarea.filter(a => a.estado === 'cerrada').length;
                const todasCerradas = totalActividades > 0 && cerradas === totalActividades;
                
                html += `
                    <div class="mb-3 p-3 border rounded ${tareaEstado === 'CERRADA' ? 'bg-light' : ''}">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="badge bg-primary me-2">Tarea ID: ${tareaId}</span>
                                ${tareaEstado === 'CERRADA' ? '<span class="badge badge-cerrada">🔒 CERRADA</span>' : ''}
                                ${todasCerradas && tareaEstado !== 'CERRADA' ? '<span class="badge bg-warning text-dark">✅ Lista para cerrar</span>' : ''}
                                <strong>${tareaNombre}</strong>
                                <p class="text-muted mb-0 small">${tareaDesc}</p>
                                <p class="mb-0 small"><strong>Progreso:</strong> ${cerradas}/${totalActividades} actividades completadas</p>
                                ${tareaEstado === 'CERRADA' && tarea.calificacion ? `<p class="mb-0 small"><strong>Calificación:</strong> ${tarea.calificacion}/100 | <strong>Observación:</strong> ${tarea.observacion || 'N/A'}</p>` : ''}
                            </div>
                            <div>
                                ${todasCerradas && tareaEstado !== 'CERRADA' ? `<button class="btn btn-success btn-sm" onclick="cerrarTarea(${tareaId})">Cerrar Tarea</button>` : ''}
                            </div>
                        </div>
                        <ul class="mt-3">`;
                tareasAgrupadas[tareaId].forEach(act => { 
                    // Determinar clase CSS personalizada según estado
                    let estadoBadge = '';
                    let estadoTexto = act.estado || 'Sin estado';
                    if (act.estado === 'asignada') {
                        estadoBadge = 'badge badge-asignada';
                        estadoTexto = '⏸️ Asignada (no iniciada)';
                    } else if (act.estado === 'en_desarrollo') {
                        estadoBadge = 'badge badge-en-desarrollo';
                        estadoTexto = '⚙️ En Desarrollo';
                    } else if (act.estado === 'finalizada') {
                        estadoBadge = 'badge badge-finalizada';
                        estadoTexto = '✅ Finalizada (pendiente revisión)';
                    } else if (act.estado === 'cerrada') {
                        estadoBadge = 'badge badge-cerrada';
                        estadoTexto = '🔒 Cerrada';
                    }
                    
                    html += `<li class="mb-3 pb-2 border-bottom">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <span class="badge bg-info me-2">Actividad ID: ${act.id}</span>
                                <span class="badge ${estadoBadge}">${estadoTexto}</span>
                                <h6 class="mt-2 mb-1">${act.nombre}</h6>
                                <p class="mb-1 small text-muted">${act.descripcion || 'Sin descripción'}</p>
                                <div class="row small">
                                    <div class="col-md-6">
                                        <strong>👤 Empleado:</strong> ${act.empleado_id}<br>
                                        <strong>⏱️ Tiempo estimado:</strong> ${act.tiempo_estimado} horas
                                    </div>
                                    <div class="col-md-6">
                                        ${act.fecha_inicio ? `<strong>📅 Inicio:</strong> ${act.fecha_inicio}<br>` : ''}
                                        ${act.fecha_finalizacion ? `<strong>🏁 Fin:</strong> ${act.fecha_finalizacion}<br>` : ''}
                                        ${act.tiempo_real ? `<strong>⌛ Tiempo real:</strong> ${act.tiempo_real} horas<br>` : ''}
                                        ${act.calificacion ? `<strong>⭐ Calificación:</strong> ${act.calificacion}/100` : ''}
                                    </div>
                                </div>
                            </div>
                            <div class="btn-group-vertical btn-group-sm ms-3">
                                ${act.estado === 'finalizada' ? `<button class="btn btn-sm btn-success" onclick="evaluarActividad(${act.id})">Evaluar</button>` : ''}
                                ${act.estado === 'cerrada' ? `<button class="btn btn-sm btn-info" onclick="clonarActividad(${act.id})">Clonar</button>` : ''}
                                ${act.estado === 'asignada' ? `<button class="btn btn-sm btn-warning" onclick="editarActividad(${act.id}, 'mostrarActividadesPorTarea')">Editar</button>` : ''}
                                <button class="btn btn-sm btn-danger" onclick="eliminarActividad(${act.id}, 'mostrarActividadesPorTarea')">Eliminar</button>
                            </div>
                        </div>
                    </li>`;
                });
                html += '</ul></div>';
            });
            document.getElementById('contenido-dinamico').innerHTML = html;
        });
    } catch (error) {
        document.getElementById('contenido-dinamico').innerHTML = '<p style="color:red;">Error al cargar actividades</p>';
    }
}

// Mostrar/ocultar el formulario de edición de una tarea específica
function mostrarEditarTarea(id) {
    const div = document.getElementById(`edit-tarea-${id}`);
    if (!div) return;
    div.style.display = (div.style.display === 'none' || div.style.display === '') ? 'block' : 'none';
}

// Guardar cambios de una tarea
function guardarEdicionTarea(e, id) {
    e.preventDefault();
    const nombre = document.getElementById(`tarea-nombre-${id}`).value.trim();
    const descripcion = document.getElementById(`tarea-desc-${id}`).value.trim();
    const msgEl = document.getElementById(`msg-tarea-${id}`);
    msgEl.innerHTML = '';
    if (!nombre || !descripcion) {
        msgEl.innerHTML = '<div class="alert alert-danger">Completa nombre y descripción.</div>';
        return;
    }
    fetch('editar_tarea.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nombre, descripcion })
    })
    .then(r => r.json())
    .then(data => {
        msgEl.innerHTML = `<div class="alert alert-${data.success ? 'success' : 'danger'}">${data.message || data.mensaje || 'Respuesta recibida'}</div>`;
        if (data.success) {
            // Refrescar la vista para ver los cambios
            mostrarActividadesPorTarea();
        }
    })
    .catch(() => {
        msgEl.innerHTML = '<div class="alert alert-danger">Error al actualizar la tarea.</div>';
    });
}

// Eliminar una tarea
function eliminarTarea(id) {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    fetch('eliminar_tarea.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(r => r.json())
    .then(data => {
        alert(data.message || data.mensaje || (data.success ? 'Tarea eliminada' : 'No se pudo eliminar'));
        if (data.success) {
            mostrarActividadesPorTarea();
        }
    })
    .catch(() => alert('Error al eliminar la tarea'));
}

// Editar una actividad
function editarActividad(id, vistaRetorno) {
    // vistaRetorno es la función a la que regresar después de editar
    vistaRetorno = vistaRetorno || 'verMisActividades';
    
    // Obtener datos actuales de la actividad
    fetch('../shared/api/obtener_actividades.php')
        .then(r => r.json())
        .then(actividades => {
            const act = actividades.find(a => a.id == id);
            if (!act) {
                alert('Actividad no encontrada');
                return;
            }
            
            // Obtener tareas y empleados para los selects
            Promise.all([
                fetch('../shared/api/obtener_tareas.php').then(r => r.json()),
                fetch('../shared/api/obtener_empleados.php').then(r => r.json())
            ]).then(([tareas, empleados]) => {
                let tareasOptions = tareas.map(t => 
                    `<option value="${t.id}" ${t.id == act.tarea_id ? 'selected' : ''}>${t.nombre}</option>`
                ).join('');
                let empleadosOptions = empleados.map(e => 
                    `<option value="${e.id}" ${e.id == act.empleado_id ? 'selected' : ''}>${e.nombre} ${e.apellido}</option>`
                ).join('');
                
                const contenido = document.getElementById('contenido-dinamico');
                contenido.innerHTML = `
                    <h3>Editar Actividad</h3>
                    <form id="formEditarActividad" class="container mt-3">
                        <div class="mb-3">
                            <label for="edit-nombre" class="form-label">Nombre:</label>
                            <input type="text" id="edit-nombre" class="form-control" value="${act.nombre}" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit-descripcion" class="form-label">Descripción:</label>
                            <textarea id="edit-descripcion" class="form-control" required>${act.descripcion || ''}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="edit-tiempo" class="form-label">Tiempo estimado (horas):</label>
                            <input type="number" id="edit-tiempo" class="form-control" value="${act.tiempo_estimado}" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit-tarea" class="form-label">Tarea asociada:</label>
                            <select id="edit-tarea" class="form-select" required>
                                ${tareasOptions}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="edit-empleado" class="form-label">Empleado asignado:</label>
                            <select id="edit-empleado" class="form-select" required>
                                ${empleadosOptions}
                            </select>
                        </div>
                        <button type="submit" class="btn btn-success">Guardar cambios</button>
                        <button type="button" class="btn btn-secondary" onclick="${vistaRetorno}()">Cancelar</button>
                        <div id="msgEditActividad" class="mt-3"></div>
                    </form>
                `;
                
                document.getElementById('formEditarActividad').onsubmit = function(e) {
                    e.preventDefault();
                    const datos = {
                        id: id,
                        nombre: document.getElementById('edit-nombre').value.trim(),
                        descripcion: document.getElementById('edit-descripcion').value.trim(),
                        tiempo_estimado: parseInt(document.getElementById('edit-tiempo').value),
                        tarea_id: parseInt(document.getElementById('edit-tarea').value),
                        empleado_id: parseInt(document.getElementById('edit-empleado').value)
                    };
                    
                    fetch('../admin/api/editar_actividad.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datos)
                    })
                    .then(r => r.json())
                    .then(data => {
                        const msg = document.getElementById('msgEditActividad');
                        msg.innerHTML = `<div class="alert alert-${data.success ? 'success' : 'danger'}">${data.mensaje || data.message}</div>`;
                        if (data.success) {
                            setTimeout(() => {
                                if (typeof window[vistaRetorno] === 'function') {
                                    window[vistaRetorno]();
                                }
                            }, 1500);
                        }
                    })
                    .catch(() => {
                        document.getElementById('msgEditActividad').innerHTML = 
                            '<div class="alert alert-danger">Error al actualizar actividad.</div>';
                    });
                };
            });
        })
        .catch(() => alert('Error al cargar datos de la actividad'));
}

// Eliminar una actividad
function eliminarActividad(id, vistaRetorno) {
    vistaRetorno = vistaRetorno || 'verMisActividades';
    
    if (!confirm('¿Seguro que deseas eliminar esta actividad?')) return;
    
    fetch('../admin/api/eliminar_actividad.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(r => r.json())
    .then(data => {
        alert(data.message || data.mensaje || (data.success ? 'Actividad eliminada' : 'No se pudo eliminar'));
        if (data.success) {
            if (typeof window[vistaRetorno] === 'function') {
                window[vistaRetorno]();
            }
        }
    })
    .catch(() => alert('Error al eliminar la actividad'));
}

//mostrar fomulario de creacion de tareas
function mostrarFormularioTarea() {
    const contenido = document.getElementById('contenido-dinamico');
    obtenerEmpleadosSelect().then(options => {
        contenido.innerHTML = `
            <h3>Crear Nueva Tarea </h3>
            <form id="formTarea">
            <div class="container mb-3">
            <div class="mb-3">
                <label for="nombre">Nombre de la tarea:</label><br>
                <input type="text" id="nombre" name="nombre" required class="form-control"> 
            </div>
            <div class="mb-3">
                <label for="descripcion">Descripción:</label><br>
                <textarea id="descripcion" name="descripcion" required class="form-control"></textarea>
            </div>
            <div class="mb-3">
                <label for="creador_id">Empleado creador:</label><br>
                <select id="creador_id" name="creador_id" required class="form-select">
                    ${options}
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Guardar tarea</button>
            </form>
            <div id="mensajeTarea"></div>
        `;
        document.getElementById('formTarea').addEventListener('submit', function(e) {
            e.preventDefault();
            const datos = {
                nombre: document.getElementById('nombre').value,
                descripcion: document.getElementById('descripcion').value,
                creador_id: document.getElementById('creador_id').value
            };
            fetch('../admin/api/crear_tarea.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(async res => {
                const text = await res.text();
                try {
                    return JSON.parse(text);
                } catch (e) {
                    return { success: false, mensaje: text && text.trim() ? text : 'Respuesta no válida del servidor' };
                }
            })
            .then(respuesta => {
                const cont = document.getElementById('mensajeTarea');
                cont.innerHTML = `<div class="alert alert-${respuesta.success ? 'success' : 'danger'}">${respuesta.mensaje || 'Operación realizada'}</div>`;
                if (respuesta.success) this.reset();
            })
            .catch((err) => {
                document.getElementById('mensajeTarea').innerHTML = '<div class="alert alert-danger">Error al crear tarea.</div>';
            });
        });
    });
}

// Función para ver empleados
function verEmpleados() {
    fetch('../shared/api/obtener_empleados.php')
        .then(res => res.json())
        .then(empleados => {
            let html = `
            <h3 class="mb-4">Lista de Empleados</h3>
            <div class="card">
                <div class="table-responsive">
                    <table class="table align-items-center mb-0">
                        <thead>
                            <tr>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Empleado</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Rol</th>
                                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estado</th>
                                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Email</th>
                                <th class="text-secondary opacity-7">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>`;
            
            empleados.forEach(emp => {
                // Determinar URL del avatar: si tiene foto_perfil usa esa, sino genera con iniciales
                const avatarUrl = emp.foto_perfil && emp.foto_perfil !== '' 
                    ? emp.foto_perfil 
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.nombre)}+${encodeURIComponent(emp.apellido || '')}&background=random&size=64&bold=true`;
                
                const estadoBadge = emp.estado === 'activo' 
                    ? '<span class="badge badge-sm bg-success">Activo</span>' 
                    : emp.estado === 'pendiente'
                    ? '<span class="badge badge-sm bg-warning">Pendiente</span>'
                    : '<span class="badge badge-sm bg-secondary">Inactivo</span>';
                
                const rolTexto = emp.rol === 'ADMIN' ? 'Administrador' : 'Empleado';
                const rolSubtexto = emp.rol === 'ADMIN' ? 'Gestión' : 'Operativo';
                
                html += `
                    <tr>
                        <td>
                            <div class="d-flex px-2 py-1">
                                <div class="position-relative">
                                    <img src="${avatarUrl}" class="avatar avatar-xs me-3 rounded-circle" alt="${emp.nombre}">
                                </div>
                                <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-xs">${emp.nombre} ${emp.apellido || ''}</h6>
                                    <p class="text-xs text-secondary mb-0">ID: ${emp.id}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">${rolTexto}</p>
                            <p class="text-xs text-secondary mb-0">${rolSubtexto}</p>
                        </td>
                        <td class="align-middle text-center text-sm">
                            ${estadoBadge}
                        </td>
                        <td class="align-middle text-center">
                            <span class="text-secondary text-xs font-weight-normal">${emp.email}</span>
                        </td>
                        <td class="align-middle">
                                <button class="btn btn-sm btn-warning" onclick="editarEmpleado(${emp.id})">Editar</button>
                            </a>
                             <button class="btn btn-sm btn-danger" onclick="eliminarEmpleado(${emp.id})">Eliminar</button>
                            </a>
                        </td>
                    </tr>`;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            </div>`;
            
            document.getElementById('contenido-dinamico').innerHTML = html;
        })
        .catch(() => {
            document.getElementById('contenido-dinamico').innerHTML = '<div class="alert alert-danger">Error al cargar empleados.</div>';
        });
}

function editarEmpleado(id) {
    fetch('../shared/api/obtener_empleados.php')
        .then(res => res.json())
        .then(empleados => {
            const emp = empleados.find(e => e.id == id);
            if (!emp) return alert('Empleado no encontrado');
            
            // Determinar URL del avatar actual
            const avatarUrl = emp.foto_perfil && emp.foto_perfil !== '' 
                ? emp.foto_perfil 
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.nombre)}+${encodeURIComponent(emp.apellido || '')}&background=random&size=128&bold=true`;
            
            const contenido = document.getElementById('contenido-dinamico');
            contenido.innerHTML = `
                <h3>Editar Empleado</h3>
                <div class="card mb-4">
                    <div class="card-body text-center">
                        <h5 class="card-title">Foto de Perfil</h5>
                        <img id="preview-foto" src="${avatarUrl}" class="rounded-circle mb-3" style="width: 120px; height: 120px; object-fit: cover;" alt="Foto de perfil">
                        <div>
                            <input type="file" id="input-foto" class="form-control mb-2" accept="image/*">
                            <button type="button" class="btn btn-sm btn-primary" onclick="subirFotoPerfil(${id})">📷 Subir Foto</button>
                            <div id="msg-foto" class="mt-2"></div>
                        </div>
                    </div>
                </div>
                
                <form id='formEditarEmpleado' class="card p-4">
                    <div class='mb-3'>
                        <label class="form-label">Nombre:</label>
                        <input type='text' name='nombre' class='form-control' value='${emp.nombre}' required>
                    </div>
                    <div class='mb-3'>
                        <label class="form-label">Apellido:</label>
                        <input type='text' name='apellido' class='form-control' value='${emp.apellido}' required>
                    </div>
                    <div class='mb-3'>
                        <label class="form-label">Email:</label>
                        <input type='email' name='email' class='form-control' value='${emp.email}' required>
                    </div>
                    <div class='mb-3'>
                        <label class="form-label">Rol:</label>
                        <select name='rol' class='form-select'>
                            <option value='ADMIN' ${emp.rol=='ADMIN'?'selected':''}>Administrador</option>
                            <option value='NORMAL' ${emp.rol=='NORMAL'?'selected':''}>Empleado</option>
                        </select>
                    </div>
                    <div class='mb-3'>
                        <label class="form-label">Estado:</label>
                        <select name='estado' class='form-select'>
                            <option value='activo' ${emp.estado=='activo'?'selected':''}>Activo</option>
                            <option value='pendiente' ${emp.estado=='pendiente'?'selected':''}>Pendiente</option>
                            <option value='inactivo' ${emp.estado=='inactivo'?'selected':''}>Inactivo</option>
                        </select>
                    </div>
                    <button type='submit' class='btn btn-success'>💾 Guardar Cambios</button>
                    <button type='button' onclick='verEmpleados()' class='btn btn-secondary'>❌ Cancelar</button>
                </form>`;
                
            // Preview de imagen al seleccionar
            document.getElementById('input-foto').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        document.getElementById('preview-foto').src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
                
            document.getElementById('formEditarEmpleado').onsubmit = function(e) {
                e.preventDefault();
                const datos = Object.fromEntries(new FormData(this));
                datos.id = id;
                fetch('../admin/api/editar_empleado.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                })
                .then(res => res.json())
                .then(resp => {
                    alert(resp.message);
                    if (resp.success) verEmpleados();
                })
                .catch(() => alert('Error al editar empleado'));
            };
        });
}

// Función para subir foto de perfil
function subirFotoPerfil(empleadoId) {
    const inputFoto = document.getElementById('input-foto');
    const msgFoto = document.getElementById('msg-foto');
    
    if (!inputFoto.files[0]) {
        msgFoto.innerHTML = '<div class="alert alert-warning">Selecciona una imagen primero</div>';
        return;
    }
    
    const formData = new FormData();
    formData.append('foto', inputFoto.files[0]);
    formData.append('empleado_id', empleadoId);
    
    msgFoto.innerHTML = '<div class="alert alert-info">Subiendo...</div>';
    
    fetch('../admin/api/subir_foto_perfil.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        msgFoto.innerHTML = `<div class="alert alert-${data.success ? 'success' : 'danger'}">${data.mensaje}</div>`;
        if (data.success) {
            setTimeout(() => {
                msgFoto.innerHTML = '';
            }, 2000);
        }
    })
    .catch(() => {
        msgFoto.innerHTML = '<div class="alert alert-danger">Error al subir la foto</div>';
    });
}

function eliminarEmpleado(id) {
    if (!confirm('¿Seguro que deseas eliminar este empleado?')) return;
    fetch('../admin/api/eliminar_empleado.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(resp => {
        alert(resp.message);
        if (resp.success) verEmpleados();
    })
    .catch(() => alert('Error al eliminar empleado'));
}

function verMisActividades() {
    // Agregar timestamp para evitar caché
    fetch('../shared/api/obtener_actividades.php?t=' + Date.now())
        .then(res => res.json())
        .then(actividades => {
            // Agrupar por estado (normalizar a minúsculas para comparación)
            const asignadas = actividades.filter(a => {
                const estado = (a.estado || '').toLowerCase();
                return estado === 'asignada';
            });
            const enDesarrollo = actividades.filter(a => {
                const estado = (a.estado || '').toLowerCase();
                return estado === 'en_desarrollo';
            });
            const finalizadas = actividades.filter(a => {
                const estado = (a.estado || '').toLowerCase();
                return estado === 'finalizada';
            });
            const cerradas = actividades.filter(a => {
                const estado = (a.estado || '').toLowerCase();
                return estado === 'cerrada' || estado === 'completada';
            });
            
            let html = '<h3>Mis Actividades</h3>';
            
            // Actividades Asignadas No Iniciadas
            html += '<div class="card mb-3"><div class="card-header bg-primary text-white"><h5>Actividades Asignadas No Iniciadas</h5></div><div class="card-body">';
            if (asignadas.length === 0) {
                html += '<p class="text-muted">No tienes actividades asignadas pendientes</p>';
            } else {
                html += '<table class="table table-sm"><thead><tr><th>ID Actividad</th><th>Tarea</th><th>Nombre</th><th>Descripción</th><th>Tiempo estimado</th><th>Acción</th></tr></thead><tbody>';
                asignadas.forEach(act => {
                    html += `<tr>
                        <td>${act.id}</td>
                        <td><span class="badge bg-secondary">${act.tarea_nombre || 'N/A'}</span></td>
                        <td>${act.nombre}</td>
                        <td>${act.descripcion || 'Sin descripción'}</td>
                        <td>${act.tiempo_estimado} horas</td>
                        <td><button class='btn btn-success btn-sm' onclick='iniciarActividad(${act.id})'>Iniciar</button></td>
                    </tr>`;
                });
                html += '</tbody></table>';
            }
            html += '</div></div>';
            
            // Actividades en Desarrollo
            html += '<div class="card mb-3"><div class="card-header bg-warning"><h5>Actividades en Desarrollo (máx. 2)</h5></div><div class="card-body">';
            if (enDesarrollo.length === 0) {
                html += '<p class="text-muted">No tienes actividades en desarrollo</p>';
            } else {
                html += '<table class="table table-sm"><thead><tr><th>ID Actividad</th><th>Tarea</th><th>Nombre</th><th>Descripción</th><th>Fecha inicio</th><th>Acción</th></tr></thead><tbody>';
                enDesarrollo.forEach(act => {
                    html += `<tr>
                        <td>${act.id}</td>
                        <td><span class="badge bg-secondary">${act.tarea_nombre || 'N/A'}</span></td>
                        <td>${act.nombre}</td>
                        <td>${act.descripcion || 'Sin descripción'}</td>
                        <td>${act.fecha_inicio || 'N/A'}</td>
                        <td><button class='btn btn-primary btn-sm' onclick='finalizarActividadEmpleado(${act.id})'>Finalizar</button></td>
                    </tr>`;
                });
                html += '</tbody></table>';
            }
            html += '</div></div>';
            
            // Actividades Finalizadas
            html += '<div class="card mb-3"><div class="card-header bg-info text-white"><h5>Actividades Finalizadas (pendientes de evaluación)</h5></div><div class="card-body">';
            if (finalizadas.length === 0) {
                html += '<p class="text-muted">No tienes actividades finalizadas pendientes de revisión</p>';
            } else {
                html += '<table class="table table-sm"><thead><tr><th>ID Actividad</th><th>Tarea</th><th>Nombre</th><th>Fecha inicio</th><th>Fecha fin</th><th>Tiempo real</th></tr></thead><tbody>';
                finalizadas.forEach(act => {
                    html += `<tr>
                        <td>${act.id}</td>
                        <td><span class="badge bg-secondary">${act.tarea_nombre || 'N/A'}</span></td>
                        <td>${act.nombre}</td>
                        <td>${act.fecha_inicio || 'N/A'}</td>
                        <td>${act.fecha_finalizacion || 'N/A'}</td>
                        <td>${act.tiempo_real || 'N/A'} horas</td>
                    </tr>`;
                });
                html += '</tbody></table>';
            }
            html += '</div></div>';
            
            // Actividades Cerradas
            html += '<div class="card mb-3"><div class="card-header bg-success text-white"><h5>Actividades Cerradas (evaluadas)</h5></div><div class="card-body">';
            if (cerradas.length === 0) {
                html += '<p class="text-muted">No tienes actividades cerradas</p>';
            } else {
                html += '<table class="table table-sm"><thead><tr><th>ID</th><th>Tarea</th><th>Nombre</th><th>Descripción</th><th>Fecha Inicio</th><th>Fecha Fin</th><th>Tiempo Estimado</th><th>Tiempo Real</th><th>Calificación</th><th>Observación</th></tr></thead><tbody>';
                cerradas.forEach(act => {
                    const calificacionClass = act.calificacion >= 70 ? 'text-success' : (act.calificacion >= 50 ? 'text-warning' : 'text-danger');
                    html += `<tr>
                        <td>${act.id}</td>
                        <td><span class="badge bg-secondary">${act.tarea_nombre || 'N/A'}</span></td>
                        <td>${act.nombre}</td>
                        <td class="small">${act.descripcion || 'Sin descripción'}</td>
                        <td>${act.fecha_inicio || 'N/A'}</td>
                        <td>${act.fecha_finalizacion || 'N/A'}</td>
                        <td>${act.tiempo_estimado} hrs</td>
                        <td>${act.tiempo_real || 'N/A'} hrs</td>
                        <td><strong class="${calificacionClass}">${act.calificacion || 'N/A'}/100</strong></td>
                        <td class="small">${act.observacion || 'Sin observación'}</td>
                    </tr>`;
                });
                html += '</tbody></table>';
            }
            html += '</div></div>';
            
            document.getElementById('contenido-dinamico').innerHTML = html;
        })
        .catch(() => {
            document.getElementById('contenido-dinamico').innerHTML = '<div class="alert alert-danger">Error al cargar actividades.</div>';
        });
}

// Iniciar actividad (cambiar de asignada a en_desarrollo)
function iniciarActividad(id) {
    if (!confirm('¿Deseas iniciar esta actividad?')) return;
    
    fetch('../empleado/api/aceptar_actividad.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        body: JSON.stringify({ id })
    })
    .then(r => r.json())
    .then(data => {
        alert(data.mensaje || data.message);
        if (data.success) {
            verMisActividades();
        }
    })
    .catch(() => alert('Error al iniciar la actividad'));
}

// Finalizar actividad (cambiar de en_desarrollo a finalizada)
function finalizarActividadEmpleado(id) {
    if (!confirm('¿Has terminado esta actividad? Se marcará como finalizada para revisión del administrador.')) return;
    
    fetch('../empleado/api/finalizar_actividad.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        body: JSON.stringify({ id })
    })
    .then(r => r.json())
    .then(data => {
        alert(data.mensaje || data.message);
        if (data.success) {
            verMisActividades();
        }
    })
    .catch(() => alert('Error al finalizar la actividad'));
}

function marcarCompletada() {
    fetch('../shared/api/obtener_actividades.php')
        .then(res => res.json())
        .then(actividades => {
            let opciones = actividades.map(act => `<option value="${act.id}">${act.nombre}</option>`).join('');
            let html = `
                <h3>Marcar Actividad como Completada</h3>
                <form id="formCompletarActividad">
                    <select name="actividad_id" class="form-select mb-3">${opciones}</select>
                    <button type="submit" class="btn btn-success">Marcar como completada</button>
                </form>
                <div id="mensajeCompletada"></div>
            `;
            document.getElementById('contenido-dinamico').innerHTML = html;
            document.getElementById('formCompletarActividad').onsubmit = function(e) {
                e.preventDefault();
                const actividad_id = this.actividad_id.value;
                fetch('marcar_completada.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: actividad_id })
                })
                .then(res => res.json())
                .then(resp => {
                    document.getElementById('mensajeCompletada').innerHTML =
                        `<div class="alert alert-${resp.success ? 'success' : 'danger'}">${resp.message}</div>`;
                })
                .catch(() => {
                    document.getElementById('mensajeCompletada').innerHTML =
                        '<div class="alert alert-danger">Error al marcar actividad.</div>';
                });
            };
        });
}

function verActividadesEnDesarrollo() {
    fetch('../shared/api/obtener_actividades.php')
        .then(res => res.json())
        .then(actividades => {
            let html = '<h3>Actividades en Desarrollo</h3><table class="table"><thead><tr><th>Nombre</th><th>Descripción</th><th>Fecha de inicio</th><th>Tiempo transcurrido</th></tr></thead><tbody>';
            actividades.forEach(act => {
                if (act.estado === 'en_desarrollo') {
                    html += `<tr>
                        <td>${act.nombre}</td>
                        <td>${act.descripcion}</td>
                        <td>${act.fecha_inicio}</td>
                        <td>${act.tiempo_transcurrido || ''}</td>
                    </tr>`;
                }
            });
            html += '</tbody></table>';
            document.getElementById('contenido-dinamico').innerHTML = html;
        });
}

function verActividadesFinalizadas() {
    fetch('../shared/api/obtener_actividades.php')
        .then(res => res.json())
        .then(actividades => {
            let html = '<h3>Actividades Finalizadas</h3><table class="table"><thead><tr><th>Nombre</th><th>Descripción</th><th>Fecha de inicio</th><th>Fecha de finalización</th><th>Tiempo estimado</th><th>Tiempo real</th></tr></thead><tbody>';
            actividades.forEach(act => {
                if (act.estado === 'finalizada') {
                    html += `<tr>
                        <td>${act.nombre}</td>
                        <td>${act.descripcion}</td>
                        <td>${act.fecha_inicio}</td>
                        <td>${act.fecha_finalizacion}</td>
                        <td>${act.tiempo_estimado}</td>
                        <td>${act.tiempo_real}</td>
                    </tr>`;
                }
            });
            html += '</tbody></table>';
            document.getElementById('contenido-dinamico').innerHTML = html;
        });
}

function verConstanciaTrabajo() {
    fetch('../shared/api/obtener_actividades.php')
        .then(res => res.json())
        .then(actividades => {
            const total = actividades.length;
            const tiempoTotal = actividades.reduce((sum, act) => sum + (parseFloat(act.tiempo_real) || 0), 0);
            const califProm = actividades.reduce((sum, act) => sum + (parseFloat(act.calificacion) || 0), 0) / (total || 1);
            let html = `<h3>Constancia de Trabajo</h3>
                <p>Cantidad de actividades: ${total}</p>
                <p>Tiempo trabajado: ${tiempoTotal} horas</p>
                <p>Calificación promedio: ${califProm.toFixed(2)}</p>`;
            document.getElementById('contenido-dinamico').innerHTML = html;
        });
}

// Función para evaluar actividad finalizada (solo admin)
function evaluarActividad(id) {
    // Obtener datos de la actividad
    fetch('../shared/api/obtener_actividades.php?t=' + Date.now())
        .then(r => r.json())
        .then(actividades => {
            const act = actividades.find(a => a.id == id);
            if (!act) {
                alert('Actividad no encontrada');
                return;
            }
            
            if (act.estado !== 'finalizada') {
                alert('Solo se pueden evaluar actividades finalizadas');
                return;
            }
            
            const contenido = document.getElementById('contenido-dinamico');
            contenido.innerHTML = `
                <div class="container mt-3">
                    <h3>Evaluar Actividad</h3>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${act.nombre}</h5>
                            <p class="card-text"><strong>Descripción:</strong> ${act.descripcion || 'Sin descripción'}</p>
                            <p><strong>Empleado ID:</strong> ${act.empleado_id}</p>
                            <p><strong>Fecha inicio:</strong> ${act.fecha_inicio || 'N/A'}</p>
                            <p><strong>Fecha finalización:</strong> ${act.fecha_finalizacion || 'N/A'}</p>
                            <p><strong>Tiempo estimado:</strong> ${act.tiempo_estimado} horas</p>
                            <p><strong>Tiempo real:</strong> ${act.tiempo_real || 'N/A'} horas</p>
                        </div>
                    </div>
                    
                    <form id="formEvaluar" class="mt-4">
                        <div class="mb-3">
                            <label for="calificacion" class="form-label">Calificación (0-100):</label>
                            <input type="number" id="calificacion" class="form-control" min="0" max="100" required>
                            <small class="form-text text-muted">Ingresa una calificación de 0 a 100</small>
                        </div>
                        <div class="mb-3">
                            <label for="observacion" class="form-label">Observación:</label>
                            <textarea id="observacion" class="form-control" rows="4" required></textarea>
                            <small class="form-text text-muted">Proporciona retroalimentación al empleado</small>
                        </div>
                        <button type="submit" class="btn btn-success">Guardar Evaluación</button>
                        <button type="button" class="btn btn-secondary" onclick="mostrarActividadesPorTarea()">Cancelar</button>
                        <div id="msgEvaluar" class="mt-3"></div>
                    </form>
                </div>
            `;
            
            document.getElementById('formEvaluar').onsubmit = function(e) {
                e.preventDefault();
                const calificacion = parseInt(document.getElementById('calificacion').value);
                const observacion = document.getElementById('observacion').value.trim();
                
                if (calificacion < 0 || calificacion > 100) {
                    document.getElementById('msgEvaluar').innerHTML = 
                        '<div class="alert alert-danger">La calificación debe estar entre 0 y 100</div>';
                    return;
                }
                
                if (!observacion) {
                    document.getElementById('msgEvaluar').innerHTML = 
                        '<div class="alert alert-danger">Debe proporcionar una observación</div>';
                    return;
                }
                
                fetch('../admin/api/evaluar_actividad.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
                    body: JSON.stringify({ id, calificacion, observacion })
                })
                .then(r => r.json())
                .then(data => {
                    const msg = document.getElementById('msgEvaluar');
                    msg.innerHTML = `<div class="alert alert-${data.success ? 'success' : 'danger'}">${data.mensaje}</div>`;
                    if (data.success) {
                        setTimeout(() => mostrarActividadesPorTarea(), 1500);
                    }
                })
                .catch(() => {
                    document.getElementById('msgEvaluar').innerHTML = 
                        '<div class="alert alert-danger">Error al evaluar actividad</div>';
                });
            };
        })
        .catch(() => alert('Error al cargar datos de la actividad'));
}

// Función para clonar actividad (crear copia para reasignar)
function clonarActividad(id) {
    fetch('../shared/api/obtener_actividades.php?t=' + Date.now())
        .then(r => r.json())
        .then(actividades => {
            const act = actividades.find(a => a.id == id);
            if (!act) {
                alert('Actividad no encontrada');
                return;
            }
            
            // Obtener lista de empleados para reasignar
            fetch('../shared/api/obtener_empleados.php')
                .then(r => r.json())
                .then(empleados => {
                    let empleadosOptions = empleados.map(e => 
                        `<option value="${e.id}" ${e.id == act.empleado_id ? 'selected' : ''}>${e.nombre} ${e.apellido || ''}</option>`
                    ).join('');
                    
                    const contenido = document.getElementById('contenido-dinamico');
                    contenido.innerHTML = `
                        <div class="container mt-3">
                            <h3>Clonar Actividad</h3>
                            <div class="alert alert-info">
                                <strong>ℹ️ Información:</strong> Se creará una copia de esta actividad para que pueda ser realizada nuevamente por el mismo u otro empleado.
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${act.nombre}</h5>
                                    <p><strong>Descripción:</strong> ${act.descripcion || 'Sin descripción'}</p>
                                    <p><strong>Tarea:</strong> ${act.tarea_nombre || 'N/A'}</p>
                                    <p><strong>Tiempo estimado:</strong> ${act.tiempo_estimado} horas</p>
                                    <p><strong>Empleado original:</strong> ${act.empleado_id}</p>
                                    ${act.calificacion ? `<p><strong>Calificación anterior:</strong> <span class="${act.calificacion < 50 ? 'text-danger' : (act.calificacion < 70 ? 'text-warning' : 'text-success')}">${act.calificacion}/100</span></p>` : ''}
                                    ${act.observacion ? `<p><strong>Observación anterior:</strong> ${act.observacion}</p>` : ''}
                                </div>
                            </div>
                            
                            <form id="formClonar" class="mt-4">
                                <div class="mb-3">
                                    <label for="empleado_clon" class="form-label">Asignar a empleado:</label>
                                    <select id="empleado_clon" class="form-select" required>
                                        ${empleadosOptions}
                                    </select>
                                    <small class="form-text text-muted">Selecciona el empleado que realizará la actividad nuevamente</small>
                                </div>
                                <button type="submit" class="btn btn-primary">Crear Clon</button>
                                <button type="button" class="btn btn-secondary" onclick="mostrarActividadesPorTarea()">Cancelar</button>
                                <div id="msgClonar" class="mt-3"></div>
                            </form>
                        </div>
                    `;
                    
                    document.getElementById('formClonar').onsubmit = function(e) {
                        e.preventDefault();
                        const empleado_id = parseInt(document.getElementById('empleado_clon').value);
                        
                        fetch('../admin/api/clonar_actividad.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
                            body: JSON.stringify({ id, empleado_id })
                        })
                        .then(r => r.json())
                        .then(data => {
                            const msg = document.getElementById('msgClonar');
                            msg.innerHTML = `<div class="alert alert-${data.success ? 'success' : 'danger'}">${data.mensaje}</div>`;
                            if (data.success) {
                                setTimeout(() => mostrarActividadesPorTarea(), 1500);
                            }
                        })
                        .catch(() => {
                            document.getElementById('msgClonar').innerHTML = 
                                '<div class="alert alert-danger">Error al clonar actividad</div>';
                        });
                    };
                });
        })
        .catch(() => alert('Error al cargar datos de la actividad'));
}

// Función para cerrar tarea (admin)
function cerrarTarea(tareaId) {
    fetch('../shared/api/obtener_tareas.php')
        .then(r => r.json())
        .then(tareas => {
            const tarea = tareas.find(t => t.id == tareaId);
            if (!tarea) {
                alert('Tarea no encontrada');
                return;
            }
            
            // Obtener actividades de esta tarea
            fetch('../shared/api/obtener_actividades.php?t=' + Date.now())
                .then(r => r.json())
                .then(actividades => {
                    const actividadesTarea = actividades.filter(a => a.tarea_id == tareaId);
                    const totalActividades = actividadesTarea.length;
                    const cerradas = actividadesTarea.filter(a => a.estado === 'cerrada').length;
                    
                    const contenido = document.getElementById('contenido-dinamico');
                    contenido.innerHTML = `
                        <div class="container mt-3">
                            <h3>Cerrar Tarea</h3>
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${tarea.nombre}</h5>
                                    <p class="card-text"><strong>Descripción:</strong> ${tarea.descripcion || 'Sin descripción'}</p>
                                    <p><strong>Total de actividades:</strong> ${totalActividades}</p>
                                    <p><strong>Actividades completadas:</strong> ${cerradas}</p>
                                    ${cerradas === totalActividades ? '<p class="text-success">✅ Todas las actividades han sido completadas y evaluadas</p>' : '<p class="text-danger">⚠️ No todas las actividades están completadas</p>'}
                                </div>
                            </div>
                            
                            <form id="formCerrarTarea" class="mt-4">
                                <div class="mb-3">
                                    <label for="calificacion_tarea" class="form-label">Calificación general de la tarea (0-100):</label>
                                    <input type="number" id="calificacion_tarea" class="form-control" min="0" max="100" required>
                                    <small class="form-text text-muted">Califica el resultado general de la tarea</small>
                                </div>
                                <div class="mb-3">
                                    <label for="observacion_tarea" class="form-label">Observación general:</label>
                                    <textarea id="observacion_tarea" class="form-control" rows="4" required></textarea>
                                    <small class="form-text text-muted">Comentarios sobre el desarrollo de la tarea</small>
                                </div>
                                <button type="submit" class="btn btn-success">Cerrar Tarea</button>
                                <button type="button" class="btn btn-secondary" onclick="mostrarActividadesPorTarea()">Cancelar</button>
                                <div id="msgCerrarTarea" class="mt-3"></div>
                            </form>
                        </div>
                    `;
                    
                    document.getElementById('formCerrarTarea').onsubmit = function(e) {
                        e.preventDefault();
                        const calificacion = parseInt(document.getElementById('calificacion_tarea').value);
                        const observacion = document.getElementById('observacion_tarea').value.trim();
                        
                        if (calificacion < 0 || calificacion > 100) {
                            document.getElementById('msgCerrarTarea').innerHTML = 
                                '<div class="alert alert-danger">La calificación debe estar entre 0 y 100</div>';
                            return;
                        }
                        
                        if (!observacion) {
                            document.getElementById('msgCerrarTarea').innerHTML = 
                                '<div class="alert alert-danger">Debe proporcionar una observación</div>';
                            return;
                        }
                        
                        fetch('../admin/api/cerrar_tarea.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
                            body: JSON.stringify({ id: tareaId, calificacion, observacion })
                        })
                        .then(r => r.json())
                        .then(data => {
                            const msg = document.getElementById('msgCerrarTarea');
                            msg.innerHTML = `<div class="alert alert-${data.success ? 'success' : 'danger'}">${data.mensaje}</div>`;
                            if (data.success) {
                                setTimeout(() => mostrarActividadesPorTarea(), 1500);
                            }
                        })
                        .catch(() => {
                            document.getElementById('msgCerrarTarea').innerHTML = 
                                '<div class="alert alert-danger">Error al cerrar tarea</div>';
                        });
                    };
                });
        })
        .catch(() => alert('Error al cargar datos de la tarea'));
}// Agregar al final de script.js

// Funcion para mostrar dashboard de tareas por estado
async function verDashboardTareas() {
    try {
        // Obtener todas las tareas y actividades
        const [tareasResponse, actividadesResponse] = await Promise.all([
            fetch('../shared/api/obtener_tareas.php?t=' + Date.now(), {
                headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            }),
            fetch('../shared/api/obtener_actividades.php?t=' + Date.now(), {
                headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            })
        ]);
        
        const tareas = await tareasResponse.json();
        const actividades = await actividadesResponse.json();
        
        // Clasificar tareas por estado
        const noIniciadas = [];
        const enProceso = [];
        const completadas = [];
        const cerradas = [];
        
        tareas.forEach(tarea => {
            // Obtener actividades de esta tarea
            const actsTarea = actividades.filter(a => a.tarea_id == tarea.id);
            
            if (actsTarea.length === 0) {
                noIniciadas.push({ ...tarea, actividades: 0, motivo: 'Sin actividades asignadas' });
                return;
            }
            
            // Si la tarea estÃ¡ cerrada oficialmente
            if (tarea.estado === 'CERRADA') {
                cerradas.push({ ...tarea, actividades: actsTarea.length });
                return;
            }
            
            // Contar estados de actividades
            const asignadas = actsTarea.filter(a => a.estado === 'asignada').length;
            const enDesarrollo = actsTarea.filter(a => a.estado === 'en_desarrollo').length;
            const finalizadas = actsTarea.filter(a => a.estado === 'finalizada').length;
            const actCerradas = actsTarea.filter(a => a.estado === 'cerrada').length;
            const total = actsTarea.length;
            
            // Clasificar
            if (asignadas === total) {
                noIniciadas.push({ ...tarea, actividades: total, motivo: 'Ninguna actividad iniciada' });
            } else if (actCerradas === total) {
                completadas.push({ ...tarea, actividades: total, cerradas: actCerradas });
            } else if (enDesarrollo > 0 || finalizadas > 0 || actCerradas > 0) {
                enProceso.push({ 
                    ...tarea, 
                    actividades: total, 
                    enDesarrollo, 
                    finalizadas, 
                    cerradas: actCerradas 
                });
            } else {
                noIniciadas.push({ ...tarea, actividades: total, motivo: 'Asignadas pero no iniciadas' });
            }
        });
        
        // Generar HTML
        let html = '<h3>  Dashboard de Tareas por Estado</h3>';
        html += '<div class="row">';
        
        // No Iniciadas
        html += `
            <div class="col-md-6 mb-4">
                <div class="card border-secondary">
                    <div class="card-header bg-secondary text-white">
                        <h5 class="mb-0"> Tareas No Iniciadas (${noIniciadas.length})</h5>
                    </div>
                    <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                        ${noIniciadas.length === 0 ? '<p class="text-muted">No hay tareas sin iniciar</p>' : ''}
                        ${noIniciadas.map(t => `
                            <div class="mb-3 p-2 border-start border-3 border-secondary">
                                <strong>${t.nombre}</strong>
                                <p class="small mb-1">${t.descripcion || 'Sin descripción'}</p>
                                <span class="badge bg-light text-dark">${t.actividades} actividades</span>
                                <span class="badge bg-secondary">${t.motivo}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // En Proceso
        html += `
            <div class="col-md-6 mb-4">
                <div class="card border-warning">
                    <div class="card-header bg-warning text-dark">
                        <h5 class="mb-0"> Tareas En Proceso (${enProceso.length})</h5>
                    </div>
                    <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                        ${enProceso.length === 0 ? '<p class="text-muted">No hay tareas en proceso</p>' : ''}
                        ${enProceso.map(t => `
                            <div class="mb-3 p-2 border-start border-3 border-warning">
                                <strong>${t.nombre}</strong>
                                <p class="small mb-1">${t.descripcion || 'Sin descripción'}</p>
                                <div class="small">
                                    <span class="badge bg-light text-dark">Total: ${t.actividades}</span>
                                    ${t.enDesarrollo > 0 ? `<span class="badge badge-en-desarrollo">En desarrollo: ${t.enDesarrollo}</span>` : ''}
                                    ${t.finalizadas > 0 ? `<span class="badge badge-finalizada">Finalizadas: ${t.finalizadas}</span>` : ''}
                                    ${t.cerradas > 0 ? `<span class="badge badge-cerrada">Cerradas: ${t.cerradas}</span>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Completadas (listas para cerrar)
        html += `
            <div class="col-md-6 mb-4">
                <div class="card border-success">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0"> Tareas Completadas (${completadas.length})</h5>
                        <small>Todas las actividades evaluadas, listas para cerrar</small>
                    </div>
                    <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                        ${completadas.length === 0 ? '<p class="text-muted">No hay tareas completadas pendientes de cierre</p>' : ''}
                        ${completadas.map(t => `
                            <div class="mb-3 p-2 border-start border-3 border-success">
                                <strong>${t.nombre}</strong>
                                <p class="small mb-1">${t.descripcion || 'Sin descripción'}</p>
                                <span class="badge bg-success">${t.cerradas}/${t.actividades} actividades completadas</span>
                                <button class="btn btn-sm btn-success ms-2" onclick="cerrarTarea(${t.id})">Cerrar Tarea</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Cerradas
        html += `
            <div class="col-md-6 mb-4">
                <div class="card border-primary">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"> Tareas Cerradas (${cerradas.length})</h5>
                    </div>
                    <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                        ${cerradas.length === 0 ? '<p class="text-muted">No hay tareas cerradas</p>' : ''}
                        ${cerradas.map(t => `
                            <div class="mb-3 p-2 border-start border-3 border-primary">
                                <strong>${t.nombre}</strong>
                                <p class="small mb-1">${t.descripcion || 'Sin descripción'}</p>
                                <div class="small">
                                    <span class="badge bg-light text-dark">${t.actividades} actividades</span>
                                    ${t.calificacion ? `<span class="badge ${t.calificacion >= 70 ? 'bg-success' : (t.calificacion >= 50 ? 'bg-warning text-dark' : 'bg-danger')}">Calificación: ${t.calificacion}/100</span>` : ''}
                                    ${t.fecha_finalizacion ? `<br><small class="text-muted">Cerrada: ${t.fecha_finalizacion}</small>` : ''}
                                </div>
                                <button class="btn btn-sm btn-outline-primary mt-2" onclick="toggleEmpleadosInvolucrados(${t.id})">
                                    <i class="bi bi-people"></i> Ver empleados involucrados
                                </button>
                                <div id="empleados-tarea-${t.id}" style="display: none;" class="mt-2"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        html += '</div>';
        
        document.getElementById('contenido-dinamico').innerHTML = html;
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('contenido-dinamico').innerHTML = 
            '<div class="alert alert-danger">Error al cargar el dashboard de tareas</div>';
    }
}
// Función principal para cambiar y guardar el tema
const switchTheme = (theme) => {
    // 1. Aplicar el tema al elemento raíz (<html>)
    document.documentElement.setAttribute('data-bs-theme', theme);

    // 2. Guardar la preferencia en el navegador
    localStorage.setItem('theme', theme);
    
    // 3. Actualizar el ícono y el texto del botón
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');

    if (theme === 'dark') {
        icon.setAttribute('class', 'bi bi-sun-fill');
        icon.setAttribute('aria-label', 'Modo Claro');
        text.textContent = 'Modo Claro';
    } else {
        icon.setAttribute('class', 'bi bi-moon-fill');
        icon.setAttribute('aria-label', 'Modo Oscuro');
        text.textContent = 'Modo Oscuro';
    }
}

// 4. Lógica de inicio para cargar el tema guardado
document.addEventListener('DOMContentLoaded', () => {
    // Obtener la preferencia guardada o usar el tema por defecto ('light')
    const savedTheme = localStorage.getItem('theme') || 'light';
    switchTheme(savedTheme);

    // 5. Agregar el evento click al botón
    const toggleButton = document.getElementById('theme-toggle');
    toggleButton.addEventListener('click', () => {
        // Leer el tema actual para alternar
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        switchTheme(newTheme);
    });
});
// ================================================================
// CONSTANCIAS DE TRABAJO
// ================================================================

// Constancia Resumida
function verConstanciaResumida() {
    fetch('../empleado/api/obtener_constancia_resumida.php')
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert('Error al cargar constancia');
                return;
            }
            
            const emp = data.empleado;
            const est = data.estadisticas;
            const dist = data.distribucion;
            
            const html = `
                <div class="constancia-container">
                    <div class="no-print mb-3">
                        <button onclick="window.print()" class="btn btn-primary">
                            <i class="bi bi-printer"></i> Imprimir Constancia
                        </button>
                        <button onclick="verMisActividades()" class="btn btn-secondary">
                            <i class="bi bi-arrow-left"></i> Volver
                        </button>
                    </div>
                    
                    <div class="constancia-content card p-5">
                        <div class="text-center mb-5">
                            <h2 class="fw-bold">CONSTANCIA DE TRABAJO</h2>
                            <p class="text-muted">Sistema de Gestión Editorial</p>
                        </div>
                        
                        <div class="mb-4">
                            <h5 class="border-bottom pb-2">DATOS DEL EMPLEADO</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Nombre:</strong> ${emp.nombre} ${emp.apellido}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Email:</strong> ${emp.email}</p>
                                </div>
                            </div>
                            <p><strong>Fecha de emisión:</strong> ${new Date().toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                        </div>
                        
                        <div class="mb-4">
                            <h5 class="border-bottom pb-2">RESUMEN DE ACTIVIDADES</h5>
                            <div class="row text-center">
                                <div class="col-md-3">
                                    <div class="p-3 bg-light rounded">
                                        <h3 class="text-primary">${est.total_actividades || 0}</h3>
                                        <p class="mb-0 small">Actividades Completadas</p>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="p-3 bg-light rounded">
                                        <h3 class="text-success">${parseFloat(est.tiempo_total || 0).toFixed(1)} hrs</h3>
                                        <p class="mb-0 small">Tiempo Trabajado</p>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="p-3 bg-light rounded">
                                        <h3 class="text-info">${parseFloat(est.calificacion_promedio || 0).toFixed(1)}/100</h3>
                                        <p class="mb-0 small">Calificación Promedio</p>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="p-3 bg-light rounded">
                                        <h3 class="text-warning">${dist.excelente || 0}</h3>
                                        <p class="mb-0 small">Calificaciones Excelentes (90+)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <h5 class="border-bottom pb-2">DISTRIBUCIÓN DE CALIFICACIONES</h5>
                            <div class="row">
                                <div class="col-md-3 text-center">
                                    <p class="mb-1"><span class="badge bg-success">Excelente (90-100)</span></p>
                                    <h4>${dist.excelente || 0}</h4>
                                </div>
                                <div class="col-md-3 text-center">
                                    <p class="mb-1"><span class="badge bg-primary">Bueno (70-89)</span></p>
                                    <h4>${dist.bueno || 0}</h4>
                                </div>
                                <div class="col-md-3 text-center">
                                    <p class="mb-1"><span class="badge bg-warning">Regular (50-69)</span></p>
                                    <h4>${dist.regular || 0}</h4>
                                </div>
                                <div class="col-md-3 text-center">
                                    <p class="mb-1"><span class="badge bg-danger">Deficiente (<50)</span></p>
                                    <h4>${dist.deficiente || 0}</h4>
                                </div>
                            </div>
                        </div>
                        
                        ${est.primera_actividad ? `
                        <div class="mb-4">
                            <h5 class="border-bottom pb-2">PERÍODO DE TRABAJO</h5>
                            <p><strong>Primera actividad:</strong> ${new Date(est.primera_actividad).toLocaleDateString('es-ES')}</p>
                            <p><strong>Última actividad:</strong> ${new Date(est.ultima_actividad).toLocaleDateString('es-ES')}</p>
                        </div>
                        ` : ''}
                        
                        <div class="mt-5 text-center">
                            <p class="text-muted small">Este documento certifica el trabajo realizado por el empleado en el Sistema de Gestión Editorial.</p>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('contenido-dinamico').innerHTML = html;
        })
        .catch(() => {
            alert('Error de conexión al obtener constancia');
        });
}

// Constancia Detallada
function verConstanciaDetallada() {
    fetch('../empleado/api/obtener_constancia_detallada.php')
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert('Error al cargar constancia detallada');
                return;
            }
            
            const emp = data.empleado;
            const actividades = data.actividades;
            
            // Agrupar por tarea
            const tareas = {};
            actividades.forEach(act => {
                if (!tareas[act.tarea_id]) {
                    tareas[act.tarea_id] = {
                        nombre: act.tarea_nombre,
                        descripcion: act.tarea_descripcion,
                        actividades: []
                    };
                }
                tareas[act.tarea_id].actividades.push(act);
            });
            
            let tareasHTML = '';
            Object.keys(tareas).forEach(tareaId => {
                const tarea = tareas[tareaId];
                const totalTiempo = tarea.actividades.reduce((sum, a) => sum + parseFloat(a.tiempo_real || 0), 0);
                const promedioCalif = tarea.actividades.reduce((sum, a) => sum + parseFloat(a.calificacion || 0), 0) / tarea.actividades.length;
                
                tareasHTML += `
                    <div class="mb-4 border-bottom pb-3">
                        <h5 class="text-primary"><i class="bi bi-folder"></i> ${tarea.nombre}</h5>
                        <p class="text-muted small">${tarea.descripcion}</p>
                        <p class="mb-2"><strong>Total actividades:</strong> ${tarea.actividades.length} | <strong>Tiempo total:</strong> ${totalTiempo.toFixed(1)} hrs | <strong>Promedio:</strong> ${promedioCalif.toFixed(1)}/100</p>
                        
                        <table class="table table-sm table-bordered">
                            <thead class="table-light">
                                <tr>
                                    <th>Actividad</th>
                                    <th>Inicio</th>
                                    <th>Fin</th>
                                    <th>T. Estimado</th>
                                    <th>T. Real</th>
                                    <th>Calificacion</th>
                                    <th>Observacion</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tarea.actividades.map(act => `
                                    <tr>
                                        <td><strong>${act.nombre}</strong><br><small class="text-muted">${act.descripcion || 'Sin descripcion'}</small></td>
                                        <td>${new Date(act.fecha_inicio).toLocaleDateString('es-ES')}</td>
                                        <td>${new Date(act.fecha_finalizacion).toLocaleDateString('es-ES')}</td>
                                        <td>${act.tiempo_estimado} hrs</td>
                                        <td>${act.tiempo_real} hrs</td>
                                        <td><span class="badge ${act.calificacion >= 70 ? 'bg-success' : act.calificacion >= 50 ? 'bg-warning' : 'bg-danger'}">${act.calificacion}/100</span></td>
                                        <td>${act.observacion || 'N/A'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            });
            
            const html = `
                <div class="constancia-container">
                    <div class="no-print mb-3">
                        <button onclick="window.print()" class="btn btn-primary">
                            <i class="bi bi-printer"></i> Imprimir Constancia Detallada
                        </button>
                        <button onclick="verMisActividades()" class="btn btn-secondary">
                            <i class="bi bi-arrow-left"></i> Volver
                        </button>
                    </div>
                    
                    <div class="constancia-content card p-5">
                        <div class="text-center mb-5">
                            <h2 class="fw-bold">CONSTANCIA DETALLADA DE TRABAJO</h2>
                            <p class="text-muted">Sistema de Gestion Editorial</p>
                        </div>
                        
                        <div class="mb-4">
                            <h5 class="border-bottom pb-2">DATOS DEL EMPLEADO</h5>
                            <p><strong>Nombre:</strong> ${emp.nombre} ${emp.apellido}</p>
                            <p><strong>Email:</strong> ${emp.email}</p>
                            <p><strong>Fecha de emision:</strong> ${new Date().toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                        </div>
                        
                        <div class="mb-4">
                            <h5 class="border-bottom pb-2">DETALLE DE ACTIVIDADES POR TAREA</h5>
                            ${tareasHTML || '<p class="text-muted">No hay actividades completadas</p>'}
                        </div>
                        
                        <div class="mt-5 text-center">
                            <p class="text-muted small">Este documento detalla todas las actividades completadas por el empleado en el Sistema de Gestion Editorial.</p>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('contenido-dinamico').innerHTML = html;
        })
        .catch(() => {
            alert('Error de conexiÃ³n al obtener constancia detallada');
        });
}

// ================================================================
// EMPLEADOS PENDIENTES (AUTO-REGISTRO)
// ================================================================

function verEmpleadosPendientes() {
    fetch('../admin/api/obtener_empleados_pendientes.php')
        .then(res => res.json())
        .then(empleados => {
            let html = `
                <h3 class="mb-4">Empleados Pendientes de ActivaciÃ³n</h3>
                <p class="text-muted">Estos empleados se registraron y estÃ¡n esperando tu aprobaciÃ³n</p>
            `;
            
            if (empleados.length === 0) {
                html += '<div class="alert alert-info">No hay empleados pendientes de activaciÃ³n</div>';
            } else {
                html += `
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Fecha de Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                empleados.forEach(emp => {
                    const fechaRegistro = emp.fecha_creacion ? new Date(emp.fecha_creacion).toLocaleDateString('es-ES') : 'N/A';
                    html += `
                        <tr>
                            <td>${emp.nombre} ${emp.apellido}</td>
                            <td>${emp.email}</td>
                            <td>${fechaRegistro}</td>
                            <td>
                                <button class="btn btn-success btn-sm" onclick="activarEmpleado(${emp.id})">
                                    <i class="bi bi-check-circle"></i> Activar
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="rechazarEmpleado(${emp.id})">
                                    <i class="bi bi-x-circle"></i> Rechazar
                                </button>
                            </td>
                        </tr>
                    `;
                });
                
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            }
            
            document.getElementById('contenido-dinamico').innerHTML = html;
        })
        .catch(() => {
            document.getElementById('contenido-dinamico').innerHTML = 
                '<div class="alert alert-danger">Error al cargar empleados pendientes</div>';
        });
}

function rechazarEmpleado(id) {
    if (!confirm('Â¿Seguro que deseas rechazar este empleado? Se eliminarÃ¡ permanentemente.')) return;
    
    fetch('../admin/api/eliminar_empleado.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(resp => {
        alert(resp.message);
        if (resp.success) verEmpleadosPendientes();
    })
    .catch(() => alert('Error al rechazar empleado'));
}

// FunciÃ³n para mostrar/ocultar empleados involucrados en una tarea
async function toggleEmpleadosInvolucrados(tareaId) {
    const container = document.getElementById(`empleados-tarea-${tareaId}`);
    
    // Si ya estÃ¡ visible, solo ocultarlo
    if (container.style.display !== 'none') {
        container.style.display = 'none';
        return;
    }
    
    // Si estÃ¡ oculto y vacÃ­o, cargar los datos
    if (container.innerHTML === '') {
        try {
            const response = await fetch(`../shared/api/obtener_empleados_tarea.php?tarea_id=${tareaId}`);
            const data = await response.json();
            
            if (data.success) {
                if (data.empleados.length === 0) {
                    container.innerHTML = '<p class="text-muted small mt-2">No hay empleados registrados en esta tarea</p>';
                } else {
                    let html = `
                        <div class="table-responsive mt-2">
                            <table class="table table-sm table-bordered">
                                <thead class="table-light">
                                    <tr>
                                        <th>Empleado</th>
                                        <th>Email</th>
                                        <th>Actividades</th>
                                        <th>Promedio</th>
                                        <th>Tiempo Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `;
                    
                    data.empleados.forEach(emp => {
                        const promedio = parseFloat(emp.promedio_calificacion || 0).toFixed(1);
                        const badgeClass = promedio >= 70 ? 'bg-success' : (promedio >= 50 ? 'bg-warning text-dark' : 'bg-danger');
                        
                        html += `
                            <tr>
                                <td>${emp.nombre} ${emp.apellido}</td>
                                <td class="small">${emp.email}</td>
                                <td class="text-center">${emp.total_actividades}</td>
                                <td class="text-center">
                                    <span class="badge ${badgeClass}">${promedio}</span>
                                </td>
                                <td class="text-center">${emp.tiempo_total || 0}h</td>
                            </tr>
                        `;
                    });
                    
                    html += `
                                </tbody>
                            </table>
                        </div>
                    `;
                    
                    container.innerHTML = html;
                }
            } else {
                container.innerHTML = `<div class="alert alert-warning small mt-2">${data.error || 'Error al cargar empleados'}</div>`;
            }
        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = '<div class="alert alert-danger small mt-2">Error al cargar los empleados</div>';
        }
    }
    
    // Mostrar el contenedor
    container.style.display = 'block';
}
