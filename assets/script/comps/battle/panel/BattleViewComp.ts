
import { System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseModelComp } from "@aixh-cc/xhgame_ec_framework"

export class BattleViewSystem extends System {

    /** 初始化 */
    static async initComp(comp: BattleViewComp) {

        await xhgame.gui.openUIAsync(xhgame.gui.enums.battle_index, comp)

        comp.time_uuid = xhgame.timer.schedule(() => {
            this.secUpdate(comp)
        }, 1000)

        // 如果存在帮助组件，触发新手指引事件
        if (xhgame.gameEntity.isExistComponentByRegisterName('HelpComp')) {
            let obj = { round: 0, battle_id: 1, max_battle_id: 1 }
            xhgame.event.emit('first_enter_battle', obj) // 手动触发新手指引事件
            xhgame.gameEntity.safeGetComponentByRegisterName('HelpComp').actions.playHelpOnEvent('first_enter_battle', obj).then(() => {
                xhgame.gui.toast('指引结束')
            })
        }
    }
    static secUpdate(comp: BattleViewComp) {
        // todo 更新游戏时间的显示
    }


}
export class BattleViewComp extends BaseModelComp {
    compName: string = 'BattleViewComp'
    initBySystems: (typeof System)[] = [BattleViewSystem]
    // 
    time_uuid: string = ''
    playtimeFormat: string = ''

    actions = {

    }
    reset() {
        xhgame.timer.unschedule(this.time_uuid)
        this.time_uuid = ''
        this.playtimeFormat = ''
    }

    onDetach() {
        xhgame.gui.removeUI(xhgame.gui.enums.battle_index)
    }
}

