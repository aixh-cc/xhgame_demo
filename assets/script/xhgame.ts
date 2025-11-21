
import { DI, TimeSystem } from "@aixh-cc/xhgame_ec_framework";
import { CocosGameManagers } from "./baseCocos/CocosGameManagers";
import { CocosGame } from "./baseCocos/CocosGame";
import { BunGameManagers } from "../../tests/myBunGame/baseBun/BunGameManagers";
import { BunGame } from "../../tests/myBunGame/baseBun/BunGame";

/**
 * 总门面(小汇game)，你可以把这个改为单词my或者其他代号
 * 但当为了不出现版本混乱，及可以无缝使用xhgame_builder(xhgame在线游戏构建)
 * 还请各位大侠保留xhgame
 **/
export class xhgame {
    /**
    * buntest 时,打开下面的注释 
    * ==== buntest start ====
    */
    static getManagers() {
        return DI.make<BunGameManagers>('IManagers') as BunGameManagers;
    }
    static getGame() {
        return DI.make<BunGame>('IGame') as BunGame;
    }
    // ==== test end ====

    // cocos 时,打开下面的注释  ==== cocos start ====
    // static getManagers() {
    //     return DI.make<CocosGameManagers>('IManagers') as CocosGameManagers;
    // }
    // static getGame() {
    //     return DI.make<CocosGame>('IGame') as CocosGame;
    // }
    // ==== cocos end ====
    /** 游戏主体 */
    static get game() {
        return this.getGame();
    }
    /** 组件挂载的游戏实体 */
    static get gameEntity() {
        return this.getGame().getGameEntity()
    }
    /**  网络通讯管理 */
    static get net() {
        return this.getManagers().getNetManager()
    };
    /**  加密管理 */
    static get crypto() {
        return this.getManagers().getCryptoManager()
    }
    /** gui管理 */
    static get gui() {
        return this.getManagers().getGuiManager()
    }
    /** 游戏音乐音效管理 */
    static get audio() {
        return this.getManagers().getAudioManager()
    }
    /** 事件管理 */
    static get event() {
        return this.getManagers().getEventManager()
    }
    /** 工厂管理 */
    static get factory() {
        return this.getManagers().getFactoryManager()
    }
    /** 配置管理 */
    static get table() {
        return this.getManagers().getTableManager()
    }
    /** 本地存储 */
    static get storage() {
        return this.getManagers().getStorageManager()
    }
    /** 游戏时间管理 */
    static get timer() {
        return TimeSystem.getInstance()
    }
    /** asset管理 */
    static get asset() {
        return this.getManagers().getAssetManager()
    }
}
