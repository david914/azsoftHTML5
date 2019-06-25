/** SR 등록 탭 화면 정의 (공통화면)
 * 
 * <pre>
 * <b>History</b>
 * 	작성자: 이성현
 * 	버전 : 1.4
 *  수정일 : 2019-06-20
 */

var userName 	= window.top.userName;
var userid 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;
var strReqCD 	= window.top.reqCd;
var deptModal 	= new ax5.ui.modal();

var grid_fileList 	= new ax5.ui.grid();
var devUserGrid 	= new ax5.ui.grid();
var picker 		= new ax5.ui.picker();

//이 부분 지우면 영어명칭으로 바뀜
//ex) 월 -> MON
ax5.info.weekNames = [
	{label: "일"},
	{label: "월"},
	{label: "화"},
	{label: "수"},
	{label: "목"},
	{label: "금"},
	{label: "토"}
];

picker.bind({
  target: $('[data-ax5picker="basic2"]'),
  direction: "top",
  content: {
      width: 220,
      margin: 10,
      type: 'date',
      config: {
          control: {
              left: '<i class="fa fa-chevron-left"></i>',
              yearTmpl: '%s',
              monthTmpl: '%s',
              right: '<i class="fa fa-chevron-right"></i>'
          },
          dateFormat: 'yyyy/MM/dd',
          lang: {
              yearTmpl: "%s년",
              months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
              dayTmpl: "%s"
          }
      },
      formatter: {
          pattern: 'date'
      }
  },
  onStateChanged: function () {
  },
  btns: {
      today: {
          label: "Today", onClick: function () {
              var today = new Date();
              this.self
                      .setContentValue(this.item.id, 0, ax5.util.date(today, {"return": "yyyy/MM/dd"}))
                      .setContentValue(this.item.id, 1, ax5.util.date(today, {"return": "yyyy/MM/dd"}))
                      .close();
          }
      },
      thisMonth: {
          label: "This Month", onClick: function () {
              var today = new Date();
              this.self
                      .setContentValue(this.item.id, 0, ax5.util.date(today, {"return": "yyyy/MM/01"}))
                      .setContentValue(this.item.id, 1, ax5.util.date(today, {"return": "yyyy/MM"})
                              + '/'
                              + ax5.util.daysOfMonth(today.getFullYear(), today.getMonth()))
                      .close();
          }
      },
      ok: {label: "Close", theme: "default"}
  }
});


grid_fileList.setConfig({
    target: $('[data-ax5grid="grid_fileList"]'),
    sortable: true, 
    multiSort: true,
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
        	if (this.dindex < 0) return;
    		swal({
                title: "신청상세팝업",
                text: "신청번호 ["+this.item.acptno2+"]["+param.item.qrycd2+"]["+this.dindex+"]"
           });
    		
			openWindow(1, param.item.qrycd2, this.item.acptno2,'');
        }
    },
    columns: [
        {key: "fileName", label: "파일명",  width: '100%'} 
    ]
});

devUserGrid.setConfig({
    target: $('[data-ax5grid="devUserGrid"]'),
    sortable: true, 
    multiSort: true,
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
        	if (this.dindex < 0) return;
    		swal({
                title: "신청상세팝업",
                text: "신청번호 ["+this.item.acptno2+"]["+param.item.qrycd2+"]["+this.dindex+"]"
           });
    		
			openWindow(1, param.item.qrycd2, this.item.acptno2,'');
        }
    },
    columns: [
        {key: "fileName", label: "소속부서",  width: '30%'},
        {key: "fileName", label: "담당개발자",  width: '40%'},
        {key: "fileName", label: "상태",  width: '30%'}
    ]
});

var fileAddGrid;
var fileAddGridData;
var devUserGrid;
var devUserGridData;

var cboCatTypeSRData;
var cboChgTypeData;
var cboWorkRankData;
var cboReqSecuData;
var cboDevUserData;

var insertSrIdSw = false;
var inProgressSw = false;
var strIsrId = '';
var strDept = '';

var treeOranizationSubSw = false;

$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

$(document).ready(function() {
	//createElements();
	setCboElement();
	setCboDevUser();
	/* 다른화면에서 사용시 구현...
		if (strAcptNo != null && strAcptNo != "") {
			Cmr3100.gyulChk(strAcptNo,strUserId);//결재자 인지 체크
		}
	*/
	
	// 신규등록 - 체크박스 선택
	$('#chkNew').bind('click', function() {
		clickChkNew();
	});
	
	// 보안요구사항 - 직접기입시 input 상태값 변경
	$('#cboReqSecu').bind('change', function() {
		changeCboReqSecu();
	});
	
	//시스템상세정보
	$('#txtDept').bind('click', function() {
		deptModal.open({
	        width: 376,
	        height: 492,
	        iframe: {
	            method: "get",
	            url: "../modal/deptModal.jsp",
	            param: "callBack=sysDetailModalCallBack"
	        },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	                selectedSystem = null;
	            }
	        }
	    }, function () {
	    });
	});
	
});

