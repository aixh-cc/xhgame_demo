import { BaseModelComp, System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"

export class GateSenceSystem extends System {
    static async initComp(comp: GateSenceComp) {
        await xhgame.gameEntity.attachComponentByRegisterName('GateViewComp').done()
        // 加载gate场景中可能用到的工厂及资源（因为不像battle一样有一个loading,所以这里手动加）
        await xhgame.factory.getFactory(xhgame.factory.enums.uiItem).preloadItemsResource()
        await xhgame.factory.getFactory(xhgame.factory.enums.textUiItem).preloadItemsResource()
    }
}

export class GateSenceComp extends BaseModelComp {
    compName: string = 'GateSenceComp'
    initBySystems = [GateSenceSystem]
    reset() {
    }
    actions = {
    }
    onDetach() {
        xhgame.gameEntity.detachComponentByRegisterName('GateViewComp')
    }
}



