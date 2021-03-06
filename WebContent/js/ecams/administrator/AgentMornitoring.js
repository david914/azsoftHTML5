/**
 * Agent모니터링 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-27
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var agentGrid	= new ax5.ui.grid();

var agentGridData	= [];
var cboSysCdData	= [];

var reqSw 			= false;

agentGrid.setConfig({
    target: $('[data-ax5grid="agentGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
    },
    body: {
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {
        },
        trStyleClass: function () {
    		if(this.item.status === 'ER'){
    			return "fontStyle-cncl";
    		}
    	},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "sysCdMsg", 	label: "시스템",  		width: '15%', align: "left"},
        {key: "cm_svrname",	label: "서버명",  		width: '10%', align: "left"},
        {key: "cm_svrip", 	label: "IP Address",  	width: '20%', align: "left"},
        {key: "cm_portno", 	label: "PORT",  		width: '10%', align: "left"},
        {key: "cm_svrusr", 	label: "계정",  			width: '10%', align: "left"},
        {key: "cm_dir", 	label: "Agent설치위치",  	width: '25%', align: "left"},
        {key: "statusName", label: "Agent상태",  		width: '10%'},
    ]
});

$('[data-ax5select="cboSysCd"]').ax5select({
    options: []
});

$('input:radio[name^="radio"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});

$(document).ready(function() {
	$('#optErr').wRadio('check', true);
	getSysInfo();
	// 조회
	$('#btnQry').bind('click', function() {
		getAgentState();
	});
	// 등록
	$('#btnExcel').bind('click', function() {
		agentGrid.exportExcel('Agnet모니터링리스트.xls');
	});
});

// 조회
function getAgentState() {
	if (reqSw == true) {
		dialog.alert("현재 처리중입니다. 잠시 기다려 주시기 바랍니다.");
		return;
	}
	reqSw = true;
	var data = new Object();
	data = {
		sysCD 		: getSelectedVal('cboSysCd').value,
		sType 		: $(':input:radio[name=radio]:checked').val(),
		requestType	: 'getAgentState'
	}
	ajaxAsync('/webPage/administrator/AgentMornitoring', data, 'json',successGetAgentState);
}

// 조회 완료
function successGetAgentState(data) {
	agentGridData = data;
	agentGrid.setData(agentGridData);
	reqSw = false;
}

// 시스템 콤보 가져오기
function getSysInfo() {
	var data = new Object();
	data = {
		UserId 		: userId,
		SecuYn 		: 'N',
		SelMsg 		: 'ALL',
		CloseYn 	: 'N',
		ReqCd 		: '',
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/administrator/AgentMornitoring', data, 'json',successGetSysInfo);
}

// 시스템 콤보 가져오기 완료
function successGetSysInfo(data) {
	cboSysCdData = data;
	
	cboSysCdData = cboSysCdData.filter(function(data) {
		if(data.cm_sysinfo.substr(0,1) === '1') return false;
		else return true;
	});
	
	$('[data-ax5select="cboSysCd"]').ax5select({
      options: injectCboDataToArr(cboSysCdData, 'cm_syscd' , 'cm_sysmsg')
	});
}
