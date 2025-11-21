import { DI, INode, IUiDrive, UiManager } from "@aixh-cc/xhgame_ec_framework"

/** ui管理 */
export class MyUiManager<T extends IUiDrive, NT extends INode> extends UiManager<T, NT> {

    constructor() {
        super(DI.make('IUiDrive'))
    }

    get enums() {
        return UIEnums
    }
}

enum UIEnums {
    battle_dev = 'bundle_battle://gui/panel/battle_dev/battle_dev',
    battle_index = 'bundle_battle://gui/panel/battle_index/battle_index',
    gate_group_mission_dialog = 'bundle_gate://gui/dialog/gate_group_mission_dialog/gate_group_mission_dialog',
    gate_index = 'bundle_gate://gui/panel/gate_index/gate_index',
    gate_setting_dialog = 'bundle_gate://gui/dialog/gate_setting_dialog/gate_setting_dialog',
    loading_battle = 'bundle_gate://gui/panel/loading_battle/loading_battle',
    help_chat = 'bundle_gate://widgets/help/help_chat/help_chat',
    help_guide = 'bundle_gate://widgets/help/help_guide/help_guide'
}