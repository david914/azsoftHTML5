var userName 	= window.top.userName;
var userId 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;

var grdSign		= new ax5.ui.grid(); //결재정보 그리드

var selOptions 		= [];

var grdSignData 	= null; //그리드
var selReqCdData 	= null; //결재종류
var selSysData 		= null; //시스템
var selCommonData	= null; //정상결재
var selSignStepData	= null; //결재단계
var selBlankData	= null; //부재처리
var selComAftData	= null; //정상(업무후)
var selEmgAftData	= null; //긴급(업무후)
var selSgnGbnData	= null; //결재구분
var selSysGbnData	= null; //자동처리
var selEmgData		= null; //긴급(업무중)

var lstJawonData	= null;

var treeObj			= null;
var treeDept		= null; //조직트리 데이터

var tmpInfo     = new Object(); 
var tmpInfoData = new Object(); 

$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

grdSign.setConfig({
    target: $('[data-ax5grid="grdSign"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    showLineNumber: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 20,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
//            for(var j=0;j<sysInfoCboData.length; j++) {
//            	if(this.item.cm_syscd == sysInfoCboData[j].cm_syscd) {
//            		$('[data-ax5select="cboSys"]').ax5select('setValue',sysInfoCboData[j].cm_syscd,true);
//            		cboSysClick();
//            		break;
//            	}
//            }
        },
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "manid", 		label: "구분",		width: '3%'},
        {key: "cm_seqno", 	label: "순서",  		width: '3%'},
        {key: "cm_name", 	label: "단계명칭",		width: '11%'},
        {key: "cm_codename",label: "결재구분",		width: '10%'},
        {key: "common", 	label: "정상", 		width: '8%'},
        {key: "blank", 		label: "부재",  		width: '8%'},
        {key: "holi", 		label: "업무후", 		width: '8%'},
        {key: "emg", 		label: "긴급",  		width: '8%'},
        {key: "emg2", 		label: "긴급[후]",	width: '8%'},
        {key: "deptcd", 	label: "결재조직",  	width: '13%'},
        {key: "rgtcd", 		label: "결재직무",  	width: '13%'},
        {key: "cm_orgstep", label: "삭제가능",  	width: '5%'},
        {key: "rsrccd", 	label: "프로그램종류", 	width: '10%'},
        {key: "pgmtype", 	label: "프로그램등급", 	width: '13%'}
    ]
});

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
		onClick: dept_Click
	}
};

$(document).ready(function(){
	getCodeInfo();
	getSysInfo();
	getTeamInfo();
	
	$('#chkSys').prop("checked", false);
	$('#chkAllRgt').prop("checked", false);
	$('#chkAllGrade').prop("checked", false);
	$('#chkAllJawon').prop("checked", false);
	$('#chkJawon').prop("disabled", true);
	$('#txtDept').prop("readonly", true);
	
	//조직 toolTip
	$("#txtDept").mouseenter(function(){
		//console.log("in");
	});
	$("#txtDept").mouseleave(function(){
		//console.log("out");
	});
	
	//시스템
	$("#selSys").bind('change', function() {
		selSys_Change();
	});
	
	//결재구분
	$("#selSgnGbn").bind('change', function() {
		selSgnGbn_Change();
	});
});

function getCodeInfo(){
	//CodeInfo.getCodeInfo("REQUEST,SGNGBN,SGNSTEP,SGNCD,SYSGBN,RGTCD,PGMTYPE","SEL","n");
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('REQUEST', 'SEL','N'),
		new CodeInfo('SGNGBN' , 'SEL','N'),
		new CodeInfo('SGNSTEP', 'SEL','N'),
		new CodeInfo('SGNCD'  , 'SEL','N'),
		new CodeInfo('SYSGBN' , 'SEL','N')
//		,new CodeInfo('RGTCD'  , 'SEL','N'),
//		new CodeInfo('PGMTYPE', 'SEL','N')
		]);
	
	selReqCdData 		= codeInfos.REQUEST;
	selCommonData		= codeInfos.SGNCD;
	selSignStepData		= codeInfos.SGNSTEP;
	selBlankData		= codeInfos.SGNCD;
	selComAftData		= codeInfos.SGNCD;
	selEmgAftData		= codeInfos.SGNCD;
	selSgnGbnData		= codeInfos.SGNGBN;
	selSysGbnData		= codeInfos.SYSGBN;
	selEmgData			= codeInfos.SGNCD;
	
	$('[data-ax5select="selReqCd"]').ax5select({
        options: injectCboDataToArr(selReqCdData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="selCommon"]').ax5select({
        options: injectCboDataToArr(selCommonData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="selSignStep"]').ax5select({
        options: injectCboDataToArr(selSignStepData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="selBlank"]').ax5select({
        options: injectCboDataToArr(selBlankData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="selComAft"]').ax5select({
        options: injectCboDataToArr(selComAftData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="selEmgAft"]').ax5select({
        options: injectCboDataToArr(selEmgAftData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="selSgnGbn"]').ax5select({
        options: injectCboDataToArr(selSgnGbnData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="selSysGbn"]').ax5select({
        options: injectCboDataToArr(selSysGbnData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="selEmg"]').ax5select({
        options: injectCboDataToArr(selEmgData, 'cm_micode' , 'cm_codename')
   	});
	
	if(selSgnGbnData.length > 0) {
		$('[data-ax5select="selSgnGbn"]').ax5select('setValue',selSgnGbnData[0].value,true); //value값으로
		selSgnGbn_Change();
	}
}

