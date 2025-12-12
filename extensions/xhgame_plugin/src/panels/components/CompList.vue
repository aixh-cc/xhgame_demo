<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { inject } from 'vue';
import { keyAppRoot, keyMessage } from '../provide-inject';
import { IGetGroupComponentListRes, IInstallRes, IComponentInfo, IComponentInfoWithStatus } from '@aixh-cc/xhgame_builder';
import cocosEditorBridge from '../cocos-bridge';
import CodeHighlight from './CodeHighlight.vue';

// 定义组件的props
interface Props {
  plugin:string;
  group: string;
  title: string;
}

const depDialogVisible = ref(false);
const depDialogDeps = ref<Array<{ componentCode: string; group: string; componentName?: string; isInstalled?: boolean }>>([]);
const groupCache = ref<Record<string, IComponentInfoWithStatus[]>>({});

function extractActionableDeps(component: IComponentInfoWithStatus) {
  const deps = Array.isArray((component as any).dependencies) ? (component as any).dependencies : [];
  return deps.filter((d: any) => d && typeof d === 'object' && 'componentCode' in d && 'group' in d).map((d: any) => ({ componentCode: String(d.componentCode), group: String(d.group) }));
}

async function getGroupComponents(group: string) {
  if (!groupCache.value[group]) {
    const res:IGetGroupComponentListRes = await cocosEditorBridge.getPackages(props.plugin, group);
    groupCache.value[group] = res.list || [];
  }
  return groupCache.value[group];
}

async function resolveDepsStatus(deps: Array<{ componentCode: string; group: string }>) {
  const resolved: Array<{ componentCode: string; group: string; componentName?: string; isInstalled?: boolean }> = [];
  for (const d of deps) {
    const list = await getGroupComponents(d.group);
    const found = list.find(x => x.componentCode === d.componentCode);
    resolved.push({ componentCode: d.componentCode, group: d.group, componentName: found?.componentName, isInstalled: found?.isInstalled });
  }
  depDialogDeps.value = resolved;
  return resolved;
}

async function installComponentDirect(component: IComponentInfoWithStatus) {
  message({ message: `正在安装 ${component.componentCode}...`, type: 'info' });
  const install_res:IInstallRes = await cocosEditorBridge.installComponent(
    props.plugin,
    props.group,
    component.componentCode
  );
  if (install_res && install_res.success) {
    message({ message: `${component.componentCode} 资源安装成功！`, type: 'success' });
    await loadComponents();
  } else {
    message({ message: install_res.error, type: 'error' });
  }
}

async function installDependency(dep: { componentCode: string; group: string }) {
  message({ message: `安装依赖 ${dep.componentCode}...`, type: 'info' });
  const res:IInstallRes = await cocosEditorBridge.installComponent(props.plugin, dep.group, dep.componentCode);
  if (res && res.success) {
    message({ message: `${dep.componentCode} 安装成功`, type: 'success' });
    const refreshed:IGetGroupComponentListRes = await cocosEditorBridge.getPackages(props.plugin, dep.group);
    groupCache.value[dep.group] = refreshed.list || [];
    await resolveDepsStatus(depDialogDeps.value.map(d => ({ componentCode: d.componentCode, group: d.group })));
  } else {
    message({ message: res.error, type: 'error' });
  }
}

async function handleInstallClick(component: IComponentInfoWithStatus) {
  if (component.isInstalled) return;
  const deps = extractActionableDeps(component);
  if (!deps.length) {
    await installComponentDirect(component);
    return;
  }
  const resolved = await resolveDepsStatus(deps);
  const allInstalled = resolved.every(d => d.isInstalled);
  if (allInstalled) {
    await installComponentDirect(component);
  } else {
    depDialogVisible.value = true;
  }
}

const props = withDefaults(defineProps<Props>(), {
  plugin: 'xhgame_plugin',
  group: 'components',
  title: '组件库' 
});

const appRootDom = inject(keyAppRoot);
const message = inject(keyMessage)!;

// 折叠卡片状态管理
const expandedCards = ref<Record<string, string>>({});

// 当前激活的标签页
const activeTab = ref('all');

// 检查卡片是否展开
const isCardExpanded = (code: string) => {
  return expandedCards.value[code] === code;
};

// 计算属性：已安装组件
const installedComponents = computed(() => {
  return componentList.value.filter(comp => comp.isInstalled);
});

