/** PrjList 화면 정의 (공통화면)
 * 
 * <pre>
 * <b>History</b>
 * 	작성자: 이성현
 * 	버전 : 1.1
 *  수정일 : 2019-06-14
 */

var userName 	= window.top.userName;
var userid 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;
var strReqCD 	= window.top.reqCd;

var cboReqDepartData = null;
var cboCatTypeData = null;
//var cboQryGbnData = null;
var cboQryGbnData = window.parent.cboQryGbnData;   
var firstGridData = null;
 
var firstGrid 	= new ax5.ui.grid();
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


$('#datStD').val(getDate('DATE',-1));
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
            if(strReqCD == "41"){
             	firstGridClick(this.item.cc_srid);
        	 }
        }
    },
    columns: [
        {key: "cc_srid", label: "SR-ID",  width: '10%'},
        {key: "cc_reqtitle", label: "요청제목",  width: '20%'},
        {key: "createdate", label: "등록일",  width: '10%'},
        {key: "reqcompdat", label: "완료요청일",  width: '10%'},
        {key: "reqdept", label: "요청부서",  width: '10%'},
        {key: "cattype", label: "분류유형",  width: '10%'},
        {key: "chgtype", label: "변경종류",  width: '10%'},
        {key: "status", label: "진행현황",  width: '10%'},
        {key: "workrank", label: "작업순위",  width: '10%'}	 
    ]
});

$(document).ready(function() {
	getReqDepartInfo();
	getCboElementPrj();
	
	// 조회 버튼 클릭
	$('#btnQry').bind('click', function() {
		getPrjList();
	});
	
	// 초기화 버튼 클릭
	$('#btnReset').bind('click', function() {
		resetScreen();
	});
	
	// 대상구분 변경시 달력 변경
	$('#cboQryGbn').bind('change', function() {
		changeQryGbn();
	});
	getPrjList();

	$('#datStD').prop("disabled", true); 
	$('#datEdD').prop("disabled", true); 
	$('#dateDiv').css('pointer-events','none');
});

// 대상구분 변경 시
function changeQryGbn(){
	if(getSelectedVal('cboQryGbn').value === "01"){
		$('#datStD').prop("disabled", true); 
		$('#datEdD').prop("disabled", true); 
		$('#dateDiv').css('pointer-events','none');
	} else {
		$('#datStD').prop("disabled", false); 
		$('#datEdD').prop("disabled", false); 
		$('#dateDiv').css('pointer-events','auto');
	}
}

// 요청부서 가져오기
function getReqDepartInfo() {
	var ajaxReturnData = null;
	
	var teamInfoData 		= new Object();
	teamInfoData.SelMsg 	= 'ALL';
	teamInfoData.cm_useyn 	= 'Y';
	teamInfoData.gubun 		= 'req';
	teamInfoData.itYn 		= 'N';
	
	var teamInfo = {
		teamInfoData: 	teamInfoData,
		requestType: 	'SET_TEAM_INFO'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/PrjListTab', teamInfo, 'json');
	
	if(ajaxReturnData !== 'ERR') {
		console.dir(ajaxReturnData);
		cboReqDepartData = ajaxReturnData;
		options = [];
		$.each(cboReqDepartData,function(key,value) {
			options.push({value: value.cm_deptcd, text: value.cm_deptname});
		});
		
		$('[data-ax5select="cboReqDepart"]').ax5select({
	        options: options
		});
	}
}

// 분류유형, 대상구분 가져오기
function getCboElementPrj() {
	var codeInfos = getCodeInfoCommon( [new CodeInfo('CATTYPE','ALL','N'),
										new CodeInfo('QRYGBN','ALL','N')] );
	cboCatTypeData 	= codeInfos.CATTYPE;
	//cboQryGbnData 	= codeInfos.QRYGBN;
	
	console.log(cboCatTypeData);
//	console.log(cboQryGbnData);
	options = [];
	$.each(cboCatTypeData,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboCatType"]').ax5select({
        options: options
	});
	
	options = [];
//	$.each(cboQryGbnData,function(key,value) {
//		options.push({value: value.cm_micode, text: value.cm_codename});
//	});
	
	$('[data-ax5select="cboQryGbn"]').ax5select({
        //options: options
		options: cboQryGbnData
	});
	
	$('[data-ax5select="cboQryGbn"]').ax5select("setValue", '01', true);	// select 초기값 셋팅 '01'에는 해당 내용의 value값 입력
}

function getPrjList() {
	var prjData = new Object();
	var ajaxReturnData = null;
	
	prjData.userid 	= userid;
	prjData.reqcd 	= strReqCD;
	
	prjData.secuyn 	= 'Y';
	prjData.admin = adminYN;
	
	prjData.qrygbn = getSelectedVal('cboQryGbn').value;

	if(getSelectedVal('cboQryGbn').value === '00') {
		prjData.stday = replaceAllString($("#datStD").val(), '/', '');
		prjData.edday = replaceAllString($("#datEdD").val(), '/', '');
	}
	
	if(getSelectedIndex('cboReqDepart') > 0){
		prjData.reqdept = getSelectedVal('cboReqDepart').value;
	}
	
	if(getSelectedIndex('cboCatType') > 0){
		prjData.cattype = getSelectedVal('cboCatType').value;
	}
	
	//사용안하는 reqCd들인듯..
	if( strReqCD === '99' || strReqCD === 'LINK' || strReqCD === 'CP43' || strReqCD === 'CP44') {
		//prjInfoData.isrid = strIsrId;
		//prjInfoData.secuyn = "N";
	}
	
	console.log(prjData);
	
	var prjInfo = {
		prjInfoData: 	prjData,
		requestType: 	'GET_PRJ_INFO'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/PrjListTab', prjInfo, 'json');
	console.log(ajaxReturnData);
	if(ajaxReturnData !== 'ERR') {
		firstGridData = ajaxReturnData;
		
		firstGrid.setData(firstGridData);
	}
}

// prjListTab 화면 초기화 버튼 클릭
function resetScreen() {
	$('[data-ax5select="cboReqDepart"]').ax5select("setValue", '0', true);
	$('[data-ax5select="cboCatType"]').ax5select("setValue", '00', true);
	$('[data-ax5select="cboQryGbn"]').ax5select("setValue", '01', true);
	$('#datStD').prop("disabled", true); 
	$('#datEdD').prop("disabled", true); 

	var today = getDate('DATE',-1);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	$('#datStD').val(today);
	
	today = getDate('DATE',0);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	$('#datEdD').val(today);
	
	getPrjList();
}