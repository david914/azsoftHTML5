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

var myWin		= null;

$(document).ready(function(){
	
	getCalInfo();
	getPrcLabel();
	
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