// 计算属性：可更新组件
const updatableComponents = computed(() => {
  return componentList.value.filter(comp => comp.isInstalled && comp.isUpdatable);
});

// 计算属性：根据标签页筛选的组件
const filteredComponents = computed(() => {
  switch (activeTab.value) {
    case 'installed':
      return installedComponents.value;
    case 'updates':
      return updatableComponents.value;
    default:
      return componentList.value;
  }
});

// 组件列表数据
let componentList = ref<IComponentInfoWithStatus[]>([]);
// 获取组件列表的异步函数
const loadComponents = async () => {
  try {
    const package_res:IGetGroupComponentListRes = await cocosEditorBridge.getPackages(props.plugin,props.group);
    console.log('package_res',package_res)
    componentList.value = package_res.list || [];
    console.log('获取组件列表成功', package_res.list);
  } catch (error) {
    console.error('Failed to load components:', error);
    ElMessage.error('获取组件列表失败');
  }
};

// 在组件挂载时获取数据
onMounted(() => {
  loadComponents();
});

// 高亮代码片段（避免在模板内直接写多行字符串导致解析错误）
const codeImportSnippet = `import { CocosBaseItemView } from "db://assets/script/views/CocosBaseItemView";`;
const codeClassSnippet = `export interface IXXXUiItemViewVM {\n  num: number\n}\n\n@ccclass('XXXUiItemView')\n@executeInEditMode(true)\nexport class XXXUiItemView extends CocosBaseItemView implements IXXXUiItemViewVM {\n  // ... 你的组件逻辑\n}`;

// 从插件assets安装组件
async function installComponent(component: IComponentInfoWithStatus) {
  if(component.isInstalled){
    return 
  }
  console.log(`[xhgame_plugin] 安装【本地组件】请求:`, component.componentCode);
  try {
    // 确认安装
    const confirmMessage = `确定要从插件内置资源安装 "${component.componentCode}" 组件到项目吗？`;
    await ElMessageBox.confirm(
      confirmMessage,
      '确认安装',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        appendTo: appRootDom
      }
    );
    
    message({
      message: `正在安装 ${component.componentCode}...`,
      type: 'info'
    });
    
    const install_res:IInstallRes = await cocosEditorBridge.installComponent(
      props.plugin,  
      props.group,
      component.componentCode);
    
    if (install_res && install_res.success) {
      message({
        message: `${component.componentCode} 资源安装成功！`,
        type: 'success'
      });
      await loadComponents();
    } else {
      message({
        message: install_res.error,
        type: 'error'
      });
    }
  } catch (error: any) {
    if (error === 'cancel') return;
    
    message({
      message: `安装失败: ${error.message || error}`,
      type: 'error'
    });
  }
}

// 卸载相关状态与方法
const uninstallDialogVisible = ref(false);
const currentUninstallComponent = ref<any | null>(null);
const uninstallingComponents = ref<Set<string>>(new Set());

function showUninstallDialog(component: IComponentInfoWithStatus) {
  currentUninstallComponent.value = {
    componentName: component.componentName,
    componentCode: component.componentCode,
    version: component.componentVersion,
    installedAt: component.installedAt,
  };
  uninstallDialogVisible.value = true;
}

function cancelUninstall() {
  uninstallDialogVisible.value = false;
  currentUninstallComponent.value = null;
}

async function confirmUninstallComponent() {
  if (!currentUninstallComponent.value) return;
  const { componentCode, componentName } = currentUninstallComponent.value;
  console.log(`[xhgame_plugin] 卸载【本地组件】请求:`, currentUninstallComponent.value);
  try {
    uninstallingComponents.value.add(componentCode);
    uninstallDialogVisible.value = false;

    const result = await cocosEditorBridge.uninstallComponent(
        props.plugin,
        props.group,
        componentCode);
    if (result && result.success) {
      message({
        message: result.error || `组件 ${componentName} 卸载成功！`,
        type: 'success',
        duration: 5000,
      });
      await loadComponents();
    } else {
      message({
        message: (result && result.error) || `组件 ${componentName} 卸载失败`,
        type: 'error',
      });
    }
  } catch (error: any) {
    message({
      message: `卸载组件失败: ${error?.message || String(error)}`,
      type: 'error',
    });
  } finally {
    uninstallingComponents.value.delete(componentCode);
    currentUninstallComponent.value = null;
  }
}

const rollbackDialogVisible = ref(false);
const currentRollbackComponent = ref<any | null>(null);
const rollingBackComponents = ref<Set<string>>(new Set());

