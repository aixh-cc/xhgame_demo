import { CCString, CCInteger, _decorator, debug, find, Label, math, Node, UITransform, v3, Vec3 } from "cc";
import { xhgame } from "db://assets/script/xhgame";
import { IHelpGuideViewVM } from "db://assets/script/managers/myTable/tables/HelpTable";
import { CocosBaseUiView } from "db://assets/script/baseCocos/CocosBaseUiView";

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('HelpGuideView')
@executeInEditMode(true)
export class HelpGuideView extends CocosBaseUiView implements IHelpGuideViewVM {

    @property
    _group: string = ''
    @property({ type: CCString })
    get group() {
        return this._group
    }
    set group(val) {
        this._group = val
    }
    reset(): void {
        this.targetNode.off(Node.EventType.TOUCH_END, this.handleClick.bind(this))
        this.group = ''
        this.targetNode = null
        this.targetNodePath = ''
        this.text = ''
        this.text_size = '100,100'
        this.text_pos_index = 0
    }

    targetNode: Node = null
    @property
    _targetNodePath: string = ''
    @property({ type: CCString, visible: true })
    get targetNodePath() {
        return this._targetNodePath
    }
    set targetNodePath(val) {
        this._targetNodePath = val
        if (val == '' && this.targetNode) {
            this.targetNode.off(Node.EventType.TOUCH_END, this.handleClick.bind(this))
        }
        if (this._targetNodePath != '') {
            this.targetNode = find(this._targetNodePath)
            console.log('fand this.targetNode', this._targetNodePath, this.targetNode)
            if (this.targetNode) {
                this.is_need_update_ui = true
                this.targetNode.on(Node.EventType.TOUCH_END, this.handleClick.bind(this))
            }
        }
    }

    @property
    _text: string = ''
    @property({ type: CCString, visible: true })
    get text() {
        return this._text
    }
    set text(val) {
        this._text = val
        this.node.getComponentInChildren(Label).string = val
    }

    @property
    _text_size: string
    @property({ type: CCString, visible: true })
    get text_size() {
        return this._text_size
    }
    set text_size(val) {
        this._text_size = val
        let text_size_arr = val.split(',').map((v) => parseInt(v))
        this.node.getChildByName('sign').getChildByName('info').getComponent(UITransform).setContentSize(text_size_arr[0], text_size_arr[1])
    }

    @property
    _text_pos_index: number = 0
    @property({ type: CCInteger, visible: true })
    get text_pos_index() {
        return this._text_pos_index
    }
    set text_pos_index(val) {
        this._text_pos_index = val
        let size = this.node.getChildByName('mask').getComponent(UITransform).contentSize
        let text_size_arr = this.text_size.split(',').map((v) => parseInt(v))
        let pos = this.getTextPos(val, text_size_arr, size)
        this.node.getChildByName('sign').getChildByName('info').setPosition(pos)
    }
    handleClick() {
        console.log('handleClick')
        if (this.targetNode) {
            console.log('emit help_guide_btn_click_by_uuid')
            xhgame.event.emit('help_guide_btn_click_by_uuid', this.targetNodePath)
        }
    }

    getTextPos(text_pos_index: Number, text_size: number[], target_size: math.Size) {
        const target_width = target_size.x// targetNode.getComponent(UITransform).width
        const target_height = target_size.y // targetNode.getComponent(UITransform).height
        let pos_arr = [0, 0, 0]
        switch (text_pos_index) {
            case 0:
                pos_arr = [-(target_width / 2 + (text_size[0] / 2)), target_height / 2 + (text_size[1] / 2), 0]
                break;
            case 1:
                pos_arr = [0, target_height / 2 + (text_size[1] / 2), 0]
                break;
            case 2:
                pos_arr = [target_width / 2 + (text_size[0] / 2), target_height / 2 + (text_size[1] / 2), 0]
                break;
            case 3:
                pos_arr = [-(target_width / 2 + (text_size[0] / 2)), 0, 0]
                break;
            case 4:
                pos_arr = [0, 0, 0]
                break;
            case 5:
                pos_arr = [(target_width / 2 + (text_size[0] / 2)), 0, 0]
                break;
            case 6:
                pos_arr = [-(target_width / 2 + (text_size[0] / 2)), -(target_height / 2 + (text_size[1] / 2)), 0]
                break;
            case 7:
                pos_arr = [0, -(target_height / 2 + (text_size[1] / 2)), 0]
                break;
            case 8:
                pos_arr = [(target_width / 2 + (text_size[0] / 2)), -(target_height / 2 + (text_size[1] / 2)), 0]
                break;
        }
        return v3(pos_arr[0], pos_arr[1], pos_arr[2])
    }

    protected onLoad(): void {
        this.setBindAttrMap({
            "group": "HelpGuideComp::vm.group",
            "targetNodePath": "HelpGuideComp::vm.targetNodePath",
            "text": "HelpGuideComp::vm.text",
            "text_size": "HelpGuideComp::vm.text_size",
            "text_pos_index": "HelpGuideComp::vm.text_pos_index",
            "delay_time": "HelpGuideComp::vm.delay_time",
        })
    }

    delay_time: number = 0


    getAllParentPosIncludingSelf(node: Node) {
        // 获取目标节点坐标及其所有父节点，祖父节点，曾祖父节点...的坐标（不包括Canvas节点）
        let posArray = [node.position]
        let tempNode = node
        while (true) {
            let parentNode = tempNode.parent
            if (parentNode.name != 'UICanvas') {
                posArray.push(parentNode.position)
                tempNode = parentNode
            }
            else {
                break
            }
        }
        return posArray
    }
    newNodeOnTouchAndResetGuide(targetPath) {
        const targetNode = find(targetPath)

        let maskNode = this.node.getChildByName('mask')
        let guideSignSpriteNode = this.node.getChildByName('sign')
        // let guideTextLabelNode = this.node.getChildByName('sign').getChildByName('info')

        // 根据目标节点调整遮罩节点位置
        if (targetNode.parent.name == 'UICanvas') {
            maskNode.setPosition(targetNode.position)
        } else {
            // 不断更新遮罩节点位置
            maskNode.setPosition(new Vec3(0, 0, 0))
            let posArray = this.getAllParentPosIncludingSelf(targetNode)
            for (let i = posArray.length - 1; i >= 0; i--) {
                maskNode.setPosition(new Vec3(maskNode.position).add(posArray[i]))
            }
        }

        // 背景大小
        const guiUITransform = xhgame.gui.gui_root.getComponent(UITransform)
        maskNode.getChildByName('bg').getComponent(UITransform).width = guiUITransform.width * 2
        maskNode.getChildByName('bg').getComponent(UITransform).height = guiUITransform.height * 2

        // 挖洞大小
        maskNode.setRotation(targetNode.rotation)
        maskNode.getComponent(UITransform).setContentSize(
            targetNode.getComponent(UITransform).width * targetNode.scale.x * 1.1,
            targetNode.getComponent(UITransform).height * targetNode.scale.y * 1.1
        )
        // 指引洞大小
        guideSignSpriteNode.getComponent(UITransform).setContentSize(
            maskNode.getComponent(UITransform).width * 1.1,
            maskNode.getComponent(UITransform).height * 1.1)

        guideSignSpriteNode.setPosition(maskNode.position)
        this.node.setPosition(Vec3.ZERO)

    }
    is_need_update_ui: boolean = false

    protected update(dt: number): void {
        if (this.is_need_update_ui) {
            this.newNodeOnTouchAndResetGuide(this.targetNodePath)
        }
    }


}