import { BaseTable } from "@aixh-cc/xhgame_ec_framework";
import { TableType } from "../../MyTableManager";


export class HelpTable<T> extends BaseTable<T> {
    name = TableType.help;
}

export interface IHelpChatView {
    content: string
    rightAvatarNo: string
    leftAvatarNo: string
    picNo: string
}

export interface IHelpGuideViewVM {
    targetNodePath: string,
    text: string,
    text_size: string,
    text_pos_index: number,
    delay_time: number // 毫秒
}

export interface IHelpTableItem {
    eventName: string
    chatItems: IHelpChatView[]
    guideItems: IHelpGuideViewVM[]
    param: any
}
