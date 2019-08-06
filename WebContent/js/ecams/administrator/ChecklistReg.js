var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드

var treeObj			= null;
var treeObjData		= null;
var rMenu			= null;

var modal			= new ax5.ui.modal();
var confirmDialog 	= new ax5.ui.dialog();
var cboDutyData		= null;
var beforeClick = [];
var popupData		= null;
var popupGbn		= null;
var liData			= null;
var selectedStep	= null;
var selectedStepIndex = null;
var previousStep	= null;
var nowStep			= null;

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
			$("#stepList").append('<li class="listLi" id="step' + i + '" style="background: #ddd; height: 25px;"></li>');
		} else {			
			$("#stepList").append('<li class="listLi" id="step' + i + '" style="background: #eee; height: 25px;"></li>');
		}
	}
	
	$(".listLi").hover(function() {
		if(this != nowStep) {
			$(this).css("background", "lightblue");
		}
	}, function() {
		if(this != nowStep) {			
			if($(".listLi").index(this) % 2 == 0) {			
				$(this).css("background", "#ddd");		
			} else {			
				$(this).css("background", "#eee");		
			}
		}
	})
	
	$("#btnSearch").bind('click', function() {
		getTree();
	})
	
	$("#btnPlus").bind('click', function() {
		spreadTree();
	})
	
	$("#btnMinus").bind('click', function() {
		foldTree();
	})
	
	$("#m_add1").bind('click', function() {
		subNewItemInfo("EQUAL");
		hideRMenu();
	})
	
	$("#m_add2").bind('click', function() {
		subNewItemInfo("LOW");
		hideRMenu();
	})
	
	$("#m_change").bind('click', function() {
		subNewItemInfo("RENAME");
		hideRMenu();
	})
	
	$("#m_del").bind('click', function() {
		confirmDialog.confirm({
			title: "삭제 확인",
			msg: "삭제하시겠습니까?"
		}, function() {
			if(this.key == "ok") {
				delItemInfo();
			}
		})
		hideRMenu();
	})
	
	$("#upBtn").bind('click', function() {
		
	})
	
	$("#downBtn").bind('click', function() {
		
	})
	
	$(".listLi").bind('click', function(event) {
		previousStep = nowStep;
		nowStep = this;
		$(this).css("background", "skyblue");
		console.log("previousStep")
		console.log(previousStep)
		console.log("$(pre)")
		console.log($(previousStep))
		if($(".listLi").index($("#" + previousStep.id())) % 2 == 0) {			
			$(previousStep).css("background", "#ddd");
		} else {			
			$(previousStep).css("background", "#eee");
		}
	})
	
	
	setCboGbn();
	$('[data-ax5select="cboGbn"]').ax5select("setValue", '1', true);
	
	getTree();
});

function getTree() {
	getItemInfoTree();	
}

function setCboGbn() {	
	var comboData = [
		{value: "00", text: "전체"},
		{value: "1", text: "보안"},
		{value: "2", text: "모니터링"}
	]
	
	$('[data-ax5select="cboGbn"]').ax5select({
		options : comboData
	});
}

function getItemInfoTree() {
	var ajaxData = {
		requestType: "getItemInfoTree",
		code: $('[data-ax5select="cboGbn"]').ax5select("getValue")[0].value
	}
	
	ajaxAsync('/webPage/administrator/ChecklistReg', ajaxData, 'json', successGetItemInfoTree);
}

function successGetItemInfoTree(data) {
	treeObjData = data;
	$.fn.zTree.init($("#cboTree"), setting, data);
	treeObj = $.fn.zTree.getZTreeObj("cboTree");
}

function getItemInfoStepList(id) {
	var ajaxData = {
		requestType: "getItemInfoStepList",
		nodeid : id
	}
	var ajaxResult = ajaxCallWithJson('/webPage/administrator/ChecklistReg', ajaxData, 'json');
	liData = ajaxResult;
	successGetItemInfoStepList();
}

function successGetItemInfoStepList() {
	$.each(beforeClick, function(i, value) {
		$("#step" + i).html("");
	});
	$.each(liData, function(i, value) {
		var text = value.cm_gbnname;
		console.log()
		var cutText = text.indexOf("-") == -1 ? text :  text.substr(0, text.indexOf("-"));
		$("#step" + i).html("<h4>" + cutText + "</h4>");
		console.log(text);
	});
	beforeClick = liData;
	
}

function subNewItemInfo(gbn) {
	popupGbn = gbn;
	popData = treeObj.getSelectedNodes()[0];
	modal.open({
        width: 400,
        height: 300,
        iframe: {
            method: "get",
            url: "../modal/checklist/ChecklistModal.jsp",
            param: "callBack=sysDetailModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
                selectedSystem = null;
            }
        }
    }, function () {
    });
}

function spreadTree() {
	treeObj.expandAll(true);
}

function foldTree() {	
	treeObj.expandAll(false);
}

function delItemInfo() {
	
	var dataObj = new Object();
	var ajaxData = new Object();
	dataObj.cm_gbncd = treeObj.getSelectedNodes()[0].id;
	dataObj.cm_lstusr = userId;
	
	ajaxData = {
		dataObj : dataObj,		
		requestType : "delItemInfo"
	}
	
	ajaxAsync('/webPage/administrator/ChecklistReg', ajaxData, 'json', successDelItemInfo);	
}

function successDelItemInfo(data) {
	if(data === "OK") {		
		dialog.alert("정상적으로 삭제되었습니다.")
		getTree();
	} else {
		dialog.alert("삭제에 실패하였습니다.")
	}
} 