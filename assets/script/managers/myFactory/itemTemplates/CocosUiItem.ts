import { Button, UITransform, Animation, _decorator, Node, v3 } from "cc"
import { BaseCocosItemProduceDrive, BaseCocosItem } from "./BaseCocosItem";
import { xhgame } from "db://assets/script/xhgame";
import { CocosBaseItemView } from "db://assets/script/baseCocos/CocosBaseItemView";
import { IUiItem } from "../factorys/UiItemFactory";

const { ccclass, property } = _decorator;


@ccclass('CocosUiItem')
export class CocosUiItem extends BaseCocosItem implements IUiItem {
    static className = 'CocosUiItem'
    /** 部分ui用到的组里的index */
    itemsIndex: number = -1
    /** 大小信息 */
    _scales: number[] = [1, 1, 1]
    get scales() {
        return this._scales
    }
    set scales(val) {
        this._scales = val
        this.node.setScale(v3(...val))
    }
    _active: boolean = true
    get active() {
        return this._active
    }
    set active(val) {
        this._active = val
        this.node.active = val
    }
    _btnActive: boolean = true
    get btnActive() {
        return this._btnActive
    }
    set btnActive(val) {
        this._btnActive = val
        this.node.getComponent(Button).interactable = val
    }
    _nodeName: string = ''
    get nodeName() {
        if (this._nodeName == '') {
            this._nodeName = this.node.name
        }
        return this._nodeName
    }
    set nodeName(val) {
        this._nodeName = val
        this.node.name = val
    }
    onClickCallback: Function = null
    reset() {
        // 数据层
        this.itemsIndex = -1
        this.scales = [1, 1, 1] // 此处用this.scales
        this.active = true
        this.nodeName = CocosUiItem.className
        this.onClickCallback = null
    }
    clone() {

    }
    getModelView() {
        let _baseview = this.node.getComponentInChildren(CocosBaseItemView)
        if (_baseview) {
            return _baseview
        } else {
            console.error('【CocosUiItem】CocosBaseItemView is null')
        }
    }

    // todo 移除，由第三方驱动
    playAnim(animName: string): void {
        let _anim = this.node.getChildByName('modelBody').getComponentInChildren(Animation)
        if (_anim) {
            console.log('_anim', _anim, animName)
            _anim.play(animName)
        } else {
            console.error('【CocosUiItem】.playAnim anim is null')
        }
    }

    toScene(nodePath: string = ''): void {
        const gui_root = xhgame.gui.gui_root as Node
        if (nodePath != '') {
            gui_root.getChildByPath(nodePath).addChild(this.node)
            return
        }
        let toSceneNodePath = this.node.getComponentInChildren(CocosBaseItemView).toSceneNodePath
        if (toSceneNodePath == '') {
            gui_root.addChild(this.node)
        } else {
            gui_root.getChildByPath(toSceneNodePath).addChild(this.node)
        }
    }
    toPool(): void {
        xhgame.factory.getFactory(xhgame.factory.enums.uiItem).recycleItem(this)
    }
    // todo 移除，由第三方驱动
    moveToUiRootPath(sec: number = 1, path: string, children_index: number = -1, offsetX: number = 0, offsetY: number = 0) {
        return new Promise((resolve, reject) => {
            xhgame.timer.scheduleOnce(() => {
                resolve(true)
            }, sec * 1000)
        })
    }

    onClickItem() {
        this.onClickCallback && this.onClickCallback(this)
    }

}
export class CocosUiItemProduceDrive extends BaseCocosItemProduceDrive<CocosUiItem> {
    itemClass: typeof CocosUiItem = CocosUiItem
    bundleName: string = 'bundle_factory'
    templatePath: string = 'item_templates/cocosUiItem'
    bodyPath: string = 'item_views/uiItems'

    createItem(itemNo: string, itemId: number) {
        let item = super.createItem(itemNo, itemId)
        // 以下是uiItem特有处理
        let itemUITransform = item.node.getComponent(UITransform)
        let modelNode = item.node.getChildByName('modelBody').children[0]
        let bodyUITransform = modelNode.getComponent(UITransform)
        itemUITransform.setContentSize(bodyUITransform.contentSize)
        return item
    }
}