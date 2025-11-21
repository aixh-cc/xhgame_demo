import { _decorator } from "cc";
import { GateGroupMissionViewComp } from "db://assets/script/comps/gate/dialog/GateGroupMissionViewComp";
import { CocosBaseUiView } from "db://assets/script/baseCocos/CocosBaseUiView";

const { ccclass, property } = _decorator;

@ccclass('GateGroupMissionView')
export class GateGroupMissionView extends CocosBaseUiView {
    viewModelComp: GateGroupMissionViewComp;
    reset(): void {

    }
    chooseSelectedToPlay() {
        this.viewModelComp.actions.chooseSelectedToPlay()
    }
}