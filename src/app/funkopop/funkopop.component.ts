import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FunkollectionApiService } from '../services/funkollection-api.service';


@Component({
  selector: 'app-funkopop',
  templateUrl: './funkopop.component.html',
  styleUrls: ['./funkopop.component.css']
})
export class FunkopopComponent implements OnInit {
  series: string;
  category: string;
  name: string;

  constructor(private route: ActivatedRoute, private apiService: FunkollectionApiService) { }

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
          console.log('success!');
        }
      },
      err => {
        //this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
      }

    );
  }

}
