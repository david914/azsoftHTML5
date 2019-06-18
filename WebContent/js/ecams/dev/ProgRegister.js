var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;

var progGrid 		= new ax5.ui.grid();   //프로그램그리드

var selOptions 		= [];
var selectedIndex;		//select 선택 index
var selectedItem;		//select 선택 item
var gridSelectedIndex;  //그리드 선택 index
var selectedGridItem;	//그리드 선택 item

var selSystemData 	= null;	//시스템 데이터
var selJawonData	= null;	//프로그램종류 데이터
var selJobData		= null;	//업무 데이터
var selDirData		= null;	//프로그램경로 데이터
var selSRIDData		= null;	//SRID 데이터
var progGridData 	= null; //프로그램그리드 데이터

var selSw = false;

var tmpInfo = new Object();
var tmpInfoData = new Object();

progGrid.setConfig({
    target: $('[data-ax5grid="progGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: true,
    multipleSelect: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 24,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            progGrid_Click();
        },
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cr_isrid", 		label: "SR-ID",			width: '10%', 	align: "left"},
        {key: "cr_rsrcname", 	label: "프로그램명",	  	width: '17%',	align: "left"},
        {key: "cr_story", 	 	label: "프로그램설명",   	width: '14%',	align: "left"},
        {key: "cm_jobname", 	label: "업무",  			width: '13%',	align: "left"},
        {key: "jawon_code", 	label: "프로그램종류",  	width: '13%',	align: "left"},
        {key: "cm_dirpath", 	label: "프로그램경로",   	width: '24%',	align: "left"},
        {key: "cr_lastdate", 	label: "최종등록일",  		width: '13%',	align: "center"}
    ]
});

$(document).ready(function(){
	//SR조회 prjCall();
	tmpInfo = new Object();
	tmpInfo.userid = userId;
	tmpInfo.reqcd = "01";
	tmpInfo.secuyn = "Y";
	tmpInfo.qrygbn = "01";		
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETSRID'
	}
	ajaxAsync('/webPage/dev/ProgRegisterServlet', tmpInfoData, 'json', successSRID);
	
	//시스템조회 SysInfo.getSysInfo(strUserId,SecuYn,"","N","04");
	tmpInfo = new Object();
	tmpInfo.userId = userId;
	if(adminYN) {
		tmpInfo.secuYn = "N";
	}else {
		tmpInfo.secuYn = "Y";
	}
	tmpInfo.selMsg = "";
	tmpInfo.closeYn = "N";		
	tmpInfo.reqCd = "04";
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETSYSINFO'
	}
	ajaxAsync('/webPage/dev/ProgRegisterServlet', tmpInfoData, 'json', successSystem);
	
	//시스템
	$("#selSystem").bind('change', function() {
		selSystem_Change();
	});
	
	//업무
	$("#selJob").bind('change', function() {
		selJob_Change();
	});
	
	//프로그램종류
	$("#selJawon").bind('change', function() {
		selJawon_Change();
	});
	
	//등록
	$('#btnRegist').bind('click',function() {
		btnRegist_Click();
	});
	
	//조회
	$('#btnQry').bind('click',function() {
		btnQry_Click();
	});
	
	//삭제
	$('#btnDel').bind('click',function() {
		btnDel_Click();
	});
	
	//초기화
	$('#btnInit').bind('click',function() {
		btnInit_Click();
	});
	
	//개발영역연결등록
	$('#btnDevRep').bind('click',function() {
		btnDevRep_Click();
	});
});

function screenInit() {
	$('[data-ax5select="selJawon"]').ax5select({
        options: []
	});
	
	$('[data-ax5select="selJob"]').ax5select({
        options: []
	});
	
	progGrid.setData([]);
	$('#txtRsrcName').val("");
	$('#txtStory').val("");
	$('#btnDevRep').prop("disabled", true);
	$('#btnLocalRep').prop("disabled", true);
	$('[data-ax5select="selSRID"]').ax5select("disable");
} 

