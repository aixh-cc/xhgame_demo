import { cocosPanelConfig, cocosPanel } from '@cocos-fe/vite-plugin-cocos-panel';
import vue from '@vitejs/plugin-vue';
import { nodeExternals } from 'rollup-plugin-node-externals';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode, command }) => {
    /**
     *  注意事项:
     *  支持两种开发模式:
     *  1. vite serve: 启动开发服务器，支持热重载和实时预览
     *  2. vite build --mode development: 构建开发版本供编辑器读取
     */
    const isDev = mode === 'development';
    const isServe = command === 'serve';

    return {
        // 开发服务器配置
        server: isServe ? {
            port: 8080,
            host: '0.0.0.0', // 允许外部访问
            open: false,
            cors: true,
            hmr: {
                port: 8081,
            },
            // 允许的主机列表
            allowedHosts: [
                'localhost',
                '127.0.0.1',
                'www.abc.com',
                '.abc.com', // 允许所有 abc.com 的子域名
            ],
        } : undefined,

        // 构建配置
        build: isServe ? undefined : {
            lib: {
                entry: {
                    browser: './src/browser/index.ts',
                    panel: './src/panels/panel.ts',
                },
                formats: ['cjs'],
                fileName: (_, entryName) => `${entryName}.cjs`,
            },
            watch: isDev
                ? {
                    include: ['./src/**/*.ts', './src/**/*.vue', './src/**/*.css'],
                }
                : null,
            target: 'modules',
            minify: false,
            sourcemap: isDev
                ? process.platform === 'win32'
                    ? 'inline'
                    : true // windows 下 sourcemap 只有 inline 模式才会生效
                : false,
        },
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement: (tag) => tag.startsWith('ui-'),
                    },
                },
            }),
            nodeExternals({
                builtins: true, // 排除 node 的内置模块
                deps: false, // 将依赖打入 dist，发布的时候可以删除 node_modules
                devDeps: true,
                peerDeps: true,
                optDeps: true,
            }),
            cocosPanelConfig(),
            cocosPanel({
                transform: (css: string) => {
                    // element-plus 的全局变量是作用在 :root , 需要改成 :host
                    // 黑暗模式它是在 html 添加 dark 类名，我们应该在最外层的 #app 添加 class="dark"
                    return css.replace(/:root|html\.dark/g, (match) => {
                        return match === ':root' ? ':host' : '#app.dark';
                    });
                },
            }),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    };
});
