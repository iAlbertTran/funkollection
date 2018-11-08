import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FunkollectionApiService } from '../services/funkollection-api.service';

import { map } from "rxjs/operators";

import { Series } from "../models/Series";
import { Category } from "../models/category";

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  providers: [FunkollectionApiService],
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  imageSrc: any;
  event: any;

  series: Series[];
  categories: Category[];

  displayNewSeriesInput: boolean = false;
  displayNewCategoryInput: boolean = false;

  name: string;
  seriesSelector: string;
  seriesInput: string;
  categorySelector: string;
  categoryInput: string;
  number: string;


  constructor( private apiService: FunkollectionApiService ) { 
  }

  ngOnInit() {
    this.getSeries();
    this.getCategories();
    this.displayNewSeriesInput = false;
  }

  getSeries(): void{
    this.apiService.getSeries()
      .subscribe(series => {
        series.sort(function (a, b) {
          return a.name.localeCompare(b.name);
      });

        this.series = series;

      });
    

  }

  getCategories(): void{
    this.apiService.getCategories()
      .subscribe(categories => {
        categories.sort(function (a, b) {
          return a.name.localeCompare(b.name);
      });
        console.log(categories);
        this.categories = categories;

      });
    

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

  checkSeriesSelection(value: any){

    if(value == 'Other'){
      this.displayNewSeriesInput = true;
    }
    else{
      this.displayNewSeriesInput = false;
    }
  }

  checkCategorySelection(value: any){

    if(value == 'Other'){
      this.displayNewCategoryInput = true;
    }
    else{
      this.displayNewCategoryInput = false;
    }
  }

  uploadPop(){
    console.log(this.name);
    console.log(this.number);
    console.log(this.seriesSelector == undefined);
  }
}