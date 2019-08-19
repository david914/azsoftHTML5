var SecuYn = null;
var userid 		= 'MASTER';
//var userid 		= window.top.userId;
var picker = [new ax5.ui.picker(), new ax5.ui.picker()];
var mainGrid = new ax5.ui.grid();
var dialog = new ax5.ui.dialog({title: "경고"});


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
	
	mainGrid.setConfig({
		header : { align: "center" },
		target : $('[data-ax5grid="mainGrid"]'),
		showLineNumber : false,
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
	        	if (this.item.step2name === undefined){
	        		return "font-red";
	        	} 
	        }
		},
     	onDataChanged: function(){
     	    this.self.repaint();
     	},
	});
	isAdmin();
	comboSet();
	
	//엑셀
	$("#btnExcel").on('click', function() {
		var st_date = new Date().toLocaleString();
		var today = st_date.substr(0, st_date.indexOf("오"));
		
		mainGrid.exportExcel("형상관리운영현황 " + today + ".xls");
	})
})



function isAdmin() {
	var ajaxData = {
			requestType : 'isAdmin',
			UserId : userid
	}
	ajaxResultData = ajaxCallWithJson('/webPage/report/SRStandardReport', ajaxData, 'json');
	SecuYn = ajaxResultData ? "Y" : "N"; 
}

function comboSet() {
	
	var ajaxResult = new Array();
	var comboData = new Array([],[],[],[],[],[]);
	var ajaxData = new Object();
	var selectMenu = ["systemSel", "dateStd", "step1", "step2", "step3", "step4"];
	
	//시스템
	ajaxData = {
		SecuYn : SecuYn,
		UserId : userid,
		requestType	: 'getSysInfo'
	};
	ajaxResult.push(ajaxCallWithJson('/webPage/report/ConfigOpReport', ajaxData, 'json'));
	
	//조회구분, 1~4단계
	ajaxData.requestType = 'getCodeInfo';
	ajaxResult.push(ajaxCallWithJson('/webPage/report/ConfigOpReport', ajaxData, 'json'));
	
	ajaxResult[2], ajaxResult[3], ajaxResult[4], ajaxResult[5] = {}; //콤보세팅 4번 반복을 위한 배열 길이 증가용 값
	
	//콤보박스에 들어갈 데이터 세팅
	$.each(ajaxResult, function(index, value) {
		$.each(value, function(key, value2) {
			if(index == 0) comboData[index].push({value : value2.cm_syscd, text : value2.cm_sysmsg});		
			if(index == 1 && value2.cm_macode == 'RPTPRGGB') comboData[1].push({value : value2.cm_micode, text : value2.cm_codename});		
			if(index == 1 && value2.cm_macode == 'RPTSTEP1') {
				comboData[2].push({value :  value2.cm_micode, text : value2.cm_codename});					
				comboData[3].push({value :  value2.cm_micode, text : value2.cm_codename});					
				comboData[4].push({value :  value2.cm_micode, text : value2.cm_codename});					
				comboData[5].push({value :  value2.cm_micode, text : value2.cm_codename});					
			}
		})
		comboData[index][0].value = ''; //"전체"값은 공백으로 세팅
		
		$('[data-ax5select="' + selectMenu[index] + '"]').ax5select({
			options: comboData[index]
		});	
	})
	
	//단계콤보박스 디폴트 값
	$('[data-ax5select="step1"]').ax5select("setValue", '1', true);
	$('[data-ax5select="step2"]').ax5select("setValue", '3', true);
	$('[data-ax5select="step3"]').ax5select("setValue", '4', true);
	$('[data-ax5select="step4"]').ax5select("setValue", '5', true);
}

//picker에 오늘 날짜 디폴트로 세팅
$(function() {
	var today = new Date().toISOString().substring(0,10).replace(/-/gi, "/");
	$("#datEdD").val(today);
	$("#datStD").val(today);
})

