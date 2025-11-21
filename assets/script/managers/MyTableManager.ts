import { DI, TableManager } from "@aixh-cc/xhgame_ec_framework"
import { MyTableConfig } from "./myTable/MyTableConfig";

/** 数据管理 */
export class MyTableManager extends TableManager<MyTableConfig> {

    constructor() {
        super(DI.make<MyTableConfig>('ITableConfig'))
    }

    get enums() {
        return TableType
    }
}

export enum TableType {
    battle = 'battle',
    help = 'help',
    skill = 'skill',
    unit = 'unit'
}