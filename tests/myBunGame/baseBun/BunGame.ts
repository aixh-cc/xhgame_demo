import { GameEntity } from "db://assets/script/GameEntity";
import { xhgame } from "db://assets/script/xhgame";
import { Comp, DI, Entity, IGame, IGameMeta, INode, Platform, SimpleBaseView, TimeSystem } from "@aixh-cc/xhgame_ec_framework";
import { BunGameManagers } from "./BunGameManagers";
import { BunDrives } from "./BunDrives";
import { LoadResourceToGateComp } from "db://assets/script/comps/enter/LoadResourceToGateComp";
import { GameEnterComp } from "db://assets/script/comps/enter/GameEnterComp";

export class BunNode implements INode {
    name: string = ''
    constructor(name: string) {
        this.name = name
    }
}
export class BunView extends SimpleBaseView {
    name: string = ''
    constructor(name: string) {
        super()
        this.name = name
    }
    reset(): void {

    }
}


export class BunGame implements IGame {
    name: string = 'BunGame';
    node: BunNode
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

    async start() {
        this.serverNo = 'dev_001' // 0
        this.at_platform = Platform.H5
        // 
        const drives = new BunDrives()
        const managers = new BunGameManagers()
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

    }
    protected update(dt: number): void {
        console.log('update', dt)
        TimeSystem.getInstance().updateByDrive(dt * 1000)
        Comp.notifyAllDirtyComps() // 通知所有脏数据组件更新
    }
}

