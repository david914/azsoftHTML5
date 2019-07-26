/**
 * eCAMS MAIN 화면 정의
 * 
 * <pre>
 * 
 * 	작성자: 이용문
 * 	버전 : 1.1
 *  수정일 : 2019-07-16
 * 
 */


var userName 	= window.top.userName;
var userId 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;

var calendar 	= null;
var calendarEl 	= null;
var calMonthArr	= [];
var calMonthArrHoli = [];
var calHoliArr		= [];

var srListData	= [];
var timeLineArr = ['SR등록','SR접수','체크아웃/프로그램등록','체크인','개발배포','테스트배포','운영배포요청','운영배포','SR완료'];

var myWin		= null;

$(document).ready(function(){
	$('#lblPieTitle').text(userName + '님의 최근 한달간 운영 신청 프로그램 종류');
	getCalInfo();
	getPrcLabel();
	getSrList();

	$('body').on('click', 'button.fc-prev-button', function() {
		getAddCalInfo();
		//getHoliday();
	});

	$('body').on('click', 'button.fc-next-button', function() {
		getAddCalInfo();
		//getHoliday();
	});
	
	$('body').on('click', 'button.fc-dayGridMonth-button', function() {
		//getHoliday();
	});
});

// 파이차트 데이터 가져오기
function getPieData() {
	var data = {
			requestType	: 	'getMainPie',
			data : {				
				userId		: 	userId
			}
		}
	ajaxAsync('/webPage/main/eCAMSMainServlet', data, 'json',successGetPieData);
}

// 파이차트 데이터 가져오기 완료
function successGetPieData(data) {
	
	if(data.length === 0 ){
		data = makeFakeData('PIE');
	}
	
	var calHeight = parseInt($('#divCal').height());
	var width = $('#pieDiv').width();
	var pieChartHeight = calHeight - 45;
		
	if($('#pieAppliKinds').length > 0) $('#pieAppliKinds').empty();
	
	var container = document.getElementById('pieAppliKinds');
	var data = {
	    categories: ['신청종류'],
	    series: data
	};
	
	var options = {
	    chart: {
	        width: 	 width - 10,
	        height:  pieChartHeight,
	    },
	    series: {
	        labelAlign: 'center',
	        radiusRange: ['70%', '100%']
	    },
	    legend: {
	        visible: true,
	        
	    }
	};
	
	pieChart = tui.chart.pieChart(container, data, options);	
	getPieprogressSw = false;
}

// 파이 데이터 없을시
function  makeFakeData(chartKin) {
	var chartData = null;
	if(chartKin === 'PIE') chartData = [{name: '데이터가 없습니다.', data: 1}];
	return chartData;
}

// SR리스트 가져오기
function getSrList() {
	var data = new Object();
	data = {
		userId		: 	userId,
		requestType	: 	'getSrList'
	}
	ajaxAsync('/webPage/main/eCAMSMainServlet', data, 'json',successGetSrList);
}

// SR리스트 가져오기 완료
function successGetSrList(data) {
	console.log(data);
	
	srListData = data;
	var liStr = null;
	var width = 0;
	var colIn = -1;
	var title = '';
	var colorArr = ['org','green','blue'];
	
	$('#divSrlist').empty();
	srListData.forEach(function(item, index){
		title = item.reqTitle.length > 12 ? item.reqTitle.substr(0,12)+'...' : item.reqTitle;
		colIn++;
		if(colIn >= colorArr.length) {
			colIn = 0;
		}
		width = makeSrWidth(item.step);
		liStr = '';
		liStr += '<dl class="srdl" flow="down" tooltip="'+item.reqTitle+'['+item.srId+']">';
		liStr += '	<dt>'+title+'</dt>';
		liStr += '	<dd id="'+item.srId+'" style="cursor: pointer;"><span class="'+colorArr[colIn]+' width-'+width+'">'+width+'%'+'('+ item.stepLabel +')</span></dd>';
		liStr += '</dl>';
		$('#divSrList').append(liStr);
	});
	
	makeTimeLine(srListData[0].srId);
	
	$("dd[id^='R']").bind('click', function(event) {
		makeTimeLine($(this).attr('id'));
	});
}

