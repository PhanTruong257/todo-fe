import axios from 'axios';
import type { Todo, CreateTodoPayload, UpdateTodoPayload, TodoStats } from '../types/todo';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const api = {
  // Lấy danh sách todo / study reports
  async getTodos(params?: {
    search?: string;
    status?: 'all' | 'active' | 'completed';
    priority?: string;
    studentName?: string;
  }): Promise<Todo[]> {
    const response = await client.get<Todo[]>('/todos', { params });
    return response.data;
  },

  // Lấy thống kê
  async getStats(): Promise<TodoStats> {
    const response = await client.get<TodoStats>('/todos/stats');
    return response.data;
  },

  // Lấy danh sách người học
  async getStudents(): Promise<string[]> {
    try {
      const response = await client.get<string[]>('/todos/students');
      return response.data;
    } catch {
      return ['Trường', 'Nguyệt'];
    }
  },

  // Tạo mới todo
  async createTodo(payload: CreateTodoPayload): Promise<Todo> {
    const response = await client.post<Todo>('/todos', payload);
    return response.data;
  },

  // Cập nhật todo
  async updateTodo(id: string, payload: UpdateTodoPayload): Promise<Todo> {
    const response = await client.patch<Todo>(`/todos/${id}`, payload);
    return response.data;
  },

  // Đảo trạng thái hoàn thành
  async toggleTodo(id: string): Promise<Todo> {
    const response = await client.patch<Todo>(`/todos/${id}/toggle`);
    return response.data;
  },

  // Xóa todo
  async deleteTodo(id: string): Promise<{ message: string; id: string }> {
    const response = await client.delete<{ message: string; id: string }>(`/todos/${id}`);
    return response.data;
  },

  // Kiểm tra sức khỏe kết nối Backend
  async checkHealth(): Promise<boolean> {
    try {
      await client.get('/todos', { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  },
};
