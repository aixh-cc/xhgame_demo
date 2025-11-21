
import { System } from "@aixh-cc/xhgame_ec_framework"
import { xhgame } from "db://assets/script/xhgame"
import { BaseModelComp } from "@aixh-cc/xhgame_ec_framework"
import { IMissionItemModel } from "../../models/PlayerMissionModelComp"
import { IUiItem } from "db://assets/script/managers/myFactory/factorys/UiItemFactory"
import { IMissionItemViewVM } from "db://assets/script/itemViews/MissionItemView"

// 临时的
const itemsPositions: number[][] = [
    [-175, -240],
    [-80, -140],
    [60, -90],
    [150, 10],
    [15, 75],
    [-125, 115],
    [-220, 170],
    [-165, 255],
    [-35, 280],
    [145, 330],
]

export class GateGroupMissionViewSystem extends System {

    static async initComp(comp: GateGroupMissionViewComp) {
        await xhgame.gui.openUIAsync(xhgame.gui.enums.gate_group_mission_dialog, comp)
        const playerModel = xhgame.gameEntity.safeGetComponentByRegisterName('PlayerModelComp')
        const playerMissionModel = xhgame.gameEntity.safeGetComponentByRegisterName('PlayerMissionModelComp')
        const maxBattleId = playerModel.playerInfo.maxBattleId
        // // 显示关卡信息到view上
        let group = 0
        const curGroupMissionInfo = await playerMissionModel.actions.getGroupMissionInfo(group)
        let missionItems: IMissionItemModel[] = curGroupMissionInfo.missionItems
        missionItems.forEach((_iMissionItem: IMissionItemModel, _index: number) => {
            let missionUiItem = xhgame.factory.getFactory(xhgame.factory.enums.uiItem).produceItem('mission_item')
            missionUiItem.positions = itemsPositions[_index]
            missionUiItem.itemsIndex = _index
            let vm = missionUiItem.getViewVm<IMissionItemViewVM>()
            vm.starNum = _iMissionItem.maxStar
            vm.isFight = false
            vm.battleId = _iMissionItem.battleId
            if (_iMissionItem.maxScore == 0) {
                vm.isActive = false
            }
            if (_iMissionItem.battleId <= maxBattleId) {
                vm.isActive = true
            }
            missionUiItem.onClickCallback = () => {
                console.log('clickMissionItem', missionUiItem.itemsIndex)
                comp.actions.clickMissionItem(missionUiItem.itemsIndex)
            }
            missionUiItem.toScene()
            comp.uiItems.push(missionUiItem)
            if (playerModel.selectedBattleId == _iMissionItem.battleId) {
                comp.selectedIndex = _iMissionItem.index
                vm.isFight = true
            }
        })
    }

    static clickMissionItem(comp: GateGroupMissionViewComp, uiItemIndex: number) {
        let uiItem = comp.uiItems[uiItemIndex]
        console.log('玩家点击了MissionItem', uiItem)
        const playerModel = xhgame.gameEntity.safeGetComponentByRegisterName('PlayerModelComp')
        const maxBattleId = playerModel.playerInfo.maxBattleId
        let vm = uiItem.getViewVm<IMissionItemViewVM>()
        if (vm.battleId > maxBattleId) {
            console.log('vm.battleId > maxBattleId')
            return // 不能点击
        }
        vm.isFight = true
        let pre_uiItem = comp.uiItems[comp.selectedIndex]
        let pre_vm = pre_uiItem.getViewVm<IMissionItemViewVM>()
        pre_vm.isFight = false
        // 
        comp.selectedIndex = uiItemIndex
    }

    static chooseSelectedToPlay(comp: GateGroupMissionViewComp) {
        let selectUiItem = comp.uiItems[comp.selectedIndex]
        const playerModel = xhgame.gameEntity.safeGetComponentByRegisterName('PlayerModelComp')
        const gateViewComp = xhgame.gameEntity.safeGetComponentByRegisterName('GateViewComp')
        let battleId = selectUiItem.getViewVm<IMissionItemViewVM>().battleId
        playerModel.selectedBattleId = battleId
        playerModel.notify()
        gateViewComp.actions.startBattle()
        comp.detach()// 当前页面可以关闭了
    }

}

export class GateGroupMissionViewComp extends BaseModelComp {
    compName: string = 'GateGroupMissionViewComp'
    initBySystems: (typeof System)[] = [GateGroupMissionViewSystem]
    selectedIndex: number = -1
    uiItems: IUiItem[] = []
    reset() {
        this.selectedIndex = -1
        for (let i = 0; i < this.uiItems.length; i++) {
            const element = this.uiItems[i];
            element.toPool()
        }
        this.uiItems = []
    }
    actions = {
        clickMissionItem: (_uiItemIndex: number) => {
            GateGroupMissionViewSystem.clickMissionItem(this, _uiItemIndex)
        },
        chooseSelectedToPlay: () => {
            GateGroupMissionViewSystem.chooseSelectedToPlay(this)
        }
    }

    onDetach() {
        xhgame.gui.removeUI(xhgame.gui.enums.gate_group_mission_dialog)
    }
}