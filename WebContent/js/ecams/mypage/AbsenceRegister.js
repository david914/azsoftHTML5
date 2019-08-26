/**
 * 부재등록 화면의 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-07-02
 */


var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드


var datStD 		= new ax5.ui.picker();
var datEdD 		= new ax5.ui.picker();

var absGrid 	= new ax5.ui.grid();

var absGridData = [];
var cboSayuData = [];
var cboUserData	= [];
var cboDaeSignData = [];

absGrid.setConfig({
    target: $('[data-ax5grid="absGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {
    		swal({
                title: "신청상세팝업",
                text: "신청번호 ["+this.item.acptno2+"]"
            });

        },
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_userid", label: "사원번호",  width: '30%'},
        {key: "cm_username", label: "대결자",  width: '30%'},
        {key: "sedate", label: "대결기간",  width: '40%'}
    ]
});

$('input:radio[name^="radio"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});

$(document).ready(function() {
	getCodeInfo();
	getUserInfo();
	
	// 부재자 콤보 변경
	$('#cboUser').bind('change', function() {
		$("#txtName").val('');
		$("#txtUser").val('');
		
		$('#txtUser').val(getSelectedVal('cboUser').cm_username);
		
		absGridData = [];
		absGrid.setData(absGridData);
		
		getAbsenceInfo();
		//getAbsenceList();
		getAbsenceState();
	});
	// 대결재자 콤보 변경
	$('#cboDaeSign').bind('change', function() {
		$('#txtName').val('');
		
		if(getSelectedIndex('cboDaeSign') < 1) {
			return;
		}
		$('#txtName').val(getSelectedVal('cboDaeSign').cm_username);
	});
	
	// 부재자 엔터
	$('#txtUser').bind('keypress', function(event) {
		if(event.keyCode === 13) {
			var txtUser = $('#txtUser').val().trim();
			for (i = 0; cboUserData.length > i; i++) {
				if (cboUserData[i].cm_username.indexOf(txtUser) >= 0) {
					$('[data-ax5select="cboUser"]').ax5select("setValue", cboUserData[i].cm_userid, true);
					$('#txtUser').val(cboUserData[i].cm_username);
					$('#cboUser').trigger('change');
					break;
				}
			}
		}
	});
	
	// 대결재자 엔터
	$('#txtName').bind('keypress', function(event) {
		if(event.keyCode === 13) {
			var txtName = $('#txtName').val().trim();
			for (i = 0; cboDaeSignData.length > i; i++) {
				if (cboDaeSignData[i].cm_username.indexOf(txtName) >= 0) {
					$('[data-ax5select="cboDaeSign"]').ax5select("setValue", cboDaeSignData[i].cm_userid, true);
					$('#txtName').val(cboDaeSignData[i].cm_username);
					$('#cboDaeSign').trigger('change');
					break;
				}
			}
		}
	});
	// 부재사유 변경
	$('#cboSayu').bind('change', function() {
		$('#txtSayu').val('');
		if(getSelectedIndex('cboSayu') < 1) {
			return;
		}
		$('#txtSayu').val(getSelectedVal('cboSayu').cm_codename);
	});
	
	// 등록/해제
	$('#btnReg').bind('click', function() {
		insertAbs();
	});
	// 등록/해제 라디오
	$('input:radio[name^="radio"]').bind('click', function() {
		if($('#optReg').is(':checked')) {
			$('#btnReg').text('등록');
		}else {
			$('#btnReg').text('해제');
		}
	});
	
	$('#datStD').val(getDate('DATE',0));
	$('#datEdD').val(getDate('DATE',0));

	datStD.bind(defaultPickerInfo('datStD','top'));
	datEdD.bind(defaultPickerInfo('datEdD','top'));
})

// 부재사유 가져오기
function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('DAEGYUL','SEL','N')
		]);
	cboSayuData = codeInfos.DAEGYUL;
	
	$('[data-ax5select="cboSayu"]').ax5select({
        options: injectCboDataToArr(cboSayuData, 'cm_micode' , 'cm_codename')
	});
};

//부재자 정보 가져오기
function getUserInfo() {
	var data = new Object();
	data = {
		UserId 		: userId,
		Sv_Admin 	: adminYN ? 'Y' : 'N',
		requestType : 'getUserInfo'
	}
	ajaxAsync('/webPage/mypage/AbsenceRegister', data, 'json',successGetUserInfo);
}

// 부재자 정보 가져오기 완료
function successGetUserInfo(data) {
	cboUserData = data;
	$('[data-ax5select="cboUser"]').ax5select({
        options: injectCboDataToArr(cboUserData, 'cm_userid' , 'username')
	});
	
	for(var i=0; i<cboUserData.length; i++) {
		if(cboUserData[i].cm_userid === userId) {
			$('[data-ax5select="cboUser"]').ax5select("setValue", cboUserData[i].cm_userid, true);
			$('#cboUser').trigger('change');
			break;
		}
	}
}

// 대결재자 리스트 가져오기
function getAbsenceInfo() {
	var data = new Object();
	data = {
		UserId 		: getSelectedVal('cboUser').value,
		cm_manid 	: 'Y',
		requestType : 'getAbsenceInfo'
	}
	ajaxAsync('/webPage/mypage/AbsenceRegister', data, 'json',successGetAbsenceInfo, getAbsenceList);
}

