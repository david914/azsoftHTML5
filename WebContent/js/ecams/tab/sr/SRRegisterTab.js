/**
 * SR 등록 탭 화면 정의 (공통화면)
 * 
 * <pre>
 * &lt;b&gt;History&lt;/b&gt;
 * 	작성자: 이성현
 * 	버전 : 1.4
 *  수정일 : 2019-06-20
 * 
 */

var userName = window.top.userName;
var userid = window.top.userId;
var adminYN = window.top.adminYN;
var userDeptName = window.top.userDeptName;
var userDeptCd = window.top.userDeptCd;
var strReqCd = window.parent.strReqCd;

var organizationModal = new ax5.ui.modal(); // 조직도 팝업
var approvalModal 		= new ax5.ui.modal();
var grid_fileList = new ax5.ui.grid();
var devUserGrid = new ax5.ui.grid();
var picker = new ax5.ui.picker();
var strStatus = "";

var fileGridData = new Object();

var options = [];
var cboCatTypeSRData = null;
var cboChgTypeData = null;
var cboWorkRankData = null;
var cboReqSecuData = null;
var cboDevUserData = null;

var insertSrIdSw = false;
var inProgressSw = false;
var strIsrId = '';
var strDept = '';
var subSw = false;
var selDeptSw = false;
var treeOranizationSubSw = false;
var txtUserId = "";
var txtUserName = "";
var deptName = "";
var deptCd = "";
var srSw = true;
var strSel = "";
var ins_sw = false;
var ing_sw = false;
var selDeptCd ="";
var selSubDeptCd=""; 
var fileGrid = true;
var confirmData = [];
var confirmInfoData = null;
var acptno = "";
// 파일첨부 팝업
var fileUploadModal = new ax5.ui.modal(
		{
			theme : "warning",
			header : {
				title : '<i class="glyphicon glyphicon-file" aria-hidden="true"></i> [첨부파일]',
				btns : {
					minimize : {
						label : '<i class="fa fa-minus-circle" aria-hidden="true"></i>',
						onClick : function() {
							fileUploadModal.minimize('bottom-right');
						}
					},
					restore : {
						label : '<i class="fa fa-plus-circle" aria-hidden="true"></i>',
						onClick : function() {
							fileUploadModal.restore();
						}
					},
					close : {
						label : '<i class="fa fa-times-circle" aria-hidden="true"></i>',
						onClick : function() {
							fileUploadModal.close();
							// fileUploadModal.minimize('bottom-right');
						}
					}
				}
			}
		});

var fileUploadModalCallBack = function() {
	fileLength = 0;
	fileUploadModal.close();
}

// 이 부분 지우면 영어명칭으로 바뀜
// ex) 월 -> MON
ax5.info.weekNames = [ {
	label : "일"
}, {
	label : "월"
}, {
	label : "화"
}, {
	label : "수"
}, {
	label : "목"
}, {
	label : "금"
}, {
	label : "토"
} ];

picker.bind({
	target : $('[data-ax5picker="basic2"]'),
	direction : "top",
	content : {
		width : 220,
		margin : 10,
		type : 'date',
		config : {
			control : {
				left : '<i class="fa fa-chevron-left"></i>',
				yearTmpl : '%s',
				monthTmpl : '%s',
				right : '<i class="fa fa-chevron-right"></i>'
			},
			dateFormat : 'yyyy/MM/dd',
			lang : {
				yearTmpl : "%s년",
				months : [ '01', '02', '03', '04', '05', '06', '07', '08',
						'09', '10', '11', '12' ],
				dayTmpl : "%s"
			}
		},
		formatter : {
			pattern : 'date'
		}
	},
	onStateChanged : function() {
	},
	btns : {
		today : {
			label : "Today",
			onClick : function() {
				var today = new Date();
				this.self.setContentValue(this.item.id, 0,
						ax5.util.date(today, {
							"return" : "yyyy/MM/dd"
						})).setContentValue(this.item.id, 1,
						ax5.util.date(today, {
							"return" : "yyyy/MM/dd"
						})).close();
			}
		},
		thisMonth : {
			label : "This Month",
			onClick : function() {
				var today = new Date();
				this.self.setContentValue(this.item.id, 0,
						ax5.util.date(today, {
							"return" : "yyyy/MM/01"
						})).setContentValue(
						this.item.id,
						1,
						ax5.util.date(today, {
							"return" : "yyyy/MM"
						})
								+ '/'
								+ ax5.util.daysOfMonth(today.getFullYear(),
										today.getMonth())).close();
			}
		},
		ok : {
			label : "Close",
			theme : "default"
		}
	}
});

