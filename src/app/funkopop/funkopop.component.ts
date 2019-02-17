import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FunkollectionApiService } from '../services/funkollection-api.service';
import { HelperService } from '../services/helper.service';
import * as moment from 'moment';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-funkopop',
  templateUrl: './funkopop.component.html',
  styleUrls: ['./funkopop.component.css']
})
export class FunkopopComponent implements OnInit {

  showCompletedListings: boolean = false;

  series: string;
  category: string;
  name: string;
  basicInfo = null;
  estimatedValue = 0;

  collection = [];
  wishlist = [];
  seriespops = null;
  categorypops = null;
  otherPopsInCategory = [];

  availableEbayListings = null;
  completedListings = null;
  ebaySearchText = null;

  getFunkoPopFailedMessage: string = 'Unable to retrieve information on ';
  addFailedMessage: String = 'Unable to add ';
  removeFailedMessage: String = 'Unable to remove ';
  addSuccess: String = 'Successfully added ';
  removeSuccess: String = 'Successfully removed ';

  @ViewChild('saleChart') saleChart;

  chartDataset = [];
  
  constructor(private route: ActivatedRoute, private apiService: FunkollectionApiService, private _helperService: HelperService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.series = params.get("series");
      this.category = params.get("category");
      this.name = params.get("name");
      
      this.basicInfo = null;
      this.collection = [];
      this.wishlist = [];
      this.seriespops = null;
      this.categorypops = null;
      this.availableEbayListings = null;
      this.completedListings = null;
      this.ebaySearchText = null;

      this.getInfo();
      this.getUserCollection();
      this.getUserWishlist();
    })
  }

  getInfo(){
    this.apiService.getFunkoPop(this.series, this.category, this.name).subscribe(
      res => { 
        if(res['statusCode'] == 200){
          this.basicInfo = res['funkopop'];
          
          if(this.basicInfo == null){
            this._helperService.addErrorToMessages(`${this.getFunkoPopFailedMessage} ${this.name}`);
          }
          else{
            this.basicInfo.value = Math.round(this.basicInfo.value);
            this.getEbayListings(25);
            this.getCompletedListings(25);
            this.getPopsInCategory(this.basicInfo.category);
          }
        }
      },
      err => {
        this._helperService.addErrorToMessages(`${this.getFunkoPopFailedMessage} ${this.name}`);
      }

    );
  }

  getUserCollection(){
    this.apiService.getUserCollectionID()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            this.collection = res['funkopops'];
          }
        },
        err => {
          this._helperService.addErrorToMessages(`${this.getFunkoPopFailedMessage} ${this.name}`);
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
          this._helperService.addErrorToMessages(`${this.getFunkoPopFailedMessage} ${this.name}`);
        }

      );
  }

  getPopsInCategory(category: string){
    this.apiService.getPopsInCategory(category)
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            this.categorypops = res['funkopops'].filter( element => {
              
              if(element.name != this.basicInfo.name){

                this.otherPopsInCategory.push(element.name);
                
                element.series = this._helperService.replaceSpecialCharacters(element.series);
                element.category = this._helperService.replaceSpecialCharacters(element.category);
                element.name = this._helperService.replaceSpecialCharacters(element.name); 

                return true;
              }

              
              return false;
            });
            this.getPopsInSeries(this.basicInfo.series);
          }
        },
        err => {
          this.getPopsInSeries(this.basicInfo.series);
        }

      );
  }

  getPopsInSeries(series: string){
    this.apiService.getPopsInSeries(series)
      .subscribe(
        res => { 
          this.otherPopsInCategory.forEach(element => console.log(element));
          if(res['statusCode'] == 200){
            this.seriespops = res['funkopops'].filter( element => {

              if(element.name != this.basicInfo.name && !this.otherPopsInCategory.includes(element.name)){
                element.series = this._helperService.replaceSpecialCharacters(element.series);
                element.category = this._helperService.replaceSpecialCharacters(element.category);
                element.name = this._helperService.replaceSpecialCharacters(element.name); 

                return true;
              }

              
              return false;
            });
          }
        },
        err => {
        }

      );
  }

  addToCollection(id: string, name: string){
    $(`#${id}-collection-button`).addClass('animated faster pulse');

    setTimeout(() => {
      $(`#${id}-collection-button`).removeClass('animated faster pulse');
    }, 500);

    if(this.collection.includes(id)){
      this.removeFromCollection(id, name);
    }

    else{

      this.apiService.addToCollection(id).subscribe(
        res => { 
          this.getUserCollection();
          this._helperService.addSuccessToMessages(`${this.addSuccess} ${name} to collection!`);
        },
        err => {
          this.getUserCollection();
          this._helperService.addErrorToMessages(`${this.addFailedMessage} ${name} to  collection.`);
        }

      );
    }
  }

  removeFromCollection(id: string, name: string){

    this.apiService.removeFromCollection(id).subscribe(
      res => { 
        this.getUserCollection();
        this._helperService.addSuccessToMessages(`${this.removeSuccess} ${name} from  collection!`);
      },
      err => {
        this.getUserCollection();
        this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} from  collection.`);
      }

    );
  }

  addToWishlist(id: string, name: string){
    $(`#${id}-wishlist-button`).addClass('animated faster pulse');

    setTimeout(() => {
      $(`#${id}-wishlist-button`).removeClass('animated faster pulse');
    }, 500);

    if(this.wishlist.includes(id)){
      this.removeFromWishlist(id, name);
    }

    else{

      this.apiService.addToWishlist(id).subscribe(
        res => { 
          this.getUserWishlist();
          this._helperService.addSuccessToMessages(`${this.addSuccess} ${name} to  wishlist!`);
        },
        err => {
          this.getUserWishlist();
          this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} to  wishlist.`);
        }

      );
    }
  }

  removeFromWishlist(id: string, name: string){

    this.apiService.removeFromWishlist(id).subscribe(
      res => { 
        this.getUserWishlist();
        this._helperService.addSuccessToMessages(`${this.removeSuccess} ${name} from  wishlist!`);
      },
      err => {
        this.getUserWishlist();
        this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} from  wishlist.`);
      }

    );
  }


  getEbayListings(count: number){
    this.availableEbayListings = null;
    let searchText = `Funko ${this.basicInfo.name} ${this.basicInfo.number}`;

    this.ebaySearchText = searchText;

    this.apiService.getEbayListings(searchText, count).subscribe(
      res => { 

        let ebayListings = res['findItemsByKeywordsResponse'][0].searchResult[0].item;
        
        if(ebayListings == null){
          return;
        }

        ebayListings.forEach((listing) => {
          listing.sellingStatus[0].convertedCurrentPrice[0].__value__ = parseFloat(listing.sellingStatus[0].convertedCurrentPrice[0].__value__).toFixed(2);
          
          let location = listing.location[0].split(',');
          listing.location[0] = `${location[0]}, ${location[1]}`;
          listing.location.push(location[2]);
        });

        this.availableEbayListings = ebayListings;
      },
      err => {
        //this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} from  wishlist.`);
      }

    );

  }

  getCompletedListings(count: number){
    this.availableEbayListings = null;
    let searchText = `Funko ${this.basicInfo.name} ${this.basicInfo.number}`;

    this.ebaySearchText = searchText;

    this.apiService.getCompletedEbayListings(searchText, count).subscribe(
      res => { 
        let ebayListings = res['findCompletedItemsResponse'][0].searchResult[0].item;

        if(ebayListings == null){
          return;
        }

        ebayListings.forEach((listing) => {
          listing.sellingStatus[0].convertedCurrentPrice[0].__value__ = parseFloat(listing.sellingStatus[0].convertedCurrentPrice[0].__value__).toFixed(2);
          
          let location = listing.location[0].split(',');
          listing.location[0] = `${location[0]}, ${location[1]}`;
          listing.location.push(location[2]);
          
          listing.listingInfo[0].endTime[0] = this.convertToReadableDate(listing.listingInfo[0].endTime[0])[0];

          if(moment().diff(listing.listingInfo[0].endTime[0], 'days') <= 90){
            this.chartDataset.push(
              {
                x: listing.listingInfo[0].endTime[0],
                y: listing.sellingStatus[0].convertedCurrentPrice[0].__value__
              }
            );
          }
        });

        setTimeout(() => { this.initializeLineChart()}, 500);
        
        this.completedListings = ebayListings;
      },
      err => {
        //this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} from  wishlist.`);
      }

    );
  }

  convertToReadableDate(dateString: string){
    let soldDate = `${moment(dateString).format('MMM DD YYYY')} at ${moment(dateString).format('hh:mm:ss A')}`;
    return [moment(dateString).format('MMM DD YYYY'), moment(dateString).format('hh:mm:ss A')];
  }


  initializeLineChart(){
    let saleChart = <HTMLCanvasElement> document.getElementById("saleChart");
    let myChart = new Chart(saleChart, {
      type: 'line',
      data: {
        datasets: [{
          data: this.chartDataset,
          borderColor: 'rgba(45, 222, 152, 0.4)',
          backgroundColor: 'rgba(45, 222, 152, 0.1)',
          pointBackgroundColor:  'rgb(45, 222, 152)'
        }]
      },
      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItems, data) {
                return "$" + parseFloat(tooltipItems.yLabel).toFixed(2);
            }
          }
        },
        title: {
          display: true,
          fontColor: '#ffed68',
          text: "Sales History (last 90 days)"
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              callback: function(value, index, values) {
                return '$' + value;
            }
            }
          }],
          xAxes: [{
            type: 'time',
            time: {
                unit: 'month'
            }
          }]
        }
      }
  });
  }

  staggerListings(){

    this.showCompletedListings = this.showCompletedListings ? false : true;

    if(this.showCompletedListings){
      let temp = this.completedListings;
      this.completedListings = [];

      let currIndex = 0;

      setInterval(() =>{
        if(currIndex == temp.length)
          return;
        this.completedListings.push(temp[currIndex]);
        ++currIndex;
      }, 50);
    } else{
      let temp = this.availableEbayListings;
      this.availableEbayListings = [];

      let currIndex = 0;

      setInterval(() =>{
        if(currIndex == temp.length)
          return;
        this.availableEbayListings.push(temp[currIndex]);
        ++currIndex;
      }, 50);
    }
  }
}
