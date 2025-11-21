import { IItem, BaseFactory, IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"
import { FactoryType } from "../../MyFactoryManager";

export interface ITextUiItem extends IItem {
    // 特有的
    content: string
    playTime: number
    playEndCallback: Function
}

export class TextUiItemFactory<T extends IItemProduceDrive, TT extends ITextUiItem> extends BaseFactory<T, TT> {
    name = FactoryType.textUiItem;
    get enums() {
        return TextUiItemEnums
    }
}
enum TextUiItemEnums {
    toast_item = 'toast_item'
}