/**
 * 개발영역연결등록 팝업 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 방지연
 * 	버전 : 1.0
 *  수정일 : 2019-06-00
 */

	
var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;

var strUserId = "";
var strSyscd  = "";
var strTmpDir = "";

var grdProgList 	= new ax5.ui.grid(); //프로그램목록그리드

var selOptions		= [];
var cboSystemData 	= [];	//시스템 데이터
var cboDirData		= [];	//기준디렉토리 데이터 (cboDir_dp)
var selHomeDirData	= [];	//홈디렉토리 데이터 (dirCbo_dp)
var cboSvrData		= [];	//서버 데이터
var cboJawonData	= [];	//프로그램종류 데이터
var cboJobData		= [];	//업무 데이터
var cboSRIData		= [];	//SRID 데이터
var grdProgListData = []; //프로그램목록그리드 데이터

var treeObj			= [];
var treeObjData		= []; //디렉토리트리 데이터

var selectedIndex 	= 0; 	//select 선택 index
var selectedItem 	= [];	//select 선택 item

var fileList = [];

var tmpInfo = new Object();
var tmpInfoData = new Object();

var treeSetting = {
	check: {
		enable: false
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		onExpand: myOnExpand,
		onRightClick: OnRightClick
	}
};

grdProgList.setConfig({
    target: $('[data-ax5grid="grdProgList"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: true,
    multipleSelect: true,
    header: {
        align: "center"
    },
    body: {
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
    	onDataChanged: function(){
    		this.self.repaint();
    	},
    	trStyleClass: function () {
     		if(this.item.error == '1'){
     			return "fontStyle-cncl";
     		}else {
     		}
     	}
    },
    columns: [
    	{key: "filename", 		label: "파일명",		width: '19%', 	align: "left"},
        {key: "errmsg", 		label: "등록결과",	  	width: '14%',	align: "left"},
        {key: "dirpath", 	 	label: "디렉토리",   	width: '25%',	align: "left"},
        {key: "story", 			label: "프로그램설명", 	width: '13%',	align: "left",	editor: {type: "text"}},
        {key: "rsrccdname", 	label: "프로그램종류", 	width: '13%',	align: "left"},
        {key: "jobname", 		label: "업무",   		width: '17%',	align: "left"}
    ]
});

$(document).ready(function(){
	strUserId = $('#UserId').val();
	strSyscd = $('#SysCd').val();
	
	//tmpAry.filterFunction = selectedFilters;
	
	//디렉토리조회 클릭
	$("#btnQry").bind('click', function() {
		btnQry_Click();
	});
	
	//등록 클릭
	$("#btnRegist").bind('click', function() {
		btnRegist_Click();
	});
	
	//초기화 클릭
	$("#btnInit").bind('click', function() {
		btnInit_Click();
	});
	
	//엑셀저장 클릭
	$("#btnExcel").bind('click', function() {
		btnExcel_Click();
	});
	
	//시스템
	$("#cboSystem").bind('change', function() {
		cboSystem_Change();
	});
	
	//프로그램종류
	$("#cboJawon").bind('change', function() {
		cboJawon_Change();
	});
	
	//경로입력
	$('#txtDir').bind('keypress', function(event){
		if(event.keyCode==13) {
			btnQry_Click();
		}
	});
	
	getTempDir();
	//getSysInfo();
	getPrjList();
});

//SystemPath.getTmpDir("99");
function getTempDir() {
	tmpInfo = new Object();
	tmpInfo = {
		requestType	: 'GETSYSTEMPATH',
		pathcd		: '99' 
	}
	ajaxAsync('/webPage/winpop/PopDevRepositoryServlet', tmpInfo, 'json', successSystemPath);
}


function successSystemPath(data) {
	strTmpDir = data + "/";
	
	getSysInfo();
}

//PrjInfo.getPrjList(tmpObj);
function getPrjList() {
	tmpInfo = new Object();
	tmpInfo.userid = strUserId;
	tmpInfo.reqcd = "01";
	tmpInfo.secuyn = "Y";
	tmpInfo.qrygbn = "01";		
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETSRID'
	}
	ajaxAsync('/webPage/winpop/PopDevRepositoryServlet', tmpInfoData, 'json', successSRID);
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

//SysInfo.getSysInfo(strUserId,SecuYn,"SEL",SecuYn,"OPEN");
function getSysInfo() {
	tmpInfo = new Object();
	tmpInfo.userId = strUserId;
	if(adminYN) {
		tmpInfo.secuYn = "N";
	}else {
		tmpInfo.secuYn = "Y";
	}
	tmpInfo.closeYn = "N";
	tmpInfo.selMsg = "SEL";
	tmpInfo.reqCd = "OPEN";		
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETSYSINFO'
	}
	ajaxAsync('/webPage/winpop/PopDevRepositoryServlet', tmpInfoData, 'json', successSysInfo);
}

