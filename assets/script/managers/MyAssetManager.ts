import { AssetManager, DI, IAssetDrive } from "@aixh-cc/xhgame_ec_framework"

/** asset管理 */
export class MyAssetManager<T extends IAssetDrive> extends AssetManager<T> {
    constructor() {
        super(DI.make('IAssetDrive'))
    }
}