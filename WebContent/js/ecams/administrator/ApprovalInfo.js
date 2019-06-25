var userName 	= window.top.userName;
var userId 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;

var grdSign			= new ax5.ui.grid(); //결재정보 그리드

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

var lstRgtData		= null; //직무 리스트 데이터
var lstGradeData	= null; //프로그램등급 리스트 데이터
var lstJawonData	= null; //프로그램종류 리스트 데이터

var treeObj			= null;
var treeDeptData	= null; //조직트리 데이터
var tmpDeptCd		= "";

var allApprovalInfoModal 	= new ax5.ui.modal(); //전체조회 팝업
var copyInfoModal	= new ax5.ui.modal(); //결재정보복사 팝업

var tmpInfo     	= new Object(); 
var tmpInfoData 	= new Object(); 

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
            grdSign_Click();
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

var allApprovalInfoModalCallBack = function() {
	allApprovalInfoModal.close();
}

var copyInfoModalCallBack = function() {
	copyInfoModal.close();
}

$(document).ready(function(){
	getCodeInfo();
	getSysInfo();
	getTeamInfo();
	
	$('#chkSys').wCheck("check", false);
	$('#chkAllRgt').wCheck("check", false);
	$('#chkAllGrade').wCheck("check", false);
	$('#chkAllJawon').wCheck("check", false);
	$('#chkJawon').wCheck("disabled", true);
	$('#txtDept').prop("readonly", true);
	
	//조직 toolTip
	$("#txtDept").mouseenter(function(){
		//console.log("in");
	});
	$("#txtDept").mouseleave(function(){
		//console.log("out");
	});
	
	//시스템 변경이벤트
	$("#selSys").bind('change', function() {
		selSys_Change();
	});
	
	//결재구분 변경이벤트
	$("#selSgnGbn").bind('change', function() {
		selSgnGbn_Change();
	});

	//프로그램등급 선택
	document.getElementById("lstGradeDiv").style.backgroundColor = "#E2E2E2"; //lstType.enabled = false;
	$("#chkGrade").bind('click', function() {
		chkGrade_Click();
	});
	
	//프로그램종류 선택
	document.getElementById("lstJawonDiv").style.backgroundColor = "#E2E2E2"; //lstProg.enabled = false;
	$("#chkJawon").bind('click', function() {
		chkJawon_Click();
	});
	
	//시스템과관련없음
	$("#chkSys").bind('click', function() {
		chkSys_Click();
	});
	
	//직무전체선택
	$("#chkAllRgt").bind('click', function() {
		chkAllRgt_Click();
	});
	
	//프로그램등급 전체선택
	$("#chkAllGrade").bind('click', function() {
		chkAllGrade_Click();
	});
	
	//프로그램종류 전체선택
	$("#chkAllJawon").bind('click', function() {
		chkAllJawon_Click();
	});
	
	//결재정보복사
	$("#btnCopy").bind('click', function() {
		//btnCopy_Click();
	});
	
	//대결범위등록
	$("#btnBlank").bind('click', function() {
		//btnBlank_Click();
	});
	
	//조회
	$("#btnQry").bind('click', function() {
		btnQry_Click();
	});
	
	//전체조회
	$("#btnAllQry").bind('click', function() {
		btnAllQry_Click();
	});
	
	//등록
	$("#btnReq").bind('click', function() {
		btnReq_Click();
	});
	
	//폐기
	$("#btnDel").bind('click', function() {
		btnDel_Click();
	});
});

function getCodeInfo(){
	//CodeInfo.getCodeInfo("REQUEST,SGNGBN,SGNSTEP,SGNCD,SYSGBN,RGTCD,PGMTYPE","SEL","n");
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('REQUEST', 'SEL','N'),
		new CodeInfo('SGNGBN' , 'SEL','N'),
		new CodeInfo('SGNSTEP', 'SEL','N'),
		new CodeInfo('SGNCD'  , 'SEL','N'),
		new CodeInfo('SYSGBN' , 'SEL','N'),
		new CodeInfo('RGTCD'  , 'SEL','N'),
		new CodeInfo('PGMTYPE', 'SEL','N')
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
	lstRgtData			= codeInfos.RGTCD;
	lstGradeData		= codeInfos.PGMTYPE;
	
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

	lstRgtData = lstRgtData.filter(function(data) {
		if(data.cm_micode != "00") return true;
		else return false;
	});
	//setLstRgt();
	
	lstGradeData = lstGradeData.filter(function(data) {
		if(data.cm_micode != "00") return true;
		else return false;
	});
	//setLstGrade();
	
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
	treeDeptData = data;
	//$.fn.zTree.init($("#treeDept"), treeSetting, treeDeptData); //초기화
	treeObj = $.fn.zTree.getZTreeObj("treeDept");
} 

/* 조직 트리 클릭 이벤트 */
function dept_Click(event, treeId, treeNode) {
	$('#txtDept').val(treeObj.getSelectedNodes()[0].name);
	//txtDeptName.toolTip = SelectedCd.toXMLString();
	tmpDeptCd = treeObj.getSelectedNodes()[0].id;
} 

