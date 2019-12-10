import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AudioNotification {
    track: HTMLAudioElement = new Audio();
    constructor() {
        this.track.src = 'assets/audio/splash_1_1_1.mp3';
        this.track.load();
    }
    play() {
        this.track.play();
    }
}