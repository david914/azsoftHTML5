var SecuYn = null;
var userid 		= 'MASTER';
//var userid 		= window.top.userId;
var picker = [new ax5.ui.picker(), new ax5.ui.picker()];
var mainGrid = new ax5.ui.grid();
var columnData = 
	[ 
		{key : "ownerdept",label : "요청본부",align : "center",width: "10%"}, 
		{key : "dept1",label : "요청부서",align : "center",width: "10%"}, 
		{key : "dept2",label : "개발부서",align : "center",width: "10%"}, 
		{key : "sysmsg",label : "시스템",align : "center",width: "15%"}, 
		{key : "chkDate",label : "기간",align : "center",width: "15%"}, 
		{key : "CntSum",label : "합계",align : "right",width: "40%"} 
	];

//picker세팅
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
	
	//엑셀저장
	$("#btnExcel").on('click', function() {
		var st_date = new Date().toLocaleString();
		var today = st_date.substr(0, st_date.indexOf("오"));
		
		mainGrid.exportExcel("개발/SR기준(집계) " + today + ".xls");
	})
	
	mainGrid.setConfig({
		header : { align: "center" },
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
	        trStyleClass: function () {
	        	if (this.item.gbn === 'T'){
	        		return "font-blue";
	        	} else if (this.item.gbn === 'S'){
	        		return "font-red";
	        	}
	        }
		},
     	onDataChanged: function(){
     	    this.self.repaint();
     	},
		columns : columnData
			
	});
	isAdmin();
	comboSet();
})

//콤보 데이터 셋
function comboSet() {
	
	var ajaxResult = new Array();
	var comboData = new Array([],[],[],[]);
	var ajaxData = new Object();
	var selectMenu = ["devDept", "reqDept",  "dateStd", "srStat"];
	
	//개발부서
	ajaxData.requestType = 'getTeamInfo1';
	ajaxResult.push(ajaxCallWithJson('/webPage/report/SRStandardReport', ajaxData, 'json'));
	
	//요청부서
	ajaxData.requestType = 'getTeamInfo2';	
	ajaxResult.push(ajaxCallWithJson('/webPage/report/SRStandardReport', ajaxData, 'json'));	
	
	//조회구분, SR상태
	ajaxData.requestType = 'getCodeInfo';
	ajaxResult.push(ajaxCallWithJson('/webPage/report/SRStandardReport', ajaxData, 'json'));
	
	ajaxResult[3] = {}; //콤보세팅 4번 반복을 위한 배열 길이 증가용 값

	//콤보박스에 들어갈 데이터 세팅
	$.each(ajaxResult, function(index, value) {
		$.each(value, function(key, value2) {
			if(index == 0 || index == 1) comboData[index].push({value : key == 0 ? null : value2.cm_deptcd, text : value2.cm_deptname});		
			if(index == 2 && value2.cm_macode == 'RPTPRGGB') comboData[2].push({value : key == 0 ? null : value2.cm_micode, text : value2.cm_codename});		
			if(index == 2 && value2.cm_macode == 'ISRSTA') comboData[3].push({value : key == 0 ? null : value2.cm_micode, text : value2.cm_codename});					
		})
//		comboData[index][0].value = null; //"전체"값은 null로 세팅
		if(index == 2) comboData[2].splice(0,1); //조회구분의 '전체'항목 삭제
		
		$('[data-ax5select="' + selectMenu[index] + '"]').ax5select({
			options: comboData[index]
		});	
	})
	console.log(comboData);
}

function isAdmin() {
	var ajaxData = {
			requestType : 'isAdmin',
			UserId : userid
	}
	ajaxResultData = ajaxCallWithJson('/webPage/report/SRStandardReport', ajaxData, 'json');
	SecuYn = ajaxResultData ? "Y" : "N"; 
}

//picker에 오늘 날짜 디폴트로 세팅
$(function() {
	var today = new Date().toISOString().substring(0,10).replace(/-/gi, "/");
	$("#datEdD").val(today);
	$("#datStD").val(today);
})

//조회 클릭 시
$("#btnSearch").bind('click', function() {
	
	var inputData = {	
		dateGbn : $("[data-ax5select='dateStd']").ax5select("getValue")[0].value,
		strDate : replaceAllString($("#datStD").val(), '/', ''),
		endDate : replaceAllString($("#datEdD").val(), '/', ''),
		deptGbn : "D",
		dept1 : $("[data-ax5select='reqDept']").ax5select("getValue")[0].value,
		dept2 : $("[data-ax5select='devDept']").ax5select("getValue")[0].value,
		Sta : $("[data-ax5select='devDept']").ax5select("getValue")[0].value,
		srid : $("#srId").val() == '' ? null : $("#srId").val()
	}
	
	ajaxData = {
			inputData : inputData,
			userId : userid,
			reqCd : "01",
			secuYn : SecuYn,
			requestType : "getProgCnt"
	}
	
	console.log(ajaxData);
	var ajaxResult = ajaxCallWithJson('/webPage/report/SRStandardReport', ajaxData, 'json');
	mainGrid.setData(ajaxResult);
//	console.log(ajaxResult);
})