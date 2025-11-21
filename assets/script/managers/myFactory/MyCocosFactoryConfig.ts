import { IFactoryConfig } from "@aixh-cc/xhgame_ec_framework";
import { FactoryType } from "../MyFactoryManager";
import { CocosEffectItem, CocosEffectItemProduceDrive } from "db://assets/script/managers/myFactory/itemTemplates/CocosEffectItem";
import { EffectItemFactory } from "./factorys/EffectItemFactory";
import { CocosTextUiItem, CocosTextUiItemProduceDrive } from "db://assets/script/managers/myFactory/itemTemplates/CocosTextUiItem";
import { TextUiItemFactory } from "./factorys/TextUiItemFactory";
import { CocosTiledItem, CocosTiledItemProduceDrive } from "db://assets/script/managers/myFactory/itemTemplates/CocosTiledItem";
import { TiledItemFactory } from "./factorys/TiledItemFactory";
import { CocosUiItem, CocosUiItemProduceDrive } from "db://assets/script/managers/myFactory/itemTemplates/CocosUiItem";
import { UiItemFactory } from "./factorys/UiItemFactory";
import { CocosUnitItem, CocosUnitItemProduceDrive } from "db://assets/script/managers/myFactory/itemTemplates/CocosUnitItem";
import { UnitItemFactory } from "./factorys/UnitItemFactory";
import { CocosUnitUiItem, CocosUnitUiItemProduceDrive } from "db://assets/script/managers/myFactory/itemTemplates/CocosUnitUiItem";
import { UnitUiItemFactory } from "./factorys/UnitUiItemFactory";

export class MyCocosFactoryConfig implements IFactoryConfig {
    [FactoryType.effectItem]: EffectItemFactory<CocosEffectItemProduceDrive, CocosEffectItem> = (new EffectItemFactory<CocosEffectItemProduceDrive, CocosEffectItem>()).setItemProduceDrive(new CocosEffectItemProduceDrive());
    [FactoryType.textUiItem]: TextUiItemFactory<CocosTextUiItemProduceDrive, CocosTextUiItem> = (new TextUiItemFactory<CocosTextUiItemProduceDrive, CocosTextUiItem>()).setItemProduceDrive(new CocosTextUiItemProduceDrive());
    [FactoryType.tiledItem]: TiledItemFactory<CocosTiledItemProduceDrive, CocosTiledItem> = (new TiledItemFactory<CocosTiledItemProduceDrive, CocosTiledItem>()).setItemProduceDrive(new CocosTiledItemProduceDrive());
    [FactoryType.uiItem]: UiItemFactory<CocosUiItemProduceDrive, CocosUiItem> = (new UiItemFactory<CocosUiItemProduceDrive, CocosUiItem>()).setItemProduceDrive(new CocosUiItemProduceDrive());
    [FactoryType.unitItem]: UnitItemFactory<CocosUnitItemProduceDrive, CocosUnitItem> = (new UnitItemFactory<CocosUnitItemProduceDrive, CocosUnitItem>()).setItemProduceDrive(new CocosUnitItemProduceDrive());
    [FactoryType.unitUiItem]: UnitUiItemFactory<CocosUnitUiItemProduceDrive, CocosUnitUiItem> = (new UnitUiItemFactory<CocosUnitUiItemProduceDrive, CocosUnitUiItem>()).setItemProduceDrive(new CocosUnitUiItemProduceDrive());
}
const getFactoryType = () => {
    return FactoryType // 主要是为了 FactoryType 被正常使用着,不要被脚本去除无用引用给去除了
}