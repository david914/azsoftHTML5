var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;

var grdProgList 		= new ax5.ui.grid();   //프로그램그리드

var selOptions 		= [];
var selectedIndex;		//select 선택 index
var selectedItem;		//select 선택 item
var gridSelectedIndex;  //그리드 선택 index
var selectedGridItem;	//그리드 선택 item

var cboSystemData 	= null;	//시스템 데이터
var cboJawonData	= null;	//프로그램종류 데이터
var cboJobData		= null;	//업무 데이터
var cboDirData		= null;	//프로그램경로 데이터
var cboSRIDData		= null;	//SRID 데이터
var grdProgListData = null; //프로그램그리드 데이터

var winDevRep 		= null; //개발영역연결등록 새창

var selSw = false;

var tmpInfo = new Object();
var tmpInfoData = new Object();

grdProgList.setConfig({
    target: $('[data-ax5grid="grdProgList"]'),
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
            grdProgList_Click();
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
	getSRID();
	getSysInfo();
	
	//시스템
	$("#cboSystem").bind('change', function() {
		cboSystem_Change();
	});
	
	//업무
	$("#cboJob").bind('change', function() {
		cboJob_Change();
	});
	
	//프로그램종류
	$("#cboJawon").bind('change', function() {
		cboJawon_Change();
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
	$('[data-ax5select="cboJawon"]').ax5select({
        options: []
	});
	
	$('[data-ax5select="cboJob"]').ax5select({
        options: []
	});
	
	grdProgList.setData([]);
	$('#txtRsrcName').val("");
	$('#txtStory').val("");
	$('#btnDevRep').prop("disabled", true);
	//$('#btnLocalRep').prop("disabled", true);
	if(cboSRIDData != null) $('[data-ax5select="cboSRID"]').ax5select("disable");
} 

//SR조회 prjCall();
function getSRID() {
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
}

function successSRID(data) {
	selOptions = data;
	cboSRIDData = [];
	
	if(selOptions.length > 0) {
		cboSRIDData.push({value: "SR정보 선택 또는 해당없음", text: "SR정보 선택 또는 해당없음"});
	}
	
	$.each(selOptions,function(key,value) {
		cboSRIDData.push({value: value.cc_srid, text: value.srid});
	});
	
	$('[data-ax5select="cboSRID"]').ax5select({
        options: cboSRIDData
	});
}

//시스템조회 SysInfo.getSysInfo(strUserId,SecuYn,"","N","04");
function getSysInfo() {
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
}

function successSystem(data) {
	cboSystemData = data;
	
	cboSystemData = cboSystemData.filter(function(data) {
		if(data.cm_sysinfo.substr(0,1) == "1") return false;
		else return true;
	});
	
	$('[data-ax5select="cboSystem"]').ax5select({
		options: injectCboDataToArr(cboSystemData, 'cm_syscd' , 'cm_sysmsg')
	});

	if(cboSystemData.length > 0) {
		for(var i=0; i<cboSystemData.length; i++) {
			if(cboSystemData[i].setyn == "Y") {
				$('[data-ax5select="cboSystem"]').ax5select('setValue',cboSystemData[i].cm_syscd,true); //value값으로
				break;
			}
		}
		
		if(i>=cboSystemData.length) {
			$('[data-ax5select="cboSystem"]').ax5select('setValue',cboSystemData[0].cm_syscd,true); //value값으로
		}
		
		cboSystem_Change();
	}
}

function cboSystem_Change() {
	screenInit();
	
	selectedIndex = getSelectedIndex('cboSystem');
	selectedItem = getSelectedVal('cboSystem');
	
	if(selectedIndex < 0) return;
	
	if(selectedItem.cm_sysinfo.substr(9,1) == "1") {
		$('[data-ax5select="cboSRID"]').ax5select("disable");
		if(cboSRIDData.length > 0) {
			$('[data-ax5select="cboSRID"]').ax5select('setValue',cboSRIDData[0].value,true); //value값으로
		}
	}else {
		if(cboSRIDData != null) $('[data-ax5select="cboSRID"]').ax5select("enable");
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
		//A: ALL, S:SERVER, L:LOCAL
		//if(selectedItem.localyn == "A" || selectedItem.localyn == "S" || selectedItem.localyn == "X") {
			$('#btnDevRep').prop("disabled", false);
		//}
		
		//if(selectedItem.localyn == "A" || selectedItem.localyn == "L") {
			//$('#btnLocalRep').prop("disabled", false);
		//}
	}
}

function successJob(data) {
	selOptions = data;
	cboJobData = [];
	
	$.each(selOptions,function(key,value) {
		cboJobData.push({value: value.cm_jobcd, text: value.cm_jobname});
	});
	
	$('[data-ax5select="cboJob"]').ax5select({
        options: cboJobData
	});
	
	if(cboJobData.length > 0) {
		selectedIndex = getSelectedIndex('cboSystem');
		selectedItem = getSelectedVal('cboSystem');	
		
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
	cboJawonData = data;
	
	$('[data-ax5select="cboJawon"]').ax5select({
        options: injectCboDataToArr(cboJawonData, 'cm_micode' , 'cm_codename')
	});
	
	cboJawon_Change();
}

function cboJawon_Change() {
	selectedIndex = getSelectedIndex('cboJawon');
	selectedItem = getSelectedVal('cboJawon');
	
	if(selectedIndex > 0) {
		$('#txtExeName').val(selectedItem.cm_exename);
		
		if($('#txtExeName').val().length > 1) {
			if($('#txtExeName').val().substr($('#txtExeName').val().length-1, 1) == ",") {
				$('#txtExeName').val($('#txtExeName').val().substring(0, $('#txtExeName').val().length-1));
			}
		}
		
		$('[data-ax5select="cboDir"]').ax5select("enable");
		
		if(getSelectedIndex('cboJob') > 0) {
			Dircheck(getSelectedVal('cboJob').value, getSelectedVal('cboJawon').value);
		}
	}else {
		$('[data-ax5select="cboDir"]').ax5select({
	        options: []
		});
		$('#txtExeName').val("확장자표시");
	}
}

function cboJob_Change() {
	if(getSelectedIndex('cboJob') < 1) return;
	
	if(getSelectedIndex('cboJawon') > 0) {
		Dircheck(getSelectedVal('cboJob').value, getSelectedVal('cboJawon').value);
	}
}

function Dircheck(jobcd, rsrccd) {
	tmpInfo = new Object();
	tmpInfo.userId = userId;
	tmpInfo.sysCd  = getSelectedVal('cboSystem').value;
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
	cboDirData = [];
	
	$.each(selOptions,function(key,value) {
		cboDirData.push({value: value.cm_dsncd, text: value.cm_dirpath});
	});
	
	$('[data-ax5select="cboDir"]').ax5select({
        options: cboDirData
	});
	
	gridSelectedIndex = grdProgList.selectedDataIndexs;
	selectedGridItem = grdProgList.list[grdProgList.selectedDataIndexs];
	
	if(selSw) {
		if(gridSelectedIndex > 0) {
			for(var i=0; i<cboDirData.length; i++) {
				if(selectedGridItem.cr_dsncd == cboDirData[i].cm_dsncd) {
					$('[data-ax5select="cboDir"]').ax5select('setValue',selectedGridItem[i].value,true);
					break;
				}
			}
		}
	}
}

function btnQry_Click() {
	if(getSelectedIndex('cboSystem') < 0) {
		dialog.alert('시스템을 선택하여 주십시오.',function(){});
		$('#cboSystem').focus();
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
	
	if(getSelectedIndex('cboJawon') > 0) {
		strJawon = getSelectedVal('cboJawon').value;
	}

	if(!$($('#cboSRID').children()[0]).prop('disabled') && getSelectedIndex('cboSRID') > 0) {
		strSRId = getSelectedVal('cboSRID').value;
	}else {
		strSRId = null;	
	}
	
	tmpInfo = new Object();
	tmpInfo.SRID = strSRId;
	tmpInfo.userId = userId;
	tmpInfo.sysCd  = getSelectedVal('cboSystem').value;
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
	grdProgListData = data;
	grdProgList.setData(grdProgListData);
	
	grdProgList.setColumnSort({cr_rsrcname:{seq:0, orderBy:"asc"}});
}

function grdProgList_Click() {
	gridSelectedIndex = grdProgList.selectedDataIndexs;
	selectedGridItem = grdProgList.list[grdProgList.selectedDataIndexs];
	
	var i = 0;
	var strJob = null;
	var strInfo = null;
	
	selSw = true;
	
	if(selectedGridItem != null && selectedGridItem.cr_rsrcname != "") {
		$('#txtRsrcName').val(selectedGridItem.cr_rsrcname);
		$('#txtStory').val(selectedGridItem.cr_story);
		$('[data-ax5select="cboDir"]').ax5select({
	        options: []
		});
		strInfo = selectedGridItem.cr_jobcd;
		
		for(i=0; i<cboJobData.length; i++) {
			if(cboJobData[i].value == selectedGridItem.cr_jobcd) {
				$('[data-ax5select="cboJob"]').ax5select('setValue',cboJobData[i].value,true);
				cboJob_Change();
				break;
			}
		}
		
		for(i=1; i<cboJawonData.length; i++) {
			if(cboJawonData[i].cm_micode == selectedGridItem.cr_rsrccd) {
				$('[data-ax5select="cboJawon"]').ax5select('setValue',cboJawonData[i].cm_micode,true);
				selectedItem = cboJawonData[i];
				strInfo = selectedItem.cm_info;
				cboJawon_Change();
				break;
			}
		}
		
		if(selectedGridItem.cr_isrid != null && selectedGridItem.cr_isrid != "" && cboSRIDData.length > 0) {
			for(i=1; i<cboSRIDData.length; i++) {
				if(cboSRIDData[i].value == selectedGridItem.cr_isrid) {
					$('[data-ax5select="cboSRID"]').ax5select('setValue',cboSRIDData[i].value,true);
					break;
				}
			}
		}else if(cboSRIDData.length > 0) {
			$('[data-ax5select="cboSRID"]').ax5select('setValue',cboSRIDData[0].value,true);
		}
	}else {
		$('#txtRsrcName').val("");
		$('#txtStory').val("");
	}
}

function btnInit_Click() {
	$('[data-ax5select="cboJawon"]').ax5select('setValue',cboJawonData[0].cm_micode,true);
	cboJawon_Change();
	
	$('[data-ax5select="cboJob"]').ax5select('setValue',cboJobData[0].value,true);
	cboJob_Change();
	
	$('#txtRsrcName').val("");
	$('#txtStory').val("");
	
	$('[data-ax5select="cboSRID"]').ax5select('setValue',cboSRIDData[0].value,true);
}

function btnRegist_Click() {
	if(getSelectedIndex('cboSystem') < 0) {
		dialog.alert('시스템을 선택하여 주십시오.',function(){});
		$('#cboSystem').focus();
		return;
	}
	
	if(getSelectedVal('cboSystem').cm_sysinfo.substr(9,1) == "0") {
		if(getSelectedIndex('cboSRID') < 0) {
			dialog.alert('SR-ID를 선택하여 주십시오.',function(){});
			$('#cboSRID').focus();
			return;
		}
	}
	
	if(cboDirData == null || cboDirData.length == 0 || getSelectedIndex('cboDir') < 0) {
		dialog.alert('경로를 선택하여 주십시오.',function(){});
		$('#cboDir').focus();
		return;
	}
	
	if(getSelectedIndex('cboJawon') < 0) {
		dialog.alert('프로그램종류를 선택하여 주십시오.',function(){});
		$('#cboJawon').focus();
		return;
	}
	
	if(getSelectedIndex('cboJob') < 0) {
		dialog.alert('업무를 선택하여 주십시오.',function(){});
		$('#cboJob').focus();
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
	
	if(getSelectedVal('cboJawon').cm_info.substr(26,1) == "1") {
		if($('#txtRsrcName').val().indexOf(".") > 0) {
			dialog.alert('확장자없이 신규하여야 합니다.',function(){});
			return;
		}
	}else {
		if($('#txtExeName').val() != "" && $('#txtExeName').val() != null) {
			if(getSelectedVal('cboJawon').cm_info.substr(43,1) == "1") { //[44]확장자자동등록
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
	tmpInfo.syscd = getSelectedVal('cboSystem').value;
	tmpInfo.dsncd  = getSelectedVal('cboDir').value;
	tmpInfo.rsrcname = $('#txtRsrcName').val();
	tmpInfo.rsrccd = getSelectedVal('cboJawon').value;
	tmpInfo.jobcd = getSelectedVal('cboJob').value;
	tmpInfo.story = $('#txtStory').val().trim();
	tmpInfo.dirpath = getSelectedVal('cboDir').text;
	tmpInfo.cminfo = getSelectedVal('cboJawon').cm_info;
	
	if (getSelectedVal('cboSystem').cm_sysinfo.substr(9,1) == "0") {
		if(!$($('#cboSRID').children()[0]).prop('disabled') && getSelectedIndex('cboSRID') > 0) {
			tmpInfo.srid = getSelectedVal('cboSRID').value;
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
			
			if(grdProgListData != null) {
				for(var i=0; i<grdProgList.getList().length; i++) {
					if(grdProgList.getList()[i].cr_itemid == tmpArr[0].cr_itemid) {
						grdProgList.removeRow(i);
						break;
					}
				}
			}
			
			tmpObj = tmpArr[0];
			grdProgList.addRow(tmpObj, 0);
			grdProgList.setColumnSort({cr_rsrcname:{seq:0, orderBy:"asc"}});
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
			var checkedGridItem = grdProgList.getList("selected");
			
			if(getSelectedIndex('cboSystem') < 0) {
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
		grdProgList.removeRow("selected");
	}else {
		dialog.alert('삭제처리가 실패되었습니다.',function(){});
	}
}

function btnDevRep_Click() {
	if(getSelectedIndex('cboSystem') < 0) {
		dialog.alert('시스템을 선택하여 주십시오.',function(){});
		$('#cboSystem').focus();
		return;
	}
	
	var nHeight, nWidth;
	if(winDevRep != null
			&& !winDevRep.closed) {
		winDevRep.close();
	}	
	
	var form = document.popPam; 							//폼 name
	form.UserId.value = userId;   							//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.SysCd.value  = getSelectedVal('cboSystem').value;  //POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	
	nHeight	= screen.height;
    nWidth = screen.width;
    
    winDevRep = winOpen(form, 'devRep', '/webPage/winpop/progregister/PopDevRepository.jsp', nHeight, nWidth);
}