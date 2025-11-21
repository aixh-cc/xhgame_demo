import { IItem, BaseFactory, IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"
import { FactoryType } from "../../MyFactoryManager";

export interface IUiItem extends IItem {
    itemsIndex: number
    active: boolean
    btnActive: boolean
    onClickCallback: Function
    onClickItem(): void
    playAnim(animName: string): void
    moveToUiRootPath(sec: number, path: string, children_index: number, offsetX: number, offsetY: number): void
}

export class UiItemFactory<T extends IItemProduceDrive, TT extends IUiItem> extends BaseFactory<T, TT> {
    name = FactoryType.uiItem;
    get enums() {
        return UiItemEnums
    }
}
enum UiItemEnums {
    mission_item = 'mission_item'
}