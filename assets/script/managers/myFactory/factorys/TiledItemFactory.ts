import { IItem, BaseFactory, IItemProduceDrive } from "@aixh-cc/xhgame_ec_framework"
import { FactoryType } from "../../MyFactoryManager";

export interface ITiledItem extends IItem {
    // 特有的
}


export class TiledItemFactory<T extends IItemProduceDrive, TT extends ITiledItem> extends BaseFactory<T, TT> {
    name = FactoryType.tiledItem;
    get enums() {
        return TiledItemEnums
    }
}
enum TiledItemEnums {
    anS = 'anS'
}