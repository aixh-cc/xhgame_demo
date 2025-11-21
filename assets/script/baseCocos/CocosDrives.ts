import { DI, FetchHttp, Websocket } from "@aixh-cc/xhgame_ec_framework";
import { CocosUiDrive } from "./CocosUiDrive";
import { CocosAudioDrive } from "./CocosAudioDrive";
import { MyCocosFactoryConfig } from "../managers/myFactory/MyCocosFactoryConfig";
import { AssetManager, assetManager } from "cc";
import { MyTableConfig } from "../managers/myTable/MyTableConfig";
import { MockHttp } from "../../mock/MockHttp";

export class CocosDrives {
    constructor() {
        DI.bindInstance<AssetManager>('IAssetDrive', assetManager) // 注意这里是用实例，不是类
        DI.bindSingleton<CocosUiDrive>('IUiDrive', CocosUiDrive)
        DI.bindSingleton<CocosAudioDrive>('IAudioDrive', CocosAudioDrive)
        DI.bindSingleton<MockHttp>('IHttp', MockHttp)
        DI.bindSingleton<Websocket>('ISocket', Websocket)
        DI.bindSingleton<MyCocosFactoryConfig>('IFactoryConfig', MyCocosFactoryConfig)
        DI.bindSingleton<MyTableConfig>('ITableConfig', MyTableConfig)
    }
}

