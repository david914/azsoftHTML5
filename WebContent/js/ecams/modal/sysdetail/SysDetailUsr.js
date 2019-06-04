/**
 * 시스템상세정보 팝업 화면 기능 정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-05-31
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;		// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;	// 부서코드
var selectedSystem  = window.parent.selectedSystem;

var sysCd 	= null;	// 시스템정보 선택 코드
var sysInfo = null;	// 시스템 속성
var dirBase = null; // 기준서버

var svrUsrGrid		= new ax5.ui.grid();
var accGrid			= new ax5.ui.grid();
var svrUsrGridData 	= null;
var accGridData 	= null;

var cboSvrData 		= null;
var cboOptions		= null;
var ulSvrInfoData	= null;

var selSw			= false;

/////////////////// 계정정보 화면 세팅 start////////////////////////////////////////////////
svrUsrGrid.setConfig({
    target: $('[data-ax5grid="svrUsrGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 20,
        onClick: function () {
            this.self.select(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_codename", label: "서버종류",  width: 120 },
        {key: "cm_svrname", label: "서버명/OS",  width: 120},
        {key: "cm_svrip", label: "IP Address",  width: 120},
        {key: "cm_portno", label: "Port",  width: 80, align: "center"}
    ]
});

accGrid.setConfig({
    target: $('[data-ax5grid="accGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 20,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            clickAccGrid(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_codename", label: "서버구분",  width: 120 , align: "center"},
        {key: "cm_svrname", label: "서버명",  width: 120, align: "center"},
        {key: "cm_svrip", label: "IP Address",  width: 120, align: "center"},
        {key: "cm_portno", label: "Port",  width: 80, align: "center"},
        {key: "cm_svrusr", label: "계정",  width: 80, align: "center"},
        {key: "cm_svrusr", label: "계정",  width: 150, align: "center"},
        {key: "cm_jobname", label: "업무명",  width: 130, align: "center"},
        {key: "cm_grpid", label: "그룹",  width: 80, align: "center"},
        {key: "cm_permission", label: "권한",  width: 150, align: "center"},
        {key: "cm_dbuser", label: "DB계정",  width: 80, align: "center"},
        {key: "cm_dbconn", label: "DB연결자",  width: 80, align: "center"}
    ]
});


$('input.checkbox-usr').wCheck({theme: 'square-classic red', selector: 'checkmark', highlightLabel: true});
$('input.checkbox-usr').wCheck({theme: 'square-classic red', selector: 'checkmark', highlightLabel: true});

/////////////////// 계정정보 화면 세팅 end////////////////////////////////////////////////


$(document).ready(function(){
	sysCd = selectedSystem.cm_syscd;
	sysInfo = selectedSystem.cm_sysinfo;
	dirBase = selectedSystem.cm_dirbase;
	
	// 업무별 서버관리
	if(sysInfo.substr(8,1) === '1') {
		getUlSvrInfo();
		//sysjob.getJobInfo_Rpt(strUserId,strSysCd,"N","");
		//chkAll3.enabled = true;  계정정보탭의 전체선택 사용가능
	} else  {
		//chkAll3.enabled = false; 계정정보탭의 전체선택 사용가능
	}
	
	_promise(500,getCodeInfo())
		.then(function(){
			return _promise(500,$('#cboSvrUsr').trigger('change'));
		})
		.then(function() {
			return _promise(500,getSecuList());
		});
	
	
	/////////////////////// 계정정보 버튼 event end////////////////////////////////////////////////
	$('#cboSvrUsr').bind('change',function(){
		console.log('서버종류 콤보 change');
		
		$('#chkAllUsr').wCheck('check',false);
		
		if(sysInfo.substr(8,1) === '1') {
			// 사용업무 사용가능하게
		} else {
			// 사용업무 사용 불가능하게
		}
		
		//selSw = false;
		var svrUsrInfoData = new Object();
		svrUsrInfoData = {
			SysCd	: sysCd,
			SvrCd 	: $('[data-ax5select="cboSvrUsr"]').ax5select("getValue")[0].value ,
			requestType	: 'getSvrUsrInfo'
		}
		ajaxAsync('/webPage/administrator/SvrUsrServlet', svrUsrInfoData, 'json',successGetSvrUsrInfo);

	});
	
	// 계정정보 닫기 버튼 클릭
	$('#btnExitUsr').bind('click', function() {
		popClose();
	});
	
	// 계정정보 등록 버튼 클릭
	$('#btnReqUsr').bind('click', function() {
		checkValUsr();
	});
	
	// 계정정보 폐기 버튼 클릭
	$('#btnUsrClose').bind('click',function() {
		
	});
	
	// 계정정보 조회버튼 클릭
	$('#btnQryUsr').bind('click', function() {
		getSecuList();
	});
	
	$('#chkAllSvrJob').bind('click', function() {
		if($('#chkAllSvrJob').is(':checked')) {
			
			
			
		}
		
		if(!$('#chkAllSvrJob').is(':checked')) {
			
		}
		
	})
	/////////////////////// 계정정보 버튼 event end////////////////////////////////////////////////
});

// 계정정보 등록 유효성 체크
function checkValUsr() {
	var jobSw 		= false;
	var dbSw		= false;
	var fileSw		= false;
	var svrSelIndex = svrUsrGrid.selectedDataIndexs;
	var txtSvrUsr 	= $('#txtSvrUsr').val().trim();
	var txtGroup 	= $('#txtGroup').val().trim();
	var txtMode 	= $('#txtMode').val().trim();
	var txtDbUsr 	= $('#txtDbUsr').val().trim();
	var txtDbPass 	= $('#txtDbPass').val().trim();
	var txtDbConn 	= $('#txtDbConn').val().trim();
	var svrArry		= [];
	var tmpJob		= '';
	if(svrSelIndex.length < 1) {
		dialog.alert('등록할 서버를 선택한 후 처리하시기 바랍니다.', function(){});
		return;
	}
	
	if (sysInfo.substr(8,1) == "1") {
		ulSvrInfoData.forEach(function(jobItem, index) {
			var id = Number(jobItem.cm_jobcd);
			if( $('#chkJob'+id).is(':checked')) jobSw = true;
				
		});
		
		if(!jobSw) {
			dialog.alert('등록할 업무를 선택한 후 처리하시기 바랍니다.', function(){});
			return;
		}
	}
	
	svrUsrGridData.forEach(function(svrItem, index) {
		if(svrItem.cm_svruse.substr(0,1) === '1') filesw = true;
		if(svrItem.cm_svruse.substr(2,1) === '1') dbSw = true;
	});
	
	if( fileSw &&  txtMode.length === 0) {
		dialog.alert('파일의 권한을 입력하여 주시기 바랍니다.', function(){});
		return;
	}
	
	if(dbSw) {
		if(txtDbUsr.length === 0) {
			dialog.alert('DB계정을 입력하여 주시기 바랍니다.', 	function(){});
			return;
		}
		if(txtDbPass.length === 0) {
			dialog.alert('DB비밀번호를 입력하여 주시기 바랍니다.', function(){});
			return;
		}
		if(txtDbConn.length === 0) {
			dialog.alert('DB연결자를 입력하여 주시기 바랍니다.', 	function(){});
			return;
		}
	}
	
	svrSelIndex.forEach(function(indexItem, index) {
		var selSvrItem = svrUsrGrid.list[indexItem];
		svrArry.push(selSvrItem);
	});
	
	if (sysInfo.substr(8,1) == "1") {
		ulSvrInfoData.forEach(function(jobItem, index) {
			var id = Number(jobItem.cm_jobcd);
			if( $('#chkJob'+id).is(':checked')) {
				if(tmpJob.length > 0 ) tmpJob += ',';
				else tmpJob +=  $('#chkJob'+id).val();
			}
		});
	} else {
		tmpJob = '****';
	}
	var etcData = new Object();
	etcData.cm_syscd 	= sysCd;
	etcData.cm_svrusr 	= txtSvrUsr;
	etcData.cm_grpid 	= txtGroup;
	etcData.cm_permission = txtMode;
	etcData.dbuser 	= txtDbUsr;
	etcData.dbpass 	= txtDbPass;
	etcData.dbconn 	= txtDbConn;
	etcData.jobcd 	= tmpJob;
	var usrReqData = new Object();
	usrReqData = {
		etcData		: etcData,
		svrList 	: svrArry,
		requestType	: 'insertSecuInfo'
	}
	ajaxAsync('/webPage/administrator/SvrUsrServlet', usrReqData, 'json',successUsrReq);
	
}

function successUsrReq(data) {
	if(data === 'OK') {
		getSecuList();
	} else {
		dialog.alert('계정정보 등록중 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.', function(){});
	}
	
}
function getSecuList() {
	var secuInfoData = new Object();
	secuInfoData = {
		SysCd		: sysCd,
		sysInfo 	: sysInfo,
		requestType	: 'getSecuList'
	}
	ajaxAsync('/webPage/administrator/SvrUsrServlet', secuInfoData, 'json',successGetSecuList);
}

function successGetSecuList(data) {
	accGridData = data;
	accGrid.setData(accGridData);
}

/////////////////// 계정정보 버튼 function start////////////////////////////////////////////////
function popClose(){
	window.parent.parent.sysDetailModal.close();
}

function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('SERVERCD','','N')
		]);
	cboSvrData 		= codeInfos.SERVERCD;
	
	
	cboOptions = [];
	$.each(cboSvrData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboSvrUsr"]').ax5select({
        options: cboOptions
	});
	
	cboOptions = [];
}

function successGetSvrUsrInfo(data) {
	svrUsrGridData = data;
	svrUsrGrid.setData(svrUsrGridData);
	var accSelIndex = accGrid.selectedDataIndexs;
	var accSelItem = accGrid.list[accSelIndex];
	if(selSw && accSelIndex.length !== 0) {
		svrUsrGridData.forEach(function(svrUsrItem, index) {
			if(svrUsrItem.cm_micode === accSelItem.cm_svrcd 
					&& svrUsrItem.cm_seqno === accSelItem.cm_seqno) {
				svrUsrGrid.select(index);
				selSw = false;
			}
		});
	}
}

// 사용업무 
function getUlSvrInfo() {
	var ulSvrInfoData = new Object();
	ulSvrInfoData = {
		UserID	: userId,
		SysCd 	: sysCd ,
		CloseYn : 'N',
		SelMsg : '',
		requestType	: 'getUlSvrInfo'
	}
	ajaxAsync('/webPage/administrator/SvrUsrServlet', ulSvrInfoData, 'json',successGetUlSvrInfo);
}

function successGetUlSvrInfo(data) {
	
	ulSvrInfoData = data;
	
	$('#ulSvrInfo').empty();
	var liStr = null;
	var addId = null;
	console.log('check');
	console.log(ulSvrInfoData);
	for(var i=0; i< ulSvrInfoData.length; i++) {
		var svrinfoItem = ulSvrInfoData[i];
		addId = Number(svrinfoItem.cm_jobcd);
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '	<input type="checkbox" class="checkbox-svrinfo" id="chkJob'+addId+'" data-label="'+svrinfoItem.cm_jobname+'"  value="'+svrinfoItem.cm_jobcd+'" />';
		liStr += '</li>';
		console.log(liStr);
		$('#ulSvrInfo').append(liStr);
	}
	/*ulSvrInfoData.forEach(function(svrinfoItem, sysInfoIndex) {
		
		addId = Number(svrinfoItem.cm_jobcd);
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '	<input type="checkbox" class="checkbox-svrinfo" id="chkJob'+cm_jobcd+'" data-label="'+svrinfoItem.cm_jobname+'"  value="'+svrinfoItem.cm_jobcd+'" />';
		liStr += '</li>';
		console.log(liStr);
		$('#ulSvrInfo').append(liStr);
	});*/
	
	$('input.checkbox-svrinfo').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
}

