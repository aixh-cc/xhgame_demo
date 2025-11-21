import { _decorator, Label, ProgressBar } from "cc";
import { CCFloat } from "cc";
import { CCInteger } from "cc";
import { CCString } from "cc";
import { xhgame } from "db://assets/script/xhgame"
import { v3 } from "cc";
import { CocosBaseUiView } from 'db://assets/script/baseCocos/CocosBaseUiView';

const { ccclass, property } = _decorator;
export interface IBattleViewVM {
    magicValue: number
    missionValue: number
    playtimeFormat: string
}

@ccclass('BattleView')
export class BattleView extends CocosBaseUiView implements IBattleViewVM {

    /** 魔法进度 */
    @property
    _magicValue: number = 0;
    @property({ type: CCFloat, visible: true })
    get magicValue() {
        return this._magicValue
    }
    set magicValue(val) {
        this._magicValue = val
        this.node.getChildByPath('top/ProgressBar').getComponent(ProgressBar).progress = val
    }

    /** 星星进度 */
    @property
    _starValue: number = 0;
    @property({ type: CCFloat, visible: true })
    get starValue() {
        return this._starValue
    }
    set starValue(val) {
        this._starValue = val
        this.node.getChildByPath('top/StarProgressBar').getComponent(ProgressBar).progress = val
        if (val >= 0.3 && val < 0.6) {
            // 显示第一个星
            this.node.getChildByPath('top/StarProgressBar/xing1/empty').active = false
            this.node.getChildByPath('top/StarProgressBar/xing2/empty').active = true
            this.node.getChildByPath('top/StarProgressBar/xing3/empty').active = true
        } else if (val >= 0.6 && val < 1) {
            this.node.getChildByPath('top/StarProgressBar/xing1/empty').active = false
            this.node.getChildByPath('top/StarProgressBar/xing2/empty').active = false
            this.node.getChildByPath('top/StarProgressBar/xing3/empty').active = true
        } else if (val >= 1) {
            this.node.getChildByPath('top/StarProgressBar/xing1/empty').active = false
            this.node.getChildByPath('top/StarProgressBar/xing2/empty').active = false
            this.node.getChildByPath('top/StarProgressBar/xing3/empty').active = false
        } else {
            this.node.getChildByPath('top/StarProgressBar/xing1/empty').active = true
            this.node.getChildByPath('top/StarProgressBar/xing2/empty').active = true
            this.node.getChildByPath('top/StarProgressBar/xing3/empty').active = true
        }
    }

    /** 剩余步数 */
    @property
    _remainStep: number = 0;
    @property({ type: CCInteger, visible: true })
    get remainStep() {
        return this._remainStep
    }
    set remainStep(val) {
        this._remainStep = val
        this.node.getChildByPath('top/star_bars/remain_step').getComponent(Label).string = val.toString();
    }

    /** 关卡值 */
    @property
    _missionValue: number = 0;
    @property({ type: CCFloat, visible: true })
    get missionValue() {
        return this._missionValue
    }
    set missionValue(val) {
        this._missionValue = val
        this.node.getChildByPath('top/battleId/text').getComponent(Label).string = val.toString();
    }

    /** 时间 */
    @property
    _playtimeFormat: string = '';
    @property({ type: CCString, visible: true })
    get playtimeFormat() {
        return this._playtimeFormat
    }
    set playtimeFormat(val) {
        this._playtimeFormat = val
        this.node.getChildByPath('top/star_bars/playtime').getComponent(Label).string = val
    }

    reset(): void {
        this.magicValue = 0
        this.starValue = 0
        this.remainStep = 0
        this.missionValue = 0
    }

    protected onLoad(): void {
        this.setBindAttrMap({
            "remainStep": 'BattleModelComp::remainStep',
            "missionValue": 'BattleModelComp::battleId',
            "starValue": 'BattleModelComp::starValue',
            "magicValue": 'BattleModelComp::magicValue',
        })
    }

    protected onEnable(): void {
        // 摄像头。目前没专门处理摄像头的，只能先放这里
        xhgame.gui.world_root.getChildByName('CenterNode').getChildByName('CameraNode').eulerAngles = v3(30, 0, 0)
    }
}