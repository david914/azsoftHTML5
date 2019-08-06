var userid	= window.top.userId;
var selectedData = window.parent.popData;
var gbn = window.parent.popupGbn;

$(this).ready(function() {
	$('input:checkBox[name=checkEssential]').wCheck({theme: 'circle-radial blue', selector: 'checkmark', highlightLabel: true});
	
	$("#btnQry").bind('click', function() {
		submit();
	})
	
	$("#btnCancel").bind('click', function() {
		window.parent.modal.close();
	})
	
	if(gbn === "RENAME") {
		if(selectedData.cm_reqyn === "Y") {			
			$("#content").val(selectedData.name.substr(4));
		} else {
			$("#content").val(selectedData.name);			
		}
	}
})

function submit() {	
	if(gbn === "EQUAL" || gbn === "LOW") {
		newItemInfo();
	} else if(gbn === "RENAME") {
		updateItemInfo();
	}
}

function newItemInfo() {
	
	var dataObj = new Object();
	var ajaxData = new Object();
	dataObj.cm_uppgbncd = gbn === "EQUAL" ? selectedData.pId : selectedData.id;
	dataObj.cm_gbnname = $("#content").val();
	dataObj.cm_lstusr = userid;
	
	dataObj.cm_reqyn = $("#checkEssential").is(":checked") ? "Y" : "N";
	dataObj.cm_typecd = selectedData.cm_typecd;
	
	ajaxData = {
		dataObj : dataObj,
		requestType : "newItemInfo"
	}
	
	ajaxAsync('/webPage/administrator/ChecklistReg', ajaxData, 'json', successNewItemInfo);	
}

function successNewItemInfo(data) {
	if(data === "OK") {		
		dialog.alert({
			msg: "정상적으로 등록되었습니다.",
			onStateChanged: function() {
				if(this.state === "close") {
					window.parent.modal.close();
					window.parent.getTree();					
				}
			}
		})
	} else {
		dialog.alert("등록에 실패하였습니다.")
		window.parent.modal.close();
	}	
}

function updateItemInfo() {
	console.log(userid);
	
	var dataObj = new Object();
	var ajaxData = new Object();
	dataObj.cm_gbncd = selectedData.id;
	dataObj.cm_gbnname = $("#content").val();
	dataObj.cm_lstusr = userid;
	
	dataObj.cm_reqyn = $("#checkEssential").is(":checked") ? "Y" : "N";
	
	ajaxData = {
		dataObj : dataObj,		
		requestType : "updateItemInfo"
	}
	
	ajaxAsync('/webPage/administrator/ChecklistReg', ajaxData, 'json', successUpdateItemInfo);	
}

function successUpdateItemInfo(data) {
	if(data === "OK") {		
		window.parent.dialog.alert("정상적으로 수정되었습니다.")
		window.parent.modal.close();
		window.parent.getTree();
	} else {
		window.parent.dialog.alert("수정에 실패하였습니다.")
		window.parent.modal.close();
	}
}