function showRollbackDialog(component: IComponentInfoWithStatus) {
  currentRollbackComponent.value = {
    componentName: component.componentName,
    componentCode: component.componentCode,
    version: component.componentVersion,
    backedUpAt: (component as any).backedUpAt,
  };
  rollbackDialogVisible.value = true;
}

function cancelRollback() {
  rollbackDialogVisible.value = false;
  currentRollbackComponent.value = null;
}

async function confirmRollbackComponent() {
  if (!currentRollbackComponent.value) return;
  const { componentCode, componentName } = currentRollbackComponent.value;
  try {
    rollingBackComponents.value.add(componentCode);
    rollbackDialogVisible.value = false;
    const result = await cocosEditorBridge.rollbackComponent({ componentCode: componentCode, group: props.group });
    if (result && result.success) {
      message({
        message: result.error || `组件 ${componentName} 回滚成功！`,
        type: 'success',
        duration: 5000,
      });
      await loadComponents();
    } else {
      message({
        message: (result && result.error) || `组件 ${componentName} 回滚失败`,
        type: 'error',
      });
    }
  } catch (error: any) {
    message({
      message: `回滚组件失败: ${error?.message || String(error)}`,
      type: 'error',
    });
  } finally {
    rollingBackComponents.value.delete(componentCode);
    currentRollbackComponent.value = null;
  }
}
</script>

