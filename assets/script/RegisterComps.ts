import { BattleSenceComp } from "db://assets/script/comps/battle/BattleSenceComp";
import { BattleTiledComp } from "db://assets/script/comps/battle/BattleTiledComp";
import { BattleDevViewComp } from "db://assets/script/comps/battle/panel/BattleDevViewComp";
import { BattleViewComp } from "db://assets/script/comps/battle/panel/BattleViewComp";
import { GateGroupMissionViewComp } from "db://assets/script/comps/gate/dialog/GateGroupMissionViewComp";
import { GateSettingDialogViewComp } from "db://assets/script/comps/gate/dialog/GateSettingDialogViewComp";
import { GateSenceComp } from "db://assets/script/comps/gate/GateSenceComp";
import { GateViewComp } from "db://assets/script/comps/gate/panel/GateViewComp";
import { LoadingViewComp } from "db://assets/script/comps/gate/panel/LoadingViewComp";
import { PlayerMissionModelComp } from "db://assets/script/comps/models/PlayerMissionModelComp";
import { SdkComp } from "db://assets/script/comps/sdk/SdkComp";
import { BattleModelComp } from "./comps/models/BattleModelComp";
import { PlayerModelComp } from "./comps/models/PlayerModelComp";
import { PlayerLoginComp } from "./comps/player/PlayerLoginComp";
import { HelpComp } from "db://assets/script/comps/widgets/help/HelpComp";

export class RegisterComps {
    ['PlayerLoginComp']: typeof PlayerLoginComp = PlayerLoginComp;  // 手动注册
    ['PlayerModelComp']: typeof PlayerModelComp = PlayerModelComp;  // 手动注册
    ['BattleModelComp']: typeof BattleModelComp = BattleModelComp;
    ['BattleSenceComp']: typeof BattleSenceComp = BattleSenceComp;
    ['BattleTiledComp']: typeof BattleTiledComp = BattleTiledComp;
    ['GateSenceComp']: typeof GateSenceComp = GateSenceComp;
    ['BattleDevViewComp']: typeof BattleDevViewComp = BattleDevViewComp;
    ['BattleViewComp']: typeof BattleViewComp = BattleViewComp;
    ['PlayerMissionModelComp']: typeof PlayerMissionModelComp = PlayerMissionModelComp;
    ['GateGroupMissionViewComp']: typeof GateGroupMissionViewComp = GateGroupMissionViewComp;
    ['GateViewComp']: typeof GateViewComp = GateViewComp;
    ['GateSettingDialogViewComp']: typeof GateSettingDialogViewComp = GateSettingDialogViewComp;
    ['LoadingViewComp']: typeof LoadingViewComp = LoadingViewComp;
    ['SdkComp']: typeof SdkComp = SdkComp;
    ['HelpComp']: typeof HelpComp = HelpComp;
}