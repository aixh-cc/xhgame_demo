
import { IEffectItem } from "db://assets/script/managers/myFactory/factorys/EffectItemFactory"
import { BaseBunItem } from "./BaseBunItem"
import { IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"

export class BunEffectItem extends BaseBunItem implements IEffectItem {
    static className = 'BunEffectItem'
    /** 特效时间，单位秒 */
    effectTime: number = 0  // 特效持续时间
    onToScene: Function = null
    reset() {
        this.effectTime = 0
    }
    clone() {
        this.effectTime = 0
        this.onToScene = null
    }
    toScene(): void {
        console.log('BunEffectItem toScene ')
    }
    toPool(): void {

    }
}

export class BunEffectItemProduceDrive implements IItemProduceDrive {
    name: string = 'BunEffectItemProduceDrive'
    createItem(itemNo: string, itemId: number) {
        return new BunEffectItem()
    }
    removeItem(item: BunEffectItem) {

    }
    preloadItemsResource(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            resolve(true)
        })
    }
    releaseItemsResource(itemNos?: string[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true)
        })
    }
}