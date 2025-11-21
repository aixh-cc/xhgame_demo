import { _decorator, CCBoolean } from "cc";
import { CocosBaseUiView } from "db://assets/script/baseCocos/CocosBaseUiView";
import { GateSettingDialogViewComp, IGateSettingDialogViewVM } from "db://assets/script/comps/gate/dialog/GateSettingDialogViewComp";

const { ccclass, property } = _decorator;

@ccclass('GateSettingDialogView')
export class GateSettingDialogView extends CocosBaseUiView implements IGateSettingDialogViewVM {
    viewModelComp: GateSettingDialogViewComp
    reset(): void {

    }
    /** 音乐开关 */
    @property
    _music_open: boolean = true
    @property({
        type: CCBoolean
    })
    get music_open() {
        return this._music_open
    }
    set music_open(val) {
        this._music_open = val
        let numval = val ? 1 : 0
        let chs = this.node.getChildByName('musics').children
        for (let i = 0; i < chs.length; i++) {
            const _node = chs[i];
            if (numval == i) {
                _node.active = true
            } else {
                _node.active = false
            }
        }
    }
    /** 音效开关 */
    @property
    _effect_open: boolean = true
    @property({
        type: CCBoolean
    })
    get effect_open() {
        return this._effect_open
    }
    set effect_open(val) {
        this._effect_open = val
        let numval = val ? 1 : 0
        let chs = this.node.getChildByName('effects').children
        for (let i = 0; i < chs.length; i++) {
            const _node = chs[i];
            if (numval == i) {
                _node.active = true
            } else {
                _node.active = false
            }
        }
    }
    protected onLoad(): void {
        this.setBindAttrMap({
            "music_open": 'GateSettingDialogViewComp::vm.music_open',
            "effect_open": 'GateSettingDialogViewComp::vm.effect_open',
        })
    }

    onMusicBtnClick() {
        this.viewModelComp.actions.onMusicBtnClick()
    }

    onEffectBtnClick() {
        this.viewModelComp.actions.onEffectBtnClick()
    }
}