function successSysInfo(data) {
	cboSystemData = data;
	
	cboSystemData = cboSystemData.filter(function(data) {
		if(data.cm_sysinfo.substr(6,1) == "1") return true;
		else return false;
	});
	
   	$('[data-ax5select="cboSystem"]').ax5select({
        options: injectCboDataToArr(cboSystemData, 'cm_syscd' , 'cm_sysmsg')
   	});
	
	if(strSyscd != "" && strSyscd != null) {
		for(var i=0; i<cboSystemData.length; i++) {
			if(cboSystemData[i].value == strSyscd) {
				$('[data-ax5select="cboSystem"]').ax5select('setValue',cboSystemData[i].value,true); //value값으로
				break;
			}
		}
	}
	
	if($("#cboSystem option").index($("#cboSystem option:selected")) > -1) {
		cboSystem_Change();
	}
}

function cboJawon_Change() {
	selectedIndex = $("#cboJawon option").index($("#cboJawon option:selected"));
	selectedItem = $('[data-ax5select="cboJawon"]').ax5select("getValue")[0];
	$('#txtExeName').val("");
	if(selectedIndex < 1) return;
	if($('[data-ax5select="cboJawon"]').ax5select("getValue")[0].cm_info.substr(40,1) == "1") {
		$('#txtExeName').val("확장자체크안함");
	}else{
		$('#txtExeName').val(selectedItem.cm_exename);
	}
	
}

function cboSystem_Change() {
	screenInit();
	
	selectedIndex = $("#cboSystem option").index($("#cboSystem option:selected"));
	selectedItem = $('[data-ax5select="cboSystem"]').ax5select("getValue")[0];
	
	if(selectedIndex < 0) return;
	
	if(selectedItem.cm_sysinfo.substr(9,1) == "1") {
		$('[data-ax5select="cboSRID"]').ax5select("disable");
		if(cboSRIDData.length > 0) {
			$('[data-ax5select="cboSRID"]').ax5select('setValue',cboSRIDData[0].value,true); //value값으로
		}
	}else {
		$('[data-ax5select="cboSRID"]').ax5select("enable");
	}
	
	if(selectedIndex >= 0) {
		//JobCd.getJobInfo(strUserId,cboSys.selectedItem.cm_syscd,"Y","N","SEL","NAME");
		tmpInfo = new Object();
		tmpInfo.userId = strUserId;
		tmpInfo.sysCd = selectedItem.value;
		tmpInfo.secuYn = "Y";
		tmpInfo.closeYn = "N";
		tmpInfo.selMsg = "SEL";
		tmpInfo.sortCd = "NAME";		
		
		tmpInfoData = new Object();
		tmpInfoData = {
			tmpInfo		: tmpInfo,
			requestType	: 'GETJOBINFO'
		}
		ajaxAsync('/webPage/winpop/PopDevRepositoryServlet', tmpInfoData, 'json', successJobInfo);
	}
	//SysInfo.getsvrInfo(strUserId,cboSys.selectedItem.cm_syscd,"Y","");
	tmpInfo = new Object();
	tmpInfo.userId = strUserId;
	tmpInfo.sysCd = selectedItem.value;
	tmpInfo.secuYn = "Y";
	tmpInfo.selMsg = "";
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETSVRINFO'
	}
	ajaxAsync('/webPage/winpop/PopDevRepositoryServlet', tmpInfoData, 'json', successSvrInfo);
}

function screenInit() {
	$('[data-ax5select="cboJawon"]').ax5select({
        options: []
	});
	
	$('[data-ax5select="cboJob"]').ax5select({
        options: []
	});
	
	$('[data-ax5select="cboDir"]').ax5select({
        options: []
	});
	
	$('[data-ax5select="cboSvr"]').ax5select({
        options: []
	});
	
	selHomeDirData = [];
	grdProgList.setData([]);
	$('[data-ax5select="cboSRID"]').ax5select("disable");
	$('#txtDir').val("");
}

function successJobInfo(data) {
	selOptions = data;
	cboJobData = [];
	
	$.each(selOptions,function(key,value) {
		cboJobData.push({value: value.cm_jobcd, text: value.cm_jobname});
	});
	
	$('[data-ax5select="cboJob"]').ax5select({
        options: cboJobData
	});
	
	if(cboJobData.length > 0) {
		//Cmd0100.getRsrcOpen(cboSys.selectedItem.cm_syscd,"SEL");
		tmpInfo = new Object();
		tmpInfo.sysCd = $('[data-ax5select="cboSystem"]').ax5select("getValue")[0].value;
		tmpInfo.selMsg = "SEL";
		
		tmpInfoData = new Object();
		tmpInfoData = {
			tmpInfo		: tmpInfo,
			requestType	: 'GETJAWON'
		}
		ajaxAsync('/webPage/winpop/PopDevRepositoryServlet', tmpInfoData, 'json', successJawon);
	}
}

