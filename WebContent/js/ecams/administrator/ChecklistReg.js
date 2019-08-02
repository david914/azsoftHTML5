var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드

var treeObj			= null;
var treeObjData		= null;
var rMenu			= null;

var cboDutyData		= null;
var stepGrid 		= new ax5.ui.grid();
var beforeClick = [];

var setting = {
		check: {
			enable: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: onClick,
			onRightClick: onRightClick
		}
	};

function onClick(event, treeId, treeNode, clickFlag) {
	getItemInfoStepList(treeNode.id);
}

function onRightClick(event, treeId, treeNode) {
	if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
		treeObj.cancelSelectedNode();
		showRMenu("root", event.clientX, event.clientY);
	} else if (treeNode && !treeNode.noR) {
		treeObj.selectNode(treeNode);
		showRMenu("node", event.clientX, event.clientY);
	}
}

function showRMenu(type, x, y) {
	$("#rMenu ul").show();
//	if (type=="root") {
//		$("#m_del").hide();
//		$("#m_check").hide();
//		$("#m_unCheck").hide();
//	} else {
//		$("#m_del").show();
//		$("#m_check").show();
//		$("#m_unCheck").show();
//	}

    y += document.body.scrollTop;
    x += document.body.scrollLeft;
    rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

	$("body").bind("mousedown", onBodyMouseDown);
}

function hideRMenu() {
	if (rMenu) rMenu.css({"visibility": "hidden"});
	$("body").unbind("mousedown", onBodyMouseDown);
}

function onBodyMouseDown(event){
	if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
		rMenu.css({"visibility" : "hidden"});
	}
}

$(document).ready(function() {
	
	rMenu = $("#rMenu");
	
	//순서 리스트 세팅
	for(var i = 0; i < 28; i++) {
		if(i % 2 == 0) {			
			$("#stepList").append('<li id="step' + i + '" style="background: #ddd; height: 25px;"></li>');
		} else {			
			$("#stepList").append('<li id="step' + i + '" style="background: #eee; height: 25px;"></li>');
		}
	}
	
	setCboGbn();
	getItemInfoTree();
});

function setCboGbn() {	
	var comboData = [
		{value: "00", text: "전체"},
		{value: "1", text: "보안"},
		{value: "2", text: "모니터링"}
	]
	
	$('[data-ax5select="cboGbn"]').ax5select({
		options : comboData
	});
	$('[data-ax5select="cboGbn"]').ax5select("setValue", '1', true);
}

function getItemInfoTree() {
	var ajaxData = {
		requestType: "getItemInfoTree",
		code: $('[data-ax5select="cboGbn"]').ax5select("getValue")[0].value
	}
	
	ajaxAsync('/webPage/administrator/ChecklistReg', ajaxData, 'json', successGetItemInfoTree);
}

function successGetItemInfoTree(data) {
	data.push({id: "4343", pId: "0011", name: "아아아아아아아아아아아아아아아아아아아아<br>아아아아아아아아아아아\n아아아아아아아아\n아아아아아아아아아아아아아아아아아\n아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아"});
	console.log(data);
	treeObjData = data;
	$.fn.zTree.init($("#cboTree"), setting, data);
	treeObj = $.fn.zTree.getZTreeObj("cboTree");
}

function getItemInfoStepList(id) {
	var ajaxData = {
		requestType: "getItemInfoStepList",
		nodeid : id
	}
	ajaxAsync('/webPage/administrator/ChecklistReg', ajaxData, 'json', successGetItemInfoStepList);	
}

function successGetItemInfoStepList(data) {
	console.log(data);
	
	$.each(beforeClick, function(i, value) {
		$("#step" + i).html("");
	});
	$.each(data, function(i, value) {
		var text = value.cm_gbnname;
		var cutText = text.indexOf("-") == -1 ? text :  text.substr(0, text.indexOf("-"));
		$("#step" + i).html("<h4>" + cutText + "</h4>");
	});
	beforeClick = data;
}


