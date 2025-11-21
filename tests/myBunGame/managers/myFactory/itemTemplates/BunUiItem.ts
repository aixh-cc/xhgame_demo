import { IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseBunItem } from "./BaseBunItem"
import { IUiItem } from "db://assets/script/managers/myFactory/factorys/UiItemFactory"

export class BunUiItem extends BaseBunItem implements IUiItem {
    static className = 'BunUiItem'
    /** 部分ui用到的组里的index */
    itemsIndex: number = 0
    active: boolean = false
    btnActive: boolean = true
    onClickCallback: Function = null
    playAnim(animName: string): void {
        console.log('BunUiItem playAnim ', animName)
    }
    mock_vm: any = null
    reset() {
        this.itemsIndex = 0
        this.active = false
        this.btnActive = true
        this.onClickCallback = null
        this.mock_vm = {}
    }
    clone() {

    }
    getViewVm<T>(): T {
        if (this.mock_vm == null) {
            this.mock_vm = {}
        }
        return this.mock_vm as T
    }
    toScene(): void {
        console.log('BunUiItem toScene ')
    }
    toPool(): void {

    }
    moveToUiRootPath(sec: number = 1, path: string, children_index: number = -1, offsetX: number = 0, offsetY: number = 0) {
        return new Promise((resolve, reject) => {
            xhgame.timer.scheduleOnce(() => {
                resolve(true)
            }, sec * 1000)
        })
    }
    onClickItem() {

    }

}

export class BunUiItemProduceDrive implements IItemProduceDrive {
    name: string = 'BunUiItemProduceDrive'
    createItem(itemNo: string, itemId: number) {
        return new BunUiItem()
    }
    removeItem(item: BunUiItem) {

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