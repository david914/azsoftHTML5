var picker = new ax5.ui.picker();
var mainGrid = new ax5.ui.grid();

picker.bind({
	target: $('[data-ax5picker="picker"]'),
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
			dateFormat: 'yyyy-MM',
			lang: {
				yearTmpl: "%s년",
				months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
			},
			mode: "month",
			selectMode: "month"
		},
		formatter: {
			pattern: 'yyyy-MM'
		}
	},
	onStateChanged: function () {
	},
	btns: {
		thisMonth: {
			label: "This Month", onClick: function () {
				var today = new Date();
				this.self
				.setContentValue(this.item.id, 0, ax5.util.date(today, {"return": "yyyy-MM"}))
				.setContentValue(this.item.id, 1, ax5.util.date(today, {"return": "yyyy-MM"})
						+ '/'
						+ ax5.util.daysOfMonth(today.getFullYear(), today.getMonth()))
						.close();
			}
		},
		ok: {label: "Close", theme: "default"}
	}
});	


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
		columns : [ 
			{key : "userid",label : "개발자ID",align : "center",width: "9%"}, 
			{key : "username",label : "개발자명",align : "center",width: "9%"}, 
			{key : "deptname",label : "연구소 실",align : "center",width: "9%"}, 
			{key : "Q03",label : "신규프로그램",align : "center",width: "8%"}, 
			{key : "Q04",label : "변경프로그램",align : "center",width: "8%"}, 
			{key : "programcnt",label : "프로그램 총 개수",align : "center",width: "9%"}, 
			{key : "01",label : "S등급",align : "center",width: "8%"}, 
			{key : "02",label : "A등급",align : "center",width: "8%"}, 
			{key : "03",label : "B등급",align : "center",width: "8%"}, 
			{key : "04",label : "C등급",align : "center",width: "8%"}, 
			{key : "05",label : "D등급",align : "center",width: "8%"}, 
			{key : "ratecnt",label : "SR총 개수",align : "center",width: "8%"}
		]
	}); 
	
	comboSet();
});

function comboSet() {
		
	var ajaxResult = new Array();
	var comboData = new Array();
	var ajaxData = new Object();
	var selectMenu = ["dept", "rate"];
	
	//연구소
	ajaxData.requestType = 'getTeamInfo';
	ajaxResult.push(ajaxCallWithJson('/webPage/report/ProgrammerReport', ajaxData, 'json'));
	
	//SR등급
	ajaxData.requestType = 'getCodeInfo';	
	ajaxResult.push(ajaxCallWithJson('/webPage/report/ProgrammerReport', ajaxData, 'json'));	
	
	console.log(ajaxResult);
	//콤보박스에 들어갈 데이터 세팅
	$.each(ajaxResult, function(index, value) {
		comboData[index] = [];
		$.each(value, function(key, value2) {
			if(index == 0) comboData[index].push({value : value2.cm_deptcd, text : value2.cm_deptname});		
			if(index == 1) comboData[index].push({value : value2.cm_micode, text : value2.cm_codename});		
		})
//		comboData[index][0].value = null; //"전체"값은 null로 세팅
		comboData[0][0].value = ""; //"전체"값은 공백으로 세팅
		
		$('[data-ax5select="' + selectMenu[index] + '"]').ax5select({
			options: comboData[index],
			onChange : function() {
				$("#btnSearch").trigger('click');
			}
		});	
	}) 	
}

$("#btnSearch, #reset").bind('click', function() {
	var month = $("#month").text().slice(0, -1);
	var year = $("#year").text().slice(0, -1);
	if(month.length <= 1) month = '0' + month;
	
	var ajaxData = {
		requestType : 'getRowList',
		inputData : {
			date : year + month,
			dept : $("[data-ax5select='dept']").ax5select("getValue")[0].value,
			rate : $("[data-ax5select='rate']").ax5select("getValue")[0].value,
			devId : $("#developerId").val()
		} 
	}
	console.log(ajaxData.inputData);
	
	var ajaxResult = ajaxCallWithJson('/webPage/report/ProgrammerReport', ajaxData, 'json');
	mainGrid.setData(ajaxResult);

});

//엔터키입력시
$("#developerId").bind('keypress', function(event) {	
	if(window.event.keyCode == 13) $("#btnSearch").trigger("click");
});

//엑셀저장
$("#btnExcel").on('click', function() {
	var st_date = new Date().toLocaleString();
	var today = st_date.substr(0, st_date.indexOf("오"));
	
	mainGrid.exportExcel("개발자별현황 " + today + ".xls");
})

//날짜버튼 클릭 시
$(".dateBtn").bind('click', function() {
	var clicked = $(this).attr('id');
	dateSet(clicked);
});

//picker에 오늘 날짜 디폴트로 세팅
$(function() {
	var today = new Date().toISOString().substring(0,7);
	$("#year").text(today.split('-')[0] + "년");	
	$("#month").text(parseInt(today.split('-')[1]) + "월");	
})

function dateSet(value) {
	
	var month = parseInt($("#month").text().slice(0, -1));
	var year = parseInt($("#year").text().slice(0, -1));
	
	switch(value) {
	case 'year-prev' :
		year--;
		break;
	case 'year-next' :
		year++;
		break;
	case 'month-prev' :
		if(month == 1) {
			month = 12;
			year--;
		} else {
			month--; 			
		}
		break;
	case 'month-next' :
		if(month == 12) {
			month = 1;
			year++;
		} else {
			month++; 			
		}
		break;
	}
	$("#month").text(month + "월");
	$("#year").text(year + "년");
}