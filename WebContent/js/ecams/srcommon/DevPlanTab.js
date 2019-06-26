/**
 * 개발계획/실적등록 탭 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 방지연
 * 	버전 : 1.0
 *  수정일 : 2019-06-26
 */

var userName 	 	= window.parent.userName;
var userId 		 	= window.parent.userId;
var adminYN 		= window.parent.adminYN;
var userDeptName 	= window.parent.userDeptName;
var userDeptCd 	 	= window.parent.userDeptCd;
var strReqCD	 	= "42";

//public
var strStatus		= "2";			  //SR상태
var strIsrId		= "R201906-0003"; //R201901-0002

var txtExpStdatePicker	= new ax5.ui.picker(); //예상개발시작일
var txtExpEnddatePicker = new ax5.ui.picker(); //예상개발종료일
var txtDevDatePicker	= new ax5.ui.picker(); //예상개발종료일
var grdWorker 			= new ax5.ui.grid();   //담당자그리드
var grdWorkTime 		= new ax5.ui.grid();   //작업시간내역그리드

var selOptions 				= [];
var selectedIndex			= -1;	//select 선택 index
var gridSelectedIndex		= -1;   //그리드 선택 index
var selectedGridItem		= [];	//그리드 선택 item

var workDay					= "";   //월근무일수
var cboRateData 			= null;	//기능접수등급 데이터
var grdWorkerData 			= null; //담당자그리드 데이터
var grdWorkTimeData			= null; //작업시간내역그리드 데이터
var grdWorkTimeData_filter  = null; //작업시간내역그리드 필터링 데이터

ax5.info.weekNames = [
    {label: "일"},
    {label: "월"},
    {label: "화"},
    {label: "수"},
    {label: "목"},
    {label: "금"},
    {label: "토"}
];

var today = getDate('DATE',0);
today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);

$('#txtExpStdate').val(today);
$('#txtExpEnddate').val(today);
$('#txtDevDate').val(today);

grdWorker.setConfig({
    target: $('[data-ax5grid="grdWorker"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    multipleSelect: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 20,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            grdWorker_Click();
        },
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_username", label: "담당자",			width: '10%', 	align: "center"},
        {key: "cm_codename", label: "진행상태",	  	width: '37%',	align: "center"},
        {key: "devtime", 	 label: "예상소요시간",   	width: '14%',	align: "center"},
        {key: "devstday", 	 label: "예상개발시작일",  	width: '13%',	align: "center"},
        {key: "devedday", 	 label: "예상개발종료일",  	width: '13%',	align: "center"}
    ]
});

grdWorkTime.setConfig({
    target: $('[data-ax5grid="grdWorkTime"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 20,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	grdWorkTime_dbClick();
        },
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cc_workday",  label: "등록일",		width: '10%', 	align: "center"},
        {key: "cc_worktime", label: "시간",	  	width: '37%', 	align: "center"},
        {key: "cm_username", label: "담당자명",   	width: '14%', 	align: "center"}
    ]
});

txtExpEnddatePicker.bind({
    target: $('[data-ax5picker="txtExpEnddate"]'),
    direction: "top",
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
            }
        },
        formatter: {
            pattern: 'date'
        }
    },
    onStateChanged: function () {
        if (this.state == "open") {
            var selectedValue = this.self.getContentValue(this.item["$target"]);
            if (!selectedValue) {
                this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'add': {d: 1}})]);
            }
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
    }
});

txtExpEnddatePicker.bind({
    target: $('[data-ax5picker="txtExpEnddate"]'),
    direction: "top",
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
            }
        },
        formatter: {
            pattern: 'date'
        }
    },
    onStateChanged: function () {
        if (this.state == "open") {
            var selectedValue = this.self.getContentValue(this.item["$target"]);
            if (!selectedValue) {
                this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'add': {d: 1}})]);
            }
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
    }
});

txtExpStdatePicker.bind({
    target: $('[data-ax5picker="txtExpStdate"]'),
    direction: "top",
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
            }
        },
        formatter: {
            pattern: 'date'
        }
    },
    onStateChanged: function () {
        if (this.state == "open") {
            var selectedValue = this.self.getContentValue(this.item["$target"]);
            if (!selectedValue) {
                this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'add': {d: 1}})]);
            }
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
    }
});

txtDevDatePicker.bind({
    target: $('[data-ax5picker="txtDevDate"]'),
    direction: "top",
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
            }
        },
        formatter: {
            pattern: 'date'
        }
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


