import { _decorator, Node } from "cc"
import { CCBoolean } from "cc";
import { BaseCocosItem, BaseCocosItemProduceDrive } from "./BaseCocosItem";
import { xhgame } from "db://assets/script/xhgame";
import { IUnitItem } from "../factorys/UnitItemFactory";
import { IUnitUiItem } from "../factorys/UnitUiItemFactory";

const { ccclass, property } = _decorator;


@ccclass('CocosUnitItem')
export class CocosUnitItem extends BaseCocosItem implements IUnitItem {
    static className = 'CocosUnitItem'
    /** 血量组件code */
    unitUiItemCode: string = 'blood'
    /** 是否是玩家单位 */
    @property
    _owner_is_player: boolean = false
    @property({ type: CCBoolean, visible: true })
    get owner_is_player() {
        return this._owner_is_player
    }
    set owner_is_player(val) {
        this._owner_is_player = val
    }

    /** 是否显示 */
    _active: boolean = true
    get active() {
        return this._active
    }
    set active(val) {
        this._active = val
        this.node.active = val
        this.bloodUnitUiItem.active = val
    }
    /** 当前hp */
    _hp: number = 0
    get hp() {
        return this._hp
    }
    set hp(val) {
        if (val < 0) {
            val = 0
        }
        this._hp = val
        this.bloodUnitUiItem.content = val.toString()
    }
    /** 最大hp */
    _maxHp: number = 0
    get maxHp() {
        return this._maxHp
    }
    set maxHp(val) {
        this._maxHp = val
    }
    idle(): void {
        // todo
        // this.state.stand()
    }
    die(): void {
        // todo
        // this.state.die()
    }
    /** 当前单位状态(只能通过方法修改) */
    private _bloodUnitUiItem: IUnitUiItem = null
    get bloodUnitUiItem() {
        if (this._bloodUnitUiItem == null) {
            this._bloodUnitUiItem = xhgame.factory.getFactory(xhgame.factory.enums.unitUiItem).produceItem(this.unitUiItemCode)
            this._bloodUnitUiItem.atUnitItem = this
            this._bloodUnitUiItem.offsetPositions = [-10, 30, 0]
        }
        return this._bloodUnitUiItem
    }

    /** 获取单位状态 todo */
    state: any
    // private _state: IUnitState
    // get state(): IUnitState {
    //     if (this._state == null) {
    //         this.state = new StandingState()
    //     }
    //     return this._state;
    // }
    // /** 设置单位状态 */
    // set state(state: IUnitState) {
    //     this._state = state;
    //     state.enterState(this);
    // }
    getModelName() {
        return this.itemNo
    }
    /** 单位动画 todo 移除 */
    public animator: any
    /** 部分单位状态动态没有很快达到，需要onToScene来实现 */
    onToScene: Function = null
    reset() {
        this.idle()
        this._owner_is_player = false
        this.positions = [0, 0, 0]
        this._hp = 0
        this._maxHp = 0
        this._active = true
        this.onToScene = null
        this._bloodUnitUiItem = null
    }
    lookAt(x: number = 0, y: number = 0, z: number = 0) {

    }
    clone() {

    }
    toScene(): void {
        const world_root = xhgame.gui.world_root as Node
        world_root.getChildByPath('CenterNode/UnitsNode').addChild(this.node)
        this.onToScene && this.onToScene()
        this.bloodUnitUiItem.toScene()
        // 下一帧播放触发onToScene
        requestAnimationFrame(() => {
            this.onToScene && this.onToScene()
        })
    }
    toPool(): void {
        xhgame.factory.getFactory(xhgame.factory.enums.unitItem).recycleItem(this)
    }
}
export class CocosUnitItemProduceDrive extends BaseCocosItemProduceDrive<CocosUnitItem> {
    itemClass: typeof CocosUnitItem = CocosUnitItem
    bundleName: string = 'bundle_factory'
    templatePath: string = 'item_templates/cocosUnitItem'
    bodyPath: string = 'item_views/unitItems'
}