grid_fileList.setConfig({
	target : $('[data-ax5grid="grid_fileList"]'),
	sortable : true,
	multiSort : true,
	header : {
		align : "center",
		columnHeight : 30
	},
	body : {
		columnHeight : 28,
		onClick : function() {
			this.self.clearSelect();
			this.self.select(this.dindex);
		}
	},
	columns : [ {
		key : "name",
		label : "파일명",
		width : '100%'
	} ],
	page : {
		display : false
	}
});

devUserGrid.setConfig({
	target : $('[data-ax5grid="devUserGrid"]'),
	sortable : true,
	multiSort : true,
	header : {
		align : "center",
		columnHeight : 30
	},
	body : {
		columnHeight : 28,
		onClick : function() {
			this.self.clearSelect();
			this.self.select(this.dindex);
		}
	},
	columns : [ {
		key : "cm_deptname",
		label : "소속부서",
		width : '30%'
	}, {
		key : "cm_username",
		label : "담당개발자",
		width : '40%'
	}, {
		key : "cm_codename",
		label : "상태",
		width : '30%'
	} ],
	page : {
		display : false
	}
});

$('input.checkbox-pie').wCheck({
	theme : 'square-inset blue',
	selector : 'checkmark',
	highlightLabel : true
});

$(document).ready(function() {
	elementInit('');
	
	setCboElement();
	setCboDevUser();

	// 신규등록 - 체크박스 선택
	$('#chkNew').bind('click', function() {
		clickChkNew();
	});

	// 보안요구사항 - 직접기입시 input 상태값 변경
	$('#cboReqSecu').bind('change', function() {
		changeCboReqSecu();
	});

	// 요청부서
	// selDeptSw = true > 사람검색
	// selDeptSw = false > 부서검색
	$('#txtOrg').bind('click', function() {
		subSw = false;
		selDeptSw = true;
		openOranizationModal();
	});

	// 담당개발자
	$('#txtUser').bind('dblclick', function() {
		subSw = true;
		selDeptSw = false;
		openOranizationModal();
	});

	// 담당 개발자 추가 버튼
	$('#btnAddDevUser').bind('click', function() {
		btn_addDever();
	});

	// 담당개발자 삭제 버튼
	$('#btnDelDevUser').bind('click', function() {
		btn_DelDever();
	});

	// 파일첨부 버튼
	$('#btnFileAdd').bind('click', function() {
		fileOpen();
	});
	
	// 등록버튼
	$('#btnRegister').bind('click', function() {
		format_confirm('INSERT');
	});
	// 수정버튼
	$('#btnUpdate').bind('click', function() {
		format_confirm('UPDATE');
	});
	// 삭제버튼
	$('#btnDelete').bind('click', function() {
		cmdCncl_click();
	});
	// 결재정보
	$('#btnConf').bind('click', function() {
		openApprovalInfo(2, acptno, "R60");
	});
	
	// 결재 버튼 클릭
	$('#btnOK').bind('click', function() {
		cmdOkclick();
	});
	// 반려 버튼 클릭
	$('#btnCncl').bind('click', function() {
		cmdCnclclick();
	});
});
// 결재 버튼 클릭
function cmdOkclick(){
	if(ing_sw){
		dialog.alert("현재 작업이 진행중입니다. 잠시후 다시 시도해주세요");
		return;
	}
	
	if($("#txtConMsg").val().length == 0){
		dialog.alert("결재 의견을 입력하여 주세요.");
		return;
	}
	
	confirmDialog.confirm({
		msg: '결재처리하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			confChk1();
		}
	});
}

