import { Component, OnInit, ViewChild } from '@angular/core';
import { Router }      from '@angular/router';
import { FunkollectionApiService } from '../services/funkollection-api.service';
import { HelperService } from '../services/helper.service';
import { FunkoPop } from '../models/funkopop';
import * as $ from 'jquery';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  getFunkoPopFailedMessage: string = 'Unable to retrieve any Pop! Vinyls ';

  collection = [];
  wishlist = [];

  collectionValue = 0;
  averageValue = 0;

  seriesList = {};
  seriesChartX = [];
  seriesChartY = [];

  topFive = [];
  @ViewChild('seriesChart') seriesChart;

  constructor(public router: Router, private apiService: FunkollectionApiService, private _helperService: HelperService) { }

  ngOnInit() {
    this.getUserCollection();
    this.getUserWishlist();
  }


  getUserCollection(){
    this.apiService.getUserCollection()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            let pops = res['funkopops'];
            let size = 0;
            
            let totalValue = 0
            pops.forEach((ele) => {
              totalValue += ele.value;

              if(this.seriesList.hasOwnProperty(ele.series)){
                this.seriesList[ele.series] += 1;
              } else{
                this.seriesList[ele.series] = 1;
              }
            });


            Object.keys(this.seriesList).forEach( (key) => {
              this.seriesChartX.push(key);
              this.seriesChartY.push(this.seriesList[key]);
            });


            this.averageValue = Math.round(totalValue / pops.length);
            this.collectionValue = Math.round(totalValue);

            this.displaySeriesChart();
            this.getTopFive(pops);

            setInterval(() =>{
              if(size == pops.length)
                return;
              this.collection.push(pops[size]);
              ++size;
            }, 50);
          }
        },
        err => {
          this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
        }

      );
  }

  getUserWishlist(){
    this.apiService.getUserWishlistID()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            this.wishlist = res['funkopops'];
          }
        },
        err => {
          this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
        }

      );
  }

  displaySeriesChart(){
    let seriesChart = <HTMLCanvasElement> document.getElementById("seriesChart");
    var myChart = new Chart(seriesChart, {
      type: 'bar',
      data: {
          labels: this.seriesChartX,
          datasets: [{
              label: 'own',
              data: this.seriesChartY,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderWidth: 1
          }]
      },
      
      options: {
        title: {
          display: true,
          fontColor: '#ffed68',
          text: "Collection by Series"
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true,
              callback: function(label, index, labels) {
                // when the floored value is the same as the value we have a whole number
                if (Math.floor(label) === label) {
                  return label;
                }

              }
            }
          }]
        },
        legend: {display: false}
      }
  });
  }

  getTopFive(pops){
    let sorted = pops.sort( (first, second) => {
      return second.value - first.value;
    });

    this.topFive = sorted.slice(0, 5);
  }
}