function successSRID(data) {
	selOptions = data;
	selSRIDData = [];
	
	if(selOptions.length > 0) {
		selSRIDData.push({value: "SR정보 선택 또는 해당없음", text: "SR정보 선택 또는 해당없음"});
	}
	
	$.each(selOptions,function(key,value) {
		selSRIDData.push({value: value.cc_srid, text: value.srid});
	});
	
	$('[data-ax5select="selSRID"]').ax5select({
        options: selSRIDData
	});
}

function successSystem(data) {
	selSystemData = data;
	selOptions = [];
	
	selSystemData = selSystemData.filter(function(data) {
		if(data.cm_sysinfo.substr(0,1) == "1") return false;
		else return true;
	});
	
	$.each(selSystemData,function(key,value) {
		selOptions.push({value: value.cm_syscd, text: value.cm_sysmsg, cm_sysinfo: value.cm_sysinfo});
	});
	
	$('[data-ax5select="selSystem"]').ax5select({
        options: selOptions
	});
	
	if(selSystemData.length > 0) {
		for(var i=0; i<selSystemData.length; i++) {
			if(selSystemData[i].setyn == "Y") {
				$('[data-ax5select="selSystem"]').ax5select('setValue',selSystemData[i].cm_syscd,true); //value값으로
				break;
			}
		}
		
		if(i>=selSystemData.length) {
			$('[data-ax5select="selSystem"]').ax5select('setValue',selSystemData[0].cm_syscd,true); //value값으로
		}
		
		selSystem_Change();
	}
}

function selSystem_Change() {
	screenInit();
	
	selectedIndex = $("#selSystem option").index($("#selSystem option:selected"));
	selectedItem = $('[data-ax5select="selSystem"]').ax5select("getValue")[0];
	
	if(selectedIndex < 0) return;
	
	for(var i=0; i<selSystemData.length; i++) {
		if(selSystemData[i].cm_syscd == selectedItem.value) {
			selectedItem = selSystemData[i];
			break;
		}
	}
	
	if(selectedItem.cm_sysinfo.substr(9,1) == "1") {
		$('[data-ax5select="selSRID"]').ax5select("disable");
		if(selSRIDData.length > 0) {
			$('[data-ax5select="selSRID"]').ax5select('setValue',selSRIDData[0].value,true); //value값으로
		}
	}else {
		$('[data-ax5select="selSRID"]').ax5select("enable");
	}
	
	if(selectedIndex > -1) {
		tmpInfo = new Object();
		tmpInfo.userId = userId;
		tmpInfo.sysCd = selectedItem.cm_syscd;
		tmpInfo.secuYn = "Y";
		tmpInfo.closeYn = "N";
		tmpInfo.selMsg = "SEL";
		tmpInfo.sortCd = "NAME";
		
		tmpInfoData = new Object();
		tmpInfoData = {
			tmpInfo		: tmpInfo,
			requestType	: 'GETJOBINFO'
		}
		ajaxAsync('/webPage/dev/ProgRegisterServlet', tmpInfoData, 'json', successJob);
	}
	
	if(selectedItem.cm_sysinfo.substr(6,1) == "1") {
		if(selectedItem.localyn == "A" || selectedItem.localyn == "S" || selectedItem.localyn == "X") {
			$('#btnDevRep').prop("disabled", false);
		}
		
		if(selectedItem.localyn == "A" || selectedItem.localyn == "L") {
			$('#btnLocalRep').prop("disabled", false);
		}
	}
}

function successJob(data) {
	selOptions = data;
	selJobData = [];
	
	$.each(selOptions,function(key,value) {
		selJobData.push({value: value.cm_jobcd, text: value.cm_jobname});
	});
	
	$('[data-ax5select="selJob"]').ax5select({
        options: selJobData
	});
	
	if(selJobData.length > 0) {
		selectedIndex = $("#selSystem option").index($("#selSystem option:selected"));
		selectedItem = $('[data-ax5select="selSystem"]').ax5select("getValue")[0];
		
		tmpInfo = new Object();
		tmpInfo.sysCd = selectedItem.value;
		tmpInfo.selMsg = "SEL";
		
		tmpInfoData = new Object();
		tmpInfoData = {
			tmpInfo		: tmpInfo,
			requestType	: 'GETJAWON'
		}
		ajaxAsync('/webPage/dev/ProgRegisterServlet', tmpInfoData, 'json', successJawon);
	}
}