//결재구분 변경 이벤트 (cboGubun_Click)
function selSgnGbn_Change() {
	var i = 0;
	var findSw = false;
	
	if(getSelectedIndex('selSgnGbn') < 0) {
		$('#chkAllRgt').wCheck("disabled", true);
		$('#chkDel').wCheck('check',false);
		document.getElementById("lstRgtDiv").style.backgroundColor = "#E2E2E2"; //lstRgtCd.enabled = false;
		$('#lstRgt').empty();
		document.getElementById("treeDeptDiv").style.backgroundColor = "#E2E2E2"; //treeDept.enabled = false;  
		$.fn.zTree.init($("#treeDept"), treeSetting, []);
		$('#txtDept').val("");
		tmpDeptCd = "";
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
	    	$('[data-ax5select="selCommon"]').ax5select("enable");
	    	$('[data-ax5select="selBlank"]').ax5select("enable");
	    	$('[data-ax5select="selComAft"]').ax5select("enable");
	    	$('[data-ax5select="selEmg"]').ax5select("enable");
	    	$('[data-ax5select="selEmgAft"]').ax5select("enable");
	    	document.getElementById("treeDeptDiv").style.backgroundColor = "#E2E2E2"; //treeDept.enabled = false;
	    	//treeDept.setStyle("alternatingItemColors", [0xDDDDDD, 0xDDDDDD] as Array );
	    	$.fn.zTree.init($("#treeDept"), treeSetting, []);
	    	$('#txtDept').val("");
	    	tmpDeptCd = "";
			$('#txtDept').prop("readonly", true);
			document.getElementById("lstRgtDiv").style.backgroundColor = "#FFFFFF"; //lstRgtCd.enabled = true;
			setLstRgt();
			$('#chkAllRgt').wCheck("disabled", false);
			$('#chkGrade').wCheck('check', false);
			chkGrade_Click();
			document.getElementById("lstGradeDiv").style.backgroundColor = "#E2E2E2"; //lstType.enabled = false;
			$('#chkAllGrade').wCheck("disabled", true);
			$('#chkAllGrade').wCheck("check", false);
			$('#chkAllJawon').wCheck("disabled", true);
			$('#chkAllJawon').wCheck("check", false);
			document.getElementById("lstJawonDiv").style.backgroundColor = "#E2E2E2"; //lstProg.enabled = false;
			$('#chkJawon').wCheck("check", false);
			chkJawon_Click();
			$('#chkEnd').wCheck("check", false);
			
			break;
	    case "6":
	    case "7":
	    case "8": //협조
	    	$('[data-ax5select="selCommon"]').ax5select("enable");
	    	$('[data-ax5select="selBlank"]').ax5select("enable");
	    	$('[data-ax5select="selComAft"]').ax5select("enable");
	    	$('[data-ax5select="selEmg"]').ax5select("enable");
	    	$('[data-ax5select="selEmgAft"]').ax5select("enable");
	    	document.getElementById("treeDeptDiv").style.backgroundColor = "#E2E2E2"; //treeDept.enabled = false;
			//treeDept.setStyle("alternatingItemColors", [0xDDDDDD, 0xDDDDDD] as Array );
			$.fn.zTree.init($("#treeDept"), treeSetting, []);
			$('#txtDept').val("");
			tmpDeptCd = "";
			$('#txtDept').prop("readonly", true);
			document.getElementById("lstRgtDiv").style.backgroundColor = "#FFFFFF"; //lstRgtCd.enabled = true;
			setLstRgt();
			$('#chkAllRgt').wCheck("disabled", false);
			$('#chkGrade').wCheck("check", false);
			chkGrade_Click();
			document.getElementById("lstGradeDiv").style.backgroundColor = "#E2E2E2"; //lstType.enabled = false;
			$('#chkAllGrade').wCheck("disabled", true);
			$('#chkAllGrade').wCheck("check", false);
			$('#chkAllJawon').wCheck("disabled", true);
			$('#chkAllJawon').wCheck("check", false);
			document.getElementById("lstJawonDiv").style.backgroundColor = "#E2E2E2"; //lstProg.enabled = false;
			$('#chkJawon').wCheck("check", false);
			chkJawon_Click();
			$('#chkEnd').wCheck("check", false);
			$('#chkAllJawon').wCheck("disabled", true);
			$('#chkAllJawon').wCheck("check", false);
			$('#chkDel').wCheck("disabled", true);
			$('#chkDel').wCheck("check", false);
			$('#chkDelDiv').css('visibility','visible');
			
			break;
	    case "9": //특정팀/특정권한
	    	$('[data-ax5select="selCommon"]').ax5select("enable");
	    	$('[data-ax5select="selBlank"]').ax5select("enable");
	    	$('[data-ax5select="selComAft"]').ax5select("enable");
	    	$('[data-ax5select="selEmg"]').ax5select("enable");
	    	$('[data-ax5select="selEmgAft"]').ax5select("enable");
	    	document.getElementById("treeDeptDiv").style.backgroundColor = "#FFFFFF"; //treeDept.enabled = true;
			//treeDept.setStyle("alternatingItemColors", [0xFFFFFF, 0xFFFFFF] as Array );
	    	$.fn.zTree.init($("#treeDept"), treeSetting, treeDeptData);
	    	$('#txtDept').val("");
	    	tmpDeptCd = "";
			$('#txtDept').prop("readonly", false);
			document.getElementById("lstRgtDiv").style.backgroundColor = "#FFFFFF"; //lstRgtCd.enabled = true;
			setLstRgt();
			$('#chkAllRgt').wCheck("disabled", false);
			$('#chkGrade').wCheck("check", false);
			chkGrade_Click();
			document.getElementById("lstGradeDiv").style.backgroundColor = "#E2E2E2"; //lstType.enabled = false;
			document.getElementById("lstJawonDiv").style.backgroundColor = "#E2E2E2"; //lstProg.enabled = false;
			$('#chkJawon').wCheck("check", false);
			chkJawon_Click();
			$('#chkEnd').wCheck("check", false);
			$('#chkAllGrade').wCheck("disabled", true);
			$('#chkAllGrade').wCheck("check", false);
			$('#chkAllJawon').wCheck("disabled", true);
			$('#chkAllJawon').wCheck("check", false);
			
			break;
	    case "C": //결재추가
	    	//////////////////////// 정상결재시 ////////////////////////
	    	findSw = false;
	    	
	    	if(selCommonData.length > 0 && getSelectedIndex('selCommon') > -1) {
	    		if(getSelectedVal('selCommon').value == "2") findSw = true;
	    	}
	    	
	    	if(!findSw) {
	    		for(i=0; i<selCommonData.length; i++) {
	    			if(getSelectedVal('selCommon').value == "2") {
	    				$('[data-ax5select="selCommon"]').ax5select('setValue',selCommonData[i].value,true); //value값으로
	    				break;
	    			}
	    		}
	    	}
	    	
	    	//////////////////////// 부재시 ////////////////////////
	    	findSw = false;
	    	
	    	if(selBlankData.length > 0 && getSelectedIndex('selBlank') > -1) {
	    		if(getSelectedVal('selBlank').value == "2") findSw = true;
	    	}
	    	
	    	if(!findSw) {
	    		for(i=0; i<selBlankData.length; i++) {
	    			if(getSelectedVal('selBlank').value == "2") {
	    				$('[data-ax5select="selBlank"]').ax5select('setValue',selBlankData[i].value,true); //value값으로
	    				break;
	    			}
	    		}
	    	}
	    	
	    	//////////////////////// 정상(업무후) ////////////////////////
	    	findSw = false;
	    	
	    	if(selComAftData.length > 0 && getSelectedIndex('selComAft') > -1) {
	    		if(getSelectedVal('selComAft').value == "2") findSw = true;
	    	}
	    	
	    	if(!findSw) {
	    		for(i=0; i<selBlankData.length; i++) {
	    			if(getSelectedVal('selComAft').value == "2") {
	    				$('[data-ax5select="selComAft"]').ax5select('setValue',selComAftData[i].value,true); //value값으로
	    				break;
	    			}
	    		}
	    	}
	    	
	    	//////////////////////// 긴급(업무중) ////////////////////////
	    	findSw = false;
	    	
	    	if(selEmgData.length > 0 && getSelectedIndex('selEmg') > -1) {
	    		if(getSelectedVal('selEmg').value == "2") findSw = true;
	    	}
	    	
	    	if(!findSw) {
	    		for(i=0; i<selEmgData.length; i++) {
	    			if(getSelectedVal('selEmg').value == "2") {
	    				$('[data-ax5select="selEmg"]').ax5select('setValue',selEmgData[i].value,true); //value값으로
	    				break;
	    			}
	    		}
	    	}
	    	
	    	//////////////////////// 긴급(업무후) ////////////////////////
	    	findSw = false;
	    	
	    	if(selEmgAftData.length > 0 && getSelectedIndex('selEmgAft') > -1) {
	    		if(getSelectedVal('selEmgAft').value == "2") findSw = true;
	    	}
	    	
	    	if(!findSw) {
	    		for(i=0; i<selEmgAftData.length; i++) {
	    			if(getSelectedVal('selEmgAft').value == "2") {
	    				$('[data-ax5select="selEmgAft"]').ax5select('setValue',selEmgAftData[i].value,true); //value값으로
	    				break;
	    			}
	    		}
	    	}
	    	
	    	$('[data-ax5select="selCommon"]').ax5select("disable");
	    	$('[data-ax5select="selBlank"]').ax5select("disable");
	    	$('[data-ax5select="selComAft"]').ax5select("disable");
	    	$('[data-ax5select="selEmg"]').ax5select("disable");
	    	$('[data-ax5select="selEmgAft"]').ax5select("disable");
	    	document.getElementById("treeDeptDiv").style.backgroundColor = "#E2E2E2"; //treeDept.enabled = false;
	    	//treeDept.setStyle("alternatingItemColors", [0xDDDDDD, 0xDDDDDD] as Array );
	    	$.fn.zTree.init($("#treeDept"), treeSetting, []);
	    	$('#txtDept').val("");
	    	tmpDeptCd = "";
			$('#txtDept').prop("readonly", true);
			document.getElementById("lstRgtDiv").style.backgroundColor = "#E2E2E2"; //lstRgtCd.enabled = false;
			$('#lstRgt').empty();
			$('#chkAllRgt').wCheck("disabled", true);
	    	$('#chkAllRgt').wCheck("check", false);
	    	$('#chkGrade').wCheck("check", false);
			chkGrade_Click();
			document.getElementById("lstGradeDiv").style.backgroundColor = "#E2E2E2"; //lstType.enabled = false;
			$('#chkAllGrade').wCheck("disabled", true);
			$('#chkAllGrade').wCheck("check", false);
			$('#chkAllJawon').wCheck("disabled", true);
			$('#chkAllJawon').wCheck("check", false);
			document.getElementById("lstJawonDiv").style.backgroundColor = "#E2E2E2"; //lstProg.enabled = false;
			$('#chkJawon').wCheck("check", false);
			chkJawon_Click();
			
	    	break;
	    case "P":
	    default:
	    	$('#chkAllRgt').wCheck("disabled", true);
	    	$('#chkAllRgt').wCheck("check", false);
	    	document.getElementById("lstRgtDiv").style.backgroundColor = "#E2E2E2"; //lstRgtCd.enabled = false;
			$('#lstRgt').empty();
			document.getElementById("treeDeptDiv").style.backgroundColor = "#E2E2E2"; //treeDept.enabled = false;
			//treeDept.setStyle("alternatingItemColors", [0xDDDDDD, 0xDDDDDD] as Array );
			$.fn.zTree.init($("#treeDept"), treeSetting, []);
			$('#txtDept').val("");
			tmpDeptCd = "";
			$('#txtDept').prop("readonly", true);
	}
	
	if(getSelectedVal('selSgnGbn').value == "1") {
		$('[data-ax5select="selSysGbn"]').ax5select("enable");
	}else {
		$('[data-ax5select="selSysGbn"]').ax5select("disable");
	}
}

