import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {sprintf} from "sprintf-js";
import { Events } from 'ionic-angular';
import * as moment from 'moment';
/**
 * Generated class for the DailySearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-daily-search',
  templateUrl: 'daily-search.html',
})
export class DailySearchPage {

  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  yearmonth:any;
  history_back_type:any;//돌아갈 위치가 어디가?

  constructor(public navCtrl: NavController, private events: Events,public navParams: NavParams) {
    this.history_back_type = navParams.get('history_back_type');//돌아갈위치얻기

    var currentdate = navParams.get('currentdate');//현재 달력으로 클릭해서 들어온날짜


    this.date = new Date(currentdate);
    this.monthNames = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    this.getDaysOfMonth();

    var now = moment(currentdate).format("YYYY-MM");// date 객체를 YYYY년도로 받기
/*    
    this.date = moment(this.currentDate).toDate();

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = new Date().getDate();*/

    this.yearmonth = now;         
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailySearchPage');
  }


  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if(this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }
  
    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }
  
    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for (var i = 0; i < thisNumOfDays; i++) {
      this.daysInThisMonth.push(i+1);
    }
  
    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
    for (var i = 0; i < (6-lastDayThisMonth); i++) {
      this.daysInNextMonth.push(i+1);
    }
    var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
    if(totalDays<36) {
      for(var i = (7-lastDayThisMonth); i < ((7-lastDayThisMonth)+7); i++) {
        this.daysInNextMonth.push(i);
      }
    }
  }
 
  updateMyDate()
  {
    var str = this.yearmonth;
    str = str.split("-");
        
    //alert(str[0]);
    //alert(str[1]);
//alert(str[0]);
//alert(str[1]);
    //this.date.setFullYear(str[0]);
    this.date = moment(this.yearmonth).toDate();
    //this.date.setMonth(str[1]);

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = new Date().getDate();
    
    var now = moment(this.date).format("YYYY-MM");// date 객체를 YYYY년도로 받기
    this.yearmonth = now;

    this.date = moment(this.date).toDate();
    this.getDaysOfMonth();
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);

    var now = moment(this.date).format("YYYY-MM");// date 객체를 YYYY년도로 받기
    this.yearmonth = now;
    this.date = moment(this.date).toDate();
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);

    var now = moment(this.date).format("YYYY-MM");// date 객체를 YYYY년도로 받기
    this.yearmonth = now;
    this.date = moment(this.date).toDate();
    this.getDaysOfMonth();
  }  

   //현재 선택한 년,월,일
   selectDate(day) {

    var y = this.date.getFullYear();
    var m = this.date.getMonth()+1  
    var str = sprintf("%s-%02d-%02d", y,m,day);

    this.currentDate = str;
    
    if(this.history_back_type ==0 ) // 홈화면
    {
      this.events.publish('calender_reload', { date:str} );
      this.navCtrl.pop();
    }
    if(this.history_back_type ==1 ) // 일간조회
    {
      this.events.publish('calender_reload2', { date:str} );
      this.navCtrl.pop();
    }    
  }



}