function successJawon(data) {
	selJawonData = data;
	selOptions = [];
	
	$.each(selJawonData,function(key,value) {
		selOptions.push({value: value.cm_micode, text: value.cm_codename, cm_info: value.cm_info});
	});
	
	$('[data-ax5select="selJawon"]').ax5select({
        options: selOptions
	});
	
	selJawon_Change();
}

function selJawon_Change() {
	selectedIndex = $("#selJawon option").index($("#selJawon option:selected"));
	selectedItem = $('[data-ax5select="selJawon"]').ax5select("getValue")[0];
	
	for(var i=0; i<selJawonData.length; i++) {
		if(selJawonData[i].cm_micode == selectedItem.value) {
			selectedItem = selJawonData[i];
			break;
		}
	}
	
	if(selectedIndex > 0) {
		$('#txtExeName').val(selectedItem.cm_exename);
		
		if($('#txtExeName').val().length > 1) {
			if($('#txtExeName').val().substr($('#txtExeName').val().length-1, 1) == ",") {
				$('#txtExeName').val($('#txtExeName').val().substring(0, $('#txtExeName').val().length-1));
			}
		}
		
		$('[data-ax5select="selDir"]').ax5select("enable");
		
		if($("#selJob option").index($("#selJob option:selected")) > 0) {
			Dircheck($("#selJob option:selected").val(), $("#selJawon option:selected").val());
		}
	}else {
		$('[data-ax5select="selDir"]').ax5select({
	        options: []
		});
		$('#txtExeName').val("확장자표시");
	}
}

function selJob_Change() {
	if($("#selJob option").index($("#selJob option:selected")) < 1) return;
	
	if($("#selJawon option").index($("#selJawon option:selected")) > 0) {
		Dircheck($("#selJob option:selected").val(), $("#selJawon option:selected").val());
	}
}

function Dircheck(jobcd, rsrccd) {
	tmpInfo = new Object();
	tmpInfo.userId = userId;
	tmpInfo.sysCd  = $("#selSystem option:selected").val();
	tmpInfo.secuYn = "Y";
	tmpInfo.rsrccd = rsrccd;
	tmpInfo.jobcd  = jobcd;
	tmpInfo.selMsg = "";
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETDIR'
	}
	ajaxAsync('/webPage/dev/ProgRegisterServlet', tmpInfoData, 'json', successDir);
}

function successDir(data) {
	selOptions = data;
	selDirData = [];
	
	$.each(selOptions,function(key,value) {
		selDirData.push({value: value.cm_dsncd, text: value.cm_dirpath});
	});
	
	$('[data-ax5select="selDir"]').ax5select({
        options: selDirData
	});
	
	gridSelectedIndex = progGrid.selectedDataIndexs;
	selectedGridItem = progGrid.list[progGrid.selectedDataIndexs];
	
	if(selSw) {
		if(gridSelectedIndex > 0) {
			for(var i=0; i<selDirData.length; i++) {
				if(selectedGridItem.cr_dsncd == selDirData[i].cm_dsncd) {
					$('[data-ax5select="selDir"]').ax5select('setValue',selectedGridItem[i].value,true);
					break;
				}
			}
		}
	}
}