function changeCboReqSecu() {
	if(getSelectedVal('cboReqSecu').value === '6') {
		$('#txtReqSecu').css('display','block');
	}else {
		$('#txtReqSecu').css('display','none');
		$('#cboReqSecu').removeClass('width-20');
		$('#cboReqSecu').addClass('width-100');
	}
}

function setCboDevUser(){	// 담당개발자 select 세팅
	var ajaxReturnData = null;
	var userInfo = {
		userInfoData: 	userid,
		requestType: 	'GET_USER_COMBO'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab', userInfo, 'json');
	if(ajaxReturnData !== 'ERR') {
		cboDevUserData = ajaxReturnData;
		options = [];
		$.each(cboDevUserData,function(key,value) {
			options.push({value: value.cm_userid, text: value.cm_idname});
		});
		
		$('[data-ax5select="cboDevUser"]').ax5select({
	        options: options
		});
		
		if(cboDevUserData.length === 2){
			$('[data-ax5select="cboDevUser"]').ax5select("setValue", userid, true);
		}
	}
}

function elementInit(initDivision) {
	if(initDivision === 'NEW'){
    	strIsrId = '';
    	/*if( this.parentDocument.toString().indexOf("eCmc0100") > -1 ) {
    		this.parentDocument.tab0.grdPrj.selectedIndex = -1;
    	}*/

    	$('#datReqComDate').val('');
    	$('#chkNew').wCheck('check',true);
    	$('#btnUpdate').attr('readonly', true);
    	$('#btnRegister').attr('readonly', false);
    	$('#btnDelete').attr('readonly', true);
    	$('#txtSRID').val('신규등록');
    	$('#txtRegUser').val(userName);
    	$('#txtRegDate').val('신규등록');
    	
    	$('#txtSRID').attr('readonly', true);
    	$('#txtRegUser').attr('readonly', true);
    	$('#txtRegDate').attr('readonly', true);
    	
    	insertSrIdSw = true;
    	
    	setCboDevUser();
		
    }/* else if(strIsrId !== null && strIsrId !== '') {
    	
    	if(initDivision === 'M'){
    		SBUxMethod.refresh('chkNew');
    		SBUxMethod.attr('btnRegister', 	'readonly', 'true');
    		SBUxMethod.attr('btnUpdate', 	'readonly', 'true');
    		SBUxMethod.attr('btnDelete', 	'readonly', 'true');
    	} else {
    		//저장 상태 - 모이라 등록건?
    		if( initDivision === '0') {
    			SBUxMethod.attr('btnRegister', 	'readonly', 'false');
        		SBUxMethod.attr('btnUpdate', 	'readonly', 'true');
        		SBUxMethod.attr('btnDelete', 	'readonly', 'true');
        	// 등록완료, 진행중, 등록승인중 반려
    		} else if( initDivision === '2' || initDivision === 'C' || initDivision === '4') {
    			//등록완료, 진행중 이면
    			if(initDivision === '2'  || initDivision === 'C' ) { 
    				SBUxMethod.attr('btnDelete', 	'readonly', 'false');
    			//등록승인중반려 면
    			} else { 
    				SBUxMethod.attr('btnDelete', 	'readonly', 'true');
	    		}
    			SBUxMethod.attr('btnRegister', 	'readonly', 'true');
        		SBUxMethod.attr('btnUpdate', 	'readonly', 'false');
    		}else { //그외 상태일 때
    			
    			SBUxMethod.attr('btnRegister', 	'readonly', 'true');
        		SBUxMethod.attr('btnUpdate', 	'readonly', 'true');
        		SBUxMethod.attr('btnDelete', 	'readonly', 'true');
        		
        		//등록승인중, 반려, 적용확인중, 완료승인중 이면
		    	if( initDivision === '1' || initDivision === '3' || 
		    			initDivision === '5' || initDivision === 'A') {
		    		SBUxMethod.attr('btnFileAdd', 		'readonly', 'true');
	        		SBUxMethod.attr('btnAddDevUser', 	'readonly', 'true');
	        		SBUxMethod.attr('btnDelDevUser', 	'readonly', 'true');
		    	}
	    	}
    		
    		SBUxMethod.set('txtSRID',	'');
    		SBUxMethod.set('txtRegUser','');
    		SBUxMethod.set('txtRegDate','');
    		
    		insertSrIdSw = false;
    		
    	}
    }*/else {
    	$('#datReqComDate').val('');
    	$('#chkNew').wCheck('check',false);
    	$('#btnUpdate').attr('readonly', true);
    	$('#btnRegister').attr('readonly', true);
    	$('#btnDelete').attr('readonly', true);
    	$('#txtSRID').val('');
    	$('#txtRegUser').val('');
    	$('#txtRegDate').val('');
    	
    	$('#txtSRID').attr('readonly', true);
    	$('#txtRegUser').attr('readonly', true);
    	$('#txtRegDate').attr('readonly', true);
    }
	
	
	//SBUxMethod.set('txtDocuNum', 	'');
	//SBUxMethod.set('txtRegUser', 	'');
	//SBUxMethod.set('txtReqSubject', '');
	//SBUxMethod.set('texReqContent', '');
	//SBUxMethod.set('txtDevUser', 	'');
	
	//fileAddGridData = null;
	//devUserGridData = null;
	
	//fileAddGrid.refresh();
	//devUserGrid.refresh();
	
}

function setCboElement() {
	var codeInfos = getCodeInfoCommon( [new CodeInfo('CATTYPE','SEL','N'),
										new CodeInfo('CHGTYPE','SEL','N'),
										new CodeInfo('WORKRANK','SEL','N'),
										new CodeInfo('REQSECU','SEL','N')
										] );
	
	cboCatTypeSRData= codeInfos.CATTYPE;
	cboChgTypeData= codeInfos.CHGTYPE;
	cboWorkRankData= codeInfos.WORKRANK;
	cboReqSecuData= codeInfos.REQSECU;
	
	options = [];
	$.each(cboCatTypeSRData,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboCatTypeSR"]').ax5select({
        options: options
	});
	
	options = [];
	$.each(cboChgTypeData,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboChgType"]').ax5select({
        options: options
	});
	
	options = [];
	$.each(cboWorkRankData,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboWorkRank"]').ax5select({
        options: options
	});
	
	options = [];
	$.each(cboReqSecuData,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboReqSecu"]').ax5select({
        options: options
	});
	
}

