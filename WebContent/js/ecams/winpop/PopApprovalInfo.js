/**
 * [공통 > 결재정보] 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-07-10
 * 
 */
var userId 	= $('#userId').val();
var acptNo 	= $('#acptNo').val();

var approvalGrid	= new ax5.ui.grid();

var approvalGridData= [];
var cboBlankData 	= [];
var cboSayuData 	= [];
var cboUserData 	= [];

var reqSta 		= null;
var strPassOk 	= null;
var HoliGbn 	= null;
var strEditor 	= null;
var strNxtSign 	= null;
var strAdmin	= null;

approvalGrid.setConfig({
    target: $('[data-ax5grid="approvalGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 25,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            clickApprovalGrid(this.dindex);
        },
        onDBLClick: function () {},
        trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "confname", 	label: "결재단계명",  	width: '10%', align: "left"},
        {key: "team",		label: "결재자",  		width: '10%'},
        {key: "teamcd", 	label: "구분",  		width: '10%'},
        {key: "confdate", 	label: "결재일시",  	width: '15%'},
        {key: "baseuser", 	label: "원결재자",  	width: '10%'},
        {key: "conmsg", 	label: "결재의견",  	width: '45%', align: "left"},
    ]
});

$('[data-ax5select="cboBlank"]').ax5select({
    options: []
});

$('[data-ax5select="cboSayu"]').ax5select({
	options: []
});

$('[data-ax5select="cboUser"]').ax5select({
	options: []
});

$(document).ready(function() {
	$('#txtAcpt').val(acptNo.substr(0,4) + '-' + acptNo.substr(4,2) + '-' +acptNo.substr(6,6));
	
	screenInit();
	
	// 변경 후 결재 변경시
	$('#cboBlank').bind('change', function() {
		if(getSelectedVal('cboBlank').value === '3') {
			$('#divUser').css('visibility', 'visible');
			selectUser();
		} else {
			$('#divUser').css('visibility', 'hidden');
		}
	});
	
	// 수정 클릭
	$('#btnUpdate').bind('click', function() {
		updateProc();
	});
	
	// 닫기 클릭
	$('#btnClose').bind('click', function() {
		window.close();
	});
});

// 정보가져오기 및 안보일 부분 숨기기
function screenInit() {
	$('#lblSayu').css('visibility', 'hidden');
	$('#divSayu').css('visibility', 'hidden');
	$('#lblBlank').css('visibility', 'hidden');
	$('#divBlank').css('visibility', 'hidden');
	$('#btnUpdate').css('visibility', 'hidden');
	$('#divUser').css('visibility', 'hidden');
	
	selectConfirm();
	selectLocat();
}

// 결재자 수정
function updateProc() {
	var findSw 	= false;
	var selItem = approvalGrid.list[approvalGrid.selectedDataIndexs[0]];
	if(getSelectedIndex('cboBlank') < 1 ) {
		dialog.alert('변경후결재를 선택하여 주십시오.', function() {});
		return;
	}
	
	if(getSelectedIndex('cboSayu') < 1 ) {
		dialog.alert('사유구분을  선택하여 주십시오.', function() {});
		return;
	}
	
	if(getSelectedVal('cboBlank').value === '3') {
		if(getSelectedIndex('cboUser') < 1) {
			dialog.alert('대결재자를 선태갛여 주십시오.', function() {});
			return;
		}
		
		if(getSelectedVal('cboUser').userid === selItem.team2) {
			dialog.alert('현재결재자와 대결재자가 동일인입니다.', function() {});
			return;
		}
	}
	
	var data = new Object();
	data = {
		AcptNo		: acptNo,
		Locat 		: selItem.locat,
		BlankCd 	: getSelectedVal('cboBlank').value,
		SayuCd 		: getSelectedVal('cboSayu').value,
		UserId 		: userId,
		DaeUser 	: getSelectedVal('cboBlank').value === '4' ? '' : getSelectedVal('cboUser').value,
		requestType	: 'updateConfirm'
	}
	ajaxAsync('/webPage/winpop/PopApprovalInfo', data, 'json',successUpdateConfirm);
}

// 수정완료
function successUpdateConfirm(data) {
	if(data === 'OK') {
		dialog.alert('결재정보 수정이 완료되었습니다.', function() {});
		
		screenInit();
	} else {
		dialog.alert(data, function() {});
	}
}

// 대결재자 정보 가져오기
function selectUser() {
	var selItem = approvalGrid.list[approvalGrid.selectedDataIndexs[0]];
	var data = new Object();
	data = {
		UserId 		: selItem.team2,
		BaseUser	: selItem.rgtcd,
		requestType	: 'selectUser'
	}
	ajaxAsync('/webPage/winpop/PopApprovalInfo', data, 'json',successSelectUser);
}

// 대결재자 정보 가져오기 완료
function successSelectUser(data) {
	cboUserData = data;
	
	$('[data-ax5select="cboUser"]').ax5select({
		options: injectCboDataToArr(cboUserData, 'userid' , 'username')
	});
}

