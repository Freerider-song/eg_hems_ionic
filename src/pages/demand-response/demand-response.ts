import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotifySetPage } from '../notify-set/notify-set';
import { ServerComm } from "../../providers/server_comm";
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import {sprintf} from "sprintf-js";
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
  start:number= 0;
  end:number = 7;//몇개 조회할지..
  ismore:string = "false";//더이상 있는지 유무확인..
  seq_member:any;
  public content_list: Array<any>;
  time_created_max:any;



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
  RequestContentList()
  {
    var now = new Date()
    //var myDate: String = new Date().toUTCString();
    //alert(myDate);

    var y = now.getFullYear();
    var m = now.getMonth()+1  
    var d = now.getDate();
    var currentday = sprintf("%s%02d%02d%02d%02d%02d", y,m,d,now.getHours(),now.getMinutes(),now.getSeconds());//오늘날짜
    
    this.host.GetDrList(this.seq_member, currentday, this.end).subscribe(
      data => 
      {  
        for(let dr of data.dr_list) //현재 갯수만큼 추가..
        {   
          if(!dr.time_read){//안읽었다면
            dr.color = "#fff"//안읽음처리
            dr.is_new = true;
          } 
          else {
            dr.color="#f1f1f1";//읽음
            dr.is_new = false;
          }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
          dr.time_begin = new Date(dr.time_begin);
          dr.time_end = new Date(dr.time_end);
          dr.time_begin = dr.time_begin.getMonth() + "월" + dr.time_begin.getDate() +"일 " + dr.time_begin.getHours() + ":" + dr.time_begin.getMinutes();
          dr.time_end = dr.time_end.getMonth() + "월" + dr.time_end.getDate() +"일 " + dr.time_end.getHours() + ":" + dr.time_end.getMinutes();
          var now = moment().format('YYYY-MM-DD');

          //        alert(now);
                  
                  //var str = qa.time_question;//생성일
                  //var tok = str.split(' ');
          
         

          var lasttime:string = dr.time_created;

          //저것을 - 와 : 을 없애고 붙여서 만들자
          lasttime = lasttime.split(':').join('');
          lasttime = lasttime.split('-').join('');
          lasttime = lasttime.split(' ').join('');

          this.time_created_max = lasttime;
  
        }      
               
        this.content_list = data.dr_list;//json배열리스트      
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
   //추가적으로 스크롤 내렸을때..호출
   requestDrAdd(infiniteScroll:any)
   {
       this.host.GetDrList(this.seq_member,this.time_created_max, this.end).subscribe(
       data => 
       {  
 
        for(let dr of data.dr_list) //현재 갯수만큼 추가..
        {   
          if(!dr.time_read){//안읽었다면
            dr.color = "#fff"//안읽음처리
            dr.is_new = true;
          } 
          else {
            dr.color="#f1f1f1";//읽음
            dr.is_new = false;
          }       
          dr.time_begin = new Date(dr.time_begin);
          dr.time_end = new Date(dr.time_end);
          dr.time_begin = dr.time_begin.getMonth() + "월" + dr.time_begin.getDate() +"일 " + dr.time_begin.getHours() + ":" + dr.time_begin.getMinutes();
          dr.time_end = dr.time_end.getMonth() + "월" + dr.time_end.getDate() +"일 " + dr.time_end.getHours() + ":" + dr.time_end.getMinutes();

          var lasttime:string = dr.time_created;

          //저것을 - 와 : 을 없애고 붙여서 만들자
          lasttime = lasttime.split(':').join('');
          lasttime = lasttime.split('-').join('');
          lasttime = lasttime.split(' ').join('');

          this.time_created_max = lasttime;
           
           this.content_list.push(dr);
 
         }     
         infiniteScroll.complete();
        // this.content_list = data.notice_list;//json배열리스트      
 
 

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

     doInfinite(infiniteScroll:any): Promise<any> 
     {

      return new Promise((resolve) => 
      {
        setTimeout(() => {
          this.requestDrAdd(infiniteScroll);
      
          console.log('Async operation has ended');
          resolve();
        }, 500);
      })   
     }
   
 
 
  //닫기
  close(seq_dr)
  {
    this.host.SetDrListAsRead(this.seq_member,seq_dr).subscribe(
      data => 
      {  

        for(let dr of this.content_list) //현재 갯수만큼 추가..
        {   
          if(dr.seq_dr==seq_dr){
            dr.color = "#f1f1f1"//읽음처리
            dr.is_new = false;
            let alert = this.alertCtrl.create({
              cssClass: 'my-custom-class',
              title: dr.title,
              subTitle:   
            dr.content + "<ul> <li> 감축량: " + dr.kwh +" kWh</li><li>감축기간: </br>" + 
              dr.time_begin + " ~ " + dr.time_end +"</li></ul>",
              buttons: ['확인']
          });
          alert.present();
          }
     
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
