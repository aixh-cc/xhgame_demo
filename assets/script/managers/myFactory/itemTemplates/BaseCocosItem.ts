import { IItem, IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"
import { v3, Component, Prefab, instantiate } from "cc"
import { CocosBaseItemView } from "db://assets/script/baseCocos/CocosBaseItemView"
import { xhgame } from "db://assets/script/xhgame"

export abstract class BaseCocosItem extends Component implements IItem {
    static className = 'BaseCocosItem'
    /** itemId */
    private _itemId: number = 0
    get itemId() {
        return this._itemId
    }
    set itemId(val) {
        this._itemId = val
    }
    /** itemNo */
    private _itemNo: string = ''
    get itemNo() {
        return this._itemNo
    }
    set itemNo(val) {
        this._itemNo = val
    }
    // 
    private _alive: boolean = false
    get alive() {
        return this._alive
    }
    set alive(val) {
        this._alive = val
    }
    /** 位置信息 */
    private _positions: number[] = [0, 0, 0]
    get positions() {
        return this._positions
    }
    set positions(val) {
        this._positions = val
        this.node.setPosition(v3(...val))
    }
    init(itemNo: string, itemId: number) {
        this._itemId = itemId
        this._itemNo = itemNo
    }
    baseAttrReset() {
        this.positions = [0, 0, 0]
        // 视图中数据层
        let _baseview = this.node.getComponentInChildren(CocosBaseItemView)
        if (_baseview) {
            return _baseview.reset()
        }
        this.mock_vm = null
    }
    mock_vm: any = null
    getViewVm<T>(): T {
        let _baseview = this.node.getComponentInChildren(CocosBaseItemView)
        if (_baseview) {
            return _baseview as T
        } else {
            if (this.mock_vm == null) {
                this.mock_vm = {}
            }
            return this.mock_vm
        }
    }
    abstract reset(): void
    abstract clone(): void
    abstract toScene(): void
    abstract toPool(): void
}

export abstract class BaseCocosItemProduceDrive<T extends BaseCocosItem> extends Component implements IItemProduceDrive {
    protected _prefab: Prefab
    protected _modelPrefabsMap: Map<string, Prefab> = new Map();
    // 
    abstract itemClass: any
    abstract bundleName: string
    abstract templatePath: string
    abstract bodyPath: string
    releaseItemsResource(itemNos?: string[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true) // todo 释放
        })
    }
    async preloadItemsResource(itemNos?: string[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            xhgame.asset.loadBundle(this.bundleName, (err, bundle) => {
                bundle.load<Prefab>(this.templatePath, (errp, prefab: Prefab) => {
                    if (errp) {
                        console.error(errp)
                        reject(false)
                        return
                    }
                    this._prefab = prefab
                    bundle.loadDir<Prefab>(this.bodyPath, (errp, prefabs: Prefab[]) => {
                        if (errp) {
                            console.error(errp)
                            reject(false)
                            return
                        }
                        prefabs.forEach((_prefab: Prefab) => {
                            if (_prefab instanceof Prefab && _prefab.name != '') {
                                this._modelPrefabsMap.set(_prefab.name, _prefab)
                            }
                        })
                        resolve(true)
                    })
                })
            })
        })
    }
    createItem(itemNo: string, itemId: number) {
        if (!this._prefab) {
            console.error(this.name + '工厂未提前preloadItemsResource,未获取到模板')
            return
        }
        let body_prefab = this._modelPrefabsMap.get(itemNo)
        if (!body_prefab) {
            console.error(this.name + '工厂未获取到itemNo=' + itemNo)
            return
        }
        let node = instantiate(this._prefab);
        let modelNode = instantiate(body_prefab)
        node.getChildByName('modelBody').addChild(modelNode)
        node.name = node.name + '_' + itemId
        return node.getComponent(this.itemClass) as T
    }
    removeItem(item: T) {
        item.node.removeFromParent()
    }
} 