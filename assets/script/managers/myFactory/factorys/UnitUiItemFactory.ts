import { IItem, BaseFactory, IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"
import { FactoryType } from "../../MyFactoryManager";
import { IUnitItem } from "./UnitItemFactory";

export interface IUnitUiItem extends IItem {
    atUnitItem: IUnitItem
    content: string
    active: boolean
    offsetPositions: number[]
    refreshHP(): void
}


export class UnitUiItemFactory<T extends IItemProduceDrive, TT extends IUnitUiItem> extends BaseFactory<T, TT> {
    name = FactoryType.unitUiItem;
    get enums() {
        return UnitUiItemEnums
    }
}
enum UnitUiItemEnums {
    blood = 'blood'
}