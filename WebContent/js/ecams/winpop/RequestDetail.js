var pReqNo  = null;
var pUserId = null;

var reqGrid     = new ax5.ui.grid();
var resultGrid  = new ax5.ui.grid();
var picker 		= new ax5.ui.picker();

var options 	   = [];
var reqInfoData    = null;
var reqGridData    = null; //체크인목록그리드 데이타
var resultGridData = null; //처리결과그리드 데이타
var cboReqPassData = null; //처리구분 데이타
var cboPrcSysData  = null; //배포구분 데이타

var isAdmin 	   = false;

var f = document.reqData;
pReqNo = f.acptno.value;
pUserId = f.user.value;

console.log(pReqNo, pUserId);

ax5.info.weekNames = [
    {label: "일"},
    {label: "월"},
    {label: "화"},
    {label: "수"},
    {label: "목"},
    {label: "금"},
    {label: "토"}
];

$('#txtAcptNo').val(pReqNo.substr(0,4)+'-'+pReqNo.substr(4,2)+'-'+pReqNo.substr(6));
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

reqGrid.setConfig({
    target: $('[data-ax5grid="reqGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: true,
    showLineNumber: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	//this.self.clearSelect();
           this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	if (this.dindex < 0) return;
    		swal({
                title: "처리결과확인팝업",
                text: "신청번호 ["+pReqNo+"]["+param.item.cr_baseitem+"]"
    		});

	       	var selIn = reqGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
       	 
			//openWindow(1, pReqNo.substr(4,2), pReqNo, param.item.cr_baseitem);
        },
    	trStyleClass: function () {
    		if (this.item.colorsw == '3'){
    			return "fontStyle-cncl";
    		} else if(this.item.colorsw == '5'){
    			return "fontStyle-error";
    		} else if (this.item.cr_itemid != this.item.cr_baseitem){
    			return "fontStyle-module";
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
            {type: 1, label: "소스보기"},
            {type: 2, label: "소스비교"},
            {type: 3, label: "선택건회수"},
            {type: 3, label: "Tmp파일무삭제"},
            {type: 3, label: "스크립트확인"},
            {type: 3, label: "처리결과확인"}
        ],
        popupFilter: function (item, param) {
         	reqGrid.clearSelect();
         	reqGrid.select(Number(param.dindex));
       	 
	       	var selIn = reqGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
       	 
        	if (param.item == undefined) return false;
        	if (param.dindex < 0) return false;

        	return true;
        },
        onClick: function (item, param) {
    		//openWindow(item.type, param.item.qrycd2, param.item.acptno2,'');
    		
            reqGrid.contextMenu.close();//또는 return true;
        }
    },
    columns: [
        {key: "cr_rsrcname", label: "프로그램명",  width: '20%'},
        {key: "cr_story", label: "프로그램설명",  width: '10%'},
        {key: "cm_codename", label: "프로그램종류",  width: '10%'},
        {key: "cm_jobname", label: "업무명",  width: '10%'},
        {key: "cr_version", label: "신청버전",  width: '10%'},
        {key: "cm_dirpath", label: "프로그램경로",  width: '20%'},
        {key: "checkin", label: "수정구분",  width: '10%'},
        {key: "priority", label: "우선순위",  width: '10%'} 
    ]
});

resultGrid.setConfig({
    target: $('[data-ax5grid="resultGrid"]'),
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
                title: "처리결과확인팝업",
                text: "신청번호 ["+pReqNo+"]["+param.item.cr_acptno+"]["+param.item.cr_seqno+"]"
    		});

	       	var selIn = resultGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
       	 
    		if (pReqNo != param.item.cr_acptno) {
    			//openWindow(1, pReqNo.substr(4,2), pReqNo+param.item.cr_acptno, param.item.cr_seqno);
    		} else {
    			//openWindow(1, pReqNo.substr(4,2), pReqNo, param.item.cr_seqno);
    		}
        },
    	trStyleClass: function () {
    		if (this.item.colorsw == '3'){
    			return "fontStyle-cncl";
    		} else if(this.item.colorsw == '5'){
    			return "fontStyle-error";
    		} else if (this.item.cr_itemid != this.item.cr_baseitem){
    			return "fontStyle-module";
    		} 
    	},
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: "prcsys", label: "구분",  width: '10%'},
        {key: "rsrcname", label: "프로그램명",  width: '15%'},
        {key: "jawon", label: "프로그램종류",  width: '15%'},
        {key: "dirpath", label: "적용경로",  width: '20%'},
        {key: "server", label: "적용서버",  width: '20%'},
        {key: "result", label: "처리결과",  width: '10%'},
        {key: "prcdate", label: "처리일시",  width: '10%'} 
    ]
});