function successJawon(data) {
	cboJawonData = data;
	
	cboJawonData = cboJawonData.filter(function(data) {
		if(data.cm_micode == "0000") return true;
		else {
			if(data.cm_info.substr(44,1) == "1" ||
			   data.cm_info.substr(57,1) == "1" ||
			   data.moduleyn == "Y") {
				return false;
			}else {
				return true;
			}
		}
	});
	
	$('[data-ax5select="cboJawon"]').ax5select({
        options: injectCboDataToArr(cboJawonData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="cboJawon"]').ax5select('setValue',cboJawonData[0].value,true); //value값으로
}

function successSvrInfo(data) {
	cboSvrData = data;
		
	cboSvrData = cboSvrData.filter(function(data) {
		if(data.cm_svrname != null && (data.cm_svrip == null || data.cm_svrip == "")) return true;
		else {
			if(data.cm_svrcd == "01") { //data.cm_svruse.substr(1,1) == "0" && 
				return true;
			}else {
				return false;
			}
		}
	});
	
   	$('[data-ax5select="cboSvr"]').ax5select({
        options: injectCboDataToArr(cboSvrData, 'cm_svrip' , 'cm_svrname')
   	});
	
   	$.fn.zTree.init($("#treeDir"), treeSetting, []); //초기화
	
	if(cboSvrData.length > 0) {
		$('[data-ax5select="cboSvr"]').ax5select('setValue',selOptions[0].value,true); //value값으로
		cboSvr_click();
	}
}

function cboSvr_click() {
	$('[data-ax5select="cboDir"]').ax5select({
        options: []
	});
	
	selectedIndex = $("#cboSvr option").index($("#cboSvr option:selected"));
	selectedItem = $('[data-ax5select="cboSvr"]').ax5select("getValue")[0];
	
	if(selectedIndex < 0) return;
	
	//svrOpen_svr.getHomeDirList(strUserId,cboSys.selectedItem.cm_syscd,cboSvr.selectedItem.cm_svrcd,cboSvr.selectedItem.cm_seqno,cboSvr.selectedItem.cm_svruse,cboSvr.selectedItem.cm_volpath);
	tmpInfo = new Object();
	tmpInfo.UserId = strUserId;
	tmpInfo.SysCd = $('[data-ax5select="cboSystem"]').ax5select("getValue")[0].value;
	tmpInfo.svrCd = selectedItem.cm_svrcd;
	tmpInfo.seqNo = selectedItem.cm_seqno;
	tmpInfo.svrInfo = selectedItem.cm_svruse;
	tmpInfo.svrHome = selectedItem.cm_volpath;
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETHOMEDIRLIST'
	}
	ajaxAsync('/webPage/winpop/PopDevRepositoryServlet', tmpInfoData, 'json', successHomeDir);
}

function successHomeDir(data) {
	selOptions = data;
	cboDirData = [];
	selHomeDirData = [];
	
	$.each(selOptions,function(key,value) {
		cboDirData.push({value: value.cm_volpath, text: value.cm_volpath});
		selHomeDirData.push({value: value.cm_volpath, text: value.cm_volpath});
	});
	
	$('[data-ax5select="cboDir"]').ax5select({
        options: cboDirData
	});
	
	//$('[data-ax5select="cboDir"]').ax5select('setValue',cboDirData[-1].value,true); //value값으로
	//cboDir.text = "기준디렉토리를 선택 또는 입력해주세요.";
}

function btnQry_Click() {
	var i = 0;
	var minLen = 30;
	var minLenStr = "";
	var baseDir = $('[data-ax5select="cboDir"]').ax5select("getValue")[0].value;
	
	grdProgList.setData([]);
	
	for(i=0; i<cboDirData.length; i++) {
		if(cboDirData[i].value.length < minLen) {
			minLen = cboDirData[i].value.length;
			minLenStr = cboDirData[i].value;
		}
	}
	
	if(baseDir.length < minLen) {
		dialog.alert('기준디렉토리를 ' + minLen + '자리 이상 입력해야 조회가능합니다. 예)' + minLenStr + ' 입력 후 조회',function(){});
		return;
	}
	
	for(i=0; i<cboDirData.length; i++) {
		if(cboDirData[i].value.indexOf(baseDir.substr(0,minLen)) > -1) {
			break;
		}
	}
	
	if(i >= cboDirData.length) {
		dialog.alert('선택한 서버의 Home-Directory 이후 디렉토리에 대해서만 조획능합니다. 예)' + minLenStr + '/추가디렉토리' ,function(){});
		return;
	}
	
	selectedIndex = getSelectedIndex('cboSvr');
	selectedItem = getSelectedVal('cboSvr');
	 
	if(selectedIndex < 0) return;
	
	//기준디렉토리 뒤에 슬래쉬 o + 입력디렉토리 앞에 슬래쉬 o > 슬래쉬빼주기
	//기준디렉토리 뒤에 슬래쉬 o + 입력디렉토리 앞에 슬래쉬 x
	//기준디렉토리 뒤에 슬래쉬 x + 입력디렉토리 앞에 슬래쉬 o
	//기준디렉토리 뒤에 슬래쉬 x + 입력디렉토리 앞에 슬래쉬 x > 슬래쉬 붙여주기
	
	//입력디렉토리 앞에 슬래쉬 o
	if($('#txtDir').val() != "") {
		if($('#txtDir').val().substr(0,1) == "/" || $('#txtDir').val().substr(0,1) == "\\") {
			if(baseDir.substr(baseDir.length-1,1) == "/" || baseDir.substr(baseDir.length-1,1) == "\\") {
				$('#txtDir').val($('#txtDir').val().substr(1,$('#txtDir').val().length-1))
			}
		}
		
		//입력디렉토리 앞에 슬래쉬 x
		if($('#txtDir').val().substr(0,1) != "/" && $('#txtDir').val().substr(0,1) != "\\") {
			if(baseDir.substr(baseDir.length-1,1) != "/" || baseDir.substr(baseDir.length-1,1) != "\\") {
				$('#txtDir').val("/" + $('#txtDir').val())
			}
		}
	}
	
	//console.log("txtDir: " + baseDir + $('#txtDir').val());
	
	//svrOpen_svr.getSvrDir(strUserId,cboSys.selectedItem.cm_syscd,cboSvr.selectedItem.cm_svrip,cboSvr.selectedItem.cm_portno,strBaseDir,cboSvr.selectedItem.cm_dir,cboSvr.selectedItem.cm_sysos,cboSvr.selectedItem.cm_volpath,cboSvr.selectedItem.cm_svrname,cboSvr.selectedItem.cm_buffsize);
	tmpInfo = new Object();
	tmpInfo.UserId = strUserId;
	tmpInfo.SysCd = $('[data-ax5select="cboSystem"]').ax5select("getValue")[0].value;
	tmpInfo.SvrIp = selectedItem.cm_svrip;
	tmpInfo.SvrPort = selectedItem.cm_portno;
	//tmpInfo.BaseDir = baseDir;
	tmpInfo.BaseDir = baseDir + $('#txtDir').val();
	tmpInfo.AgentDir = selectedItem.cm_dir;
	tmpInfo.SysOs = selectedItem.cm_sysos;
//	tmpInfo.HomeDir = $('[data-ax5select="cboDir"]').ax5select("getValue")[0].value;
	tmpInfo.HomeDir = baseDir + $('#txtDir').val();
	tmpInfo.svrName = selectedItem.cm_svrname;
	tmpInfo.buffSize = selectedItem.cm_buffsize;
	tmpInfo.logview = selectedItem.cm_logview;
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETSVRDIR'
	}
	ajaxAsync('/webPage/winpop/PopDevRepositoryServlet', tmpInfoData, 'json', successSvrDir);
}