function btnQry_Click() {
	if($("#selSystem option").index($("#selSystem option:selected")) < 0) {
		dialog.alert('시스템을 선택하여 주십시오.',function(){});
		$('#selSystem').focus();
		return;
	}
	
	var strJawon = null;
	var strSRId = null;
	var strRsrcname = null;
	
	$('#txtRsrcName').val($('#txtRsrcName').val().trim());
	if($('#txtRsrcName').val().length > 0) {
		strRsrcname = $('#txtRsrcName').val();
	}else {
		strRsrcname = null;
	}
	
	if($("#selJawon option").index($("#selJawon option:selected")) > 0) {
		strJawon = $("#selJawon option:selected").val();
	}

	if(!$($('#selSRID').children()[0]).prop('disabled') && $("#selSRID option").index($("#selSRID option:selected")) > 0) {
		strSRId = $("#selSRID option:selected").val();
	}else {
		strSRId = null;	
	}
	
	tmpInfo = new Object();
	tmpInfo.SRID = strSRId;
	tmpInfo.userId = userId;
	tmpInfo.sysCd  = $("#selSystem option:selected").val();
	tmpInfo.rsrccd = strJawon;
	tmpInfo.rsrcname = strRsrcname;
	tmpInfo.secuSw = "true";
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETPROGLIST'
	}
	ajaxAsync('/webPage/dev/ProgRegisterServlet', tmpInfoData, 'json', successProgList);
}

function successProgList(data) {
	progGridData = data;
	progGrid.setData(progGridData);
	
	progGrid.setColumnSort({cr_rsrcname:{seq:0, orderBy:"asc"}});
}

function progGrid_Click() {
	gridSelectedIndex = progGrid.selectedDataIndexs;
	selectedGridItem = progGrid.list[progGrid.selectedDataIndexs];
	
	var i = 0;
	var strJob = null;
	var strInfo = null;
	
	selSw = true;
	
	if(selectedGridItem != null && selectedGridItem.cr_rsrcname != "") {
		$('#txtRsrcName').val(selectedGridItem.cr_rsrcname);
		$('#txtStory').val(selectedGridItem.cr_story);
		$('[data-ax5select="selDir"]').ax5select({
	        options: []
		});
		strInfo = selectedGridItem.cr_jobcd;
		
		for(i=0; i<selJobData.length; i++) {
			if(selJobData[i].value == selectedGridItem.cr_jobcd) {
				$('[data-ax5select="selJob"]').ax5select('setValue',selJobData[i].value,true);
				selJob_Change();
				break;
			}
		}
		
		for(i=1; i<selJawonData.length; i++) {
			if(selJawonData[i].cm_micode == selectedGridItem.cr_rsrccd) {
				$('[data-ax5select="selJawon"]').ax5select('setValue',selJawonData[i].cm_micode,true);
				selectedItem = selJawonData[i];
				strInfo = selectedItem.cm_info;
				selJawon_Change();
				break;
			}
		}
		
		if(selectedGridItem.cr_isrid != null && selectedGridItem.cr_isrid != "" && selSRIDData.length > 0) {
			for(i=1; i<selSRIDData.length; i++) {
				if(selSRIDData[i].value == selectedGridItem.cr_isrid) {
					$('[data-ax5select="selSRID"]').ax5select('setValue',selSRIDData[i].value,true);
					break;
				}
			}
		}else if(selSRIDData.length > 0) {
			$('[data-ax5select="selSRID"]').ax5select('setValue',selSRIDData[0].value,true);
		}
	}else {
		$('#txtRsrcName').val("");
		$('#txtStory').val("");
	}
}

function btnInit_Click() {
	$('[data-ax5select="selJawon"]').ax5select('setValue',selJawonData[0].cm_micode,true);
	selJawon_Change();
	
	$('[data-ax5select="selJob"]').ax5select('setValue',selJobData[0].value,true);
	selJob_Change();
	
	$('#txtRsrcName').val("");
	$('#txtStory').val("");
	
	$('[data-ax5select="selSRID"]').ax5select('setValue',selSRIDData[0].value,true);
}