function clickChkNew() {
	if($('#chkNew').is(':checked')) {
		elementInit('NEW')
	} else {
		elementInit('');
	}
}

/*$('#exampleModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget) // Button that triggered the modal
	var recipient = button.data('whatever') // Extract info from data-* attributes
	var modal = $(this)
	modal.find('.modal-title').text('New message to ' + recipient)
	modal.find('.modal-body input').val(recipient)
})*/


// findDivision = 1 > 사람검색
// findDivision = 0 > 부서검색
function findPesonOrDepart(findDivision) {
	if(findDivision === '1') treeOranizationSubSw = true;
	else treeOranizationSubSw = false;
	SBUxMethod.openModal('modalOrganization');
	
	console.log(treeOranizationSubSw);
	
	var modalIframe = document.getElementById("modalOrganizationBody");
	modalIframe.contentWindow.modalOrganizationInit(treeOranizationSubSw);

}

function closeModal(flag) {
	var modalIframe = document.getElementById("modalOrganizationBody").contentWindow;
	SBUxMethod.closeModal('modalOrganization');
	
	if(flag) {
		if(treeOranizationSubSw) {
			cboDevUserData = null;
			var cboDevUserDataArray = [];
			var cboDevUserDataObject= {};
			cboDevUserDataObject.cm_userid = '0000';
			cboDevUserDataObject.cm_username = modalIframe.selectedData.username;
			cboDevUserDataObject.cm_idname = '선택하세요';
			cboDevUserDataObject.cm_deptcd = modalIframe.selectedData.cm_deptcd;
			cboDevUserDataObject.cm_deptname = '';
			cboDevUserDataArray.push(cboDevUserDataObject);
			
			cboDevUserDataObject= {};
			cboDevUserDataObject.cm_userid 	 = modalIframe.selectedData.id;
			cboDevUserDataObject.cm_username = modalIframe.selectedData.username;
			cboDevUserDataObject.cm_idname = modalIframe.selectedData.username+'['+modalIframe.selectedData.id+']';
			cboDevUserDataObject.cm_deptcd 	 = modalIframe.selectedData.deptcd;
			cboDevUserDataObject.cm_deptname = modalIframe.selectedData.deptname;
			cboDevUserDataArray.push(cboDevUserDataObject);
			
			cboDevUserData = cboDevUserDataArray;
			SBUxMethod.refresh('cboDevUser');
			if(cboDevUserData.length === 2) $("#cboDevUser option:eq(1)").attr("selected","selected");
			
			SBUxMethod.set('txtDevUser',modalIframe.selectedData.username);
			
			//개발자 추가버튼 클릭해주기!!!
		} else {
			SBUxMethod.set('txtDept',modalIframe.selectedData.text);
			strDept = modalIframe.selectedData.id;
		}
	}
}
