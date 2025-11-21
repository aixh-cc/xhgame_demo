import { BaseTable } from "@aixh-cc/xhgame_ec_framework";
import { TableType } from "../../MyTableManager";

export class SkillTable<T> extends BaseTable<T> {
    name = TableType.skill;
}

export interface ISkillTableItem {
    id: number,
    name: string,
    describe: string,
    icon_no: string,
    effect_no: string,
    val: number,
    skill_type: number,
    skill_nums: number,
    skill_values: number[],
    skill_points: number[][],
    audio_no: string,
    /** 技能伤害倍数 */
    skill_multiple: number
}
