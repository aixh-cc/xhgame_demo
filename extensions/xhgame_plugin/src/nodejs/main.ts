import express from 'express';
import cors from 'cors';
import { name } from '../../package.json' with { type: 'json' };
import { getCocosVersion, LocalInstallManager, getPackagesPath, BackupManager, getCocosProjectName } from '@aixh-cc/xhgame_builder';


const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// 获取版本
app.post('/api/get-version', async (req, res) => {
    res.json({
        success: true,
        version: await getCocosVersion()
    });
});
// 获取组件列表
app.post('/api/get-packages', async (req, res) => {
    const localInstallManager = new LocalInstallManager(req.body.plugin)
    res.json(await localInstallManager.getGroupComponentList(req.body.group));
});
// 安装组件
app.post('/api/install-component', async (req, res) => {
    console.log('req.body.plugin', req.body.plugin)
    const localInstallManager = new LocalInstallManager(req.body.plugin)
    res.json(await localInstallManager.installComponent(req.body.group, req.body.componentCode));
});
// 卸载组件
app.post('/api/uninstall-component', async (req, res) => {
    const localInstallManager = new LocalInstallManager(req.body.plugin)
    res.json(await localInstallManager.uninstallComponent(req.body.group, req.body.componentCode));
});
// 回滚组件
app.post('/api/rollback-component', async (req, res) => {
    const projectName = await getCocosProjectName()
    const backupManager = new BackupManager(req.body.plugin, projectName)
    res.json(await backupManager.rollback(req.body.group, req.body.componentCode));
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'xhgame_nodejs_service'
    });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// 启动服务器
app.listen(PORT, () => {
    const workingDir = process.env.PWD || process.cwd();
    console.log(`🚀 XHGame Builder Node.js Service running on http://localhost:${PORT}`);
    console.log(`📁 Working directory: ${workingDir}`);
    console.log(`📦 Packages directory: ${getPackagesPath(name)}`);
});

export default app;
