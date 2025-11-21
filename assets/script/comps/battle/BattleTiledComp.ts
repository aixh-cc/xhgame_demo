import { System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseModelComp } from "@aixh-cc/xhgame_ec_framework"
import { ITiledItem } from "db://assets/script/managers/myFactory/factorys/TiledItemFactory"

export class BattleTiledSystem extends System {

    static async initComp(comp: BattleTiledComp) {
        let enums = xhgame.factory.getFactory(xhgame.factory.enums.tiledItem).enums
        let rand_map = this.tmp_getRandomEnum(enums, 'anS') // 随机取一个已安装的地图
        // 创建地图
        comp.mainTiled = xhgame.factory.getFactory(xhgame.factory.enums.tiledItem).produceItem(rand_map)
        comp.mainTiled.toScene()
        // 其他小环境
    }
    static tmp_getRandomEnum<T extends object>(
        enumObj: T,
        defaultValue: any
    ): T[keyof T] {
        const enumValues = Object.values(enumObj);
        const validValues = enumValues.filter(value =>
            typeof value === 'string' || typeof value === 'number'
        ) as T[keyof T][];

        return validValues.length > 0
            ? validValues[Math.floor(Math.random() * validValues.length)]
            : defaultValue;
    }

}

export class BattleTiledComp extends BaseModelComp {
    compName: string = 'BattleTiledComp'
    initBySystems: (typeof System)[] = [BattleTiledSystem]
    /** 地板 */
    tiledItems: ITiledItem[] = []
    /** 主地图 */
    mainTiled: ITiledItem = null
    reset() {
        for (let i = 0; i < this.tiledItems.length; i++) {
            const element = this.tiledItems[i];
            element.toPool()
        }
        this.tiledItems = []
        this.mainTiled.toPool()
        this.mainTiled = null
    }

    actions = {

    }

    onDetach() {

    }
}