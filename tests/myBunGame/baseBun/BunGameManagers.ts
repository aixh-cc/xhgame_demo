import { CryptoEmpty, CryptoManager, FetchHttp, IManagers, INode, StorageManager, Websocket } from "@aixh-cc/xhgame_ec_framework";
import { MyUiManager } from "db://assets/script/managers/MyUiManager";
import { MyAudioManager } from "db://assets/script/managers/MyAudioManager";
import { MyNetManager } from "db://assets/script/managers/MyNetManager";
import { MyFactoryManager } from "db://assets/script/managers/MyFactoryManager";
import { MyTableManager } from "db://assets/script/managers/MyTableManager";
import { MyEventManager } from "db://assets/script/managers/MyEventManager";
import { BunUiDrive } from "./BunUiDrive";
import { MyAssetManager } from "db://assets/script/managers/MyAssetManager";
import { BunAudioDrive } from "./BunAudioDrive";
import { MyBunFactoryConfig } from "../managers/myFactory/MyBunFactoryConfig";
import { BunNode } from "./BunGame";
import { TestAssetDrive } from "../../myTestGame/test/drive/TestAssetDrive";

export class BunGameManagers implements IManagers {
    node: Node

    init(node: Node | INode) {
        this.node = node as Node
        this.build();
    }

    build() {
        try {
            console.log('BunGameManagers build')
            this.setEventManager(new MyEventManager())
            this.setTableManager(this.getTables())
            this.setFactoryManager(this.getFactorys())
            this.setNetManager(new MyNetManager<FetchHttp, Websocket>())
            this.setGuiManager(new MyUiManager<BunUiDrive, BunNode>())
            this.setStorageManager(new StorageManager('xhgame', getLocalStorage()))
            this.setCryptoManager(new CryptoManager('s', new CryptoEmpty()))
            this.setAudioManager(new MyAudioManager())
            //
            this.setAssetManager(new MyAssetManager<TestAssetDrive>())
        } catch (err) {
            console.error('BunGameManagers build error', err)
        }
    }
    getTables() {
        let tableManager = new MyTableManager()
        tableManager.autoRegister()
        return tableManager
    }
    getFactorys() {
        let factoryManager = new MyFactoryManager<MyBunFactoryConfig>()
        factoryManager.autoRegister()
        return factoryManager
    }
    guiManager: MyUiManager<BunUiDrive, BunNode>
    setGuiManager(guiManager: MyUiManager<BunUiDrive, BunNode>) {
        this.guiManager = guiManager

    }
    getGuiManager(): MyUiManager<BunUiDrive, BunNode> {
        return this.guiManager
    }
    cryptoManager: CryptoManager<CryptoEmpty>
    setCryptoManager(cryptoManager) {
        this.cryptoManager = cryptoManager
    }
    getCryptoManager(): CryptoManager<CryptoEmpty> {
        return this.cryptoManager
    }
    audioManager: MyAudioManager<BunAudioDrive>
    setAudioManager(audioManager: MyAudioManager<BunAudioDrive>) {
        this.audioManager = audioManager
    }
    getAudioManager(): MyAudioManager<BunAudioDrive> {
        return this.audioManager
    }
    // table
    tableManager: MyTableManager
    setTableManager(tableManager: MyTableManager) {
        this.tableManager = tableManager
    }
    getTableManager(): MyTableManager {
        return this.tableManager
    }
    // factory
    factoryManager: MyFactoryManager<MyBunFactoryConfig>
    setFactoryManager(factoryManager: MyFactoryManager<MyBunFactoryConfig>) {
        this.factoryManager = factoryManager
    }
    getFactoryManager(): MyFactoryManager<MyBunFactoryConfig> {
        return this.factoryManager
    }
    netManager: MyNetManager<FetchHttp, Websocket>
    setNetManager(netManager: MyNetManager<FetchHttp, Websocket>) {
        this.netManager = netManager
        return this
    }
    getNetManager(): MyNetManager<FetchHttp, Websocket> {
        return this.netManager
    }
    storageManager: StorageManager
    setStorageManager(storageManager: StorageManager) {
        this.storageManager = storageManager
    }
    getStorageManager(): StorageManager {
        return this.storageManager
    }
    private _eventManager: MyEventManager
    setEventManager(eventManager: MyEventManager) {
        this._eventManager = eventManager
    }
    getEventManager(): MyEventManager {
        return this._eventManager
    }

    //
    private _assetManager: MyAssetManager<TestAssetDrive>
    setAssetManager(assetManager: MyAssetManager<TestAssetDrive>) {
        this._assetManager = assetManager
    }
    getAssetManager(): MyAssetManager<TestAssetDrive> {
        return this._assetManager
    }
}

const getLocalStorage = () => {
    const LocalStorage = require('node-localstorage').LocalStorage;
    let localStorage = new LocalStorage('./scratch', { quota: 10 * 1024 * 1024 }); // 设置为 10MB
    return localStorage
}