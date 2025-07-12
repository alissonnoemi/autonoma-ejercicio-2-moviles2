# TaskHub - Gestión de Tareas en Tiempo Real

## Descripción
TaskHub es una aplicación móvil desarrollada con React Native y Expo que permite a los usuarios gestionar sus tareas personales con autenticación segura y sincronización en tiempo real usando Firebase.

## Características

### 🔐 Autenticación
- Registro de usuario con email y contraseña
- Inicio de sesión seguro
- Recuperación de contraseña
- Cierre de sesión
- Manejo de errores personalizado

### 📝 Gestión de Tareas
- **Crear tareas** con título, descripción y prioridad
- **Editar tareas** existentes
- **Marcar como completadas** o pendientes
- **Eliminar tareas** con confirmación
- **Sincronización en tiempo real** entre dispositivos
- **Filtrado** por estado (todas, completadas, pendientes)
- **Ordenamiento** por fecha o prioridad

### 🎨 Interfaz de Usuario
- Diseño moderno y responsive
- Indicadores de prioridad con colores
- Estadísticas de tareas en tiempo real
- Navegación intuitiva
- Componentes reutilizables

## Tecnologías Utilizadas

### Frontend
- **React Native** con Expo
- **TypeScript** para tipado estático
- **React Navigation** para navegación
- **React Context API** para manejo de estado

### Backend
- **Firebase Authentication** para autenticación
- **Firebase Realtime Database** para almacenamiento de datos
- **Sincronización en tiempo real** con Firebase

## Arquitectura

### Estructura del Proyecto
```
autonoma-ejercicio-2/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticación
├── firebase/
│   ├── Config.tsx               # Configuración de Firebase
│   └── components/
│       └── TaskItem.tsx         # Componente de tarea
├── Navigation/
│   └── MainNavigation.tsx       # Navegación principal
├── screen/
│   ├── LoginScreen.tsx          # Pantalla de login
│   ├── RegisterScreen.tsx       # Pantalla de registro
│   ├── HomeScreen.tsx           # Pantalla principal
│   └── TaskDetailScreen.tsx     # Pantalla de detalles
├── services/
│   └── TaskService.ts           # Servicio de tareas
├── types/
│   └── index.ts                 # Tipos TypeScript
├── App.tsx                      # Componente principal
└── package.json                 # Dependencias
```

### Patrones de Diseño
- **Context API** para manejo de estado global
- **Service Layer** para lógica de negocio
- **Component Composition** para reutilización
- **Hooks personalizados** para lógica compartida

## Estructura de Datos en Firebase

```json
{
  "users": {
    "userId": {
      "tasks": {
        "taskId": {
          "id": "taskId",
          "title": "Título de la tarea",
          "description": "Descripción opcional",
          "completed": false,
          "priority": "medium",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z",
          "userId": "userId"
        }
      }
    }
  }
}
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- Expo CLI
- Cuenta de Firebase

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [repository-url]
   cd autonoma-ejercicio-2
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Crear un proyecto en Firebase Console
   - Habilitar Authentication y Realtime Database
   - Copiar la configuración en `firebase/Config.tsx`

4. **Ejecutar la aplicación**
   ```bash
   npm start
   ```

## Uso de la Aplicación

### Registro e Inicio de Sesión
1. Abrir la aplicación
2. Registrarse con email y contraseña
3. Iniciar sesión con las credenciales creadas

### Gestión de Tareas
1. **Crear tarea**: Presionar el botón "+" flotante
2. **Editar tarea**: Tocar en cualquier tarea de la lista
3. **Completar tarea**: Usar el botón "Completar" en la tarea
4. **Eliminar tarea**: Usar el botón "Eliminar" con confirmación
5. **Filtrar tareas**: Usar los botones de filtro en la parte superior
6. **Ordenar tareas**: Cambiar entre ordenamiento por fecha o prioridad

### Navegación
- **Pantalla Principal**: Lista de tareas con estadísticas
- **Detalles de Tarea**: Crear/editar tareas individuales
- **Logout**: Cerrar sesión desde la pantalla principal

## Características Técnicas

### Seguridad
- Autenticación basada en Firebase
- Validación de datos en cliente y servidor
- Reglas de seguridad en Firebase Database

### Performance
- Suscripciones en tiempo real optimizadas
- Lazy loading de componentes
- Manejo eficiente de estado

### UX/UI
- Feedback visual inmediato
- Manejo de estados de carga
- Navegación fluida
- Diseño responsive

## Posibles Mejoras Futuras

### Funcionalidades
- [ ] Notificaciones push
- [ ] Sincronización offline
- [ ] Temas claro/oscuro
- [ ] Categorías de tareas
- [ ] Fechas de vencimiento
- [ ] Subtareas
- [ ] Compartir tareas

### Técnicas
- [ ] Tests unitarios
- [ ] CI/CD pipeline
- [ ] Optimización de bundle
- [ ] Métricas de rendimiento
- [ ] Logging avanzado

## Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para preguntas o sugerencias, contacta a: [tu-email@example.com]

---

**TaskHub** - Gestiona tus tareas de manera eficiente y en tiempo real 🚀
