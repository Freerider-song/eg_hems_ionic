import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ServerComm } from '../../providers/server_comm';
import { ServiceAlert } from '../../providers/service_message';

/**
 * Generated class for the EvPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ev',
  templateUrl: 'ev.html',
})
export class EvPage {

  seq_member:any;
  seq_apt_ho:any;

  public ev_charge_list: Array<any>;

  constructor(public host:ServerComm, public msg:ServiceAlert,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvPage');

    this.loadLocalData();
  }

  //기본데이터 가져오기
 loadLocalData()
 {
    this.host.getUser().then((data)=>
    { 
      if(data==null)
        {
        }
        else //로그인정보 넣어준다.
        {
            var myjson:any = JSON.parse(JSON.stringify(data));
            this.seq_member = myjson.seq_member;//회원seq얻어온다

            //회원정보얻기
            this.host.GetMemberInfo(myjson.seq_member).subscribe(
              data => 
              {
                this.seq_apt_ho = data.member_info.seq_apt_ho;
                
                this.GetEvChargeList();
              },
              err=>
              {
                console.log(err);
                this.msg.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
              },
              () => 
              {//this.loginstate=1;
                console.log('Movie Search Complete');
              }
            );
        }
      });
     
 }

 GetEvChargeList(){
    this.host.GetEvChargeList(this.seq_apt_ho).subscribe(
      data =>
      {
        for(let charge of data.list_ev_charge) //현재 갯수만큼 추가..
        {

        }
        this.ev_charge_list = data.list_ev_charge; //json배열리스트  
      },
      err=>
      {
        console.log(err);
        this.msg.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
      },
      () => 
      {//this.loginstate=1;
        console.log('Movie Search Complete');
      }
    );
 }

}
