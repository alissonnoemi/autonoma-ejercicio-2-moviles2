import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { Task } from '../types';
import { taskService } from '../services/TaskService';

interface TaskItemProps {
    task: Task;
    onTaskPress: (task: Task) => void;
    userId: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskPress, userId }) => {
    const handleToggleComplete = async () => {
        try {
            await taskService.updateTask(userId, task.id, { completed: !task.completed });
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la tarea');
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'alta': return '#FF3B30';
            case 'media': return '#FF9500';
            case 'baja': return '#34C759';
            default: return '#007AFF';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high': return 'Alta';
            case 'medium': return 'Media';
            case 'low': return 'Baja';
            default: return 'Media';
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onTaskPress(task)}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, task.completed && styles.completedTitle]}>
                        {task.title}
                    </Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                        <Text style={styles.priorityText}>{getPriorityLabel(task.priority)}</Text>
                    </View>
                </View>

                {task.description && (
                    <Text style={[styles.description, task.completed && styles.completedDescription]}>
                        {task.description}
                    </Text>
                )}

                <View style={styles.footer}>
                    <Text style={styles.date}>
                        {new Date(task.createdAt).toLocaleDateString()}
                    </Text>
                    <TouchableOpacity
                        style={[styles.statusButton, task.completed && styles.completedButton]}
                        onPress={handleToggleComplete}
                    >
                        <Text style={[styles.statusText, task.completed && styles.completedText]}>
                            {task.completed ? 'Completada' : 'Pendiente'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    completedDescription: {
        color: '#999',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    statusButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    completedButton: {
        backgroundColor: '#e8f5e8',
        borderColor: '#34C759',
    },
    statusText: {
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
    },
    completedText: {
        color: '#34C759',
    },
});
