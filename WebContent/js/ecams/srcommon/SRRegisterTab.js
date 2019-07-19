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
var strReqCd 	= window.parent.strReqCd;

var organizationModal 	= new ax5.ui.modal();    // 조직도 팝업

var grid_fileList 	= new ax5.ui.grid();
var devUserGrid 	= new ax5.ui.grid();
var picker 		= new ax5.ui.picker();
var strStatus = "";

var fileGridData = new Object();

var cboCatTypeSRData;
var cboChgTypeData;
var cboWorkRankData;
var cboReqSecuData;
var cboDevUserData;

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
// 그리드 테스트
var fileGrid = true;

// 파일첨부 팝업
var fileUploadModal = new ax5.ui.modal({
	theme: "warning",
    header: {
        title: '<i class="glyphicon glyphicon-file" aria-hidden="true"></i> [첨부파일]',
        btns: {
            minimize: {
                label: '<i class="fa fa-minus-circle" aria-hidden="true"></i>', onClick: function(){
                	fileUploadModal.minimize('bottom-right');
                }
            },
            restore: {
                label: '<i class="fa fa-plus-circle" aria-hidden="true"></i>', onClick: function(){
                	fileUploadModal.restore();
                }
            },
            close: {
                label: '<i class="fa fa-times-circle" aria-hidden="true"></i>', onClick: function(){
                	fileUploadModal.close();
                	//fileUploadModal.minimize('bottom-right');
                }
            }
        }
    }
});

var fileUploadModalCallBack = function() {
	fileLength = 0;
	fileUploadModal.close();
} 

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
        }
    },
    columns: [
        {key: "name", label: "파일명",  width: '100%'} 
    ],
    page:{
    	display : false
    }
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
        }        
    },
    columns: [
        {key: "cm_deptname", label: "소속부서",  width: '30%'},
        {key: "cm_username", label: "담당개발자",  width: '40%'},
        {key: "cm_codename", label: "상태",  width: '30%'}
    ],
    page:{
    	display : false
    }
});

$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

$(document).ready(function() {
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
	
	//요청부서
	// selDeptSw = true > 사람검색
	// selDeptSw = false > 부서검색
	$('#txtOrg').bind('click', function() {
		subSw = false;
		selDeptSw = true;
		openOranizationModal();
	});
	
	//담당개발자
	$('#txtUser').bind('click', function() {
		subSw = true;
		selDeptSw = false;
		openOranizationModal();
	});
	
	// 담당 개발자 추가 버튼
	$('#btnAddDevUser').bind('click', function(){
		btn_addDever();
	});
	
	// 담당개발자 삭제 버튼
	$('#btnDelDevUser').bind('click', function(){
		btn_DelDever();
	});
	
	// 파일첨부 버튼
	$('#btnFileAdd').bind('click', function(){
		fileOpen();
	});
	
});

//소소조직 선택 창 오픈
function openOranizationModal() {
	organizationModal.open({
        width: 400,
        height: 700,
        iframe: {
            method: "get",
            url: "../modal/OrganizationModal.jsp",
            param: "callBack=modalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
                closeModal();
            }
        }
    }, function () {
    });
}

