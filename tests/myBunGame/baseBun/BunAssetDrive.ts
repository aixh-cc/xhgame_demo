import { IAssetDrive, IBundle, IEventItem } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame";

class BunBundle implements IBundle {
    nameOrUrl: string
    constructor(nameOrUrl: string) {
        this.nameOrUrl = nameOrUrl
        // 
        xhgame.event.on('load_config_json_for_test', (event: IEventItem, items: any) => {
            console.log('模拟加载config数据')
            var fs = require('fs');
            var battledata = fs.readFileSync(__dirname + '/../../config/client/battle.json', 'utf8');
            items.push({ name: 'battle', json: JSON.parse(battledata) })
            var unitdata = fs.readFileSync(__dirname + '/../../config/client/unit.json', 'utf8');
            items.push({ name: 'unit', json: JSON.parse(unitdata) })
            var skilldata = fs.readFileSync(__dirname + '/../../config/client/skill.json', 'utf8');
            items.push({ name: 'skill', json: JSON.parse(skilldata) })
            var storedata = fs.readFileSync(__dirname + '/../../config/client/store.json', 'utf8');
            items.push({ name: 'store', json: JSON.parse(storedata) })
            var configdata = fs.readFileSync(__dirname + '/../../config/client/config.json', 'utf8');
            items.push({ name: 'config', json: JSON.parse(configdata) })
        })
    }
    load() {

    }
    release(path: string): void {

    }
    // 第一个重载：只有两个参数
    loadDir<T>(dir: string, onComplete: (err: Error | null, data: T[]) => void): void;

    // 第二个重载：有三个参数
    loadDir<T>(dir: string, onProgress: ((finished: number, total: number, item: any) => void) | null, onComplete: (err: Error | null, data: T[]) => void): void;

    // 实际实现
    loadDir<T>(dir: string, arg2: ((finished: number, total: number, item: any) => void) | ((err: Error | null, data: T[]) => void) | null, arg3?: (err: Error | null, data: T[]) => void): void {
        if (arg3 === undefined) {
            // 两个参数的情况：arg2 是 onComplete
            const onComplete = arg2 as (err: Error | null, data: T[]) => void;
            // 实现两个参数的逻辑
            let finished = 100;
            let total = 100;
            let item = {};
            let items: any[] = [];
            //
            if (this.nameOrUrl == 'bundle_gate') {
                // 模拟
                if (dir == 'config') {
                    xhgame.event.emit('load_config_json_for_test', items)
                }

            }
            // 调用完成回调
            onComplete(null, items);
        } else {
            // 三个参数的情况：arg2 是 onProgress，arg3 是 onComplete
            const onProgress = arg2 as ((finished: number, total: number, item: any) => void) | null;
            const onComplete = arg3;

            // 实现三个参数的逻辑
            let finished = 100;
            let total = 100;
            let item = {};
            let items: T[] = [];

            // 如果有进度回调，调用它
            if (onProgress) {
                onProgress(finished, total, item);
            }

            // 调用完成回调
            onComplete(null, items);
        }
    }
}
export class BunAssetDrive implements IAssetDrive {
    loadBundle(nameOrUrl: string, onComplete: (err: Error, data: any) => void) {
        let err = null
        let data = new BunBundle(nameOrUrl);
        onComplete(err, data)
    }
}