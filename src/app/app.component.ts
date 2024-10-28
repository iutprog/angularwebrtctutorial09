import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MediaService } from './services/media.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

const mediaConstraints = {
  audio: false,
  video: true,
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , CommonModule , FormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit{
  title = 'angularhttps';

   @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement> | undefined ;
   @ViewChild('playBackElement') playbackElement: ElementRef<HTMLVideoElement> | undefined ;

   videoWidth:number = 640;
   videoHeight:number = 480;
   mediaGranted : boolean = false;
   supportedConstraints: any ={};
   trackCapabilities: MediaTrackCapabilities | null=null;
   videoFrameRate: number = 30;
   videoAspectRatio : number = 1.777 // Default aspect ration 16:9

   recording : boolean = false;
   recordedVideoUrl : string | null = null ; 
   recordedBlob : Blob | null =null; 

   constructor (private mediaService: MediaService , private cdr:ChangeDetectorRef){}


  ngOnInit(): void {
     
  }

    async requestMediaAccess(){

      this.mediaGranted = await this.mediaService.requestMediaAccess(mediaConstraints);

       if(this.mediaGranted){
          console.log('Media Access Granted to you ')
       }else {
        console.log('Media Access Denied to you ')
       }
   }

  attachStream(){
    if(this.mediaGranted && this.videoElement){
       this.mediaService.AttachMediaStream(this.videoElement.nativeElement);
    }else{
      console.log('Stream not available or media access was not granted.');
    }
  }


  stopStream(){
    this.mediaService.stopMediaStream();
    if(this.videoElement){
      this.videoElement.nativeElement.srcObject = null; 
    }
  }


  applyVideoSize(){
     if(this.videoElement){
      this.videoElement.nativeElement.width= this.videoWidth;
      this.videoElement.nativeElement.height= this.videoHeight;
      console.log(`Video size changed to ${this.videoWidth}x ${this.videoHeight}`);
     }
  }

  //Fet the supported constraints and track capabilities
  getCapabilitiesAndConstraints(){
    this.trackCapabilities = this.mediaService.getTrackCapabilities();
    if(this.trackCapabilities){
      console.log('Track Capabilities : ', this.trackCapabilities);
    }
  }
  modifyVideoTrackSize(){
    const success = this.mediaService.modifyVideoTrackSize(this.videoWidth, this.videoHeight);
    if(success){
      console.log(`Track size modified to ${this.videoWidth}x${this.videoHeight}`);
    }
    else{
      console.log('Unable to modify video track size');
    }

  }

  //Modify the video track frame rate
   modifyVideoTrackFrameRate(){
    const success = this.mediaService.modifyVideoTrackFrameRate(this.videoFrameRate)
    if(success){
      console.log(` Track frame rate modified to ${ this.videoFrameRate} fps `)
    }
    else{
      console.log('Unable to modify the track frame rate !!!')
    }
   }

   //Modify the video track aspect ration
   modifyVideoAspectRatio(){
    const success = this.mediaService.modifyVideoTrackAspectRatio(this.videoAspectRatio)
    if(success){
      console.log(` Track aspect ratio modified to ${ this.videoAspectRatio}  `)
    }
    else{
      console.log('Unable to modify the track aspect ratio !!!')
    }
   }

   startRecording(){
    this.mediaService.startRecording((recordedVideo : Blob) => {
      this.handleRecordedBlob(recordedVideo);
    });

    this.recording = true;
   }


  handleRecordedBlob(recordedVideo: Blob) {
     if(recordedVideo.size > 0){
      //Revoke the previous Blob URL to prevent memory leak
      if(this.recordedVideoUrl){
        URL.revokeObjectURL(this.recordedVideoUrl);
      }

      this.recordedBlob = recordedVideo;
      this.recordedVideoUrl = URL.createObjectURL(recordedVideo);
     // Trigger Angular to update the view
     this.cdr.detectChanges();
     console.log('Video recorded successfully , Blob size : ' , recordedVideo.size);
      
     this. downloadRecordedVideo();
     
     } else{
      console.log('No data recording available !!!')
     }
  }
  

   stopRecording(){
     this.mediaService.stopRecording();
     this.recording = false;
   }

   downloadRecordedVideo(){
     if( this.recordedBlob){
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(this.recordedBlob);
      downloadLink.download = 'recorded-video.webm';
      downloadLink.click();
      console.log('Video downloaded successfully')
     }
   }
}