$(document).ready(function(){
	getWorkDays();
	getDevrRate();
	//initDevPlan();
	
	//예상개발시작일, 예살개방종료일, 작업일
	today = getDate('DATE',0);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	$('#txtExpStdate').val(today);
	$('#txtExpEnddate').val(today);
	$('#txtDevDate').val(today);
	
	//개발계획 클릭
	$('#rdoPlan').bind('click',function() {
		rdoPlan_click();
	});
	
	//개발식절 클릭
	$('#rdoResult').bind('click',function() {
		rdoPlan_click();
	});
	
	//개발계획 등록
	$('#btnRegPlan').bind('click',function() {
		btnRegPlan_Click();
	});
	
	//개발실적 등록
	$('#btnRegResult').bind('click',function() {
		btnRegResult_Click();
	});
	
	//작업시간내역그리드 전체보기 체크박스 이벤트
	$("#chkAll").change(function(){
		worktimeFiltering();
    });
	
	//테스트
	//$('#rdoPlan').prop("checked", true);
	//rdoPlan_click();
});

//연도별월근무일수조회 Cmc0200.getWorkDays(new Date().getFullYear());
function getWorkDays() {
	var tmpData;
	tmpData = new Object();
	tmpData = {
		requestType	: 'GETWORKDAYS',
		year		: new Date().getFullYear() 
	}
	ajaxAsync('/webPage/dev/DevPlanServlet', tmpData, 'json', successWorkdays);
}

function successWorkdays(data) {
	workDay = data;
	if(workDay == "No") {
		dialog.alert('월근무일수가 등록되지 않았습니다.',function(){});
		return;
	}
}

//기능접수등급 조회 Cmc0200.getRatecd();
function getDevrRate() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('DEVRATE','SEL','N')
	]);
	
	selOptions = codeInfos.DEVRATE;
	cboRateData = [];
	
	$.each(selOptions,function(key,value) {
		cboRateData.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboRate"]').ax5select({
        options: cboRateData
	});
	
	initDevPlan();
}

function screenInit(gbn) {
	if(gbn == 'M') {
		grdWorker.setData([]);
		grdWorkTime.setData([]);
		$('#rdoPlan').prop("checked", true);
		$('#rdoResult').prop("disabled", false);
		$('[data-ax5select="cboRate"]').ax5select('setValue','00',true);
		rdoPlan_click();
	}
	
	$('#txtWriteDay').val(''); 	//개발계획작성일
	$('#txtWriter').val(''); 	//개발계획작성인
	$('#txtExpTime').val(''); 	//예상소요시간
	$('#txtDevTime').val(''); 	//작업시간
	
	$('#btnRegPlan').prop("disabled", true);
	$('#btnRegResult').prop("disabled", true);
	$('#chkAll').prop("checked", false);
	$('[data-ax5select="cboRate"]').ax5select("enable");
}

function rdoPlan_click() {
	$('#btnRegPlan').prop("disabled", true);
	$('#btnRegResult').prop("disabled", true);
	
	gridSelectedIndex = grdWorker.selectedDataIndexs;
	selectedGridItem = grdWorker.list[grdWorker.selectedDataIndexs];
	
	if(grdWorkerData == null || gridSelectedIndex < 0 || selectedGridItem == null) {
		return;
	}
	
	if(selectedGridItem.cc_userid == userId) {
		if($('#rdoPlan').is(':checked') && (strStatus == '1' || strStatus == '2' || strStatus == '4' || strStatus == '5')) {
			$('#btnRegPlan').prop("disabled", false);
		}else if($('#rdoResult').is(':checked') && (strStatus == '2' || strStatus == '4' || strStatus == '5') && (selectedGridItem.devmm != null && selectedGridItem.devmm != "")) {
			$('#btnRegResult').prop("disabled", false);
			//grdWork.addEventListener(ListEvent.ITEM_DOUBLE_CLICK, grdWork_DUCLICK);
		}
	}//else {
	//	return;
	//}
	
	if($('#rdoPlan').is(':checked') && $('#btnRegPlan').is(':enabled')) {
		$('#txtExpTime').prop("readonly", false); 
		$('#txtExpStdate').prop("disabled", false);
		$('#txtExpEnddate').prop("disabled", false);
		$('#txtDevTime').prop("readonly", true);
		$('#txtDevDate').prop("disabled", true);
		$('[data-ax5select="cboRate"]').ax5select("enable");
	}else if($('#rdoResult').is(':checked') && $('#btnRegResult').is(':enabled')) {
		$('#txtExpTime').prop("readonly", true); 
		$('#txtExpStdate').prop("disabled", true);
		$('#txtExpEnddate').prop("disabled", true);
		$('#txtDevTime').prop("readonly", false);
		$('#txtDevDate').prop("disabled", false);
		$('[data-ax5select="cboRate"]').ax5select("disable");
	}
}

//devPlanCall
function initDevPlan() {
	//SR클릭되면 개발자 조회 Cmc0200.getSelectList(strIsrId,"",strReqCd);
	getWorker();
	
	//작업시간내역 조회 Cmc0200.get_Worktime(strIsrId);
	getWorktime();
}