function clickAccGrid(selIndex) {
/*	var i:int = 0;
	var tmpInfo:String = "";
	
	if (grdAcc.selectedIndex < 0) return;
	for (i=0;cboSvr2_dp.length>i;i++) {
		if (cboSvr2_dp.getItemAt(i).cm_micode == grdAcc.selectedItem.cm_svrcd) {
			cboSvr2.selectedIndex = i;
			break;
		}
	}
	selSw = true;
	Cmm0200_Copy.getSvrInfo(strSysCd,grdAcc.selectedItem.cm_svrcd);
		txtSvrUsr.text = grdAcc.selectedItem.cm_svrusr;
	txtGroup.text = grdAcc.selectedItem.cm_grpid;
	txtMode.text = grdAcc.selectedItem.cm_permission;
	txtDbUsr.text = grdAcc.selectedItem.cm_dbuser;	
	txtDbConn.text = grdAcc.selectedItem.cm_dbconn;
	txtDbPass.text = grdAcc.selectedItem.cm_dbpass;
		chkAll3.selected = false;
	chkAll3_Click();
	
	for (i=0;lstJob_dp.length>i;i++) {
		if (grdAcc.selectedItem.cm_jobcd == lstJob_dp.getItemAt(i).cm_jobcd) { 
		   lstJob_dp.getItemAt(i).checkbox = true;
		   break;
		}
	}
	lstJob_dp.refresh();
*/	
	
	var selItem = accGrid.list[selIndex];
	selSw = true;
	
	$('#txtSvrUsr').val(selItem.cm_svrusr);
	$('#txtGroup').val(selItem.cm_grpid);
	$('#txtMode').val(selItem.cm_permission);
	$('#txtDbUsr').val(selItem.cm_dbuser);
	$('#txtDbConn').val(selItem.cm_dbconn);
	$('#txtDbPass').val(selItem.cm_dbpass);
	
	$('#chkAllSvrJob').wCheck('check',false);
	
	$('[data-ax5select="cboSvrUsr"]').ax5select('setValue',selItem.cm_svrcd,true);
	$('#cboSvrUsr').trigger('change');
	
}
/////////////////// 계정정보 버튼 function end////////////////////////////////////////////////
