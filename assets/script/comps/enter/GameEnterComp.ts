import { xhgame } from "db://assets/script/xhgame"
import { BaseModelComp, System } from "@aixh-cc/xhgame_ec_framework"

export class GameEnterSystem extends System {
    static async initComp(comp: GameEnterComp) {
        await Promise.all([
            await xhgame.gameEntity.attachComponentByRegisterName('GateSenceComp').done(), // 
        ])
        if (xhgame.gameEntity.isExistComponentByRegisterName('PlayerLoginComp')) {
            await xhgame.gameEntity.attachComponentByRegisterName('PlayerLoginComp').done()
        }
        if (xhgame.gameEntity.isExistComponentByRegisterName('HelpComp')) {
            await xhgame.gameEntity.attachComponentByRegisterName('HelpComp').done() // 新增指引
        }
    }
}

export class GameEnterComp extends BaseModelComp {
    compName: string = 'GameEnterComp'
    initBySystems: (typeof System)[] = [GameEnterSystem]
    reset() {
    }
    actions = {

    }
    onDetach() {

    }
}


