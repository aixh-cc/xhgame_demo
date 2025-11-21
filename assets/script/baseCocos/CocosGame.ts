import { GameEntity } from "../GameEntity";
import { xhgame } from "db://assets/script/xhgame";
import { BYTEDANCE, DEBUG, WECHAT } from "cc/env";
import { Comp, DI, Entity, IGame, IGameMeta, Platform, TimeSystem } from "@aixh-cc/xhgame_ec_framework";
import { Game, Component, game, director, profiler, _decorator } from "cc";
import { CocosGameManagers } from "./CocosGameManagers";
import { CocosDrives } from "./CocosDrives";
import { LoadResourceToGateComp } from "../comps/enter/LoadResourceToGateComp";
import { GameEnterComp } from "../comps/enter/GameEnterComp";

const { ccclass, property } = _decorator;
@ccclass('CocosGame')
export class CocosGame extends Component implements IGame {
    private _gameEntity: GameEntity = null
    setGameEntity(gameEntity: GameEntity) {
        this._gameEntity = gameEntity
    }
    getGameEntity(): GameEntity {
        return this._gameEntity
    }
    serverNo: string = '0'
    meta: IGameMeta = {
        server_no: "dev_001",
        name: "预发布环境",
        version: "3.15.1",
        game_code: "jianchuqiao",
        account_domain: "https://account.aixh.cc/v3.14.0"
    }
    at_platform: Platform = Platform.H5
    screen: { w: number, h: number } = { w: 640, h: 960 }
    testing: boolean = false

    protected async start() {
        if (WECHAT) {
            this.serverNo = 'wx_001'
            this.at_platform = Platform.Weixin
        } else if (BYTEDANCE) {
            this.serverNo = 'dy_001'
            this.at_platform = Platform.Douyin
        } else {
            this.serverNo = 'dev_001' // 0
            this.at_platform = Platform.H5
        }
        const drives = new CocosDrives()
        const managers = new CocosGameManagers()
        console.log('IDrives', drives)
        DI.bindInstance('IDrives', drives)
        DI.bindInstance('IGame', this)
        DI.bindInstance('IManagers', managers)
        managers.init(this.node)
        await this.init()
        await this.play()
        xhgame.event.emit('game_start_to_play', { "maxBattleId": 1 }) // todo 这里先写死 { "maxBattleId": 1 }
        // const playerModelComp = xhgame.gameEntity.safeGetComponentByRegisterName('PlayerModelComp')
        // console.log('等待玩家操作', playerModelComp)
        // xhgame.event.emit('wait_player_play', { maxBattleId: playerModelComp.playerInfo.maxBattleId })
    }

    async init() {
        this.onGameShowHide()
        this.setGameEntity(Entity.createEntity<GameEntity>(GameEntity))
        await xhgame.gameEntity.attachComponent(LoadResourceToGateComp).done()
    }

    async play() {
        xhgame.timer.timePlay()
        await xhgame.gameEntity.attachComponent(GameEnterComp).done()
        xhgame.gameEntity.detachComponent(LoadResourceToGateComp)
    }

    onGameShowHide() {
        // 游戏显示事件
        game.on(Game.EVENT_SHOW, () => {
            console.log("【系统】游戏前台显示");
            xhgame.timer.timeContinuePlay();
            xhgame.audio.resumeAll();
            director.resume();
            game.resume();
            xhgame.event.emit('GAME_EVENT_SHOW');
        });

        // 游戏隐藏事件
        game.on(Game.EVENT_HIDE, () => {
            console.log("【系统】游戏切到后台");
            xhgame.timer.timeStop();
            xhgame.audio.pauseAll();
            director.pause();
            game.pause();
            xhgame.event.emit('GAME_EVENT_HIDE');
        });

        // 游戏暂停事件
        xhgame.event.on('battle_game_pause', () => {
            console.log('【系统】游戏暂停');
            xhgame.timer.timeStop();
            xhgame.audio.pauseAll();
            director.pause();
            game.pause();
        });
        xhgame.event.on('battle_game_resume', () => {
            console.log('【系统】游戏恢复');
            xhgame.timer.timeContinuePlay();
            xhgame.audio.resumeAll();
            director.resume();
            game.resume();
        });
        // 引入xhgame全局变量以方便调试
        if (DEBUG) {
            window['xhgame'] = xhgame;
        }
        // debug
        if (DEBUG) profiler.showStats();
    }
    protected update(dt: number): void {
        TimeSystem.getInstance().updateByDrive(dt * 1000)
        Comp.notifyAllDirtyComps() // 通知所有脏数据组件更新
    }
}

