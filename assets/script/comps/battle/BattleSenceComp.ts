import { BaseModelComp, System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"

export class BattleSenceSystem extends System {

    static async initComp(comp: BattleSenceComp) {
        xhgame.audio.playMusic(xhgame.audio.enums.battle_bg_audio)
        // await xhgame.gameEntity.attachComponent(BattleGameBoxComp).done() // todo 游戏主逻辑
        await xhgame.gameEntity.safeGetComponentByRegisterName('BattleTiledComp').done()
        await xhgame.gameEntity.safeGetComponentByRegisterName('BattleViewComp').done()
        // 如果存在开发调试页面
        if (xhgame.gameEntity.isExistComponentByRegisterName('BattleDevViewComp')) {
            await xhgame.gameEntity.attachComponentByRegisterName('BattleDevViewComp').done()
        }
    }
}

export class BattleSenceComp extends BaseModelComp {
    compName: string = 'BattleSenceComp'
    initBySystems: (typeof System)[] = [BattleSenceSystem]
    battleId: number = 0
    setup(obj: { battleId: number }) {
        this.battleId = obj.battleId
        return this
    }

    reset() {
        this.battleId = 0
    }

    actions = {

    }

    onDetach() {
        xhgame.audio.stopMusic()
        // xhgame.gameEntity.detachComponent(BattleGameBoxComp)
        xhgame.gameEntity.detachComponentByRegisterName('BattleTiledComp')
        xhgame.gameEntity.detachComponentByRegisterName('BattleViewComp')
    }
}