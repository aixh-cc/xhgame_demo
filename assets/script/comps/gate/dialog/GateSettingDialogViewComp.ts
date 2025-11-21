
import { System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseModelComp } from "@aixh-cc/xhgame_ec_framework"

export interface IGateSettingDialogViewVM {
    music_open: boolean
    effect_open: boolean
}

export class GateSettingDialogViewSystem extends System {
    /** 初始化 */
    static async initComp(comp: GateSettingDialogViewComp) {
        await xhgame.gui.openUIAsync(xhgame.gui.enums.gate_setting_dialog, comp) // 游戏失利，等待复活
        comp.vm.effect_open = xhgame.audio.getEffectVolume() > 0
        comp.vm.music_open = xhgame.audio.getMusicVolume() > 0
        comp.notify()
    }

    static onMusicBtnClick(comp: GateSettingDialogViewComp) {
        comp.vm.music_open = !comp.vm.music_open
        let numval = comp.vm.music_open ? 1 : 0
        xhgame.audio.setMusicVolume(numval)
        comp.notify()
    }
    static onEffectBtnClick(comp: GateSettingDialogViewComp) {
        comp.vm.effect_open = !comp.vm.effect_open
        let numval = comp.vm.effect_open ? 1 : 0
        xhgame.audio.setEffectVolume(numval)
        comp.notify()
    }
}

export class GateSettingDialogViewComp extends BaseModelComp {
    compName: string = 'GateSettingDialogViewComp'
    initBySystems: (typeof System)[] = [GateSettingDialogViewSystem]
    vm: IGateSettingDialogViewVM = {
        music_open: false,
        effect_open: false,
    }
    actions = {
        onMusicBtnClick: () => {
            GateSettingDialogViewSystem.onMusicBtnClick(this)
        },
        onEffectBtnClick: () => {
            GateSettingDialogViewSystem.onEffectBtnClick(this)
        },
    }
    reset() {
        this.vm = {
            music_open: false,
            effect_open: false,
        }
    }
    onDetach() {
        xhgame.gui.removeUI(xhgame.gui.enums.gate_setting_dialog)
    }
}