//시스템 변경 이벤트 (cboSys_Click) 
function selSys_Change() {
	$('#lstJawon').empty();
	
	if(getSelectedIndex('selSys') < 1) {
		$('#chkJawon').wCheck("disabled", true);
		return;
	}
	$('#chkJawon').wCheck("disabled", false);
	$('#chkSys').wCheck("check", false);
	
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
	lstJawonData = data;
	setLstJawon();
}

function setLstJawon() {
	$('#lstRgt').empty(); //리스트 초기화
	var addId = null;
	var liStr = null;
	
	if(lstJawonData == null || lstJawonData.length < 0) return;
	
	if($('#chkJawon').is(':checked')) {
		lstJawonData.forEach(function(lstJawonData, Index) {
			addId = lstJawonData.cm_micode;
			liStr  = '';
			liStr += '<li class="list-group-item">';
			liStr += '<label><input type="checkbox" class="checkbox-jawon" id="lstJawon'+addId+'" value="'+lstJawonData.cm_micode+'"/>'+lstJawonData.cm_codename+'</label>';
			liStr += '</li>';
			
			$('#lstJawon').append(liStr);
		});
	}
	
	$('input.checkbox-jawon').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
}

function chkGrade_Click() {
	if($('#chkGrade').is(':checked')) {
		document.getElementById("lstGradeDiv").style.backgroundColor = "#FFFFFF"; //lstType.enabled = true;
		setLstGrade();
		$('#chkAllGrade').wCheck("disabled", false);
	}else {
		document.getElementById("lstGradeDiv").style.backgroundColor = "#E2E2E2"; //lstType.enabled = false;
		$('#lstGrade').empty();
		$('#chkAllGrade').wCheck("check", false);
		$('#chkAllGrade').wCheck("disabled", true);
	}
}

