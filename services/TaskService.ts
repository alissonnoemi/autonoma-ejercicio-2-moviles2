import { ref, push, set, remove, onValue, update } from 'firebase/database';
import { db } from '../firebase/Config';
import { Task } from '../types';

export class TaskService {
  private getUserTasksRef(userId: string) {
    return ref(db, `users/${userId}/tasks`);
  }

  async createTask(userId: string, taskData: Omit<Task, 'id'>): Promise<string> {
    const tasksRef = this.getUserTasksRef(userId);
    const newTaskRef = push(tasksRef);
    
    const task: Task = {
      ...taskData,
      id: newTaskRef.key!,
      createdAt: new Date().toISOString(),
    };

    await set(newTaskRef, task);
    return newTaskRef.key!;
  }

  async updateTask(userId: string, taskId: string, updates: Partial<Task>): Promise<void> {
    const taskRef = ref(db, `users/${userId}/tasks/${taskId}`);
    await update(taskRef, updates);
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const taskRef = ref(db, `users/${userId}/tasks/${taskId}`);
    await remove(taskRef);
  }

  subscribeToTasks(userId: string, callback: (tasks: Task[]) => void): () => void {
    const tasksRef = this.getUserTasksRef(userId);
    
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      if (tasksData) {
        const tasks: Task[] = Object.values(tasksData);
        callback(tasks);
      } else {
        callback([]);
      }
    });

    return () => unsubscribe();
  }
}

export const taskService = new TaskService();
