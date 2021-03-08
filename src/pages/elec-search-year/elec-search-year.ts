import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { DatePicker } from '@ionic-native/date-picker';
import { ServerComm } from "../../providers/server_comm";
import { ServiceAlert } from '../../providers/service_message';
import * as moment from 'moment';
import {sprintf} from "sprintf-js";
/**
 * Generated class for the ElecSearchYearPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-elec-search-year',
  templateUrl: 'elec-search-year.html',
})
export class ElecSearchYearPage {
  
  @ViewChild('horizontalcanvas') horizontalbar;  
  @ViewChild('horizontalcanvas2') horizontalbar2;  

  horizontalcanvas:any;
  horizontalcanvas2:any;

  public show_menu1:any=true;
  public show_menu2:any=false;
  public selectedSegment:any;

  chartData :any;
  viewtype:any;

  member_id:string="";
  seq_member:any;
  seq_apt_ho:any;

  date: any;  
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;

  usage_curr:any="";
  won_curr:any="";
  usage_prev:any="";
  won_prev:any="";
  total_usage_curr:any="";
  total_won_curr:any="";
  total_usage_prev:any="";
  total_won_prev:any="";

  prev_daebi_usage:number;//전년대비사용량
  prev_daebi_won:number;//전년대비 요금

  //public year_graph_list: Array<any>;  
  public this_year_list:any;//이번년도사용량
  public prev_year_list:any;//전년도사용량
  public won_curr_list:any;//이번년도요금
  public won_prev_list:any;//전년도요금
  public dangi_avg:any;//단지평균

  level_compare:any;//레벨색상
  
  constructor(public host:ServerComm,public msg:ServiceAlert,private datePicker: DatePicker,public navCtrl: NavController, public navParams: NavParams) {
    this.viewtype = navParams.get('viewtype');//에너지종류
    this.level_compare = navParams.get('level_compare');//에너지색


    this.date = new Date();
    this.monthNames = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = new Date().getDate();     
    
    var now = moment(this.date).format("YYYY");// date 객체를 YYYY년도로 받기
    this.currentYear = now;    
  }

  //시작시호출
  ionViewDidLoad() 
  {
    //월별 사용량을 기본으로 표시
      this.selectedSegment = "menu1"; 
      this.show_menu1 = true;
      this.show_menu2 = false;
      
      /*
      setTimeout( () => 
      {
        this.createHrzBarChart(); 
      }, 100);*/

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
 
             //회원정보얻기
             this.host.GetMemberInfo(myjson.seq_member).subscribe(
               data => 
               {
                 this.seq_apt_ho = data.member_info.seq_apt_ho;

                // this.GetUsageListYearlyRequest(this.viewtype,0);
                this.updateGraphData();//서버에서 그래프데이터 받아옴
                 
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

  ionViewDidEnter()
  {
  }

  //스크롤 날짜 선택시
  updateMyDate() 
  {
    this.date.setYear(this.currentYear);//설정된 년도로 다시 변경

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = new Date().getDate();     
    
    var now = moment(this.date).format("YYYY");// date 객체를 YYYY년도로 받기
    this.currentYear = now;  

   // this.updateGraphData();
  }

 //현재탭에 있는 기준으로 데이터를 받아온다.
  updateGraphData()
  {

    if(this.selectedSegment=="menu1")
    {
      setTimeout( () => {
       // this.createHrzBarChart(); 
       this.GetUsageListYearlyRequest(this.viewtype,0);
    }, 100);
    }

    if(this.selectedSegment=="menu2")
    {
      setTimeout( () => {
        //this.createHrzBarChart2();      
        this.GetUsageListYearlyRequest(this.viewtype,1);
    }, 100);
    }          
  }


  //전년도
  goToLastyear()
  {
    this.date = new Date(this.date.getFullYear()-1, this.date.getMonth(), this.date.getDate());
    //  this.getDaysOfMonth();
  
      this.currentMonth = this.monthNames[this.date.getMonth()];
      this.currentYear = this.date.getFullYear();//this.date.setDate(this.currentDate.getDate()-1);
      this.currentDate = this.date.getDate();      

      //var now = moment();
      //this.currentYear = moment(now.format(), moment.ISO_8601).format();
      var now = moment(this.date).format("YYYY");// date 객체를 YYYY년도로 받기
      this.currentYear = now;
      
      this.updateGraphData();
  }

  //다음년도
  goToNextyear()
  {
        this.date = new Date(this.date.getFullYear()+1, this.date.getMonth(), this.date.getDate());
    //this.getDaysOfMonth();

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = this.date.getDate();      

    
    var now = moment(this.date).format("YYYY");// date 객체를 YYYY년도로 받기
    this.currentYear = now;

    this.updateGraphData();       
  //this.currentYear = moment(now.format(), moment.ISO_8601).format();
  //this.currentYear = moment().add(1, 'y'); 
  //moment(now.format(), moment.ISO_8601).format();    
    /*
    sole.log(moment(d.getTime()).add("-1", "y").format("YYYY/MM/DD")); //1년 전
    console.log(moment(d.getTime()).add("1", "M").format("YYYY/MM/DD")); //1개월 후
    console.log(moment(d.getTime()).add("2", "d").format("YYYY/MM/DD")); //2일 후
    console.log(moment(d.getTime()).add("-3", "h").format("HH시 mm분 ss초")); //3시간 전
    console.log(moment(d.getTime()).add("4", "m").format("HH시 mm분 ss초")); //4분 후
    console.log(moment(d.getTime()).add("-5", "s").format("HH시 mm분 ss초")); //5초 전
      
    a = moment(d);
    var b = a.clone().add('-1', 'M');
    console.log(a.format("YYYY.MM.DD"));
    console.log(b.format("YYYY.MM.DD"));
    console.log(a.diff(b, 'days')); //일 단위로 날짜 차이 계산
    console.log(a.diff(b, 'weeks')); //주 단위로 날짜 차이 계산
    console.log(a.diff(b, 'months')); //월 단위로 날짜 차이 계산
    console.log(a.diff(b, 'years', true)); //연 단위로 날짜 차이 계산

    */
    
  }

  yearselect()
  {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      titleText:'날짜조회',
    
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      }).then(
      date =>{
        this.currentYear = date.getFullYear();
        this.currentMonth = date.getMonth()+1  
        this.currentDate = date.getDate();
       // this.searchdate = sprintf("%s-%02d-%02d", y,m,d);
        alert('선택');
        
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }


  //년간 전기
  //searchtype==0 사용량
  //searchtype==1 요금
  GetUsageListYearlyRequest(viewtype,searchtype)
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

    //각타입별로 연간 데이타값 서버에서 호출
    switch(viewtype)
    {
      case 0://전기
      {
          this.host.GetUsageListYearlyElec(this.seq_apt_ho, this.currentYear).subscribe(
          graph => 
          { 
            this.this_year_list=[];
            this.prev_year_list=[];

            this.won_curr_list=[];
            this.won_prev_list=[];
            
            this.dangi_avg=[];

            this.total_usage_curr = Math.round(graph.total_usage_curr);
            this.total_won_curr = Math.round(graph.total_won_curr);
            this.total_usage_prev = Math.round(graph.total_usage_prev);
            this.total_won_prev = Math.round(graph.total_won_prev);

            //전년대비사용량
            //this.prev_daebi_usage = 100.0 * (this.total_usage_curr – this.total_usage_prev)/this.total_usage_curr;
            this.prev_daebi_usage = this.total_usage_curr - this.total_usage_prev;
            //전년대비 요금
            this.prev_daebi_won = this.total_won_curr - this.total_won_prev;
            //this.prev_daebi_won = 100.0 * (this.total_won_curr – this.total_won_prev)/this.total_won_curr;

            for(let data of graph.list_usage) //현재 갯수만큼 추가..
            {               
              //서버에서 값받기
              this.usage_curr = Math.round(data.usage_curr);
              this.won_curr = Math.round(data.won_curr);
              this.usage_prev = Math.round(data.usage_prev);
              this.won_prev = Math.round(data.won_prev);
              
              this.won_curr_list.push(this.won_curr);//사용요금
              this.won_prev_list.push(this.won_prev);//전년요금

              this.this_year_list.push(this.usage_curr);//사용량
              this.prev_year_list.push(this.usage_prev);//전년동월사용량
              this.dangi_avg.push(this.usage_prev);
            }
            //this.year_graph_list = graph.list_usage;
            if(searchtype==0) this.createHrzBarChart();//사용량
            if(searchtype==1) this.createHrzBarChart2();//요금
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
      break;
      case 1://수도
      {
          this.host.GetUsageListYearlyWater(this.seq_apt_ho, this.currentYear).subscribe(
          graph => 
          { 
            this.this_year_list=[];
            this.prev_year_list=[];

            this.won_curr_list=[];
            this.won_prev_list=[];
            
            this.dangi_avg=[];

            this.total_usage_curr = Math.round(graph.total_usage_curr);
            this.total_won_curr = Math.round(graph.total_won_curr);
            this.total_usage_prev = Math.round(graph.total_usage_prev);
            this.total_won_prev = Math.round(graph.total_won_prev);

            //전년대비사용량
            //this.prev_daebi_usage = 100.0 * (this.total_usage_curr – this.total_usage_prev)/this.total_usage_curr;
            this.prev_daebi_usage = this.total_usage_curr - this.total_usage_prev;
            //전년대비 요금
            this.prev_daebi_won = this.total_won_curr - this.total_won_prev;
            //this.prev_daebi_won = 100.0 * (this.total_won_curr – this.total_won_prev)/this.total_won_curr;

            for(let data of graph.list_usage) //현재 갯수만큼 추가..
            {               
              //서버에서 값받기
              this.usage_curr = Math.round(data.usage_curr);
              this.won_curr = Math.round(data.won_curr);
              this.usage_prev = Math.round(data.usage_prev);
              this.won_prev = Math.round(data.won_prev);
              
              this.won_curr_list.push(this.won_curr);//사용요금
              this.won_prev_list.push(this.won_prev);//전년요금

              this.this_year_list.push(this.usage_curr);//사용량
              this.prev_year_list.push(this.usage_prev);//전년동월사용량
              this.dangi_avg.push(this.usage_prev);
            }
            //this.year_graph_list = graph.list_usage;
            if(searchtype==0) this.createHrzBarChart();//사용량
            if(searchtype==1) this.createHrzBarChart2();//요금
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
      break;
      case 2://가스
      {
          this.host.GetUsageListYearlyGas(this.seq_apt_ho, this.currentYear).subscribe(
          graph => 
          { 
            this.this_year_list=[];
            this.prev_year_list=[];

            this.won_curr_list=[];
            this.won_prev_list=[];
            
            this.dangi_avg=[];

            this.total_usage_curr = Math.round(graph.total_usage_curr);
            this.total_won_curr = Math.round(graph.total_won_curr);
            this.total_usage_prev = Math.round(graph.total_usage_prev);
            this.total_won_prev = Math.round(graph.total_won_prev);

            //전년대비사용량
            //this.prev_daebi_usage = 100.0 * (this.total_usage_curr – this.total_usage_prev)/this.total_usage_curr;
            this.prev_daebi_usage = this.total_usage_curr - this.total_usage_prev;
            //전년대비 요금
            this.prev_daebi_won = this.total_won_curr - this.total_won_prev;
            //this.prev_daebi_won = 100.0 * (this.total_won_curr – this.total_won_prev)/this.total_won_curr;

            for(let data of graph.list_usage) //현재 갯수만큼 추가..
            {               
              //서버에서 값받기
              this.usage_curr = Math.round(data.usage_curr);
              this.won_curr = Math.round(data.won_curr);
              this.usage_prev = Math.round(data.usage_prev);
              this.won_prev = Math.round(data.won_prev);
              
              this.won_curr_list.push(this.won_curr);//사용요금
              this.won_prev_list.push(this.won_prev);//전년요금

              this.this_year_list.push(this.usage_curr);//사용량
              this.prev_year_list.push(this.usage_prev);//전년동월사용량
              this.dangi_avg.push(this.usage_prev);
            }
            //this.year_graph_list = graph.list_usage;
            if(searchtype==0) this.createHrzBarChart();//사용량
            if(searchtype==1) this.createHrzBarChart2();//요금
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
      break;
      case 3://난방
      {
          this.host.GetUsageListYearlyHeat(this.seq_apt_ho, this.currentYear).subscribe(
          graph => 
          { 
            this.this_year_list=[];
            this.prev_year_list=[];

            this.won_curr_list=[];
            this.won_prev_list=[];
            
            this.dangi_avg=[];

            this.total_usage_curr = Math.round(graph.total_usage_curr);
            this.total_won_curr = Math.round(graph.total_won_curr);
            this.total_usage_prev = Math.round(graph.total_usage_prev);
            this.total_won_prev = Math.round(graph.total_won_prev);

            //전년대비사용량
            //this.prev_daebi_usage = 100.0 * (this.total_usage_curr – this.total_usage_prev)/this.total_usage_curr;
            this.prev_daebi_usage = this.total_usage_curr - this.total_usage_prev;
            //전년대비 요금
            this.prev_daebi_won = this.total_won_curr - this.total_won_prev;
            //this.prev_daebi_won = 100.0 * (this.total_won_curr – this.total_won_prev)/this.total_won_curr;

            for(let data of graph.list_usage) //현재 갯수만큼 추가..
            {               
              //서버에서 값받기
              this.usage_curr = Math.round(data.usage_curr);
              this.won_curr = Math.round(data.won_curr);
              this.usage_prev = Math.round(data.usage_prev);
              this.won_prev = Math.round(data.won_prev);
              
              this.won_curr_list.push(this.won_curr);//사용요금
              this.won_prev_list.push(this.won_prev);//전년요금

              this.this_year_list.push(this.usage_curr);//사용량
              this.prev_year_list.push(this.usage_prev);//전년동월사용량
              this.dangi_avg.push(this.usage_prev);
            }
            //this.year_graph_list = graph.list_usage;
            if(searchtype==0) this.createHrzBarChart();//사용량
            if(searchtype==1) this.createHrzBarChart2();//요금
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
      break;
      case 4://온수
      {
          this.host.GetUsageListYearlySteam(this.seq_apt_ho, this.currentYear).subscribe(
          graph => 
          { 
            this.this_year_list=[];
            this.prev_year_list=[];

            this.won_curr_list=[];
            this.won_prev_list=[];
            
            this.dangi_avg=[];

            this.total_usage_curr = Math.round(graph.total_usage_curr);
            this.total_won_curr = Math.round(graph.total_won_curr);
            this.total_usage_prev = Math.round(graph.total_usage_prev);
            this.total_won_prev = Math.round(graph.total_won_prev);

            //전년대비사용량
            //this.prev_daebi_usage = 100.0 * (this.total_usage_curr – this.total_usage_prev)/this.total_usage_curr;
            this.prev_daebi_usage = this.total_usage_curr - this.total_usage_prev;
            //전년대비 요금
            this.prev_daebi_won = this.total_won_curr - this.total_won_prev;
            //this.prev_daebi_won = 100.0 * (this.total_won_curr – this.total_won_prev)/this.total_won_curr;

            for(let data of graph.list_usage) //현재 갯수만큼 추가..
            {               
              //서버에서 값받기
              this.usage_curr = Math.round(data.usage_curr);
              this.won_curr = Math.round(data.won_curr);
              this.usage_prev = Math.round(data.usage_prev);
              this.won_prev = Math.round(data.won_prev);
              
              this.won_curr_list.push(this.won_curr);//사용요금
              this.won_prev_list.push(this.won_prev);//전년요금

              this.this_year_list.push(this.usage_curr);//사용량
              this.prev_year_list.push(this.usage_prev);//전년동월사용량
              this.dangi_avg.push(this.usage_prev);
            }
            //this.year_graph_list = graph.list_usage;
            if(searchtype==0) this.createHrzBarChart();//사용량
            if(searchtype==1) this.createHrzBarChart2();//요금
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
      break;                        
    }
  }

  createHrzBarChart() {


     if(this.horizontalcanvas) this.horizontalcanvas.destroy();

    this.horizontalcanvas = new Chart(this.horizontalbar.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월','9월', '10월', '11월', '12월'],
        datasets: [{
          label: 'Online viewers in millions',
          data: this.this_year_list,
          backgroundColor: '#16da94', // array should have same number of elements as number of dataset
          borderColor: '#16da94',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'Offline viewers in millions',
          data: this.prev_year_list,//[1.5, 2.8, 4, 4.9, 3.9, 4.5, 7, 12,1.1, 2.3, 5, 1.9],
          backgroundColor: '#b4b4b6', // array should have same number of elements as number of dataset
          borderColor: '#b4b4b6',// array should have same number of elements as number of dataset
          borderWidth: 1
        }/*,
        {
          label: 'Offline viewers in millions',
          data: this.dangi_avg,//[1.1, 2.3, 5, 1.9, 9, 6.5, 1, 15,1.1, 2.3, 5, 1.9],
          backgroundColor: '#006ebb', // array should have same number of elements as number of dataset
          borderColor: '#006ebb',// array should have same number of elements as number of dataset
          borderWidth: 1
        }*/
      ]
      },
  
      options: {
        animation:{
          onComplete : function(){
  
            var chartInstance = this.chart,
            ctx = chartInstance.ctx;
  
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
  
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index];                            
                  ctx.fillText(data, bar._model.x+10, bar._model.y +8);
              });
          });
             // alert('test');
          }
      },    
        /*
        tooltips: {
          enabled: true
        },*/
        /*
        scales: {
          xAxes: [{
              stacked: true
          }],
          yAxes: [{
            ticks: {
              beginAtZero:true
            },
            stacked: true,
          }],
        },*/
        legend: {
          display: false
        },
        tooltips: { enabled: false },
        responsive: true,      
        maintainAspectRatio: false,
        /*
        legends:{
          display:false
        },   */   
        scales: {
          xAxes: [{
              gridLines: {
                display: true
              },
              ticks: {
                display: true
                /*,//축의 값 표시 여부
                  max: 1,
                  min: 0*/
              }
            }],
          yAxes: [{
            gridLines: {
              display:false//,
             //   drawBorder: false//축과 데이터의 경계선 표시 여부
              },
              ticks: {
                display: true
                /*,//축의 값 표시 여부
                  max: 1,
                  min: 0*/
              }
            }]
        },      
        plugins: {
          datalabels: {
                  align: 'end',
                  anchor: 'end',
                  color: '#f00',
                  font: {
                      weight: 'bold',
                      size: 14,
                  },
                  formatter: function(value, context) {
                      return value + '%1';
                  },
          },
      },/*Plugins ende*/      
        layout: {
          
            padding: {
                left: 10,
                right: 0,
                top: 20,
                bottom: 0
            }
        }
    }
     });
  }  


  updateCharts(data) {
    /*
    this.chartData = data;
    let chartData = this.getReportValues();
   
    // Update our dataset
    this.horizontalcanvas.data.datasets.forEach((dataset) => {
      dataset.data = chartData
    });
    this.horizontalcanvas.update();
    */
  }

  createHrzBarChart2() {

    if(this.horizontalcanvas2) this.horizontalcanvas2.destroy();    
 
    this.horizontalcanvas2 = new Chart(this.horizontalbar2.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월','9월', '10월', '11월', '12월'],
        datasets: [{
          label: 'Online viewers in millions',
          data: this.won_curr_list,//[2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17,1.1, 2.3, 5, 1.9],
          backgroundColor: '#16da94', // array should have same number of elements as number of dataset
          borderColor: '#16da94',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'Offline viewers in millions',
          data: this.won_prev_list,//[1.5, 2.8, 4, 4.9, 3.9, 4.5, 7, 12,1.1, 2.3, 5, 1.9],
          backgroundColor: '#b4b4b6', // array should have same number of elements as number of dataset
          borderColor: '#b4b4b6',// array should have same number of elements as number of dataset
          borderWidth: 1
        }/*,
        {
          label: 'Offline viewers in millions',
          data: this.dangi_avg,//[1.1, 2.3, 5, 1.9, 9, 6.5, 1, 15,1.1, 2.3, 5, 1.9],
          backgroundColor: '#006ebb', // array should have same number of elements as number of dataset
          borderColor: '#006ebb',// array should have same number of elements as number of dataset
          borderWidth: 1
        }*/
      ]
      },
  
      options: {
        animation:{
          onComplete : function(){
  
            var chartInstance = this.chart,
            ctx = chartInstance.ctx;
  
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
  
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index];                            
                  ctx.fillText(data, bar._model.x+10, bar._model.y +8);
              });
          });
             // alert('test');
          }
      },    
        /*
        tooltips: {
          enabled: true
        },*/
        /*
        scales: {
          xAxes: [{
              stacked: true
          }],
          yAxes: [{
            ticks: {
              beginAtZero:true
            },
            stacked: true,
          }],
        },*/
        legend: {
          display: false
        },
        tooltips: { enabled: false },
        responsive: true,      
        maintainAspectRatio: false,
        /*
        legends:{
          display:false
        },   */   
        scales: {
          xAxes: [{
              gridLines: {
                display: true
              },
              ticks: {
                display: true
                /*,//축의 값 표시 여부
                  max: 1,
                  min: 0*/
              }
            }],
          yAxes: [{
            gridLines: {
              display:false//,
             //   drawBorder: false//축과 데이터의 경계선 표시 여부
              },
              ticks: {
                display: true
                /*,//축의 값 표시 여부
                  max: 1,
                  min: 0*/
              }
            }]
        },      
        plugins: {
          datalabels: {
                  align: 'end',
                  anchor: 'end',
                  color: '#f00',
                  font: {
                      weight: 'bold',
                      size: 14,
                  },
                  formatter: function(value, context) {
                      return value + '%1';
                  },
          },
      },/*Plugins ende*/      
        layout: {
          
            padding: {
                left: 10,
                right: 0,
                top: 20,
                bottom: 0
            }
        }
    }
     });
  }    


  //탭클릭시 이벤트
  onSegmentChanged(segmentButton: any) 
  {

    if(segmentButton.value=="menu1")
    {
      this.selectedSegment = "menu1"; 
      this.show_menu1 = true;
      this.show_menu2 = false;
      
      setTimeout( () => {
       // this.createHrzBarChart(); 
       this.GetUsageListYearlyRequest(this.viewtype,0);
    }, 100);
    }

    if(segmentButton.value=="menu2")
    {
      this.selectedSegment = "menu2"; 
      this.show_menu1 = false;
      this.show_menu2 = true;
      setTimeout( () => {
        //this.createHrzBarChart2();      
        this.GetUsageListYearlyRequest(this.viewtype,1);
    }, 100);
      
    }

    //this.loadLocalData();
  }  

}

/*
st moment = require("moment");
var d = new Date();
var second = 1000 * 60;
var fmt1 = 'YYYY.MM.DD HH:mm:ss';
var fmt2 = 'YY.MM.DD hh:mm:ss a';
var now = moment(d).format(fmt1); //Date 객체를 파라미터로 넣기
console.log(now);
console.log(moment(d.getTime() + second).format(fmt1)); //밀리초를 파라미터로 넣기
console.log(moment(now.replace(/[.:]/g, '')).format(fmt2)); //문자열로된 날짜를 파라미터로 넣기
console.log('-------------------------------');
console.log(moment(d.getTime()).add("-1", "y").format("YYYY/MM/DD")); //1년 전
console.log(moment(d.getTime()).add("1", "M").format("YYYY/MM/DD")); //1개월 후

 
console.log(moment(d.getTime()).add("2", "d").format("YYYY/MM/DD")); //2일 후
console.log(moment(d.getTime()).add("-3", "h").format("HH시 mm분 ss초")); //3시간 전
console.log(moment(d.getTime()).add("4", "m").format("HH시 mm분 ss초")); //4분 후
console.log(moment(d.getTime()).add("-5", "s").format("HH시 mm분 ss초")); //5초 전
console.log('-------------------------------');
var a = moment(d);
var b = a.clone().add('-1', 'M');
console.log(a.format("YYYY.MM.DD"));
console.log(b.format("YYYY.MM.DD"));
console.log(a.diff(b, 'days')); //일 단위로 날짜 차이 계산
console.log(a.diff(b, 'weeks')); //주 단위로 날짜 차이 계산
console.log(a.diff(b, 'months')); //월 단위로 날짜 차이 계산
console.log(a.diff(b, 'years', true)); //연 단위로 날짜 차이 계산
*/