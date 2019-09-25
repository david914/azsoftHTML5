/**
 * 시스템상세정보 팝업 [서버정보] 화면 기능 정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-05-31
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var sysCd 	= null;	// 시스템정보 선택 코드
var sysInfo = null;	// 시스템 속성
var dirBase = null; // 기준서버

var svrInfoGrid		= new ax5.ui.grid();
var svrInfoGridData = null;

var cboSvrData 		= null;
var cboOsData 		= null;
var cboBufferData 	= null;
var svrInfoData		= null;
var cboOptions		= null;
var selectedSystem  = window.parent.selectedSystem;


var selSw			= false;

///////////////////// 서버정보 화면 세팅 start////////////////////////////////////////////////
$('[data-ax5select="cboSvr"]').ax5select({
    options: []
});

$('[data-ax5select="cboSvrUsr"]').ax5select({
    options: []
});

$('[data-ax5select="cboOs"]').ax5select({
    options: []
});

$('[data-ax5select="cboBuffer"]').ax5select({
    options: []
});


svrInfoGrid.setConfig({
    target: $('[data-ax5grid="svrInfoGrid"]'),
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
            clickSvrList(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_codename", 	label: "서버구분",		width: 120 , align: "left"},
        {key: "cm_svrname", 	label: "서버명",  	width: 120 , align: "left"},
        {key: "sysos", 			label: "OS",  		width: 80},
        {key: "cm_svrip", 		label: "IP Address",width: 120},
        {key: "cm_portno", 		label: "Port",  	width: 80},
        {key: "cm_prcseq", 		label: "순서",  		width: 80},
        {key: "cm_svrusr", 		label: "계정",  		width: 80},
        {key: "cm_volpath", 	label: "Home_Dir",  width: 150, align: "left" },
        {key: "cm_dir", 		label: "Agent_Dir", width: 130, align: "left" },
        {key: "ab", 			label: "버퍼사이즈", 	width: 80 , align: "left" },
        {key: "svrinfo", 		label: "속성",  		width: 150, align: "left"},
        {key: "agent", 			label: "장애",  		width: 80},
        {key: "svrstop", 		label: "정지",  		width: 80}
    ]
});
$('input.checkbox-IP').wCheck({theme: 'square-classic blue', selector: 'checkmark', highlightLabel: true});
$('input.checkbox-IPC').wCheck({theme: 'square-classic blue', selector: 'checkmark', highlightLabel: true});
/////////////////// 서버정보 화면 세팅 end////////////////////////////////////////////////


$(document).ready(function(){
	sysCd = selectedSystem.cm_syscd;
	sysInfo = selectedSystem.cm_sysinfo;
	dirBase = selectedSystem.cm_dirbase;
	
	$('#dibChkBase').css('display', 'none');
	$('#lblAftIp').css('visibility','hidden');
	$('#txtAftIp').css('visibility','hidden');
	$('#lblSysMsg').text('시스템 : ' + selectedSystem.cm_syscd + ' ' + selectedSystem.cm_sysmsg);
	
	_promise(50,getCodeInfo())
		.then(function(){
			return _promise(50,getSvrInfoList());
		});
	
	
	$('#txtPort').keyup(function (event) { 
		var v = $(this).val();
		$(this).val(v.replace(/[^a-z0-9]/gi,''));
	});
	
	$('#txtSeq').keyup(function (event) { 
		var v = $(this).val();
		$(this).val(v.replace(/[^a-z0-9]/gi,''));
	});
	
	$('#chkAllSvr').bind('click',function() {
		clickChkAllSvr($('#chkAllSvr').is(':checked'));
	});
	
	$('#chkIp').bind('click',function() {
		if($('#chkIp').is(':checked')) {
			if($('#chkIpC').is(':checked')) {
				$('#chkIpC').wCheck('check',false);
			}
			$('#lblAftIp').css('visibility','visible');
			$('#txtAftIp').css('visibility','visible');
		} 
		if(!$('#chkIp').is(':checked') && !$('#chkIpC').is(':checked')){
			$('#lblAftIp').css('visibility','hidden');
			$('#txtAftIp').css('visibility','hidden');
		}
	});
	
	$('#chkIpC').bind('click',function() {
		if($('#chkIpC').is(':checked')) {
			if($('#chkIp').is(':checked')) {
				$('#chkIp').wCheck('check',false);
			}
			$('#lblAftIp').css('visibility','visible');
			$('#txtAftIp').css('visibility','visible');
		} 
		
		if(!$('#chkIp').is(':checked') && !$('#chkIpC').is(':checked')){
			$('#lblAftIp').css('visibility','hidden');
			$('#txtAftIp').css('visibility','hidden');
		}
	});
	
	// 등록 클릭
	$('#btnReq').bind('click', function() {
		checkSvrVal(1);
	});
	
	// 수정 클릭
	$('#btnUpdt').bind('click', function() {
		checkSvrVal(2);
	});
	
	// 폐기 클릭
	$('#btnCls').bind('click', function() {
		var selIndex = svrInfoGrid.selectedDataIndexs;
		if(selIndex.length < 1) {
			dialog.alert('폐기 그리드를 선택해주세요.', function(){});
			return;
		}
		
		closeSvr();
	});
	
	// 조회 클릭
	$('#btnQry').bind('click', function() {
		getSvrInfoList();
	});
	
	// 엑셀저장 클릭
	$('#btnExl').bind('click',function () {
		svrInfoGrid.exportExcel('['+selectedSystem.cm_sysmsg+']시스템상세정보.xls');
	});
	
	// 닫기 클릭
	$('#btnExit').bind('click', function() {
		popClose();
	});
	
});


/////////////////////// 서버정보 버튼 function start////////////////////////////////////////////////
function closeSvr() {
	var selIndex 	= svrInfoGrid.selectedDataIndexs;
	var selSvrItem 	= svrInfoGrid.list[selIndex];
	var txtSvrIp 	= $('#txtSvrIp').val().trim();
	var txtUser 	= $('#txtUser').val().trim();
	var tmpSeq		= '';
	if(selIndex.length < 1) {
		dialog.alert('수정할 그리드를 선택해주세요.', function(){});
		return;
	}
	
	if(txtSvrIp.length === 0 ) {
		dialog.alert('서버IP를 입력하여 주시기 바랍니다.', function(){});
		return;
	}
	
	if(txtUser.length === 0 ) {
		dialog.alert('계정을 입력하여 주시기 바랍니다.', function(){});
		return;
	}
	
	if(selSvrItem.cm_svrcd == getSelectedVal('cboSvr').value 
			&& selSvrItem.cm_svrip == txtSvrIp
			&& selSvrItem.cm_svrusr == txtUser) {
		tmpSeq = selSvrItem.cm_seqno;
	}
	
	if(tmpSeq.length <= 0 ) {
		dialog.alert('선택한 그리드의 정보와 현재 정보가 다릅니다. 다시 선택 후 눌러주세요.',function(){});
		return;
	}
	
	var svrCloseData = new Object();
	svrCloseData = {
		SysCd	: sysCd,
		UserId	: userId,
		SvrCd 	: getSelectedVal('cboSvr').value ,
		SeqNo 	: tmpSeq,
		requestType	: 'closeSvr'
	}
	ajaxAsync('/webPage/tab/sysinfo/SvrServlet', svrCloseData, 'json',successSvrClose);
}

function successSvrClose(data) {
	dialog.alert('시스템상세정보 폐기처리를 완료하였습니다.',function(){getSvrInfoList();});
}

function checkSvrVal(gbnCd) {
	if(gbnCd === 2) {
		var selIndex = svrInfoGrid.selectedDataIndexs;
		if(selIndex.length < 1) {
			dialog.alert('수정할 그리드를 선택해주세요.', function(){});
			return;
		}
		$('#chkIp').wCheck('check',false);
		$('#chkIpC').wCheck('check',false);
	}
	var txtSvrName 	= $('#txtSvrName').val().trim();
	var txtSvrIp 	= $('#txtSvrIp').val().trim();
	var txtPort 	= $('#txtPort').val().trim();
	var txtSeq 		= $('#txtSeq').val().trim();
	var txtHome 	= $('#txtHome').val().trim();
	var txtDir 		= $('#txtDir').val().trim();
	var txtUser 	= $('#txtUser').val().trim();
	var txtAftIp	= $('#txtAftIp').val().trim();
	var rquestType	= '';
	
	if(txtSvrName.length === 0 ) {
		dialog.alert('서버명을 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	if(txtSvrIp.length === 0 ) {
		dialog.alert('서버IP를 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	if(txtPort.length === 0 ) {
		dialog.alert('Port를 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	if(txtSeq.length === 0 ) {
		dialog.alert('순서를 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	if(txtHome.length === 0 ) {
		dialog.alert('Home-Dir을 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	if(txtDir.length === 0 ) {
		dialog.alert('형상관리설치디렉토리(Agent-Dir)을 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	if(txtUser.length === 0 ) {
		dialog.alert('계정을 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if($('#chkIp').is(':checked') || $('#chkIpC').is(':checked')) {
		if(txtAftIp.length === 0) {
			dialog.alert('변경할 IP를 입력하여 주시기 바랍니다.',function(){});
			return;
		}
		
		if(txtAftIp === txtSvrIp) {
			dialog.alert('변경전/후 IP가 동일합니다.',function(){});
			return;
		}
	}
	
	var svrReqInfoData 	= new Object();
	var svrReqInfo 		= new Object();
	var svrUser			= '';
	if(gbnCd === 2) {
		var selIndex = svrInfoGrid.selectedDataIndexs;
		var selSvrItem = svrInfoGrid.list[selIndex];
		svrReqInfo.cm_svrcd = selSvrItem.cm_svrcd;
		svrReqInfo.cm_seqno = selSvrItem.cm_seqno;
	} else {
		svrReqInfo.cm_svrcd = getSelectedVal('cboSvr').value;
	}
	
	svrReqInfo.cm_sysos 	= getSelectedVal('cboOs').value;
	svrReqInfo.cm_buffsize 	= getSelectedVal('cboBuffer').value;

	svrReqInfo.gbncd 		= String(gbnCd);
	svrReqInfo.cm_syscd 	= sysCd;
	svrReqInfo.cm_svrname 	= txtSvrName;
	svrReqInfo.cm_svrip 	= txtSvrIp;
	svrReqInfo.cm_portno 	= txtPort;
	svrReqInfo.cm_prcseq	= txtSeq;
	svrReqInfo.cm_svrusr 	= txtUser;
	svrReqInfo.cm_volpath 	= txtHome;
	svrReqInfo.cm_dir 		= txtDir;
	svrReqInfo.basesvr 		= dirBase;
	svrReqInfo.cm_ftppass 	= $('#txtPass').val().trim();
	svrReqInfo.cm_samedir 	= $('#txtTmp').val().trim();
	
	if($('#chkErr').is(':checked'))  svrReqInfo.cm_agent = 'ER';
	if($('#chkStop').is(':checked')) svrReqInfo.cm_svrstop = 'Y';
	else svrReqInfo.cm_svrstop = 'N';
	if($('#chkLogView').is(':checked')) svrReqInfo.cm_logview = 'Y';
	else svrReqInfo.cm_logview = 'N';
	
	
	for(var i=0; i<svrInfoData.length; i++) {
		svrUser += $('#chkSvrName' + Number(svrInfoData[i].cm_micode)).is(':checked') ? '1' : '0';
	}
	
	if(svrReqInfo.cm_svrcd === dirBase) {
		if($('#chkBase').is(':checked')) svrReqInfo.dirbase = 'Y';
		else svrReqInfo.dirbase = 'N';
	} else {
		svrReqInfo.dirbase = 'N';
	}
	
	if($('#chkIp').is(':checked') || $('#chkIpC').is(':checked')) svrReqInfo.aftip = txtAftIp;
	if($('#chkIp').is(':checked')) {
		rquestType = 'svrInAnUp';
	}
	if($('#chkIpC').is(':checked')) {
		rquestType = 'svrCopy';
	}
	if(!$('#chkIp').is(':checked') && !$('#chkIpC').is(':checked')) {
		rquestType = 'svrIn';
	}
	svrReqInfo.cm_svruse = svrUser;
	svrReqInfo.cm_editor = userId;
	
	svrReqInfoData = {
		svrReqInfo	: svrReqInfo,
		requestType	: rquestType
	}
	
	if(rquestType === 'svrInAnUp') {
		ajaxAsync('/webPage/tab/sysinfo/SvrServlet', svrReqInfoData, 'json',successSvrInAnUp);
	} 
	
	if(rquestType === 'svrCopy') {
		ajaxAsync('/webPage/tab/sysinfo/SvrServlet', svrReqInfoData, 'json',successSvrCopy);
	}
	
	if(rquestType === 'svrIn') {
		ajaxAsync('/webPage/tab/sysinfo/SvrServlet', svrReqInfoData, 'json',successSvrIn);
	}
	
};

function successSvrInAnUp(data) {
	if(data != 'OK') {
		dialog.alert(data,function(){});
	} else {
		dialog.alert('서버 IP변경 후 복사 처리를 완료하였습니다.',function(){getSvrInfoList();});
	}
}
function successSvrCopy(data) {
	if(data != 'OK') {
		dialog.alert(data,function(){});
	} else {
		dialog.alert('서버 IP변경 처리를 완료하였습니다.',function(){getSvrInfoList();});
	}
	
}
function successSvrIn(data) {
	dialog.alert('서버정보 등록처리를 완료하였습니다.',function(){getSvrInfoList();});
}


function getSvrInfoList() {
	var svrInfoStr = '';
	svrInfoData.forEach(function(svrItem,index) {
		if(svrInfoStr.length > 0) svrInfoStr += ',';
		svrInfoStr += svrItem.cm_codename;
	});
	var svrInfo = new Object();
	svrInfo = {
		sysCd		: sysCd,
		svrInfoStr	: svrInfoStr,
		requestType	: 'getSvrInfoList'
	}
	ajaxAsync('/webPage/tab/sysinfo/SvrServlet', svrInfo, 'json',successGetSvrInfoList);
}

function successGetSvrInfoList(data) {
	svrInfoGridData = data;
	svrInfoGrid.setData(svrInfoGridData);
}

function popClose(){
	window.parent.parent.sysDetailModal.close();
}

function clickSvrList(selIndex) {
	var selItem = svrInfoGrid.list[selIndex];
	var svruse 	= selItem.cm_svruse;
	
	// 서버 콤보 채인지 이벤트 추가 해야함
	$('[data-ax5select="cboSvr"]').ax5select('setValue',selItem.cm_svrcd,true);
	$('[data-ax5select="cboOs"]').ax5select('setValue',selItem.cm_sysos,true);
	
	for(var i=0; i<cboBufferData.length; i++) {
		if(cboBufferData[i].cm_codename === selItem.ab) {
			$('[data-ax5select="cboBuffer"]').ax5select('setValue', cboBufferData[i].cm_micode, true);
			break;
		}
	}
	
	if(selItem.cm_svrcd == dirBase && selItem.cm_cmpsvr == 'Y') {
		$('#chkBase').wCheck('check',true);
	} else {
		$('#chkBase').wCheck('check',false);
	}

	if(selItem.cm_svrcd === '01') {
		$('#dibChkBase').css('display', '');
	} else {
		$('#dibChkBase').css('display', 'none');
	}
	
	if(selItem.agent === '정상') {
		$('#chkErr').wCheck('check', false);
	} else {
		$('#chkErr').wCheck('check', true);
	}
	
	if(selItem.svrstop === 'NO') {
		$('#chkStop').wCheck('check', false);
	} else {
		$('#chkStop').wCheck('check', true);
	}
	
	if(selItem.logview === 'N') {
		$('#chkLogView').wCheck('check', false);
	} else {
		$('#chkLogView').wCheck('check', true);
	}
	
	$('#txtSvrName').val(selItem.cm_svrname);
	$('#txtSvrIp').val(selItem.cm_svrip);
	$('#txtPort').val(selItem.cm_portno);
	$('#txtSeq').val(selItem.cm_prcseq);
	$('#txtUser').val(selItem.cm_svrusr);
	$('#txtPass').val(selItem.cm_ftppass);
	$('#txtHome').val(selItem.cm_volpath);
	$('#txtDir').val(selItem.cm_dir);
	$('#txtTmp').val(selItem.cm_samedir);
	
	clickChkAllSvr(false);
	
	for(var i=0; i<svruse.length; i++) {
		if(svruse.substr(i,1) === '1') {
			$('#chkSvrName'+ (i+1) ).wCheck('check',true);
		}
	}
	
}

function clickChkAllSvr(checked){
	if(checked) {
		for(var i=0; i<svrInfoData.length; i++) {
			$('#chkSvrName'+ (i+1) ).wCheck('check',true);
		}
	}
	
	if(!checked) {
		for(var i=0; i<svrInfoData.length; i++) {
			$('#chkSvrName'+ (i+1) ).wCheck('check',false);
		}
	}
}

function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('SERVERCD','','N'),
		new CodeInfo('SYSOS','','N'), 
		new CodeInfo('SVRINFO','','N'),
		new CodeInfo('BUFFSIZE','','N'),
		]);
	cboSvrData 		= codeInfos.SERVERCD;
	cboOsData		= codeInfos.SYSOS;
	svrInfoData 	= codeInfos.SVRINFO;
	cboBufferData 	= codeInfos.BUFFSIZE;
	
	
	cboOptions = [];
	$.each(cboSvrData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	$('[data-ax5select="cboSvr"]').ax5select({
        options: cboOptions
	});
	
	$('[data-ax5select="cboSvrUsr"]').ax5select({
        options: cboOptions
	});
	
	cboOptions = [];
	$.each(cboOsData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	$('[data-ax5select="cboOs"]').ax5select({
        options: cboOptions
	});
	
	cboOptions = [];
	$.each(cboBufferData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	$('[data-ax5select="cboBuffer"]').ax5select({
        options: cboOptions
	});
	
	
	$('#ulSyrInfo').empty();
	var liStr = null;
	var addId = null;
	svrInfoData.forEach(function(svrInfoItem, sysInfoIndex) {
		addId = Number(svrInfoItem.cm_micode);
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '	<input type="checkbox" class="checkbox-svrInfo" id="chkSvrName'+addId+'" data-label="'+svrInfoItem.cm_codename+'"  value="'+svrInfoItem.cm_micode+'" />';
		liStr += '</li>';
		$('#ulSyrInfo').append(liStr);
	});
	
	$('input.checkbox-svrInfo').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
}
///////////////////// 서버정보 버튼 function end////////////////////////////////////////////////
