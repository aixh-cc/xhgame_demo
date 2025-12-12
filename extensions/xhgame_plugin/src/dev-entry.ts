import { createApp } from 'vue';
import './panels/style.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { ElMessage } from 'element-plus';

import App from './panels/App.vue';
import { keyAppRoot, keyMessage } from './panels/provide-inject';

import type { MessageOptions } from 'element-plus';

// 创建 Vue 应用
const app = createApp(App);

// 获取根元素
const rootElement = document.getElementById('app')!;

// 添加 dark 类名以支持暗色主题
rootElement.className = 'dark';

// 提供依赖注入
app.provide(keyAppRoot, rootElement);
app.provide(keyMessage, (options: MessageOptions = {}) => {
    if (typeof options === 'string') {
        options = { message: options };
    }
    options.appendTo ??= rootElement;
    return ElMessage(options);
});

// 挂载应用
app.mount(rootElement);