function confChk1(){
	ing_sw = true;
	
	var ajaxReturnData = null;
	
	var gyulInfo1 = {
		strAcptNo : acptno,
		strUserId : userid,
		txtConMsg : $("#txtConMsg").val(),
		cnt		  : "1",
		strReqCd  : strReqCd,
		requestType: 	'nextConf1'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab', gyulInfo1, 'json');
	if(ajaxReturnData !== 'ERR') {
		parent.document.location.reload();
		ing_sw = false; 
	}
}

// 반려 버튼 클릭
function cmdCnclclick(){
	if(ing_sw){
		dialog.alert("현재 작업이 진행중입니다. 잠시후 다시 시도해주세요");
		return;
	}
	
	if($("#txtConMsg").val().length == 0){
		dialog.alert("반려 의견을 입력하여 주세요.");
		return;
	}
	
	confirmDialog.confirm({
		msg: '반려처리하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			cnclChk();
		}
	});
}

function cnclChk(){
	ing_sw = true;
	
	var ajaxReturnData = null;
	
	var gyulInfo2 = {
		strAcptNo : acptno,
		strUserId : userid,
		txtConMsg : $("#txtConMsg").val(),
		cnt		  : "3",
		strReqCd  : strReqCd,
		requestType: 	'nextConf1'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab', gyulInfo2, 'json');
	if(ajaxReturnData !== 'ERR') {
		ing_sw = false;
		parent.document.location.reload();
	}
}

//결재 정보 창 띄우기
function openApprovalInfo(type, acptNo, reqCd) {
	var nHeight, nWidth, cURL, winName;
	
	if ( (type+'_'+reqCd) == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}

    winName = type+'_'+reqCd;
    
	var form = document.popPam;   		//폼 name
    
	form.acptno.value	= acptNo;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.user.value 	= userid;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    
    if(type === 2) {
    	nHeight = 471;
        nWidth  = 1033;
    	cURL	= '/webPage/winpop/PopApprovalInfo.jsp';
    }
    
	myWin = winOpen(form, winName, cURL, nHeight, nWidth);
}

//소소조직 선택 창 오픈
function openOranizationModal() {
	organizationModal.open({
		width : 400,
		height : 700,
		iframe : {
			method : "get",
			url : "../../modal/OrganizationModal.jsp",
			param : "callBack=modalCallBack"
		},
		onStateChanged : function() {
			if (this.state === "open") {
				mask.open();
			} else if (this.state === "close") {
				mask.close();
				if(subSw === true && selDeptSw === false){
					closeModal();
				}
			}
		}
	}, function() {
	});
}

var modalCallBack = function() {
	organizationModal.close();
};

function changeCboReqSecu() {
	if (getSelectedVal('cboReqSecu').value === '6') {
		$('#txtReqSecu').css('display', 'block');
	} else {
		$('#txtReqSecu').css('display', 'none');
		$('#cboReqSecu').removeClass('width-20');
		$('#cboReqSecu').addClass('width-100');
	}
}

function setCboDevUser() { // 담당개발자 select 세팅
	var ajaxReturnData = null;
	var userInfo = {
		userInfoData : window.top.userId,
		requestType : 'GET_USER_COMBO'
	}

	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab',
			userInfo, 'json');
	if (ajaxReturnData !== 'ERR') {
		cboDevUserData = ajaxReturnData;
		options = [];

		$('[data-ax5select="cboDevUser"]').ax5select(
				{
					options : injectCboDataToArr(cboDevUserData, 'cm_userid',
							'cm_idname')
				});

		if (cboDevUserData.length === 2) {
			$('[data-ax5select="cboDevUser"]').ax5select("setValue", userid,
					true);
		}
	}
}

