<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript); // 添加 ts 作为 typescript 的别名
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript); // 添加 js 作为 javascript 的别名

const props = defineProps<{
  code: string;
  language?: 'typescript' | 'javascript' | string;
}>()

const codeEl = ref<HTMLElement | null>(null);
const langClass = computed(() => `language-${props.language || 'typescript'}`);

const highlight = () => {
  if (codeEl.value) {
    // Reset content and class before highlighting
    codeEl.value.className = langClass.value;
    codeEl.value.textContent = props.code;
    
    // 确保语言被正确识别
    const language = props.language || 'typescript';
    console.log('Highlighting with language:', language);
    
    try {
      // 手动高亮代码
      const result = hljs.highlight(props.code, { language });
      codeEl.value.innerHTML = result.value;
      codeEl.value.className = `hljs ${langClass.value}`;
    } catch (error) {
      console.warn('Highlight failed, falling back to plain text:', error);
      codeEl.value.textContent = props.code;
      codeEl.value.className = langClass.value;
    }
  }
};

onMounted(() => {
  highlight();
});

watch(() => [props.code, props.language], () => {
  highlight();
});
</script>

<template>
  <pre class="hljs-wrap"><code ref="codeEl"></code></pre>
</template>

<style>
/* 不使用 scoped，确保样式能够覆盖所有外层样式 */
@import 'highlight.js/styles/github-dark.css';

/* 使用更具体的选择器来覆盖 Element Plus 和其他外层样式 */
.el-tab-pane .tab-content .dev-guidelines .guideline-section .hljs-wrap,
.dev-guidelines .guideline-section .hljs-wrap,
.guideline-section .hljs-wrap,
.hljs-wrap {
  border-radius: 6px !important;
  padding: 12px !important;
  overflow: auto !important;
  background: #0d1117 !important;
  text-align: left !important;
  margin: 8px 0 !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
  direction: ltr !important;
  unicode-bidi: normal !important;
}

.el-tab-pane .tab-content .dev-guidelines .guideline-section .hljs-wrap code,
.dev-guidelines .guideline-section .hljs-wrap code,
.guideline-section .hljs-wrap code,
.hljs-wrap code {
  background: transparent !important;
  padding: 0 !important;
  border-radius: 0 !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
  font-size: 13px !important;
  color: #e6edf3 !important;
  text-align: left !important;
  white-space: pre !important;
  word-wrap: normal !important;
  display: block !important;
  direction: ltr !important;
  unicode-bidi: normal !important;
}

/* 确保高亮样式正确应用 - 使用更具体的选择器 */
.el-tab-pane .hljs-wrap .hljs-keyword,
.hljs-wrap .hljs-keyword {
  color: #ff7b72 !important;
  font-weight: bold !important;
}

.el-tab-pane .hljs-wrap .hljs-string,
.hljs-wrap .hljs-string {
  color: #a5d6ff !important;
}

.el-tab-pane .hljs-wrap .hljs-comment,
.hljs-wrap .hljs-comment {
  color: #8b949e !important;
  font-style: italic !important;
}

.el-tab-pane .hljs-wrap .hljs-type,
.hljs-wrap .hljs-type {
  color: #ffa657 !important;
}

.el-tab-pane .hljs-wrap .hljs-function,
.hljs-wrap .hljs-function {
  color: #d2a8ff !important;
}

.el-tab-pane .hljs-wrap .hljs-variable,
.hljs-wrap .hljs-variable {
  color: #ffa657 !important;
}

.el-tab-pane .hljs-wrap .hljs-title,
.hljs-wrap .hljs-title {
  color: #7ee787 !important;
}

.el-tab-pane .hljs-wrap .hljs-params,
.hljs-wrap .hljs-params {
  color: #ffa657 !important;
}

.el-tab-pane .hljs-wrap .hljs-built_in,
.hljs-wrap .hljs-built_in {
  color: #79c0ff !important;
}
</style>