/* 디렉토리 트리구조 셋팅 */
function successSvrDir(data) {
	treeObjData = data;
	
	if(treeObjData.constructor == String) {
		dialog.alert(treeObjData.substr(5));
	}else {
		ztree = $.fn.zTree.init($('#treeDir'), treeSetting, treeObjData); //초기화
		treeObj = $.fn.zTree.getZTreeObj("treeDir");
	}
}

/* 트리구조에서 folder 오픈 */
function myOnExpand(event, treeId, treeNode) {
	//root node 만 비동기 방식으로 뽑아오는 조건
	console.log("treeNode: ", treeNode);
	if(treeNode.children != undefined || treeNode.check_Child_State == -1){
		return false;
	}
	
	//로딩중 icon class 추가
	$('#'+treeNode.tId+'_ico').removeClass().addClass('button ico_loading');
	setTimeout(function(){

		var ajaxReturnData = null;
		var baseDir = "";
		
		if(treeNode.pId == null || treeNode.children != undefined){
			baseDir = $('[data-ax5select="cboDir"]').ax5select("getValue")[0].value;
		}else {
			//baseDir = $('[data-ax5select="cboDir"]').ax5select("getValue")[0].value + "/" + treeNode.name;
			baseDir = treeNode.cm_fullpath;
		}
		
		if($('#txtDir').val() != "") {
			if($('#txtDir').val().substr(0,1) == "/" || $('#txtDir').val().substr(0,1) == "\\") {
				if(baseDir.substr(baseDir.length-1,1) == "/" || baseDir.substr(baseDir.length-1,1) == "\\") {
					$('#txtDir').val($('#txtDir').val().substr(1,$('#txtDir').val().length-1))
				}
			}
			
			//입력디렉토리 앞에 슬래쉬 x
			if($('#txtDir').val().substr(0,1) != "/" && $('#txtDir').val().substr(0,1) != "\\") {
				if(baseDir.substr(baseDir.length-1,1) != "/" || baseDir.substr(baseDir.length-1,1) != "\\") {
					$('#txtDir').val("/" + $('#txtDir').val())
				}
			}
		}
		
		tmpInfo = new Object();
		tmpInfo.UserId = strUserId;
		tmpInfo.SysCd = $('[data-ax5select="cboSystem"]').ax5select("getValue")[0].value;
		tmpInfo.SvrIp = selectedItem.cm_svrip;
		tmpInfo.SvrPort = selectedItem.cm_portno;
		tmpInfo.BaseDir = baseDir;
		tmpInfo.AgentDir = selectedItem.cm_dir;
		tmpInfo.SysOs = selectedItem.cm_sysos;
		//tmpInfo.HomeDir = selectedItem.cm_volpath;
		tmpInfo.HomeDir = baseDir;
		tmpInfo.svrName = selectedItem.cm_svrname;
		tmpInfo.buffSize = selectedItem.cm_buffsize;
		tmpInfo.parent = treeNode.id;
		tmpInfo.logview = selectedItem.cm_logview;
		
		tmpInfoData = new Object();
		tmpInfoData = {
			tmpInfo		: tmpInfo,
			requestType	: 'GETCHILDSVRDIR'
		}
		
		ajaxReturnData = null;
		ajaxReturnData = ajaxCallWithJson('/webPage/winpop/PopDevRepositoryServlet', tmpInfoData, 'json');
		
		var obj = null;
		obj = ajaxReturnData;
		
		for(var i in ajaxReturnData){
			if(obj[i].cm_dirpath =='' ){
				delete obj[i]
				continue;
			}
			obj[i].name = obj[i].cm_dirpath;
			delete obj[i].cm_dirpath;
			obj[i].isParent = true;
		}
		
		
		if(obj != null) {
			obj = JSON.stringify(obj).replace(/null,/gi,'');
			obj = JSON.parse(obj);
			ajaxReturnData = obj;
			
			ztree.addNodes(treeNode,ajaxReturnData)
			$('#'+treeNode.tId+'_ico').removeClass().addClass('button ico_open');
		}
	}, 200);
};