//screenInit
function elementInit(initDivision) {
	if (initDivision === 'NEW') {
		strIsrId = '';
		/*
		 * if( this.parentDocument.toString().indexOf("eCmc0100") > -1 ) {
		 * this.parentDocument.tab0.grdPrj.selectedIndex = -1; }
		 */
		ins_sw = true;
		$('#datReqComDate').val('');
		$('#chkNew').wCheck('check', true);
		$('#btnUpdate').attr('disabled', true);
		$('#btnRegister').attr('disabled', false);
		$('#btnDelete').attr('disabled', true);
		$('#txtSRID').val('신규등록');
		$('#txtRegUser').val(userName);
		$('#txtRegDate').val('신규등록');
		$('#txtOrg').attr('readonly', true);
		$('#txtSRID').attr('disabled', true);
		$('#txtRegUser').attr('disabled', true);
		$('#txtRegDate').attr('disabled', true);
		$('#txtReqSecu').val('');
		$('#txtReqSecu').css('display', 'none');
		$('[data-ax5select="cboCatTypeSR"]').ax5select("setValue", '00', true);
		$('[data-ax5select="cboChgType"]').ax5select("setValue", '00', true);
		$('[data-ax5select="cboWorkRank"]').ax5select("setValue", '00', true);
		$('[data-ax5select="cboReqSecu"]').ax5select("setValue", '00', true);

		insertSrIdSw = true;

		setCboDevUser();

	} else if (strIsrId !== null && strIsrId !== '') {
		if (initDivision === 'M') {
			$('#chkNew').wCheck('check', false);
			$('#btnRegister').attr('disabled', true);
			$('#btnUpdate').attr('disabled', true);
			$('#btnDelete').attr('disabled', true);
		} else {
			// 등록완료(0)
			if (strStatus === '0') {
				$('#btnRegister').attr('disabled', false);
				$('#btnUpdate').attr('disabled', false);
				$('#btnDelete').attr('disabled', false);
				// 접수완료(2), 진행중(4), 등록승인중 반려(C)
			} else if (strStatus === '2' || strStatus === 'C' || strStatus === '4') {
				// 접수완료(2), 진행중(4) 이면
				if (strStatus === '2' || strStatus === 'C') {
					$('#btnDelete').attr('disabled', false);
					$('#btnUpdate').attr('disabled', false);
					// 등록승인중반려(C) 면
				} else {
					$('#btnDelete').attr('disabled', true);
					$('#btnUpdate').attr('disabled', true);
				}

				$('#btnRegister').attr('disabled', true);

			} else { // 그외 상태일 때
				$('#btnRegister').attr('disabled', true);
				$('#btnUpdate').attr('disabled', true);
				$('#btnDelete').attr('disabled', true);

				// 등록승인중(1), 반려(3), 모니터링중(5), 완료승인중(A) 이면
				if (strStatus === '1' || strStatus === '3' || strStatus === '5' || strStatus === 'A') {
					$('#btnFileAdd').attr('disabled', true);
					$('#btnAddDevUser').attr('disabled', true);
					$('#btnDelDevUser').attr('disabled', true);
				}
			}

			$('#txtSRID').val('');
			$('#txtRegUser').val('');
			$('#txtRegDate').val('');
			ins_sw = false;
			insertSrIdSw = false;
		}
	} else {
		$('#datReqComDate').val('');
		$('#chkNew').wCheck('check', false);
		$('#btnUpdate').attr('disabled', true);
		$('#btnRegister').attr('disabled', true);
		$('#btnDelete').attr('disabled', true);
		$('#txtSRID').val('');
		$('#txtRegUser').val('');
		$('#txtRegDate').val('');

		$('#txtSRID').attr('disabled', true);
		$('#txtRegUser').attr('disabled', true);
		$('#txtRegDate').attr('disabled', true);
	}
	$("#btnConf").hide();
	$('#txtDocuNum').val('');
	$('#txtReqSubject').val('');
	$('#texReqContent').val('');
	$('#txtUser').val('');
	$('#txtOrg').val('');

	grid_fileList.setData([]); // grid 초기화
	devUserGrid.setData([]); // grid 초기화
	
	if(strReqCd == 'XX') {
		$('#chkNew').wCheck('disabled', true);
		$('#btnUpdate').attr('disabled', true);
		$('#btnRegister').attr('disabled', true);
		$('#btnDelete').attr('disabled', true);
		$('#btnAddDevUser').attr('disabled', true);
		$('#btnDelDevUser').attr('disabled', true);
		$('#btnFileAdd').attr('disabled', true);
		
	}if(strReqCd == 'XX' || ($('#btnRegister')[0].disabled && $('#btnUpdate')[0].disabled && $('#btnDelete')[0].disabled)) { //disable이면 true
		if(cboCatTypeSRData != null) {
			$('[data-ax5select="cboCatTypeSR"]').ax5select("disable");
			$('[data-ax5select="cboChgType"]').ax5select("disable");
			$('[data-ax5select="cboWorkRank"]').ax5select("disable");
			$('[data-ax5select="cboReqSecu"]').ax5select("disable");
		}
		
		$('#datReqComDate').attr('disabled', true);
		
		$('#txtReqSubject').attr('disabled', true);
		$('#texReqContent').attr('disabled', true);
		$('#txtDocuNum').attr('disabled', true);
		$('#txtOrg').attr('disabled', true);
		$('#txtRegUser').attr('disabled', true);
	}else {
		if(cboCatTypeSRData != null) {
			$('[data-ax5select="cboCatTypeSR"]').ax5select("enable");
			$('[data-ax5select="cboChgType"]').ax5select("enable");
			$('[data-ax5select="cboWorkRank"]').ax5select("enable");
			$('[data-ax5select="cboReqSecu"]').ax5select("enable");
		}
		
		$('#datReqComDate').attr('disabled', false);
		
		$('#txtReqSubject').attr('disabled', false);
		$('#texReqContent').attr('disabled', false);
		$('#txtDocuNum').attr('disabled', false);
		$('#txtOrg').attr('disabled', false);
		$('#txtRegUser').attr('disabled', false);
	}
}

