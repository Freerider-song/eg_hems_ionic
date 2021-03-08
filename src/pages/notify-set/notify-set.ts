import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NotifySetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-notify-set',
  templateUrl: 'notify-set.html',
})
export class NotifySetPage {

  elect1:any;
  elect2:any;

  sudo1:any;
  sudo2:any;

  gas1:any;
  gas2:any;
  
  nan1:any;
  nan2:any;
  
  onsu1:any;
  onsu2:any;      
    
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotifySetPage');
  }

  saveset()
  {
    
  }

  CommaFormatted1(event) {
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40) return;

  // format number
  if (this.elect1) {
  this.elect1 = this.elect1.replace(/\D/g, "")
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }}

  CommaFormatted2(event) {
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40) return;

  // format number
  if (this.elect2) {
  this.elect2 = this.elect2.replace(/\D/g, "")
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }}    

  CommaFormatted3(event) {
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40) return;

  // format number
  if (this.sudo1) {
  this.sudo1 = this.sudo1.replace(/\D/g, "")
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }} 

  CommaFormatted4(event) {
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40) return;

  // format number
  if (this.sudo2) {
  this.sudo2 = this.sudo2.replace(/\D/g, "")
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }} 

  CommaFormatted5(event) {
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40) return;

  // format number
  if (this.gas1) {
  this.gas1 = this.gas1.replace(/\D/g, "")
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }} 
  CommaFormatted6(event) {
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40) return;

  // format number
  if (this.gas2) {
  this.gas2 = this.gas2.replace(/\D/g, "")
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }} 

  CommaFormatted7(event) {
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40) return;

  // format number
  if (this.nan1) {
  this.nan1 = this.nan1.replace(/\D/g, "")
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }} 

  CommaFormatted8(event) {
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40) return;

  // format number
  if (this.nan2) {
  this.nan2 = this.nan2.replace(/\D/g, "")
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }} 

  CommaFormatted9(event) {
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40) return;

  // format number
  if (this.onsu1) {
  this.onsu1 = this.onsu1.replace(/\D/g, "")
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }} 

  CommaFormatted10(event) {
  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40) return;

  // format number
  if (this.onsu2) {
  this.onsu2 = this.onsu2.replace(/\D/g, "")
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }}                     

   numberCheck (args) {
   if (args.key === 'e' || args.key === '+' || args.key === '-') {
     return false;
   } else {
     return true;
   }}  

}
