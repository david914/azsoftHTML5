/**
 * 커맨드수행 기능정의 화면
 * 
 * <pre>
 * 	작성자	: 김정우
 * 	버전 		: 1.0
 *  수정일 	: 2019-08-19
 * 
 */

var userName 			= window.top.userName;
var userid 				= window.top.userId;
var adminYN 			= window.top.adminYN;
var userDeptName		= window.top.userDeptName;
var userDeptCd 			= window.top.userDeptCd;
var strReqCD 			= window.top.reqCd;
var cmdGridData 		= null;
var cmdGrid				= new ax5.ui.grid();
var fileUploadModal		= new ax5.ui.modal();
var uploadCk = true;
var cboDbData				= [];

cmdGrid.setConfig({
    target: $('[data-ax5grid="cmdGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector : false,
	multipleSelect : false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 25,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {},
        trStyleClass: function () {
    	},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        
    ]
});

$('input:radio[name=cmdRadioGbn]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});
$('input:radio[name=cmdRadioUsr]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});
$('input:radio[name=cmdRadioFile]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});
$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

$(document).ready(function(){
	gbnSet();
	// 조회 버튼 클릭
	$('#btnQry').bind('click', function() {
		getRequest();
	});
	//구분 라디오 클릭
	$('[name="cmdRadioGbn"]').bind('click', function() {
		gbnSet();
	});
	//파일송수신 라디오 클릭
	$('[name="cmdRadioFile"]').bind('click', function() {
		btnSet();
	});
	//엑셀저장
	$("#btnExcel").on('click', function() {
		cmdGrid.exportExcel("쿼리.xls");
	})
	getCodeInfo();
});

function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('DBINFO','SEL','N'),
		]);
	cboDbData 	= codeInfos.DBINFO;
	
	$('[data-ax5select="cboDbUsrSel"]').ax5select({
        options: injectCboDataToArr(cboDbData, 'cm_micode' , 'cm_codename')
	});
}

function gbnSet(){
	if($('#rdocmd').is(':checked')){
		$('#lbtit').text('[ 수행 할 커맨드 입력 ]');
		$('#btnQry').text('커맨드 실행');
		$('[data-ax5grid="cmdGrid"]').hide();
		$('#txtrst').show();
		$('#txtrst').val('');
		$('#rdo2').show();
		$('#rdo3').hide();
		$('#cboDbUsrSel').hide();
		$('#btnExcel').hide();
		$('#chkViewDiv').css('visibility','visible');
		$('#txtChkView').text('수신파일 직접보기');
	} else if($('#rdoqry').is(':checked')) {
		$('#lbtit').text('[ 조회 할 쿼리문 입력 ]');
		$('#btnQry').text('쿼리 실행');
		$('[data-ax5grid="cmdGrid"]').show();
		$('#txtrst').hide();
		$('#rdo2').hide();
		$('#rdo3').hide();
		$('#cboDbUsrSel').show();
		$('#btnExcel').show();
		$('#chkViewDiv').css('visibility','hidden');
	} else if($('#optfile').is(':checked'))  {
		$('#lbtit').text('[ 송/수신 할 파일 입력 ]');
		$('#txtrst').show();
		$('#txtrst').val('');
		$('[data-ax5grid="cmdGrid"]').hide();
		$('[name="cmdRadioUsr"]').hide();
		$('#rdo2').hide();
		$('#rdo3').show();
		$('#cboDbUsrSel').hide();
		$('#btnExcel').hide();
		$('#chkViewDiv').css('visibility','hidden');
		btnSet();
	} else if($('#opturl').is(':checked'))  {
		$('#lbtit').text('[ 수행 할 URL 입력 ]');
		$('#btnQry').text('URL 실행');
		$('#txtrst').show();
		$('#txtrst').val('');
		$('[data-ax5grid="cmdGrid"]').hide();
		$('[name="cmdRadioUsr"]').hide();
		$('#rdo2').show();
		$('#rdo3').hide();
		$('#cboDbUsrSel').hide();
		$('#btnExcel').hide();
		$('#chkViewDiv').css('visibility','visible');
		$('#txtChkView').text('결과파일보기');
	}
}
function btnSet(){
	if($('#rdosend').is(':checked')) {
		$('#btnQry').text('파일선택');
		$('#chkViewDiv').css('visibility','hidden');
	} else{
		$('#btnQry').text('파일수신');
		$('#chkViewDiv').css('visibility','visible');
	}
}