function chkJawon_Click() {
	if($('#chkJawon').is(':enabled') && $('#chkJawon').is(':checked') &&
			(getSelectedVal('selReqCd').value.substr(0,1) == "0" || getSelectedVal('selReqCd').value.substr(0,1) == "1")) {
		setLstJawon(); //getProgInfo();
		document.getElementById("lstJawonDiv").style.backgroundColor = "#FFFFFF"; //lstProg.enabled = true;
		$('#chkAllJawon').wCheck("disabled", false);
	}else {
		document.getElementById("lstJawonDiv").style.backgroundColor = "#E2E2E2"; //lstProg.enabled = false;
		$('#lstJawon').empty();
		$('#chkAllJawon').wCheck("check", false);
		$('#chkAllJawon').wCheck("disabled", true);
	}
}

//직무리스트
function setLstRgt() {
	$('#lstRgt').empty(); //리스트 초기화
	var addId = null;
	var liStr = null;
	
	if(lstRgtData == null || lstRgtData.length < 0) return;
	
	lstRgtData.forEach(function(lstRgtData, Index) {
		addId = lstRgtData.cm_micode;
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '<label><input type="checkbox" class="checkbox-rgtcd" id="lstRgt'+addId+'" value="'+lstRgtData.cm_micode+'"/>'+lstRgtData.cm_codename+'</label>';
		liStr += '</li>';
		
		$('#lstRgt').append(liStr);
	});
	
	$('input.checkbox-rgtcd').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
}

//프로그램등급리스트
function setLstGrade() {
	$('#lstGrade').empty(); //리스트 초기화
	var addId = null;
	var liStr = null;
	
	if(lstGradeData == null || lstGradeData.length < 0) return;
	
	lstGradeData.forEach(function(lstGradeData, Index) {
		addId = lstGradeData.cm_micode;
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '<label><input type="checkbox" class="checkbox-grade" id="lstGrade'+addId+'" value="'+lstGradeData.cm_micode+'"/>'+lstGradeData.cm_codename+'</label>';
		liStr += '</li>';
		
		$('#lstGrade').append(liStr);
	});
	
	$('input.checkbox-grade').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
}

