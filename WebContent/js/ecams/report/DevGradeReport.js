var mainGrid = [new ax5.ui.grid(), new ax5.ui.grid(), new ax5.ui.grid()];
var columns = [[],[],[]];

$(document).ready(function() {
	
	for(var i = 0; i <= 2; i++) {
		
		mainGrid[i].setConfig({
			target : $('[data-ax5grid="mainGrid' + (i+1) + '"]'),
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
			},
		}); 
	}
	
});

//조회
$("#btnSearch").bind('click', function() {	
	getColHeader();
	getRowList();
})

//그리드 헤더 세팅
function getColHeader() {
	
	var ajaxData = new Object();
	var ajaxResult = [];
	
	ajaxData.requestType = "getColHeader";
	
	ajaxData.data = "reqDept";
	ajaxResult.push(ajaxCallWithJson('/webPage/report/DevGradeReport', ajaxData, 'json'));
	ajaxData.data = "rate";
	ajaxResult.push(ajaxCallWithJson('/webPage/report/DevGradeReport', ajaxData, 'json'));
	ajaxData.data = "devDept";
	ajaxResult.push(ajaxCallWithJson('/webPage/report/DevGradeReport', ajaxData, 'json'));
	
	$.each(ajaxResult, function(i, value) {
		columns[i].push({key : "deptname", label : "구분", align : "center", width: "10%"});
		columns[i].push({key : "rowhap", label : "합계", align : "center", width: "5%", styleClass: "color-red"});
		$.each(value, function(j, value2) {
			columns[i].push({key : j < 9 ? "col0" + (j+1) : "col" + (j+1) , label : value2.codename, align: "center", width : 85 / value.length + "%"});
		})
		
		mainGrid[i].setConfig({
			target : $('[data-ax5grid="mainGrid' + (i+1) + '"]'),
			columns : columns[i]
		})
	});
	console.log(columns);
}

//그리드 데이터 세팅
function getRowList() {
	
	var ajaxData = new Object();
	var ajaxResult = [];
	var gridData = [[],[],[]];
		
	ajaxData.requestType = "getRowList";
	ajaxData.date = "201702";
	
	ajaxData.data = "reqDept";
	ajaxResult.push(ajaxCallWithJson('/webPage/report/DevGradeReport', ajaxData, 'json'));
	ajaxData.data = "rate";
	ajaxResult.push(ajaxCallWithJson('/webPage/report/DevGradeReport', ajaxData, 'json'));
	ajaxData.data = "devDept";
	ajaxResult.push(ajaxCallWithJson('/webPage/report/DevGradeReport', ajaxData, 'json'));
	
	//빈 데이터 0으로 채우기위한 그리드 데이터 세팅
	$.each(columns, function(i, col) {
		var rowData1 = { rowhap : ajaxResult[i][0].rowhap, deptname : ajaxResult[i][0].deptname };
		var rowData2 = { rowhap : ajaxResult[i][1].rowhap, deptname : ajaxResult[i][1].deptname };
		$.each(col, function(j, value) {
			if(j > 1) {			
				rowData1[value.key] = ajaxResult[i][0][value.key] == undefined ? 0 : ajaxResult[i][0][value.key];
				rowData2[value.key] = ajaxResult[i][1][value.key] == undefined ? 0 : ajaxResult[i][1][value.key];
			}
		});
		gridData[i].push(rowData1);
		gridData[i].push(rowData2);
	});
		
	for(var i = 0; i <= 2; i++) {		
		mainGrid[i].setData(gridData[i]);
	}
}