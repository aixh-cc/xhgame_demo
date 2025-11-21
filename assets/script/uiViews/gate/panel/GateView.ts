import { Label, _decorator } from 'cc';
import { CCInteger } from 'cc';
import { CCString } from 'cc';
import { GateViewComp } from 'db://assets/script/comps/gate/panel/GateViewComp';
import { CocosBaseUiView } from 'db://assets/script/baseCocos/CocosBaseUiView';

const { ccclass, property } = _decorator;

interface IGateViewVM {
    ps: number,
    gold: number,
    diamond: number,
    battleId: number,
    groupName: string
}
/**
 * gate界面
 */
@ccclass('GateView')
export class GateView extends CocosBaseUiView implements IGateViewVM {
    /** ps */
    @property
    _ps: number = 0;
    @property({ type: CCInteger, visible: true })
    get ps() {
        return this._ps
    }
    set ps(val) {
        this._ps = val
        if (val != null) {
            this.node.getChildByPath('top/ps/value').getComponent(Label).string = val.toString()
        }
    }

    /** gold */
    @property
    _gold: number = 0;
    @property({ type: CCInteger, visible: true })
    get gold() {
        return this._gold
    }
    set gold(val) {
        this._gold = val
        if (val != null) {
            this.node.getChildByPath('top/gold/value').getComponent(Label).string = val.toString()
        }
    }

    /** diamond */
    @property
    _diamond: number = 0;
    @property({ type: CCInteger, visible: true })
    get diamond() {
        return this._diamond
    }
    set diamond(val) {
        this._diamond = val
        if (val != null) {
            this.node.getChildByPath('top/diamond/value').getComponent(Label).string = val.toString()
        }
    }

    /** battleId */
    @property
    _battleId: number = 0;
    @property({ type: CCInteger, visible: true })
    get battleId() {
        return this._battleId
    }
    set battleId(val) {
        this._battleId = val
        if (val != null) {
            this.node.getChildByPath('main/mission/homeBox02/curBattleIdText').getComponent(Label).string = '当前第' + val.toString() + '关'
        }
    }

    /** groupName */
    @property
    _groupName: string = '';
    @property({ type: CCString, visible: true })
    get groupName() {
        return this._groupName
    }
    set groupName(val) {
        this._groupName = val
        this.node.getChildByPath('main/mission/homeBox01/text').getComponent(Label).string = val.toString()
    }
    reset(): void {
        this.ps = 0
        this.gold = 0
        this.diamond = 0
        this.battleId = 99
        this.groupName = ''
    }

    protected onLoad(): void {
        console.log('GateView  this.setBindAttrMap')
        this.setBindAttrMap({
            "ps": 'PlayerModelComp::playerInfo.ps',
            "gold": 'PlayerModelComp::playerInfo.gold',
            "diamond": 'PlayerModelComp::playerInfo.diamond',
            "battleId": 'PlayerModelComp::selectedBattleId',
        })
        this.node.getChildByName('bottom').getChildByName('startGame').active = false
    }

    protected onEnable(): void {
        this.node.getChildByName('bottom').getChildByName('startGame').active = true
    }

    enterGame() {
        let comp = this.viewModelComp as GateViewComp
        comp.actions.startBattle()
    }

    openGateGroupMission() {
        let comp = this.viewModelComp as GateViewComp
        comp.actions.openGateGroupMission()
    }

    openSettingDialog() {
        let comp = this.viewModelComp as GateViewComp
        comp.actions.openSettingDialog()
    }

}