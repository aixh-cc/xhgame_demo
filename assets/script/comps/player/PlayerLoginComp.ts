import { System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseModelComp } from "@aixh-cc/xhgame_ec_framework"

/**
 * 小程序登录
 */
export class PlayerLoginSystem extends System {
    static async initComp(comp: PlayerLoginComp) {
        // 通过小程序登录sdk获取code
        let ret = await xhgame.gameEntity.safeGetComponentByRegisterName('SdkComp').actions.login()
        // 通过code向自己服务器获取登录后的account
        const playerModelComp = xhgame.gameEntity.safeGetComponentByRegisterName('PlayerModelComp')
        await playerModelComp.actions.getAccount({
            code: ret.code,
            anonymousCode: ret.anonymousCode,
        })
        // 通过account获取自己被分配到的区域服务器
        await playerModelComp.actions.postPlayerEnter()
    }
}

export class PlayerLoginComp extends BaseModelComp {
    compName: string = 'PlayerLoginComp'
    initBySystems: (typeof System)[] = [PlayerLoginSystem]

    reset() {

    }
    actions = {

    }

    onDetach() {

    }
}