$(document).ready(function(){
	$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

	if (pReqNo == null) {
		swal({
	        title: "정보오류",
	        text: "신청정보가 없습니다.\n다시 로그인 하시기 바랍니다."
	    });
		return;
	}


	if (pReqNo.substr(4,2) == '01' || pReqNo.substr(4,2) == '02' || pReqNo.substr(4,2) == '11' || pReqNo.substr(4,2) == '12') {
		reqGrid.removeColumn(7);
		reqGrid.removeColumn(6);
	}
	
	$('#tab1Li').width($('#tab1Li').width()+10);
	$('#tab2Li').width($('#tab2Li').width()+10);
	setTabMenu();
	
	getCodeInfo();
	
	$('#cboReqPass').bind('change', function() {
		var selectedIndex = $('#cboReqPass option').index($('#cboReqPass option:selected'));
		
		console.log(getSelectedVal('cboReqPass').value);
		
		if (getSelectedVal('cboReqPass').value == '4') {
			document.getElementById('reqgbnDiv').style.visibility = "visible";
			
			if (reqInfoData == null || reqInfoData.length < 1 || reqInfoData[0].cr_passok != '4') {
				$('#txtReqDate').val(getDate('DATE',0).substr(0,4)+'/'+getDate('DATE',0).substr(4,2)+'/'+getDate('DATE',0).substr(6));
				$('#txtReqTime').val(getTime().substr(0,2)+':'+getTime().substr(2,2));
			}
		} else {
			document.getElementById('reqgbnDiv').style.visibility = "hidden";
		}
	});

	_promise(50,getUserInfo())
		.then(function(){
			return _promise(50,getReqInfo()); 
		})
	getPrcSysInfo();
});

//어드민 여부 확인
function getUserInfo(){
	var data =  new Object();
	data = {
		UserId			: pUserId,
		requestType		: 'getUserInfo'
	}
	ajaxAsync('/webPage/approval/RequestStatus', data, 'json',successGetUserInfo);
}

//어드민 여부 확인 완료
function successGetUserInfo(data) {
	if (data.cm_admin == '1') {
		isAdmin = true;
	}
}


function setTabMenu(){
	$(".tab_content").hide();
	$(".tab_content:first").show();
	$("ul.tabs li").click(function () {
		$("ul.tabs li").removeClass("active").css("color", "#333");
		$(this).addClass("active").css("color", "darkred");
		$(".tab_content").hide();
		
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).fadeIn();
	});
}
//처리구분코드정보 가져오기
function getCodeInfo(){
	var codeInfos = getCodeInfoCommon([
				new CodeInfo('REQPASS','SEL','N')
		]);
	cboReqPassData	= codeInfos.REQPASS;
	
    options = [];
    
	$.each(cboReqPassData,function(key,value) {
	    options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboReqPass"]').ax5select({
        options: options
	});
}

//신청정보가져오기
function getReqInfo() {
	var data =  new Object();
	data = {
		UserId			: pUserId,
		AcptNo			: pReqNo,
		requestType		: 'getReqList'
	}
	ajaxAsync('/webPage/winpop/RequestDetail', data, 'json',successGetReqList);
}

//체크인 목록가져오기 완료
function successGetProgList(data) {
	reqGridData = data;
	reqGrid.setData(reqGridData);
}