// 파일첨부
function fileOpen() {
	fileUploadModal.open({
		width : 600,
		height : 360,
		iframe : {
			method : "get",
			url : "../modal/notice/FileUpModal.jsp",
			param : "callBack=fileUploadModalCallBack"
		},
		onStateChanged : function() {
			if (this.state === "open") {
			} else if (this.state === "close") {
			}
		}
	}, function() {
	});
}

// SR등록
function format_confirm(sel){
	/*날짜 구하기*/
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    if(month < 10){
        month = "0"+month;
    }
    if(day < 10){
        day = "0"+day;
    }
 
    var today = year+month+day;
    
    if($('#txtOrg').val().length === 0){
    	dialog.alert("요청부서를 선택하여 주시기 바랍니다.");
    	return;
    }
    
    if($('#txtReqSubject').val().length === 0){
    	dialog.alert("요청제목를 입력하여 주시기 바랍니다.");
    	return;
    }
    
    if($('#texReqContent').val().length === 0){
    	dialog.alert("상세내용을 입력하여 주시기 바랍니다.");
    	return;
    }
    
    if(getSelectedVal('cboCatTypeSR').value === "00"){
    	dialog.alert("분류유형을 선택하여주시기 바랍니다.");
    	return;
    }
    
    if(getSelectedVal('cboChgType').value === "00"){
    	dialog.alert("변경종류를 선택하여주시기 바랍니다.");
    	return;
    }
    
    if(getSelectedVal('cboWorkRank').value === "00"){
    	dialog.alert("작업순위를 선택하여주시기 바랍니다.");
    	return;
    }
 
    if($('#datReqComDate').val().length === 0 || $('#datReqComDate').val() === ""){
    	dialog.alert("완료요청일을 선택하여 주시기 바랍니다.");
    	return;
    }
    
    // 완료 예쩡일 오늘보다 앞 날짜일때 에러문
    var strDate = getDate('DATE',0);
    var strDate2 = replaceAllString($('#datReqComDate').val(),'/','');
    
    if (strDate > strDate2) {
		dialog.alert("적용일시가 현재일 이전입니다. \n정확히 선택하여 주십시오");
		return;
	}
    
    if(devUserGrid.list.length === 0){
    	dialog.alert("담당개발자를 추가하여 주시기 바랍니다.");
    	return;
    }
    
    if(sel === "INSERT"){
    	strSel = "등록";
    	
    	if(strStatus === "0"){
    		ins_sw = false;
    	} else {
    		ins_sw = true;
    	}
    } else if(sel === "UPDATE"){
    	strSel = "수정"
    	ins_sw = false;
    } else if(sel === "COPY"){
    	strSel = "SR복사";
    	ins_sw = false;
    }
    
    confirmDialog.confirm({
		msg: '현재내용으로 "'+strSel+ '"하시겠습니까',
	}, function(){
		if(this.key === 'ok') {
			set_info();
		}
	});
}

