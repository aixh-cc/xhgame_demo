import { CCString, Node } from "cc";
import { _decorator, Animation, Label, v3 } from "cc"
import { BaseCocosItemProduceDrive, BaseCocosItem } from "./BaseCocosItem";
import { xhgame } from "db://assets/script/xhgame";
import { ITextUiItem } from "../factorys/TextUiItemFactory";

const { ccclass, property } = _decorator;

@ccclass('CocosTextUiItem')
export class CocosTextUiItem extends BaseCocosItem implements ITextUiItem {
    static className = 'CocosTextUiItem'
    @property
    _content: string = ''
    @property({ type: CCString, visible: true })
    get content() {
        return this._content
    }
    set content(val) {
        this._content = val
        this.getComponentInChildren(Label).string = val
    }
    /** 播放时间(秒) */
    playTime: number = 0
    playEndCallback: Function = null
    reset() {
        this.content = ''
        this.playTime = 0
        this.playEndCallback = null
    }
    clone() {

    }
    toScene(): void {
        this.node.setPosition(v3(...this.positions))
        const gui_root = xhgame.gui.gui_root as Node
        gui_root.addChild(this.node)
        requestAnimationFrame(() => {
            let _anim = this.node.getChildByName('modelBody').getComponentInChildren(Animation)
            if (_anim) {
                _anim.play(_anim.clips[0].name);
                xhgame.timer.scheduleOnce(() => {
                    this.playEndCallback && this.playEndCallback()
                    _anim.stop();
                    this.toPool()
                }, this.playTime * 1000)
            }
        })
    }
    toPool(): void {
        xhgame.factory.getFactory(xhgame.factory.enums.textUiItem).recycleItem(this)
    }
}
export class CocosTextUiItemProduceDrive extends BaseCocosItemProduceDrive<CocosTextUiItem> {
    itemClass: typeof CocosTextUiItem = CocosTextUiItem
    bundleName: string = 'bundle_factory'
    templatePath: string = 'item_templates/cocosTextUiItem'
    bodyPath: string = 'item_views/textUiItems'
}