<template>
  <div class="comp-list-container">
    <h2>{{ title }}</h2>
    
    <!-- 组件筛选标签 -->
    <el-tabs v-model="activeTab" class="comp-filter-tabs">
      <el-tab-pane label="全部组件" name="all">
        <div class="tab-content">
          <div class="tab-stats">共 {{ filteredComponents.length }} 个组件</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已安装组件" name="installed">
        <div class="tab-content">
          <div class="tab-stats">已安装 {{ installedComponents.length }} 个组件</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="可更新组件" name="updates">
        <div class="tab-content">
          <div class="tab-stats">有 {{ updatableComponents.length }} 个组件可更新</div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="false" label="开发规范" name="devinfo">
        <div v-if="group === 'uiItems'" class="tab-content dev-guidelines">
          <h3>开发规范</h3>
          <div class="guideline-section">
            <h4>必须引入</h4>
            <CodeHighlight language="ts" :code="codeImportSnippet" />
          </div>
          <div class="guideline-section">
            <h4>当前item的vm必须在本文件里</h4>
            <CodeHighlight language="ts" :code="codeClassSnippet" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 组件列表 - 只在非开发规范标签页显示 -->
    <div v-if="activeTab !== 'devinfo'" class="components-grid">
      <el-card v-for="component in filteredComponents" :key="component.componentCode" class="component-card" :class="{ 'installed': component.isInstalled }">
      <template #header>
        <div class="card-header">
          <div class="card-title">
            <h3>{{ component.componentName }}</h3><el-tag size="small" effect="plain">{{ component.componentCode }}</el-tag><span class="version">v{{ component.componentVersion }}</span>
            <el-tag v-if="component.isUpdatable" type="warning" size="small">可更新</el-tag>
          </div>
          <div class="card-meta">
            <span class="author">作者: {{ component.author }}</span>
            <div class="rating">
              <el-rate v-model="component.stars" disabled text-color="#ff9900" score-template="{value}" />
            </div>
          </div>
        </div>
      </template>
      
      <div class="card-content">
        <div class="tags">
          <el-tag v-for="tag in component.tags" :key="tag" size="small"  class="tag">{{ tag }}</el-tag>
        </div>
        
        <el-collapse v-model="expandedCards[component.componentCode]">
          <el-collapse-item class="compent-content" :name="component.componentCode">  
            <template #title>
              <div class="collapse-title">
                <span class="description-preview">{{ component.description.substring(0, 50) }}{{ component.description.length > 50 ? '...' : '' }}</span>
                <span class="collapse-hint">{{ isCardExpanded(component.componentCode) ? '收起详情' : '展开详情' }}</span>
              </div>
            </template>
            
            <div class="description">
              <h4>描述</h4>
              <p>{{ component.description }}</p>
            </div>
            
            <div class="target-paths">
              <h4>安装路径</h4>
              <ul>
                <li v-for="(target, index) in component.files" :key="index">
                  {{ target }} 
                </li>
              </ul>
            </div>

            <div class="dependencies">
              <h4>依赖</h4>
              <ul>
                <li v-for="dep in component.dependencies.filter(d => typeof d === 'object' && d && 'componentCode' in d && 'group' in d)" :key="dep.componentCode + '-' + dep.group">
                  <el-tag size="small" effect="plain">{{ dep.componentCode }}</el-tag>  <el-tag :type="dep.isInstalled ? 'success' : 'danger'">{{ dep.isInstalled ? '已安装' : '未安装' }}</el-tag> <el-button v-if="!dep.isInstalled" type="primary" size="small" :disabled="dep.isInstalled" @click="installDependency({ componentCode: dep.componentCode, group: dep.group })">安装</el-button>
                </li>
              </ul>
            </div>
          </el-collapse-item>
        </el-collapse>
        
        <div class="actions">
          <el-button 
            :type="component.isInstalled? 'success' : 'primary' " 
            @click="handleInstallClick(component)">
             {{ component.isInstalled ? (component.isUpdatable ? '更新' : '已安装') : '下载安装' }}
          </el-button>
          <el-button 
            type="danger" 
            v-if="component.isInstalled"
            @click="showUninstallDialog(component)">
             {{ '卸载组件' }}
          </el-button>
          <el-button 
            type="warning" 
            v-if="component.isBackedUp && !component.isInstalled"
            @click="showRollbackDialog(component)">
             {{ '回滚组件' }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
  </div>
  
  <!-- 卸载确认对话框 -->
  <el-dialog
    
    v-model="uninstallDialogVisible"
    title="确认卸载组件"
    width="500px"
    :before-close="cancelUninstall"
  >
    <div class="un-install-dialog" v-if="currentUninstallComponent">
      <p><strong>您确定要卸载以下组件吗？</strong></p>
      <div class="uninstall-info">
        <p><strong>组件名称:</strong> {{ currentUninstallComponent.componentName }}</p>
        <p><strong>组件代码:</strong> {{ currentUninstallComponent.componentCode }}</p>
        <p><strong>版本:</strong> v{{ currentUninstallComponent.version }}</p>
        <p><strong>安装时间:</strong> {{ new Date(currentUninstallComponent.installedAt).toLocaleString() }}</p>
      </div>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
      >
        <p>【注意】: 卸载操作将会：</p>
        <p>从项目中删除组件文件,同时备份数据到backup中(仅保留1份)</p>
        <p><strong>此操作不可逆，请谨慎操作！</strong></p>
      </el-alert>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelUninstall">取消</el-button>
        <el-button type="danger" @click="confirmUninstallComponent">
          确认卸载
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="depDialogVisible"
    title="安装前置依赖"
    width="600px"
  >
    <div v-if="depDialogDeps && depDialogDeps.length">
      <el-table :data="depDialogDeps" style="width: 100%">
        <el-table-column prop="componentCode" label="组件代码" width="200" />
        <el-table-column prop="group" label="分组" width="180" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.isInstalled ? 'success' : 'danger'">{{ scope.row.isInstalled ? '已安装' : '未安装' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" :disabled="scope.row.isInstalled" @click="installDependency({ componentCode: scope.row.componentCode, group: scope.row.group })">安装</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="depDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  
  <el-dialog
    v-model="rollbackDialogVisible"
    title="确认回滚组件"
    width="500px"
    :before-close="cancelRollback"
  >
    <div v-if="currentRollbackComponent">
      <p><strong>您确定要回滚以下组件到备份状态吗？</strong></p>
      <div class="uninstall-info">
        <p><strong>组件名称:</strong> {{ currentRollbackComponent.componentName }}</p>
        <p><strong>组件代码:</strong> {{ currentRollbackComponent.componentCode }}</p>
        <p><strong>当前版本:</strong> v{{ currentRollbackComponent.version }}</p>
        <p><strong>备份时间:</strong> {{ currentRollbackComponent.backedUpAt ? new Date(currentRollbackComponent.backedUpAt).toLocaleString() : '未知' }}</p>
      </div>
      <el-alert
        title="注意"
        type="warning"
        :closable="false"
        show-icon
      >
        <p>回滚操作将会：</p>
        <ul>
          <li>用备份文件覆盖当前组件文件</li>
        </ul>
        <p><strong>可能导致当前改动丢失，请谨慎操作！</strong></p>
      </el-alert>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelRollback">取消</el-button>
        <el-button type="warning" @click="confirmRollbackComponent">
          确认回滚
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.comp-list-container {
  padding: 20px;
  height: calc(100vh - 150px);
  overflow-y: auto;
  padding-bottom: 120px; /* 增加更多底部空间 */
}

.comp-filter-tabs {
  margin-bottom: 20px;
}

.tab-content {
  padding: 10px 0;
}

.tab-stats {
  font-size: 14px;
  color: #909399;
  margin-bottom: 15px;
}

.components-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 150px; /* 添加大量底部边距确保最后一个组件完全可见 */
}

