import { _decorator, Node } from "cc"
import { BaseCocosItemProduceDrive, BaseCocosItem } from "./BaseCocosItem";
import { xhgame } from "db://assets/script/xhgame";
import { ITiledItem } from "../factorys/TiledItemFactory";

const { ccclass, property } = _decorator;

@ccclass('CocosTiledItem')
export class CocosTiledItem extends BaseCocosItem implements ITiledItem {
    static className = 'CocosTiledItem'
    /** 部分ui用到的组里的index */
    itemsIndex: number = 0
    reset() {
        this.itemsIndex = 0
    }
    clone() {

    }
    toScene(): void {
        const world_root = xhgame.gui.world_root as Node
        world_root.getChildByPath('CenterNode/TiledsNode').addChild(this.node)
    }
    toPool(): void {
        xhgame.factory.getFactory(xhgame.factory.enums.tiledItem).recycleItem(this)
    }
}
export class CocosTiledItemProduceDrive extends BaseCocosItemProduceDrive<CocosTiledItem> {
    itemClass: typeof CocosTiledItem = CocosTiledItem
    bundleName: string = 'bundle_factory'
    templatePath: string = 'item_templates/cocosTiledItem'
    bodyPath: string = 'item_views/tiledItems'
}