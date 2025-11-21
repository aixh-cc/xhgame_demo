import { xhgame } from "db://assets/script/xhgame";
import { assert, describe, test } from "poku";
import { BunGame } from "../baseBun/BunGame";
import { TestUtil } from "../../TestUtil";
import { TimeSystem } from "@aixh-cc/xhgame_ec_framework";

const test_00 = () => {
    return new Promise((resolve, reject) => {
        test('测试时间系统是否正常', async () => {
            TestUtil.getInstance().setTimePassDt(10)
            TimeSystem.getInstance().timePlay()
            let time1 = Date.now()
            console.log('time1', time1)
            xhgame.timer.scheduleOnce(() => {
                let time2 = Date.now()
                console.log('time2 - time1', time2 - time1)
                assert(time2 - time1 >= 1000, '相差1000ms以上');
                resolve(true)
            }, 1000)
        })
    })
}

const test_01 = () => {
    return new Promise((resolve, reject) => {
        test('模拟玩家操作', async () => {
            const comp = xhgame.gameEntity.safeGetComponentByRegisterName('GateGroupMissionViewComp')
            await comp.done();
            comp.actions.clickMissionItem(1) // 模拟玩家操作
            resolve(true)
        })
    })
}

let functions = [
    test_00,
    test_01,
    // test_02
]

const wait0ms = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, 0)
    })
}

// 初始化及开始
let testGame = new BunGame()
testGame.start().then(() => {
    describe('关卡测试', async () => {
        while (functions.length > 0) {
            await functions.shift()()
            await wait0ms() // 为了输出字幕顺序正常(poku的问题)
            if (functions.length == 0) {
                xhgame.timer.timeStop()
            }
        }
    });
})


