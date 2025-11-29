import axios, { type AxiosInstance } from 'axios'

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<PaginatedResponse<T>> {
    const response = await this.client.get(endpoint, { params })
    return response.data
  }

  async getById<T>(endpoint: string, id: string): Promise<T> {
    const response = await this.client.get(`${endpoint}/${id}`)
    return response.data
  }

  async post<T>(endpoint: string, data: Partial<T>): Promise<T> {
    const response = await this.client.post(endpoint, data)
    return response.data
  }

  async put<T>(endpoint: string, id: string, data: Partial<T>): Promise<T> {
    const response = await this.client.put(`${endpoint}/${id}`, data)
    return response.data
  }

  async delete(endpoint: string, id: string): Promise<void> {
    await this.client.delete(`${endpoint}/${id}`)
  }
}

export const apiClient = new ApiClient()