//신청정보가져오기 완료
function successGetReqList(data) {
	reqInfoData = data;
	
	if ( reqInfoData.length > 0 ) {
		
		var param = new Object();
		param.UserId = pUserId;
		param.AcptNo = pReqNo;
		param.chkYn = "0";
		param.qrySw = "true";
		
		var data =  new Object();
		data = {
			param			: param,
			requestType		: 'getProgList'
		}
		ajaxAsync('/webPage/winpop/RequestDetail', data, 'json', successGetProgList);
		
		//console.log(reqInfoData);
		
		$('#txtSyscd').val(reqInfoData[0].cm_sysmsg);			//시스템
		$('#txtEditor').val(reqInfoData[0].cm_username);		//신청자
		$('#txtReqGbn').val(reqInfoData[0].reqName);			//신청구분
		$('#txtStatus').val(reqInfoData[0].confname);			//진행상태

		$('#txtSayu').val(reqInfoData[0].cr_passcd);			//신청사유
		$('#txtAcptDate').val(reqInfoData[0].acptdate);			//신청일시
		$('#txtPrcDate').val(reqInfoData[0].prcdate);			//완료일시

		if (null == reqInfoData[0].cr_passok || reqInfoData[0].cr_passok == '') {
			reqInfoData[0].cr_passok = '0';
		}
		//처리구분
	    $('[data-ax5select="cboReqPass"]').ax5select("setValue", reqInfoData[0].cr_passok, true);
		if (reqInfoData[0].cr_passok == '4') {
			//처리일시
			$('#txtReqDate').val(reqInfoData[0].aplydate.substr(0,4)+"/"+reqInfoData[0].aplydate.substr(4,2)+"/"+reqInfoData[0].aplydate.substr(6,2));
			$('#txtReqTime').val(reqInfoData[0].aplydate.substr(8,2)+":"+reqInfoData[0].aplydate.substr(10));
		} 
		$('#cboReqPass').trigger('change');
		
		$('#lblErrMsg').text(reqInfoData[0].ermsg);				//에러메시지
		
		//SR정보
		if (null != reqInfoData[0].cc_srid && reqInfoData[0].cc_srid != '') {
			document.getElementById('SrDiv').style.visibility = "visible";
			$('#txtSR').val('['+reqInfoData[0].cc_srid+'] '+reqInfoData[0].cc_reqtitle);
		} else {
			document.getElementById('SrDiv').style.visibility = "hidden";
		}
		
		if ( reqInfoData[0].file == '1' ) {						//테스트결과서
			$('#btnTestDoc').prop("disabled", false);
		}
		if ( reqInfoData[0].befjob == '1' )	{					//선후행작업확인
			$('#btnBefJob').prop("disabled", false);
		}

		if (reqInfoData[0].srcview == 'Y' && pReqNo.substr(4,2) != '06') {
			$('#btnSrcView').prop("disabled", false);			//소스보기
			$('#btnSrcDiff').prop("disabled", false);			//소스비교
		}
		if (reqInfoData[0].log == '1') {
			$('btnLog').prop("disabled", false);					//로그확인
		}
		
		if (reqInfoData[0].endsw == '0') {//신청미완료건 결재자 여부확인
			//Cmr3100.gyulChk(strAcptNo,pUserId);
		} else {//신청완료 건
			aftChk();
		}
	}
}
function aftChk() {
	if (reqInfoData[0].prcsw == '0' && reqInfoData[0].signteam.substr(0,3) == 'SYS') {
		if (isAdmin || reqInfoData[0].cr_editor == pUserId) {
			$('btnRetry').prop("disabled", false);				//전체재처리
	      	if (reqInfoData[0].cr_editor == pUserId && reqInfoData[0].updtsw3 == '1') {
	         	if (reqInfoData[0].cr_prcsw == 'Y') {
	    			$('btnStepEnd').prop("disabled", false);		//단계온료
	            	if (isAdmin || reqInfoData[0].cr_qrycd != '04') {
	            		$('btnAllCncl').prop("disabled", false);	//전체회수
	            	}
	         	} else {
	         		if (reqInfoData[0].signteam == 'SYSRC') {
		    			$('btnStepEnd').prop("disabled", false);	//단계온료
	         		} else {
	            		$('btnAllCncl').prop("disabled", false);	//전체회수
	         		}
	         	}
	      	} else if (isAdmin) {
        		$('btnAllCncl').prop("disabled", false);			//전체회수
	          	if (reqInfoData[0].cr_prcsw == 'Y' || reqInfoData[0].signteam == 'SYSRC') {
	    			$('btnStepEnd').prop("disabled", false);		//단계온료
	         	}
	      	}
	      	if (reqInfoData[0].errtry == '1'){
	      		$('btnErrRetry').prop("disabled", false);		//오류건재처리
	      	} else if (reqInfoData[0].sttry == '1') {
	      		$('btnNext').prop("disabled", false);			//다음단계진행
	      	}
	   	}
		
	//신청 종료 아니면서 관리자 일때
	} else if (reqInfoData[0].prcsw == '0' && isAdmin && strAcptNo.substring(4,6) == '04') {
		$('btnAllCncl').prop("disabled", false);					//전체회수
		$('btnPriority').prop("disabled", false);				//우선적용
		
		if (reqInfoData[0].cr_gyuljae == '1') $('#btnPriority').text('우선해제');
		else $('#btnPriority').text('우선적용');
		
	//신청종료아니면서 신청자일때
	} else if(reqInfoData[0].prcsw == '0' && reqInfoData[0].cr_editor == pUserId){
		$('btnAllCncl').prop("disabled", false);					//전체회수
		
	} else if (reqInfoData[0].prcsw == '0' && reqInfoData[0].updtsw3 == '1') {
		if (isAdmin || reqInfoData[0].cr_editor == pUserId) {
	   	   	if (reqInfoData[0].cr_prcsw == 'Y') {
				if (reqInfoData[0].cr_qrycd == '04' && isAdmin) {
					$('btnAllCncl').prop("disabled", false);		//전체회수
				} else if (reqInfoData[0].cr_qrycd != '04') {
					$('btnAllCncl').prop("disabled", false);		//전체회수
				} 
	   	   	} else {
				$('btnAllCncl').prop("disabled", false);			//전체회수
			}
	   	}
	}

    //console.log('updtsw2:'+reqInfoData[0].updtsw2+'status:'+reqInfoData[0].cr_status+'admin:'+isAdmin+'prcsw:'+reqInfoData[0].prcsw);
	if (reqInfoData[0].cr_status == '0' && (reqInfoData[0].cr_editor == pUserId || isAdmin) && reqInfoData[0].prcsw == '0') {
	    if (reqInfoData[0].updtsw1 == '1') {
	    	$('btnPriorityOrder').prop("disabled", false);			//우선순위적용
	    }
	    if (reqInfoData[0].updtsw2 == '1') {
			document.getElementById('reqBtnDiv').style.visibility = "visible"; //처리구분 수정
	    }
	} else {
		//hidden1.visible = false;
		//체크인목록 그리드에 체크박스 비활성화
	}
}
//처리결과가져오기
function getPrcSysInfo() {
	//Cmr0250.getPrcSys(strAcptNo);
}