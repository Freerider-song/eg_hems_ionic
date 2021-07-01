import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
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

  version: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public appVersion : AppVersion, public plt: Platform) 
  {
    /*
    //brower에서는 작동하지 않음
    plt.ready().then(()=>{
      this.appVersion.getVersionNumber().then(value => {
        this.version = value;
      }).catch(err => {
        alert(err);
      });
    })*/
    
    
    this.version = '1.1.0';
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