function btnRegist_Click() {
	if($("#selSystem option").index($("#selSystem option:selected")) < 0) {
		dialog.alert('시스템을 선택하여 주십시오.',function(){});
		$('#selSystem').focus();
		return;
	}
	
	if($('[data-ax5select="selSystem"]').ax5select("getValue")[0].cm_sysinfo.substr(9,1) == "0") {
		if($("#selSRID option").index($("#selSRID option:selected")) < 0) {
			dialog.alert('SR-ID를 선택하여 주십시오.',function(){});
			$('#selSRID').focus();
			return;
		}
	}
	
	if(selDirData == null || selDirData.length == 0 || $("#selDir option").index($("#selDir option:selected")) < 0) {
		dialog.alert('경로를 선택하여 주십시오.',function(){});
		$('#selDir').focus();
		return;
	}
	
	if($("#selJawon option").index($("#selJawon option:selected")) < 0) {
		dialog.alert('프로그램종류를 선택하여 주십시오.',function(){});
		$('#selJawon').focus();
		return;
	}
	
	if($("#selJob option").index($("#selJob option:selected")) < 0) {
		dialog.alert('업무를 선택하여 주십시오.',function(){});
		$('#selJob').focus();
		return;
	}
	
	$('#txtRsrcName').val($('#txtRsrcName').val().trim());
	if($('#txtRsrcName').val().length < 1) {
		dialog.alert('프로그램명를 입력하여 주십시오.',function(){});
		return;
	}
	
	if($('#txtRsrcName').val().indexOf(",") >= 0) {
		dialog.alert('프로그램명에 컴마(,)가 포함되었습니다. 제외하고 등록하여 주십시오.',function(){});
		return;
	}
	
	if($('#txtStory').val().length < 1) {
		dialog.alert('프로그램설명을 입력하여 주십시오.',function(){});
		$('#txtStory').focus();
		return;
	}
	
	if($('[data-ax5select="selJawon"]').ax5select("getValue")[0].cm_info.substr(26,1) == "1") {
		if($('#txtRsrcName').val().indexOf(".") > 0) {
			dialog.alert('확장자없이 신규하여야 합니다.',function(){});
			return;
		}
	}else {
		if($('#txtExeName').val() != "" && $('#txtExeName').val() != null) {
			if($('[data-ax5select="selJawon"]').ax5select("getValue")[0].cm_info.substr(43,1) == "1") { //[44]확장자자동등록
				var strExe = $('#txtExeName').val();
				if(strExe.substr(strExe.length-1) == ",") strExe = strExe.substr(0,strExe.length-1);
				if($('#txtRsrcName').val().substr($('#txtRsrcName').val().length - strExe.length) != strExe) {
					if($('#txtRsrcName').val().indexOf(".") > 0) {
						dialog.alert('확장자를 정확하게 입력하여 주십시오.[1][' + strExe + ']',function(){});
						return;
					}
					$('#txtRsrcName').val($('#txtRsrcName').val() + strExe);
				}
			}else if($('#txtRsrcName').val().indexOf(".") > 0) {
				var strWork1 = $('#txtRsrcName').val().substr($('#txtRsrcName').val().lastIndexOf(".")) + ",";
				var strWork2 = $('#txtExeName').val().toUpperCase() + ",";
				
				strWork1 = strWork1.toUpperCase();
				
				if(strWork2.indexOf(strWork1) < 0) {
					dialog.alert('확장자를 정확하게 입력하여 주십시오.[2][' + $('#txtExeName').val() + ']',function(){});
					return;
				}
			}else {
				dialog.alert('확장자를 정확하게 입력하여 주십시오.[3][' + $('#txtExeName').val() + ']',function(){});
				return;
			}
		}
	}
	
	tmpInfo = new Object();
	tmpInfo.userid = userId;
	tmpInfo.syscd = $("#selSystem option:selected").val();
	tmpInfo.dsncd  = $("#selDir option:selected").val();
	tmpInfo.rsrcname = $('#txtRsrcName').val();
	tmpInfo.rsrccd = $("#selJawon option:selected").val();
	tmpInfo.jobcd = $("#selJob option:selected").val();
	tmpInfo.story = $('#txtStory').val().trim();
	tmpInfo.dirpath = $('[data-ax5select="selDir"]').ax5select("getValue")[0].text;
	tmpInfo.cminfo = $('[data-ax5select="selJawon"]').ax5select("getValue")[0].cm_info;
	
	if ($('[data-ax5select="selSystem"]').ax5select("getValue")[0].cm_sysinfo.substr(9,1) == "0") {
		if(!$($('#selSRID').children()[0]).prop('disabled') && $("#selSRID option").index($("#selSRID option:selected")) > 0) {
			tmpInfo.srid = $('[data-ax5select="selSRID"]').ax5select("getValue")[0].value;
		}
	}
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'CHECKPROG'
	}
	ajaxAsync('/webPage/dev/ProgRegisterServlet', tmpInfoData, 'json', successCheckProg);
}

