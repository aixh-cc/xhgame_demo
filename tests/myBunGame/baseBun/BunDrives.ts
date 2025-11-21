import { DI, FetchHttp, IAssetDrive, Websocket } from "@aixh-cc/xhgame_ec_framework";
import { BunUiDrive } from "./BunUiDrive";
import { BunAudioDrive } from "./BunAudioDrive";
import { MyBunFactoryConfig } from "../managers/myFactory/MyBunFactoryConfig";
import { MyTableConfig } from "db://assets/script/managers/myTable/MyTableConfig";
import { BunAssetDrive } from "./BunAssetDrive";

export class BunDrives {
    constructor() {
        DI.bindSingleton<BunAssetDrive>('IAssetDrive', BunAssetDrive)
        DI.bindSingleton<BunUiDrive>('IUiDrive', BunUiDrive)
        DI.bindSingleton<BunAudioDrive>('IAudioDrive', BunAudioDrive)
        DI.bindSingleton<FetchHttp>('IHttp', FetchHttp)
        DI.bindSingleton<Websocket>('ISocket', Websocket)
        DI.bindSingleton<MyBunFactoryConfig>('IFactoryConfig', MyBunFactoryConfig)
        DI.bindSingleton<MyTableConfig>('ITableConfig', MyTableConfig)
    }
}