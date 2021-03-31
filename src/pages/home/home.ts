import { Component } from '@angular/core';
import { Events, MenuController, Nav, Platform, Loading, Config } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ElecSearchYearPage } from '../elec-search-year/elec-search-year';
import { ElecSearchMonthPage } from '../elec-search-month/elec-search-month';
import { ElecSearchDailyPage } from '../elec-search-daily/elec-search-daily';
import { ElecSearchWeekPage } from '../elec-search-week/elec-search-week';
import { BottomContentPage } from '../bottom-content/bottom-content';
import { DailySearchPage } from '../daily-search/daily-search';
import { Storage } from '@ionic/storage';
import { NotifyListPage } from '../notify-list/notify-list';
import { ServerComm } from "../../providers/server_comm";
import { ServiceAlert } from '../../providers/service_message';
import * as moment from 'moment';
import {sprintf} from "sprintf-js";
import { ChangeDetectorRef } from '@angular/core';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx'
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /*
전기 = elec
수도 = water
가스 = gas
난방 = heat
온수 = steam
요금 = won (예 : 이번달 수도 사용량 = WaterThisMonth, 이번달 수도 요금 = WaterWonThisMonth)
*/
  date: any;  
  viewtype:any = 0;// 0 전기, 1수도, 2가스, 3난방, 4온수
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;

  bottom:any="1";

  member_id:string="";
  seq_member:any;
  seq_apt_ho:any;

  usage_curr:any;//사용량
  won_curr:any;//사용요금
  usage_expected:any;//이번달 예상 사용량
  won_expected:any;//이번달 예상 사용요금

  usage_curr_elec:any;//사용량 전기
  won_curr_elec:any;//사용요금 전기
  usage_expected_elec:any;//이번달 예상 사용량 전기
  won_expected_elec:any;//이번달 예상 사용요금 전기

  usage_curr_water:any;//사용량
  won_curr_water:any;//사용요금
  usage_expected_water:any;//이번달 예상 사용량
  won_expected_water:any;//이번달 예상 사용요금

  usage_curr_gas:any;//사용량
  won_curr_gas:any;//사용요금
  usage_expected_gas:any;//이번달 예상 사용량
  won_expected_gas:any;//이번달 예상 사용요금

  usage_curr_heat:any;//사용량
  won_curr_heat:any;//사용요금
  usage_expected_heat:any;//이번달 예상 사용량
  won_expected_heat:any;//이번달 예상 사용요금

  usage_curr_steam:any;//사용량
  won_curr_steam:any;//사용요금
  usage_expected_steam:any;//이번달 예상 사용량
  won_expected_steam:any;//이번달 예상 사용요금

  level_compared1:any;//에너지별 색상값
  level_compared2:any;//에너지별 색상값
  level_compared3:any;//에너지별 색상값
  level_compared4:any;//에너지별 색상값
  level_compared5:any;//에너지별 색상값

  //에너지 검침일
  site_read_day_elec:any;
  site_read_day_water:any;
  site_read_day_gas:any;
  site_read_day_heat:any;
  site_read_day_steam:any;

  constructor(private changeRef: ChangeDetectorRef,public host:ServerComm,public msg:ServiceAlert,public navCtrl: NavController,private events: Events, public storage: Storage, private plt: Platform) {

    this.date = new Date();
    this.monthNames = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = new Date().getDate();    
    this.currentDate = sprintf("%02d",this.currentDate);    

    events.subscribe('home_reload', (data)=>
    {
      this.viewtype = data['menu'];
      //alert(this.viewtype+'home realod 하기');
      this.GetCurrentUsageAll_Request();
      this.changeRef.detectChanges();
      //this.select_type(this.viewtype);
    });

    //달력에서 선택된 이벤트가 날라온다.
    events.subscribe('calender_reload', (data)=>
    {
    //달력의 날짜로 변경한다.
      var datedata:string = data.date;      
/*
      var datearray = datedata.split("-");
      this.date.setDate(datearray[0]);
      this.date.setMonth(datearray[1]);      
      this.date.setDay(datearray[2]);      */
      
      this.date = moment(datedata).toDate();

      this.currentMonth = this.monthNames[this.date.getMonth()];
      this.currentYear = this.date.getFullYear();
      this.currentDate = sprintf("%02d",this.date.getDate());
      
      this.GetCurrentUsageAll_Request();
      this.changeRef.detectChanges();
      //this.select_type(this.viewtype);
    });
    
  }

  ionViewDidLoad() {
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

                this.storage.get('seq_apt_ho').then((data) => {
                  if(data != null) {
                    this.seq_apt_ho = data

                    this.storage.get('site_read_day_elec').then((val) => {this.site_read_day_elec = val;});
                    this.storage.get('site_read_day_water').then((val) => {this.site_read_day_water = val;});
                    this.storage.get('site_read_day_gas').then((val) => {this.site_read_day_gas = val;});
                    this.storage.get('site_read_day_heat').then((val) => {this.site_read_day_heat = val;});
                    this.storage.get('site_read_day_steam').then((val) => {this.site_read_day_steam = val;});

                    this.GetCurrentUsageAll_Request();
                    this.changeRef.detectChanges();
                    //this.select_type(this.viewtype);
                  } else {
                    this.host.GetMemberInfo(myjson.seq_member).subscribe(
                      data => 
                        {
                          this.seq_apt_ho = data.member_info.seq_apt_ho;
      
                          //각 에너지 검침일 확인
                          this.site_read_day_elec=data.member_info.site_read_day_elec;
                          this.site_read_day_water=data.member_info.site_read_day_water;
                          this.site_read_day_gas=data.member_info.site_read_day_gas;
                          this.site_read_day_heat=data.member_info.site_read_day_heat;
                          this.site_read_day_steam=data.member_info.site_read_day_steam;
      
                          this.GetCurrentUsageAll_Request();
                          this.changeRef.detectChanges();
                          //this.select_type(this.viewtype);
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
                )
    
                // //회원정보얻기
                // this.host.GetMemberInfo(myjson.seq_member).subscribe(
                //   data => 
                //   {
                //     this.seq_apt_ho = data.member_info.seq_apt_ho;

                //     //각 에너지 검침일 확인
                //     this.site_read_day_elec=data.member_info.site_read_day_elec;
                //     this.site_read_day_water=data.member_info.site_read_day_water;
                //     this.site_read_day_gas=data.member_info.site_read_day_gas;
                //     this.site_read_day_heat=data.member_info.site_read_day_heat;
                //     this.site_read_day_steam=data.member_info.site_read_day_steam;

                //    // this.GetCurrentUsageElec_Request();
                //     this.select_type(this.viewtype);
                //   },
                //   err=>
                //   {
                //     console.log(err);
                //     this.msg.msgbox('서버와 연결을 할 수 없습니다. 네트워크를 확인해주세요.');
                //   },
                //   () => 
                //   {//this.loginstate=1;
                //     console.log('Movie Search Complete');
                //   }
                // );
            }
          });
        
    }



  ionViewWillUnload()
  {
   this.events.unsubscribe('home_reload');      
   this.events.unsubscribe('calender_reload');      
  }

  //기본 설정 타입
  select_type(viewtype)
  {
    this.viewtype= viewtype;
    /*
    switch(this.viewtype)
    {
        case 0://전기
        {
          this.GetCurrentUsageElec_Request();
        }
        break;
        case 1://수도
        {
          this.GetCurrentUsageWater_Request();
        }
        break;
        case 2://가스
        {
          this.GetCurrentUsageGas_Request();
        }
        break;
        case 3://난방
        {
          this.GetCurrentUsageHeat_Request();          
        }
        break;
        case 4://온수
        {
          this.GetCurrentUsageSteam_Request();          
        }
        break;
    }
    */
    //this.GetCurrentUsageAll_Request();
    //this.Total_levelCompare_Request();   
    //this.changeRef.detectChanges();//새로고침 버그..
  }

  //달력보기
  calender()
  {
    var date2 = sprintf("%s-%02d", this.currentYear ,this.currentMonth);
    this.navCtrl.push(DailySearchPage,{"history_back_type":0, "currentdate": date2});//home으로 리턴
  }

  //현재 에너지 레벨값..
  current_compare_value()
  {
    var level_compare:any;
    switch(this.viewtype)
    {
        case 0://전기
        {
          level_compare = this.level_compared1;
        }
        break;
        case 1://수도
        {
          level_compare = this.level_compared2;
        }
        break;
        case 2://가스
        {
          level_compare = this.level_compared3;
        }
        break;
        case 3://난방
        {
          level_compare = this.level_compared4;
        }
        break;
        case 4://온수
        {
          level_compare = this.level_compared5;         
        }
        break;
    }
    return level_compare;//현재에너지 레벨값 리턴
  }

  //년간
  year()
  {

      this.navCtrl.push(ElecSearchYearPage,{viewtype:this.viewtype,level_compare:this.current_compare_value()});
  }

  //월간
  month()
  {

    this.navCtrl.push(ElecSearchMonthPage,{viewtype:this.viewtype,level_compare:this.current_compare_value()});
  }

  //일간
  daily()
  {
    this.navCtrl.push(ElecSearchDailyPage,{viewtype:this.viewtype,level_compare:this.current_compare_value()});

  }

  //주
  week()
  {
    this.navCtrl.push(ElecSearchWeekPage,{viewtype:this.viewtype,level_compare:this.current_compare_value()});
  }

  //알림
  notify()
  {
    this.navCtrl.push(NotifyListPage);
  }

 //전날이동
  goToLastday() 
  {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()-1);
  //  this.getDaysOfMonth();

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = sprintf("%02d",this.date.getDate());   
    //this.date.setDate(this.currentDate.getDate()+1);
    this.GetCurrentUsageAll_Request();

    this.select_type(this.viewtype);
  }    
  
  //다음날
  goToNextday() 
  {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()+1);
    //this.getDaysOfMonth();

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = sprintf("%02d",this.date.getDate());      
    //this.date.setDate(this.currentDate.getDate()-1);
    this.GetCurrentUsageAll_Request();
    this.changeRef.detectChanges();
    //this.select_type(this.viewtype);
  }   


 //전체 에너지 색상값 요청
 Total_levelCompare_Request()
 {
   var now = new Date()
   this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
   this.currentMonth = this.monthNames[this.date.getMonth()];
   this.currentYear = this.date.getFullYear();
   this.currentDate = sprintf("%02d",this.date.getDate());

   var firstday = sprintf("%s%02d01", this.currentYear,this.currentMonth );//해당달의 1일
   var currentday = sprintf("%s%02d%02d%02d%02d", this.currentYear ,this.currentMonth,this.currentDate,now.getHours(),now.getMinutes());//오늘날짜

    // 여기 부분에서 이미지 관련 오류 발생.
    this.host.GetCurrentUsageAll(this.seq_apt_ho, firstday, currentday).subscribe(
      data =>
      {
      this.level_compared1 = data.level_compared_elec;
      this.level_compared2 = data.level_compared_water;
      this.level_compared3 = data.level_compared_gas;
      this.level_compared4 = data.level_compared_heat;
      this.level_compared5 = data.level_compared_steam;
    }, 
    err =>
    {
      console.log(err);
      alert('네트워크 연결을 확인해주세요.');
    },
      () => console.log('Movie Search Complete')
    );
/*
   this.host.GetCurrentUsageElec(this.seq_apt_ho, firstday,currentday).subscribe(
     data => 
     { 
        this.level_compared1 = data.level_compared;
     },
     err=>
     {
        console.log(err);
        alert('네트워크 연결을 확인해주세요.');
        //this.loader.dismiss();
     },
     () => console.log('Movie Search Complete')
   );    
   this.host.GetCurrentUsageSteam(this.seq_apt_ho, firstday,currentday).subscribe(
    data => 
    { 
       this.level_compared2 = data.level_compared;
    },
    err=>
    {
       console.log(err);
       alert('네트워크 연결을 확인해주세요.');
       //this.loader.dismiss();
    },
    () => console.log('Movie Search Complete')
  );    
  this.host.GetCurrentUsageWater(this.seq_apt_ho, firstday,currentday).subscribe(
    data => 
    { 
       this.level_compared3 = data.level_compared;
    },
    err=>
    {
       console.log(err);
       alert('네트워크 연결을 확인해주세요.');
       //this.loader.dismiss();
    },
    () => console.log('Movie Search Complete')
  );    
  this.host.GetCurrentUsageGas(this.seq_apt_ho, firstday,currentday).subscribe(
    data => 
    { 
       this.level_compared4 = data.level_compared;
    },
    err=>
    {
       console.log(err);
       alert('네트워크 연결을 확인해주세요.');
       //this.loader.dismiss();
    },
    () => console.log('Movie Search Complete')
  );    
  this.host.GetCurrentUsageHeat(this.seq_apt_ho, firstday,currentday).subscribe(
    data => 
    { 
       this.level_compared5 = data.level_compared;
    },
    err=>
    {
       console.log(err);
       alert('네트워크 연결을 확인해주세요.');
       //this.loader.dismiss();
    },
    () => console.log('Movie Search Complete')
  );  */         
 }

  GetCurrentUsageAll_Request()
  {
    var now = new Date()

    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = sprintf("%02d", this.date.getDate());

    var firstday = sprintf("%s%02d01", this.currentYear, this.currentMonth);//해당달의 1일
    var currentday = sprintf("%s%02d%02d%02d%02d", this.currentYear, this.currentMonth, this.currentDate, now.getHours(), now.getMinutes());//오늘 날짜

    this.host.GetCurrentUsageAll(this.seq_apt_ho, firstday,currentday).subscribe(
      data =>
      {
        this.usage_curr_elec = data.usage_curr_elec.toFixed(2);
        this.won_curr_elec = Math.round(data.won_curr_elec).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.usage_expected_elec = data.usage_expected_elec.toFixed(2);
        this.won_expected_elec = Math.round(data.won_expected_elec).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.level_compared1 = data.level_compared_elec;

        this.usage_curr_water = data.usage_curr_water.toFixed(2);
        this.won_curr_water = Math.round(data.won_curr_water).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.usage_expected_water = data.usage_expected_water.toFixed(2);
        this.won_expected_water = Math.round(data.won_expected_water).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.level_compared2 = data.level_compared_water;

        this.usage_curr_gas = data.usage_curr_gas.toFixed(2);
        this.won_curr_gas = Math.round(data.won_curr_gas).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.usage_expected_gas = data.usage_expected_gas.toFixed(2);
        this.won_expected_gas = Math.round(data.won_expected_gas).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.level_compared3 = data.level_compared_gas;

        this.usage_curr_heat = data.usage_curr_heat.toFixed(2);
        this.won_curr_heat = Math.round(data.won_curr_heat).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.usage_expected_heat = data.usage_expected_heat.toFixed(2);
        this.won_expected_heat = Math.round(data.won_expected_heat).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.level_compared4 = data.level_compared_heat;

        this.usage_curr_steam = data.usage_curr_steam.toFixed(2);
        this.won_curr_steam = Math.round(data.won_curr_steam).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.usage_expected_steam = data.usage_expected_steam.toFixed(2);
        this.won_expected_steam = Math.round(data.won_expected_steam).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.level_compared5 = data.level_compared_steam;
      }, 
      err=>
      {
        console.log(err);
        alert('네트워크 연결을 확인해주세요.');

      },
      () => console.log('Movie Search Complete')
    );
  }



  //현재 전기
  GetCurrentUsageElec_Request()
  {
    var now = new Date()
    //var y = now.getFullYear();
  //  var m = now.getMonth()+1  
//    var d = now.getDate();

    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
  
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = sprintf("%02d",this.date.getDate());

    

    var firstday = sprintf("%s%02d01", this.currentYear,this.currentMonth );//해당달의 1일
    var currentday = sprintf("%s%02d%02d%02d%02d", this.currentYear ,this.currentMonth,this.currentDate,now.getHours(),now.getMinutes());//오늘날짜

    this.host.GetCurrentUsageElec(this.seq_apt_ho, firstday,currentday).subscribe(
      data => 
      { 
         this.usage_curr = data.usage_curr.toFixed(2);

         this.won_curr = Math.round(data.won_curr);
         this.usage_expected = data.usage_expected.toFixed(2);
         this.won_expected = Math.round(data.won_expected);
         this.level_compared1 = data.level_compared;
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

  //현재 수도
  GetCurrentUsageWater_Request()
  {
    var now = new Date()
    //var y = now.getFullYear();
  //  var m = now.getMonth()+1  
//    var d = now.getDate();

    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
  
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = sprintf("%02d",this.date.getDate());

    var firstday = sprintf("%s%02d01", this.currentYear,this.currentMonth );//해당달의 1일
    var currentday = sprintf("%s%02d%02d%02d%02d", this.currentYear ,this.currentMonth,this.currentDate,now.getHours(),now.getMinutes());//오늘날짜

    this.host.GetCurrentUsageWater(this.seq_apt_ho, firstday,currentday).subscribe(
      data => 
      { 
        this.usage_curr = data.usage_curr.toFixed(2);

         this.won_curr = Math.round(data.won_curr);
         this.usage_expected = data.usage_expected.toFixed(2);
         this.won_expected = Math.round(data.won_expected);
         this.level_compared2 = data.level_compared;
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


  //현재 가스
  GetCurrentUsageGas_Request()
  {
    var now = new Date()
    //var y = now.getFullYear();
  //  var m = now.getMonth()+1  
//    var d = now.getDate();

    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
  
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = sprintf("%02d",this.date.getDate());

    var firstday = sprintf("%s%02d01", this.currentYear,this.currentMonth );//해당달의 1일
    var currentday = sprintf("%s%02d%02d%02d%02d", this.currentYear ,this.currentMonth,this.currentDate,now.getHours(),now.getMinutes());//오늘날짜


    this.host.GetCurrentUsageGas(this.seq_apt_ho, firstday,currentday).subscribe(
      data => 
      { 
        this.usage_curr = data.usage_curr.toFixed(2);

         this.won_curr = Math.round(data.won_curr);
         this.usage_expected = data.usage_expected.toFixed(2);
         this.won_expected = Math.round(data.won_expected);
         this.level_compared3 = data.level_compared;
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


  //현재 난방
  GetCurrentUsageHeat_Request()
  {
    var now = new Date()
    //var y = now.getFullYear();
  //  var m = now.getMonth()+1  
//    var d = now.getDate();

    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
  
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = sprintf("%02d",this.date.getDate());

    var firstday = sprintf("%s%02d01", this.currentYear,this.currentMonth );//해당달의 1일
    var currentday = sprintf("%s%02d%02d%02d%02d", this.currentYear ,this.currentMonth,this.currentDate,now.getHours(),now.getMinutes());//오늘날짜


    this.host.GetCurrentUsageHeat(this.seq_apt_ho, firstday,currentday).subscribe(
      data => 
      { 
         this.usage_curr = data.usage_curr.toFixed(2);

         this.won_curr = Math.round(data.won_curr);
         this.usage_expected = data.usage_expected.toFixed(2);
         this.won_expected = Math.round(data.won_expected);
         this.level_compared4 = data.level_compared;
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

  //현재 온수
  GetCurrentUsageSteam_Request()
  {
    var now = new Date()
    //var y = now.getFullYear();
  //  var m = now.getMonth()+1  
//    var d = now.getDate();

    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
  
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = sprintf("%02d",this.date.getDate());

    var firstday = sprintf("%s%02d01", this.currentYear,this.currentMonth );//해당달의 1일
    var currentday = sprintf("%s%02d%02d%02d%02d", this.currentYear ,this.currentMonth,this.currentDate,now.getHours(),now.getMinutes());//오늘날짜


    this.host.GetCurrentUsageSteam(this.seq_apt_ho, firstday,currentday).subscribe(
      data => 
      { 
        this.usage_curr = data.usage_curr.toFixed(2);

         this.won_curr = Math.round(data.won_curr);
         this.usage_expected = data.usage_expected.toFixed(2);
         this.won_expected = Math.round(data.won_expected);
         this.level_compared5 = data.level_compared;
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
