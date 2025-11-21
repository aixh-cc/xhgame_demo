import { BaseModelComp, INode, IUiDrive, IView } from "@aixh-cc/xhgame_ec_framework";
import { BunNode, BunView } from "./BunGame";

export class BunUiDrive implements IUiDrive {
    mock_first_ui_view: BunView = new BunView('first_ui')
    mock_gui_root: INode = new BunNode('gui_root')
    mock_world_root: INode = new BunNode('world_root')
    openUIAsyncByDrive(uiid: string, comp: BaseModelComp) {
        return new Promise<boolean>((resolve, reject) => {
            setTimeout(() => {
                // console.log('0.1秒后模拟打开，uiid=' + uiid)
                resolve(true)
            }, 100)
        })
    }
    removeUI(uiid: string) {

    };
    getGuiRoot() {
        // console.log('模拟获取gui_root')
        return this.mock_gui_root
    }
    getWorldRoot() {
        // console.log('模拟获取world_root')
        return this.mock_world_root
    };
    getFirstUIView() {
        return this.mock_first_ui_view
    }
    getUI(uiid: string) {
        let _ui_node = new BunNode(uiid)
        return _ui_node
    }
    toast(msg: string) {
        console.log(msg)
    }
    isloading: boolean = false
    loading() {
        this.isloading = true
        console.log('loading')
    }
    loaded() {
        this.isloading = false
        console.log('loaded')
    }
    /** 初始化引擎 */
    node: any
    init(root_node: BunNode) {
        this.node = root_node
    }
}