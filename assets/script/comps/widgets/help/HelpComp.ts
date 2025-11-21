
import { System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseModelComp } from "@aixh-cc/xhgame_ec_framework"
import { HelpChatViewComp } from "./HelpChatViewComp"
import { HelpGuideComp } from "./HelpGuideComp"
import { IHelpTableItem } from "db://assets/script/managers/myTable/tables/HelpTable"

export class HelpSystem extends System {

    static async initComp(comp: HelpComp) {
        return new Promise((resolve, reject) => {
            comp.helpItems = xhgame.table.getTable(xhgame.table.enums.help).getList()
            for (let i = 0; i < comp.helpItems.length; i++) {
                const helpItem = comp.helpItems[i];
                let str = helpItem.eventName + JSON.stringify(helpItem.param)
                if (comp.strNames.indexOf(str) > -1) {
                    console.error('已存在相同事件名和参数的item,请合并')
                }
                comp.strNames.push(str)
                xhgame.event.setTag('helpComp').on(helpItem.eventName, async (event, obj) => {
                    console.log('helpComp ', helpItem.eventName, helpItem.chatItems, JSON.stringify(obj), JSON.stringify(helpItem.param))
                    await HelpSystem.doChat(comp, helpItem, obj)
                    await HelpSystem.doGuide(comp, helpItem, obj)
                })
            }
            resolve(true)
        })
    }

    static async doChat(comp: HelpComp, helpItem: IHelpTableItem, obj: any) {
        return new Promise<boolean>((resolve, reject) => {
            if (helpItem.chatItems.length > 0 && JSON.stringify(obj) == JSON.stringify(helpItem.param)) {
                console.log('xhgame.gameEntity.attachComponent(HelpChatViewComp')
                xhgame.gameEntity.attachComponent(HelpChatViewComp).setup({
                    items: helpItem.chatItems,
                    onComplete: () => {
                        comp.resolveCallback && comp.resolveCallback(true)
                        xhgame.gameEntity.detachComponent(HelpChatViewComp)
                        resolve(true)
                    }
                })
            } else {
                resolve(true)
            }
        })
    }

    static async doGuide(comp: HelpComp, helpItem: IHelpTableItem, obj: any) {
        return new Promise<boolean>((resolve, reject) => {
            if (helpItem.guideItems.length > 0 && JSON.stringify(obj) == JSON.stringify(helpItem.param)) {
                console.log('xhgame.gameEntity.attachComponent(HelpChatViewComp')
                xhgame.gameEntity.attachComponent(HelpGuideComp).setup({
                    items: helpItem.guideItems,
                    onComplete: () => {
                        comp.resolveCallback && comp.resolveCallback(true)
                        xhgame.gameEntity.detachComponent(HelpGuideComp)
                    }
                })
            } else {
                resolve(true)
            }
        })
    }

    static playHelpOnEvent(comp: HelpComp, eventName: string, eventObj: any) {
        return new Promise<boolean>((resolve, reject) => {
            let str = eventName + JSON.stringify(eventObj)
            if (comp.strNames.indexOf(str) > -1) {
                comp.resolveCallback = resolve
            } else {
                resolve(true) // 没有直接返回
            }
        })
    }
}

export class HelpComp extends BaseModelComp {
    compName: string = 'HelpComp'
    initBySystems: (typeof System)[] = [HelpSystem]
    // 
    helpItems: IHelpTableItem[] = []
    strNames: String[] = []
    resolveCallback: (value: boolean) => void = null
    reset() {
        this.helpItems = []
        this.strNames = []
        this.resolveCallback = null
    }
    actions = {
        playHelpOnEvent: (eventName: string, eventObj: any) => {
            return HelpSystem.playHelpOnEvent(this, eventName, eventObj)
        }
    }

    onDetach() {

    }
}