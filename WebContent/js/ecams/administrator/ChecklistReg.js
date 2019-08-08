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
var tempData

//트리 컨텍스트메뉴 옵션
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

//트리 각 노드 클릭 시 액션
function onClick(event, treeId, treeNode, clickFlag) {
	getItemInfoStepList(treeNode.id);
}

//트리에서 우클릭 시 컨텍스트메뉴
function onRightClick(event, treeId, treeNode) {
	if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
		treeObj.cancelSelectedNode();
		showRMenu("root", event.clientX, event.clientY);
	} else if (treeNode && !treeNode.noR) {
		treeObj.selectNode(treeNode);
		showRMenu("node", event.clientX, event.clientY);
	}
}

//컨텍스트메뉴 보여주기
function showRMenu(type, x, y) {
	$("#rMenu ul").show();
    y += document.body.scrollTop;
    x += document.body.scrollLeft;
    rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

	$("body").bind("mousedown", onBodyMouseDown);
}

//컨텍스트메뉴 감추기
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
	
	//리스트에 마우스오버 시 색깔변경
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
	
	//동일 레벨 항목추가 클릭 시
	$("#m_add1").bind('click', function() {
		subNewItemInfo("EQUAL");
		hideRMenu();
	})
	
	//하위 레벨 항목추가 클릭 시
	$("#m_add2").bind('click', function() {
		subNewItemInfo("LOW");
		hideRMenu();
	})
	
	//항목명바꾸기 클릭 시
	$("#m_change").bind('click', function() {
		subNewItemInfo("RENAME");
		hideRMenu();
	})
	
	//항목삭제 클릭 시
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
	
	//리스트 순서변경 이벤트
	$("#upBtn").bind('click', function() {
		if(selectedStepIndex != 0) {
			tempData = liData[selectedStepIndex - 1];
			liData[selectedStepIndex - 1] = liData[selectedStepIndex];
			liData[selectedStepIndex] = tempData;
			successGetItemInfoStepList();
			$(".listLi").eq(selectedStepIndex - 1).trigger('click');
		} 
	})
	
	$("#downBtn").bind('click', function() {
		if(selectedStepIndex != liData.length - 1) {
			tempData = liData[selectedStepIndex + 1];
			liData[selectedStepIndex + 1] = liData[selectedStepIndex];
			liData[selectedStepIndex] = tempData;
			successGetItemInfoStepList();
			$(".listLi").eq(selectedStepIndex + 1).trigger('click');
		}
	})
	
	//리스트 클릭 시 하이라이트
	$(".listLi").bind('click', function(event) {
		selectedStepIndex = $(".listLi").index(this);
		tempData = liData[selectedStepIndex];
		nowStep = this;
		$(this).css("background", "skyblue");
		if($(".listLi").index(previousStep) % 2 == 0) {			
			$(previousStep).css("background", "#ddd");
		} else {			
			$(previousStep).css("background", "#eee");
		}
		previousStep = nowStep;
	})
	
	//순서 적용 클릭 시
	$("#btnReq").bind('click', function() {
		updateItemInfoStep();
	})
	
	setCboGbn();
	$('[data-ax5select="cboGbn"]').ax5select("setValue", '1', true);
	
	getTree();
});

function getTree() {
	getItemInfoTree();
	liData = [];
	successGetItemInfoStepList();
}

//항목구분 데이터 세팅
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

//트리 가져오기
function getItemInfoTree() {
	var ajaxData = {
		requestType: "getItemInfoTree",
		code: $('[data-ax5select="cboGbn"]').ax5select("getValue")[0].value
	}
	
	ajaxAsync('/webPage/administrator/ChecklistReg', ajaxData, 'json', successGetItemInfoTree);
}

//트리 가져오기 성공
function successGetItemInfoTree(data) {
	treeObjData = data;
	$.fn.zTree.init($("#cboTree"), setting, data);
	treeObj = $.fn.zTree.getZTreeObj("cboTree");
}

//노드 순서 가져오기
function getItemInfoStepList(id) {
	var ajaxData = {
		requestType: "getItemInfoStepList",
		nodeid : id
	}
	var ajaxResult = ajaxCallWithJson('/webPage/administrator/ChecklistReg', ajaxData, 'json');
	liData = ajaxResult;
	successGetItemInfoStepList();
}

//노드 순서 가져오기
function successGetItemInfoStepList() {
	$.each(beforeClick, function(i, value) {
		$("#step" + i).html("");
	});
	$.each(liData, function(i, value) {
		var text = value.cm_gbnname;
		var cutText = text.indexOf("-") == -1 ? text :  text.substr(0, text.indexOf("-"));
		$("#step" + i).html("<h4>" + cutText + "</h4>");
		console.log(text);
	});
	beforeClick = liData;
	
}

//노드 순서 변경
function updateItemInfoStep() {
	
	var dataObj = [];
	$.each(liData, function(i, value) {
		dataObj.push({cm_gbncd: value.cm_gbncd, cm_seq: value.cm_seq});
	})
	
	var ajaxData = {
		requestType: "updateItemInfoStep",
		dataObj: dataObj
	}
	console.log(dataObj);
	ajaxAsync('/webPage/administrator/ChecklistReg', ajaxData, 'json', successUpdateItemInfoStep);
}

//노드 순서 변경 성공
function successUpdateItemInfoStep(data) {
	if(data === "OK") {		
		dialog.alert({
			msg: "정상적으로 적용되었습니다.",
			onStateChanged: function() {
				if(this.state === "close") {
					modal.close();
					getTree();					
				}
			}
		})
	} else {
		dialog.alert("적용에 실패하였습니다.")
		modal.close();
	}	
} 

//항목 추가 모달
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

//트리 펼치기
function spreadTree() {
	treeObj.expandAll(true);
}

//트리 접기
function foldTree() {	
	treeObj.expandAll(false);
}

//항목 삭제
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

//항목 삭제 성공
function successDelItemInfo(data) {
	if(data === "OK") {		
		dialog.alert("정상적으로 삭제되었습니다.")
		getTree();
	} else {
		dialog.alert("삭제에 실패하였습니다.")
	}
} 