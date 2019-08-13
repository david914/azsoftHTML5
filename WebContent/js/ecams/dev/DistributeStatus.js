var userName 	= window.top.userName;
var userid 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;
var strReqCD 	= window.top.reqCd;

var userName 	= '관리자';
var userid 		= 'MASTER';
var adminYN 	= 'Y';

var firstGrid 	= new ax5.ui.grid();
var picker 		= new ax5.ui.picker();

var myWin 			= null;;
var isAdmin 		= false;
var options 		= [];

var firstGridData 	= null;
var cboSysCdData 	= null;
var cboDeptData		= null;
var cboGbnData		= null;
var cboSinData		= null;
var cboStaData		= null;


// 이 부분 지우면 영어명칭으로 바뀜
// ex) 월 -> MON
ax5.info.weekNames = [
    {label: "일"},
    {label: "월"},
    {label: "화"},
    {label: "수"},
    {label: "목"},
    {label: "금"},
    {label: "토"}
];


$('#datStD').val(getDate('DATE',0));
$('#datEdD').val(getDate('DATE',0));

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

 
firstGrid.setConfig({
     target: $('[data-ax5grid="firstGrid"]'),
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
     		
 			openWindow(1, this.item.qrycd, this.item.acptno,'');
         },
     	trStyleClass: function () {
     		//처리 상태에 따른 컬러지정
     		if (this.item.errflag !== '1'){
	     		if (this.item.cr_status === '3'){
	     			return "fontStyle-cncl";
	     		} else if (this.item.cr_status === '0'){
	     			return "fontStyle-ing";
	     		}
     		} else {
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
             {type: 1, label: "변경신청상세"},
             {type: 2, label: "결재정보"},
             {type: 3, label: "전체회수"}
         ],
         popupFilter: function (item, param) {
         	/** 
         	 * return 값에 따른 context menu filter
         	 * 
         	 * return true; -> 모든 context menu 보기
         	 * return item.type == 1; --> type이 1인 context menu만 보기
         	 * return item.type == 1 | item.type == 2; --> type 이 1,2인 context menu만 보기
         	 * 
         	 * ex)
	            	if(param.item.qrycd === '01'){
	            		return item.type == 1 | item.type == 2;
	            	}
         	 */
          	firstGrid.clearSelect();
          	firstGrid.select(Number(param.dindex));
        	 
        	var selIn = firstGrid.selectedDataIndexs;
        	if(selIn.length === 0) return;
        	 
         	if (param.item == undefined) return false;
         	if (param.dindex < 0) return false;
         	
         	
         	if (param.item.colorsw === '9') return item.type == 1 | item.type == 2;
         	else if ( (param.item.qrycd === '07' || param.item.qrycd === '03' || param.item.qrycd === '04' 
         			|| param.item.qrycd === '06' || param.item.qrycd === '16') 
         			&& (userid === param.item.editor2 || isAdmin) ) return true; 
         	else return item.type == 1 | item.type == 2;
         },
         onClick: function (item, param) {
     		openWindow(item.type, param.item.qrycd, param.item.acptno,'');
            firstGrid.contextMenu.close();//또는 return true;
         }
     },
     columns: [
         {key: "cc_srid", label: "SR-ID",  width: ""},
         {key: "genieid", label: "GENIE번호",  width: ""},
         {key: "sysgbname", label: "시스템",  width: ""},
         {key: "sin", label: "신청종류",  width: ""},
         {key: "editor", label: "신청자",  width: ""},
         {key: "acptno", label: "신청번호",  width: ""},
         {key: "acptdate", label: "신청일시",  width: ""},
         {key: "cm_codename", label: "진행상태",  width: ""},
         {key: "procgbn", label: "처리구분",  width: ""},
         {key: "grdprcreq", label: "적용예정일시",  width: ""},
         {key: "prcdate", label: "완료일시",  width: ""},
         {key: "rsrcnamememo", label: "신청내용",  width: ""},
         {key: "cr_sayu", label: "신청사유",  width: ""}         
     ]
});


