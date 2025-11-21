import { ITableConfig } from "@aixh-cc/xhgame_ec_framework";
import { TableType } from "../MyTableManager";
import { IBattleTableItem, BattleTable } from "./tables/BattleTable";
import { IHelpTableItem, HelpTable } from "./tables/HelpTable";
import { ISkillTableItem, SkillTable } from "./tables/SkillTable";
import { IUnitTableItem, UnitTable } from "./tables/UnitTable";

export class MyTableConfig implements ITableConfig {
    [TableType.battle]: BattleTable<IBattleTableItem> = (new BattleTable<IBattleTableItem>());
    [TableType.help]: HelpTable<IHelpTableItem> = (new HelpTable<IHelpTableItem>());
    [TableType.skill]: SkillTable<ISkillTableItem> = (new SkillTable<ISkillTableItem>());
    [TableType.unit]: UnitTable<IUnitTableItem> = (new UnitTable<IUnitTableItem>());
}
const getTableType = () => {
    return TableType // 主要是为了 TableType 被使用
}