/* 트리 노드 마우스 우클릭 이벤트 */
function OnRightClick(event, treeId, treeNode) { 
	var treeId = treeNode.id;
	
	if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
		treeObj.cancelSelectedNode();
		
		showRMenu("root", event.clientX, event.clientY);
		selectedNode = treeNode;
	} else if (treeNode && !treeNode.noR) {
		treeObj.selectNode(treeNode);
		showRMenu("node", event.clientX, event.clientY);
		selectedNode = treeNode;
	}
} 

/* context menu 설정 */
function showRMenu(type, x, y) { 
	$("#rMenu ul").show(); 
	if (type=="root") { 
		$("#contextmenu1").hide();
		$("#contextmenu2").hide();
	} else { 
		$("#contextmenu1").show();
		$("#contextmenu2").show();
 	} 
  
     y += document.body.scrollTop; 
     x += document.body.scrollLeft; 
     $("#rMenu").css({"top":y+"px", "left":x+"px", "visibility":"visible"});
  
     $("body").bind("mousedown", onBodyMouseDown); 
} 

/* 노드 이외 영역 클릭시 context menu 숨기기 */
function onBodyMouseDown(event){ 
	if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
		$("#rMenu").css({"visibility" : "hidden"});
	}
} 

/* context menu 숨기기 */
function hideRMenu() { 
	if ($("#rMenu")) $("#rMenu").css({"visibility": "hidden"}); 
	$("body").unbind("mousedown", onBodyMouseDown); 
}

