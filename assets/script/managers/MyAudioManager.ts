import { AudioManager, DI, IAudioDrive } from "@aixh-cc/xhgame_ec_framework"

/** 音效管理 */
export class MyAudioManager<T extends IAudioDrive> extends AudioManager<T> {
    constructor() {
        super(DI.make("IAudioDrive"))
    }
    get enums() {
        return AudioEnums
    }
}

enum AudioEnums {
    battle_bg_audio = 'bundle_battle://audio/battle_bg_audio',
    gate_bg_audio = 'bundle_gate://audio/gate_bg_audio',
    qingbg = 'bundle_gate://audio/qingbg'
}