function getWorker() {
	var SRInfo = new Object();
	SRInfo.srId = strIsrId;
	SRInfo.userId = null;
	SRInfo.reqCd = strReqCD;
	
	var SRInfoData;
	SRInfoData = new Object();
	SRInfoData = {
		SRInfo		: SRInfo,
		requestType	: 'GETWORKER'
	}
	ajaxAsync('/webPage/dev/DevPlanServlet', SRInfoData, 'json', successWorker);
}

function successWorker(data) {
	grdWorkerData = data;
	grdWorker.setData(grdWorkerData);
	
	if(grdWorkerData.length > 0) {
		var clickSw = false;
		
		for(var i=0; i<grdWorkerData.length; i++) {
        	if(grdWorkerData[i].cc_userid == userId) {
        		grdWorker.select(i);
        		clickSw = true;
        		break;
        	}
        }
		
		if(!clickSw) {
			grdWorker.select(0);
		}
		grdWorker_Click();
	}
}
	
function getWorktime() {
	var tmpData;
	tmpData = new Object();
	tmpData = {
		srId		: strIsrId,
		requestType	: 'GETWORKTIME'
	}
	ajaxAsync('/webPage/dev/DevPlanServlet', tmpData, 'json', successWorktime);
}

function successWorktime(data) {
	grdWorkTimeData = data;
	grdWorkTime.setData(grdWorkTimeData);
	
	worktimeFiltering();
}

//worktimeSetting
function worktimeFiltering() {
	if($('#chkAll').is(':checked')) {
		grdWorkTime.setData(grdWorkTimeData);
	}else {
		gridSelectedIndex = grdWorker.selectedDataIndexs;
		selectedGridItem = grdWorker.list[grdWorker.selectedDataIndexs];
		
		if(grdWorkerData == null || gridSelectedIndex < 0 || grdWorkTimeData == null) {
			return;
		}
		
		grdWorkTimeData_filter = grdWorkTimeData.filter(function(data) {
			if(grdWorker.selectedDataIndexs < 0) return false;
			if(data.cc_userid == selectedGridItem.cc_userid) return true;
			else return false;
		});
		grdWorkTime.setData(grdWorkTimeData_filter);
	}
}

function grdWorker_Click() {
	gridSelectedIndex = grdWorker.selectedDataIndexs;
	selectedGridItem = grdWorker.list[grdWorker.selectedDataIndexs];
	
	if(gridSelectedIndex < 0) {
		return;
	}
	
	$('#txtWriteDay').val(selectedGridItem.creatdt);
	$('#txtWriter').val(selectedGridItem.cm_username);
	$('#txtExpTime').val(selectedGridItem.devtime);
	
	if(cboRateData != null) {
		for(var i=0; i<cboRateData.length; i++) {
			if(cboRateData[i].value == selectedGridItem.cc_rate) {
				$('[data-ax5select="cboRate"]').ax5select('setValue',selectedGridItem.cc_rate,true);
				break;
			}
		}
	}
	 
	if(selectedGridItem.cc_devstday != null && selectedGridItem.cc_devstday != "") {
		$('#txtExpStdate').val(selectedGridItem.cc_devstday.substr(0,4) + "/" +
							selectedGridItem.cc_devstday.substr(4,2) + "/" +
							selectedGridItem.cc_devstday.substr(6,2));
	}
	
	if(selectedGridItem.cc_devedday != null && selectedGridItem.cc_devedday != "") {
		$('#txtExpEnddate').val(selectedGridItem.cc_devedday.substr(0,4) + "/" +
							selectedGridItem.cc_devedday.substr(4,2) + "/" +
							selectedGridItem.cc_devedday.substr(6,2));
	}
	
	if(selectedGridItem.cnt == 0) {
		if(selectedGridItem.devmm == null || selectedGridItem.devmm == "") {
			$('#rdoResult').prop("disabled", true);
		}else {
			$('#rdoResult').prop("disabled", false);
		}
		$('#rdoPlan').prop("checked", true);
	}else {
		$('#rdoResult').prop("disabled", false);
		$('#rdoPlan').prop("checked", false);
	}
	
	if(grdWorkerData.length > 0) {
		worktimeFiltering();
	}
	
	rdoPlan_click();
}

