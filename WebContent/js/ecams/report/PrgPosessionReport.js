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

function getRsrcCd() {
	var ajaxData = new Object();
	var ajaxResult = new Object();
	
	var syscd = $('[data-ax5select="sysInfo"]').ax5select("getValue")[0].value;
	
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

$("#btnSearch").bind('click', function() {	
	getRsrcCd();
});

$(function() {
	var today = new Date().toISOString().substring(0,10).replace(/-/gi, "/");
	$("#date").val(today);
})

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
//	var divMainUpHeight = parseInt($('#divMainUp').height());
//	var minusHeight = 115;
//	if(parseInt(window.innerHeight) < 690) { 
//		minusHeight += 690 - parseInt(window.innerHeight);
//	}
//	var pieChartHeight = parseInt(window.innerHeight) - divMainUpHeight - minusHeight;
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
	
//	beForAndAfterDataLoading('AFTER', makeMsg(' 신청 별 종류 가져오기를 완료했습니다.'));
	getPieprogressSw = false;
}

function successGetBarData(data) {
	var temp = [{data : [], name : "개수"}];
	var categories = [];
	console.log(data);
	
//	$.each(data, function(i, value) {
//		temp.push({data : value.rowhap, name : value.cm_sysmsg});
//	})
	console.log(columnData);
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
	console.log(data);
	if(data.length === 0 ){
		data = makeFakeData('BAR');
	}
	
	var width = $('#barDiv').width();
//	var divMainUpHeight = parseInt($('#divMainUpD
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
//				align: 'bottom'
			}
	};
	
	console.log(data);
//	for(var i = 0; i <= categories.length; i++) {		
//		theme.series.series.colors.push(getRandomColorHex(chartData.series.length));
//	}
	theme.series.series.colors = getRandomColorHex(chartData.series.length);
	options.theme = 'myTheme';
	tui.chart.registerTheme('myTheme', theme);
	barChart = tui.chart.columnChart(container, chartData, options);
	
	console.log(theme);
//	beForAndAfterDataLoading('AFTER', makeMsg(' 신청 별 종류 가져오기를 완료했습니다.'));
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