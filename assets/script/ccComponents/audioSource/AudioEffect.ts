
import { AudioClip, AudioSource, error, _decorator, resources } from 'cc';
import { xhgame } from 'db://assets/script/xhgame';
import { IBundle } from '@aixh-cc/xhgame_ec_framework';
const { ccclass, menu } = _decorator;

/** 游戏音效 */
@ccclass('AudioEffect')
export class AudioEffect extends AudioSource {
    private effects: Map<string, AudioClip> = new Map<string, AudioClip>();

    playAudio(path: string) {
        let data = this.effects.get(path)
        if (data) {
            return this.playOneShot(data, this.volume);
        }
        let bundle_name = 'resources'
        if (path.indexOf('bundle_') > -1) {
            let _arr = path.split('://')
            bundle_name = _arr[0]
            path = _arr[1]
        }
        xhgame.asset.loadBundle(bundle_name, (err, bundle: IBundle) => {
            bundle.load<AudioClip>(path, (err, data: AudioClip) => {
                if (err) {
                    console.error('Failed to load AudioClip:', err);
                    return;
                }
                this.effects.set(path, data);
                this.playOneShot(data, this.volume);
            });
        });
    }
    playMusic(path: string) {
        let data = this.effects.get(path)
        if (data) {
            return this.playOneShot(data, this.volume);
        }
        let bundle_name = 'resources'
        if (path.indexOf('bundle_') > -1) {
            let _arr = path.split('://')
            bundle_name = _arr[0]
            path = _arr[1]
        }
        xhgame.asset.loadBundle(bundle_name, (err, bundle) => {
            bundle.load<AudioClip>(path, (err, data: AudioClip) => {
                if (err) {
                    console.error('Failed to load AudioClip:', err);
                    return;
                }
                this.effects.set(path, data);
                this.play();
            });
        });
    }
}
