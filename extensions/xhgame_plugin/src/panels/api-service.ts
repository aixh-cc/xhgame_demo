/**
 * API 服务模块
 * 用于调用后端 Node.js 服务 (xhgame_nodejs_service)
 */

const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

class ApiService {
    private async request<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || `HTTP ${response.status}`,
                    message: data.message
                };
            }

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('API request failed:', error);
            return {
                success: false,
                error: 'Network error',
                message: error instanceof Error ? error.message : String(error)
            };
        }
    }
    async nodejsMessage(target: string, method: string, args: any): Promise<any> {
        // let param = { ...args, pluginName: target } as any
        let options = {
            method: 'POST', // 都为POST请求
            body: JSON.stringify(args)
        }
        console.log('options', options)
        let res = await this.request('/' + method, options);
        if (res.success == false) {
            console.error(res.error)
        }
        return res.data
    }
}

// 导出单例实例
export const apiService = new ApiService();

// 导出类型
export type { ApiResponse };