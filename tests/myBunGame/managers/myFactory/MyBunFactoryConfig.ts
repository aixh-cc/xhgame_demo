import { IFactoryConfig } from "@aixh-cc/xhgame_ec_framework";
import { FactoryType } from "db://assets/script/managers/MyFactoryManager";
import { BunEffectItem, BunEffectItemProduceDrive } from "../../managers/myFactory/itemTemplates/BunEffectItem";
import { EffectItemFactory } from "db://assets/script/managers/myFactory/factorys/EffectItemFactory";
import { BunTextUiItem, BunTextUiItemProduceDrive } from "../../managers/myFactory/itemTemplates/BunTextUiItem";
import { TextUiItemFactory } from "db://assets/script/managers/myFactory/factorys/TextUiItemFactory";
import { BunTiledItem, BunTiledItemProduceDrive } from "../../managers/myFactory/itemTemplates/BunTiledItem";
import { TiledItemFactory } from "db://assets/script/managers/myFactory/factorys/TiledItemFactory";
import { BunUiItem, BunUiItemProduceDrive } from "../../managers/myFactory/itemTemplates/BunUiItem";
import { UiItemFactory } from "db://assets/script/managers/myFactory/factorys/UiItemFactory";
import { BunUnitItem, BunUnitItemProduceDrive } from "../../managers/myFactory/itemTemplates/BunUnitItem";
import { UnitItemFactory } from "db://assets/script/managers/myFactory/factorys/UnitItemFactory";
import { BunUnitUiItem, BunUnitUiItemProduceDrive } from "../../managers/myFactory/itemTemplates/BunUnitUiItem";
import { UnitUiItemFactory } from "db://assets/script/managers/myFactory/factorys/UnitUiItemFactory";

export class MyBunFactoryConfig implements IFactoryConfig {
    [FactoryType.effectItem]: EffectItemFactory<BunEffectItemProduceDrive, BunEffectItem> = (new EffectItemFactory<BunEffectItemProduceDrive, BunEffectItem>()).setItemProduceDrive(new BunEffectItemProduceDrive());
    [FactoryType.textUiItem]: TextUiItemFactory<BunTextUiItemProduceDrive, BunTextUiItem> = (new TextUiItemFactory<BunTextUiItemProduceDrive, BunTextUiItem>()).setItemProduceDrive(new BunTextUiItemProduceDrive());
    [FactoryType.tiledItem]: TiledItemFactory<BunTiledItemProduceDrive, BunTiledItem> = (new TiledItemFactory<BunTiledItemProduceDrive, BunTiledItem>()).setItemProduceDrive(new BunTiledItemProduceDrive());
    [FactoryType.uiItem]: UiItemFactory<BunUiItemProduceDrive, BunUiItem> = (new UiItemFactory<BunUiItemProduceDrive, BunUiItem>()).setItemProduceDrive(new BunUiItemProduceDrive());
    [FactoryType.unitItem]: UnitItemFactory<BunUnitItemProduceDrive, BunUnitItem> = (new UnitItemFactory<BunUnitItemProduceDrive, BunUnitItem>()).setItemProduceDrive(new BunUnitItemProduceDrive());
    [FactoryType.unitUiItem]: UnitUiItemFactory<BunUnitUiItemProduceDrive, BunUnitUiItem> = (new UnitUiItemFactory<BunUnitUiItemProduceDrive, BunUnitUiItem>()).setItemProduceDrive(new BunUnitUiItemProduceDrive());
}
const getFactoryType = () => {
    return FactoryType // 主要是为了 FactoryType 被正常使用着,不要被脚本去除无用引用给去除了
}