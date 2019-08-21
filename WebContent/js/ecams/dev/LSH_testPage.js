// http://axisj.com/
// http://ax5.io/ax5ui-grid/demo/1-formatter.html
// userid 및 ReqCD 가져오기
var userid = window.parent.userId;   
var strReqCD = "";
var request =  new Request();
strReqCD = request.getParameter('reqcd');
//grid 생성
var firstGrid = new ax5.ui.grid();

$(document).ready(function(){
	if(strReqCD != null && strReqCD != ""){
		if(strReqCD.length > 2) strReqCD.substring(0, 2);
		else strReqCD = "";
	}
	setGrid();
	setCboMenu();
	getMenuAllList();
});

function setCboMenu(){
	var options = [];
	var Cbo_selMenu = [
			{cm_codename : "선택하세요", cm_micode : "0"},
			{cm_codename : "상위메뉴", cm_micode : "1"},
			{cm_codename : "하위메뉴", cm_micode : "2"}
		]
	
	$.each(Cbo_selMenu,function(key,value) {
	    options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="Cbo_selMenu"]').ax5select({
        options: options
	});
}

// getMenuList
function getMenuList(temp){
	var ajaxResultData = null;
	var tmpData = {
			requestType : 'getMenuList',
			temp		: temp
	}	
	ajaxResultData = ajaxCallWithJson('/webPage/test/LSH_testPage', tmpData, 'json');
	
	return ajaxResultData;
}


function cbo_selMenu_click(){
	var resultData;
	
	if($('[data-ax5select="Cbo_selMenu"]').ax5select("getValue")[0].text === "선택하세요"){
		return;
	}
	
	if($('[data-ax5select="Cbo_selMenu"]').ax5select("getValue")[0].text === "상위메뉴"){
		
		$('[data-ax5select="Cbo_Menu"]').ax5select({
	        options: []
		});
		
		$("#Cbo_Menu").hide();
		
		resultData = getMenuList("999");
		
		$('#tmpTest *').remove();
		if(resultData[0].ID === "999"){
			$.each(resultData,function(key,value) {
				var option = $("<li class='dd-item' data-id="+value.cm_menucd+"><div class='dd-handle'>"+value.cm_maname+"</div></li>");
				$('#tmpTest').append(option);
			});
			
			resultData = null;
			
			if($('[data-ax5select="Cbo_selMenu"]').ax5select("getValue")[0].text === "상위메뉴"){
				resultData = getMenuList("LOW");
				
				$('#tmpTest2 *').remove();
				$.each(resultData,function(key,value) {
					var option = $("<li class='dd-item' data-id="+value.cm_menucd+"><div class='dd-handle'>"+value.cm_maname+"</div></li>");
					$('#tmpTest2').append(option);
				});
			}
		} 
	} else {
		$("#Cbo_Menu").show();
		var options = [];
		resultData = null;
		
		resultData = getMenuList("999"); 
		$('#tmpTest *').remove();
		$.each(resultData,function(key,value) {
			var option = $("<li class='dd-item' data-id="+value.cm_menucd+"><div class='dd-handle'>"+value.cm_maname+"</div></li>");
			$('#tmpTest').append(option);
		});
		
		resultData = null;

		resultData = getMenuList("LOW");
		$.each(resultData,function(key,value) {
		    options.push({value: value.cm_menucd, text: value.cm_maname});
		});
		
		$('[data-ax5select="Cbo_Menu"]').ax5select({
	        options: options
		});
		
		Cbo_Menu_Click();
	}
}

function Cbo_Menu_Click(){
	var resultData = getMenuList("999"); 

	$('#tmpTest *').remove();
	$.each(resultData,function(key,value) {
		var option = $("<li class='dd-item' data-id="+value.cm_menucd+"><div class='dd-handle'>"+value.cm_maname+"</div></li>");
		$('#tmpTest').append(option);
	});
	resultData = null;
	var ajaxResultData = null;
	var tmpData = {
			requestType : 'getLowMenuList',
			Cbo_Menu	: $('[data-ax5select="Cbo_Menu"]').ax5select("getValue")[0].value
	}	
	ajaxResultData = ajaxCallWithJson('/webPage/test/LSH_testPage', tmpData, 'json');
	$('#tmpTest2 *').remove();
	$.each(ajaxResultData,function(key,value) {
		var option = $("<li class='dd-item' data-id="+value.cm_menucd+"><div class='dd-handle'>"+value.cm_maname+"</div></li>");
		$('#tmpTest2').append(option);
	});
}

function Cmd_Ip_Click(){
	if($("#tmpTest2").children().length == 0) return;
	
	var menucd = "";
	if($('[data-ax5select="Cbo_Menu"]').ax5select("getValue")[0] != undefined){
		menucd = $('[data-ax5select="Cbo_Menu"]').ax5select("getValue")[0].value;
	}
	
	var tmpList = new Array();
	$("#tmpTest2").children().each(function(){
		var data = new Object();
		data.cm_menucd = $(this).attr("data-id");
		tmpList.push(data);
	})	
	
	var ajaxResultData = null;
	var tmpData = {
			requestType : 'setMenuList',
			selectLabel : $('[data-ax5select="Cbo_selMenu"]').ax5select("getValue")[0].text,
			menucd		: menucd,
			tmpList		: tmpList
	}	
	ajaxResultData = ajaxCallWithJson('/webPage/test/LSH_testPage', tmpData, 'json');
	// 임시 alert 창
	if(ajaxResultData == ""){
		alert("적용완료");
	}else{
		alert("적용실패");
	}
}
function getMenuAllList(){
	var ajaxResultData = null;
	var tmpData = {
			requestType : 'getMenuAllList',
	}	
	ajaxResultData = ajaxCallWithJson('/webPage/test/LSH_testPage', tmpData, 'json');
	console.log(ajaxResultData);
	
	//첫번째 tree만 닫기
	//ajaxResultData[0].collapse = true;
	
	$(ajaxResultData).each(function(i){
		//grid tree 전체닫기
		ajaxResultData[i].collapse = true;
	});
	
	firstGrid.setData(ajaxResultData);
}

function setGrid(){
	firstGrid.setConfig({
        target: $('[data-ax5grid="first-grid"]'),
        header: {
            align: "center",
            columnHeight: 30
        },
        body: {
            columnHeight: 28,
            onClick: function () {
                //this.self.select(this.dindex);
            },
        	onDataChanged: function(){
        		//그리드 새로고침 (스타일 유지)
        	    this.self.repaint();
        	}
        },
        tree: {
            use: true,
            indentWidth: 10,
            arrowWidth: 15,
            iconWidth: 18,
            icons: {
                openedArrow: '<i class="fa fa-caret-down" aria-hidden="true"></i>',
                collapsedArrow: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                groupIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i>',
                collapsedGroupIcon: '<i class="fa fa-folder" aria-hidden="true"></i>',
                itemIcon: '<i class="fa fa-circle" aria-hidden="true"></i>'
            },
            columnKeys: {
                parentKey: "parentMenucd",
                selfKey: "cm_menucd"
            }
        },
        columns: [
            {key: "cm_maname", label: "메뉴명",  width: '30%', treeControl: true},
            {key: "cm_filename", label: "링크파일명",  width: '70%'} //formatter: function(){	return "<button>" + this.value + "</button>"}, 	 
        ]
    });
}