/* 파일추출 클릭 이벤트 */
function contextmenu_click(gbn) {
	hideRMenu();
	
	//console.log("treeObj: " + treeObj.getSelectedNodes()[0].name);
	
	if(treeObj.getSelectedNodes()[0].id == null) return;
	
	grdProgList.setData([]);
	
	var fullpath = treeObj.getSelectedNodes()[0].cm_fullpath;
	if(fullpath != "" && fullpath != null) {
		if(fullpath.indexOf(":")<0 && fullpath.substr(0,1) != "/") {
			fullpath = "/" + fullpath;
		}
	}
	
	var tmpStr  = "";
	var tmpExe1 = "";
	var tmpExe2 = "";
	var tmpPrgName = "";
	
	tmpStr = gbn;
	//console.log("tmpStr: " + tmpStr);
	
	if($('#txtExe').val($('#txtExe').val().trim()).length > 0) tmpExe1 = $('#txtExe').val().trim();
	else tmpExe1 = "";
	
	if($('#txtNoExe').val($('#txtNoExe').val().trim()).length > 0) tmpExe2 = $('#txtNoExe').val().trim();
	else tmpExe2 = "";
	
	if($('#txtPrgName').val($('#txtPrgName').val().trim()).length > 0) tmpPrgName = $('#txtPrgName').val().trim();
	else tmpPrgName = "";
	
	selectedItem = getSelectedVal('cboSvr');
	
	//svrOpen_svr.getFileList_thread(strUserId,cboSys.selectedItem.cm_syscd,cboSvr.selectedItem.cm_svrip,cboSvr.selectedItem.cm_portno,cboSvr.selectedItem.cm_volpath,strDirFull,cboSvr.selectedItem.cm_svrcd,tmpStr,tmpExe1,tmpExe2,cboSvr.selectedItem.cm_sysinfo,cboSvr.selectedItem.cm_dir,cboSvr.selectedItem.cm_sysos,cboSvr.selectedItem.cm_buffsize,cboSvr.selectedItem.cm_svruse,cboSvr.selectedItem.cm_seqno);
	tmpInfo = new Object();
	tmpInfo.UserID = strUserId;
	tmpInfo.SysCd = getSelectedVal('cboSystem').value;
	tmpInfo.SvrIp = selectedItem.cm_svrip;
	tmpInfo.SvrPort = selectedItem.cm_portno;
	//tmpInfo.HomeDir =$('[data-ax5select="cboDir"]').ax5select("getValue")[0].value;
	tmpInfo.HomeDir = fullpath;
	tmpInfo.BaseDir = fullpath;
	tmpInfo.SvrCd = selectedItem.cm_svrcd;
	tmpInfo.GbnCd = tmpStr;
	
	console.log("tmpExe1: " + tmpExe1 + " / tmpExe2: " + tmpExe2);
	
	if(tmpExe1.length > 0){
		if(tmpExe1.indexOf(".") < 0){
			dialog.alert('추출대상 확장자에 "." 을 입력하여 주십시오.',function(){});
			return;
		}
	}
	if(tmpExe2.length > 0){
		if(tmpExe2.indexOf(".") < 0){
			dialog.alert('추출제외 확장자에 "." 을 입력하여 주십시오.',function(){});
			return;
		}
	}
	tmpInfo.exeName1 = tmpExe1;
	tmpInfo.exeName2 = tmpExe2;
	tmpInfo.SysInfo = selectedItem.cm_sysinfo;
	tmpInfo.AgentDir = selectedItem.cm_dir;
	tmpInfo.SysOs = selectedItem.cm_sysos;
	tmpInfo.buffSize = selectedItem.cm_buffsize;
	tmpInfo.svrInfo = selectedItem.cm_svruse;
	tmpInfo.svrSeq = selectedItem.cm_seqno;
	tmpInfo.logview = selectedItem.cm_logview;
	tmpInfo.PrgName = tmpPrgName;
	 
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETFILELIST_THREAD'
	}
	
	ajaxAsync('/webPage/winpop/PopDevRepositoryServlet', tmpInfoData, 'json', successGetFileList);
	
	fullpath = "";
}

function successGetFileList(data) {
	var findSw = false;
	
	grdProgListData = data;
	
	if(grdProgListData.length > 0) {
		if(grdProgListData[0].error == "W") {
			dialog.alert(grdProgListData[0].cm_dirpath,function(){});
			grdProgListData.splice(0,1);
		}
		
		var j = 0;
		for(var i=0; i<grdProgListData.length; i++) {
			if(grdProgListData[i].enable1 == "1") {
				if(grdProgListData[i].rsrccd != null && grdProgListData[i].rsrccd != "") {
					findSw = false;
					for(j=0; j<cboJawonData.length; j++) {
						if(cboJawonData[j].cm_micode == grdProgListData[i].rsrccd) {
							grdProgListData[i].rsrccdname = cboJawonData[j].cm_codename;
							grdProgListData[i].cm_info = cboJawonData[j].cm_info;
							findSw = true;
							break;
						}
					}
					if(!findSw) {
						grdProgListData[i].errmsg = "프로그램유형없음";
						grdProgListData[i].error = "1";
						grdProgListData[i].enable1 = "0";
					}
				}
				if(findSw) {
					findSw = false;
					if(grdProgListData[i].jobcd != null && grdProgListData[i].jobcd != "") {
						findSw = false;
						for(j=0; j<cboJobData.length; j++) {
							if(cboJawonData[j].cm_jobcd == grdProgListData[i].jobcd) {
								grdProgListData[i].jobname = cboJawonData[j].cm_jobname;
								findSw = true;
								break;
							}
						}
						if(!findSw) {
							grdProgListData[i].errmsg = "업무코드없음";
							grdProgListData[i].error = "1";
							grdProgListData[i].enable1 = "0";
						}
					}
				}
			}
		}
	}
	
	grdProgList.setData(grdProgListData);
	//grdProgList.setColumnSort({filename:{seq:0, orderBy:"asc"}});
}

