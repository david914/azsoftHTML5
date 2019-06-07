var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;
var strReqCD	 	= "42";

//public
var strStatus		= "4";			  //SR상태
var strIsrId		= "R201906-0002"; //R201901-0002

var ExpStdatePicker	= new ax5.ui.picker(); //예상개발시작일
var ExpEnddatePicker= new ax5.ui.picker(); //예상개발종료일
var DevDatePicker	= new ax5.ui.picker(); //예상개발종료일
var workerGrid 		= new ax5.ui.grid();   //담당자그리드
var worktimeGrid 	= new ax5.ui.grid();   //작업시간내역그리드

var selOptions 		= [];
var selectedIndex;		//select 선택 index
var gridSelectedIndex;  //그리드 선택 index
var selectedGridItem;	//그리드 선택 item

var workDay					= "";   //월근무일수
var selRateData 			= null;	//기능접수등급 데이터
var workerGridData 			= null; //담당자그리드 데이터
var worktimeGridData		= null; //작업시간내역그리드 데이터
var worktimeGridData_filter = null; //작업시간내역그리드 필터링 데이터

var date = new Date(); 
var year = date.getFullYear(); 
var month = new String(date.getMonth()+1); 
var day = new String(date.getDate()); 

if(month.length == 1){ 
  month = "0" + month; 
} 

if(day.length == 1){ 
  day = "0" + day; 
} 

