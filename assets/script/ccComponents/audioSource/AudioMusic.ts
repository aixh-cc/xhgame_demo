
import { AudioClip, AudioSource, _decorator, error, resources } from 'cc';
import { xhgame } from 'db://assets/script/xhgame';

const { ccclass, menu } = _decorator;

/** 背景音乐 */
@ccclass('AudioMusic')
export class AudioMusic extends AudioSource {

    /** 背景音乐播放完成回调 */
    onComplete: Function | null = null;

    private _progress: number = 0;
    private _url: string = null!;
    private _isPlay: boolean = false;


    /** 获取音乐播放进度 */
    get progress(): number {
        if (this.duration > 0)
            this._progress = this.currentTime / this.duration;
        return this._progress;
    }
    /**
     * 设置音乐当前播放进度
     * @param value     进度百分比0到1之间
     */
    set progress(value: number) {
        this._progress = value;
        this.currentTime = value * this.duration;
    }

    /**
     * 加载音乐并播放
     * @param url          音乐资源地址
     * @param callback     加载完成回调
     */
    public load(path: string, callback?: Function) {
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
                if (this.playing) {
                    this._isPlay = false;
                    this.stop();
                }
                if (this._url) {
                    bundle.release(this._url);
                }
                this.enabled = true;
                this.clip = data;

                // 注：事件定义在这里，是为了在播放前设置初始播放位置数据
                callback && callback();
                this.play();
                this._url = path;
            });
        });
    }

    /** cc.Component 生命周期方法，验证背景音乐播放完成逻辑，建议不要主动调用 */
    update(dt: number) {
        if (this.currentTime > 0) {
            this._isPlay = true;
        }
        if (this._isPlay && this.playing == false) {
            this._isPlay = false;
            this.enabled = false
            this.onComplete && this.onComplete();
        }
    }

    /** 释放当前背景音乐资源 */
    release() {
        if (this._url) {
            resources.release(this._url);
            this._url = null!;
        }
    }
}