function grdSign_Click() {
	var i = 0;
	var j = 0;
	var findSw = false;
	var tmpWork = "";
	var tmpObj = null;
	
	var gridSelectedIndex = grdSign.selectedDataIndexs;
	
	var selectedGridItem = grdSign.list[grdSign.selectedDataIndexs];
	
	if(gridSelectedIndex < 0) return;
	
	if(getSelectedIndex('selReqCd') < 0) findSw = true;
	else if(getSelectedVal('selReqCd').value != selectedGridItem.cm_reqcd) findSw = true;
	
	if(findSw) {
		for(i=0; i<selReqCdData.length; i++) {
			if(selReqCdData[i].cm_micode == selectedGridItem.cm_reqcd) {
				$('[data-ax5select="selReqCd"]').ax5select('setValue',selReqCdData[i].value,true); //value값으로
				break;
			}
		}
	}
	
	if(selectedGridItem.cm_syscd == "99999") {
		$('#chkSys').wCheck("check", true);
		$('[data-ax5select="selSys"]').ax5select('setValue',selSysData[0].value,true); //value값으로
		$('[data-ax5select="selSys"]').ax5select("disable");
	}else {
		$('#chkSys').wCheck("check", false);
		findSw = false;
		
		if(getSelectedIndex('selSys') < 1) findSw = true;
		else if(getSelectedVal('selSys').value != selectedGridItem.cm_syscd) findSw = true;
		
		if(findSw) {
			for(i=0; i<selSysData.length; i++) {
				if(selSysData[i].cm_syscd == selectedGridItem.cm_syscd) {
					$('[data-ax5select="selSys"]').ax5select('setValue',selSysData[i].value,true); //value값으로
					break;
				}
			}
		}
	}
	
	for(i=0; i<selSignStepData.length; i++) {
		if(Number(selSignStepData[i].cm_micode) == Number(selectedGridItem.cm_seqno)) {
			$('[data-ax5select="selSignStep"]').ax5select('setValue',selSignStepData[i].value,true); //value값으로
			break;
		}
	}
	
	$('#txtStepName').val(selectedGridItem.cm_name);
	
	for(i=0; i<selSgnGbnData.length; i++) {
		if(selSgnGbnData[i].cm_micode == selectedGridItem.cm_gubun) {
			$('[data-ax5select="selSgnGbn"]').ax5select('setValue',selSgnGbnData[i].value,true); //value값으로
			break;
		}
	}
	selSgnGbn_Change();
	
	$('#chkMember').wCheck("check", false);
	$('#chkOutsourcing').wCheck("check", false);
	if(selectedGridItem.cm_manid == "1") $('#chkMember').wCheck("check", true); 
	else if(selectedGridItem.cm_manid == "2") $('#chkOutsourcing').wCheck("check", true);
	
	for(i=0; i<selCommonData.length; i++) {
		if(selCommonData[i].cm_micode == selectedGridItem.cm_common) {
			$('[data-ax5select="selCommon"]').ax5select('setValue',selCommonData[i].value,true); //value값으로
			break;
		}
	}
	
	for(i=0; i<selBlankData.length; i++) {
		if(selBlankData[i].cm_micode == selectedGridItem.cm_blank) {
			$('[data-ax5select="selBlank"]').ax5select('setValue',selBlankData[i].value,true); //value값으로
			break;
		}
	}
	
	for(i=0; i<selComAftData.length; i++) {
		if(selComAftData[i].cm_micode == selectedGridItem.cm_holiday) {
			$('[data-ax5select="selComAft"]').ax5select('setValue',selComAftData[i].value,true); //value값으로
			break;
		}
	}
	
	for(i=0; i<selEmgData.length; i++) {
		if(selEmgData[i].cm_micode == selectedGridItem.cm_emg) {
			$('[data-ax5select="selEmg"]').ax5select('setValue',selEmgData[i].value,true); //value값으로
			break;
		}
	}
	
	for(i=0; i<selEmgAftData.length; i++) {
		if(selEmgAftData[i].cm_micode == selectedGridItem.cm_emg2) {
			$('[data-ax5select="selEmgAft"]').ax5select('setValue',selEmgAftData[i].value,true); //value값으로
			break;
		}
	}
	
	if(selectedGridItem.cm_gubun == "1") {
		for(i=0; i<selSysGbnData.length; i++) {
			if(selSysGbnData[i].cm_micode == selectedGridItem.cm_jobcd) {
				$('[data-ax5select="selSysGbn"]').ax5select('setValue',selSysGbnData[i].value,true); //value값으로
				break;
			}
		}
	}
	
	if(selectedGridItem.cm_orgstep == "Y" && $('#chkDelDiv').css('visibility') == "visible") {
		$('#chkDel').wCheck("check", true);
	}
	
	$('#chkAllJawon').wCheck("disabled", true);
	$('#chkAllJawon').wCheck("check", false);
	
	if(selectedGridItem.cm_rsrccd != null && selectedGridItem.cm_rsrccd != "") {
		$('#chkJawon').wCheck("check", true);
		setLstJawon();
		document.getElementById("lstJawonDiv").style.backgroundColor = "#FFFFFF"; //lstProg.enabled = true;
		$('#chkAllJawon').wCheck("disabled", false);
		
		tmpWork = selectedGridItem.cm_rsrccd;
		j = 0;
		for(i=0; i<lstJawonData.length; i++) {
			if(tmpWork.indexOf(lstJawonData[i].cm_micode) > -1) {
				$('#lstJawon'+lstJawonData[i].cm_micode).wCheck('check', true);
				
				if(i > j) {
					tmpObj = lstJawonData[i];
					//배열객체명.splice(시작위치, 삭제요소갯수, 추가할 문자열)
					lstJawonData.splice(i--,1);
					lstJawonData.splice(j,0,tmpObj);
				}else j++;
			}else $('#lstJawon'+lstJawonData[i].cm_micode).wCheck('check', false);
		}
	}else {
		$('#chkJawon').wCheck("check", false);
		document.getElementById("lstJawonDiv").style.backgroundColor = "#E2E2E2"; //lstProg.enabled = false;
		$('#lstJawon').empty();
	}
	
	$('#chkGrade').wCheck("check", false);
	document.getElementById("lstGradeDiv").style.backgroundColor = "#E2E2E2"; //lstType.enabled = false;
	$('#lstGrade').empty();
	$('#chkAllGrade').wCheck("disabled", true);
	$('#chkAllGrade').wCheck("check", false);
	
	if(selectedGridItem.cm_pgmtype != null && selectedGridItem.cm_pgmtype != "") {
		$('#chkGrade').wCheck("check", true);
		document.getElementById("lstGradeDiv").style.backgroundColor = "#FFFFFF"; //lstType.enabled = true;
		setLstGrade();
		$('#chkAllGrade').wCheck("disabled", false);
		
		tmpWork = selectedGridItem.cm_pgmtype;
		j = 0;
		for(i=0; i<lstGradeData.length; i++) {
			if(tmpWork.indexOf(lstGradeData[i].cm_micode) > -1) {
				$('#lstGrade'+lstGradeData[i].cm_micode).wCheck('check', true);
				
				if(i > j) {
					tmpObj = lstGradeData[i];
					//배열객체명.splice(시작위치, 삭제요소갯수, 추가할 문자열)
					lstGradeData.splice(i--,1);
					lstGradeData.splice(j,0,tmpObj);
				}else j++;
			}else $('#lstGrade'+lstGradeData[i].cm_micode).wCheck('check', false);
		}
	}

	document.getElementById("lstRgtDiv").style.backgroundColor = "#E2E2E2"; //lstRgtCd.enabled = false;
	$('#lstRgt').empty();
	$('#chkAllRgt').wCheck("disabled", true);
	
	if(selectedGridItem.cm_position != null && selectedGridItem.cm_position != "") {
		document.getElementById("lstRgtDiv").style.backgroundColor = "#FFFFFF"; //lstRgtCd.enabled = true;
		setLstRgt();
		$('#chkAllRgt').wCheck("disabled", false);
		
		tmpWork = selectedGridItem.cm_position;
		j = 0;
		for(i=0; i<lstRgtData.length; i++) {
			if(tmpWork.indexOf(lstRgtData[i].cm_micode) > -1) {
				$('#lstRgt'+lstRgtData[i].cm_micode).wCheck('check', true);
				
				if(i > j) {
					tmpObj = lstRgtData[i];
					//배열객체명.splice(시작위치, 삭제요소갯수, 추가할 문자열)
					lstRgtData.splice(i--,1);
					lstRgtData.splice(j,0,tmpObj);
				}else j++;
			}else $('#lstRgtData'+lstRgtData[i].cm_micode).wCheck('check', false);
		}
	}
	
	if(selectedGridItem.cm_gubun != "1" && selectedGridItem.cm_jobcd != "" && selectedGridItem.cm_jobcd != null) {
		var node = treeObj.getNodeByParam('id', selectedGridItem.cm_jobcd);
		if(node !== null) {
			treeObj.selectNode(node);
		}
		$('#txtDept').val(treeObj.getSelectedNodes()[0].name);
		tmpDeptCd = treeObj.getSelectedNodes()[0].id;
		
		//console.log("node: " , node);
		//console.log("cm_jobcd: " + selectedGridItem.cm_jobcd);
	}
	
	if(selectedGridItem.cm_prcsw == "Y") $('#chkEnd').wCheck("check", true);
	else $('#chkEnd').wCheck("check", false);
}

