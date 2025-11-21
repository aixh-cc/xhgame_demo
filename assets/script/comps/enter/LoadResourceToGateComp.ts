
import { IBundle, System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "../../xhgame"
import { BaseModelComp } from "@aixh-cc/xhgame_ec_framework"
import { TableType } from "../../managers/MyTableManager"

export interface ILoadResourceToGateViewVM {
    progress: number,
    isFinished: boolean,
}

export class LoadResourceToGateSystem extends System {

    static async initComp(comp: LoadResourceToGateComp) {
        let firstUIView = xhgame.gui.getFirstUIView()
        firstUIView.setViewComp(comp, true)
        await this.loadResource(comp)
    }

    static loadResource(comp: LoadResourceToGateComp) {
        return new Promise((resolve, reject) => {
            xhgame.asset.loadBundle('bundle_gate', async (err, bundle: any) => {
                await this.load_gui(comp, bundle)
                await this.load_json(comp, bundle)
                comp.vm.isFinished = true;
                comp.notify()
                resolve(true)
            })
        })
    }
    static async load_gui(comp: LoadResourceToGateComp, bundle: IBundle) {
        return new Promise((resolve, reject) => {
            bundle.loadDir('gui', (finished: number, total: number, item: any) => {
                comp.vm.progress = finished / total;
                comp.notify();
            }, (err, assets) => {
                if (err) {
                    console.error('加载资源失败', err);
                    return;
                }
                console.log('gui加载资源成功', assets);
                resolve(true)
            });
        })
    }
    static async load_json(comp: LoadResourceToGateComp, bundle: any) {
        return new Promise((resolve, reject) => {
            bundle.loadDir('table', (err, assets) => {
                if (err) {
                    console.error('加载资源失败', err);
                    return;
                }
                for (let i = 0; i < assets.length; i++) {
                    const _asset = assets[i] as any;
                    let _table = xhgame.table.getTable(_asset.name as TableType)
                    if (_table != undefined) {
                        _table.init(_asset.json)
                    }
                }
                console.log('json加载资源成功,并初始化table', assets);
                resolve(true)
            });
        })
    }
}

export class LoadResourceToGateComp extends BaseModelComp {
    compName: string = 'LoadResourceToGateComp'
    initBySystems: (typeof System)[] = [LoadResourceToGateSystem]
    vm: ILoadResourceToGateViewVM = {
        progress: 0,
        isFinished: false,
    }
    reset() {
        this.vm = {
            progress: 0,
            isFinished: false,
        }
    }
    actions = {

    }

    onDetach() {
        let firstUIView = xhgame.gui.getFirstUIView() as any
        if (firstUIView.node) {
            firstUIView.node.parent = null
        }
    }
}