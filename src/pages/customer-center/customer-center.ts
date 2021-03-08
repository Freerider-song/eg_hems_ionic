import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServerComm } from "../../providers/server_comm";
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { NotifyListPage } from '../notify-list/notify-list';
/**
 * Generated class for the CustomerCenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-customer-center',
  templateUrl: 'customer-center.html',
})
export class CustomerCenterPage {

  public show_menu1:any=true;
  public show_menu2:any=false;
  public show_menu3:any=false;  
  public selectedSegment:any;

  userid:string="";
  password:string="";
  islogin:any = false;
  start:number = 0;//시작페이지 초기
  end:number = 10;//몇개 조회할지..
  ismore:string = "false";//더이상 있는지 유무확인..

  shownGroup = null;

  contact_type:any = 0;
  content:any="";
  seq_member:any;
  bogi:any = 0;
  time_created_max:any;//다음데이터 가져오기 위한 값

  current_question:any;
  current_answer:any;
  time_question:any;
  time_answer:any;
  
  public content_list: Array<any>;
  public qa_list: Array<any>;
  qa_count:any;

  constructor(public data:ServerComm,public navCtrl: NavController, public navParams: NavParams,public storage: Storage, private alertCtrl: AlertController) 
  {
  }


  ionViewCanLeave()//: Promise<void> 
  {
      if(this.bogi==1)
      {
        this.bogi=0;
        return false;
      }
      else
      {
        return true;
      }
  }  

  ionViewDidLoad() 
  {
      //FAQ를 기본으로 표시
      this.selectedSegment = "menu1"; 
      this.show_menu1 = true;
      this.show_menu2 = false;    
      this.show_menu3 = false;    
  }

  //탭클릭시 이벤트
  onSegmentChanged(segmentButton: any) 
  {
      if(segmentButton.value=="menu1")
      {
        this.selectedSegment = "menu1"; 
        this.show_menu1 = true;
        this.show_menu2 = false;
        this.show_menu3 = false;     
        this.bogi=0; 
      }
      if(segmentButton.value=="menu2")
      {
        this.selectedSegment = "menu2"; 
        this.show_menu1 = false;
        this.show_menu2 = true;
        this.show_menu3 = false;      
        this.bogi=0;
      }
      if(segmentButton.value=="menu3")
      {
        this.selectedSegment = "menu3"; 
        this.show_menu1 = false;
        this.show_menu2 = false;
        this.show_menu3 = true; 
        this.qalist();     
      }
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


//질문보내기
  create_qa()
  {
      this.data.CreateQuestion(this.seq_member,this.content).subscribe(
      data => 
      {  
        this.content="";        
        this.msgbox('문의를 남겼습니다.');
      },
      err=>
      {
        console.log(err);
        alert('네트워크 연결을 확인해주세요.');
        //this.loader.dismiss();
      },
      () => console.log('Movie Search Complete'));
  }

  bogi_view(item)
  {
    //읽음처리
    this.data.SetQnaListAsRead(this.seq_member,item.seq_qna).subscribe(
      data => 
      {  
      
        for(let qna of this.qa_list) //현재 갯수만큼 추가..
        {   
          if(qna.seq_qna==item.seq_qna)
          {
            if(qna.time_answer_read=="" || qna.time_answer_read=="null" || qna.time_answer_read==null) qna.color = "#1dd894";//안읽음
            else 
            {
              if(qna.time_answer=="" || qna.time_answer=="null" || qna.time_answer==null)//답변이 달리지 않았으면..
              {
                qna.color = "#1dd894";//안읽음
              }
              else//답변이 달리면..
              {
                qna.color="#ccc";//읽음처리       
              }
            }
          }
//          if(qna.time_answer_read=="" || qna.time_answer_read=="null" || qna.time_answer_read==null) qna.color = "#1dd894";//안읽음
  //        else qna.color="#eee";//읽음처리          
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

     this.bogi=1;
     this.current_question = item.question;
     this.current_answer = item.answer;
     this.time_question= item.time_question;
     this.time_answer= item.time_answer;
  }

  golist()
  {
    this.bogi=0;
  }

  toggleGroup(group) 
  {
    if (this.isGroupShown(group)) 
    {
        this.shownGroup = null;
    } 
    else 
    {
        this.shownGroup = group;
    }
  };

  isGroupShown(group) 
  {
      return this.shownGroup === group;
  };


  //qa목록
  qalist()
  {
    this.data.GetQnaList(this.seq_member).subscribe(
      data => 
      {  
        this.qa_count=1;
        for(let qa of data.qna_list) //현재 갯수만큼 추가..
        {       
          qa.question = decodeURIComponent(qa.question);//특수문자를 포함해서 다 디코딩함
          qa.answer = decodeURIComponent(qa.answer);//특수문자를 포함해서 다 디코딩함

          var now = moment().format('YYYY-MM-DD');

  //        alert(now);
          
          //var str = qa.time_question;//생성일
          //var tok = str.split(' ');
          if(qa.time_answer_read=="" || qa.time_answer_read=="null" || qa.time_answer_read==null) qa.color = "#1dd894";//안읽음
          else 
          {
            if(qa.time_answer=="" || qa.time_answer=="null" || qa.time_answer==null)//답변이 달리지 않았으면..
            {
              qa.color = "#1dd894";//안읽음
            }
            else//답변이 달리면..
            {
              qa.color="#ccc";//읽음처리       
            }
          }

          if(qa.time_answer)
          {
            var str2 = qa.time_answer;//답변생성일
            var tok2 = str2.split(' ');
            
            //생성일 또는 답변일
            if(/*now==tok[0] ||*/ now==tok2[0])//new 표시 (오늘날짜이면..)
            {
              qa.is_new = true;
            }
            else
            {
              qa.is_new = false;
            }
          }

          this.qa_count=2;
        }      
        this.qa_list = data.qna_list;//json배열리스트      
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

  //faq목록가져오기
  RequestContentList(searchstr="")
  {
    /*
      this.data.FaqListRequest(  this.start,this.end).subscribe(
      datadata => 
      {
        this.ismore = datadata.more_list;
      // alert(datadata.status);//상태
      // alert(datadata.more_list);//더있는지?
      // alert(datadata.notice_board_list);//
      //alert(JSON.parse(datadata.text()).results);
      //여기서 잠시 가공해주자..
        for(let person of datadata.content_list) //현재 갯수만큼 추가..
        {       
            person.faq_subject1 = decodeURIComponent(person.faq_subject1);//특수문자를 포함해서 다 디코딩함
            person.faq_content1 = decodeURIComponent(person.faq_content1);//특수문자를 포함해서 다 디코딩함
        }

        //여기서 몽땅 한번에 넣음.
        this.content_list = datadata.content_list;//json배열리스트
    },
      err=>
      {
        console.log(err);
        alert('네트워크 연결을 확인해주세요.');
        //this.loader.dismiss();
      },
      () => console.log('Movie Search Complete')
    );*/
      
    this.data.GetFaqList(1).subscribe(
      data => 
      {  
        for(let faq of data.faq_list) //현재 갯수만큼 추가..
        {       
          faq.question = decodeURIComponent(faq.question);//특수문자를 포함해서 다 디코딩함
          faq.answer = decodeURIComponent(faq.answer);//특수문자를 포함해서 다 디코딩함
        }      
        this.content_list = data.faq_list;//json배열리스트      
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


  RequestContentListAdd(infiniteScroll:any)
  {
      this.data.FaqListRequest(  this.start,this.end).subscribe(
      data => 
      {
    //   this.ismore = datadata.more_list;
      // alert(datadata.status);//상태
      // alert(datadata.more_list);//더있는지?
      // alert(datadata.notice_board_list);//
      //alert(JSON.parse(datadata.text()).results);
        //this.notices = datadata.notice_board_list;//json배열리스트
        
        for(let faq of data.faq_list) //현재 갯수만큼 추가..
        {
          faq.question = decodeURIComponent(faq.question);//특수문자를 포함해서 다 디코딩함
          faq.answer = decodeURIComponent(faq.answer);//특수문자를 포함해서 다 디코딩함

          this.content_list = data.faq_list;//json배열리스트      
        //  this.content_list.push(person);//추가로 넣는다..
          //this.people.push(person);
        }

        infiniteScroll.complete();
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



/*
doInfinite(infiniteScroll:any): Promise<any> 
{
  return new Promise((resolve) => 
  {
    setTimeout(() => 
    {
      this.RequestContentListAdd(infiniteScroll);
      resolve();
    },500);
  })
}
*/




loadLocalData()
{
  //this.data.GetUserLocalNew();
  //이걸하므로써 로그인정보등이 로컬에 저장된것을 모두 가져온다
 
    this.data.getUser().then((data)=>
    { 
         if(data==null)
          {
          }
          else //로그인정보 넣어준다.
          {

            this.storage.ready().then(() => 
            {     
                  //저장소 작업준비가되어있다면..진행
                  this.storage.get('islogin').then((islogin) => 
                  {
                      this.islogin = islogin;                        

                      var myjson:any = JSON.parse(JSON.stringify(data));
                      this.userid = myjson.userid;
                      this.password = myjson.password;
                      this.seq_member = myjson.seq_member;
                     // this.isusing_nick = myjson.isusing_nick;
                      this.reloadInit();
                      //this.requestAppinfo();
                  });                                                                   
             });  

            /*
              var myjson:any = JSON.parse(JSON.stringify(data));
              this.userid = myjson.userid;
             // this.password = myjson.password;
              
              this.reloadInit();
              */
          }
    },(e)=>
    { //reject함수가 실행된경우
      console.log('getting err',e); 
      alert('unable to get local from native storage'); 
    }) 
}  

reloadInit()
{
    this.start = 0;//시작페이지 초기
    this.end = 10;//몇개 조회할지..
   // this.ismore = "false";
   // this.item=[];
  ///  this.faq_list=[];
    this.content_list=[];
    
    /*
    this.RequestProductList();   
    this.RequestEtcList();
    this.brand_request();
    */
   this.RequestContentList();
}


//알림
notify()
{
  this.navCtrl.push(NotifyListPage);
}

ionViewWillEnter()
{

  this.loadLocalData();
}  

}
