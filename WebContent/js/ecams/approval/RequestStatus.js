

var userName 	= window.top.userName;
var userid 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;
var strReqCD 	= window.top.reqCd;

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
     		
 			openWindow(1, this.item.qrycd2, this.item.acptno2,'');
         },
     	trStyleClass: function () {
     		if(this.item.colorsw === '5'){
     			return "fontStyle-error";
     		} else if (this.item.colorsw === '3'){
     			return "fontStyle-cncl";
     		} else if (this.item.colorsw === '0'){
     			return "fontStyle-ing";
     		} else {
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
	            	if(param.item.qrycd2 === '01'){
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
         	else if ( (param.item.qrycd2 === '07' || param.item.qrycd2 === '03' || param.item.qrycd2 === '04' 
         			|| param.item.qrycd2 === '06' || param.item.qrycd2 === '16') 
         			&& (userid === param.item.editor2 || isAdmin) ) return true; 
         	else return item.type == 1 | item.type == 2;
         },
         onClick: function (item, param) {
     		/*swal({
                 title: item.label+"팝업",
                 text: "신청번호 ["+param.item.acptno2+"]["+param.item.qrycd2+"]"
             });*/
     		if (item.type === 3) {
     			if (param.item.befsw === 'Y') {
     				swal({
                         title: "선행작업확인",
                         text: "다른 사용자가 선행작업으로 지정한 신청 건이 있습니다. \n\n"+
		                          "해당 신청 건 사용자에게 선행작업 해제 요청 후 \n" +
		                          "선행작업으로 지정한 신청 건이 없는 상태에서\n진행하시기 바랍니다."
                     });
     				return;
     			}

             	mask.open();
     			confirmDialog.confirm({
     				title: '전체회수 여부확인',
     				msg: '신청번호 ['+param.item.acptno+'] 를  \n전체회수 하시겠습니까?',
     			}, function(){
     				if(this.key === 'ok') {
     					console.log('OK click!!');
     				} else {
     					console.log(this.key);
     				}
         			mask.close();
     			});
     			
     		} else {
     			openWindow(item.type, param.item.qrycd2, param.item.acptno2,'');
     		}
     		
             firstGrid.contextMenu.close();//또는 return true;
         }
     },
     columns: [
         {key: "syscd", label: "시스템",  width: '10%'},
         {key: "spms", label: "SR-ID",  width: '10%'},
         {key: "acptno", label: "신청번호",  width: '10%'},
         {key: "editor", label: "신청자",  width: '10%'},
         {key: "qrycd", label: "신청종류",  width: '10%'},
         {key: "passok", label: "처리구분",  width: '10%'},
         {key: "acptdate", label: "신청일시",  width: '10%'},
         {key: "sta", label: "진행상태",  width: '10%'},
         {key: "pgmid", label: "프로그램명",  width: '10%'},
         {key: "prcdate", label: "완료일시",  width: '10%'},
         {key: "prcreq", label: "적용예정일시",  width: '10%'},
         {key: "Sunhang", label: "선후행",  width: '10%'},
         {key: "sayu", label: "신청사유", width: '10%'} 	 
     ]
});



$(document).ready(function(){
	getUserInfo();
	getSysInfo();
	getCodeInfo();
	getDeptInfo();
	
	// 엑셀저장버튼 클릭
	$('#btnExcel').bind('click', function() {
		firstGrid.exportExcel("grid-to-excel.xls");
	});
	
	// 초기화 버튼 클릭
	$('#btnReset').bind('click', function() {
		resetScreen();
	});
	
	// 조회 버튼 클릭
	$('#btnQry').bind('click', function() {
		getRequestList();
	});
	
	// SR-ID input 박스 엔터
	$('#txtSpms').bind('keypress', function(event){
		if(event.keyCode==13) {
			$('#btnQry').trigger('click');
		}
	});
	
	// 신청인 input 박스 엔터
	$('#txtUser').bind('keypress', function(event){
		if(event.keyCode==13) {
			$('#btnQry').trigger('click');
		}
	});
});

// 어드민 여부 확인
function getUserInfo(){
	var data =  new Object();
	data = {
		UserId			: userid,
		requestType		: 'getUserInfo'
	}
	ajaxAsync('/webPage/approval/RequestStatus', data, 'json',successGetUserInfo);
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
	ajaxAsync('/webPage/approval/RequestStatus', data, 'json',successGetSysInfo);
}

//신청부서 cbo 가져오기 완료
function successGetDeptInfo(data) {
	cboDeptData = data;
	
	options = [];
	
	$.each(cboDeptData,function(key,value) {
	    options.push({value: value.cm_deptcd, text: value.cm_deptname});
	});
	
	$('[data-ax5select="cboDept"]').ax5select({
        options: options
	});
}

