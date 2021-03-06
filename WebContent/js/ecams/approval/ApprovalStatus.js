/**
 * 결재현황 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-07-05
 * 
 */

var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드

var approGrid		= new ax5.ui.grid();

var approGridData 	= [];
var cboSysData		= [];
var cboApproData 	= [];
var cboReqData		= [];
var cboApproDeData	= [];
var cboApproStaData = [];
var cboPrcData		= [];

var myWin			= null;
 
approGrid.setConfig({
    target: $('[data-ax5grid="approGrid"]'),
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
        	if(approGrid.selectedDataIndexs.length < 1 ) {
        		return;
        	}
        	var item = approGrid.list[approGrid.selectedDataIndexs];
        	openApprovalInfo(1, item.cr_acptno, item.cr_qrycd, item.cc_srid);
        },
    	trStyleClass: function () {
    		if(this.item.colorsw === '0'){
    			return "fontStyle-ing";
     		} 
     		if(this.item.colorsw === '3'){
    			return "fontStyle-cncl";
     		} 
     		if(this.item.colorsw === '5'){
    			return "fontStyle-error";
     		} 
    	},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    contextMenu: {
        iconWidth: 20,
        acceleratorWidth: 100,
        itemClickAndClose: false,
        icons: {
            'arrow': '<i class="fa fa-caret-right"></i>'
        },
        items: [
            {type: 1, label: "결재요청내용확인"},
            {type: 2, label: "결재정보"}
        ],
        popupFilter: function (item, param) {
         	approGrid.clearSelect();
         	approGrid.select(Number(param.dindex));
       	 
	       	var selIn = approGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
       	 
        	if (param.item == undefined) return false;
        	if (param.dindex < 0) return false;
        	
        	return true;
        },
        onClick: function (item, param) {
        	console.log(param);
        	openApprovalInfo(item.type, param.item.cr_acptno, param.item.cr_qrycd, param.item.cc_srid);
        	approGrid.contextMenu.close();
        }
    },
    columns: [
        {key: "cm_sysmsg", 	label: "시스템",  	width: '6%', align: "left"},
        {key: "spms",	 	label: "SR-ID",  	width: '16%', align: "left"},
        {key: "acptno", 	label: "신청번호",  	width: '9%'},
        {key: "editor", 	label: "신청자",  	width: '6%'},
        {key: "qrycd",  	label: "신청종류",  	width: '7%', align: "left"},
        {key: "REQPASS", 	label: "처리구분",  	width: '7%'},
        {key: "acptdate", 	label: "신청일시",  	width: '9%',  align: "left"},
        {key: "acptStatus", label: "진행상태",  	width: '5%'},
        {key: "sta",  		label: "결재상태",  	width: '5%',  align: "left"},
        /*{key: "qrycd",  	label: "결재사유",  	width: '6%',  align: "left"},*/
        {key: "confdate",  	label: "결재일시",  	width: '8%' },
        {key: "prcreq",  	label: "적용예정일시", 	width: '8%' },
        {key: "Sunhang",  	label: "선후행작업",  	width: '6%',  align: "left"},
        {key: "sayu",  		label: "신청사유",  	width: '8%',  align: "left"},
    ]
});

$('[data-ax5select="cboSys"]').ax5select({
    options: []
});
$('[data-ax5select="cboAppro"]').ax5select({
	options: []
});
$('[data-ax5select="cboReq"]').ax5select({
	options: []
});
$('[data-ax5select="cboApproDe"]').ax5select({
	options: []
});
$('[data-ax5select="cboApproSta"]').ax5select({
	options: []
});
$('[data-ax5select="cboPrc"]').ax5select({
	options: []
});