function set_info(){
	if(ing_sw){
		dialog.alert("현재 작업이 진행중입니다. 잠시후 다시 시도해주세요");
		return;
	}
	
	if(strStatus == "0" || strStatus == "C" || $("#chkNew").is(':checked')){
		confirmInfoData = new Object();
		confirmInfoData.SysCd = "99999";
		confirmInfoData.EmgSw = "0";
		confirmInfoData.strRsrcCd = "";
		confirmInfoData.ReqCd = strReqCd;
		confirmInfoData.UserID = userid;
		confirmInfoData.strQry = "";
		
		var tmpData = {
				requestType : 'confSelect',
				confirmInfoData : confirmInfoData
		}	
		ajaxReturnData = ajaxCallWithJson('/webPage/apply/ApplyRequest', tmpData, 'json');
		
		if(ajaxReturnData == "Y"){
			confselect();
		} else {
			confirmEnd();
		}
	} else {
		confirmEnd();
	}
}

function confselect(){
	approvalModal.open({
        width: 820,
        height: 365,
        iframe: {
            method: "get",
            url: "../../modal/request/ApprovalModal.jsp",
            param: "callBack=modalCallBack"
	    },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
            	if(confirmData.length > 0){
            		confirmEnd();
            	}
            	ingSw = false;
                mask.close();
            }
        }
	});
}

// SR등록처리
function confirmEnd(){
	var SRData = new Object();
	var ajaxReturnData = null;
	
	SRData.reqcd = strReqCd;
	SRData.cc_createuser = userid;
	SRData.cc_lastupuser = userid;
	SRData.cc_docid = $("#txtDocuNum").val().trim();
	if(strDept != ""){
		SRData.cc_reqdept = strDept;
	} else {
		SRData.cc_reqdept = selDeptCd;
	}
	//SRData.cc_requser = null;
	SRData.cc_reqtitle = $("#txtReqSubject").val().trim();
	SRData.cc_reqcompdate = $("#datReqComDate").val().trim();
	SRData.cc_content = $("#texReqContent").val().trim();
	SRData.cc_cattype = getSelectedVal('cboCatTypeSR').value;
	SRData.cc_chgtype = getSelectedVal('cboChgType').value;
	SRData.cc_excdate = null;
	SRData.cc_exptime = null;
	SRData.cc_workrank = getSelectedVal('cboWorkRank').value;
	SRData.cc_devdept = "";
	
	if(getSelectedVal('cboReqSecu').value == "00"){
		SRData.cc_reqsecu = "0";
	} else {
		SRData.cc_reqsecu = getSelectedVal('cboReqSecu').value;
	}
	
	if(getSelectedVal('cboReqSecu').value != "6"){
		SRData.cc_reqsecutxt = "";
	} else {
		SRData.cc_reqsecutxt = $("#txtReqSecu").val().trim();	
	}
	
	if(!$("#chkNew").is(':checked')){
		var selectedSr = window.parent.selectedSr;
		SRData.cc_srid = selectedSr.cc_srid;
		SRData.cc_createuser = selectedSr.cc_createuser;
		SRData.cc_status = selectedSr.cc_status;
	}
	
	if(ins_sw){
		console.log("신규");
		ing_sw = true;
		
		var SRInfo = {
				SRInfoData: 	SRData,
				confirmData:    confirmData,
				devuser_ary:    devUserGrid.list,
				requestType: 	'insertSRInfo'
			}
			
		ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab', SRInfo, 'json');
		console.log(ajaxReturnData);
		if(ajaxReturnData !== 'ERR') {
			elementInit("NEW");
			ing_sw = false; /// 마지막에 초기화해줌 성공적으로 들록, 수정되면
		}
	} else if ( !ins_sw && strSel == "수정"){
		console.log("수정");
		ing_sw = true;
		var SRInfo = {
				SRInfoData: 	SRData,
				confirmData:    confirmData,
				devuser_ary:    devUserGrid.list,
				requestType: 	'updateSRInfo'
			}
			
		ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab', SRInfo, 'json');
		console.log(ajaxReturnData);
		if(ajaxReturnData !== 'ERR') {
			elementInit("NEW");
			ing_sw = false; /// 마지막에 초기화해줌 성공적으로 들록, 수정되면
		}
	}
}


//SR 반려
function cmdCncl_click(){
	if(ing_sw){
		dialog.alert("현재 작업이 진행중입니다. 잠시후 다시 시도해주세요");
		return;
	}
	
	confirmDialog.confirm({
		msg: '삭제처리하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			delSr();
		}
	});
}