// 신청부서 cbo 가져오기
function getDeptInfo(){
	var data =  new Object();
	data = {
		SelMsg 		: 'All',
		cm_useyn 	: 'Y',
		gubun 		: 'sub',
		itYn 		: 'N',
		requestType	: 'getDeptInfo'
	}
	ajaxAsync('/webPage/approval/RequestStatus', data, 'json',successGetDeptInfo);
}


// 진행상태 cbo , 신청종류 cbo 가져오기
function getCodeInfo(){
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('REQUEST','ALL','N'),
		new CodeInfo('R3200STA','ALL','N'),
		new CodeInfo('REQPASS','ALL','N')
		]);
	cboSinData 		= codeInfos.REQUEST;
	cboStaData		= codeInfos.R3200STA;
	cboGbnData		= codeInfos.REQPASS;
	
	// 배열을 전체 순회 해야 할경우 forEach
	// 배열 순회중 break 필요시 for문 사용
	for(var i = 0 ; i < cboStaData.length ; i++){
		if(cboStaData[i].cm_micode == "9"){
			cboStaData[i].cm_codename = "처리완료";
			break;
		}
	}
	
	options = [];
	$.each(cboSinData,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboSin"]').ax5select({
        options: options
	});
	
	options = [];
	
	$.each(cboStaData,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboSta"]').ax5select({
        options: options
	});
	
    $('[data-ax5select="cboSta"]').ax5select("setValue", '1', true);
    
    
    options = [];
    
	$.each(cboGbnData,function(key,value) {
	    options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboGbn"]').ax5select({
        options: options
	});
}

// 초기화 버튼 클릭
function resetScreen(){
	var today = getDate('DATE',0);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	firstGrid.setData([]); // grid 초기화
	$('[data-ax5select="cboSta"]').ax5select("setValue", 	'1', 	true); 	// 진행상태 초기화
	$('[data-ax5select="cboSin"]').ax5select("setValue", 	'00', 	true); 	// 신청종류 초기화
	$('[data-ax5select="cboGbn"]').ax5select("setValue", 	'00', 	true); 	// 처리구분 초기화
	$('[data-ax5select="cboSysCd"]').ax5select("setValue", 	'00000',true);	// 시스템 초기화
	$('[data-ax5select="cboDept"]').ax5select("setValue", 	'0', 	true); 	// 신청부서 초기화
	$('#rdoStrDate').prop('checked','checked');								// 신청일 기준으로 초기화
	$("#txtUser").val('');													// 신청인 초기화 
	$("#txtSpms").val('');													// SR-ID 초기화
	$("#lbTotalCnt").text("총0건");
	$('#datStD').val(today);
	$('#datEdD').val(today);
	
}

// 신청현황 리스트 가져오기
function getRequestList(){
	var prjData = new Object();
	
	if(getSelectedIndex('cboSysCd') > 0){
		prjData.strSys = getSelectedVal('cboSysCd').value;
	}
	 
	if(getSelectedIndex('cboGbn') === 0) {
		prjData.cboGbn = 'ALL';
	} else {
		prjData.cboGbn = getSelectedVal('cboGbn').value;
	}
	
	if(getSelectedIndex('cboSin') > 0){
		prjData.strQry = getSelectedVal('cboSin').value;
	} 
	
	if(getSelectedIndex('cboDept') > 0){
		prjData.strTeam = getSelectedVal('cboDept').value;
	} 
	
	if(getSelectedIndex('cboSta') > 0){
		prjData.strSta = getSelectedVal('cboSta').value;
	}
	
	prjData.strStD 		= replaceAllString($("#datStD").val(), '/', '');
	prjData.strEdD 		= replaceAllString($("#datEdD").val(), '/', '');
	prjData.dategbn 	= $('input[name="rdoDate"]:checked').val();
	prjData.txtUser 	= document.getElementById("txtUser").value.trim();
	prjData.txtSpms 	= document.getElementById("txtSpms").value.trim();
	prjData.strUserId 	= userid;
	
	var data =  new Object();
	data = {
		requestType : 'getRquestList',
		prjData: prjData
	}
	ajaxAsync('/webPage/approval/RequestStatus', data, 'json',successGetRquestList);
}

// 신청 리스트 가져오기 완료
function successGetRquestList(data) {
	firstGridData = data;
	firstGrid.setData(firstGridData);
	
	$("#lbTotalCnt").text("총" + firstGridData.length + "건");
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
    
    f.acptno.value	= reqNo;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
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
	
	console.log('+++++++++++++++++'+cURL);
	
    myWin = winOpen(f, winName, cURL, nHeight, nWidth);
    
}