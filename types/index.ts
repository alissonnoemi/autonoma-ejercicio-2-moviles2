export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Inicio: undefined;
  DetalleTarea: { task?: Task };
};
