import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NoticeViewPage } from '../notice-view/notice-view';
import { ServerComm } from "../../providers/server_comm";
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import {sprintf} from "sprintf-js";
/**
 * Generated class for the NoticeListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { AlertController } from 'ionic-angular';
import { NotifyListPage } from '../notify-list/notify-list';


@Component({
  selector: 'page-notice-list',
  templateUrl: 'notice-list.html',
})
export class NoticeListPage {

  member_id:string="";
  password:string="";
  islogin:any = false;
  start:number = 0;//시작페이지 초기
  end:number = 10;//몇개 조회할지..
  ismore:string = "false";//더이상 있는지 유무확인..
  seq_member:any;
  public top_content_list: Array<any>;
  public content_list: Array<any>;
  notice_count:any = 0;
  time_created_max:any;//다음데이터 가져오기 위한 값

  constructor(public host:ServerComm,private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeListPage');
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
                this.member_id = myjson.userid;
                this.NoticeList();
            }
          });
        
    }


  //공지요청
  NoticeList()
  {
        
    var now = new Date()
    //var myDate: String = new Date().toUTCString();
    //alert(myDate);

    var y = now.getFullYear();
    var m = now.getMonth()+1  
    var d = now.getDate();
    var currentday = sprintf("%s%02d%02d%02d%02d%02d", y,m,d,now.getHours(),now.getMinutes(),now.getSeconds());//오늘날짜
//alert(currentday);
    //now.getFullYear();
    //now.getMonth();
    //now.getDate();
    //now.getHours();
    //now.getMinutes();
    //now.getSeconds();
    


    this.host.GetNoticeList(this.seq_member,currentday,10).subscribe(
      data => 
      {  

        this.notice_count = data.count_notice;//공지갯수

        // 상단고정 notice
        for(let notice of data.notice_top_list) //현재 갯수만큼 추가..
        {   
          notice.color = "#fff8a0";
          if(notice.time_read=="" || notice.time_read=="null" || notice.time_read==null) {
            //안읽음
            notice.is_new = true;
          }
          else {
            //notice.color="#fff";//읽음처리
            notice.is_new = false;
          }
       

          /*var now = moment().format('YYYY-MM-DD');
          
          if(notice.time_created)
          {
            var str2 = notice.time_created;//답변생성일
            var tok2 = str2.split(' ');
            
            //생성일 또는 답변일
            if(now==tok2[0])//new 표시 (오늘날짜이면..)
            {
              notice.is_new = true;
            }
            else
            {
              notice.is_new = false;
            }
          }*/
        }     
        this.top_content_list = data.notice_top_list;//json배열리스트      


        //상단고정아닌 notice
        for(let notice2 of data.notice_list) //현재 갯수만큼 추가..
        {   
          if(notice2.time_read=="" || notice2.time_read=="null" || notice2.time_read==null) notice2.is_new = true;//안읽음
          else notice2.is_new = false;//읽음처리
          
          var now = moment().format('YYYY-MM-DD');
          
          /*if(notice2.time_created)
          {
            var str2 = notice2.time_created;//답변생성일
            var tok2 = str2.split(' ');
            
            //생성일 또는 답변일
            if(now==tok2[0])//new 표시 (오늘날짜이면..)
            {
              notice2.is_new = true;
            }
            else
            {
              notice2.is_new = false;
            }
          }*/


          var lasttime:string = notice2.time_created;//마지막 시간 //2019-11-09 19:53:48

          //저것을 - 와 : 을 없애고 붙여서 만들자
          
        //  lasttime = lasttime.replace(':', '');
//          lasttime = lasttime.replace('-', '');

            //let email = lasttime;//"my.email@email.com";
            lasttime = lasttime.split(':').join('');
            lasttime = lasttime.split('-').join('');
            lasttime = lasttime.split(' ').join('');

          this.time_created_max = lasttime;//시간값을 20191223162045 이걸로 만들어서 다음데이터를 받아오자..

        }     
        this.content_list = data.notice_list;//json배열리스트      


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
  requestNoticeAdd(infiniteScroll:any)
  {
      this.host.GetNoticeList(this.seq_member,this.time_created_max,10).subscribe(
      data => 
      {  

        this.notice_count = data.count_notice;//공지갯수
/*
        // 상단고정 notice
        for(let notice of data.notice_top_list) //현재 갯수만큼 추가..
        {   
          if(notice.time_read=="" || notice.time_read=="null" || notice.time_read==null) notice.color = "#fff8a0";//안읽음
          else notice.color="#fff";//읽음처리
       

          var now = moment().format('YYYY-MM-DD');
          
          if(notice.time_created)
          {
            var str2 = notice.time_created;//답변생성일
            var tok2 = str2.split(' ');
            
            //생성일 또는 답변일
            if(now==tok2[0])//new 표시 (오늘날짜이면..)
            {
              notice.is_new = true;
            }
            else
            {
              notice.is_new = false;
            }
          }
          this.top_content_list.push(notice);
        }     
        infiniteScroll.complete();*/
        //this.top_content_list = data.notice_top_list;//json배열리스트      


        //상단고정아닌 notice
        for(let notice2 of data.notice_list) //현재 갯수만큼 추가..
        {   
          if(notice2.time_read=="" || notice2.time_read=="null" || notice2.time_read==null) {
          
            notice2.is_new = true;
          }
          else {
           
            notice2.is_new = false;
          }
          
          var now = moment().format('YYYY-MM-DD');
          
          /*if(notice2.time_created)
          {
            var str2 = notice2.time_created;//답변생성일
            var tok2 = str2.split(' ');
            
            //생성일 또는 답변일
            if(now==tok2[0])//new 표시 (오늘날짜이면..)
            {
              notice2.is_new = true;
            }
            else
            {
              notice2.is_new = false;
            }
          }*/
          var lasttime:string = notice2.time_created;//마지막 시간 //2019-11-09 19:53:48

          //저것을 - 와 : 을 없애고 붙여서 만들자
          
          //lasttime = lasttime.replace(':', '');
          //lasttime = lasttime.replace('-', '');
          lasttime = lasttime.split(':').join('');
          lasttime = lasttime.split('-').join('');
          lasttime = lasttime.split(' ').join('');

          this.time_created_max = lasttime;//시간값을 20191223162045 이걸로 만들어서 다음데이터를 받아오자..          
          
          this.content_list.push(notice2);

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
    /*
    //alert(this.start+':'+this.end);
          //this.presentLoading();
      this.data.board_list_request('',this.start,this.end,this.board_list_name,this.board_name,this.searchstr).subscribe(
      datadata => 
      {         
        this.ismore = datadata.more_list;
        for(let person of datadata.notice_board_list) //현재 갯수만큼 추가..
        {
          person.wr_subject = decodeURIComponent(person.wr_subject);//특수문자를 포함해서 다 디코딩함
          person.wr_content = decodeURIComponent(person.wr_content);//특수문자를 포함해서 다 디코딩함
          this.notices.push(person);//추가로 넣는다..
        }
        infiniteScroll.complete();
      },
      err=>
      {
        console.log(err);
        alert(err);
        //this.loader.dismiss();
      },
      () => console.log('Movie Search Complete')
    );*/
  }


  doInfinite(infiniteScroll:any): Promise<any> 
  {
    /*
    if(this.ismore=="false")//더이상 없음 로딩바 무한스크롤 안함..
    {
      infiniteScroll.complete();
      return;
    }
    console.log('Begin async operation');

    return new Promise((resolve) => 
    {
      setTimeout(() => {
        this.start+=this.end;//갯수만큼 조회
        this.requestNoticeAdd(infiniteScroll);
        //infiniteScroll.complete();
        console.log('Async operation has ended');
        resolve();
      }, 500);
    })
    */
   return new Promise((resolve) => 
   {
     setTimeout(() => {
       this.requestNoticeAdd(infiniteScroll);
       //infiniteScroll.complete();
       console.log('Async operation has ended');
       resolve();
     }, 500);
   })   
  }


  noticeview2(_item)
  {
    this.host.SetNoticeListAsRead(this.seq_member,_item.seq_notice).subscribe(
      data => 
      {  
        for(let nt of this.top_content_list) //현재 갯수만큼 추가..
        {   
          if(nt.seq_notice==_item.seq_notice) nt.is_new = false;//읽음처리
        }      

        this.navCtrl.push(NoticeViewPage,{item:_item});
      });
  }

  noticeview(_item)
  {
    this.host.SetNoticeListAsRead(this.seq_member,_item.seq_notice).subscribe(
      data => 
      {  
        for(let nt of this.content_list) //현재 갯수만큼 추가..
        {   
          if(nt.seq_notice==_item.seq_notice) nt.is_new = false;//읽음처리
        }      

        this.navCtrl.push(NoticeViewPage,{item:_item});
      });
  }

  
  //알림
  notify()
  {
    this.navCtrl.push(NotifyListPage);
  }

}