workerGrid.setConfig({
    target: $('[data-ax5grid="workerGrid"]'),
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
            workerGrid_Click();
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

worktimeGrid.setConfig({
    target: $('[data-ax5grid="worktimeGrid"]'),
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
        	worktimeGrid_dbClick();
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

ExpStdatePicker.bind({
    target: $('[data-ax5picker="ExpStdate"]'),
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

ExpEnddatePicker.bind({
    target: $('[data-ax5picker="ExpEnddate"]'),
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

ExpStdatePicker.bind({
    target: $('[data-ax5picker="ExpStdate"]'),
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

DevDatePicker.bind({
    target: $('[data-ax5picker="DevDate"]'),
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
	//연도별월근무일수조회 Cmc0200.getWorkDays(new Date().getFullYear());
	var tmpData;
	tmpData = new Object();
	tmpData = {
		requestType	: 'GETWORKDAYS',
		year		: new Date().getFullYear() 
	}
	ajaxAsync('/webPage/dev/DevPlanServlet', tmpData, 'json', successWorkdays);
	
	//기능접수등급 조회 Cmc0200.getRatecd();
	tmpData = new Object();
	tmpData = {
		requestType	: 'GETDEVRATE' 
	}
	ajaxAsync('/webPage/dev/DevPlanServlet', tmpData, 'json', successDevrate);
	
	initDevPlan();
	
	//예상개발시작일, 예살개방종료일, 작업일
	$('#ExpStdate').val(year + "/" + month + "/" + day);
	$('#ExpEnddate').val(year + "/" + month + "/" + day);
	$('#DevDate').val(year + "/" + month + "/" + day);
	
	$('#radioPlan').bind('click',function() {
		radioPlan_click();
	});
	
	$('#radioResult').bind('click',function() {
		radioPlan_click();
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
	$('#radioPlan').prop("checked", true);
	radioPlan_click();
});

function screenInit(gbn) {
	if(gbn == 'M') {
		workerGrid.setData([]);
		worktimeGrid.setData([]);
		$('#radioPlan').prop("checked", true);
		$('#radioResult').prop("checked", false);
		$('#radioResult').prop("disabled", false);
		$('[data-ax5select="selRate"]').ax5select('setValue','00',true);
		radioPlan_click();
	}
	
	$('#txtWriteDay').val(""); 	//개발계획작성일
	$('#txtWriter').val(""); 	//개발계획작성인
	$('#txtExpTime').val(""); 	//예상소요시간
	$('#txtDevTime').val(""); 	//작업시간
	
	$('#btnRegPlan').prop("disabled", true);
	$('#btnRegResult').prop("disabled", true);
	$('#chkAll').prop("checked", false);
	$('[data-ax5select="selRate"]').ax5select("enable");
}

function radioPlan_click() {
	$('#btnRegPlan').prop("disabled", true);
	$('#btnRegResult').prop("disabled", true);
	
	gridSelectedIndex = workerGrid.selectedDataIndexs;
	selectedGridItem = workerGrid.list[workerGrid.selectedDataIndexs];
	
	if(workerGridData == null || gridSelectedIndex < 0) {
		return;
	}
	
	if(selectedGridItem.cc_userid == userId) {
		if($('#radioPlan').is(':checked') && (strStatus == '1' || strStatus == '2' || strStatus == '4' || strStatus == '5')) {
			$('#btnRegPlan').prop("disabled", false);
		}else if($('#radioResult').is(':checked') && (strStatus == '2' || strStatus == '4' || strStatus == '5') && (selectedGridItem.devmm != null && selectedGridItem.devmm != "")) {
			$('#btnRegResult').prop("disabled", false);
			//grdWork.addEventListener(ListEvent.ITEM_DOUBLE_CLICK, grdWork_DUCLICK);
		}
	}//else {
	//	return;
	//}
	
	if($('#radioPlan').is(':checked') && $('#btnRegPlan').is(':enabled')) {
		$('#txtExpTime').prop("readonly", false); 
		$('#ExpStdate').prop("disabled", false);
		$('#ExpEnddate').prop("disabled", false);
		$('[data-ax5select="selRate"]').ax5select("enable");
		$('#txtDevTime').prop("readonly", true);
		$('#DevDate').prop("disabled", true);
	}else if($('#radioResult').is(':checked') && $('#btnRegResult').is(':enabled')) {
		$('#txtExpTime').prop("readonly", true); 
		$('#ExpStdate').prop("disabled", true);
		$('#ExpEnddate').prop("disabled", true);
		$('[data-ax5select="selRate"]').ax5select("disable");
		$('#txtDevTime').prop("readonly", false);
		$('#DevDate').prop("disabled", false);
	}
}

//devPlanCall
function initDevPlan() {
	//SR클릭되면 개발자 조회 Cmc0200.getSelectList(strIsrId,"",strReqCd);
	getWorker();
	
	//작업시간내역 조회 Cmc0200.get_Worktime(strIsrId);
	getWorktime();
}

function successWorkdays(data) {
	workDay = data;
	if(workDay == "No") {
		dialog.alert('월근무일수가 등록되지 않았습니다.',function(){});
		return;
	}
}

function successDevrate(data) {
	selOptions = data;
	selRateData = [];
	
	$.each(selOptions,function(key,value) {
		selRateData.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="selRate"]').ax5select({
        options: selRateData
	});
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
	workerGridData = data;
	workerGrid.setData(workerGridData);
	
	if(workerGridData.length > 0) {
		var clickSw = false;
		
		for(var i=0; i<workerGridData.length; i++) {
        	if(workerGridData[i].cc_userid == userId) {
        		workerGrid.select(i);
        		clickSw = true;
        		break;
        	}
        }
		
		if(!clickSw) {
			workerGrid.select(0);
		}
		workerGrid_Click();
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
	worktimeGridData = data;
	worktimeGrid.setData(worktimeGridData);
	
	worktimeFiltering();
}

//worktimeSetting
function worktimeFiltering() {
	if($('#chkAll').is(':checked')) {
		worktimeGrid.setData(worktimeGridData);
	}else {
		gridSelectedIndex = workerGrid.selectedDataIndexs;
		selectedGridItem = workerGrid.list[workerGrid.selectedDataIndexs];
		
		if(workerGridData == null || gridSelectedIndex < 0) {
			return;
		}
		
		worktimeGridData_filter = worktimeGridData.filter(function(data) {
			if(workerGrid.selectedDataIndexs < 0) return false;
			if(data.cc_userid == selectedGridItem.cc_userid) return true;
			else return false;
		});
		worktimeGrid.setData(worktimeGridData_filter);
	}
}

function workerGrid_Click() {
	gridSelectedIndex = workerGrid.selectedDataIndexs;
	selectedGridItem = workerGrid.list[workerGrid.selectedDataIndexs];
	
	if(gridSelectedIndex < 0) {
		return;
	}
	
	//$('#개발계획작성일').val(selectedGridItem.creatdt);
	//$('#개발계획작성인').val(selectedGridItem.cm_username);
	$('#txtExpTime').val(selectedGridItem.devtime);
	
	for(var i=0; i<selRateData.length; i++) {
		if(selRateData[i].value == selectedGridItem.cc_rate) {
			$('[data-ax5select="selRate"]').ax5select('setValue',selectedGridItem.cc_rate,true);
			break;
		}
	}
	
	if(selectedGridItem.cc_devstday != null && selectedGridItem.cc_devstday != "") {
		$('#ExpStdate').val(selectedGridItem.cc_devstday.substr(0,4) + "/" +
							selectedGridItem.cc_devstday.substr(4,2) + "/" +
							selectedGridItem.cc_devstday.substr(6,2));
	}
	
	if(selectedGridItem.cc_devedday != null && selectedGridItem.cc_devedday != "") {
		$('#ExpEnddate').val(selectedGridItem.cc_devedday.substr(0,4) + "/" +
							selectedGridItem.cc_devedday.substr(4,2) + "/" +
							selectedGridItem.cc_devedday.substr(6,2));
	}
	
	if(selectedGridItem.cnt == 0) {
		if(selectedGridItem.devmm == null || selectedGridItem.devmm == "") {
			$('#radioResult').prop("disabled", true);
		}else {
			$('#radioResult').prop("disabled", false);
		}
		$('#radioPlan').prop("checked", true);
		$('#radioResult').prop("checked", false);
	}else {
		$('#radioResult').prop("disabled", false);
		$('#radioPlan').prop("checked", false);
		$('#radioResult').prop("checked", true);
	}
	
	if(workerGridData.length > 0) {
		worktimeFiltering();
	}
	
	radioPlan_click();
}

function worktimeGrid_dbClick() {
	gridSelectedIndex = worktimeGrid.selectedDataIndexs;
	
	if(gridSelectedIndex < 0) {
		return;
	}
	
	if ($('#btnRegResult').is(':enabled')){
		confirmDialog.confirm({
			msg: '작업시간을 삭제 하시겠습니까?',
		}, function(){
			if(this.key === 'ok') {
				
				selectedGridItem = worktimeGrid.list[gridSelectedIndex];
				
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
		dialog.alert('작업시간이 삭제 되었습니다.',function(){});
		screenInit("M");
		initDevPlan();
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
	
	selectedIndex = $("#selRate option").index($("#selRate option:selected"));
	if (selectedIndex < 1) {
		dialog.alert('기능점수등급을 선택해주시기 바랍니다.',function(){});
		return;
	} 

	if($('#ExpStdate').val() > $('#ExpEnddate').val()) {
		dialog.alert('개발시작일이 개발종료일이전입니다. 개발기간을 정확히 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	
	var PlanInfo = new Object();
	PlanInfo.devstday = replaceAllString($('#ExpStdate').val(), '/', ''); 
	PlanInfo.devedday = replaceAllString($('#ExpEnddate').val(), '/', '');
	PlanInfo.srid = strIsrId;
	PlanInfo.devmm = "0";
	PlanInfo.userid = userId;
	PlanInfo.devtime = $('#txtExpTime').val();
	PlanInfo.rate = $('[data-ax5select="selRate"]').ax5select("getValue")[0].value;
	
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
		dialog.alert('개발계획등록이 정상적으로 처리되었습니다.',function(){});
		screenInit("M");
		initDevPlan();
	}else {
		dialog.alert('개발계획등록 중 오류가 발생하였습니다.',function(){});
	}
}

//개발실적등록
function btnRegResult_Click() {
	var NowDate = year + month + day;;
	
	if(replaceAllString($('#DevDate').val(), '/', '') > NowDate) {
		dialog.alert('작업일자가 현재일자 이후입니다. 정확히 선택하여 주시기 바랍니다.',function(){});
		$('#DevDate').focus();
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
	
	if($('#ExpStdate').val() > $('#DevDate').val()) {
		dialog.alert('작업일은 예상개발시작일보다 커야 합니다.',function(){});
		return;
	}
	
	var WorkResultInfo = new Object();
	WorkResultInfo.srid = strIsrId;
	WorkResultInfo.userid = userId;
	WorkResultInfo.workday = replaceAllString($('#DevDate').val(), '/', '');
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
		dialog.alert('개발실적등록이 정상적으로 처리되었습니다.',function(){});
		screenInit("M");
		initDevPlan();
	}else {
		dialog.alert('개발실적등록 중 오류가 발생하였습니다.',function(){});
	}
}