function successCheckProg(data) {
	var tmpArr = data;
	var tmpObj = [];

	if(tmpArr[0].ID.substr(0,4) == "FAIL") {
		dialog.alert(tmpArr[0].ID.substring(4),function(){});
		return;
	}else {
		if(tmpArr.length > 0 && tmpArr[0].ID == "ADD") {
			dialog.alert('등록처리가 완료되었습니다.',function(){});
			
			if(progGridData != null) {
				for(var i=0; i<progGrid.getList().length; i++) {
					if(progGrid.getList()[i].cr_itemid == tmpArr[0].cr_itemid) {
						progGrid.removeRow(i);
						break;
					}
				}
			}
			
			tmpObj = tmpArr[0];
			progGrid.addRow(tmpObj, 0);
			progGrid.setColumnSort({cr_rsrcname:{seq:0, orderBy:"asc"}});
		}else {
			dialog.alert(tmpArr[0].ID,function(){});
		}	
	}
}

function btnDel_Click() {
	confirmDialog.confirm({
		msg: '선택된 프로그램을 정말로 삭제하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			var findSW = false;
			var i = 0;
			var checkedGridItem = progGrid.getList("selected");
			
			if($("#selSystem option").index($("#selSystem option:selected")) < 0) {
				dialog.alert('시스템을 선택하여 주십시오.',function(){});
				return;
			}
			
			if(checkedGridItem.length > 0) {
				findSW = true;
			}
			
			if(!findSW) {
				dialog.alert('선택된 목록이 없습니다. 목록에서 삭제 할 대상을 선택한 후 처리하십시오.',function(){});
				return;
			}
			
			tmpInfoData = new Object();
			tmpInfoData = {
				userId		: userId,
				ProgList	: checkedGridItem,
				requestType	: 'DELETEPROG'
			}
			ajaxAsync('/webPage/dev/ProgRegisterServlet', tmpInfoData, 'json', successDELETE);
		}
	});
}

function successDELETE(data) {
	if(data == "0") {
		dialog.alert('삭제처리가 완료되었습니다.',function(){});
		progGrid.removeRow("selected");
	}else {
		dialog.alert('삭제처리가 실패되었습니다.',function(){});
	}
}

function btnDevRep_Click() {
	if($("#selSystem option").index($("#selSystem option:selected")) < 0) {
		dialog.alert('시스템을 선택하여 주십시오.',function(){});
		$('#selSystem').focus();
		return;
	}
	
	//ExternalInterface.call("winopen",strUserId,"D02",cboSys.selectedItem.cm_syscd,"");
	//winopen(UserId,ReqCD,ReqNo,RsrcName)
	
	var nHeight, nWidth, nTop, nLeft, cURL, cFeatures;
	
	nHeight   = screen.height - 200;
    nWidth    = screen.width - 200;
    nTop 	  = parseInt((window.screen.availHeight/2) - (nHeight/2));
	nLeft	  = parseInt((window.screen.availWidth/2) - (nWidth/2));
    cURL 	  = "DevRepProgRegister.jsp";
    cFeatures = "top=" + nTop + ",left=" + nLeft + ",height=" + nHeight + ",width=" + nWidth + ",help=no,menubar=no,status=yes,resizable=yes,scroll=no";
	
	var form = document.form;
    var win = window.open('', "D02", cFeatures);
    form.UserId.value = userId;
    form.SysCd.value = $("#selSystem option:selected").val();
    form.action = cURL;
    form.target = "D02";
    form.method = "post";
    form.submit();
    //win.focus();
}