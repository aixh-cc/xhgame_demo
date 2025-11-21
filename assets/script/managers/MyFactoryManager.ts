import { DI, FactoryManager, IFactoryConfig } from "@aixh-cc/xhgame_ec_framework"

/** 工厂管理 */
export class MyFactoryManager<T extends IFactoryConfig> extends FactoryManager<T> {

    constructor() {
        let _FactoryConfig = DI.make<T>('IFactoryConfig')
        super(_FactoryConfig)
    }
    get enums() {
        return FactoryType
    }

}

export enum FactoryType {
    effectItem = 'effectItem',
    textUiItem = 'textUiItem',
    tiledItem = 'tiledItem',
    uiItem = 'uiItem',
    unitItem = 'unitItem',
    unitUiItem = 'unitUiItem'
}