function delSr(){
	ing_sw = true;
	
	var SRInfo = {
			strUserId : userid,
			srId 	  : $('#txtSRID').val(),
			requestType: 	'deleteSRInfo'
		}
		
	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab', SRInfo, 'json');
	if(ajaxReturnData !== 'ERR') {
		dialog.alert("삭제가 완료되었습니다");
		elementInit("NEW");
		ing_sw = false; /// 마지막에 초기화해줌 성공적으로 들록, 수정되면
	}
	
	ing_sw = false;
}

// 개발자 추가 버튼
function btn_addDever() {
	if (getSelectedIndex('cboDevUser') < 1) {
		return;
	}

	for (var q = 0; q < devUserGrid.list.length; q++) {
		// 중복데이터 추가안하는 로직
		if (devUserGrid.list[q].cm_username === getSelectedVal('cboDevUser').cm_username
				&& devUserGrid.list[q].cm_deptcd === getSelectedVal('cboDevUser').cm_deptcd) {
			return;
		}
	}
	var tmp = new Object();
	tmp.cm_username = getSelectedVal('cboDevUser').cm_username;
	tmp.cm_deptcd = getSelectedVal('cboDevUser').cm_deptcd;
	tmp.cm_deptname = getSelectedVal('cboDevUser').cm_deptname;
	tmp.cc_userid = getSelectedVal('cboDevUser').cm_userid
	tmp.delyn = "OK";

	devUserGrid.addRow($.extend({}, tmp, {
		__index : undefined
	}));
	devUserGrid.repaint();
}

// 개발자 삭제 버튼
function btn_DelDever() {
	devUserGrid.removeRow("selected");
	devUserGrid.repaint();
}

function setCboElement() {
	var codeInfos = getCodeInfoCommon([ new CodeInfo('CATTYPE', 'SEL', 'N'),
			new CodeInfo('CHGTYPE', 'SEL', 'N'),
			new CodeInfo('WORKRANK', 'SEL', 'N'),
			new CodeInfo('REQSECU', 'SEL', 'N') ]);

	cboCatTypeSRData = codeInfos.CATTYPE;
	cboChgTypeData = codeInfos.CHGTYPE;
	cboWorkRankData = codeInfos.WORKRANK;
	cboReqSecuData = codeInfos.REQSECU;
	options = [];
	
	$('[data-ax5select="cboCatTypeSR"]').ax5select({
        options: injectCboDataToArr(cboCatTypeSRData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="cboChgType"]').ax5select({
        options: injectCboDataToArr(cboChgTypeData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="cboWorkRank"]').ax5select({
        options: injectCboDataToArr(cboWorkRankData, 'cm_micode' , 'cm_codename')
   	});
	
	$('[data-ax5select="cboReqSecu"]').ax5select({
        options: injectCboDataToArr(cboReqSecuData, 'cm_micode' , 'cm_codename')
   	});
}

function clickChkNew() {
	if ($('#chkNew').is(':checked')) {
		strDept = "";
		elementInit('NEW');
	} else {
		elementInit('');
	}
}

function closeModal() {
	if(!selDeptSw) { //부서(0)
		
	}else { //사람(1)
		
	}
	
	cboDevUserData = null;
	var cboDevUserDataArray = [];
	var cboDevUserDataObject = {};
	cboDevUserDataObject.cm_userid = '0000';
	cboDevUserDataObject.cm_username = '';
	cboDevUserDataObject.cm_idname = '선택하세요';
	cboDevUserDataObject.cm_deptcd = '';
	cboDevUserDataObject.cm_deptname = '';
	cboDevUserDataArray.push(cboDevUserDataObject);

	cboDevUserDataObject = {};
	cboDevUserDataObject.cm_userid = txtUserId;
	cboDevUserDataObject.cm_username = txtUserName;
	cboDevUserDataObject.cm_idname = txtUserName + '[' + txtUserId + ']';
	cboDevUserDataObject.cm_deptcd = deptCd;
	cboDevUserDataObject.cm_deptname = deptName;
	cboDevUserDataArray.push(cboDevUserDataObject);

	cboDevUserData = cboDevUserDataArray;

	options = [];

	$('[data-ax5select="cboDevUser"]').ax5select({
		options : injectCboDataToArr(cboDevUserData, 'cm_userid', 'cm_idname')
	});

	if (cboDevUserData.length === 2) {
		$('[data-ax5select="cboDevUser"]').ax5select("setValue", txtUserId,
				true);
	}

	btn_addDever();
}