function getSysInfo() {
	//SysInfo_cbo.getSysInfo_Rpt(strUserId,"SEL","N",""); 
	tmpInfo = new Object();
	tmpInfo.userId = userId;
	tmpInfo.selMsg = "SEL";
	tmpInfo.closeYn = "N";
	tmpInfo.sysCd = "";
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETSYSINFO_RPT'
	}
	ajaxAsync('/webPage/administrator/ApprovalInfoServlet', tmpInfoData, 'json', successSysInfo);
}

function successSysInfo(data) {
	selSysData = data;
	$('[data-ax5select="selSys"]').ax5select({
        options: injectCboDataToArr(selSysData, 'cm_syscd' , 'cm_sysmsg')
   	});
	
	selSys_Change();
}

function getTeamInfo() {
	//treedept.getTeamInfoTree();
	tmpInfoData = new Object();
	tmpInfoData = {
		requestType	: 'GETTEAMINFOTREE'
	}
	ajaxAsync('/webPage/administrator/ApprovalInfoServlet', tmpInfoData, 'json', successTeamInfo);
}

/* 조직 트리구조 셋팅 */
function successTeamInfo(data) {
	treeDept = data;
	$.fn.zTree.init($("#treeDept"), treeSetting, data); //초기화
	treeObj = $.fn.zTree.getZTreeObj("treeDept");
} 

/* 조직 트리 클릭 이벤트 */
function dept_Click(event, treeId, treeNode) {
	$('#txtDept').val(treeObj.getSelectedNodes()[0].name);
	//txtDeptName.toolTip = SelectedCd.toXMLString();
} 

//결재구분 변경 이벤트 (cboGubun_Click)
function selSgnGbn_Change() {
	var i=0;
	var findSw = false;
	
	if(getSelectedIndex('selSgnGbn') < 0) {
		$('#chkAllRgt').wCheck("disabled", true);
		$('#chkDel').wCheck('check',false);
		//lstRgtCd.enabled = false;
		$('#lstRgt').empty();
		//treeDept.enabled = false;
		$.fn.zTree.init($("#treeDept"), treeSetting, []);
		$('#txtDept').val("");
		$('#txtDept').prop("readonly", true);
		return;
	}
	
	$('#chkDel').wCheck("disabled", true);
	$('#chkDel').wCheck('check',false);
	$('#chkDelDiv').css('visibility','hidden'); //visible
	
	switch (getSelectedVal('selSgnGbn').value) {
	    case "1":
	    case "2":
	    case "3":
	    case "4":
	    case "5": //처리팀
	    case "6":
	    case "7":
	    case "8":
	    case "9": //특정팀/특정권한
	    case "C": //결재추가
	    case "P":
	    default:
	    	$('#chkAllRgt').wCheck("disabled", true);
	    	$('#chkAllRgt').wCheck('check',false);
			//lstRgtCd.enabled = false;
			$('#lstRgt').empty();
			//treeDept.enabled = false;
			$.fn.zTree.init($("#treeDept"), treeSetting, []);
			//treeDept.setStyle("alternatingItemColors", [0xDDDDDD, 0xDDDDDD] as Array );
			$('#txtDept').val("");
			$('#txtDept').prop("readonly", true);
	}
	
	if(getSelectedVal('selSgnGbn').value == "1") {
		$('[data-ax5select="selSgnGbn"]').ax5select("enable");
	}else {
		$('[data-ax5select="selSgnGbn"]').ax5select("disable");
	}
}

//시스템 변경 이벤트 (cboSys_Click) 
function selSys_Change() {
	$('#lstJawon').empty();
	
	if(getSelectedIndex('selSys') < 1) {
		$('#chkJawon').prop("disabled", true);
		return;
	}
	$('#chkJawon').prop("disabled", false);
	$('#chkSys').prop("checked", false);
	
	getProgInfo();
}

function getProgInfo() {
	//sysrsrc.getProgInfo(cboSys.selectedItem.cm_syscd);
	tmpInfoData = new Object();
	tmpInfoData = {
		sysCd		: getSelectedVal('selSys').value,
		requestType	: 'GETPROGINFO'
	}
	
	ajaxAsync('/webPage/administrator/ApprovalInfoServlet', tmpInfoData, 'json', successProgInfo);
}

function successProgInfo(data) {
	$('#lstJawon').empty(); //리스트 초기화
	var liStr = null;
	var addId = null;
	
	lstJawonData = data;
	lstJawonData.forEach(function(lstJawonData, Index) {
		addId = Number(lstJawonData.cm_micode);
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '<label><input type="checkbox" id="lstJawon'+addId+'" value="'+lstJawonData.cm_micode+'"/>'+lstJawonData.cm_codename+'</label>';
		liStr += '</li>';
		
		$('#lstJawon').append(liStr);
	});
}