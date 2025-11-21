import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

export abstract class CocosBaseItemView extends Component {
    abstract toSceneNodePath: string
    abstract reset(): void
}