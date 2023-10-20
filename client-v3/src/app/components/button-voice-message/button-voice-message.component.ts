import { Component, EventEmitter, Output } from '@angular/core';
import * as Recorder from 'recorder-js';
import { VOICE } from 'src/app/data/events.data';

declare var MediaRecorder: any;

// console.log({ Recorder: Recorder })
@Component({
  selector: 'app-button-voice-message',
  templateUrl: './button-voice-message.component.html',
  styleUrls: ['./button-voice-message.component.scss']
})
export class ButtonVoiceMessageComponent {

  @Output() onVoiceMessage = new EventEmitter<any>()
  @Output() onVoiceEvent = new EventEmitter<any>()

  ngOnInit() {
   this.boot()
  }

  public async boot(){
    try{
    if(this.isInitialized)return;
    this.audioContext = new (AudioContext)({ sampleRate: 16000 });
    /* @ts-ignore */
    this.recorder = new Recorder.default(this.audioContext, {});
     // console.log({ recorder: this.recorder })
     this.recordAudio = () => {
       return new Promise(resolve => {
         navigator.mediaDevices.getUserMedia({ audio: true })
           .then(stream => {
             const mediaRecorder: any = new MediaRecorder(stream, {
               mimeType: 'audio/webm',
               numberOfAudioChannels: 1,
               audioBitsPerSecond: 16000,
             });
             const audioChunks: any = [];

             mediaRecorder.addEventListener("dataavailable", ($event: any) => {
               audioChunks.push($event.data);
             });

             const start = () => {
               mediaRecorder.start();
             };

             const stop = () => {
               return new Promise(resolve => {
                 mediaRecorder.addEventListener('stop', () => {
                   const audioBlob: any = new Blob(audioChunks, { 'type': 'audio/wav; codecs=MS_PCM' });
                   const reader: any = new FileReader();
                   reader.readAsDataURL(audioBlob);
                   reader.addEventListener('load', () => {
                     const base64data = reader.result;
                     //  this.sendObj.audio = base64data;
                     // this.http.post('apiUrl', this.sendObj, httpOptions).subscribe(data => console.log(data));
                   }, false);
                   const audioUrl: any = URL.createObjectURL(audioBlob);
                   //  console.log('Audiourl', audioUrl);
                   const audio: any = new Audio(audioUrl);
                   const play = () => {
                     audio.play();
                   };
                   resolve({ audioBlob, audioUrl, play });
                 });

                 mediaRecorder.stop();
               });
             };
             resolve({ start, stop });
           });
       });
     };
     this.isInitialized = true;
    }catch(ex){
      console.warn(ex)
    }
  }
  public isInitialized:boolean = false
  public isRecording: boolean = false;
  public isInsideElement: boolean = true;
  public boundingClientRect: any = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    xEnd: 0,
    yEnd: 0
  }

  public blobFile: any;
  public recordAudio: any;
  public audioContext: any = new (AudioContext)({ sampleRate: 16000 });
  public recorder: any //= new Recorder(this.audioContext, {});

  public async startRecording() {
    await this.boot()
    this.recorder = await this.recordAudio();
    this.recorder.start();
  }
  public async stopRecording() {
    const audio = await this.recorder.stop();
    const readerPromise = () => {
      return new Promise((res: any,rej:any) => {
        try{

          var reader: any = new window.FileReader();
          reader.readAsDataURL(audio.audioBlob);
          reader.onloadend = function () {
            let base64 = reader.result;
            //base64 = base64.split(',')[1];
            res(base64);
          }
        }catch(ex){
          rej(ex)
        }
      })
    }
    const blob = await readerPromise();
    return blob
  }

  public isPressed: boolean = false;
  public onPress($event: any) {
    if (this.isPressed) return
    this.isPressed = true;
    this.isRecording = true;
    this.isInsideElement = true;
    // $event.srcEvent.preventDefault();
    $event.srcEvent.stopPropagation();
    this.boundingClientRect = $event.target.getBoundingClientRect();
    this.startRecording()

    this.sendVoiceEvent(VOICE.RECORDING)

  }
  public onPanMove($event: any) {
    if (!this.isPressed) return
    $event.srcEvent.preventDefault();
    $event.srcEvent.stopPropagation();
    const pointerCoordinates = $event.center;
    // console.log({ y: pointerCoordinates.y, bottom: this.boundingClientRect.bottom, top: this.boundingClientRect.top }) //boundingClientRect:this.boundingClientRect});
    if (pointerCoordinates.x < this.boundingClientRect.left ||
      pointerCoordinates.x > this.boundingClientRect.right ||
      pointerCoordinates.y > this.boundingClientRect.bottom ||
      pointerCoordinates.y < this.boundingClientRect.top
    ) {
      if (this.isInsideElement) {

        this.isInsideElement = false;
        this.sendVoiceEvent(VOICE.DISMISS)
      }
    } else {
      if (!this.isInsideElement) {
        this.isInsideElement = true;
        this.sendVoiceEvent(VOICE.RECORDING)
      }
    }
  }

  public async onPanEnd($event: any) {
    try {

      const audio: any = await this.stopRecording();
      if (this.isInsideElement) {
        this.sendVoiceEvent(VOICE.SENT)
        this.sendVoiceMessage(audio)
      } else {

        this.sendVoiceEvent(VOICE.CANCEL)
      }
    } catch (ex) {

    }
    this.isPressed = false;
    this.isRecording = false;
  }



  public sendVoiceEvent(status: any) {
    this.onVoiceEvent.emit(status);
  }

  public sendVoiceMessage(data: any) {
    this.onVoiceMessage.emit({
      success: true,
      data: data
    })
  }

  public cancelVoiceMessage() {
    this.onVoiceMessage.emit({
      success: false,
      data: {}
    })
  }


}
