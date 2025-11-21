import { IItem, BaseFactory, IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"
import { FactoryType } from "../../MyFactoryManager";
import { IUnitUiItem } from "./UnitUiItemFactory";

export interface IUnitItem extends IItem {
    /** 是否是玩家单位 */
    owner_is_player: boolean
    animator: any // 
    hp: number
    maxHp: number
    bloodUnitUiItem: IUnitUiItem
    state: any // IUnitState
    active: boolean
    getModelName(): string
    // 动作
    idle(): void
    die(): void
    lookAt(x: number, y: number, z: number): void
    /** 部分单位动画状态可能有延迟，需要onToScene来实现 */
    onToScene: Function
}

export class UnitItemFactory<T extends IItemProduceDrive, TT extends IUnitItem> extends BaseFactory<T, TT> {
    name = FactoryType.unitItem;
    get enums() {
        return UnitItemEnums
    }
}
enum UnitItemEnums {
    aula = 'aula'
}