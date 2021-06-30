import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotifySetPage } from '../notify-set/notify-set';
import { ServerComm } from "../../providers/server_comm";
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
/**
 * Generated class for the NotifyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-demand-response',
  templateUrl: 'demand-response.html',
})
export class DemandResponsePage {

  member_id:string="";
  password:string="";
  islogin:any = false;
  
  end:number = 20;//몇개 조회할지..
  ismore:string = "false";//더이상 있는지 유무확인..
  seq_member:any;
  public content_list: Array<any>;



  constructor(public host:ServerComm,private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotifyListPage');
    this.loadLocalData();
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

  //알림
  demandResponse()
  {
    this.navCtrl.push(DemandResponsePage);
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
              this.member_id = myjson.userid;
              this.RequestContentList();
          }
        });
  }

  //알림 요청
  RequestContentList(searchstr="")
  {
    this.host.GetAlarmList(this.seq_member,this.end).subscribe(
      data => 
      {  
        for(let alram of data.alarm_list) //현재 갯수만큼 추가..
        {   
          if(alram.is_read==1) alram.color = "#f1f1f1"//읽음처리
          else alram.color="#fff";//안읽음

          var now = moment().format('YYYY-MM-DD');

          //        alert(now);
                  
                  //var str = qa.time_question;//생성일
                  //var tok = str.split(' ');
          
          if(alram.time_created)
          {
            var str2 = alram.time_created;//답변생성일
            var tok2 = str2.split(' ');
            
            //생성일 또는 답변일
            if(/*now==tok[0] ||*/ now==tok2[0])//new 표시 (오늘날짜이면..)
            {
              alram.is_new = true;
            }
            else
            {
              alram.is_new = false;
            }
          }
          
          /*
          seq_alarm:any;
          alarm_type:any;
          title:any;
          content:any;
          time_created:any;
          time_read:any;
          is_read:any;
          seq_member_ack_requester:any;
          ack_response:any;
          */
        }      
               
        this.content_list = data.alarm_list;//json배열리스트      
      },
      err=>
      {
         console.log(err);
         alert('네트워크 연결을 확인해주세요.');
         //this.loader.dismiss();
      },
      () => console.log('Movie Search Complete')
    );      
  }  

  //수락
  agree(seq_alarm, seq_member_ack_requester)
  {
    this.host.ResponseAckMember(seq_member_ack_requester,1).subscribe(
      data => 
      {  
        this.msgbox("승인 했습니다.");
      },
      err=>
      {
        console.log(err);
        alert('네트워크 연결을 확인해주세요.');
        //this.loader.dismiss();
      },
      () => console.log('Movie Search Complete')
    );       
  }

  //거절
  reject(seq_alarm)
  {
    this.host.ResponseAckMember(this.seq_member,2).subscribe(
      data => 
      {  
        this.msgbox("거절 했습니다.");
      },
      err=>
      {
        console.log(err);
        alert('네트워크 연결을 확인해주세요.');
        //this.loader.dismiss();
      },
      () => console.log('Movie Search Complete')
    );       
  }

  //닫기
  close(seq_alarm)
  {
    this.host.SetAlarmListAsRead(this.seq_member,seq_alarm).subscribe(
      data => 
      {  

        for(let alram of this.content_list) //현재 갯수만큼 추가..
        {   
          if(alram.seq_alarm==seq_alarm) alram.color = "#f1f1f1"//읽음처리
          //else alram.color="#fff";//안읽음
          /*
          seq_alarm:any;
          alarm_type:any;
          title:any;
          content:any;
          time_created:any;
          time_read:any;
          is_read:any;
          seq_member_ack_requester:any;
          ack_response:any;
          */
        }      
      },
      err=>
      {
        console.log(err);
        alert('네트워크 연결을 확인해주세요.');
        //this.loader.dismiss();
      },
      () => console.log('Movie Search Complete')
    );      
  }
}