function getRequest(){
	var cmdData = new Object();
	if($('#rdocmd').is(':checked')) {			//커맨드
		if($('#rdoap').is(':checked')){			//AP계정(agent 띄어져 있는 계정으로)
			execCmd('A');
		} else { 								//web계정 (web이 띄어져 있는 계정으로)
			execCmd('W');
		}
	} else if ($('#rdoqry').is(':checked')) {	//쿼리
		execQry();
	} else if ($('#optfile').is(':checked')) {	//파일 송수신
		if($('#rdosend').is(':checked')){
			execFile('S');	//송신
		} else {
			execFile('R');	//수신
		}
	} else if ($('#opturl').is(':checked')) {	//URL 호출
		if($('#rdoap').is(':checked')){			//AP계정(agent 띄어져 있는 계정으로)
			execUrl('UA');
		} else { 								//web계정 (web이 띄어져 있는 계정으로)
			execUrl('UW');
		}
	}
}


function execCmd(gbnCd){
	if(document.getElementById("txtcmd").value.trim()==""){
		alert('커맨드를 입력하여 주시기 바랍니다.');
		return;
	}
	var cmdData = new Object();
	cmdData.txtcmd 	= document.getElementById("txtcmd").value.trim();
	cmdData.userid  = userid;
	cmdData.gbnCd  	= gbnCd;
	if($('#chkView').is(':checked')) {
		cmdData.view	= 'ok';
	} else {
		cmdData.view	= 'no';
	}
	var data =  new Object();
	data = {
			requestType : 'getExecCmd',
			cmdData: cmdData
	}
	ajaxAsync('/webPage/administrator/CommandExcute', data, 'json',successGetCmdRst);
}
function successGetCmdRst(data) {
	if(data === '0'){	//성공
		var tmpData = {
			requestType: 	'SystemPath'
		}
		tmpPath = ajaxCallWithJson('/webPage/mypage/Notice', tmpData, 'json')+'/';
		if($('#chkView').is(':checked')) {
			if($('#rdoap').is(':checked')){
				tmpPath = tmpPath + userid + 'apcmd.out';
			} else {
				tmpPath = tmpPath + userid + 'webcmd.out';
			}
			fileView(tmpPath);
		}
		alert('커맨드 수행이 정상적으로 처리되었습니다.');
	} else {	//실패
		alert(data);
	}
}

function execQry(){
	if(getSelectedIndex('cboDbUsrSel') < 1) {
		alert('DB정보를 선택하여 주십시오.');
		return;
	}
	
	if(document.getElementById("txtcmd").value.trim()==""){
		alert('쿼리문을 입력하여 주시기 바랍니다.');
		return;
	}
	
	var cmdData = new Object();
	var txtqry = document.getElementById("txtcmd").value.trim();
	
	if(txtqry.charAt(txtqry.length-1) == ';'){
		txtqry = txtqry.substr(0, txtqry.length-1);
	}
	
	txtqry.substr(0,txtqry)
	cmdData.txtcmd 	= txtqry;
	cmdData.dbGbnCd 	= getSelectedVal('cboDbUsrSel').value;
	var data =  new Object();
	data = {
			requestType : 'getExecQry',
			cmdData: cmdData
	}
	ajaxAsync('/webPage/administrator/CommandExcute', data, 'json',successGetQryRst);
}

