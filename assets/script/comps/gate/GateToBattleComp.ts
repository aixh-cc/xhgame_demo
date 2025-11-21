
import { System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseModelComp } from "@aixh-cc/xhgame_ec_framework"

export class GateToBattleSystem extends System {

    static async initComp(comp: GateToBattleComp) {
        const battleModel = xhgame.gameEntity.safeGetComponentByRegisterName('BattleModelComp')
        if (comp.battleId != battleModel.curBattleTableItem.id) {
            return console.error('battleId 不一致')
        }
        await xhgame.gameEntity.safeGetComponentByRegisterName('LoadingViewComp').setup({
            otherPromise: async () => {
                await xhgame.gameEntity.safeGetComponentByRegisterName('BattleSenceComp').setup({ battleId: comp.battleId }).done()
            }
        }).done()
        xhgame.gameEntity.detachComponentByRegisterName('LoadingViewComp')
        xhgame.gameEntity.detachComponentByRegisterName('GateSenceComp')
    }

}

export class GateToBattleComp extends BaseModelComp {
    compName: string = 'GateToBattleComp'
    initBySystems: (typeof System)[] = [GateToBattleSystem]
    // 
    battleId: number = 0
    reset() {
        this.battleId = 0
    }
    setup(obj: { battleId: number }): GateToBattleComp {
        this.battleId = obj.battleId
        return this
    }
    onDetach() {

    }
}