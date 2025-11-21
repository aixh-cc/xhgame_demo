import { _decorator, CCString, Camera, Label, Node, v3, Vec3 } from "cc"
import { BaseCocosItem, BaseCocosItemProduceDrive } from "./BaseCocosItem";
import { xhgame } from "db://assets/script/xhgame";
import { IUnitUiItem } from "../factorys/UnitUiItemFactory";
import { IUnitItem } from "../factorys/UnitItemFactory";
const { ccclass, property } = _decorator;


@ccclass('CocosUnitUiItem')
export class CocosUnitUiItem extends BaseCocosItem implements IUnitUiItem {
    static className = 'CocosUnitUiItem'
    /** 跟随的单位 */
    private _atUnitItem: IUnitItem = null
    get atUnitItem() {
        return this._atUnitItem
    }
    set atUnitItem(val) {
        this._atUnitItem = val
    }
    offsetPositions: number[] = [0, 0, 0]
    _active: boolean = true
    get active() {
        return this._active
    }
    set active(val) {
        this._active = val
        this.node.active = val
    }
    @property
    _content: string = ''
    @property({ type: CCString, visible: true })
    get content() {
        return this._content
    }
    set content(val) {
        this._content = val
        if (this.getComponentInChildren(Label)) {
            this.getComponentInChildren(Label).string = val
        }
    }
    reset() {
        this._atUnitItem = null
        this.offsetPositions = [0, 0, 0]
        this.active = true
        this.content = ''
    }
    clone() {

    }
    toScene(): void {
        const gui_root = xhgame.gui.gui_root as Node
        gui_root.getChildByName('unitUiItems').addChild(this.node)
        this.refreshHP()
    }
    toPool(): void {
        xhgame.factory.getFactory(xhgame.factory.enums.unitUiItem).recycleItem(this)
    }

    /** 当位置或者初始化时更新一下 */
    refreshHP(): void {
        if (this.atUnitItem && this.atUnitItem.node) {
            var outPos: Vec3 = v3(0, 0, 0);
            let atUnitItemNode: Node = this.atUnitItem.node
            const world_root = xhgame.gui.world_root as Node
            const gui_root = xhgame.gui.gui_root as Node
            world_root.getChildByName('CenterNode').getChildByName('CameraNode').getComponentInChildren(Camera).convertToUINode(atUnitItemNode.worldPosition, gui_root, outPos);
            outPos.add(v3(...this.offsetPositions));
            this.positions = [outPos.x, outPos.y, outPos.z]
        }
    }
    protected update(dt: number): void {
        this.refreshHP() // todo 
    }

}
export class CocosUnitUiItemProduceDrive extends BaseCocosItemProduceDrive<CocosUnitUiItem> {
    itemClass: typeof CocosUnitUiItem = CocosUnitUiItem
    bundleName: string = 'bundle_factory'
    templatePath: string = 'item_templates/cocosUnitUiItem'
    bodyPath: string = 'item_views/unitUiItems'
}