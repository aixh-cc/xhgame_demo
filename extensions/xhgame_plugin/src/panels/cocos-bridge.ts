
import { IGetGroupComponentListRes, IInstallRes, IUninstallRes } from '@aixh-cc/xhgame_builder';
import { apiService } from './api-service';

class CocosEditorBridge {

    private isDevMode: boolean = false;

    constructor() {
        this.isDevMode = import.meta.env.DEV || !(window as any).Editor;
    }

    async requestMessage(target: string, method: string, args?: any): Promise<any> {
        if (this.isDevMode) {
            return apiService.nodejsMessage(target, method, args)
        }
        if ((window as any).Editor && (window as any).Editor.Message) {
            return (window as any).Editor.Message.request(target, method, args);
        }
        throw new Error('Editor API not available');
    }

    async getVersion(): Promise<{ success: boolean, version: string }> {
        return this.requestMessage('xhgame_plugin', 'get-version');
    }
    async getPackages(plugin: string, group: string): Promise<IGetGroupComponentListRes> {
        return this.requestMessage('xhgame_plugin', 'get-packages', { group, plugin });
    }
    async installComponent(plugin: string, group: string, componentCode: string): Promise<IInstallRes> {
        return this.requestMessage('xhgame_plugin', 'install-component', { group, plugin, componentCode });
    }
    async uninstallComponent(plugin: string, group: string, componentCode: string): Promise<IUninstallRes> {
        try {
            const result = await this.requestMessage('xhgame_plugin', 'uninstall-component', { group, plugin, componentCode });
            console.log(`🎮 [CocosEditorBridge] Uninstalled component:`, result);
            return result;
        } catch (error) {
            console.error('❌ [CocosEditorBridge] Failed to uninstall component:', error);
            throw error;
        }
    }
    async rollbackComponent(param: { componentCode: string, group: string }): Promise<any> {
        try {
            const result = await this.requestMessage('xhgame_plugin', 'rollback-component', param);
            return result;
        } catch (error) {
            throw error;
        }
    }

}

// 创建全局实例
export const cocosEditorBridge = new CocosEditorBridge();

// 导出类型和实例
export default cocosEditorBridge;
