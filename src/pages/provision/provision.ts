import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import { ServerComm} from "../../providers/server_comm";
//import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
/**
 * Generated class for the PrivacyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-provision',
  templateUrl: 'provision.html',
})
export class ProvisionPage {
  public description1:any;
  userinfo:any='';
  userinfo2:any='';  
  userid:String = '';
  password:String = '';
  constructor(private data:ServerComm, public navCtrl: NavController, public navParams: NavParams, private http:Http) 
  {

  }

  ionViewWillEnter()
{
 
}

ionViewWillLeave()
{
 
}   

  ionViewDidLoad() {

    this.requestAppinfo();
  }


  //앱정보
requestAppinfo()
{
  /*

    this.data.requestAppinfo(this.userid,this.password).subscribe
    (
        datadata=>
        {
            this.userinfo = decodeURIComponent(datadata.userinfo);
            this.userinfo2 = decodeURIComponent(datadata.userinfo2);
          },
        err=>
        {
            console.log(err);
            alert(err);
        },
        ()=>console.log('Movie Search Complate')
    );*/
    /*
    const browser = this.iab.create('https://egservice.co.kr/HemsService/HEMS_Service.htm', 'defaults', { location: 'no'});

        browser.on('loadstart').subscribe(event => {
        });

        browser.on('exit').subscribe(evnet => {
          browser.close();
        })*/
}

  

}
