import { _decorator, Component, Node } from "cc";
import { xhgame } from "db://assets/script/xhgame";
import { IAudioDrive } from "@aixh-cc/xhgame_ec_framework";
import { AudioEffect } from "../ccComponents/audioSource/AudioEffect";
import { AudioMusic } from "../ccComponents/audioSource/AudioMusic";

const { ccclass } = _decorator;

@ccclass('CocosAudioDrive')
export class CocosAudioDrive extends Component implements IAudioDrive {

    private effect!: AudioEffect;
    private music!: AudioMusic;

    init(root_node: Node): void {
        this.node = root_node
        var node = new Node("AudioManagerNode");
        // director.addPersistRootNode(node);
        var effect = new Node("EffectNode");
        effect.parent = node;
        this.effect = effect.addComponent(AudioEffect);
        var music = new Node("MusicNode");
        music.parent = node;
        this.music = effect.addComponent(AudioMusic);
    }
    protected start(): void {
        // 
        let music_volume = xhgame.storage.getNumber('music_volume')
        if (music_volume) {
            this.music.volume = music_volume
        }
        let effect_volume = xhgame.storage.getNumber('effect_volume')
        if (effect_volume) {
            this.effect.volume = effect_volume
        }
    }
    getMusicVolume(): number {
        return this.music.volume;
    }
    setMusicVolume(val: number) {
        xhgame.storage.set('music_volume', val)
        this.music.volume = val
    }
    getEffectVolume() {
        return this.effect.volume
    }
    setEffectVolume(val: number) {
        xhgame.storage.set('effect_volume', val)
        this.effect.volume = val
    }
    playEffect(url: string) {
        this.effect.playAudio(url);
    }
    playMusic(url: string, callback?: Function) {
        this.music.loop = true;
        this.music.load(url, callback); // todo 
    }
    stopMusic() {
        this.music.stop();
    }
    resumeAll() {
        if (this.music) {
            this.music.play();
            this.effect.play();
        }
    }
    pauseAll() {
        if (this.music) {
            this.music.pause();
            this.effect.pause();
        }
    }
}