// 타임라인 만들기
function makeTimeLine(srId) {
	var item = null;
	for(var i=0; i<srListData.length; i++) {
		if(srId === srListData[i].srId) {
			item = srListData[i];
			break;
		}
	}
	
	var liStr = null;
	$('#divTimeLine').empty();
	liStr = '<h4>SR 요청제목 ['+item.reqTitle+']</h4>';
	for(var i = 0; i<Number(item.step); i++) {
		var detail = makeTimeLineDetail( (i+1) , item) ;
		liStr += '<div class="item">';
		liStr += '	<i class="fas fa-clock"></i>';
		liStr += '	<div class="item_info">';
		liStr += '		<p>'+timeLineArr[i]+'</p>';
		liStr += '		<small>'+detail+'</small>';
		liStr += '	</div>';
		liStr += '</div>';
	}
	$('#divTimeLine').append(liStr);
}

// 타임 라인 신청건/ SR 등록 접수 등의 일시 표시
function makeTimeLineDetail(stepIndex, item) {
	var rtDetail = '';
	var key		= 'step' + stepIndex;
	
	if(item[key] === undefined) {
		return '';
	}
	
	switch (stepIndex) {
		case 1:
			rtDetail = 'SR등록 일시 ['+ item[key] +']';
			break;
		case 2:
			rtDetail = '개발자 접수 일시 ['+ item[key] +']';
			break;
		case 3:
			rtDetail = '체크아웃 신청 일시 ['+ item[key] +']';
			break;
		case 4:
			rtDetail = '체크인 신청 일시 ['+ item[key] +']';
			break;
		case 5:
			rtDetail = '개발배포 신청  일시 ['+ item[key] +']';
			break;
		case 6:
			rtDetail = '테스트배포 신청 일시 ['+ item[key] +']';
			break;
		case 7:
			rtDetail = '운영배포 신청 일시 ['+ item[key] +']';
			break;
		case 8:
			rtDetail = '운영배포 완료 일시 ['+ item[key] +']';
			break;
		case 9:
			rtDetail = 'SR완료 일시 ['+ item[key] +']';
			break;
	}
	
	return rtDetail;
}

// SR리스트의 퍼센테이지 만들어주기
function makeSrWidth(step) {
	var width = 0;
	
	if(step === '9') {
		width = 100;
	} else {
		width = Number(step) * 10;
	}
	return width;
}

// 미결/SR/오류 라벨 건수 가져오기
function getPrcLabel() {
	var data = new Object();
	data = {
		userId		: 	userId,
		requestType	: 	'getPrcLabel'
	}
	ajaxAsync('/webPage/main/eCAMSMainServlet', data, 'json',successGetPrcLabel);
}

// 미결/SR/오류 라벨 건수 가져오기 완료
function successGetPrcLabel(data) {
	$('#lblApproval').html('['+data.approvalCnt+']');
	$('#lblSr').html('['+data.srCnt+']');
	$('#lblErr').html('['+data.errCnt+']');
}


//처음 캘린더 인포 가져오기
function getCalInfo() {
	var data = new Object();
	data = {
		userId		: 	userId,
		month		: 	getDate('DATE',0).substr(0,6),
		requestType	: 	'getCalendarInfo'
	}
	
	ajaxAsync('/webPage/main/eCAMSMainServlet', data, 'json',successGetCalInfo);
}

