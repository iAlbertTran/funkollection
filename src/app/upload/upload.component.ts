import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  imageSrc: any;
  event: any;
  url = "http://localhost:8000/api/series";
  seriesNames: any;
  constructor() { }

  ngOnInit() {
    var oReq = new XMLHttpRequest();
    oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", this.url);

    oReq.send();

    function reqListener(){
      this.seriesNames = JSON.parse(oReq.responseText);
      this.seriesNames = this.seriesNames.sort(function(a,b){
        return (b["SERIESNAME"] < a["SERIESNAME"]) ? 1 : ((b["SERIESNAME"] > a["SERIESNAME"]) ? -1 : 0);
      });
      console.log(this.seriesNames);
    }
  }


  readURL(event: Event): void {
    this.event = event;
    if (this.event.target.files && this.event.target.files[0]) {
        const file = this.event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;

        reader.readAsDataURL(file);
    }
}
}