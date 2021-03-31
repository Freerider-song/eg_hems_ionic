import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvisionPage } from '../provision/provision';
import { PrivacyPage } from '../privacy/privacy';
import { AppVersion } from '@ionic-native/app-version';


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

  constructor(public navCtrl: NavController, public navParams: NavParams) 
  {
    /*
    brower에서는 작동하지 않음
    this.appVersion.getVersionNumber().then((s) => {
      this.version = s;
    });
    */
    this.version = '1.0.3';
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