var modalCallBack = function(){
	organizationModal.close();
};

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

		$('[data-ax5select="cboDevUser"]').ax5select({
	        options: injectCboDataToArr(cboDevUserData, 'cm_userid' , 'cm_idname')
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
    	$('#txtReqSecu').css('display','none');
    	
    	$('[data-ax5select="cboCatTypeSR"]').ax5select("setValue", '00', true);	
		$('[data-ax5select="cboChgType"]').ax5select("setValue", '00', true);
		$('[data-ax5select="cboWorkRank"]').ax5select("setValue", '00', true);
		$('[data-ax5select="cboReqSecu"]').ax5select("setValue", '00', true);
    	
    	insertSrIdSw = true;
    	
    	setCboDevUser();
		
    } else if(strIsrId !== null && strIsrId !== '') {
    	if(initDivision === 'M'){
    		$('#chkNew').wCheck('check', false);
    		$('#btnRegister').attr('disabled', true);
    		$('#btnUpdate').attr('disabled', true);
        	$('#btnDelete').attr('disabled', true);
    	} else {
    		//저장 상태 - 모이라 등록건?
    		if( strStatus === '0') {
        		$('#btnRegister').attr('disabled', false);
        		$('#btnUpdate').attr('disabled', false);
            	$('#btnDelete').attr('disabled', false);
        	// 등록완료, 진행중, 등록승인중 반려
    		} else if( strStatus === '2' || strStatus === 'C' || strStatus === '4') {
    			//등록완료, 진행중 이면
    			if(strStatus === '2'  || strStatus === 'C' ) { 
    				$('#btnDelete').attr('disabled', false);
    				$('#btnUpdate').attr('disabled', false);
    			//등록승인중반려 면
    			} else { 
    				$('#btnDelete').attr('disabled', true);
    				$('#btnUpdate').attr('disabled', true);
	    		}
    			
    			$('#btnRegister').attr('disabled', true);
        		
    		}else { //그외 상태일 때
    			$('#btnRegister').attr('disabled', true);
        		$('#btnUpdate').attr('disabled', true);
            	$('#btnDelete').attr('disabled', true);
        		
        		//등록승인중, 반려, 적용확인중, 완료승인중 이면
		    	if( strStatus === '1' || strStatus === '3' || 
		    			strStatus === '5' || strStatus === 'A') {
	        		$('#btnFileAdd').attr('disabled', true);
	        		$('#btnAddDevUser').attr('disabled', true);
	            	$('#btnDelDevUser').attr('disabled', true);
		    	}
	    	}
    		
    		$('#txtSRID').val('');
        	$('#txtRegUser').val('');
        	$('#txtRegDate').val('');
    		
    		insertSrIdSw = false;
    		
    	}
    } else {
    	$('#datReqComDate').val('');
    	$('#chkNew').wCheck('check',false);
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
	$('#txtDocuNum').val('');
	$('#txtReqSubject').val('');
	$('#texReqContent').val('');
	$('#txtUser').val('');
	$('#txtOrg').val('');
	
	grid_fileList.setData([]); // grid 초기화
	devUserGrid.setData([]);   // grid 초기화
}

//파일첨부
function fileOpen() {
	fileUploadModal.open({
        width: 600,
        height: 360,
        iframe: {
            method: "get",
            url: 	"../modal/notice/FileUpModal.jsp",
            param: "callBack=fileUploadModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
            }
            else if (this.state === "close") {
            }
        }
    }, function () {
    });
}

// 개발자 추가 버튼
function btn_addDever(){
	if(getSelectedIndex('cboDevUser') < 1){
		return;
	}
	
	for(var q=0; q < devUserGrid.list.length ; q++){
		// 중복데이터 추가안하는 로직
		if(devUserGrid.list[q].cm_username === getSelectedVal('cboDevUser').cm_username && devUserGrid.list[q].cm_deptcd === getSelectedVal('cboDevUser').cm_deptcd){
			return;
		}
	}
	
	var tmp = new Object();
	tmp.cm_username = getSelectedVal('cboDevUser').cm_username;
	tmp.cm_deptcd = getSelectedVal('cboDevUser').cm_deptcd;
	tmp.cm_deptname = getSelectedVal('cboDevUser').cm_deptname;
	tmp.delyn = "OK";
	
	devUserGrid.addRow($.extend({}, tmp, {__index: undefined}));
	devUserGrid.repaint();
}