// 결재 정보 그리드 클릭
function clickApprovalGrid(index) {
	$('#lblSayu').css('visibility', 'hidden');
	$('#divSayu').css('visibility', 'hidden');
	$('#lblBlank').css('visibility', 'hidden');
	$('#divBlank').css('visibility', 'hidden');
	$('#btnUpdate').css('visibility', 'hidden');
	$('#divUser').css('visibility', 'hidden');
	
	var WkSgn 	= '';
	var ConGbn 	= '';
	var BlankFg = false;
	var ConFg	= false;
	var selItem = approvalGrid.list[index];
	
	if(strAdmin !== 'Y') {
		return;
	}
	
	if(selItem.teamcd2 !== '3' && selItem.teamcd2 !== '4' && selItem.teamcd2 !== '6' 
		&& selItem.teamcd2 !== '7' && selItem.teamcd2 !== '8') {
		return;
	}
	
	if(selItem.confdate !== undefined && selItem.confdate.length > 0) {
		return;
	}
	
	switch (HoliGbn) {
	   case '1':
	        WkSgn = selItem.emgaft;
	        break;
	   case '2':
	        WkSgn = selItem.holi;
	        break;
	   case '3':
	        WkSgn = selItem.emger;
	        break;
	   default:
	        WkSgn = selItem.blank;
	}
		
    if (WkSgn  === '3' || WkSgn === '4' || WkSgn === '5' || WkSgn === '6') {
    	BlankFg = true;
    }
    ConGbn = selItem.congbn;
    
    if (strEditor !== userId && strAdmin !== 'Y') {
    	if (selItem.teamcd2 !== '1' && selItem.teamcd2 != '2' && strNxtSign == userId) {
    		ConFg = true;
    	}
    } else {
    	if ((strAdmin === 'Y') && selItem.teamcd2 !== '1' && selItem.teamcd2 != '2')
    	   ConFg = true;
    }
    
    if (ConFg) {
    	showModiDiv(WkSgn);
   	}
}

// 결재 수정할수 있는 div 보여주기
function showModiDiv(div) {
	if(cboBlankData.length === 0 ) {
		getCodeInfo();
	} else {
		$('#lblSayu').css('visibility', 'visible');
		$('#divSayu').css('visibility', 'visible');
		$('#lblBlank').css('visibility', 'visible');
		$('#divBlank').css('visibility', 'visible');
		$('#btnUpdate').css('visibility', 'visible');
		
		$('#cboBlank').trigger('change');
	}
}

// 콤보정보 가져오기
function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
			new CodeInfo('SGNCD','SEL','N'),
			new CodeInfo('DAEGYUL','SEL','N'),
	]);
	cboBlankData 	= codeInfos.SGNCD;
	cboSayuData 	= codeInfos.DAEGYUL;
	
	cboBlankData = cboBlankData.filter(function(data) {
		if(data.cm_micode === '00' || data.cm_micode === '3' || data.cm_micode === '4') {
			return true;
		} else {
			return false;
		}
	});
	
	$('[data-ax5select="cboBlank"]').ax5select({
		options: injectCboDataToArr(cboBlankData, 'cm_micode' , 'cm_codename')
	});
	
	$('[data-ax5select="cboSayu"]').ax5select({
		options: injectCboDataToArr(cboSayuData, 'cm_micode' , 'cm_codename')
	});
	$('#lblSayu').css('visibility', 'visible');
	$('#divSayu').css('visibility', 'visible');
	$('#lblBlank').css('visibility', 'visible');
	$('#divBlank').css('visibility', 'visible');
	$('#btnUpdate').css('visibility', 'visible');
	
	$('#cboBlank').trigger('change');
}

// 결재 정보 리스트 가져오기
function selectConfirm() {
	var data = new Object();
	data = {
		AcptNo 		: acptNo,
		requestType	: 'selectConfirm'
	}
	ajaxAsync('/webPage/winpop/PopApprovalInfo', data, 'json',successSelectConfirm);
}

// 결재 정보 리스트 가져오기 완료
function successSelectConfirm(data) {
	approvalGridData= data;
	approvalGrid.setData(approvalGridData);
}

// 현재 상황 가져오기
function selectLocat() {
	var data = new Object();
	data = {
		UserId 		: userId,
		AcptNo 		: acptNo,
		requestType	: 'selectLocat'
	}
	ajaxAsync('/webPage/winpop/PopApprovalInfo', data, 'json',successSelectLocat);
}
// 현재 상황 가져오기완료
function successSelectLocat(data) {
	var confLocat = data[0];
	
	reqSta 		= confLocat.sta;
	strPassOk 	= confLocat.passok;
	HoliGbn 	= confLocat.holigbn;
	strEditor 	= confLocat.editor;
	strNxtSign 	= confLocat.team;
	strAdmin 	= confLocat.admin;
	
	$('#txtLocat').val(confLocat.confname);
	
	if (confLocat.msg !== undefined && confLocat.msg.length !== 0) {
		$('#txtLocatCncl').val(confLocat.msg);
	}
	
	if (reqSta === '0' && (strAdmin === 'Y' || strEditor === userId)) {
		selectTimeSch();
	}
}

// 요일별 결재시간을 조회
function selectTimeSch() {
	var data = new Object();
	data = {
		requestType	: 'selectTimeSch'
	}
	ajaxAsync('/webPage/winpop/PopApprovalInfo', data, 'json',successSelectTimeSch);
}
// 요일별 결재시간을 조회 완료
function successSelectTimeSch(data) {
	if (HoliGbn === '1') {
		HoliGbn = '2';
	} else {
	   if (data === '1') {
		   if (strPassOk === '2') {
			   HoliGbn = '3';
		   } else {
			   HoliGbn = '2';
		   }
	   } else if (strPassOk === '2')  {
		   HoliGbn = '2';
	   }
	}
}