//조회 클릭 시
$("#btnSearch").bind('click', function() {
	
	var strDate = '';
	var endDate = '';
	
	//조회구분 월별일 경우 일자 자르기
	if($("[data-ax5select='dateStd']").ax5select("getValue")[0].value === '01') {
		strDate = replaceAllString($("#datStD").val(), '/', '').substr(0,6);
		endDate = replaceAllString($("#datEdD").val(), '/', '').substr(0,6);
	} else {		
		strDate = replaceAllString($("#datStD").val(), '/', '');
		endDate = replaceAllString($("#datEdD").val(), '/', '');
	}
	
	//유효성검사
	if($("[data-ax5select='dateStd']").ax5select("getValue")[0].value === '') {
		dialog.alert("조회구분을 선택해주세요.");
		return;
	}
	if($("[data-ax5select='step1']").ax5select("getValue")[0].value === '') {
		dialog.alert("1단계 조건을 선택해주세요.");
		return;
	}
	if($("[data-ax5select='step2']").ax5select("getValue")[0].value === '') {
		dialog.alert("2단계 조건을 선택해주세요.");
		return;
	}
	if($("[data-ax5select='step3']").ax5select("getValue")[0].value === '') {
		dialog.alert("3단계 조건을 선택해주세요.");
		return;
	}
	if($("[data-ax5select='step4']").ax5select("getValue")[0].value === '') {
		dialog.alert("4단계 조건을 선택해주세요.");
		return;
	}
	if(strDate > endDate) {
		dialog.alert("조회기간을 정확히 입력해주십시오.");
		return;
	}	
	
	var columnData = [];	
	var inputData = {	
		userid : userid,
		syscd : $("[data-ax5select='systemSel']").ax5select("getValue")[0].value,
		dateGbn : $("[data-ax5select='dateStd']").ax5select("getValue")[0].value,
		strDate : strDate,
		endDate : endDate
	}
	
	ajaxData = {
			inputData : inputData,
			requestType : "getRsrcCd"
	}
	
	//컬럼에 표시할 데이터 불러오기
	var ajaxResult = ajaxCallWithJson('/webPage/report/ConfigOpReport', ajaxData, 'json');
	
	//step선택 값에 따른 컬럼 데이터 세팅
	for(var i = 1; i <= 4; i++) {
		var stepText = $("[data-ax5select='step" + i + "']").ax5select("getValue")[0].text;
		columnData.push({key : "step" + i + "name", label : stepText, align : "center", width : "7%"});
	}
	columnData.push({key : "rowhap",label : "합계",align : "right",width: "5%", styleClass: "font-red"});
	
	console.log(ajaxResult);
	//존재하는 컬럼 데이터 추가
	$.each(ajaxResult, function(index, value) {
		columnData.push({key : "col" + value.cm_micode, label : value.cm_codename, align : "right", width : "5%"});
	})
	
	ajaxData, inputData = null;
	
	inputData = {
		userid : userid,
		syscd : $("[data-ax5select='systemSel']").ax5select("getValue")[0].value,
		dateGbn : $("[data-ax5select='dateStd']").ax5select("getValue")[0].value,
		strJob : null,
		step1 : $("[data-ax5select='step1']").ax5select("getValue")[0].value,
		step2 : $("[data-ax5select='step2']").ax5select("getValue")[0].value,
		step3 : $("[data-ax5select='step3']").ax5select("getValue")[0].value,
		step4 : $("[data-ax5select='step4']").ax5select("getValue")[0].value,
		strDate : strDate,
		endDate : endDate
	}
	ajaxData = {
			inputData : inputData,
			requestType : "getProgList"
	}
	var ajaxResult = ajaxCallWithJson('/webPage/report/ConfigOpReport', ajaxData, 'json');
	
	var footSumData = [[]];
	var gridData = [];
	
	$.each(ajaxResult, function(i, value) {
		gridData.push(value);
	});
	
	footSumData[0].push({label: "총계", colspan: 4, align: "center"});
	$.each(columnData, function(i, value) {
		if(i > 3) {
			footSumData[0].push({key: value.key, collector: function() {
				return ajaxResult[ajaxResult.length - 1][value.key];
				}, align: "right"});
		}
	});
	
	var testColumnData = [
        {key: "isrid", label: "SR-ID",  width: '6%'},
        {key: "genieid", label: "문서번호",  width: '6%', align: 'left'},
        {key: "recvdate", label: "등록일",  width: '5%'},
        {key: "reqdept", label: "요청부서",  width: '5%', align: 'left'},
        {key: "reqsta1", label: "SR상태",  width: '5%', align: 'left'},
        {key: "reqtitle", label: "요청제목",  width: '15%', align: 'left'},
        {key: "reqedday", label: "완료요청일",  width: '5%'},
        {key: "comdept", label: "등록부서",  width: '5%', align: 'left'},
        {key: "recvuser", label: "등록인",  width: '4%'},
        {key: "recvdept", label: "개발부서",  width: '5%', align: 'left'},
        {key: "devuser", label: "개발담당자",  width: '5%'},
        {key: "reqsta2", label: "개발자상태",  width: '5%', align: 'left'},
        {key: "chgdevterm", label: "개발기간", width: '8%', align: 'left'},
        {key: "chgdevtime", label: "개발계획공수", width: '6%'},
        {key: "realworktime", label: "개발투입공수", width: '6%'},
        {key: "chgpercent", label: "개발진행율", width: '6%'},
        {key: "chgedgbn", label: "변경종료구분", width: '6%', align: 'left'},
        {key: "chgeddate", label: "변경종료일", width: '6%'},
        {key: "isredgbn", label: "SR완료구분", width: '6%', align: 'left'},
        {key: "isreddate", label: "SR완료일", width: '6%'}
    ];
	//컬럼 세팅
	mainGrid.setConfig({
		footSum : footSumData,
		columns : columnData
	})
	
	gridData.pop();	
	
	console.log(testColumnData);
	console.log(columnData);
	
	//그리드 세팅
	mainGrid.setData(gridData);
})