function btnRegist_Click() {
	var checkedGridItem = grdProgList.getList("selected");
	var tmpHomedir 		= getSelectedVal('cboDir').value;
	var i 				= 0;
	var tmpExe 			= "";
	var rsrcExe 		= "";
	var errSw 			= false;
	
	for(i=0; i<checkedGridItem.length; i++) {
		checkedGridItem[i].errmsg = "";
	}
	
	//tmpAry.source = qry_dp.toArray();
	
	$('#txtStory').val($('#txtStory').val().trim());
	
	if(getSelectedIndex('cboSystem') < 0) {
		dialog.alert('시스템을 선택하여 주십시오.',function(){});
		$('#cboSystem').focus();
		return;
	}
	
	if(getSelectedVal('cboSystem').cm_sysinfo.substr(9,1) == "0") {
		if(getSelectedIndex('cboSRID') < 1) {
			dialog.alert('SR-ID를 선택하여 주십시오.',function(){});
			$('#cboSRID').focus();
			return;
		}
	}
	
	if(checkedGridItem.length == 0) {
		dialog.alert('등록할 파일을 선택하여 주십시오.',function(){});
		$('#cboSystem').focus();
	}
	
	if(getSelectedIndex('cboJawon') < 1) {
		dialog.alert('프로그램종류를 선택하여 주십시오.',function(){});
		$('#cboJawon').focus();
		return;
	}
	
	if(getSelectedIndex('cboJob') < 1) {
		dialog.alert('업무를 선택하여 주십시오.',function(){});
		$('#cboJob').focus();
		return;
	}
	
	errSw = false;
	
	if(checkedGridItem.length == 0) return;
	
	//console.log("checked: " , checkedGridItem[0].__index);
	
	for(i=0; i<checkedGridItem.length; i++) {
		tmpExe = "";
		
		if(checkedGridItem[i].errmsg != null && checkedGridItem[i].errmsg != "") {
			checkedGridItem[i].errmsg = "";
			checkedGridItem[i].error = "";
		}
		
		if(checkedGridItem[i].cm_dirpath.length > 499) {
			grdProgList.setValue(checkedGridItem[i].__index, "error", "1");
			grdProgList.setValue(checkedGridItem[i].__index, "errmsg", "프로그램경로가 너무 큼(최대 500)");
			errSw = true;
		}else if(checkedGridItem[i].cm_dirpath.substr(0, tmpHomedir.length) != tmpHomedir) {
			//windows 경로 \로 통일
			if(getSelectedVal('cboSvr').cm_sysos == "03") {
				//g: 발생한 모든 문자열 패턴 replace, i: 대소문자 구분X
				if(checkedGridItem[i].cm_dirpath.substr(0, tmpHomedir.length).replace(/\\/gi,'/') != tmpHomedir.replace(/\\/gi,'/')) {
					grdProgList.setValue(checkedGridItem[i].__index, "error", "1");
					grdProgList.setValue(checkedGridItem[i].__index, "errmsg", "홈디렉토리불일치");
					errSw = true;
				}
			}else {
				grdProgList.setValue(checkedGridItem[i].__index, "error", "1");
				grdProgList.setValue(checkedGridItem[i].__index, "errmsg", "홈디렉토리불일치");
				errSw = true;
			}
		}//else {
		
		if(!errSw) {
			if(checkedGridItem[i].filename.lastIndexOf(",") >= 0) {
				grdProgList.setValue(checkedGridItem[i].__index, "error", "1");
				grdProgList.setValue(checkedGridItem[i].__index, "errmsg", "프로그램명컴마제외");
				errSw = true;
			}else if($('[data-ax5select="cboJawon"]').ax5select("getValue")[0].cm_info.substr(26,1) == "1") {
				//tmpObj 쓰는 곳 없음
				//tmpObj = {};
				//tmpObj = tmpAry.getItemAt(i);
				//tmpObj.filename = tmpObj.filename.substr(0,tmpObj.filename.indexOf("."));
			}else {
				if(getSelectedVal('cboJawon').cm_info.substr(40,1) == "0") {
					if($('#txtExeName').val() != "" && $('#txtExeName').val() != null) {
						if(checkedGridItem[i].filename.lastIndexOf(".") > 0) {
							tmpExe = checkedGridItem[i].filename.substr(checkedGridItem[i].filename.lastIndexOf("."));
							tmpExe = tmpExe + ",";
							tmpExe = tmpExe.toUpperCase();
							rsrcExe = $('#txtExeName').val().toUpperCase();
							
							if(rsrcExe.indexOf(tmpExe) < 0) {
								grdProgList.setValue(checkedGridItem[i].__index, "error", "1");
								grdProgList.setValue(checkedGridItem[i].__index, "errmsg", "확장자불일치");
								errSw = true;
							}
						}else {
							grdProgList.setValue(checkedGridItem[i].__index, "error", "1");
							grdProgList.setValue(checkedGridItem[i].__index, "errmsg", "확장자불일치");
							errSw = true;
						}
					}
				}
			}
		}
		//}
		
		if(!errSw) {
			if(checkedGridItem[i].story == null || checkedGridItem[i].story == "") {
				if($('#txtStory').val().length == 0) {
					dialog.alert('프로그램설명을 입력하여 주십시오.',function(){});
					return;
				}else {
					checkedGridItem[i].story = $('#txtStory').val(); 
				}
			}
		}
	}
	
	grdProgList.selectAll({selected: false});
	
	if(errSw) {
		dialog.alert('등록대상 파일 중 요건에 맞지않는 파일이 있습니다. [등록결과] 을 확인 후 다시 등록하시기 바랍니다.',function(){});
		return;
	}
	
	tmpInfo = new Object();
	tmpInfo.userid = strUserId;
	tmpInfo.sysgb = getSelectedVal('cboSystem').cm_sysgb;
	tmpInfo.syscd = getSelectedVal('cboSystem').cm_syscd;
	tmpInfo.svrcd = getSelectedVal('cboSvr').cm_svrcd;
	tmpInfo.basesvr = getSelectedVal('cboSystem').cm_dirbase;
	tmpInfo.story = $('#txtStory').val(); 
	tmpInfo.rsrccd = getSelectedVal('cboJawon').cm_micode;
	tmpInfo.cm_info = getSelectedVal('cboJawon').cm_info;
	tmpInfo.seqno = getSelectedVal('cboSvr').cm_seqno;
	tmpInfo.jobcd = getSelectedVal('cboJob').value;
	
	if(getSelectedVal('cboSystem').cm_sysinfo.substr(9,1) == "0") {
		if(getSelectedIndex('cboSRID') > 0) {
			tmpInfo.srid = getSelectedVal('cboSRID').value;
		}
	}
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		tmpAry		: checkedGridItem,
		requestType	: 'REGISTPROG'
	}
	
	ajaxAsync('/webPage/winpop/PopDevRepositoryServlet', tmpInfoData, 'json', successRegistProg);
}

