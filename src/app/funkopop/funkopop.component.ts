import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FunkollectionApiService } from '../services/funkollection-api.service';
import { HelperService } from '../services/helper.service';


@Component({
  selector: 'app-funkopop',
  templateUrl: './funkopop.component.html',
  styleUrls: ['./funkopop.component.css']
})
export class FunkopopComponent implements OnInit {
  series: string;
  category: string;
  name: string;
  basicInfo = null;
  getFunkoPopFailedMessage: string = 'Unable to retrieve information on Pop! Vinyl.';
  
  constructor(private route: ActivatedRoute, private apiService: FunkollectionApiService, private _helperService: HelperService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.series = params.get("series");
      this.category = params.get("category");
      this.name = params.get("name");

      this.getInfo();
    })
  }

  getInfo(){
    this.apiService.getFunkoPop(this.series, this.category, this.name).subscribe(
      res => { 
        if(res['statusCode'] == 200){
          this.basicInfo = res['funkopop'];

          if(this.basicInfo == null){
            this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
          }
        }
      },
      err => {
        this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
      }

    );
  }

}
