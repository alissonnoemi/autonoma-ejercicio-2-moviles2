import React, { useState, useEffect } from 'react';
import {View,Text,FlatList,TouchableOpacity,StyleSheet,Alert,TextInput,} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/Config';
import { ServicioTareas } from '../services/ServicioTareas';

export default function PantallaInicio({ navigation }: any) {
    const [tareas, setTareas] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState<'all' | 'completed' | 'pending'>('all');
    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    useEffect(() => {
        const usuario = auth.currentUser;
        if (!usuario) {
            navigation.navigate('Login');
            return;
        }

        // Cargar tareas del usuario
        let desuscribir: (() => void) | null = null;
        let componenteMontado = true;
        
        const cargarTareas = () => {
            try {
                desuscribir = ServicioTareas.escucharTareasDelUsuario(usuario.uid, (listaTareas) => {
                    if (componenteMontado) {
                        setTareas(listaTareas);
                        setCargando(false);
                    }
                });
            } catch (error) {
                console.error('Error al cargar tareas:', error);
                if (componenteMontado) {
                    setCargando(false);
                    setTareas([]);
                }
            }
        };

        cargarTareas();

        return () => {
            componenteMontado = false;
            if (desuscribir) {
                try {
                    desuscribir();
                } catch (error) {
                    console.error('Error al desuscribir:', error);
                }
            }
        };
    }, []);

    const manejarCerrarSesion = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Login');
        } catch (error) {
        }
    };

    const buscarTareaPorId = () => {
        Alert.prompt(
            'Buscar Tarea',
            'Ingresa el ID de la tarea:',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Buscar',
                    onPress: async (idTarea) => {
                        if (idTarea) {
                            try {
                                await ServicioTareas.buscarTareaPorId(idTarea);
                            } catch (error) {
                                Alert.alert('Error', 'No se pudo buscar la tarea');
                            }
                        }
                    }
                }
            ]
        );
    };

    // Filtrar tareas
    const tareasFiltradas = tareas.filter(tarea => {
        const coincideBusqueda = tarea.title.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
            (tarea.description?.toLowerCase().includes(terminoBusqueda.toLowerCase()) || false);

        switch (filtro) {
            case 'completed':
                return tarea.completed && coincideBusqueda;
            case 'pending':
                return !tarea.completed && coincideBusqueda;
            default:
                return coincideBusqueda;
        }
    });

    // Estadísticas
    const tareasCompletadas = tareas.filter(tarea => tarea.completed).length;
    const tareasPendientes = tareas.filter(tarea => !tarea.completed).length;

    const cambiarEstadoTarea = async (idTarea: string) => {
        try {
            const tarea = tareas.find(t => t.id === idTarea);
            if (tarea) {
                await ServicioTareas.actualizarTarea(idTarea, {
                    completed: !tarea.completed,
                });
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la tarea');
        }
    };

    const eliminarTarea = async (idTarea: string) => {
        Alert.alert(
            'Eliminar Tarea',
            '¿Estás seguro?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ServicioTareas.eliminarTarea(idTarea);
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la tarea');
                        }
                    }
                }
            ]
        );
    };

    const renderizarTarea = ({ item }: { item: any }) => (
        <View style={styles.taskItem}>
            <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, item.completed && styles.completedTask]}>
                    {item.title}
                </Text>
                {item.description && (
                    <Text style={styles.taskDescription}>{item.description}</Text>
                )}
            </View>
            <View style={styles.taskActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={() => cambiarEstadoTarea(item.id)}
                >
                    <Text style={styles.actionButtonText}>
                        {item.completed ? 'Pendiente' : 'Completar'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('DetalleTarea', { task: item })}
                >
                    <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => eliminarTarea(item.id)}
                >
                    <Text style={styles.actionButtonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Tareas</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={buscarTareaPorId}
                    >
                        <Text style={styles.searchButtonText}>Buscar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={manejarCerrarSesion}
                    >
                        <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {cargando ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Cargando tareas...</Text>
                </View>
            ) : (
                <>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar tareas..."
                        value={terminoBusqueda}
                        onChangeText={setTerminoBusqueda}
                    />
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{tareas.length}</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{tareasPendientes}</Text>
                            <Text style={styles.statLabel}>Pendientes</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{tareasCompletadas}</Text>
                            <Text style={styles.statLabel}>Completadas</Text>
                        </View>
                    </View>
                    <View style={styles.filtersContainer}>
                        <TouchableOpacity
                            style={[styles.filterButton, filtro === 'all' && styles.activeFilter]}
                            onPress={() => setFiltro('all')}
                        >
                            <Text style={[styles.filterText, filtro === 'all' && styles.activeFilterText]}>
                                Todas
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterButton, filtro === 'pending' && styles.activeFilter]}
                            onPress={() => setFiltro('pending')}
                        >
                            <Text style={[styles.filterText, filtro === 'pending' && styles.activeFilterText]}>
                                Pendientes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterButton, filtro === 'completed' && styles.activeFilter]}
                            onPress={() => setFiltro('completed')}
                        >
                            <Text style={[styles.filterText, filtro === 'completed' && styles.activeFilterText]}>
                                Completadas
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={tareasFiltradas}
                        renderItem={renderizarTarea}
                        keyExtractor={item => item.id}
                        style={styles.taskList}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No hay tareas para mostrar</Text>
                        }
                    />

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('DetalleTarea')}
                    >
                        <Text style={styles.addButtonText}>+ Nueva Tarea</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    searchButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    logoutText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    searchInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    statCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    activeFilter: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    filterText: {
        color: '#666',
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#fff',
    },
    taskList: {
        flex: 1,
    },
    taskItem: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    taskContent: {
        marginBottom: 12,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    completedTask: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    taskDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    taskActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    completeButton: {
        backgroundColor: '#4CAF50',
    },
    editButton: {
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#ff4444',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 40,
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
