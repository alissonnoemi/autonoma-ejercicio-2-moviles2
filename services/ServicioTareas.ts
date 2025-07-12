import { db } from '../firebase/Config';
import { ref, set, update, get, onValue, remove } from 'firebase/database';
import { Alert } from 'react-native';

export class ServicioTareas {
    //crear nueva tarea
    static async crearTarea(idUsuario: string, tarea: any) {
        const idTarea = Date.now().toString(); 
        const datosTarea = {
            title: tarea.title,
            description: tarea.description || '',
            priority: tarea.priority,
            userId: idUsuario
        };

        try {
            await set(ref(db, 'tareas/' + idTarea), datosTarea);
            console.log('Tarea creada:', datosTarea);
            return idTarea;
        } catch (error) {
            console.error('Error al crear tarea:', error);
            throw error;
        }
    }

    static async crearTareaConAlerta(idUsuario: string, tarea: any) {
        try {
            const idTarea = await this.crearTarea(idUsuario, tarea);
            Alert.alert("Éxito", `Tarea creada exitosamente!\nTítulo: ${tarea.title}\nPrioridad: ${tarea.priority}`);
            return idTarea;
        } catch (error) {
            console.error('Error al crear tarea:', error);
            throw error;
        }
    }

    // actualizar tarea
    static async actualizarTarea(idTarea: string, cambios: any) {
        try {
            await update(ref(db, 'tareas/' + idTarea), {
                ...cambios,
                fechaActualizacion: new Date().toISOString()
            });
            Alert.alert("Éxito", "Tarea actualizada exitosamente");
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            throw error;
        }
    }

    // obtener tarea
    static async obtenerTarea(idTarea: string) {
        try {
            const refTarea = ref(db, 'tareas/' + idTarea);
            const snapshot = await get(refTarea);
            
            if (snapshot.exists()) {
                const datos = snapshot.val();
                return datos;
            } else {
                Alert.alert("Error", "Tarea no encontrada");
                return null;
            }
        } catch (error) {
            console.error('Error al obtener tarea:', error);
            throw error;
        }
    }

    // eliminar tarea
    static async eliminarTarea(idTarea: string) {
        try {
            await remove(ref(db, 'tareas/' + idTarea));
            Alert.alert("Éxito", "Tarea eliminada exitosamente");
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
            throw error;
        }
    }

    // escuchar cambios en tiempo real
    static escucharTareasDelUsuario(idUsuario: string, callback: (tareas: any[]) => void) {
        const refTareas = ref(db, 'tareas');
        
        return onValue(refTareas, (snapshot) => {
            try {
                const datos = snapshot.val();
                const listaTareas: any[] = [];
                
                if (datos) {
                    Object.keys(datos).forEach(clave => {
                        const tarea = datos[clave];
                        if (tarea && tarea.userId === idUsuario) {
                            listaTareas.push({
                                id: clave,
                                ...tarea
                            });
                        }
                    });
                }
                callback(listaTareas);
            } catch (error) {
                console.error('Error procesando tareas:', error);
                callback([]);
            }
        }, (error) => {
            console.error('Error en escucharTareasDelUsuario:', error);
            callback([]);
        });
    }

    // buscar tarea por id
    static async buscarTareaPorId(idTarea: string) {
        try {
            const refTarea = ref(db, 'tareas/' + idTarea);
            const snapshot = await get(refTarea);
            
            if (snapshot.exists()) {
                const datos = snapshot.val();
                Alert.alert("Tarea Encontrada", 
                    `Título: ${datos.title}\nDescripción: ${datos.description}\nPrioridad: ${datos.priority}\nEstado: ${datos.completed ? 'Completada' : 'Pendiente'}`);
            } else {
                Alert.alert("Error", "Tarea no encontrada");
            }
        } catch (error) {
            console.error('Error al buscar tarea:', error);
            Alert.alert("Error", "No se pudo buscar la tarea");
        }
    }
}