function chkSys_Click() {
	if($('#chkSys').is(':checked')) {
		if(selSysData.length > 0) {
			$('[data-ax5select="selSys"]').ax5select('setValue',selSysData[0].value,true); //value값으로
		}
		$('[data-ax5select="selSys"]').ax5select("disable");
	}else {
		$('[data-ax5select="selSys"]').ax5select("enable");
	}
}

function chkAllRgt_Click() {
	//if (lstRgtCd.enabled == false) return;
	
	var checkSw = $('#chkAllRgt').is(':checked');
	var addId = null;
	
	lstRgtData.forEach(function(item, index) {
		addId = item.cm_micode;
		if(checkSw) {
			$('#lstRgt'+addId).wCheck('check', true);
		} else {
			$('#lstRgt'+addId).wCheck('check', false);
		}
	});
}

function chkAllGrade_Click() {
	//if (lstType.enabled == false) return;
	
	if(!$('#chkGrade').is(':checked')) return;
	
	var checkSw = $('#chkAllGrade').is(':checked');
	var addId = null;
	
	lstGradeData.forEach(function(item, index) {
		addId = item.cm_micode;
		if(checkSw) {
			$('#lstGrade'+addId).wCheck('check', true);
		} else {
			$('#lstGrade'+addId).wCheck('check', false);
		}
	});
}

function chkAllJawon_Click() {
	//if (lstProg.enabled == false) return;
	
	if(!$('#chkJawon').is(':checked')) return;
	
	if(getSelectedVal('selReqCd').value.substr(0,1) != "0" && getSelectedVal('selReqCd').value.substr(0,1) != "1") return;
	
	var checkSw = $('#chkAllJawon').is(':checked');
	var addId = null;
	
	lstJawonData.forEach(function(item, index) {
		addId = item.cm_micode;
		if(checkSw) {
			$('#lstJawon'+addId).wCheck('check', true);
		} else {
			$('#lstJawon'+addId).wCheck('check', false);
		}
	});
}

function btnQry_Click() {
	grdSign.setData([]);
	
	if(getSelectedIndex('selReqCd') < 1) {
		dialog.alert('결재종류를 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if(!$('#chkSys').is(':checked')) {
		if(getSelectedIndex('selSys') < 1) {
			dialog.alert('시스템을 선택하여 주시기 바랍니다.',function(){});
			return;
		}
	}
	
	var tmpSys = "";
	var tmpMem = "";
	
	if(!$('#chkSys').is(':checked')) tmpSys = getSelectedVal('selSys').value;
	else tmpSys = "99999";
	
	if(!$('#chkMember').is(':checked') && !$('#chkOutsourcing').is(':checked')) tmpMem = "9";
	else if ($('#chkMember').is(':checked') && $('#chkOutsourcing').is(':checked')) tmpMem = "9";
	else if ($('#chkMember').is(':checked')) tmpMem = "1";
	else tmpMem = "2";
	
	//Cmm0300.getConfInfo_List(tmpSys,cboReq.selectedItem.cm_micode,tmpMan,"");
	tmpInfo = new Object();
	tmpInfo.SysCd = tmpSys;
	tmpInfo.ReqCd = getSelectedVal('selReqCd').value;
	tmpInfo.ManId = tmpMem;
	tmpInfo.SeqNo = "";
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETAPPROVALINFO'
	}
	ajaxAsync('/webPage/administrator/ApprovalInfoServlet', tmpInfoData, 'json', successApprovalInfo);
}

