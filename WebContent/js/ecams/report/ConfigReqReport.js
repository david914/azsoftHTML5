
var userName 	= window.top.userName;
var userid 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;
var strReqCD 	= window.top.reqCd;

var mainGrid		= new ax5.ui.grid();
var picker			= [new ax5.ui.picker(), new ax5.ui.picker()];
var columnData = 
	[ 
		{key : "cm_sysmsg",label : "시스템",align : "center",width: "8%"}, 
		{key : "spms",label : "SR-ID",align : "center",width: "10%"}, 
		{key : "cm_deptname",label : "신청부서",align : "center",width: "4%"}, 
		{key : "acptno",label : "신청번호",align : "center",width: "7%"}, 
		{key : "cm_username",label : "신청자",align : "center",width: "3%"}, 
		{key : "cr_passcd",label : "신청사유",align : "center",width: "15%"}, 
		{key : "cr_acptdate",label : "신청일시",align : "center",width: "5%"}, 
		{key : "cr_prcdate",label : "완료일시",align : "center",width: "5%"}, 
		{key : "requestgb",label : "신청구분",align : "center",width: "4%"}, 
		{key : "sta",label : "진행상태",align : "center",width: "8%"}, 
		{key : "gbn",label : "처리구분",align : "center",width: "4%"}, 
		{key : "cm_dirpath",label : "디렉토리",align : "center",width: "15%"}, 
		{key : "cr_rsrcname",label : "프로그램명",align : "center",width: "11%"}
	];

for(var i = 0; i <= 1; i++) {
	picker[i].bind({
		target: $('[data-ax5picker="picker' + (i+1) + '"]'),
		direction: "top",
		content: {
			width: 220,
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
}

$(document).ready(function() {
	
	mainGrid.setConfig({
		target : $('[data-ax5grid="mainGrid"]'),
		showLineNumber : true,
		showRowSelector : false,
		multipleSelect : false,
		lineNumberColumnWidth : 40,
		rowSelectorColumnWidth : 27,
		body : {
			columnHeight: 24,
	        onClick: function () {
	        	this.self.clearSelect();
	            this.self.select(this.dindex);
	        },
		},
		columns : columnData
	}); 
	
	$('[data-ax5select="statusSel"]').ax5select({
		options: [
			{value: "0", text: "전체"},
			{value: "1", text: "미완료"},
			{value: "9", text: "완료"}
			]
	});
	
	$('input:radio[name=radioStd]').wRadio({theme: 'circle-classic blue', selector: 'checkmark', highlightLabel: true});
	comboSet();	
})

function comboSet() {
	
	var ajaxResult = new Array();
	var comboData = new Array();
	var selectMenu = ["systemSel", "reqDeptSel",  "prcdDivSel", "reqDivSel"];
	
	var ajaxData = new Object();
	
	//시스템
	ajaxData = {
		UserId : userid,
		requestType	: 'getSysInfo'
	};
	ajaxResult.push(ajaxCallWithJson('/webPage/report/ConfigReqReport', ajaxData, 'json'));
	
	//신청부서
	ajaxData.requestType = 'getDeptInfo';	
	ajaxResult.push(ajaxCallWithJson('/webPage/report/ConfigReqReport', ajaxData, 'json'));	
	
	//신청구분
	ajaxData.requestType = 'getCodeInfo';
	ajaxData.cm_macode = 'REQPASS';
	ajaxResult.push(ajaxCallWithJson('/webPage/report/ConfigReqReport', ajaxData, 'json'));
	
	//처리구분
	ajaxData.cm_macode = 'CHECKIN';
	ajaxResult.push(ajaxCallWithJson('/webPage/report/ConfigReqReport', ajaxData, 'json'));
	console.log("-------------------------------------");
	console.log(ajaxResult);

	
	for(var i = 0; i < ajaxResult.length; i++) {
		comboData[i] = [];
		for(var j = 0; j < ajaxResult[i].length; j++) {
			comboData[i][j] = {};
			switch(i) {
			case 0 :
				comboData[i][j].text = ajaxResult[i][j].cm_sysmsg;
				comboData[i][j].value = j == 0 ? null : ajaxResult[i][j].cm_syscd; 
				break;
			case 1 :
				comboData[i][j].text = ajaxResult[i][j].cm_deptname;
				comboData[i][j].value = j == 0 ? null : ajaxResult[i][j].cm_deptcd; 
				break;
			case 2: case 3:
				comboData[i][j].text = ajaxResult[i][j].cm_codename;
				comboData[i][j].value = j == 0 ? null : ajaxResult[i][j].cm_micode; 
				break;
			}
		}
	}
	comboData[3].splice(1,0, {"text" : "신규+수정", "cm_micode" : "99"});
	
	for(var i = 0; i < selectMenu.length; i++) {
		$('[data-ax5select="' + selectMenu[i] + '"]').ax5select({
			options: comboData[i]
		});	
	}
	
}

$(function() {
	var today = new Date().toISOString().substring(0,10).replace(/-/gi, "/");
	$("#datEdD").val(today);
	$("#datStD").val(today);
})

$("#btnSearch").bind('click', function() {
	
	var inputData = new Object();
	var dategbn = "0";
	if($("#radioCkIn").is(":checked")) dategbn = 1;
	
	inputData = {			
		stDt : replaceAllString($("#datStD").val(), '/', ''),
		edDt : replaceAllString($("#datEdD").val(), '/', ''),
		desc : $("#descript").val() == '' ? null : $("#descript").val(),
		strSys : $("[data-ax5select='systemSel']").ax5select("getValue")[0].value,
		strJob : null,
		strDept : $("[data-ax5select='reqDeptSel']").ax5select("getValue")[0].value,
		txtUser : $("#reqUser").val() == '' ? null : $("#reqUser").val(),
		strQry : $("[data-ax5select='reqDivSel']").ax5select("getValue")[0].value,
		strGbn : $("[data-ax5select='prcdDivSel").ax5select("getValue")[0].value,
		strPrc : $("[data-ax5select='statusSel']").ax5select("getValue")[0].value,
		srId : $("#srId").val() == '' ? null : $("#srId").val(),
		dategbn : dategbn
	}
	
	console.log(inputData);
	ajaxData = {
			prjData : inputData,
			UserId : userid,
			requestType : "getSelectList"
	}
	var ajaxResult = ajaxCallWithJson('/webPage/report/ConfigReqReport', ajaxData, 'json');
	console.log(ajaxResult);
	mainGrid.setData(ajaxResult);
})

function enterKey() {
	if(window.event.keyCode == 13) $("#btnSearch").trigger("click");
}