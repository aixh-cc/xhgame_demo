import { IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"
import { BaseBunItem } from "./BaseBunItem"
import { ITiledItem } from "db://assets/script/managers/myFactory/factorys/TiledItemFactory"

export class BunTiledItem extends BaseBunItem implements ITiledItem {
    static className = 'BunTiledItem'
    getViewVm() {
        return null
    }
    itemsIndex: number = 0
    reset() {
        this.itemsIndex = 0
    }
    clone() {

    }
    toScene(): void {

    }
    toPool(): void {

    }
}

export class BunTiledItemProduceDrive implements IItemProduceDrive {
    name: string = 'BunTiledItemProduceDrive'
    createItem(itemNo: string, itemId: number) {
        return new BunTiledItem()
    }
    removeItem(item: BunTiledItem) {

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