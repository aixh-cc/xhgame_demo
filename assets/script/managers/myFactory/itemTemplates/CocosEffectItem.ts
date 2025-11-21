import { _decorator, Node } from "cc"
import { Animation } from "cc";
import { BaseCocosItemProduceDrive, BaseCocosItem } from "db://assets/script/managers/myFactory/itemTemplates/BaseCocosItem";
import { xhgame } from "db://assets/script/xhgame";
import { IEffectItem } from "../factorys/EffectItemFactory";

const { ccclass, property } = _decorator;


@ccclass('CocosEffectItem')
export class CocosEffectItem extends BaseCocosItem implements IEffectItem {
    static className = 'CocosEffectItem'
    /** 特效时间，单位秒 */
    effectTime: number = 0  // 特效持续时间
    onToScene: Function = null
    reset() {
        this.effectTime = 0
        this.onToScene = null
    }
    clone() {

    }
    toScene(): void {
        this.node.active = true
        const world_root = xhgame.gui.world_root as Node
        world_root.getChildByPath('CenterNode/UnitsNode').addChild(this.node)
        // 下一帧播放触发onToScene
        requestAnimationFrame(() => {
            this.onToScene && this.onToScene()
            // 特效基本播放完就回收了
            xhgame.timer.scheduleOnce(() => {
                this.toPool()
            }, this.effectTime * 1000)
        })
    }
    toPool(): void {
        let anis = this.node.getComponentsInChildren(Animation)
        for (let i = 0; i < anis.length; i++) {
            const _ani = anis[i];
            _ani.resume()
        }
        xhgame.factory.getFactory(xhgame.factory.enums.effectItem).recycleItem(this)
    }
}
export class CocosEffectItemProduceDrive extends BaseCocosItemProduceDrive<CocosEffectItem> {
    itemClass: typeof CocosEffectItem = CocosEffectItem
    bundleName: string = 'bundle_factory'
    templatePath: string = 'item_templates/cocosEffectItem'
    bodyPath: string = 'item_views/effectItems'
}