# Sistema de Fotos de Perfil para Empleados

## 📋 Resumen
Sistema completo para gestionar fotos de perfil de empleados con avatares automáticos usando iniciales.

## ✅ Características Implementadas

### 1. **Avatares Automáticos con Iniciales**
- Genera círculos con iniciales del empleado automáticamente
- Colores de fondo aleatorios únicos
- Se usa cuando NO hay foto de perfil cargada
- URL: `https://ui-avatars.com/api/`

### 2. **Subida de Fotos Reales**
- Soporta: JPEG, PNG, GIF, WEBP
- Tamaño máximo: 5MB
- Las fotos se guardan en: `uploads/fotos_perfil/`
- Formato del archivo: `empleado_{ID}_{timestamp}.{ext}`

### 3. **Vista Previa en Tiempo Real**
- Al seleccionar una imagen, se muestra preview inmediato
- Foto circular de 120x120px en el formulario de edición
- Avatares pequeños (avatar-xs) en la tabla de empleados

## 🗂️ Archivos Creados/Modificados

### Nuevos archivos:
1. **`utils/agregar_campo_foto_perfil.sql`** - Script SQL para agregar el campo `foto_perfil` a la tabla
2. **`admin/api/subir_foto_perfil.php`** - Endpoint para subir fotos
3. **`uploads/fotos_perfil/`** - Carpeta donde se almacenan las imágenes

### Archivos modificados:
1. **`shared/assets/js/script.js`**:
   - `verEmpleados()` - Lista con avatares Material Dashboard
   - `editarEmpleado()` - Formulario con preview y upload de foto
   - `subirFotoPerfil()` - Nueva función para subir fotos

## 🚀 Instrucciones de Instalación

### Paso 1: Ejecutar el script SQL
Abre phpMyAdmin y ejecuta el contenido de `utils/agregar_campo_foto_perfil.sql`:

```sql
ALTER TABLE empleados 
ADD COLUMN foto_perfil VARCHAR(500) NULL AFTER estado;
```

### Paso 2: Verificar permisos de carpeta
Asegúrate de que la carpeta `uploads/fotos_perfil/` tenga permisos de escritura:

```powershell
# En Windows/XAMPP normalmente no hay problema,
# pero verifica que Apache pueda escribir ahí
```

### Paso 3: Probar el sistema
1. Ve a "Ver Empleados" en el panel de admin
2. Haz clic en "✏️ Editar" de cualquier empleado
3. Selecciona una imagen
4. Haz clic en "📷 Subir Foto"

## 🎨 Personalización de Avatares

### Cambiar tamaño del avatar en la tabla:
```javascript
// En verEmpleados(), línea del avatar:
class="avatar avatar-xs"  // Extra pequeño (actual)
class="avatar avatar-sm"  // Pequeño
class="avatar"            // Mediano
class="avatar avatar-lg"  // Grande
```

### Cambiar colores de fondo de avatares automáticos:
```javascript
// En la URL del avatar, cambia 'random' por un color hex:
background=random    // Aleatorio (actual)
background=0D8ABC    // Azul específico
background=7F5AF0    // Púrpura
```

### Cambiar tamaño de resolución del avatar:
```javascript
size=64   // Actual (suficiente para avatar-xs)
size=128  // Mayor calidad
```

## 🔒 Seguridad

✅ **Validaciones implementadas:**
- Solo imágenes permitidas (JPEG, PNG, GIF, WEBP)
- Tamaño máximo de 5MB
- Nombres únicos con timestamp
- Sesión requerida para subir
- SQL preparado con bind_param

## 📝 Notas Técnicas

- **Prioridad de foto:** Si `foto_perfil` tiene valor → usa esa ruta, si NO → genera avatar con iniciales
- **Ruta relativa en BD:** `uploads/fotos_perfil/empleado_X_timestamp.ext`
- **Preview:** Usa FileReader API para mostrar imagen antes de subir
- **FormData:** Usado para enviar archivos multipart/form-data

## 🐛 Troubleshooting

**Problema:** "Error al subir el archivo"
- Verifica que existe la carpeta `uploads/fotos_perfil/`
- Revisa permisos de escritura en Windows

**Problema:** No se ve la foto después de subir
- Verifica que el campo `foto_perfil` existe en la tabla
- Comprueba que el archivo se guardó en `uploads/fotos_perfil/`
- Refresca la lista de empleados (botón "Ver Empleados")

**Problema:** Avatar no muestra iniciales correctas
- Verifica que `emp.nombre` y `emp.apellido` tengan valores
- Revisa la URL generada en la consola del navegador

## 📚 Próximos Pasos (Opcional)

- [ ] Redimensionar imágenes al subirlas (evitar archivos gigantes)
- [ ] Eliminar foto anterior al subir una nueva
- [ ] Permitir recortar/rotar imagen antes de subir
- [ ] Comprimir imágenes automáticamente
- [ ] Vista de galería de empleados con fotos grandes
