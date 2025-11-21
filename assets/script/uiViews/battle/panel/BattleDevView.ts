import { _decorator } from "cc";
import { BattleDevViewComp } from 'db://assets/script/comps/battle/panel/BattleDevViewComp';
import { CocosBaseUiView } from 'db://assets/script/baseCocos/CocosBaseUiView';

const { ccclass, property } = _decorator;

@ccclass('BattleDevView')
export class BattleDevView extends CocosBaseUiView {

    reset(): void {

    }

    test_create_uiItem() {
        let comp = this.viewModelComp as BattleDevViewComp
        comp.actions.test_create_uiItem()
    }

    test_create_unitItem() {
        let comp = this.viewModelComp as BattleDevViewComp
        comp.actions.test_create_unitItem()
    }

    test_create_effectItem() {
        let comp = this.viewModelComp as BattleDevViewComp
        comp.actions.test_create_effectItem()
    }
}