function successApprovalInfo(data) {
	grdSignData = data;
	grdSign.setData(grdSignData);
}

function btnReq_Click() {
	var i = 0;
	var tmpWork = "";
	
	if(getSelectedIndex('selReqCd') <= 0) {
		dialog.alert('결재종류를 선택하여 주시기 바랍니다.',function(){});
		$('#selReqCd').focus();
		return;
	}
	
	if(getSelectedIndex('selSignStep') <= 0) {
		dialog.alert('결재단계를 선택하여 주시기 바랍니다.',function(){});
		$('#selSignStep').focus();
		return;
	}
	
	if(!$('#chkSys').is(':checked')) {
		if(getSelectedIndex('selSys') < 1) {
			dialog.alert('시스템을 선택하여 주시기 바랍니다.',function(){});
			$('#selSys').focus();
			return;
		}
	}
	
	if($('#txtStepName').val().length == 0) {
		dialog.alert('결재단계명칭을 입력하여 주시기 바랍니다.',function(){});
		$('#txtStepName').focus();
		return;
	}
	
	if(getSelectedIndex('selSgnGbn') <= 0) {
		dialog.alert('결재구분을 선택하여 주시기 바랍니다.',function(){});
		$('#selSgnGbn').focus();
		return;
	}
	
	if(!$('#chkMember').is(':checked') && !$('#chkOutsourcing').is(':checked')) {
		dialog.alert('직원/외주구분을 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if(getSelectedIndex('selCommon') <= 0) {
		dialog.alert('정상결재 시 처리방법을 선택하여 주시기 바랍니다.',function(){});
		$('#selCommon').focus();
		return;
	}
	
	if(getSelectedIndex('selBlank') <= 0) {
		dialog.alert('부재중인 경우 처리방법을 선택하여 주시기 바랍니다.',function(){});
		$('#selBlank').focus();
		return;
	}
	
	if(getSelectedIndex('selComAft') <= 0) {
		dialog.alert('업무후[정상] 처리방법을 선택하여 주시기 바랍니다.',function(){});
		$('#selComAft').focus();
		return;
	}
	
	if(getSelectedIndex('selEmg') <= 0) {
		dialog.alert('긴급[업무중] 처리방법을 선택하여 주시기 바랍니다.',function(){});
		$('#selEmg').focus();
		return;
	}
	
	if(getSelectedIndex('selEmgAft') <= 0) {
		dialog.alert('업무후[긴급] 처리방법을 선택하여 주시기 바랍니다.',function(){});
		$('#selEmgAft').focus();
		return;
	}
	
	if(getSelectedVal('selSgnGbn').value == "1") {
		if(getSelectedIndex('selSysGbn') <= 0) {
			dialog.alert('자동처리구분을 선택하여 주시기 바랍니다.',function(){});
			$('#selSysGbn').focus();
			return;
		}
	}
	
	if(getSelectedVal('selSgnGbn').value == "9") {
		if($('#txtDept').val().length == 0) {
			dialog.alert('결재조직을 선택하여 주시기 바랍니다.',function(){});
			$('#txtDept').focus();
			return;
		}
	}
	
	if( getSelectedVal('selSgnGbn').value == "3" || getSelectedVal('selSgnGbn').value == "6" ||
		getSelectedVal('selSgnGbn').value == "7" || getSelectedVal('selSgnGbn').value == "8" ||
		getSelectedVal('selSgnGbn').value == "4" || getSelectedVal('selSgnGbn').value == "5" ||
		getSelectedVal('selSgnGbn').value == "9" || getSelectedVal('selSgnGbn').value == "P") {
		
		for(i=0; i<lstRgtData.length; i++) {
			if($('#lstRgt'+lstRgtData[i].cm_micode).is(':checked')) {
				break;
			}
		}
		
		if(i>=lstRgtData.length) {
			dialog.alert('결재직무를 선택하여 주시기 바랍니다.',function(){});
			return;
		}
	}
	
	if($('#chkGrade').is(':checked')) { //&& lstType.enabled == true
		for(i=0; i<lstGradeData.length; i++) {
			if($('#lstGrade'+lstGradeData[i].cm_micode).is(':checked')) {
				break;
			}
		}
		
		if(i>=lstGradeData.length) {
			dialog.alert('프로그램등급을 선택하여 주시기 바랍니다.',function(){});
			return;
		}
	}
	
	if($('#chkJawon').is(':checked')) { //&& lstProg.enabled == true
		for(i=0; i<lstJawonData.length; i++) {
			if($('#lstJawon'+lstJawonData[i].cm_micode).is(':checked')) {
				break;
			}
		}
		
		if(i>=lstJawonData.length) {
			dialog.alert('프로그램종류를 선택하여 주시기 바랍니다.',function(){});
			return;
		}
	}
	
	//Cmm0300.confInfo_Updt(tmpObj);
	tmpInfo = new Object();
	tmpInfo.cm_reqcd = getSelectedVal('selReqCd').value;
	tmpInfo.cm_step = getSelectedVal('selSignStep').value;
	tmpInfo.cm_name = $('#txtStepName').val();
	tmpInfo.cm_gubun = getSelectedVal('selSgnGbn').value;
	
	if($('#chkSys').is(':checked')) {
		tmpInfo.cm_syscd = "99999";
	}else {
		tmpInfo.cm_syscd = getSelectedVal('selSys').value;
	}
	
	if($('#chkMember').is(':checked') && $('#chkOutsourcing').is(':checked')) {
		tmpInfo.cm_manid = "9";
	}else if ($('#chkMember').is(':checked')) {
		tmpInfo.cm_manid = "1";
	}else {
		tmpInfo.cm_manid = "2";
	}
	
	if(getSelectedVal('selSgnGbn').value == "1") {
		tmpInfo.cm_sysgbn = getSelectedVal('selSysGbn').value;
	}
	
	tmpInfo.cm_common = getSelectedVal('selCommon').value;
	tmpInfo.cm_blank = getSelectedVal('selBlank').value;
	tmpInfo.cm_holi = getSelectedVal('selComAft').value;
	tmpInfo.cm_emg = getSelectedVal('selEmg').value;
	tmpInfo.cm_emg2 = getSelectedVal('selEmgAft').value;
	
	if($('#chkDelDiv').css('visibility') == "visible" && $('#chkDel').is(':checked')) {
		tmpInfo.delsw = "Y";
	}else {
		tmpInfo.delsw = "N";
	}
	
	if(getSelectedVal('selSgnGbn').value == "9") {
		tmpInfo.cm_deptcd = tmpDeptCd; //txtDeptName.toolTip;
	}
	
	if( getSelectedVal('selSgnGbn').value == "3" || getSelectedVal('selSgnGbn').value == "6" ||
		getSelectedVal('selSgnGbn').value == "7" || getSelectedVal('selSgnGbn').value == "8" ||
		getSelectedVal('selSgnGbn').value == "4" || getSelectedVal('selSgnGbn').value == "5" ||
		getSelectedVal('selSgnGbn').value == "9" || getSelectedVal('selSgnGbn').value == "P") {
		
		tmpWork = "";
		
		for(i=0; i<lstRgtData.length; i++) {
			if($('#lstRgt'+lstRgtData[i].cm_micode).is(':checked')) {
				if(tmpWork.length > 0) tmpWork = tmpWork + ",";
				tmpWork = tmpWork + lstRgtData[i].cm_micode;
			}
		}
		tmpInfo.cm_rgtcd = tmpWork;
	}
	
	if($('#chkGrade').is(':checked')) { //&& lstType.enabled == true
		tmpWork = "";
		for(i=0; i<lstGradeData.length; i++) {
			if($('#lstGrade'+lstGradeData[i].cm_micode).is(':checked')) {
				if(tmpWork.length > 0) tmpWork = tmpWork + ",";
				tmpWork = tmpWork + lstGradeData[i].cm_micode;
			}
		}
		tmpInfo.cm_pgmtype = tmpWork;
	}
	
	if($('#chkJawon').is(':checked')) { //&& lstProg.enabled == true
		tmpWork = "";
		for(i=0; i<lstJawonData.length; i++) {
			if($('#lstJawon'+lstJawonData[i].cm_micode).is(':checked')) {
				if(tmpWork.length > 0) tmpWork = tmpWork + ",";
				tmpWork = tmpWork + lstJawonData[i].cm_micode;
			}
		}
		tmpInfo.cm_rsrccd = tmpWork;
	}
//  프로그램종류를 체크하였을 경우, 종류선택이 필수여서 else if문 불필요
//	else if($('#chkJawon').is(':checked')) {
//		tmpInfo.cm_rsrccd = "Y";
//	}
	
	if($('#chkEnd').is(':checked')) {
		tmpInfo.cm_prcsw = "Y";
	}else {
		tmpInfo.cm_prcsw = "N";
	}
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'SETAPPROVALINFO'
	}
	ajaxAsync('/webPage/administrator/ApprovalInfoServlet', tmpInfoData, 'json', successSetApprovalInfo);
}

