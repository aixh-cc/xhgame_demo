import { _decorator, Label, Node, CCString } from "cc";
import { PlistSpriteComponent } from "db://assets/script/ccComponents/PlistSpriteComponent/PlistSpriteComponent";
import { HelpChatViewComp } from "db://assets/script/comps/widgets/help/HelpChatViewComp";
import { xhgame } from "db://assets/script/xhgame";
import { IHelpChatView } from "db://assets/script/managers/myTable/tables/HelpTable";
import { CocosBaseUiView } from "db://assets/script/baseCocos/CocosBaseUiView";

const { ccclass, property } = _decorator;

@ccclass('HelpChatView')
export class HelpChatView extends CocosBaseUiView implements IHelpChatView {

    @property
    _content: string = ''
    @property({ type: CCString })
    get content() {
        return this._content
    }
    set content(val) {
        this._content = val
        this.node.getChildByPath('body/content').getComponent(Label).string = val
    }

    @property
    _rightAvatarNo: string = ''
    @property({ type: CCString })
    get rightAvatarNo() {
        return this._rightAvatarNo
    }
    set rightAvatarNo(val) {
        this._rightAvatarNo = val
        if (val != '') {
            this.node.getChildByPath('body/avatar_right').active = true
            this.node.getChildByPath('body/avatar_right').getComponent(PlistSpriteComponent).plistCode = val
        } else {
            this.node.getChildByPath('body/avatar_right').active = false
        }
    }

    @property
    _leftAvatarNo: string = ''
    @property({ type: CCString })
    get leftAvatarNo() {
        return this._leftAvatarNo
    }
    set leftAvatarNo(val) {
        this._leftAvatarNo = val
        if (val != '') {
            this.node.getChildByPath('body/avatar_left').active = true
            this.node.getChildByPath('body/avatar_left').getComponent(PlistSpriteComponent).plistCode = val
        } else {
            this.node.getChildByPath('body/avatar_left').active = false
        }
    }

    @property
    _picNo: string = ''
    @property({ type: CCString })
    get picNo() {
        return this._picNo
    }
    set picNo(val) {
        this._picNo = val
        if (val != '') {
            this.node.getChildByPath('body/pic').active = true
            this.node.getChildByPath('body/pic').getComponent(PlistSpriteComponent).plistCode = val
        } else {
            this.node.getChildByPath('body/pic').active = false
        }
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }


    onTouchEnd() {
        const clickCallback = xhgame.gameEntity.getComponent(HelpChatViewComp).clickCallback
        clickCallback && clickCallback()
    }

    protected onLoad(): void {
        this.setBindAttrMap({
            "content": "HelpChatViewComp::chatItem.content",
            "rightAvatarNo": "HelpChatViewComp::chatItem.rightAvatarNo",
            "leftAvatarNo": "HelpChatViewComp::chatItem.leftAvatarNo",
            "picNo": "HelpChatViewComp::chatItem.picNo",
        })
    }

    reset(): void {
        this.content = ''
        this.leftAvatarNo = ''
        this.rightAvatarNo = ''
        this.picNo = ''
    }

}