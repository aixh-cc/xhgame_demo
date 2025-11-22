# xhgame_ec_framework 的使用

一个基于 Cocos Creator 3.8.7 与 `@aixh-cc/xhgame_ec_framework` 的开源游戏开发框架示例工程，内置 EC/DI、事件总线、资源与 UI 管理、音频、网络、表数据、工厂、时间系统等能力，并提供微信/抖音等平台适配。

## 项目简介
- 引擎：Cocos Creator 3.8.7
- 语言：TypeScript
- 框架：`@aixh-cc/xhgame_ec_framework`
- 目标：提供可直接运行与扩展的通用游戏脚手架与模块化示例

## 环境要求
- 安装 Cocos Creator 3.8.7
- Node.js（18++,最好20+）

## 目录结构（节选）
```
/.creator                      # 编辑器辅助
/assets                        # 资源与脚本根目录
  game.scene                   # 入口场景
  scene.scene                  # 示例场景
  /bundle_battle               # 战斗资源包（音频、GUI等）
  /bundle_gate                 # 大厅/关卡资源包（GUI、表、字体、widgets等）
  /bundle_factory              # 通用工厂模板（单位/特效/UI等）
  /mock                        # 本地网络 Mock
  /script                      # TypeScript 脚本
    baseCocos/                 # 引擎侧封装与驱动
      CocosGame.ts             # 游戏主组件（绑定到场景 root）
      CocosGameManagers.ts     # 管理器聚合与初始化
      CocosDrives.ts           # DI 驱动绑定（IHttp/ISocket/UI/Audio/Asset/Table/Factory）
      CocosUiDrive.ts          # UI 驱动
      CocosAudioDrive.ts       # 音频驱动
    ccComponents/              # Cocos 原生组件封装（音频/SDK等）
    comps/                     # 业务组件（battle/gate/models/player/widgets等）
    managers/                  # 管理器（事件/音频/资源/网络/表/工厂等）
      myFactory/               # 工厂配置与模板
      myTable/                 # 表配置与解析
    uiViews/                   # 视图脚本（battle/gate/widgets等）
    GameEntity.ts              # 游戏实体（组件注册/挂载）
    RegisterComps.ts           # 业务组件注册表
    xhgame.ts                  # 全局门面（统一访问各系统）
/settings/v2/packages          # 工程/构建配置（分辨率、Builder 等）
/tests                         # Bun 测试与示例（可选）
README.md
package.json                   # 依赖与 Creator 版本记录
```

## 入口与运行流程
- 场景：`assets/game.scene` 为默认运行场景
- 入口组件：`assets/script/baseCocos/CocosGame.ts`（start → init → play）
  - `start()`：绑定 DI 与管理器，按平台设置 
  - `init()`：创建游戏实体并挂载资源加载组件
  - `play()`：开启计时并进入游戏流程
- 全局门面：`assets/script/xhgame.ts` 暴露 `game/event/gui/audio/asset/net/table/storage/timer`
- 帧驱动：`update(dt)` 调用框架时间系统与组件脏更新

## 核心模块
- EC/实体系统：`GameEntity.ts` + `RegisterComps.ts` 管理组件的注册、挂载/卸载与安全获取
- 事件总线：`xhgame.event.emit/on`，系统与业务事件统一派发（如 `GAME_EVENT_SHOW/HIDE`、`battle_game_pause/resume`）
- 资源管理：`MyAssetManager` 基于 `cc.assetManager`；资源按 bundle 分域组织
- UI 管理：`MyUiManager` 通过 `bundle://` 路径加载预制件，`UIEnums` 枚举集中管理
- 音频管理：`MyAudioManager` 提供背景/音效播放与暂停/恢复
- 网络管理：`MyNetManager` 绑定 `IHttp/ISocket`，默认集成 `MockHttp` 便于本地调试
- 表数据：`myTable/` 中定义表类型与解析，数据位于 `bundle_gate/table/*.json`
- 工厂系统：`myFactory/` 定义单位、UI、特效等模板与生产驱动（`IFactoryConfig`）
- 时间系统：`xhgame.timer` 统一控制游戏时间（播放/暂停/恢复/按帧更新）

## 快速开始
1. 安装并打开 Cocos Creator 3.8.7
2. 使用编辑器打开本工程根目录
3. 在资源面板选择并预览 `assets/game.scene`
4. Debug 模式下可在控制台使用 `window.xhgame` 进行调试

示例：
```ts
import { xhgame } from 'db://assets/script/xhgame'

// 打开一个 UI 面板（枚举路径见 MyUiManager）
xhgame.gui.open('bundle_gate://gui/panel/gate_index/gate_index')

// 播放背景音乐
xhgame.audio.play('bundle_gate://audio/gate_bg_audio')

// 发送一个业务事件
xhgame.event.emit('game_start_to_play', { maxBattleId: 1 })
```

## 开发约定与扩展
- 组件注册：在 `RegisterComps.ts` 中添加业务组件的注册项；通过 `xhgame.gameEntity.attachComponentByRegisterName()` 挂载
- 资源路径：统一使用 `bundle://` 资源路径，并在各管理器的枚举（如 `UIEnums`、`AudioEnums`）中集中维护
- 表数据：在 `assets/bundle_gate/table` 添加配置，同时于 `myTable/tables` 编写解析与类型约束，并在 `MyTableConfig` 挂载
- 工厂模板：在 `myFactory/itemTemplates` 与 `factorys` 扩展模板与生产驱动，并在 `MyCocosFactoryConfig` 中注册
- 平台适配：`cc/env` 中的 `WECHAT/BYTEDANCE` 自动识别平台并设置 `serverNo/Platform`


## 测试与示例（可选）
- `tests/myBunGame` 提供 Bun 环境下的最小可运行示例与测试（如 `mission.test.ts`），`xhgame.ts` 中已预留切换到 Bun 的注释代码以便联调

## 常见问题（FAQ）
- 如何新增一个 UI 面板？
  - 在对应 `bundle_*` 下创建预制件 → 将路径加入 `MyUiManager` 的枚举 → 编写视图组件并在 `RegisterComps.ts` 注册 → 通过 `xhgame.gui.open()` 打开
- 如何新增一张表？
  - 在 `bundle_gate/table` 添加 JSON → 在 `myTable/tables` 创建解析类与类型 → 在 `MyTableConfig` 注册并通过 `xhgame.table` 访问
- 如何做平台区分？
  - 依赖 `cc/env`：在 `CocosGame.start()` 中已根据 `WECHAT/BYTEDANCE` 设置平台与服务器编号

## 许可
- 本项目为示例工程，依赖的生态框架 `@aixh-cc/xhgame_ec_framework` 按其发布协议使用；