// 개발자 삭제 버튼
function btn_DelDever(){
	devUserGrid.removeRow("selected");
	devUserGrid.repaint();
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


function closeModal() {
	cboDevUserData = null;
	var cboDevUserDataArray = [];
	var cboDevUserDataObject= {};
	cboDevUserDataObject.cm_userid = '0000';
	cboDevUserDataObject.cm_username = '';
	cboDevUserDataObject.cm_idname = '선택하세요';
	cboDevUserDataObject.cm_deptcd = '';
	cboDevUserDataObject.cm_deptname = '';
	cboDevUserDataArray.push(cboDevUserDataObject);
	
	cboDevUserDataObject= {};
	cboDevUserDataObject.cm_userid 	 = txtUserId;
	cboDevUserDataObject.cm_username = txtUserName;
	cboDevUserDataObject.cm_idname = txtUserName+'['+txtUserId+']';
	cboDevUserDataObject.cm_deptcd 	 = deptCd;
	cboDevUserDataObject.cm_deptname = deptName;
	cboDevUserDataArray.push(cboDevUserDataObject);
	
	cboDevUserData = cboDevUserDataArray;

	options = [];

	$('[data-ax5select="cboDevUser"]').ax5select({
        options: injectCboDataToArr(cboDevUserData, 'cm_userid' , 'cm_idname')
   	});
	
	if(cboDevUserData.length === 2){
		$('[data-ax5select="cboDevUser"]').ax5select("setValue", txtUserId, true);
	}
	
	btn_addDever();
}

// sr 리스트 클릭 이벤트
function firstGridClick(srid){
	$('#txtReqSecu').css('display','none');
	// sr 정보 가져오기 
	var ajaxReturnData = null;
	var srInfo = {
		srInfoData: 	srid,
		requestType: 	'selectSRInfo'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab', srInfo, 'json');
	if(ajaxReturnData !== 'ERR') {
		console.log(ajaxReturnData);
		
		$('#chkNew').wCheck('check', false);
		clickChkNew();

		$('#txtSRID').val(ajaxReturnData[0].cc_srid);
		$('#txtRegUser').val(ajaxReturnData[0].createuser);
		$('#txtRegDate').val(ajaxReturnData[0].createdate);
		strDept = ajaxReturnData[0].cc_reqdept;
		$('#txtDocuNum').val(ajaxReturnData[0].cc_docid);
		$('#txtOrg').val(ajaxReturnData[0].reqdept);
		
		$('#txtReqSubject').val(ajaxReturnData[0].cc_reqtitle);

		var tempDate = ajaxReturnData[0].cc_reqcompdate.substring(0,4) + "/" + ajaxReturnData[0].cc_reqcompdate.substring(4,6) + "/" + ajaxReturnData[0].cc_reqcompdate.substring(6,8);
		$('#datReqComDate').val(tempDate);
		
		$('#texReqContent').val(ajaxReturnData[0].cc_content);
		
		$('[data-ax5select="cboCatTypeSR"]').ax5select("setValue", ajaxReturnData[0].cc_cattype, true);	
		$('[data-ax5select="cboChgType"]').ax5select("setValue", ajaxReturnData[0].cc_chgtype, true);
		$('[data-ax5select="cboWorkRank"]').ax5select("setValue", ajaxReturnData[0].cc_workrank, true);
		if(ajaxReturnData[0].cc_reqsecu !== "0"){
			$('[data-ax5select="cboReqSecu"]').ax5select("setValue", ajaxReturnData[0].cc_reqsecu, true);
		} else {
			$('[data-ax5select="cboReqSecu"]').ax5select("setValue", "00", true);
		}
		
		if(ajaxReturnData[0].cc_reqsecu === "6"){
			$('#txtReqSecu').css('display','block');
			$('#txtReqSecu').val(ajaxReturnData[0].cc_txtreqsecu);
		}
		
		
		// cmc0100_tab.mxml 1082 라인
		ajaxReturnData = null;
		var docSr = {
			srInfoData: 	srid,
			strReqCd: 		strReqCd,
			requestType: 	'getDocList'
		}
		
		ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab', docSr, 'json');
		if(ajaxReturnData !== 'ERR'){
			grid_fileList.setData(ajaxReturnData);
		}
		
		ajaxReturnData = null;
		var devUser = {
			srInfoData: 	srid,
			userid: 		userid,
			requestType: 	'getDevUserList'
		}
		
		ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/SRRegisterTab', devUser, 'json');
		console.log(ajaxReturnData);
		if(ajaxReturnData !== 'ERR'){
			devUserGrid.setData(ajaxReturnData);
		}
	}
}
