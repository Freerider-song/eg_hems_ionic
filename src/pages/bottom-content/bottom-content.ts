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
  selector: 'page-bottom-content',
  /*inputs: ['screentype: bottom'],  */
  templateUrl: 'bottom-content.html',
})
export class BottomContentPage {

  dddd:any="test";
  constructor(public navCtrl: NavController, public navParams: NavParams) 
  {
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

    //this.test('안녕하세요');
  }

  test(dddd)
  {
    var dddd3="3333";

    this.dddd = "ddd";
    alert(this.dddd);
    alert(dddd3);
    alert(dddd);
  }

}
