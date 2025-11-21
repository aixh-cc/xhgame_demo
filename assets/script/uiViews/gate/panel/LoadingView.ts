import { Label, ProgressBar, _decorator } from 'cc';
import { CCFloat } from 'cc';
import { CCString } from 'cc';
import { CocosBaseUiView } from 'db://assets/script/baseCocos/CocosBaseUiView';

const { ccclass, property } = _decorator;

export interface ILoadingViewVM {
    /** tips */
    text: string
    /** 进度,1为100 */
    progress: number
}
/**
 * loading界面
 */
@ccclass('LoadingView')
export class LoadingView extends CocosBaseUiView implements ILoadingViewVM {

    @property
    _text: string = ''
    @property({ type: CCString, visible: true })
    get text() {
        return this._text
    }
    set text(val) {
        this._text = val
        this.node.getChildByPath('pro_progress/lab_prompt').getComponent(Label).string = val
    }

    @property
    _progress: number = 0
    @property({ type: CCFloat, visible: true })
    get progress() {
        return this._progress
    }
    set progress(val) {
        this._progress = val
        this.node.getChildByPath('pro_progress').getComponent(ProgressBar).progress = val
        this.node.getChildByPath('pro_progress/lab_progress').getComponent(Label).string = Math.ceil(val * 1000) / 10 + '%'
    }

    protected onLoad(): void {
        this.setBindAttrMap({
            "text": 'LoadingViewComp::vm.text',
            "progress": 'LoadingViewComp::vm.progress',
        })
    }
    reset(): void {
        this.text = ''
        this.progress = 0
    }
}