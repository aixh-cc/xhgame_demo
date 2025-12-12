import { name } from '../../package.json' with { type: 'json' };
import { LocalInstallManager, IUninstallRes, IInstallRes, IGetGroupComponentListRes, BackupManager, getCocosProjectName } from '@aixh-cc/xhgame_builder';

export const methods = {
    async open() {
        return Editor.Panel.open(name);
    },
    getVersion(): { success: boolean, version: string } {
        return {
            success: true,
            version: Editor.App.version
        };
    },
    async getPackages(param: any): Promise<IGetGroupComponentListRes> {
        const localInstallManager = new LocalInstallManager(param.plugin)
        return await localInstallManager.getGroupComponentList(param.group)
    },
    async installComponent(param: any): Promise<IInstallRes> {
        const localInstallManager = new LocalInstallManager(param.plugin)
        return await localInstallManager.installComponent(param.group, param.componentCode)
    },
    async uninstallComponent(param: any): Promise<IUninstallRes> {
        const localInstallManager = new LocalInstallManager(param.plugin)
        return await localInstallManager.uninstallComponent(param.group, param.componentCode)
    },
    async rollbackComponent(param: any): Promise<any> {
        const projectName = await getCocosProjectName()
        const backupManager = new BackupManager(param.plugin, projectName)
        return await backupManager.rollback(param.group, param.componentCode);
    }
};

export async function load() {
    // console.log(`load ${name}`);
}

export function unload() {
    // console.log(`unload ${name}`);
}
