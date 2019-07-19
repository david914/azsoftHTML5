var mainGrid = new ax5.ui.grid();
var picker = new ax5.ui.picker();
var userid = "MASTER";
var comboData = [];
var columnData = [];
var pieChart	= null;
var piePChart	= null;
var barChart	= null;
var getPieprogressSw 	= false;
var getBarprogressSw 	= false;
var theme = {
	    series: {
	        series: {
	            colors: [
	            ]
	        },
	        label: {
	            color: '#fff',
	            fontFamily: 'sans-serif'
	        }
	    }
	};

//피커세팅
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

$(document).ready(function() {
	mainGrid.setConfig({
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
	        	if (this.item.cm_sysmsg == "총계"){
	        		return "color-red";
	        	} 
	        }
		},
	});
	
	getSysinfo();
})

//시스템 콤보박스 세팅
function getSysinfo() {
	
	var ajaxData = new Object();
	var ajaxResult = new Object();
	
	ajaxData.requestType = "getSysInfo";
	ajaxData.userid = userid;
	
	ajaxResult = ajaxCallWithJson('/webPage/report/PrgPosessionReport', ajaxData, 'json');
	
	$.each(ajaxResult, function(i, value) {
		comboData.push({ value : value.cm_syscd, text : value.cm_sysmsg });
	});
	
	$('[data-ax5select="sysInfo"]').ax5select({
		options: comboData
	});	
	
	comboData.shift();
}

//조회 클릭 시
$("#btnSearch").bind('click', function() {	
	if($("#btnExcel").length < 1) {
		$("#btnDiv").append('<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnExcel">엑셀저장</button>');
	}
	getRsrcCd();
});

//그리드 컬럼 세팅
function getRsrcCd() {
	var ajaxData = new Object();
	var ajaxResult = new Object();
	
	var syscd = $('[data-ax5select="sysInfo"]').ax5select("getValue")[0].value;
	
	//시스템선택값이 전체일 시 모든 시스템 코드 통합해서 전달
	if(syscd == '00000') {
		syscd = "";
		$.each(comboData, function(i, value) {
			syscd += comboData[i].value;
			if(i < comboData.length-1) syscd += ",";
		})
	}
	
	ajaxData.requestType = "getRsrcCd";
	ajaxData.userid = userid;
	ajaxData.syscd = syscd;
	
	ajaxResult = ajaxCallWithJson('/webPage/report/PrgPosessionReport', ajaxData, 'json');
	
	columnData.push({key : "cm_sysmsg", label : "시스템", align : "center", width: "10%"});
	columnData.push({key : "rowhap", label : "합계", align : "center", width: "5%", styleClass: "color-red"});
	$.each(ajaxResult, function(i, value) {
		columnData.push({key : "col" + value.cm_micode , label : value.cm_codename, align: "center", width : 85 / value.length + "%"});
	});
	
	mainGrid.setConfig({columns : null});
	mainGrid.setConfig({
		target : $('[data-ax5grid="mainGrid"]'),
		columns : columnData
	});
	
	getProgList(syscd);
}

//그리드 데이터 세팅
function getProgList(syscd) {
	var ajaxData = new Object();
	var ajaxResult = new Object();
	
	ajaxData.requestType = "getProgList";
	ajaxData.userid = userid;
	ajaxData.syscd = syscd;
	ajaxData.date = replaceAllString($("#date").val(), '/', '');
	
	ajaxResult = ajaxCallWithJson('/webPage/report/PrgPosessionReport', ajaxData, 'json');
	
	mainGrid.setData(ajaxResult);
	
	ajaxResult.pop();
	successGetPieData(ajaxResult);
	successGetBarData(ajaxResult);
}

//피커에 오늘 날짜 세팅
$(function() {
	var today = new Date().toISOString().substring(0,10).replace(/-/gi, "/");
	$("#date").val(today);
})

//엑셀저장
$("#btnDiv").on('click', '#btnExcel', function() {
	var st_date = new Date().toLocaleString();
	var today = st_date.substr(0, st_date.indexOf("오"));
	
	mainGrid.exportExcel("프로그램보유현황 " + today + ".xls");
})

//파이차트 세팅
function successGetPieData(data) {
	var temp = [];
	$.each(data, function(i, value) {
		temp.push({data : value.rowhap, name : value.cm_sysmsg});
	})
	data = temp;
	if(data.length === 0 ){
		data = makeFakeData('PIE');
	}
	
	var width = $('#pieDiv').width();
	var pieChartHeight = 370;
		
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
	
	theme.series.series.colors = getRandomColorHex(data.series.length);
	options.theme = 'myTheme';
	tui.chart.registerTheme('myTheme', theme);
	pieChart = tui.chart.pieChart(container, data, options);
	
	getPieprogressSw = false;
}

//바차트 세팅
function successGetBarData(data) {
	var temp = [{data : [], name : "개수"}];
	var categories = [];
	
	$.each(data, function(i, value) {
		delete value.rowhap;
		delete value.cm_sysmsg;
		for(var j = 0; j < columnData.length; j++) {
			if(value[columnData[j].key] != undefined) {
				temp[0].data.push(value[columnData[j].key]);
				categories.push(columnData[j].label);
			}
		}
	})
	columnData = [];
	
	data = temp;
	if(data.length === 0 ){
		data = makeFakeData('BAR');
	}
	
	var width = $('#barDiv').width();
	var barChartHeight = 370;
	
	
	if($('#barAppliKinds').length > 0) $('#barAppliKinds').empty();
	
	
	var container = document.getElementById('barAppliKinds');
	var chartData = {
			categories: categories,
			series: data
	};
	
	var options = {
			chart: {
				width: 	 width - 10,
				height:  barChartHeight,
			},
			series: {
				labelAlign: 'center',
				radiusRange: ['100%', '100%']
			},
			legend: {
				visible: false,
			}
	};
	
	theme.series.series.colors = getRandomColorHex(chartData.series.length);
	options.theme = 'myTheme';
	tui.chart.registerTheme('myTheme', theme);
	barChart = tui.chart.columnChart(container, chartData, options);
	
	getPieprogressSw = false;
}

function getRandomColorHex(colorIndex) {
	var hex = '0123456789ABCDEF';
	var color = null;
	var colors = [];
	
	for(var j = 1; j <= colorIndex; j++) {
		color = '#';
		for(var i = 1; i <= 6; i++) { 
			color += hex[Math.floor(Math.random() * 16)];
		}
		
		colors.push(color);
		
		if(colors.length > 2 && (colors[j] == colors[j-1]))
			j--;
	}
	
	return colors;
}