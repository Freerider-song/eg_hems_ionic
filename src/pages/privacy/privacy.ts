import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import { ServerComm} from "../../providers/server_comm";

/**
 * Generated class for the PrivacyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {
  public description1:any;
  userinfo:any='';
  userinfo2:any='';  
  userid:String = '';
  password:String = '';

  constructor(private data:ServerComm,public navCtrl: NavController, public navParams: NavParams, private http:Http) 
  {
    /*
    this.http.get('assets/text/agree1-1.txt')
    .map((res) => res.text())
    .subscribe(data =>
    {
      this.description1 = data;
    },(rej) => {console.error("Could not load local data",rej)}
    );
    */
  }

ionViewWillEnter()
{
 
}

ionViewWillLeave()
{
 
}   

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacyPage');

    this.requestAppinfo();
  }


//앱정보
requestAppinfo()
{
  /*
    //this.data.requestAppinfo(this.userid,this.password).subscribe
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
}
  

}