$('input:radio[name^="radio"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});

$(document).ready(function() {
	initDate();
	getCodeInfo();
	
	$('#optReq').wRadio('check', true);
	$('#dateSt').prop('disabled', true);
	$('#dateEd').prop('disabled', true);
	$('.btn_calendar').css('background-color','#ddd');
	
	// 신청자 엔터
	$('#txtUser').bind('keypress', function(event) {
		if(event.keyCode === 13) {
			$('#btnQry').trigger('click');
		}
	});
	// SRID 엔터
	$('#txtSr').bind('keypress', function(event) {
		if(event.keyCode === 13) {
			$('#btnQry').trigger('click');
		}
	});
	
	// 결재 상태 콤보 변경
	$('#cboApproSta').bind('change', function() {
		if(getSelectedVal('cboApproSta').value === '01') {
			$('#dateSt').prop('disabled', true);
			$('#dateEd').prop('disabled', true);
			$('.btn_calendar').css('background-color','#ddd');
		} else {
			$('#dateSt').prop('disabled', false);
			$('#dateEd').prop('disabled', false);
			$('.btn_calendar').css('background-color','#fff');
		}
		
		$('#btnQry').trigger('click');
	});
	
	// 조회 버튼 클릭
	$('#btnQry').bind('click', function() {
		getRequestList();
	});
	// 엑셀저장
	$('#btnExcel').bind('click', function() {
		approGrid.exportExcel('결재현황.xls');
	});
	// 초기화 클릭
	$('#btnInit').bind('click', function() {
		screenInit();
	});
	
	var oldVal = "";
	// 기간 선택 달력의 경우 두번째 달력 값 선택 또는 변경시 자동으로 달력 닫히게 추가
	$('#dateEd').bind('propertychange change keyup paste input', function() {
		var currentVal =  $("#dateEd").val();
		if(currentVal != oldVal){
			picker.close();
		}
		oldVal = currentVal;
	});
});

// 결재 정보 창 띄우기
function openApprovalInfo(type, acptNo, reqCd, srId) {
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
	form.user.value 	= userId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.srid.value 	= srId;    		//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	
    if(type === 1) {
    	nHeight = screen.height - 300;
	    nWidth  = screen.width - 400;
	    
	    if(Number(reqCd) < 20) {
	    	cURL = "/webPage/winpop/PopRequestDetail.jsp";
	    } else {
	    	cURL = '/webPage/winpop/PopSRInfo.jsp';
	    }
    }
    
    if(type === 2) {
		nHeight = 480;
        nWidth  = 1046;
    	cURL	= '/webPage/winpop/PopApprovalInfo.jsp';
    }
   
	myWin = winOpen(form, winName, cURL, nHeight, nWidth);
}

// 화면 초기화
function screenInit() {
	$('#txtUser').val('');
	$('#txtSr').val('');
	$('#optReq').wRadio('check', true);
	$('[data-ax5select="cboSys"]').ax5select('setValue', cboSysData[0].cm_syscd, true);
	$('[data-ax5select="cboAppro"]').ax5select('setValue', cboApproData[0].cm_micode, true);
	$('[data-ax5select="cboReq"]').ax5select('setValue', cboReqData[0].cm_micode, true);
	$('[data-ax5select="cboApproDe"]').ax5select('setValue', cboApproDeData[0].cm_deptcd, true);
	$('[data-ax5select="cboApproSta"]').ax5select('setValue', '01', true);
	$('[data-ax5select="cboPrc"]').ax5select('setValue', cboPrcData[0].cm_micode, true);
	
	$('#cboApproSta').trigger('change');
	initDate();
}

// 결재 현황 리스트 가져오기
function getRequestList() {
	var strSys 	= '0';
	var strQry 	= '0';
	var strGbn 	= '0';
	var strTeam = '0';
	var strProc = '0';
	var strSta 	= '0';
	
	var txtUser = $('#txtUser').val().trim();
	var txtSr = $('#txtSr').val().trim();
	
	var radioSel = $('input[name="radio"]:checked').val();
	var dateSt = replaceAllString($('#dateSt').val().trim(),'/','');
	var dateEd = replaceAllString($('#dateEd').val().trim(),'/','');
	
	if(dateSt > dateEd) {
		dialog.alert('조회기간을 정확하게 선택하여 주십시오.', function() {});
		return;
	}
	
	strSys  = getSelectedIndex('cboSys') > 0 ?  getSelectedVal('cboSys').value : strSys;
	strQry  = getSelectedIndex('cboAppro') > 0 ?  getSelectedVal('cboAppro').value : strQry;
	strGbn  = getSelectedIndex('cboReq') > 0 ?  getSelectedVal('cboReq').value : strGbn;
	strTeam = getSelectedIndex('cboApproDe') > 0 ?  getSelectedVal('cboApproDe').value : strTeam;
	strSta = getSelectedIndex('cboApproSta') > 0 ?  getSelectedVal('cboApproSta').value : strSta;
	strProc  = getSelectedIndex('cboPrc') > 0 ?  getSelectedVal('cboPrc').value : strProc;

	var data = new Object();
	data = {
		syscd 		: strSys,
		gbn 		: strGbn,
		pReqCd 		: strQry,
		pTeamCd 	: strTeam,
		pStateCd 	: strSta,
		pReqUser 	: txtUser,
		pStartDt 	: dateSt,
		pEndDt 		: dateEd,
		pUserId 	: userId,
		dategbn 	: radioSel,
		txtspms 	: txtSr,
		pProc 		: strProc,
		requestType	: 'getSelectList'
	}
	ajaxAsync('/webPage/approval/ApprovalStatus', data, 'json',successGetSelectList);
}
// 결재 현황 리스트 가져오기 완료
function successGetSelectList(data) {
	approGridData = data;
	approGrid.setData(approGridData);
}


// 부서 정보 가져오기
function getTeamInfo() {
	var data = new Object();
	data = {
		selMsg 		: 'ALL',
		cm_useyn 	: 'Y',
		gubun 		: 'sub',
		itYn 		: 'N',
		requestType	: 'getTeamInfo'
	}
	ajaxAsync('/webPage/approval/ApprovalStatus', data, 'json',successGetTeamInfo);
}

// 부서 정보 가져오기 완료
function successGetTeamInfo(data) {
	cboApproDeData = data;
	$('[data-ax5select="cboApproDe"]').ax5select({
		options: injectCboDataToArr(cboApproDeData, 'cm_deptcd' , 'cm_deptname')
	});
	
	$('#btnQry').trigger('click');
}

// 시스템 정보 가져오기
function getSysInfo() {
	var data = new Object();
	data = {
		userId 		: userId,
		secuYn 		: 'Y',
		selMsg 		: 'ALL',
		closeYn 	: 'N',
		reqCd 		: '',
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/approval/ApprovalStatus', data, 'json',successGetSysInfo);
}

// 시스템 정보 가져오기완료
function successGetSysInfo(data) {
	cboSysData = data;
	$('[data-ax5select="cboSys"]').ax5select({
		options: injectCboDataToArr(cboSysData, 'cm_syscd' , 'cm_sysmsg')
	});
	getTeamInfo();
}


// 콤보정보 가져오기
function getCodeInfo() {
	getSysInfo();
	
	var codeInfos = getCodeInfoCommon([
			new CodeInfo('REQUEST','ALL','N'),
			new CodeInfo('APPROVAL','ALL','N'),
			new CodeInfo('REQPASS','ALL','N'),
			new CodeInfo('PRCSTATUS','ALL','N')
	]);
	cboApproData = codeInfos.REQUEST;
	cboApproStaData = codeInfos.APPROVAL;
	cboReqData = codeInfos.REQPASS;
	cboPrcData = codeInfos.PRCSTATUS;
	
	$('[data-ax5select="cboAppro"]').ax5select({
		options: injectCboDataToArr(cboApproData, 'cm_micode' , 'cm_codename')
	});
	
	$('[data-ax5select="cboApproSta"]').ax5select({
		options: injectCboDataToArr(cboApproStaData, 'cm_micode' , 'cm_codename')
	});
	
	$('[data-ax5select="cboPrc"]').ax5select({
		options: injectCboDataToArr(cboPrcData, 'cm_micode' , 'cm_codename')
	});
	
	$('[data-ax5select="cboReq"]').ax5select({
		options: injectCboDataToArr(cboReqData, 'cm_micode' , 'cm_codename')
	});
	
	$('[data-ax5select="cboApproSta"]').ax5select('setValue', '01', true);
}

// 달력 초기화
function initDate(){
	$('#dateSt').val(getDate('DATE', 0));
	$('#dateEd').val(getDate('DATE', 0));
	picker.bind({
	    target: $('[data-ax5picker="basic"]'),
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
}