function gyulChk1(acptno){
	var gyulInfo = {
			strUserId : userid,
			strAcptno : acptno,
			requestType: 	'gyulChk1'
		}
		
	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab', gyulInfo, 'json');
	if(ajaxReturnData !== 'ERR') {
		if(ajaxReturnData == "0"){
			$("#gyulDiv").show();
			$("#btnOK").show();
			$("#btnCncl").show();
		} else if(ajaxReturnData != "1"){
			dialog.alert("결재정보 체크 중 오류가 발생하였습니다.");
		}
	}
}

// sr 리스트 클릭 이벤트
function firstGridClick(srid) {
	$('#txtReqSecu').css('display', 'none');
	// sr 정보 가져오기
	var ajaxReturnData = null;
	var srInfo = {
		srInfoData : srid,
		requestType : 'selectSRInfo'
	}

	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab',
			srInfo, 'json');
	if (ajaxReturnData !== 'ERR') {
		$('#chkNew').wCheck('check', false);
		clickChkNew();
		console.log(ajaxReturnData);
		$('#txtSRID').val(ajaxReturnData[0].cc_srid);
		$('#txtRegUser').val(ajaxReturnData[0].createuser);
		$('#txtRegDate').val(ajaxReturnData[0].createdate);
		strDept = ajaxReturnData[0].cc_reqdept;
		$('#txtDocuNum').val(ajaxReturnData[0].cc_docid);
		$('#txtOrg').val(ajaxReturnData[0].reqdept);
		
		$('#txtReqSubject').val(ajaxReturnData[0].cc_reqtitle);
		if(ajaxReturnData[0].acptno != "" && ajaxReturnData[0].acptno != undefined){
			acptno = ajaxReturnData[0].acptno;
			$("#btnConf").show();
			gyulChk1(acptno);
		}
		
		var tempDate = ajaxReturnData[0].cc_reqcompdate.substring(0, 4) + "/"
				+ ajaxReturnData[0].cc_reqcompdate.substring(4, 6) + "/"
				+ ajaxReturnData[0].cc_reqcompdate.substring(6, 8);
		$('#datReqComDate').val(tempDate);

		$('#texReqContent').val(ajaxReturnData[0].cc_content);

		$('[data-ax5select="cboCatTypeSR"]').ax5select("setValue",
				ajaxReturnData[0].cc_cattype, true);
		$('[data-ax5select="cboChgType"]').ax5select("setValue",
				ajaxReturnData[0].cc_chgtype, true);
		$('[data-ax5select="cboWorkRank"]').ax5select("setValue",
				ajaxReturnData[0].cc_workrank, true);
		if (ajaxReturnData[0].cc_reqsecu !== "0") {
			$('[data-ax5select="cboReqSecu"]').ax5select("setValue",
					ajaxReturnData[0].cc_reqsecu, true);
		} else {
			$('[data-ax5select="cboReqSecu"]')
					.ax5select("setValue", "00", true);
		}

		if (ajaxReturnData[0].cc_reqsecu === "6") {
			$('#txtReqSecu').css('display', 'block');
			$('#txtReqSecu').val(ajaxReturnData[0].cc_txtreqsecu);
		}

		ajaxReturnData = null;
		var docSr = {
			srInfoData : srid,
			strReqCd : strReqCd,
			requestType : 'getDocList'
		}

		ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab',
				docSr, 'json');
		if (ajaxReturnData !== 'ERR') {
			grid_fileList.setData(ajaxReturnData);
		}

		ajaxReturnData = null;
		var devUser = {
			srInfoData : srid,
			userid : window.top.userId,
			requestType : 'getDevUserList'
		}

		console.log("userid: " + userid + ", " + window.top.userId + ", " + window.parent.userId);
		console.log("devUser: ", devUser);
		
		ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab',
				devUser, 'json');
		console.log(ajaxReturnData);
		if (ajaxReturnData !== 'ERR') {
			devUserGrid.setData(ajaxReturnData);
		}
	}
}
