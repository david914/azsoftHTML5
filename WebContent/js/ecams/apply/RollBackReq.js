/**
 * [적용 > 롤백요청] 화면
 */
var userId = window.top.userId;
var reqCd = window.top.reqCd;

var firstGrid	   = new ax5.ui.grid();
var secondGrid	   = new ax5.ui.grid();
var confirmDialog  = new ax5.ui.dialog();   //확인 창
var picker  	   = new ax5.ui.picker();
var approvalModal  = new ax5.ui.modal();

var firstGridData  = null; //롤백가능 운영요청건 데이타
var secondGridData = null; //추가대상그리드 데이타
var cboSysCdData   = null; //시스템 데이타
var confirmData    = null; //결재정보 데이타

var myWin 		   = null;
var data           = null; //json parameter
var ajaxReturnData = null;
var options 	   = [];

var acptNo		   = ""; //롤백신청번호
var ingSw          = false;

var confirmInfoData= new Object();

confirmDialog.setConfig({
	Title: "확인",
    theme: "info",
    width: 500
});

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

$('[data-ax5select="cboSysCd"]').ax5select({
    options: []
});

firstGrid.setConfig({
    target: $('[data-ax5grid="firstGrid"]'),
    sortable: true, 
    multiSort: true,
    showLineNumber: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	this.self.clearSelect();
        	this.self.select(this.dindex);
        	
        	//secondGrid조회 액션
        	if (!ingSw) getFileList();
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    contextMenu: {},
    columns: [
        {key: "cc_srid", label: "SR-ID",  width: '10%'},
        {key: "cc_reqtitle", label: "SR제목",  width: '20%', align: 'left'},
        {key: "acptno", label: "신청번호",  width: '10%'},
        {key: "acptdate", label: "신청일시",  width: '10%'},
        {key: "prcdate", label: "완료일시", width: '10%'},
        {key: "cm_username", label: "신청자",  width: '10%'},
        {key: "cr_passcd", label: "신청사유",  width: '30%', align: 'left'} 
    ]
});


