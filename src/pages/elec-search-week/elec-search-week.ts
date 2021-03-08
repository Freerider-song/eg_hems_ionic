import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
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
  selector: 'page-elec-search-week',
  templateUrl: 'elec-search-week.html',
})
export class ElecSearchWeekPage 
{
  @ViewChild('lineCanvas') linebar;  
  @ViewChild('lineCanvas2') linebar2;  

  lineCanvas:any;
  lineCanvas2:any;

  chartData :any;
  viewtype:any;

  date: any;  
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;  
  yearmonth:any;

  
  member_id:string="";
  seq_member:any;
  seq_apt_ho:any;

  
  usage_curr:any="";
  won_curr:any="";
  usage_prev:any="";
  won_prev:any="";
  total_usage_curr:any="";
  total_won_curr:any="";
  total_usage_prev:any="";
  total_won_prev:any="";

  //public year_graph_list: Array<any>;  
  public this_year_list:any;//이번년도사용량
  public prev_year_list:any;//전년도사용량
  public won_curr_list:any;//이번년도요금
  public won_prev_list:any;//전년도요금
  public dangi_avg:any;//단지평균
 
  lastday:any;//마지막일수
  level_compare:any;//레벨색상
  constructor(public host:ServerComm,public msg:ServiceAlert,public navCtrl: NavController, public navParams: NavParams) 
  {
    this.viewtype = navParams.get('viewtype');//에너지종류
    this.level_compare = navParams.get('level_compare');//에너지색
    this.date = new Date();
    this.monthNames = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = new Date().getDate();   
    
    var now = moment(this.date).format("YYYY-MM");// date 객체를 YYYY년도로 받기
    this.yearmonth = now;        
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
 
             //회원정보얻기
             this.host.GetMemberInfo(myjson.seq_member).subscribe(
               data => 
               {
                 this.seq_apt_ho = data.member_info.seq_apt_ho;

                 this.GetUsageListWeeklyRequest(this.viewtype);
                 
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



 
 //주간weekly
  GetUsageListWeeklyRequest(viewtype)
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
          this.host.GetUsageListWeeklyElec(this.seq_apt_ho, this.currentYear,this.currentMonth).subscribe(
          graph => 
          { 
            this.this_year_list=[];
            this.prev_year_list=[];

            this.won_curr_list=[];
            this.won_prev_list=[];
            
            this.dangi_avg=[];

            this.total_usage_curr = graph.total_usage_curr.toFixed(2);
            this.total_won_curr = Math.round(graph.total_won_curr);
            this.total_usage_prev = graph.total_usage_prev.toFixed(2);
            this.total_won_prev = Math.round(graph.total_won_prev);


            for(let data of graph.list_usage) //현재 갯수만큼 추가..
            {               
              //서버에서 값받기
              this.usage_curr = data.usage_curr.toFixed(2);
              this.won_curr = Math.round(data.won_curr);
              this.usage_prev = data.usage_prev.toFixed(2);
              this.won_prev = Math.round(data.won_prev);
              
              this.won_curr_list.push(this.won_curr);//사용요금
              this.won_prev_list.push(this.won_prev);//전년요금

              this.this_year_list.push(this.usage_curr);//사용량
              this.prev_year_list.push(this.usage_prev);//전년동월사용량
              this.dangi_avg.push(this.usage_prev);
            }
            //this.year_graph_list = graph.list_usage;
            this.lineChartMethod();
            this.lineChartMethod2();
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
          this.host.GetUsageListWeeklyWater(this.seq_apt_ho, this.currentYear,this.currentMonth).subscribe(
          graph => 
          { 
            this.this_year_list=[];
            this.prev_year_list=[];

            this.won_curr_list=[];
            this.won_prev_list=[];
            
            this.dangi_avg=[];

            this.total_usage_curr = graph.total_usage_curr.toFixed(2);
            this.total_won_curr = Math.round(graph.total_won_curr);
            this.total_usage_prev = graph.total_usage_prev.toFixed(2);
            this.total_won_prev = Math.round(graph.total_won_prev);


            for(let data of graph.list_usage) //현재 갯수만큼 추가..
            {               
              //서버에서 값받기
              this.usage_curr = data.usage_curr.toFixed(2);
              this.won_curr = Math.round(data.won_curr);
              this.usage_prev = data.usage_prev.toFixed(2);
              this.won_prev = Math.round(data.won_prev);
              
              this.won_curr_list.push(this.won_curr);//사용요금
              this.won_prev_list.push(this.won_prev);//전년요금

              this.this_year_list.push(this.usage_curr);//사용량
              this.prev_year_list.push(this.usage_prev);//전년동월사용량
              this.dangi_avg.push(this.usage_prev);
            }
            this.lineChartMethod();
            this.lineChartMethod2();
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
          this.host.GetUsageListWeeklyGas(this.seq_apt_ho, this.currentYear,this.currentMonth).subscribe(
          graph => 
          { 
            this.this_year_list=[];
            this.prev_year_list=[];

            this.won_curr_list=[];
            this.won_prev_list=[];
            
            this.dangi_avg=[];

            this.total_usage_curr = graph.total_usage_curr.toFixed(2);
            this.total_won_curr = Math.round(graph.total_won_curr);
            this.total_usage_prev = graph.total_usage_prev.toFixed(2);
            this.total_won_prev = Math.round(graph.total_won_prev);


            for(let data of graph.list_usage) //현재 갯수만큼 추가..
            {               
              //서버에서 값받기
              this.usage_curr = data.usage_curr.toFixed(2);
              this.won_curr = Math.round(data.won_curr);
              this.usage_prev = data.usage_prev.toFixed(2);
              this.won_prev = Math.round(data.won_prev);
              
              this.won_curr_list.push(this.won_curr);//사용요금
              this.won_prev_list.push(this.won_prev);//전년요금

              this.this_year_list.push(this.usage_curr);//사용량
              this.prev_year_list.push(this.usage_prev);//전년동월사용량
              this.dangi_avg.push(this.usage_prev);
            }
            this.lineChartMethod();
            this.lineChartMethod2();
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
          this.host.GetUsageListWeeklyHeat(this.seq_apt_ho, this.currentYear,this.currentMonth).subscribe(
          graph => 
          { 
            this.this_year_list=[];
            this.prev_year_list=[];

            this.won_curr_list=[];
            this.won_prev_list=[];
            
            this.dangi_avg=[];

            this.total_usage_curr = graph.total_usage_curr.toFixed(2);
            this.total_won_curr = Math.round(graph.total_won_curr);
            this.total_usage_prev = graph.total_usage_prev.toFixed(2);
            this.total_won_prev = Math.round(graph.total_won_prev);


            for(let data of graph.list_usage) //현재 갯수만큼 추가..
            {               
              //서버에서 값받기
              this.usage_curr = data.usage_curr.toFixed(2);
              this.won_curr = Math.round(data.won_curr);
              this.usage_prev = data.usage_prev.toFixed(2);
              this.won_prev = Math.round(data.won_prev);
              
              this.won_curr_list.push(this.won_curr);//사용요금
              this.won_prev_list.push(this.won_prev);//전년요금

              this.this_year_list.push(this.usage_curr);//사용량
              this.prev_year_list.push(this.usage_prev);//전년동월사용량
              this.dangi_avg.push(this.usage_prev);
            }
            this.lineChartMethod();
            this.lineChartMethod2();
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
          this.host.GetUsageListWeeklySteam(this.seq_apt_ho, this.currentYear,this.currentMonth).subscribe(
          graph => 
          { 
            this.this_year_list=[];
            this.prev_year_list=[];

            this.won_curr_list=[];
            this.won_prev_list=[];
            
            this.dangi_avg=[];

            this.total_usage_curr = graph.total_usage_curr.toFixed(2);
            this.total_won_curr = Math.round(graph.total_won_curr);
            this.total_usage_prev = graph.total_usage_prev.toFixed(2);
            this.total_won_prev = Math.round(graph.total_won_prev);


            for(let data of graph.list_usage) //현재 갯수만큼 추가..
            {               
              //서버에서 값받기
              this.usage_curr = data.usage_curr.toFixed(2);
              this.won_curr = Math.round(data.won_curr);
              this.usage_prev = data.usage_prev.toFixed(2);
              this.won_prev = Math.round(data.won_prev);
              
              this.won_curr_list.push(this.won_curr);//사용요금
              this.won_prev_list.push(this.won_prev);//전년요금

              this.this_year_list.push(this.usage_curr);//사용량
              this.prev_year_list.push(this.usage_prev);//전년동월사용량
              this.dangi_avg.push(this.usage_prev);
            }
            this.lineChartMethod();
            this.lineChartMethod2();
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

  updateMyDate()
  {
    var str = this.yearmonth;
    str = str.split("-");

    this.date.setFullYear(str[0]);
    //this.date.setMonth(str[1]);

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = new Date().getDate();
    
    var now = moment(this.date).format("YYYY-MM");// date 객체를 YYYY년도로 받기
    this.yearmonth = now;

    var count = this.fn_DayOfMonth(this.currentYear, this.currentMonth );
    this.lastday = count;//현재 마지막일수 구함
  

    this.GetUsageListWeeklyRequest(this.viewtype);    
  }

  goToLastMonth()
  {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()-1, this.date.getDate());
    //  this.getDaysOfMonth();
  
      this.currentMonth = this.monthNames[this.date.getMonth()];
      this.currentYear = this.date.getFullYear();
      this.currentDate = this.date.getDate();    
      

      var now = moment(this.date).format("YYYY-MM");// date 객체를 YYYY년도로 받기
      this.yearmonth = now;  

      var count = this.fn_DayOfMonth(this.currentYear, this.currentMonth );
      this.lastday = count;//현재 마지막일수 구함
    
      
      this.GetUsageListWeeklyRequest(this.viewtype);      
  }

  goToNextMonth()
  {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+1, this.date.getDate());
    //this.getDaysOfMonth();

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = this.date.getDate();    
    

    var now = moment(this.date).format("YYYY-MM");// date 객체를 YYYY년도로 받기
    this.yearmonth = now;      
    
    var count = this.fn_DayOfMonth(this.currentYear, this.currentMonth );
    this.lastday = count;//현재 마지막일수 구함

    
    this.GetUsageListWeeklyRequest(this.viewtype);    
  }

  
//해당 월의 일수 구하기
 fn_DayOfMonth(year, month)
 {
   /*
   32 - new Date(year, month, 32).getDate()
 위 코드를 쓰면 윤년도 계산 가능!
   */
     //month 는 0 부터 시작해서..
     return 32 - new Date(year, month-1, 32).getDate();
 }
 

  lineChartMethod() {
    var count = this.fn_DayOfMonth(this.currentYear, this.currentMonth );
    this.lastday = count;//현재 마지막일수 구함
  
    if(this.lineCanvas) this.lineCanvas.destroy();

    this.lineCanvas = new Chart(this.linebar.nativeElement, {
      type: 'line',
        data: {
        labels: [ '일', '월', '화', '수', '목', '금', '토'],
        datasets: [
          {
            label: '요일별 평균 사용량 (kWh)',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(255,255,255,0.4)',
            borderColor: 'rgba(200,110,110,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderWidth: 2, //선굵기
            borderDashOffset: 0.0,
            hoverBackgroundColor:'#f00',
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 6,
            pointHitRadius: 10,
            //datasetFill : true,//Boolean - 차트에서 선만 노출 여부 설정
            //scaleShowGridLines : false,//Boolean - 차트 눈금 표시 여부 설정
            data: this.this_year_list ,
            spanGaps: false,
          }
        ]
      },
      options: {
        animation:{
          onComplete : function(){
  //애니메이션이 끝나면 라벨표시
            var chartInstance = this.chart,
            ctx = chartInstance.ctx;
  
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
  
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index];      
                  ctx.fillStyle = "#000";    
                  //ctx.font = "bold";                                    
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
                  
              });
          });
             // alert('test');
          }
      },        
      tooltips: { enabled: false },
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
        responsive: true,      
        
        scales: {
          xAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                display: true
                //,//축의 값 표시 여부
                  //max: 1,
                  //min: 0
              }
            }],
          yAxes: [{
            gridLines: {
                drawBorder: false//축과 데이터의 경계선 표시 여부
              },
              ticks: {
                display: true
                //,//축의 값 표시 여부
                  //max: 1,
                  //min: 0
              }
            }]
        },
  /*
        scales: {
          xAxes: [{
            categoryPercentage:1.0,
            barPercentage: 0.2,
            barThickness: 10,
            maxBarThickness: 10,
            minBarLength: 5,
            gridLines: {
                drawOnChartArea: true,
                offsetGridLines: true
            }
        }],
            yAxes: [{
              gridLines: {
                offsetGridLines: false
              },
                ticks: {
                    beginAtZero:true,
                    max:30
                }
            }]
        },*/
  
        legend: {
          display: false
        },
        
        
        showValue:{
          fontStyle: 'Helvetica', //Default Arial
          fontSize: 20
  },
  
  plugins: {
    datalabels: {
            align: 'start',
            anchor: 'start',
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
        /*
        legends:{
          display:false
        },   */   
        layout: {
          
            padding: {
                left: 10,
                right: 0,
                top: 20,
                bottom: 0
            }
        }
     },
     plugins: {
      datalabels: {
              align: 'end',
              anchor: 'end',
              color: '#000',
              font: {
                  weight: 'bold',
                  size: 14,
              },
              formatter: function(value, context) {
                  return value + '%';
              },
      },
  },/*Plugins ende*/   
     /*
     plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: Math.round,
        font: {
          weight: 'bold'
        }
      }
    }*/
    });
  }


  lineChartMethod2() {

    var count = this.fn_DayOfMonth(this.currentYear, this.currentMonth );
    this.lastday = count;//현재 마지막일수 구함
    if(this.lineCanvas2) this.lineCanvas2.destroy();
    
    this.lineCanvas2 = new Chart(this.linebar2.nativeElement, {
      type: 'line',
        data: {
        labels: ['일', '월', '화', '수', '목', '금', '토'],
        datasets: [
          {
            label: '요일별 평균 사용량 (kWh)',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(255,255,255,0.4)',
            borderColor: 'rgba(200,110,110,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderWidth: 2, //선굵기
            borderDashOffset: 0.0,
            hoverBackgroundColor:'#f00',
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 6,
            pointHitRadius: 10,
            //datasetFill : true,//Boolean - 차트에서 선만 노출 여부 설정
            //scaleShowGridLines : false,//Boolean - 차트 눈금 표시 여부 설정
            data: this.won_curr_list,//[65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
          }
        ]
      },
      options: {
        animation:{
          onComplete : function(){
  //애니메이션이 끝나면 라벨표시
            var chartInstance = this.chart,
            ctx = chartInstance.ctx;
  
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
  
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index];                            
                  ctx.fillStyle = "#000";
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
                  
              });
          });
             // alert('test');
          }
      },        
      tooltips: { enabled: false },
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
        responsive: true,      
        
        scales: {
          xAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                display: true
                //,//축의 값 표시 여부
                  //max: 1,
                  //min: 0
              }
            }],
          yAxes: [{
            gridLines: {
                drawBorder: false//축과 데이터의 경계선 표시 여부
              },
              ticks: {
                display: true
                //,//축의 값 표시 여부
                  //max: 1,
                  //min: 0
              }
            }]
        },
  /*
        scales: {
          xAxes: [{
            categoryPercentage:1.0,
            barPercentage: 0.2,
            barThickness: 10,
            maxBarThickness: 10,
            minBarLength: 5,
            gridLines: {
                drawOnChartArea: true,
                offsetGridLines: true
            }
        }],
            yAxes: [{
              gridLines: {
                offsetGridLines: false
              },
                ticks: {
                    beginAtZero:true,
                    max:30
                }
            }]
        },*/
  
        legend: {
          display: false
        },
        
        
        showValue:{
          fontStyle: 'Helvetica', //Default Arial
          fontSize: 20
  },
  
  plugins: {
    datalabels: {
            align: 'start',
            anchor: 'start',
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
        /*
        legends:{
          display:false
        },   */   
        layout: {
          
            padding: {
                left: 10,
                right: 0,
                top: 20,
                bottom: 0
            }
        }
     },
     plugins: {
      datalabels: {
              align: 'end',
              anchor: 'end',
              color: '#000',
              font: {
                  weight: 'bold',
                  size: 14,
              },
              formatter: function(value, context) {
                  return value + '%';
              },
      },
  },/*Plugins ende*/   
     /*
     plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: Math.round,
        font: {
          weight: 'bold'
        }
      }
    }*/
    });
  }





}
