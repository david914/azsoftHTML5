/**
 * 권한관리 화면 기능 정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-20
 * 
 */

var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드

var treeObj			= null;
var treeObjData		= null;

var cboDutyData		= null;
var dutyUlInfoData	= null;


var setting = {
	check: {
		enable: true
	},
	data: {
		simpleData: {
			enable: true
		}
	}
};

$('input.checkbox-rgt').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

$(document).ready(function(){
	getMenuTree();
	getCodeInfo();
	
	// 직무구분 cbo 변경 이벤트
	$('#cboDuty').bind('change', function() {
		var data = new Object();
		data = {
			rgtcd 		: getSelectedVal('cboDuty').cm_micode,
			requestType	: 	'getRgtMenuList'
		}
		ajaxAsync('/webPage/administrator/RgtManageServlet', data, 'json',successGetRgtMenuList);
	});
	
	$('#chkAll').bind('click', function() {
		var checkSw = $('#chkAll').is(':checked');
		dutyUlInfoData.forEach(function(item, index) {
			addId = item.cm_micode;
			if(checkSw) {
				$('#chkDuty'+addId).wCheck('check', true);
			} else {
				$('#chkDuty'+addId).wCheck('check', false);
			}
		});
	});
	
	// 트리 전체 열기(펼치기)
	$('#btnPlus').bind('click', function() {
		treeObj.expandAll(true);
	});
	
	// 트리 전체 닫기
	$('#btnMinus').bind('click', function() {
		treeObj.expandAll(false);
	});
	
	// 처리속성 등록
	$('#btnReq').bind('click', function() {
		var addId = null;
		var dutyList = [];
		var menuList = [];
		dutyUlInfoData.forEach(function(item, index) {
			addId = item.cm_micode;
			if($('#chkDuty'+addId).is(':checked')) {
				dutyList.push(item);
			}
		});
		
		if(dutyList.length === 0 ) {
			dialog.alert('권한을 부여할 직무를 선택한 후 등록하십시오.',function(){});
			return;
		}
		
		
		var checkedNodes= treeObj.getCheckedNodes(true);
		if(checkedNodes.length === 0) {
			dialog.alert('부여할 메뉴를 선택한 후 등록하십시오.',function(){});
			return;
		}
		
		checkedNodes.forEach(function(item, index) {
			/*if(!item.isParent) {
				menuList.push(item);
			}*/
			if(item.pId  !== null) {
				var tmpItem = null;
				if(item.isParent) {
					tmpItem = new Object();
					tmpItem.cm_menucd = item.cm_menucd;
					menuList.push(tmpItem);
					tmpItem = null;
				} else {
					menuList.push(item);
				}
				
			}
		})
		console.log(menuList);
		var data = new Object();
		data = {
			Lst_Duty 	: dutyList,
			treeMenu 	: menuList,
			requestType	: 	'setRgtMenuList'
		}
		ajaxAsync('/webPage/administrator/RgtManageServlet', data, 'json',successSetRgtMenuList);
		
	});
});

// 적용 완료
function successSetRgtMenuList(data) {
	dialog.alert('적용되었습니다.', function(){});
}

// 직무구분 선택시 메뉴가져와서 세팅
function successGetRgtMenuList(data) {
	treeObj.checkAllNodes(false);
	data.forEach(function(item, index) {
		var node = treeObj.getNodeByParam('id', item.cm_menucd);
		if(node !== null && !node.isParent) {
			treeObj.selectNode(node);
			treeObj.checkNode(node, true, true);
		}
	});
}

// 직무구분 cbo 가져오기 / 직무구분 ul 가져오기
function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('RGTCD','SEL','N')
		]);
	cboDutyData 	= codeInfos.RGTCD;
	dutyUlInfoData 	= codeInfos.RGTCD;
	
	$('[data-ax5select="cboDuty"]').ax5select({
        options: injectCboDataToArr(cboDutyData, 'cm_micode' , 'cm_codename')
	});
	makeDutyUlList();
}

// 메뉴트리 정보 가져오기
function getMenuTree() {
	var data = new Object();
	data = {
		requestType	: 	'getMenuTree'
	}
	ajaxAsync('/webPage/administrator/RgtManageServlet', data, 'json',successGetMenuTree);
}

// 메뉴트리 정보 가져오기 완료
function successGetMenuTree(data) {
	treeObjData = data;
	$.fn.zTree.init($("#tvMenu"), setting, data);
	treeObj = $.fn.zTree.getZTreeObj("tvMenu");
}


//시스템 속성 ul 만들어주기
function makeDutyUlList() {
	$('#dutyUlInfo').empty();
	var liStr = null;
	var addId = null;
	dutyUlInfoData.forEach(function(item, index) {
		addId = item.cm_micode;
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '<div class="maring-3-top" style="padding: 5px 0;">';
		liStr += '	<input type="checkbox" class="checkbox-duty" id="chkDuty'+addId+'" data-label="'+item.cm_codename+'"  value="'+addId+'" />';
		liStr += '</div>';
		liStr += '</li>';
		$('#dutyUlInfo').append(liStr);
	});
	
	$('input.checkbox-duty').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
}