secondGrid.setConfig({
    target: $('[data-ax5grid="secondGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: true,
    showLineNumber: true,
    header: {
        align: "center",
        columnHeight: 30,
        selector: false
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	if (this.item.selected_flag == '1') {
            	this.self.clearSelect(this.dindex);
        		return;
        	}
        	this.self.select(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {
    		if (this.item.cr_itemid != this.item.baseitem){
    			return "fontStyle-module";
    		} else if (this.item.selected_flag == '1'){
    			return "fontStyle-notaccess";
    		} 
    	},
    	onDataChanged: function(){
    		//console.log(this);
    		if (this.item.selected_flag == '1') {
            	this.self.clearSelect(this.dindex);
        		return;
        	}
    	    this.self.repaint();
    	}
    },
    contextMenu: {},
    columns: [
        {key: "cm_dirpath", label: "프로그램경로",  width: '20%', align: 'left'},
        {key: "cr_rsrcname", label: "프로그램명",  width: '10%', align: 'left'},
        {key: "jawon", label: "프로그램종류",  width: '8%', align: 'left'},
        {key: "cr_befviewver", label: "운영버전",  width: '8%'},
        {key: "cr_aftviewver", label: "롤백버전",  width: '8%'},
        {key: "cr_lastdate", label: "수정일",  width: '9%'},
        {key: "codename", label: "프로그램상태",  width: '8%', align: 'left'},
        {key: "ermsg", label: "체크결과",  width: '10%', align: 'left'},
        {key: "cr_story", label: "프로그램설명",  width: '17%', align: 'left'} 
    ]
});

$(document).ready(function(){
	var today = getDate('DATE',0);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	$('#datStD').val(today);
	$('#datEdD').val(today);

	$('#btnReq').prop('disabled',true);
	
	//조회버튼 클릭
	$('#btnQry').bind('click',function(){
		if (getSelectedIndex('cboSysCd') < 0) {
			confirmDialog.alert('시스템을 선택하시기 바랍니다.');
			return;
		}
		rollbackReqSearch();
	});
	
	//신청버튼 클릭
	$('#btnReq').bind('click',function(){
		if ( $('#txtSayu').val().length == 0 ) {
			confirmDialog.alert('신청사유를 입력하시기 바랍니다.');
			return;
		}
		var errflag = false;
		var secondGridSelList = new Array;
		var secondGridSeleted = secondGrid.getList("selected");
		$(secondGridSeleted).each(function(i){
			if (secondGridSeleted[i].ersw == 'Y') {
				errflag = true;
			}
			secondGridSelList.push($.extend({}, this, {__index: undefined}));
		});
		
		if ( secondGridSelList.length < 1 ) {
			confirmDialog.alert('롤백대상 프로그램을 목록에서 선택하시기 바랍니다.');
			return;
		}
		if (errflag) {
			confirmDialog.alert('체크결과 원복할 수 없는 파일이 있습니다. 제외한 후 신청하시기 바랍니다.');
			return;
		}
		
		//롤백신청 처리
		requestRollBack(secondGridSelList);
	});
	
	//시스템정보 가져오기
	system_getData();
	
	var oldVal = "";
	// 기간 선택 달력의 경우 두번째 달력 값 선택 또는 변경시 자동으로 달력 닫히게 추가
	$('#datEdD').bind('propertychange change keyup paste input', function() {
		var currentVal =  $("#datEdD").val();
		if(currentVal != oldVal){
			picker.close();
		}
		oldVal = currentVal;
	});
});
//시스템정보 가져오기
function system_getData() {
	data =  new Object();
	data = {
		UserId			: userId,
		ReqCd			: reqCd,
		SecuYn			: 'Y',
		SelMsg			: '',
		CloseYn			: 'N',
		requestType		: 'getSysInfo'
	}
	ajaxAsync('/webPage/apply/RollBackReqServlet', data, 'json', successGetSysInfo);
}
//시스템정보 가져오기완료
function successGetSysInfo(data) {
	cboSysCdData = data;
	options = [];
	$.each(cboSysCdData,function(key,value) {
	    options.push({value: value.cm_syscd, text: value.cm_sysmsg, 
	    	TstSw: value.TstSw, cm_sysinfo: value.cm_sysinfo, cm_sysfc1: value.cm_sysfc1, cm_sysgb: value.cm_sysgb});
	});
	$('[data-ax5select="cboSysCd"]').ax5select({
        options: options
	});
	
	if (cboSysCdData.length > 0) {
		$('#btnQry').trigger('click');
	}
}
//운영배포신청목록조회
function rollbackReqSearch(){
	firstGrid.setData([]);
	
	data =  new Object();
	data = {
		UserId			: userId,
		QryCd			: '0',
		stDate			: replaceAllString($('#datStD').val(), '/', ''),
		edDate			: replaceAllString($('#datEdD').val(), '/', ''),
		SysCd			: getSelectedVal('cboSysCd').value,
		requestType		: 'getBefList'
	}
	ajaxAsync('/webPage/apply/RollBackReqServlet', data, 'json', successGetBefList);
}
//조회완료
function successGetBefList(data) {
	firstGridData = data;
	firstGrid.setData(firstGridData);
}
//신청프로그램목록 조회
function getFileList() {
	ingSw = true;
	
	secondGrid.setData([]);
	
	data =  new Object();
	data = {
		UserId			: userId,
		AcptNo			: firstGridData[firstGrid.selectedDataIndexs].cr_acptno,
		requestType		: 'getBefReq_Prog'
	}
	ajaxAsync('/webPage/apply/RollBackReqServlet', data, 'json', successGetBefReq_Prog);
}
//신청프로그램목록조회 완료
function successGetBefReq_Prog(data){
	var secondGridList = new Array;
	ingSw = false;
	$(data).each(function(j){		
		if (data[j].baseitem == data[j].cr_itemid && data[j].selected_flag == '0') {
			data[j].__disable_selection__ = false;
		} else {
			data[j].__disable_selection__ = true;
		}
		secondGridList.push($.extend({}, data[j], {__index: undefined}));
	});
	
	if (secondGridList.length == 0) {
		dialog.alert("대상프로그램이 존재하지 않습니다.");
		return;
	}
	var i=0;
	var calcnt = 0;
	for (i=0; i<secondGridList.length; i++){
		if ((secondGridList[i].cm_info).substr(3,1) == '1'){
			calcnt++;
		}
		if ((secondGridList[i].cm_info).substr(8,1) == '1'){
			calcnt++;
		}
	}
	
	if (secondGridList.length > 0) {
		if (calcnt > 0){
			var param = new Object();
			param.ReqCD = reqCd;
			param.cm_syscd = getSelectedVal('cboSysCd').value;
			param.UserId = userId;
			param.QryCd = '';
			param.QryName = '';
			param.cm_sysfc1 = getSelectedVal('cboSysCd').cm_sysfc1;
			param.qrygbn = 'L';
			
			data =  new Object();
			data = {
				gridData		: secondGridList,
				param			: param,
				requestType		: 'getDownFileList'
			}
			ajaxAsync('/webPage/apply/RollBackReqServlet', data, 'json', successGetDownFileList);
		} else {
			secondGrid.setData(secondGridList);
			secondGridDefaultCheck(secondGridList);
		}
	}
}
//상세프로그램항목 가져오기완료
function successGetDownFileList(data){
	var secondGridList = new Array;
	$(data).each(function(j){		
		if (data[j].baseitem == data[j].cr_itemid && data[j].selected_flag == '0') {
			data[j].__disable_selection__ = false;
		} else {
			data[j].__disable_selection__ = true;
		}
		secondGridList.push($.extend({}, data[j], {__index: undefined}));
	});
	secondGrid.addRow(secondGridList);
	secondGridDefaultCheck(secondGridList);
}
//신청가능대상 자동선택
function secondGridDefaultCheck(gridDataList) {
	for(var i=0; i<gridDataList.length; i++) {
		if (gridDataList[i].selected_flag == '0') {
			secondGrid.select(i);
			$('#btnReq').prop('disabled',false);
		}
	}
}
//롤백신청
function requestRollBack(reqDataList) {
	//console.log('=====requestRollBack=====');
	//console.log(reqDataList);

	var secondGridSelList = new Array;
	var i = 0;
	var j = 0;
	//console.log(reqDataList);
	secondGridData = secondGrid.getList();
	for (i=0;reqDataList.length>i;i++) {
		if (reqDataList[i].cr_itemid == reqDataList[i].baseitem) {
			var copyData = clone(reqDataList[i]); //리스트의 주소지를 가져오므로 clone 을 해서 add 해줘야함
			secondGridSelList.push($.extend({}, copyData, {__index: undefined}));
			
			for (j=0;secondGridData.length>j;j++) {
				if (secondGridData[j].cr_itemid != secondGridData[j].baseitem) {
					if (reqDataList[i].cr_itemid == secondGridData[j].baseitem) {
						var copyData = clone(secondGridData[j]); //리스트의 주소지를 가져오므로 clone 을 해서 add 해줘야함
						secondGridSelList.push($.extend({}, copyData, {__index: undefined}));
					}
				}
			}
		}
	}
	//console.log(secondGridSelList);
	if (secondGridSelList.length == 0) {
		dialog.alert("프로그램을 선택한 후 진행하여 주시기 바랍니다.");
		return;
	}
	mask.open();
    confirmDialog.confirm({
        title: '롤백신청확인',
		msg: '선택한 프로그램을 롤백 하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			ckoConfirm(secondGridSelList);
		}
	});
	mask.close();
}

function ckoConfirm(reqDataList){
	var tmpRsrc = "";
	var tmpJobCd = "";
	var strQry = "04";
	
	for (var x=0;x<reqDataList.length;x++) {
		if (tmpRsrc.length > 0) {
			if (tmpRsrc.indexOf(reqDataList[x].cr_rsrccd) < 0)
	            tmpRsrc = tmpRsrc + "," + reqDataList[x].cr_rsrccd;
		} else tmpRsrc = reqDataList[x].cr_rsrccd;
	
		if (tmpJobCd.length > 0) {
			if (tmpJobCd.indexOf(reqDataList[x].cr_jobcd) < 0)
	            tmpJobCd = tmpJobCd + "," + reqDataList[x].cr_jobcd;
		} else tmpJobCd = reqDataList[x].cr_jobcd;
	}
	
	confirmInfoData = new Object();
	confirmInfoData.SysCd = getSelectedVal('cboSysCd').value;
	confirmInfoData.ReqCd = reqCd;
	confirmInfoData.strRsrcCd = tmpRsrc;
	confirmInfoData.UserID = userId;
	confirmInfoData.strQry = '';
	
	var tmpData = {
		confirmInfoData : confirmInfoData,
		requestType 	: 'confSelect'
	}	
	ajaxReturnData = ajaxCallWithJson('/webPage/apply/RollBackReqServlet', tmpData, 'json');
	
	if (ajaxReturnData == 'C') {
		confirmDialog.confirm({
			msg: '결재자를 지정하시겠습니까?',
		}, function(){
			if (this.key === 'ok') {
				confCall('Y', strQry, tmpRsrc, tmpJobCd, reqDataList);
			} else {
				confCall('N', strQry, tmpRsrc, tmpJobCd, reqDataList);
			}
		});
	} else if (ajaxReturnData == 'Y') {
		confCall('Y', strQry, tmpRsrc, tmpJobCd, reqDataList);
    } else if (ajaxReturnData != 'N') {
    	dialog.alert('결재정보가 등록되지 않았습니다. 형상관리시스템담당자에게 연락하여 주시기 바랍니다.');
    } else {
		confCall('N', strQry, tmpRsrc, tmpJobCd, reqDataList);
    }
}

function confCall(GbnCd, strQry, tmpRsrc, tmpJobCd, reqDataList){
	confirmInfoData = new Object();
	confirmInfoData.UserID = userId;
	confirmInfoData.ReqCd  = reqCd;
	confirmInfoData.SysCd  = getSelectedVal('cboSysCd').value;
	confirmInfoData.Rsrccd = tmpRsrc;
	confirmInfoData.QryCd = strQry;
	confirmInfoData.EmgSw = '2';
	confirmInfoData.JobCd = tmpJobCd;
	confirmInfoData.deployCd = 'Y';
	confirmInfoData.PrjNo = '';
	
	if (GbnCd == 'Y') {
		approvalModal.open({
	        width: 820,
	        height: 365,
	        iframe: {
	            method: "get",
	            url: "../modal/request/ApprovalModal.jsp",
	            param: "callBack=modalCallBack"
		    },
	        onStateChanged: function () {
	            if (this.state === 'open') {
	                mask.open();
	            }
	            else if (this.state === 'close') {
	            	if(confirmData.length > 0){
	            		reqQuestConf(reqDataList);
	            	}
	            	ingSw = false;
	                mask.close();
	            }
	        }
		});
		
	} else if (GbnCd == 'N') {
		ajaxReturnData = null;
		
		var tmpData = {
			confirmInfoData : confirmInfoData,
			requestType		: 'Confirm_Info'
		}
		ajaxReturnData = ajaxCallWithJson('/webPage/apply/RollBackReqServlet', tmpData, 'json');
		confirmData = ajaxReturnData;
		for(var i=0; i<confirmData.length ; i++){
			if (confirmData[i].arysv[0].SvUser == null || confirmData[i].arysv[0].SvUser == '') {
				confirmData.splice(i,1);
				i--;
			}
		}
		reqQuestConf(reqDataList);
	}
}

function reqQuestConf(reqDataList){
	ajaxReturnData = null;
	
	var etcObj = new Object();
	etcObj.UserID 	= userId;
	etcObj.ReqCD  	= reqCd;
	etcObj.Sayu	  	= $('#txtSayu').val().trim();
	etcObj.cm_syscd = getSelectedVal('cboSysCd').value;
	etcObj.cm_sysgb = getSelectedVal('cboSysCd').cm_sysgb;
	etcObj.passok	= '2';
	etcObj.passcd 	= $('#txtSayu').val().trim();
	etcObj.EmgCd  	= '0';
	etcObj.AplyDate = '';
	etcObj.Deploy 	= '';
	data = {
		reqData			: reqDataList,
		confirmInfoData : confirmData,
		confFg			: 'Y',
		scriptList		: null,
		requestData		: etcObj,
		requestType		: 'request_Check_In'
	}
	ajaxReturnData = ajaxCallWithJson('/webPage/apply/RollBackReqServlet', data, 'json');
	
	if(ajaxReturnData.substr(0,5) == 'ERROR'){
		dialog.alert('에러가 발생하였습니다. 다시 신청해주세요.\n'+ajaxReturnData.substr(5));
		return;
	}
	acptNo = ajaxReturnData;
	
	requestEnd(acptNo);
}
function requestEnd(acptNo){
	mask.open();
	confirmDialog.confirm({
		msg: '롤백신청완료! 상세 정보를 확인하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			openWindow(acptNo);
		}
	});
	mask.close();
	
	secondGrid.setData([]);
	$('#btnReq').prop('disabled',true);
}
function openWindow(acptNo) {
	var nHeight, nWidth, cURL, winName;
	
	if (myWin != null) {
        if (!myWin.closed) {
        	myWin.close();
        }
	}

    winName = 'rollBackrequestDetail';

	var f = document.popPam;   		//폼 name
    
    f.acptno.value	= acptNo;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.user.value 	= userId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    
	nHeight = 740;
    nWidth  = 1200;
	cURL = "/webPage/winpop/PopRequestDetail.jsp";

	myWin = winOpen(f, winName, cURL, nHeight, nWidth);
}