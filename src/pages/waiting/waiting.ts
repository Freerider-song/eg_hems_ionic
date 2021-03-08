import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events, MenuController, Nav, Platform, Loading } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ServerComm } from '../../providers/server_comm';

/**
 * Generated class for the WaitingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-waiting',
  templateUrl: 'waiting.html',
})
export class WaitingPage 
{
  state:any;//인증상태정보
  iscert:any= false;//승인요청보냇는지 유무
  user_create_seq_member:any;//유저seq

  site_name:any;//아파트명
  apt_dong_name:any;//동
  apt_ho_name:any;//호수

  constructor(public host:ServerComm, public navCtrl: NavController, public navParams: NavParams,public platform: Platform, public alertCtrl: AlertController) 
  {
    this.state = navParams.get('state');//상태정보
    this.user_create_seq_member = navParams.get('user_create_seq_member');//유저seq
  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad WaitingPage');
    this.getMember();
  }

  msgbox(str)
  {
          let alert = this.alertCtrl.create({
          title: '알림',
          subTitle: str,
          buttons: ['확인']
      });
      alert.present();
  }

  //회원정보얻기
  getMember()
  {
    this.host.GetMemberInfo(this.user_create_seq_member).subscribe(
      data => 
      {
        this.site_name = data.member_info.site_name;
        this.apt_dong_name = data.member_info.apt_dong_name;
        this.apt_ho_name = data.member_info.apt_ho_name;
      },
      err=>
      {
        console.log(err);
        this.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
      },
      () => 
      {//this.loginstate=1;
        console.log('Movie Search Complete');
      }
    );
  }
  //승인요청
  RequestAckMember_request()
  {
    var msg:any =this.site_name+"아파트 "+this.apt_dong_name+"동 "+this.apt_ho_name+"호의 세대주님에게 승인요청 알림을 보냈습니다.<br><br>세대주님께서 승인하신 후에 다시 로그인 하시기 바랍니다.";


    this.host.RequestAckMember(this.user_create_seq_member).subscribe(
      data => 
      {
        if(data.result_code ==0)
        {
          this.msgbox('승인 요청을 보낼 수 없습니다.');          
        }
        else if(data.result_code ==1)//승인요청을 성공적으로 보냈다.
        {
          this.msgbox(msg);
          this.iscert = true;
        }        
        else if(data.result_code ==-1)
        {
          this.msgbox('세대주에게 승인 요청을 보낼 수 없습니다.');                    
        }    
        else
        {
          this.msgbox('다시 접속해주세요. 승인 요청을 보낼 수 없습니다.');          
        }            
        /*
        "ack_request_today_count": 2,
        "result_code": 1,
        "seq_alarm_inserted": 1772
        */
        //result_code (0=member 찾기 실패, 1=성공, -1=푸시 보내기 실패)
      },
      err=>
      {
        console.log(err);
        this.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
      },
      () => 
      {//this.loginstate=1;
        console.log('Movie Search Complete');
      }
    );
  }
  cert()
  {
    let confirm = this.alertCtrl.create({
      title: '알림',
      message: '세대주님에게 승인요청알림을 보내시겠습니까?',
      buttons: [
        {
          text: '아니오',
          handler: () => 
          {
          }
        },
        {
          text: '예',
          handler: () => 
          {
            this.RequestAckMember_request();
          }
        }
      ]
    });
    confirm.present();

  }
  exit()
  {
    this.platform.exitApp();
  }  

}
