
import { System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseModelComp } from "@aixh-cc/xhgame_ec_framework"

export class BattleDevViewSystem extends System {

    static async initComp(comp: BattleDevViewComp) {
        await xhgame.gui.openUIAsync(xhgame.gui.enums.battle_dev, comp)
    }

    static test_create_uiItem(comp: BattleDevViewComp) {
        let enums = xhgame.factory.getFactory(xhgame.factory.enums.uiItem).enums
        let rand_code = this.tmp_getRandomEnum(enums, 'mission_item') // 随机取一个
        let item = xhgame.factory.getFactory(xhgame.factory.enums.uiItem).produceItem(rand_code)
        let x = Math.random() * 600 - 300
        let y = Math.random() * 600 - 300
        item.positions = [x, y, 0]
        item.toScene('battle_index')
        xhgame.timer.scheduleOnce(() => {
            item.toPool() // 正常ui单位是不会自动移除的，这里是定时移除
        }, 1000)
    }

    static test_create_unitItem(comp: BattleDevViewComp) {
        let enums = xhgame.factory.getFactory(xhgame.factory.enums.unitItem).enums
        let rand_code = this.tmp_getRandomEnum(enums, 'aula') // 随机取一个
        let hp = 9
        let _item = xhgame.factory.getFactory(xhgame.factory.enums.unitItem).produceItem(rand_code)
        // 随机生成-300~300的坐标
        let x = Math.random() * 600 - 300
        let y = Math.random() * 600 - 300
        _item.positions = [x, y, 0]
        _item.hp = hp
        _item.maxHp = hp
        _item.owner_is_player = true
        _item.onToScene = () => {
            _item.idle()
            _item.lookAt(0, 0, 0)
        }
        _item.toScene()
    }

    static test_create_effectItem(comp: BattleDevViewComp) {
        let enums = xhgame.factory.getFactory(xhgame.factory.enums.effectItem).enums
        let rand_code = this.tmp_getRandomEnum(enums, 'ice') // 随机取一个
        let _item = xhgame.factory.getFactory(xhgame.factory.enums.effectItem).produceItem(rand_code) // ice 或者 ice.3d
        // 随机生成-300~300的坐标
        let x = Math.random() * 600 - 300
        let y = Math.random() * 600 - 300
        _item.positions = [x, y, 0]
        _item.effectTime = 1
        _item.toScene()
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
export class BattleDevViewComp extends BaseModelComp {
    compName: string = 'BattleDevViewComp'
    initBySystems: (typeof System)[] = [BattleDevViewSystem]

    actions = {
        test_create_uiItem: () => {
            BattleDevViewSystem.test_create_uiItem(this)
        },
        test_create_unitItem: () => {
            BattleDevViewSystem.test_create_unitItem(this)
        },
        test_create_effectItem: () => {
            BattleDevViewSystem.test_create_effectItem(this)
        }
    }
    reset() {

    }

    onDetach() {
        xhgame.gui.removeUI(xhgame.gui.enums.battle_dev)
    }
}

