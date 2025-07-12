import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,ScrollView,KeyboardAvoidingView,Platform,
} from 'react-native';
import { auth } from '../firebase/Config';
import { ServicioTareas } from '../services/ServicioTareas';

export default function DetalleTareaScreen({ navigation, route }: any) {
    const { task } = route.params || {};
    const isEditing = Boolean(task);
    const user = auth.currentUser;

    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium');

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'El título es requerido');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'Usuario no autenticado');
            return;
        }

        try {
            if (isEditing && task) {
                await ServicioTareas.actualizarTarea(task.id, {
                    title: title.trim(),
                    description: description.trim(),
                    priority,
                });
            } else {
                await ServicioTareas.crearTareaConAlerta(user.uid, {
                    title: title.trim(),
                    description: description.trim(),
                    priority,
                });
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar la tarea');
        }
    };

    const handleDelete = async () => {
        if (!task) return;

        Alert.alert(
            'Eliminar Tarea',
            '¿Seguro que deseas eliminar esta tarea?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ServicioTareas.eliminarTarea(task.id);
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la tarea');
                        }
                    },
                },
            ]
        );
    };

    const getPriorityColor = (priorityLevel: 'low' | 'medium' | 'high') => {
        switch (priorityLevel) {
            case 'high': return '#FF3B30';
            case 'medium': return '#FF9500';
            case 'low': return '#34C759';
            default: return '#007AFF';
        }
    };

    const getPriorityLabel = (priorityLevel: 'low' | 'medium' | 'high') => {
        switch (priorityLevel) {
            case 'high': return 'Alta';
            case 'medium': return 'Media';
            case 'low': return 'Baja';
            default: return 'Media';
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Volver</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Título *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ingresa el título de la tarea"
                            maxLength={100}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Ingresa una descripción opcional"
                            multiline
                            numberOfLines={4}
                            maxLength={500}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Prioridad</Text>
                        <View style={styles.priorityContainer}>
                            {(['low', 'medium', 'high'] as const).map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    style={[
                                        styles.priorityButton,
                                        { borderColor: getPriorityColor(level) },
                                        priority === level && { backgroundColor: getPriorityColor(level) }
                                    ]}
                                    onPress={() => setPriority(level)}
                                >
                                    <Text style={[
                                        styles.priorityButtonText,
                                        { color: priority === level ? '#fff' : getPriorityColor(level) }
                                    ]}>
                                        {getPriorityLabel(level)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {isEditing && task && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Estado</Text>
                            <View style={styles.statusContainer}>
                                <Text style={styles.statusText}>
                                    {task.completed ? 'Completada' : 'Pendiente'}
                                </Text>
                                <View style={[
                                    styles.statusIndicator,
                                    { backgroundColor: task.completed ? '#34C759' : '#FF9500' }
                                ]} />
                            </View>
                            <Text style={styles.dateText}>
                                Creada: {new Date(task.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    )}

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <Text style={styles.buttonText}>
                                {isEditing ? 'Actualizar' : 'Crear'} Tarea
                            </Text>
                        </TouchableOpacity>

                        {isEditing && (
                            <TouchableOpacity
                                style={[styles.button, styles.deleteButton]}
                                onPress={handleDelete}
                            >
                                <Text style={styles.buttonText}>Eliminar Tarea</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    backButton: {
        fontSize: 16,
        color: '#007AFF',
        marginRight: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    formContainer: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    priorityContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    priorityButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    priorityButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    statusText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    dateText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    buttonsContainer: {
        gap: 10,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});