function successRegistProg(data) {
	var tmpArray = data;
	var tmpObj = new Object();
	var j = 0;
	var findSw = false;
	var okSw = false;
	var itemId = "";
	
	for(var i=0; i<tmpArray.length; i++) {
		for(j=0; j<grdProgListData.length; j++) {
			if(tmpArray[i].cm_dirpath == grdProgListData[j].cm_dirpath &&
					tmpArray[i].filename == grdProgListData[j].filename) {
				console.log(tmpArray[i].error + " / " + i +" / " + j);
				if(tmpArray[i].error == "1") {
					findSw = true;
					grdProgList.setValue(grdProgListData[j].__index, "errmsg", tmpArray[i].errmsg);
					grdProgList.setValue(grdProgListData[j].__index, "error", tmpArray[i].error);
					grdProgList.select(j, {selected: false});
				}else {
					//row 삭제이후 해당 목록 data 넣고 다시 grid에 넣기
					grdProgList.deleteRow(j);
					grdProgListData = clone(grdProgList.list);
					grdProgList.setData(grdProgListData);
					okSw = true;
					break;
				}
			}
		}
	} 
	
	if(getSelectedVal('cboJawon').cm_info.substr(8,1) == "1" &&
			okSw && getSelectedVal('cboJawon').modsw == "Y") {
		for(i=0; i<tmpArray.length; i++) {
			if(tmpArray[i].error != "1") {
				itemId = itemId + "," + tmpArray[i].itemid;
			}
		}
		//실행모듈 연결정보 팝업 svrOpen_Relat
	}

	if(findSw) {
		dialog.alert('등록 중 오류가 발생한 건이 있으니 확인하시기 바랍니다.',function(){});
	}else {
		dialog.alert('등록처리에 성공하였습니다.',function(){});
	}
}

function btnInit_Click() {
	cboSystem_Change();
	$('#txtExeName').val("");
	$('#txtExe').val("");
	$('#txtNoExe').val("");
	$('#txtStory').val("");
}

function btnExcel_Click() {
	grdProgList.exportExcel("파일추출목록.xls");
}