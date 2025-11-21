import { System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseModelComp } from "@aixh-cc/xhgame_ec_framework"
import { GateToBattleComp } from "../GateToBattleComp"

export class GateViewSystem extends System {

    static async initComp(comp: GateViewComp) {
        xhgame.gameEntity.safeGetComponentByRegisterName('PlayerModelComp') // 保证已经挂载在xhgame.gameEntity
        await xhgame.gui.openUIAsync(xhgame.gui.enums.gate_index, comp)
        xhgame.audio.playMusic(xhgame.audio.enums.gate_bg_audio)
    }

    /** 从gate进入战役 */
    static async startBattle(comp: GateViewComp) {
        if (comp.isClickStart) {
            return xhgame.gui.toast('进行中,勿重复点击')
        }
        const playerModel = xhgame.gameEntity.safeGetComponentByRegisterName('PlayerModelComp')
        let battleId = playerModel.selectedBattleId
        console.log('startBattle battleId=' + battleId)
        // 
        const curBattle = xhgame.table.getTable(xhgame.table.enums.battle).getInfo(battleId)
        if (curBattle == undefined) {
            xhgame.gui.toast('未找到该关卡信息，敬请期待')
            return
        }
        comp.isClickStart = true
        const battleModelComp = xhgame.gameEntity.safeGetComponentByRegisterName('BattleModelComp')
        battleModelComp.reset()
        battleModelComp.curBattleTableItem = JSON.parse(JSON.stringify(curBattle))
        await xhgame.gameEntity.attachComponent(GateToBattleComp).setup({ battleId: battleId }).done()
        xhgame.gameEntity.detachComponent(GateToBattleComp)
    }

    static openGateGroupMission(comp: GateViewComp) {
        xhgame.gameEntity.attachComponentByRegisterName('GateGroupMissionViewComp')
    }

    static openSettingDialog(comp: GateViewComp) {
        xhgame.gameEntity.attachComponentByRegisterName('GateSettingDialogViewComp')
    }
}


export class GateViewComp extends BaseModelComp {
    compName: string = 'GateViewComp'
    initBySystems = [GateViewSystem]
    isClickStart: boolean = false
    reset() {
        this.isClickStart = false
    }
    // 在gate场景,玩家的操作
    actions = {
        /** 开始游戏 */
        startBattle: () => {
            return GateViewSystem.startBattle(this)
        },
        /** 打开关卡 */
        openGateGroupMission: () => {
            return GateViewSystem.openGateGroupMission(this)
        },
        /** 打开设置 */
        openSettingDialog: () => {
            GateViewSystem.openSettingDialog(this)
        },
    }

    onDetach() {
        xhgame.gui.removeUI(xhgame.gui.enums.gate_index)
    }
}
