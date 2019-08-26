/**
 * 비밀번호변경 화면의 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-07-02
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var holidaypicker = new ax5.ui.picker();
var holidayGrid   = new ax5.ui.grid();
var applyData	  = null;

var holidayGridData = [];

var cboOptions 		= [];


var cboHoliData				= [];	// 휴일종류 콤보
var cboHoliDataDivData  	= [];	// 휴일구분 콤보

confirmDialog.setConfig({
    title: "휴일정보",
    theme: "info"
});


$('#txtHoliDate').val(getDate('DATE',0));
$('#txtYear').val(getDate('DATE',0));

holidayGrid.setConfig({
    target: $('[data-ax5grid="holidayGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            clickHoliGrid(this.dindex);
        },
        onDBLClick: function () {},
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_holiday1", label: "휴일",  width: '33%'},
        {key: "holigb_nm", label: "휴일구분", width: '33%'},
        {key: "holi_nm", label: "휴일종류",  	width: '33%'},
    ]
});

//조회년도
picker.bind({
    target: $('[data-picker-date="year"]'),
    content: {
        type: 'date',
        config: {
            mode: "year", selectMode: "year"
        },
        formatter: {
            pattern: 'date(year)'
        }
    },
	onStateChanged: function () {
		getHoliDayList($('#txtYear').val());
	}
});

picker.bind({
    target: $('[data-ax5picker="basic2"]'),
    direction: "bottom",
    content: {
        width: 270,
        margin: 10,
        type: 'date',
        config: {
            control: {
                left: '<i class="fa fa-chevron-left"></i>',
                yearTmpl: '%s',
                monthTmpl: '%s',
                right: '<i class="fa fa-chevron-right"></i>'
            },
            dateFormat: 'yyyy/MM/dd',
            lang: {
                yearTmpl: "%s년",
                months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                dayTmpl: "%s"
            },
            marker: (function () {
                var marker = {};
                marker[ax5.util.date(new Date(), {'return': 'yyyy/MM/dd', 'add': {d: 0}})] = true;

                return marker;
            })()
        },
        formatter: {
            pattern: 'date'
        }
    },
    btns: {
        today: {
            label: "Today", onClick: function () {
                var today = new Date();
                this.self
                        .setContentValue(this.item.id, 0, ax5.util.date(today, {"return": "yyyy/MM/dd"}))
                        .setContentValue(this.item.id, 1, ax5.util.date(today, {"return": "yyyy/MM/dd"}))
                        .close();
            }
        },
        thisMonth: {
            label: "This Month", onClick: function () {
                var today = new Date();
                this.self
                        .setContentValue(this.item.id, 0, ax5.util.date(today, {"return": "yyyy/MM/01"}))
                        .setContentValue(this.item.id, 1, ax5.util.date(today, {"return": "yyyy/MM"})
                                + '/'
                                + ax5.util.daysOfMonth(today.getFullYear(), today.getMonth()))
                        .close();
            }
        },
        ok: {label: "Close", theme: "default"}
    },
    onStateChanged: function () {
        if (this.state == "open") {
            var selectedValue = this.self.getContentValue(this.item["$target"]);
            if (!selectedValue) {
                this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'add': {d: 1}})]);
            }
        }
    }
});

$(document).ready(function() {
	getHoliDayList($('#txtYear').val());
    getCodeInfo();
    
    // 삭제 클릭
    $('#btnDel').bind('click', function() {
    	delHoliday();
    });
    // 등록 클릭
    $('#btnReg').bind('click', function() {
    	checkHoli();
    });
})

// 이미 휴일이 있는지 체크
function checkHoli() {
	var holiDate = replaceAllString($('#txtHoliDate').val().trim(),'/','');
	
	if(getSelectedIndex('cboHoli') < 1) {
		dialog.alert('휴일종류를 선택하여 주십시오.', function(){});
		return;
	}
	
	if(getSelectedIndex('cboHoliDiv') < 1) {
		dialog.alert('휴일구분을 선택하여 주십시오.', function(){});
		return;
	}
	
	if(holiDate.length !== 8) {
		dialog.alert('휴일 날짜를 정확히 선택해 주시기 바랍니다.', function(){});
		return;
	}
	var data = new Object();
	data = {
		nDate		: holiDate,
		requestType	: 'checkHoli'
	}
	ajaxAsync('/webPage/administrator/HolidayInfoServlet', data, 'json',successCheckHoli);
	
}
// 이미 휴일이 있는지 체크 완료
function successCheckHoli(data) {
	if(data > 0 ) {
		confirmDialog.confirm({
			msg: '이미 휴일로 지정되었습니다. 수정하시겠습니까?' ,
		}, function(){
			if(this.key === 'ok') {
				addHoli(1);
			}
		});
	} else {
		addHoli(0);
	}
}
// 휴일 등록
function addHoli(div) {
	var data = new Object();
	data = {
		nDate		: replaceAllString($('#txtHoliDate').val().trim(),'/',''),
		holigb		: getSelectedVal('cboHoliDiv').value,
		holi		: getSelectedVal('cboHoli').value,
		ntype		: div,
		requestType	: 'addHoli'
	}
	ajaxAsync('/webPage/administrator/HolidayInfoServlet', data, 'json',successAddHoli);
}

// 휴일 등록 완료
function successAddHoli(data) {
	dialog.alert(data, function(){
		getHoliDayList($('#txtYear').val());
	});
}

// 휴일 삭제
function delHoliday() {
	var selIn 	= holidayGrid.selectedDataIndexs;
	var selItem = null; 
	var delDate	= null;
	
	if(selIn.length === 0 ) {
		dialog.alert('삭제 할 휴일을 선택 후 눌러주세요.', function() {});
		return;
	}
	
	selItem = holidayGrid.list[selIn];
	delDate = replaceAllString(selItem.cm_holiday2,'-','');
	
	confirmDialog.confirm({
		msg: '[' + selItem.cm_holiday1 +']를 휴일에서 폐기하시겠습니까?' ,
	}, function(){
		if(this.key === 'ok') {
			var data = new Object();
			data = {
				nDate		: delDate,
				requestType	: 'delHoliday'
			}
			ajaxAsync('/webPage/administrator/HolidayInfoServlet', data, 'json',successDelHoliday);
		}
	});
}

// 휴일 삭제 완료
function successDelHoliday(data) {
	getHoliDayList($('#txtYear').val());
}

// 휴일 그리드 클릭
function clickHoliGrid(index) {
	var selItem = holidayGrid.list[index];
	var selDate	= replaceAllString(selItem.cm_holiday2,'-','/');
	$('#txtHoliDate').val(selDate);
	
	$('[data-ax5select="cboHoli"]').ax5select('setValue', selItem.cm_msgcd, true);
	$('[data-ax5select="cboHoliDiv"]').ax5select('setValue', selItem.cm_gubuncd, true);
}

// 휴일종류, 휴일구분 가져오기
function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('HOLIDAY','SEL','N'),
		new CodeInfo('HOLICD',	'SEL','N'),
		]);
	cboHoliData 	= codeInfos.HOLIDAY;
	cboHoliDivData  = codeInfos.HOLICD;
	
	$('[data-ax5select="cboHoli"]').ax5select({
        options: injectCboDataToArr(cboHoliData, 'cm_micode' , 'cm_codename')
	});
	
	$('[data-ax5select="cboHoliDiv"]').ax5select({
        options: injectCboDataToArr(cboHoliDivData, 'cm_micode' , 'cm_codename')
	});
};


// 휴일 리스트 가져오기
function getHoliDayList(year) {
	var holiday;
	var holiInfoData;
	holiday 		= new Object();
	holiday.year 	= year.length > 0 ? year : null;
	
	holidayData = new Object();
	holidayData = {
		holiday	: 	holiday,
		requestType	: 	'getHoliDayList'
	}
	
	ajaxAsync('/webPage/administrator/HolidayInfoServlet', holidayData, 'json', successGetholidayList);
}

// 휴일 리스트 가져오기 완료
function successGetholidayList(data) {
	holidayGridData = data;
	holidayGrid.setData(holidayGridData);
}