function successSetApprovalInfo(data) {
	dialog.alert('결재정보가 등록되었습니다.',function(){
		btnQry_Click();
	});
}

function btnDel_Click() {
	if(getSelectedIndex('selReqCd') < 0) {
		dialog.alert('결재종류를 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if(getSelectedIndex('selSignStep') < 0) {
		dialog.alert('결재단계를 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if(!$('#chkSys').is(':checked')) {
		if(getSelectedIndex('selSys') < 1) {
			dialog.alert('시스템을 선택하여 주시기 바랍니다.',function(){});
			return;
		}
	}
	
	if(!$('#chkMember').is(':checked') && !$('#chkOutsourcing').is(':checked')) {
		dialog.alert('직원/외주구분을 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	
	var tmpSys = "";
	var tmpMem = "";
	
	if(!$('#chkSys').is(':checked')) {
		tmpSys = getSelectedVal('selSys').value;
	}else {
		tmpSys = "99999";
	}
	
	if($('#chkMember').is(':checked') && $('#chkOutsourcing').is(':checked')) {
		tmpMem = "9";
	}else if ($('#chkMember').is(':checked')) {
		tmpMem = "1";
	}else {
		tmpMem = "2";
	}
	
	//Cmm0300.confInfo_Close(tmpSys,cboReq.selectedItem.cm_micode,tmpMan,cboStep.selectedItem.cm_micode);
	tmpInfo = new Object();
	tmpInfo.sysCd = tmpSys;
	tmpInfo.reqCd = getSelectedVal('selReqCd').value;
	tmpInfo.memId = tmpMem;
	tmpInfo.seqNo = getSelectedVal('selSignStep').value;
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'DELAPPROVALINFO'
	}
	ajaxAsync('/webPage/administrator/ApprovalInfoServlet', tmpInfoData, 'json', successDelApprovalInfo);
}

function successDelApprovalInfo(data) {
	dialog.alert('결재정보가 삭제처리되었습니다.',function(){
		btnQry_Click();
	});
}

function btnAllQry_Click() {
	allApprovalInfoModal.open({
        width: 1200,
        height: 700,
        iframe: {
            method: "get",
            url: "../modal/AllApprovalInfoModal.jsp",
            param: "callBack=allApprovalInfoModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
            }
        }
    }, function () {
    });
}