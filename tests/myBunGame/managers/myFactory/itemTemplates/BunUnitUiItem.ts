
import { IUnitUiItem } from "db://assets/script/managers/myFactory/factorys/UnitUiItemFactory"
import { BaseBunItem } from "./BaseBunItem"
import { IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"
import { IUnitItem } from "db://assets/script/managers/myFactory/factorys/UnitItemFactory"


export class BunUnitUiItem extends BaseBunItem implements IUnitUiItem {
    static className = 'BunUnitUiItem'
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
    _content: string = ''
    get content() {
        return this._content
    }
    set content(val) {
        this._content = val
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
        console.log('BunUnitUiItem toScene ')
    }
    toPool(): void {

    }
    /** 当位置或者初始化时更新一下 */
    refreshHP(): void {

    }
}

export class BunUnitUiItemProduceDrive implements IItemProduceDrive {
    name: string = 'BunUnitUiItemProduceDrive'
    createItem(itemNo: string, itemId: number) {
        return new BunUnitUiItem()
    }
    removeItem(item: BunUnitUiItem) {

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