function grdWorkTime_dbClick() {
	gridSelectedIndex = grdWorkTime.selectedDataIndexs;
	
	if(gridSelectedIndex < 0) {
		return;
	}
	
	if ($('#btnRegResult').is(':enabled')){
		confirmDialog.confirm({
			msg: '작업시간을 삭제 하시겠습니까?',
		}, function(){
			if(this.key === 'ok') {
				
				selectedGridItem = grdWorkTime.list[gridSelectedIndex];
				
				var WorkResultInfo = new Object();
				WorkResultInfo.srid = strIsrId;
				WorkResultInfo.userid = selectedGridItem.cc_userid;
				WorkResultInfo.workday = replaceAllString(selectedGridItem.cc_workday, '/', '');
				
				var WorkResultInfoData;
				WorkResultInfoData = new Object();
				WorkResultInfoData = {
					WorkResultInfo 	 : WorkResultInfo,
					requestType	 	 : 'DELETEWORKRESULT'
				}
				ajaxAsync('/webPage/dev/DevPlanServlet', WorkResultInfoData, 'json', successDeleteWorkResult);
			}
		});
	}
}

function successDeleteWorkResult(data) {
	if(data == "0") {
		dialog.alert('작업시간이 삭제 되었습니다.',function(){
			screenInit("M");
			initDevPlan();
		});
	}else {
		dialog.alert('작업시간 삭제 중 오류가 발생하였습니다.',function(){});
	}
}

//개발계획등록
function btnRegPlan_Click() {
	if($('#txtExpTime').val().length == 0) {
		dialog.alert('예상소요시간을 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if($('#txtExpTime').val() == 0) {
		dialog.alert('예상소요시간을 숫자(1이상)로 입력해 주시기 바랍니다.',function(){});
		return;
	}
	
	selectedIndex = $("#cboRate option").index($("#cboRate option:selected"));
	if (selectedIndex < 1) {
		dialog.alert('기능점수등급을 선택해주시기 바랍니다.',function(){});
		return;
	} 

	if($('#txtExpStdate').val() > $('#txtExpEnddate').val()) {
		dialog.alert('개발시작일이 개발종료일이전입니다. 개발기간을 정확히 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	
	var PlanInfo = new Object();
	PlanInfo.devstday = replaceAllString($('#txtExpStdate').val(), '/', ''); 
	PlanInfo.devedday = replaceAllString($('#txtExpEnddate').val(), '/', '');
	PlanInfo.srid = strIsrId;
	PlanInfo.devmm = "0";
	PlanInfo.userid = userId;
	PlanInfo.devtime = $('#txtExpTime').val();
	PlanInfo.rate = $('[data-ax5select="cboRate"]').ax5select("getValue")[0].value;
	
	var PlanInfoData;
	PlanInfoData = new Object();
	PlanInfoData = {
		PlanInfo 	 : PlanInfo,
		requestType	 : 'SETDEVPLAN'
	}
	ajaxAsync('/webPage/dev/DevPlanServlet', PlanInfoData, 'json', successDevPlan);
}

function successDevPlan(data) {
	if(data == "0") {
		dialog.alert('개발계획등록이 정상적으로 처리되었습니다.',function(){
			initDevPlan();
			screenInit("M");
		});
		
	}else {
		dialog.alert('개발계획등록 중 오류가 발생하였습니다.',function(){});
	}
}

//개발실적등록
function btnRegResult_Click() {
	var NowDate = getDate('DATE',0);
	console.log("NodwDate: " + NowDate);
	
	if(replaceAllString($('#txtDevDate').val(), '/', '') > NowDate) {
		dialog.alert('작업일자가 현재일자 이후입니다. 정확히 선택하여 주시기 바랍니다.',function(){});
		$('#txtDevDate').focus();
		return;
	}
	
	if($('#txtDevTime').val().length == 0) {
		dialog.alert('작업시간을 입력하여 주십시오.',function(){});
		return;
	}
	
	if($('#txtDevTime').val() == 0) {
		dialog.alert('작업시간을 숫자(1이상)로 입력해 주시기 바랍니다.',function(){});
		return;
	}
	
	if($('#"txtExpStdate"').val() > $('#txtDevDate').val()) {
		dialog.alert('작업일은 예상개발시작일보다 커야 합니다.',function(){});
		return;
	}
	
	var WorkResultInfo = new Object();
	WorkResultInfo.srid = strIsrId;
	WorkResultInfo.userid = userId;
	WorkResultInfo.workday = replaceAllString($('#txtDevDate').val(), '/', '');
	WorkResultInfo.worktime = $('#txtDevTime').val();
	
	var WorkResultInfoData;
	WorkResultInfoData = new Object();
	WorkResultInfoData = {
		WorkResultInfo 	 : WorkResultInfo,
		requestType	 	 : 'SETWORKRESULT'
	}
	ajaxAsync('/webPage/dev/DevPlanServlet', WorkResultInfoData, 'json', successWorkResult);
}

function successWorkResult(data) {
	if(data == "0") {
		dialog.alert('개발실적등록이 정상적으로 처리되었습니다.',function(){
			screenInit("M");
			initDevPlan();
		});
	}else {
		dialog.alert('개발실적등록 중 오류가 발생하였습니다.',function(){});
	}
}