function successGetQryRst(data) {
	cmdGridData = data;
	var i = 0;
	var coladdcnt = 0;
	var colremovecnt = 0;
	
	if (cmdGridData.length<2){
		if (cmdGridData.length === 1){
			if(cmdGridData[0].ERROR == 'Y'){
				alert(cmdGridData[0].ERRMSG);
				return;
			}
			if(cmdGridData[0].readsw == 'N'){
				alert(cmdGridData[0].rowcnt + "건이 정상적으로 처리되었습니다. 조회쿼리로 확인하여 주시기 바랍니다.");
				return;
			}
		}
		alert("쿼리결과가 없습니다.");
		return;
	}
	if(cmdGridData.length>0){
		colremovecnt = cmdGrid.columns.length;
		//컬럼 전체 삭제
		for(i=0; i<colremovecnt; i++){
			cmdGrid.removeColumn(0);
		}
		
		//컬럼 추가
		coladdcnt = cmdGridData[0].colcount;
		for(i=0;coladdcnt>i;i++) {
			cmdGrid.addColumn({key: "col"+i,	label: eval("cmdGridData[0].col"+i),	width: '10%'});
		}
		cmdGrid.setData(cmdGridData);
		//첫번째 로우 삭제 - 컬렴명
		cmdGrid.removeRow(0);
		cmdGrid.repaint();
	}
}

function execFile(gbnCd){
	if (gbnCd=='S'){	//송신
		fileUploadModal.open({
	        width: 685,
	        height: 420,
	        iframe: {
	            method: "get",
	            url: "../modal/fileupload/CmdFileUpload.jsp",
	            param: "callBack=modalCallBack"
		    },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	            }
	        }
		});
	} else {	//수신
		if($('#chkView').is(':checked')) {	//직접보기
			fileView(document.getElementById("txtcmd").value.trim());
		} else {	// 로컬다운	
			//로컬로 파일 다운
			if(document.getElementById("txtcmd").value.trim()==""){
				alert('수신 할 파일에 대한 디렉토리와 파일명(FullPath)을 입력하여 주시기 바랍니다.');
				return;
			}
			var fullpath=document.getElementById("txtcmd").value.trim();
			location.href = '/webPage/fileupload/upload?&fullPath='+fullpath+'&fileName='+fullpath.substr(fullpath.lastIndexOf('/')+1);
		}
	}
}
function fileView(txtcmd){
	var cmdData = new Object();
	cmdData.txtcmd 	= txtcmd;
	var data =  new Object();
	data = {
			requestType : 'getFileView',
			cmdData: cmdData
	}
	ajaxAsync('/webPage/administrator/CommandExcute', data, 'json',successgetFileView);
}
function successgetFileView(data) {
	if (data.length < 2){
		alert('파일 수신 중 오류가 발생하였습니다.');
		return;
	} 
	if (data.substr(0,2)==='ER'){
		alert(data.substr(2));
		return;
	} else {
		$('#txtrst').val(data.substr(2));
	}
}

function execUrl(gbnCd){
	if(document.getElementById("txtcmd").value.trim()==""){
		alert('커맨드를 입력하여 주시기 바랍니다.');
		return;
	}
	var tmpData = {
		requestType: 	'SystemPath'
	}
	tmpPath = ajaxCallWithJson('/webPage/mypage/Notice', tmpData, 'json')+'/';
	
	var cmdData = new Object();
	cmdData.txtcmd 	= document.getElementById("txtcmd").value.trim();
	cmdData.userid  = userid;
	cmdData.gbnCd  	= gbnCd;
	cmdData.savePath= tmpPath;
	
	if($('#chkView').is(':checked')) {
		cmdData.view	= 'ok';
	} else {
		cmdData.view	= 'no';
	}
	var data =  new Object();
	data = {
			requestType : 'getRemoteUrl',
			cmdData: cmdData
	}
	ajaxAsync('/webPage/administrator/CommandExcute', data, 'json',successGetUrlRst);
}
function successGetUrlRst(data) {
	if(data.substring(0,2) == 'ER'){
		alert("실패 하였습니다."+data);
	} else if($('#chkView').is(':checked')) {	//직접보기
		alert("완료 하였습니다."+data.trim());
		fileView(data.trim());
	}
}