//대결재자 리스트 가져오기 완료
function successGetAbsenceInfo(data) {
	cboDaeSignData = data;
	$('[data-ax5select="cboDaeSign"]').ax5select({
        options: injectCboDataToArr(cboDaeSignData, 'cm_userid' , 'username')
	});
	$('#cboDaeSign').trigger('change');
}

// 부재자 등록 리스트 가져오기
function getAbsenceList() {
	var data = new Object();
	data = {
		UserId 		: getSelectedVal('cboUser').value,
		requestType : 'getAbsenceList'
	}
	ajaxAsync('/webPage/mypage/AbsenceRegister', data, 'json',successGetAbsenceList);
}

// 부재자 등록 리스트 가져오기 완료
function successGetAbsenceList(data) {
	absGridData = data;
	absGrid.setData(absGridData);
	
	if (absGridData !== null && absGridData.length > 0) {
		var daegyulObj = null;
		var tmpObj = null;
		daegyulObj = absGridData[0];
		
		if( cboDaeSignData !== null && cboDaeSignData.length > 0){
			for (var i = 0; i < cboDaeSignData.length; i++) {
				tmpObj = cboDaeSignData[i];

				if (tmpObj.cm_userid == daegyulObj.cm_daegyul) {
					$('[data-ax5select="cboDaeSign"]').ax5select("setValue", daegyulObj.cm_daegyul, true);
					break;
				}
			}
		}
		daegyulObj = null;
		tmpObj = null;
	} else {
		$("#txtSayu").val('');
		$('[data-ax5select="cboDaeSign"]').ax5select('setValue', cboDaeSignData[0].cm_userid, true);
		$('[data-ax5select="cboSayu"]').ax5select('setValue', cboSayuData[0].cm_micode, true);
	}
}

// 대결재자 정보 가져오기
function getAbsenceState() {
	var data = new Object();
	data = {
		UserId 		: getSelectedVal('cboUser').value,
		requestType : 'getAbsenceState'
	}
	ajaxAsync('/webPage/mypage/AbsenceRegister', data, 'json',successGetAbsenceState);
}

//대결재자 정보 가져오기 완료
function successGetAbsenceState(data) {
	var daegyulState = data;
	if (daegyulState !== null && daegyulState.length != 0) {
		if (daegyulState[0].cm_status == '0') {
			$("#optReg").wRadio('check', true);
		} else if (daegyulState[0].cm_status == "9") {
			$("#optUnReg").wRadio('check', true);
			
			$("#txtSayu").val('');
			$("#txtName").val('');
			if (absGridData.length > 0) {
				$("#txtSayu").val(absGridData[0].cm_daesayu);
				$("#txtName").val(absGridData[0].cm_username);
			}
		} else {
			$("#optReg").wRadio('check', true);
		}
	}
	daegyulState = null;
}
// 부재자 등록/해제
function insertAbs() {
	var txtSayu = $('#txtSayu').val().trim();
	var datStD = replaceAllString($('#datStD').val(),'/','');
	var datEdD = replaceAllString($('#datEdD').val(),'/','');
	var dataObj = new Object();
	var txtName = $('#txtName').val().trim();
	
	if($('#optReg').is(':checked')) {
		if(absGridData.length > 0) {
			dialog.alert('다른사용자가 해당기간에 대결재자로 지정한 상태입니다.확인하여 대결해제한 후 처리하십시오.', function() {});
			return;
		}
		
		if(txtSayu.length === 0 ) {
			dialog.alert('부재사유를 입력하여 주십시오.', function() {});
			return;
		}
		
		if(datStD > datEdD) {
			dialog.alert('부재기간을 정확하게 선택하십시오.', function() {});
			return;
		}
		
		if( txtName.length === 0 ) {
			dataObj.DaeSign = '';
		}else{
			dataObj.DaeSign = getSelectedVal('cboDaeSign').cm_userid;
		}
		dataObj.Frm_User = getSelectedVal('cboUser').value;
		dataObj.Cbo_Sayu = getSelectedVal('cboSayu').cm_codename;
		dataObj.Txt_Sayu = txtSayu;
		dataObj.sdate 	 = datStD;
		dataObj.edate 	 = datEdD;
		dataObj.Opt_Cd0  = $('#optReg').is(':checked');
	} else {
		if(absGridData.length < 1) {
			dialog.alert('대결해제 할 대상이 없습니다.', function() {});
			return;
		}
		dataObj.Frm_User = getSelectedVal('cboUser').value;
		dataObj.DaeSign  = getSelectedVal('cboDaeSign').cm_userid;
		dataObj.Cbo_Sayu = getSelectedVal('cboSayu').cm_codename;
		dataObj.Txt_Sayu = txtSayu;
		dataObj.sdate 	 = datStD;
		dataObj.edate 	 = datEdD;
		dataObj.Opt_Cd0  = $('#optReg').is(':checked');
	}
	
	var data = new Object();
	data = {
		dataObj 	: dataObj,
		requestType : 'insertAbs'
	}
	ajaxAsync('/webPage/mypage/AbsenceRegister', data, 'json',successInsertAbs);
}

// 부재자 등록/해제 완료
function successInsertAbs(data) {
	if(data === 1) {
		dialog.alert('부재 및 대결재자 등록이 완료되었습니다', function() {});
		$('#cboUser').trigger('change');
	} else if ( data === 2 ){
		dialog.alert('부재 및 대결재자 등록이 해제되었습니다', function() {});
		$('#cboUser').trigger('change');
		$('#txtName').val('');
		$('#txtSayu').val('');
	} else {
		dialog.alert('작업 실패.관리자에게 문의해주세요.', function() {});
	}
	
}