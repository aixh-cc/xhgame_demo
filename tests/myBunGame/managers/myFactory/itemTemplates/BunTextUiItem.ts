import { IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseBunItem } from "./BaseBunItem"
import { ITextUiItem } from "db://assets/script/managers/myFactory/factorys/TextUiItemFactory"

export class BunTextUiItem extends BaseBunItem implements ITextUiItem {
    static className = 'BunTextUiItem'
    content: string = ''
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
        xhgame.timer.scheduleOnce(() => {
            this.toPool()
        }, this.playTime)
    }
    toPool(): void {

    }
}

export class BunTextUiItemProduceDrive implements IItemProduceDrive {
    name: string = 'BunTextUiItemProduceDrive'
    createItem(itemNo: string, itemId: number) {
        // 直接new一个
        return new BunTextUiItem()
    }
    removeItem(item: BunTextUiItem) {
        // 无node.parent关系
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