/* 添加一个空白元素在列表底部 */
.components-grid::after {
  content: "";
  display: block;
  height: 200px; /* 确保有足够的空间 */
  grid-column: 1 / -1;
}

.description {
  margin-bottom: 20px;
  text-align: left;
  color: #ffffff;
}

.component-card {
  background-color: #ffffff;
  margin-bottom: 20px;
  border-radius: 8px;
  transition: all 0.3s;
}

.component-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #666;
}

.card-content p {
  margin: 0;
  font-size: 14px;
}

.actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.resource-icons {
  display: flex;
  gap: 8px;
}

.resource-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  position: relative;
}

.resource-icon i {
  font-size: 16px;
}

.resource-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #f56c6c;
  color: white;
  border-radius: 10px;
  padding: 0 5px;
  font-size: 10px;
  min-width: 15px;
  text-align: center;
}

.resource-icon.script {
  background-color: #409eff;
  color: white;
}

.resource-icon.texture {
  background-color: #67c23a;
  color: white;
}

.resource-icon.audio {
  background-color: #e6a23c;
  color: white;
}

.resource-icon.plist {
  background-color: #f56c6c;
  color: white;
}

.resource-icon.prefab {
  background-color: #909399;
  color: white;
}

.resource-icon.config {
  background-color: #9254de;
  color: white;
}

.path-type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  margin-right: 5px;
}

.path-type-icon i {
  font-size: 12px;
}

.collapse-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.description-preview {
  color: #606266;
  font-size: 14px;
}

.collapse-hint {
  color: #409eff;
  font-size: 12px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.author {
  font-size: 14px;
  color: #666;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.review-count {
  font-size: 12px;
  color: #999;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
  background-color: #fff;
}

.tag {
  margin-right: 0;
}

.path-desc {
  color: #999;
  font-size: 12px;
}

.installed {
  border: 1px solid #67c23a;
}

.installed .el-card__header {
  background-color: rgba(103, 194, 58, 0.1);
}

/* 评价对话框样式 */
.review-dialog :deep(.el-dialog__body) {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
}

.review-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.review-user {
  font-weight: bold;
  color: #409EFF;
}

.review-date {
  color: #999;
  font-size: 12px;
}

.review-rating {
  margin-bottom: 10px;
}

.review-comment {
  color: #333;
  line-height: 1.6;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  border-left: 3px solid #409EFF;
}

.no-reviews {
  text-align: center;
  color: #999;
  padding: 30px;
  font-size: 14px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.dialog-footer {
  text-align: right;
  margin-top: 15px;
}

.no-reviews {
  text-align: center;
  padding: 20px;
  color: #999;
}

.version {
    background-color: #409eff;
    color: #ffffff;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}
.compent-content{
  text-align: left;
}

/* 开发规范标签页样式 */
.dev-guidelines {
  padding: 20px;
  max-width: 800px;
}

.dev-guidelines h3 {
  color: #409EFF;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.guideline-section {
  margin-bottom: 24px;
}

.guideline-section h4 {
  color: #333;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
}

/* 确保代码高亮组件在标签页中正确显示 */
.dev-guidelines .hljs-wrap {
  margin-bottom: 16px !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
  text-align: left !important;
  direction: ltr !important;
}

/* 强制覆盖 Element Plus 标签页的样式 */
.el-tab-pane .dev-guidelines {
  text-align: left !important;
}

.el-tab-pane .dev-guidelines * {
  text-align: inherit !important;
}

.el-tab-pane .dev-guidelines .hljs-wrap,
.el-tab-pane .dev-guidelines .hljs-wrap * {
  text-align: left !important;
  direction: ltr !important;
}
.target-paths{
  color: #333;
}
.el-tag.el-tag--danger {
    background-color: #ecd9d9;
    --el-tag-text-color: var(--el-color-danger);
}
.el-tag.el-tag--primary {
    background: #fff;
    --el-tag-text-color: var(--el-color-primary);
}
.un-install-dialog{
  text-align: left;
}
</style>