$(document).ready(function(){
	
	$('input:radio[name=rdoDate]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});
	$('input:checkBox[name=checkSelf]').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
	
	//콤보박스 데이터 세팅
	getCodeInfo();
	prcdSet();
	cboGbnSet();
	getUserInfo();
	getSysInfo();
	
	// 엑셀저장버튼 클릭
	$('#btnExcel').bind('click', function() {
		firstGrid.exportExcel("grid-to-excel.xls");
	});
	
	// 초기화 버튼 클릭
	$('#btnReset').bind('click', function() {
		resetScreen();
	});
	
	// 조회 버튼 클릭
	$('#btnSearch').bind('click', function() {
		getFileList();
	});
	
	// 프로그램명/설명 엔터
	$('#txtDisc').bind('keypress', function(event){
		if(event.keyCode==13) {
			$('#btnSearch').trigger('click');
		}
	});
	
	// 신청자명 엔터
	$('#txtName').bind('keypress', function(event){
		if(event.keyCode==13) {
			$('#btnSearch').trigger('click');
		}
	});
	
	// SR-ID/SR명/문서번호 엔터
	$('#txtId').bind('keypress', function(event){
		if(event.keyCode==13) {
			$('#btnSearch').trigger('click');
		}
	});
	
	//본인건만 체크시 텍스트박스 en/disable
	$("#checkSelf").bind('click', function() {
		if($("#checkSelf").is(":checked")) {
			$("#txtName").prop('disabled', true);
		} else {		
			$("#txtName").prop('disabled', false);
		}
	});
	
	//콤보박스 데이터 세팅이 완료되기 전에 리스트가 불러와져서 타임아웃 설정 
	setTimeout(function() {
		getFileList();
	}, 300);
});

// 어드민 여부 확인
function getUserInfo(){
	var data =  new Object();
	data = {
		UserId			: userid,
		requestType		: 'getUserInfo'
	}
	ajaxAsync('/webPage/dev/DistributeStatus', data, 'json',successGetUserInfo);
}

// 어드민 여부 확인 완료
function successGetUserInfo(data) {
	if(strReqCD != null && strReqCD != "") {
		$("#txtUser").text(data.cm_username);
	}
	if (data.cm_admin === '1') {
		isAdmin = true;
	}
}

// 시스템 cbo 가져오기 완료
function successGetSysInfo(data) {
	cboSysCdData = data;
	options = [];
	$.each(cboSysCdData,function(key,value) {
		options.push({value: value.cm_syscd, text: value.cm_sysmsg});
	});
	
	$('[data-ax5select="cboSysCd"]').ax5select({
        options: options
	});
}

// 시스템 cbo 가져오기
function getSysInfo(){
	var data =  new Object();
	data = {
		UserId : userid,
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/dev/DistributeStatus', data, 'json',successGetSysInfo);
}


//신청종류 가져오기
function getCodeInfo() {
	var data = { requestType : 'getCodeInfo' };
	ajaxAsync('/webPage/dev/DistributeStatus', data, 'json', successGetCodeInfo);
}

//신청종류 가져오기 완료
function successGetCodeInfo(data) {
	options = [];
	var chkOut = ["00", "01", "02", "11"];
	var chkIn = ["00", "03", "06", "07"];
	var dist = ["00", "03", "04", "06", "07"];
	var count = 0;
	console.log(data);
	
	//reqCd에 따라서 신청종류 데이터를 다르게 세팅
	switch(strReqCD) {	
	case "01" :
		for(var i = 0; i < data.length; i++) {
			if(data[i].cm_micode == chkOut[count]) {
				options.push({value: data[i].cm_micode, text: data[i].cm_codename});
				count++;
			}
		}
		break;
	case "03": case "07":
		for(var i = 0; i < data.length; i++) {
			if(data[i].cm_micode == chkIn[count]) {
				options.push({value: data[i].cm_micode, text: data[i].cm_codename});
				count++;
			}
		}
		break;
	case "04" :
		for(var i = 0; i < data.length; i++) {
			if(data[i].cm_micode == dist[count]) {
				options.push({value: data[i].cm_micode, text: data[i].cm_codename});
				count++;
			}
		}
		break;
	default:
		break;
	}
	
	$('[data-ax5select="cboType"]').ax5select({
        options: options
	});
	
	typeDefaultSet();
}

//reqCd에 따른 신청종류 default값 세팅
function typeDefaultSet() {
	if(strReqCD == '01') {
		$("#gbnLabel").attr("style", "visibility: hidden;");
		$("#cboGbn").attr("style", "visibility: hidden;");
		$('[data-ax5select="cboType"]').ax5select("setValue", '01', true);
	} else if (strReqCD == '07'){
		$('[data-ax5select="cboType"]').ax5select("setValue", '07', true);
	} else if (strReqCD == '04'){
		$('[data-ax5select="cboType"]').ax5select("setValue", '04', true);
	} else if (strReqCD == '03'){
		$('[data-ax5select="cboType"]').ax5select("setValue", '03', true);
	}
}

//진행상테 세팅
function prcdSet() {
	$('[data-ax5select="cboStat"]').ax5select({
		options : [
			{value: 0, text: "전체"},
			{value: 1, text: "미완료"},
			{value: 3, text: "반려/회수"},
			{value: 9, text: "완료"}			
		]
	})
}

//처리구분 세팅
function cboGbnSet() {
	$('[data-ax5select="cboGbn"]').ax5select({
		options : [
			{value: "ALL", text: "전체"},
			{value: 0, text: "일반적용"},
			{value: 4, text: "수시적용"},
			{value: 2, text: "긴급적용"}			
			]
	})
}

// 초기화 버튼 클릭
function resetScreen(){
	var today = getDate('DATE',0);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	firstGrid.setData([]); // grid 초기화
	$('[data-ax5select="cboSysCd"]').ax5select("setValue", '00000', true);
	$('[data-ax5select="cboStat"]').ax5select("setValue", '00', true);
	$('[data-ax5select="cboGbn"]').ax5select("setValue", 'ALL', true);
	$('#rdoStrDate').trigger('click');										// 신청일 기준으로 초기화
	$("#txtName").val('');													// 신청인 초기화 
	$("#txtId").val('');													// SR-ID 초기화
	$("#txtDisc").val('');													// SR-ID 초기화
	$('#datStD').val(today);
	$('#datEdD').val(today);
	if($("#checkSelf").is(":checked")) {
		$("#checkSelf").trigger('click');
	}
	typeDefaultSet();
}

// 신청현황 리스트 가져오기
function getFileList(){
	var prjData = new Object();
	
	prjData.syscd		= $('[data-ax5select="cboSysCd"]').ax5select("getValue")[0].value;
	prjData.jobcd		= "0000";
	prjData.spms		= $("#txtId").val().trim() == "" ? null : $("#txtId").val().trim();
	prjData.stepcd		= $('[data-ax5select="cboStat"]').ax5select("getValue")[0].value;
	prjData.reqcd		= $('[data-ax5select="cboType"]').ax5select("getValue")[0].value;
	prjData.req 		= strReqCD;
	prjData.UserID	 	= userid;
	prjData.dategbn		= $("#rdoStrDate").is(':checked') ? 0 : 1;
	prjData.stDt 		= $("#datStD").val();
	prjData.edDt 		= $("#datEdD").val();
	if(strReqCD == '04') {
		prjData.docno	= "0";
		prjData.gbn		= $('[data-ax5select="cboGbn"]').ax5select("getValue")[0].value;
	} else {
		prjData.docno	= "0";
		prjData.gbn		= "ALL";
	}
	
	prjData.prgname = $("#txtDisc").val().trim();
	
	if($("#checkSelf").is(':checked')) {
		prjData.chkSelf = "true";
		prjData.userName = "";
	} else {
		prjData.chkSelf = "false";
		prjData.userName = $("#txtName").val().trim();		
	}
	
	var data =  new Object();
	data = {
		requestType : 'getFileList',
		prjData: prjData
	}
	ajaxAsync('/webPage/dev/DistributeStatus', data, 'json',successGetFileList);
}

// 신청 리스트 가져오기 완료
function successGetFileList(data) {
	console.log(data);
	firstGridData = data;
	firstGrid.setData(firstGridData);
}

function openWindow(type,reqCd,reqNo,rsrcName) {
	var nHeight, nWidth, cURL, winName;

	if ( (type+'_'+reqCd) == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}

    winName = type+'_'+reqCd;

	var f = document.popPam;   		//폼 name
    
    f.acptno.value	= replaceAllString(reqNo, "-", "");    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.user.value 	= userid;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    
	if (type == 1) {
		nHeight = screen.height - 300;
	    nWidth  = screen.width - 400;

		cURL = "/webPage/winpop/PopRequestDetail.jsp";
	    
	} else if (type == 2) {
		nHeight = 400;
	    nWidth  = 900;

		cURL = "/webPage/winpop/PopApprovalInfo.jsp";
	}
	
	console.log(f);
	console.log('+++++++++++++++++'+cURL);
	
    myWin = winOpen(f, winName, cURL, nHeight, nWidth);
    
}