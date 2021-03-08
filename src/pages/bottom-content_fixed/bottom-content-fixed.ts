import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvisionPage } from '../provision/provision';
import { PrivacyPage } from '../privacy/privacy';

/**
 * Generated class for the BottomContentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-bottom-content-fixed',
  /*inputs: ['screentype: bottom'],  */
  templateUrl: 'bottom-content-fixed.html',

})
export class BottomContentFixedPage {

  version: any;

  constructor(public navCtrl: NavController, public navParams: NavParams ) 
  {
    this.version = '0.8.1';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BottomContentPage');
  }
  privacy1()
  {
    this.navCtrl.push(ProvisionPage);
  }

  privacy2()
  {
    this.navCtrl.push(PrivacyPage);
  }

}
