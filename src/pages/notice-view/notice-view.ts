import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NoticeViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-notice-view',
  templateUrl: 'notice-view.html',
})

export class NoticeViewPage {
item:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.item = navParams.get('item');//데이터 공지
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeViewPage');
  }

  golist()
  {
    this.navCtrl.pop();
  }
}
