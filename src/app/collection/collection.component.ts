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
  collectionID = [];
  wishlistID = [];

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
    this.getUserCollectionID();
    this.getUserWishlistID();
  }

  getUserCollection(){
    this.apiService.getUserCollection()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            let pops = res['funkopops'];

            this.calculateCollectionValue(pops);
            this.displaySeriesChart();
            this.getTopFive(pops);
            this.staggerEntrance(pops);
          }
        },
        err => {
          this._helperService.addErrorToMessages(this._helperService.getFunkoPopFailedMessage);
        }

      );
  }

  getUserCollectionID(){
    this.apiService.getUserCollectionID()
    .subscribe(
      res => { 
        if(res['statusCode'] == 200){
          this.collectionID = res['funkopops'];
        }
      },
      err => {
        this._helperService.addErrorToMessages(this._helperService.getFunkoPopFailedMessage);
      }

    );
  }
  
  getUserWishlistID(){
    this.apiService.getUserWishlistID()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            this.wishlistID = res['funkopops'];
          }
        },
        err => {
          this._helperService.addErrorToMessages(this._helperService.getFunkoPopFailedMessage);
        }

      );
  }

  addToCollection(id: string, name: string){
    $(`#${id}-collection-button`).addClass('animated faster pulse');

    setTimeout(() => {
      $(`#${id}-collection-button`).removeClass('animated faster pulse');
    }, 500);

    if(this.collectionID.includes(id)){
      this.removeFromCollection(id, name);
    }

    else{

      this.apiService.addToCollection(id).subscribe(
        res => { 
          this.getUserCollectionID();
          this._helperService.addSuccessToMessages(`${this._helperService.addSuccess} ${name} to collection!`);
        },
        err => {
          this.getUserCollectionID();
          this._helperService.addErrorToMessages(`${this._helperService.addFailedMessage} ${name} to collection!`);
        }

      );
    }
  }
  
  removeFromCollection(id: string, name: string){

    this.apiService.removeFromCollection(id).subscribe(
      res => { 
        this.getUserCollectionID();
        this._helperService.addSuccessToMessages(`${this._helperService.removeSuccess} ${name} from collection!`);

      },
      err => {
        this.getUserCollectionID();
        this._helperService.addErrorToMessages(`${this._helperService.removeFailedMessage} ${name} from collection!`);
      }

    );
  }
    
  addToWishlist(id: string, name: string){
    $(`#${id}-wishlist-button`).addClass('animated faster pulse');

    setTimeout(() => {
      $(`#${id}-wishlist-button`).removeClass('animated faster pulse');
    }, 500);

    if(this.wishlistID.includes(id)){
      this.removeFromWishlist(id, name);
    }

    else{

      this.apiService.addToWishlist(id).subscribe(
        res => { 
          this.getUserWishlistID();
          this._helperService.addSuccessToMessages(`${this._helperService.addSuccess} ${name} to wishlist!`);

        },
        err => {
          this.getUserWishlistID();
          this._helperService.addErrorToMessages(`${this._helperService.addFailedMessage} ${name} to wishlist!`);
        }

      );
    }
  }
    
  removeFromWishlist(id: string, name: string){

    this.apiService.removeFromWishlist(id).subscribe(
      res => { 
        this.getUserWishlistID();
        this._helperService.addSuccessToMessages(`${this._helperService.removeSuccess} ${name} from wishlist!`);

      },
      err => {
        this.getUserWishlistID();
        this._helperService.addErrorToMessages(`${this._helperService.removeFailedMessage} ${name} from wishlist.`);
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

  calculateCollectionValue(pops){
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
  }

  staggerEntrance(pops){
    let size = 0;
    setInterval(() =>{
      if(size == pops.length)
        return;
      this.collection.push(pops[size]);
      ++size;
    }, 50);
  }
}
