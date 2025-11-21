import { DI, IHttp, ISocket, NetManager } from "@aixh-cc/xhgame_ec_framework"

/** 网络接口关联 */
export class MyNetManager<T extends IHttp, TS extends ISocket> extends NetManager<T, TS> {

    constructor() {
        super(DI.make('IHttp'), DI.make('ISocket'))
    }

    get enums() {
        return ApiEnums
    }

}

// 目前这部分只能手动添加，还没想好net与model如何关联
export enum ApiEnums {
    GetRoomList = 'atHall/GetRoomList',
    EnterRoom = 'atHall/EnterRoom',
    //
    GetServerInfo = 'atAccount/GetServerInfo',
    PlayerEnter = 'atHall/PlayerEnter',
    GetPlayerMission = 'atHall/PlayerMission', //'atHall/getPlayerMissions',
    WinBattle = 'atHall/PlayerWinBattle',
    GetDoubleReward = 'atHall/PlayerGetDoubleReward',
    GetPackageInfo = 'atHall/PlayerGetPackageInfo',
    UseGoods = 'atHall/PlayerUseGoods',
    BuyGoods = 'atHall/PlayerBuyStoreGoods',
    ReviveBattle = 'atHall/PlayerReviveBattle',
    PostLocalPackageHandle = 'atHall/PostLocalPackageHandle',
}