//처음 캘린더 인포 가져오기 완료
function successGetCalInfo(data) {
	if(!checkCalInfo(getDate('DATE',0).substr(0,6)) ) {
		return;
	}
	var defaultDate = getDate('DATE',0).substr(0,4) + '-' + getDate('DATE',0).substr(4,2) + '-' + getDate('DATE',0).substr(6,2);
	
	calendarEl= document.getElementById('calendar');
	calendar =  new FullCalendar.Calendar(calendarEl, {
	    plugins: [ 'interaction', 'dayGrid', 'timeGrid', 'list', 'rrule' ],
	    defaultDate: defaultDate,
	    editable: false,
	    eventLimit: 1,
	    height: 450,
	    header: {
	        left: 'prev,next today',
	        center: 'title',
	        right: 'dayGridMonth,listMonth'
	    },
	    locale: 'ko', 
	    events:  data,
	    eventClick: function(arg) {
	    	if( arg.event._def.extendedProps.cr_acptno !== undefined ) {
	    		openApprovalInfo(arg.event._def.extendedProps.cr_acptno, arg.event._def.extendedProps.cr_qrycd);
	    	}
	    }
	});
	calendar.render();
	
	getPieData();
}

//캘린더 인포 추가
function getAddCalInfo() {
	if(!checkCalInfo(getCalFullDate()) ) {
		return;
	}
	var data = new Object();
	data = {
		userId		: 	userId,
		month		: 	getCalFullDate(),
		requestType	: 	'getCalendarInfo'
	}
	
	ajaxAsync('/webPage/main/eCAMSMainServlet', data, 'json',successGetAddCalInfo);
}

// 캘린더 인포 추가 가져오기 완료
function successGetAddCalInfo(data) {
	calendar.addEventSource(data);
}

// 이미 추가되어있는 캘린더 정보 인지 확인 후 추가 가능 또는 불가 판단 리턴
function checkCalInfo(month) {
	if(calMonthArr.includes(month)) {
		return false;
	} else {
		calMonthArr.push(month);
		return true;
	}
}


// 이미 추가되어있는 캘린더 휴일인지 확인
function checkCalInfoHoli(month) {
	if(calMonthArrHoli.includes(month)) {
		return false;
	} else {
		calMonthArrHoli.push(month);
		return true;
	}
}
// 달력 휴일정보 가져오기
function getHoliday() {
	if(!checkCalInfoHoli(getCalFullDate()) ) {
		addHoliCss();
		return;
	}
	
	var data = new Object();
	data = {
		month		: 	getCalFullDate(),
		requestType	: 	'getHoliday'
	}
	ajaxAsync('/webPage/main/eCAMSMainServlet', data, 'json',successGetHoliday);
}

function addHoliCss() {
	calHoliArr.forEach(function(item,index) {
		$('[data-date="' + item.start + '"]').addClass('holiday');
	});
}

// 달력 휴일정보 가져오기 완료
function successGetHoliday(data) {
	calendar.addEventSource(data);
	data.forEach(function(item, index) {
		if(!calHoliArr.includes(item))  {
			calHoliArr.push(item);
		}
		
		if(item.holiday !== undefined && item.holiday === 'Y') {
			$('[data-date="' + item.start + '"]').addClass('holiday');
		}
	});
}



// 캘린더 현재 월 구해오기 YYYYMM 까지
function getCalFullDate() {
	var calMon 		= '';
	var calYear 	= '';
	var fullDate 	= '';
	calYear = calendar.getDate().getFullYear();
	calMon = calendar.getDate().getMonth();
	calMon += 1;
	calMon = (calMon < 10 ? '0' : '') + calMon; 
	fullDate = calYear + calMon;
	
	return fullDate; 
}

//결재 정보 창 띄우기
function openApprovalInfo(acptNo, reqCd) {
	var nHeight, nWidth, cURL, winName;
	
	if ( reqCd == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}
	
    winName = reqCd;
    
	var form = document.popPam;   		//폼 name
    
	form.acptno.value	= acptNo;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.user.value 	= userId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	
	nHeight = screen.height - 300;
    nWidth  = screen.width - 400;
    cURL = "/webPage/winpop/PopRequestDetail.jsp";
    
	myWin = winOpen(form, winName, cURL, nHeight, nWidth);
}

