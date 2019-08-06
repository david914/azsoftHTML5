/**
 * 시스템정보 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-05-16
 */

var userName 	= window.top.userName;
var userId 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;

var sysInfoGrid		= new ax5.ui.grid();
var jobGrid			= new ax5.ui.grid();
var datStDate 		= new ax5.ui.picker();
var datEdDate 		= new ax5.ui.picker();
var datSysOpen 		= new ax5.ui.picker();
var datScmOpen 		= new ax5.ui.picker();
var relModal 		= new ax5.ui.modal();
var jobModal 		= new ax5.ui.modal();
var sysDetailModal 	= new ax5.ui.modal();
var prgKindsModal 	= new ax5.ui.modal();
var comDirModal 	= new ax5.ui.modal();
var sysCopyModal 	= new ax5.ui.modal();

var cboOptions = [];

var cboSysGbData 	= null;	//	시스템유형콤보
var sysInfodata		= null;	// 	시스템 속성 UL list
var sysInfoCboData	= null;	//	시스템종류 콤보
var cboSvrCdData	= null;	//	기준서버구분콤보
var sysInfoGridData = null; // 	시스템 그리드
var jobGridData 	= null;	//	업무 그리드

var stFullDate = null;	// 중단시작일시
var edFullDate = null;	// 중단종료일시

var addFg1 			= false;
var addFg2 			= false;
var closeModifyFg 	= false;
var selectedSystem 	= null;


sysInfoGrid.setConfig({
    target: $('[data-ax5grid="sysInfoGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 20,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            for(var j=0;j<sysInfoCboData.length; j++) {
            	if(this.item.cm_syscd == sysInfoCboData[j].cm_syscd) {
            		$('[data-ax5select="cboSys"]').ax5select('setValue',sysInfoCboData[j].cm_syscd,true);
            		cboSysClick();
            		break;
            	}
            }
        },
        onDBLClick: function () {
        },
    	trStyleClass: function () {
    		if(this.item.closeSw === 'Y'){
    			return "fontStyle-cncl";
    		}
    	},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_syscd", 	label: "시스템코드",	width: '10%'},
        {key: "cm_sysmsg", 	label: "시스템명",  	width: '37%', align: 'left'},
        {key: "sysgb", 		label: "시스템유형",  	width: '14%'},
        {key: "servername", label: "기준서버구분", 	width: '13%'},
        {key: "scmopen", 	label: "형상관리오픈", 	width: '13%'},
        {key: "sysopen", 	label: "시스템오픈",  	width: '13%'}
    ]
});
	
jobGrid.setConfig({
	target: $('[data-ax5grid="jobGrid"]'),
	sortable: true, 
	multiSort: true,
	showRowSelector: true,
	header: {
		align: "center",
		columnHeight: 30
	},
	body: {
		columnHeight: 25,
		onClick: function () {
			this.self.select(this.dindex);
		},
		onDBLClick: function () {
		},
		trStyleClass: function () {
		},
		onDataChanged: function(){
			this.self.repaint();
		}
	},
	columns: [
		{key: "cm_jobcd", 	label: "업무코드",  	width: '20%', align: 'left'},
		{key: "cm_jobname",	label: "업무명",  	width: '80%', align: 'left'},
	]
});

$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});


$('[data-ax5select="cboSys"]').ax5select({
    options: []
});
$('[data-ax5select="cboSysGb"]').ax5select({
    options: []
});
$('[data-ax5select="cboSvrCd"]').ax5select({
    options: []
});

/** jquery time picker 시간 포멧
 * 
 * 1. HH:mm > 01:01
 * 2. h:mm p > 1:00 AM or 1:00 PM
 */

$('#txtTime').timepicker({
	timeFormat: 'HH:mm',
    interval: 30,
    //minTime: '10',
    //maxTime: '6:00pm',
    //defaultTime: '11',
    //startTime: '10:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true
 });
$('#timeDeploy').timepicker({
	timeFormat: 'HH:mm',
    interval: 30,
    dynamic: false,
    dropdown: true,
    scrollbar: true
});
$('#timeDeployE').timepicker({
	timeFormat: 'HH:mm',
    interval: 30,
    dynamic: false,
    dropdown: true,
    scrollbar: true
});

$(document).ready(function(){
	dateInit();
	getSysCodeInfo();
	getSysInfoCbo();
	getSysInfoList('');
	screenInit();
	
	// 시스템 코드/ 시스템명 찾기
	$('#txtFindSys').bind('keypress', function(event) {
		if(event.keyCode === 13 ) {
			$('#btnQry').trigger('click');
		}
	});
	
	// 업무 엔터
	$('#txtJobname').bind('keypress', function(event) {
		var txtJobName = '';
		if(event.keyCode === 13 ) {
			jobGrid.clearSelect();
			txtJobName = $('#txtJobname').val().trim();
			if(txtJobName.length === 0) {
				jobGrid.select(0);
			} else {
				for(var i=0; i<jobGridData.length; i++) {
					if(jobGridData[i].cm_jobname.indexOf(txtJobName) >= 0 ) {
						jobGrid.select(i);
						jobGrid.focus(i);
						break;
					}
				}
			}
		}
	});
	
	// 조회 클릭시
	$('#btnQry').bind('click', function() {
		var strDay = getDate('DATE',0);
		strDay = strDay.substr(0,4) + '/' + strDay.substr(4,2) + '/' + strDay.substr(6,2);
		
		$('#txtTime').val('');
		$('#txtSysCd').val('');
		$('#txtSysMsg').val('');
		$('#txtPrcCnt').val('');
		$('#datStDate').val(strDay);
		$('#datEdDate').val(strDay);
		$('#datSysOpen').val(strDay);
		$('#datScmOpen').val(strDay);
		$('#txtPrjName').val('');
		$('#txtTime').val('');
		
		$('[data-ax5select="cboSys"]').ax5select('setValue',sysInfoCboData[0].cm_syscd,true);
		$('[data-ax5select="cboSysGb"]').ax5select('setValue',cboSysGbData[0].cm_micode,true);
		$('[data-ax5select="cboSvrCd"]').ax5select('setValue',cboSvrCdData[0].cm_micode,true);
		
		for(var i=0; i<sysInfoData.length; i++) {
			$('#chkJobName'+ (i+1) ).wCheck('check',false);
		}
		
		jobGrid.clearSelect();
		
		$('#datStDate').prop( "disabled", 	true );
		$('#timeDeploy').prop( "disabled", 	true );
		$('#datEdDate').prop( "disabled", 	true );
		$('#timeDeployE').prop( "disabled", true );
		$('#txtPrjName').prop( "disabled", true );
		$('#txtTime').prop( "disabled", true );
		
		$('#datStDateDiv').css('pointer-events','none');
		$('#datEdDateDiv').css('pointer-events','none');
		
		getSysInfoList($('#txtFindSys').val().trim());
		getSysInfoCbo();
	});
	
	// 신규 클릭시
	$('#chkOpen').bind('click', function() {
		if($(this).is(':checked')) {
			screenInit();
			$('#chkSelfDiv').css('visibility','visible');
			$('#txtSysCd').val('');
			$('[data-ax5select="cboSys"]').ax5select('setValue','00000',true);
			$('[data-ax5select="cboSys"]').ax5select("disable");
		}
		
		if( !($(this).is(':checked')) ) {
			screenInit();
			$('#chkSelfDiv').css('visibility','hidden');
			$('[data-ax5select="cboSys"]').ax5select("enable");
		}
	});
	
	// 시스템 속성 클릭시
	$('input.checkbox-sysInfo').bind('click', function(e) {
		var selectedSysInfo = Number(this.value); 
		var selectedIndexs = sysInfoGrid.selectedDataIndexs;
		if(selectedIndexs.length == 0 && !($('#chkOpen').is(':checked')) ) {
			e.preventDefault();
		    e.stopPropagation();
		    dialog.alert('그리드를 선택후 속성을 선택 하실 수 있습니다.', function() {});
			return;
		}
		
		if( !(selectedSysInfo === 4 
				|| selectedSysInfo === 6
				|| selectedSysInfo === 13) ) {
			return;
		}
		
		if(selectedSysInfo === 4 && $(this).is(':checked')) {
			$('#datStDate').prop( "disabled",   false );
			$('#timeDeploy').prop( "disabled", 	false );
			$('#datEdDate').prop( "disabled", 	false );
			$('#timeDeployE').prop( "disabled", false );
			
			$('#datStDateDiv').css('pointer-events','auto');
			$('#datEdDateDiv').css('pointer-events','auto');
		}
		
		if(selectedSysInfo === 4 && !($(this).is(':checked')) ) {
			$('#datStDate').prop( "disabled", 	true );
			$('#timeDeploy').prop( "disabled", 	true );
			$('#datEdDate').prop( "disabled", 	true );
			$('#timeDeployE').prop( "disabled", true );
			
			$('#datStDateDiv').css('pointer-events','none');
			$('#datEdDateDiv').css('pointer-events','none');
		}
		
		if(selectedSysInfo === 6 && $(this).is(':checked') ) {
			$('#txtTime').prop( "disabled", false );
		}
		
		if(selectedSysInfo === 6 && !($(this).is(':checked')) ) {
			$('#txtTime').prop( "disabled", true );
		}
		
		if(selectedSysInfo === 13 && $(this).is(':checked') ) {
			$('#txtPrjName').prop( "disabled", false );
		}
		
		if(selectedSysInfo === 13 && !($(this).is(':checked')) ) {
			$('#txtPrjName').prop( "disabled", true );
		}
	});
	
	// 처리팩터추가 버튼 클릭시
	$('#btnFact').bind('click',function() {
		var factUpInfoData;
		factUpInfoData = new Object();
		factUpInfoData = {
			requestType	: 	'factUp'
		}
		ajaxAsync('/webPage/administrator/SysInfoServlet', factUpInfoData, 'json',successFactUpdt);
	});
	
	//삭제 버튼 클릭시
	$('#btnDel').bind('click',function() {
		var gridSelectedIndex 	= sysInfoGrid.selectedDataIndexs;
		var selectedGridItem 	= null;
		
		if(gridSelectedIndex.length === 0 ) {
			dialog.alert('폐기 할 시스템을 그리드에서 선택 후 눌러주세요.',function(){});
			return;
		}
		
		selectedGridItem = sysInfoGrid.list[gridSelectedIndex];
		
		confirmDialog.confirm({
			msg: '시스템정보를 폐기처리하시겠습니까',
		}, function(){
			if(this.key === 'ok') {
				var sysInfo = new Object();
				sysInfo.SysCd = selectedGridItem.cm_syscd;
				sysInfo.UserId = userId;
				
				var sysInfoData;
				sysInfoData = new Object();
				sysInfoData = {
					sysInfo		: sysInfo,
					requestType	: 'closeSys'
				}
				ajaxAsync('/webPage/administrator/SysInfoServlet', sysInfoData, 'json',successSysClose);
			}
		});
	});
	
	// 등록 버튼 클릭시
	$('#btnAdd').bind('click',function() {
		sysValidationCheck();
	});
	
	// 정기배포설정
	$('#btnReleaseTimeSet').bind('click', function() {
		relModal.open({
	        width: 1400,
	        height: 800,
	        iframe: {
	            method: "get",
	            url: "../modal/sysinfo/ReleaseTimeSetModal.jsp",
	            param: "callBack=modalCallBack"
	        },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	                $('#btnQry').trigger('click');
	            }
	        }
	    }, function () {
	    });
	});
	
	// 업무등록
	$('#btnJob').bind('click', function() {
		jobModal.open({
	        width: 800,
	        height: 800,
	        iframe: {
	            method: "get",
	            url: "../modal/sysinfo/JobModal.jsp",
	            param: "callBack=jobModalCallBack"
	        },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	                $('#btnQry').trigger('click');
	            }
	        }
	    }, function () {
	    });
	});
	
	// 시스템상세정보
	$('#btnSysDetail').bind('click', function() {
		var gridSelectedIndex 	= sysInfoGrid.selectedDataIndexs;
		if(gridSelectedIndex.length === 0 ) {
			dialog.alert('시스템을 그리드에서 선택후 눌러주세요.',function(){});
			return;
		}
		selectedSystem = sysInfoGrid.list[gridSelectedIndex];
		sysDetailModal.open({
	        width: 1200,
	        height: 800,
	        iframe: {
	            method: "get",
	            url: "../modal/sysinfo/SysDetailModal.jsp",
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
	
	// 프로그램종류정보
	$('#btnProg').bind('click', function() {
		var gridSelectedIndex 	= sysInfoGrid.selectedDataIndexs;
		if(gridSelectedIndex.length === 0 ) {
			dialog.alert('시스템을 그리드에서 선택후 눌러주세요.',function(){});
			return;
		}
		selectedSystem = sysInfoGrid.list[gridSelectedIndex];
		prgKindsModal.open({
	        width: 1200,
	        height: 800,
	        iframe: {
	            method: "get",
	            url: "../modal/sysinfo/PrgKindsModal.jsp",
	            param: "callBack=prgKindsModalCallBack"
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
	
	// 공통디렉토리
	$('#btnDir').bind('click', function() {
		var gridSelectedIndex 	= sysInfoGrid.selectedDataIndexs;
		if(gridSelectedIndex.length === 0 ) {
			dialog.alert('시스템을 그리드에서 선택후 눌러주세요.',function(){});
			return;
		}
		selectedSystem = sysInfoGrid.list[gridSelectedIndex];
		comDirModal.open({
	        width: 800,
	        height: 550,
	        iframe: {
	            method: "get",
	            url: "../modal/sysinfo/ComDirModal.jsp",
	            param: "callBack=ComDirModalCallBack"
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
	
	// 시스템정보복사
	$('#btnCopy').bind('click', function() {
		sysCopyModal.open({
	        width: 1200,
	        height: 800,
	        iframe: {
	            method: "get",
	            url: "../modal/sysinfo/SysCopyModal.jsp",
	            param: "callBack=SysCopyModalCallBack"
	        },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	                $('#btnQry').trigger('click');
	            }
	        }
	    }, function () {
	    });
	});

});

// datepicker 날짜 오늘날짜로 초기화
function dateInit() {
	$('#datStDate').val(getDate('DATE',0));
	$('#datEdDate').val(getDate('DATE',0));
	$('#datSysOpen').val(getDate('DATE',0));
	$('#datScmOpen').val(getDate('DATE',0));
	
	datStDate.bind(defaultPickerInfo('datStDate'));
	datEdDate.bind(defaultPickerInfo('datEdDate'));
	datSysOpen.bind(defaultPickerInfo('datSysOpen','top'));
	datScmOpen.bind(defaultPickerInfo('datScmOpen','top'));
}

var modalCallBack = function(){
	relModal.close();
};

var jobModalCallBack = function() {
	jobModal.close();
}

var sysDetailModalCallBack = function() {
	sysDetailModal.close();
}

var prgKindsModalCallBack = function() {
	prgKindsModal.close();
}

var ComDirModalCallBack = function() {
	comDirModal.close();
}

var SysCopyModalCallBack = function() {
	sysCopyModal.close();
}

// 시스템 등록/업데이트시 유효성 체크
function sysValidationCheck() {
	var gridSelectedIndex 	= sysInfoGrid.selectedDataIndexs;
	var stDate = null;
	var edDate = null;
	var nowDate = null;
	var stTime = null;
	var edTime = null;
	var nowTime = null;
	var nowFullDate = null;
	var isNew		= true;
	
	
	if( !$.isNumeric($('#txtSysCd').val()) ) {
		dialog.alert('시스템코드는 숫자만 가능합니다.',function(){});
		return;
	}
	
	if( $('#txtSysCd').val().length !== 5 ) {
		dialog.alert('시스템코드는 5자리의 숫자로 만들어주시기 바랍니다.',function(){});
		return;
	}
	
	if( $('#chkOpen').is(':checked') && $('#chkSelf').is(':checked') && $('#txtSysCd').val().length === 0) {
		dialog.alert('시스템코드를 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if($('#chkOpen').is(':checked') && !($('#chkSelf').is(':checked'))) {
		$('#txtSysCd').val('');
	}
	
	if( $('#txtSysMsg').val().length === 0 ) {
		dialog.alert('시스템명을 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	
	
	if( !($('#chkOpen').is(':checked')) && $('#txtSysCd').val().length === 0 ) {
		dialog.alert('수정할 시스템을 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if( $('#txtPrcCnt').val().length === 0 ) {
		dialog.alert('프로세스제한갯수를 입력하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if( $('#datSysOpen').val().length === 0 ) {
		dialog.alert('시스템오픈일를 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if( $('#datScmOpen').val().length === 0 ) {
		dialog.alert('형상관리오픈일를 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	for(var i=0; i<sysInfoData.length; i++) {
		if(i === 3 && $('#chkJobName'+ (i+1) ).is(':checked') ) {
			stDate = replaceAllString($('#datStDate').val(), '/', '');  
			edDate = replaceAllString($('#datEdDate').val(), '/', '');  
			nowDate = getDate('DATE',0);
			stTime = replaceAllString($('#timeDeploy').val(), ':', '');  
			edTime = replaceAllString($('#timeDeployE').val(), ':', '');  
			nowTime = getTime();
			stFullDate = stDate + stTime;
			edFullDate = edDate + edTime;
			nowFullDate = nowDate + nowTime;
			
			if(stDate.length === 0 || stTime.length === 0 
					|| edDate.length === 0 || edTime.length === 0) {
				dialog.alert('중단일시 및 시간을 입력해 주시기 바랍니다.',function(){});
				return;
			}
			if( nowFullDate > stFullDate) {
				dialog.alert('중단시작일시가 현재일 이전입니다. 정확히 선택하여 주십시오.',function(){});
				return;
			}
			
			if( stFullDate > edFullDate ) {
				dialog.alert('중단종료시작일시가 중단시작일시 이전입니다. 정확히 선택하여 주십시오',function(){});
				return;
			}
			
			if( nowFullDate > edFullDate  ) {
				dialog.alert('중단종료시작일시가 현재일 이전입니다. 정확히 선택하여 주십시오',function(){});
				return;
			}
		}
		
		if(i === 5 && $('#chkJobName'+ (i+1) ).is(':checked') && $('#txtTime').val().length === 0 ) {
			dialog.alert('정기적용시간을 입력하여 주십시오.'
					,function(){
						$('#txtTime').focus();
					});
			return;
		}
		
		if(i === 12 && $('#chkJobName'+ (i+1) ).is(':checked') && $('#txtPrjName').val().length === 0 ) {
			dialog.alert('프로젝트 명을 입력하시기 바랍니다.'
							,function(){
								$('#txtPrjName').focus();
							});
			return;
		}
	}
	
	sysInfoGridData.forEach(function(item,index) {
		if(item.cm_syscd === $('#txtSysCd').val()) isNew = false; 
	});
	
	if ( $('#chkOpen').is(':checked')  && isNew) {
		confirmDialog.confirm({
			msg: '시스템을 신규로 등록하시겠습니까?',
		}, function(){
			if(this.key === 'ok') { 
				updateSystem(isNew);
				closeModifyFg = false;
			}
		});
	} else{
		confirmDialog.confirm({
			msg: '시스템정보를 수정 등록하시겠습니까?',
		}, function(){
			if(this.key === 'ok') { 
				updateSystem(isNew);
				closeModifyFg = true;
			}
		});
	}
}

function updateSystem(isNew) {
	var tmpJob = '';
	var tmpInfo = '';
	var tmpDate = '';
	var tmpMon = 0;
	var tmpSysGb 	= getSelectedVal('cboSysGb').value;
	var tmpDirBase 	= getSelectedVal('cboSvrCd').value;
	var selectedJobIndexs = jobGrid.selectedDataIndexs;
	var systemInfo = new Object();
	systemInfo.cm_syscd 	= $('#txtSysCd').val();
	systemInfo.cm_sysmsg 	= $('#txtSysMsg').val();
	systemInfo.cm_sysgb 	= tmpSysGb;
	systemInfo.cm_dirbase 	= tmpDirBase;
	systemInfo.cm_prccnt 	= $('#txtPrcCnt').val();
	
	
	for(var i=0; i<selectedJobIndexs.length; i++) {
		var jobItem = jobGrid.list[selectedJobIndexs[i]];
		if(tmpJob.length > 0 ) tmpJob += ',';
		tmpJob += jobItem.cm_jobcd;
		jobItem = null;
	}
	
	for(var i=0; i<sysInfoData.length; i++) {
		if($('#chkJobName'+ (i+1) ).parent().hasClass('wCheck-on')) tmpInfo += '1'; 
		else tmpInfo += '0';
		
		// 사용중지
		if($('#chkJobName'+ (i+1) ).parent().hasClass('wCheck-on') && i===3) {
			systemInfo.cm_stdate = stFullDate;
			systemInfo.cm_eddate = edFullDate;
		}
		
		// 정기배포사용
		if($('#chkJobName'+ (i+1) ).parent().hasClass('wCheck-on') && i===5) {
			systemInfo.cm_systime = replaceAllString($('#txtTime').val(), ':', '');   
		}
	}
	
	systemInfo.cm_jobcd = tmpJob;
	systemInfo.cm_sysinfo = tmpInfo;
	systemInfo.cm_editor = userId;
	systemInfo.sysopen = replaceAllString($('#datSysOpen').val(), '/', ''); 
	systemInfo.scmopen = replaceAllString($('#datScmOpen').val(), '/', '');
	systemInfo.prjname = $('#txtPrjName').val().trim();
	
	if($('#chkCls').is(':checked')) systemInfo.closesw = "true";
	if(!$('#chkCls').is(':checked')) systemInfo.closesw = "false";
	
	var systemInfoDta = new Object(); 
	systemInfoDta = {
		systemInfo	: 	systemInfo,
		requestType	: 	'updateSystem'
	}
	
	
	ajaxAsync('/webPage/administrator/SysInfoServlet', systemInfoDta, 'json',successUpdateSysetm);
}

function successUpdateSysetm(data) {
	if( data === 'failed') {
		dialog.alert('폐기된 시스템코드는 사용하실 수 없습니다.',function(){});
	} else {
		dialog.alert('시스템정보 등록처리가 완료되었습니다.',
				function(){
					$('#txtSysCd').val(data);
					addFg1 = true;
					addFg2 = true;
					getSysInfoCbo();
				});
	}
}

function successSysClose(data) {
	if(data === 'OK')	dialog.alert('시스템정보 폐기처리가 완료되었습니다.'
										,function(){
											var gridSelectedIndex 	= sysInfoGrid.selectedDataIndexs;
											var selectedGridItem 	= sysInfoGrid.list[gridSelectedIndex];;
											var tmpGridObj = new Object();
											tmpGridObj = selectedGridItem;
											tmpGridObj.closeSw = 'Y';
											sysInfoGridData.splice(gridSelectedIndex[0],1,tmpGridObj);
											sysInfoGrid.setData(sysInfoGridData);
											
									});
	if(data !== 'OK')	dialog.alert('시스템정보 폐기중 오류가 발생했습니다. 관리자에게 문의하세요.',function(){});
}

//	화면초기화
function screenInit() {
	$('#chkSelfDiv').css('visibility','hidden');
	
	$('#datStDate').prop( "disabled", 	true );
	$('#timeDeploy').prop( "disabled", 	true );
	$('#datEdDate').prop( "disabled", 	true );
	$('#timeDeployE').prop( "disabled", true );
	$('#txtPrjName').prop( "disabled", true );
	$('#txtTime').prop( "disabled", true );
	
	$('#datStDateDiv').css('pointer-events','none');
	$('#datEdDateDiv').css('pointer-events','none');
	sysInfoGrid.align();
}

//	처리팩터 추가
function successFactUpdt(data) {
	if(data === 'OK') dialog.alert('시스템속성/서버속성/프로그램종류속성 자릿수를 일치시켰습니다.',function(){});
	if(data !== 'OK') dialog.alert('처리팩터추가중 오류가 발생했습니다. 관리자에게 문의하세요.',function(){});
}



// 시스템 리스트
function getSysInfoList(sysCd) {
	var sysClsSw = $('#chkCls').is(':checked');
	var sysListInfo;
	var sysListInfoData;
	sysListInfo 		= new Object();
	sysListInfo.clsSw 	= sysClsSw;
	sysListInfo.SysCd 	= sysCd.length > 0 ? sysCd : null;
	
	sysListInfoData = new Object();
	sysListInfoData = {
		sysInfo	: 	sysListInfo,
		requestType	: 	'getSysInfoList'
	}
	
	ajaxAsync('/webPage/administrator/SysInfoServlet', sysListInfoData, 'json',successGetSysInfoList);
}

//시스템 리스트
function successGetSysInfoList(data) {
	if( addFg2 ) {
		addFg2 = false;
		var findSw = false;
		var selectedIndexs = sysInfoGrid.selectedDataIndexs;
		if(selectedIndexs.length <= 0) findSw = true;
		else if(sysInfoGrid.list[selectedIndexs].cm_syscd !== data[0].cm_syscd) findSw = true;
		
		$('[data-ax5select="cboSys"]').ax5select('setValue',data[0].cm_syscd,true);
		sysInfoGrid.clearSelect();
		if( findSw && !closeModifyFg) {
			sysInfoGridData[sysInfoGridData.length] = data[0];
			sysInfoGrid.setData(sysInfoGridData);
			sysInfoGrid.select(sysInfoGridData.length-1);
		}
		if ( closeModifyFg ) {
			closeModifyFg = false;
			sysInfoGridData[selectedIndexs[0]] = data[0];
			sysInfoGrid.setData(sysInfoGridData);
			sysInfoGrid.select(selectedIndexs[0]);
		}
		
		cboSysClick();
		
	} else {
		sysInfoGridData = data;
		sysInfoGrid.setData(sysInfoGridData);
		getJobList();
	}
	
	
}

// 업무 그리드
function getJobList() {
	var jobInfoCbo;
	var jobInfoCboData;
	jobInfoCbo 			= new Object();
	jobInfoCbo.SelMsg 	= null;
	jobInfoCbo.closeYn 	= 'N';
	
	jobInfoCboData = new Object();
	jobInfoCboData = {
		jobInfoCbo	: 	jobInfoCbo,
		requestType	: 	'getJobList'
	}
	ajaxAsync('/webPage/administrator/SysInfoServlet', jobInfoCboData, 'json',successGetJobList);
}

// 업무 그리드
function successGetJobList(data) {
	jobGridData = data;
	jobGrid.setData(jobGridData);
}

// 시스템 CBO GET
function getSysInfoCbo() {
	var sysInfoCbo;
	var sysInfoCboData;
	sysInfoCbo 			= new Object();
	sysInfoCbo.UserId 	= userId;
	sysInfoCbo.SelMsg 	= 'SEL';
	sysInfoCbo.CloseYn 	= 'Y';
	sysInfoCbo.SysCd 	= null;
	
	sysInfoCboData = new Object();
	sysInfoCboData = {
		sysInfoCbo	: sysInfoCbo,
		requestType	: 'getSysInfoCbo'
	}
	ajaxAsync('/webPage/administrator/SysInfoServlet', sysInfoCboData, 'json',successGetSysInfoCbo);
}

// 시스템 CBO
function successGetSysInfoCbo(data) {
	sysInfoCboData = data;
	cboOptions = [];
	
	$.each(sysInfoCboData,function(key,value) {
		cboOptions.push({value: value.cm_syscd, text: value.cm_sysmsg, cm_sysgb: value.cm_sysgb, cm_sysinfo: value.cm_sysinfo, cm_prjname: value.cm_prjname});
	});
	$('[data-ax5select="cboSys"]').ax5select({
        options: cboOptions
	});
	
	if( addFg1 && sysInfoCboData.length > 0 ) {
		addFg1 = false;
		$('[data-ax5select="cboSys"]').ax5select('setValue',$('#txtSysCd').val(),true);
		$('#chkOpen').wCheck('check',false);
		$('#chkSelfDiv').css('visibility','hidden');
		$('[data-ax5select="cboSys"]').ax5select("enable");
		
		getSysInfoList($('#txtSysCd').val());
	}
}

//	하단 시스템 콤보 선택
function cboSysClick() {
	var selectedIndex = getSelectedIndex('cboSys');
	var findSw = false;
	var gridSelectedIndex = sysInfoGrid.selectedDataIndexs;
	var selectedSysCboSysInfo = $('[data-ax5select="cboSys"]').ax5select("getValue");
	selectedSysCboSysInfo = selectedSysCboSysInfo[0];
	var selectedGridItem = sysInfoGrid.list[gridSelectedIndex];
	var sysInfoStr		 = null;
	if(selectedIndex < 1) return;
	
	if(gridSelectedIndex[0] < 0 || gridSelectedIndex[0] == undefined) findSw = true;
	else if( selectedGridItem != undefined &&  (selectedSysCboSysInfo.value != selectedGridItem.cm_syscd) ) findSw = true;
	
	if(findSw) {
		for(var i=0; i<sysInfoGridData.length; i++) {
			if(sysInfoGridData[i].cm_syscd == selectedSysCboSysInfo.value) {
				sysInfoGrid.clearSelect();
				sysInfoGrid.select(i);
				selectedGridItem = sysInfoGrid.list[i];
				break;
			}
		}
	}
	
	
	$('#txtTime').val('');
	$('#txtSysCd').val(selectedSysCboSysInfo.value);
	$('#txtSysMsg').val(selectedSysCboSysInfo.text);
	
	for(var i=0; i<cboSysGbData.length; i++) {
		if(cboSysGbData[i].cm_micode == selectedSysCboSysInfo.cm_sysgb) {
			$('[data-ax5select="cboSysGb"]').ax5select('setValue',selectedSysCboSysInfo.cm_sysgb,true);
			break;
		}
	}
	
	for(var i=0; i<sysInfoData.length; i++) {
		$('#chkJobName'+ (i+1) ).wCheck('check',false);
	}
	
	if(selectedSysCboSysInfo.cm_sysinfo !== undefined && selectedSysCboSysInfo.cm_sysinfo !== null) {
		sysInfoStr = selectedSysCboSysInfo.cm_sysinfo;
		for(var i=0; i<sysInfoStr.length; i++) {
			if(sysInfoStr.substr(i,1) === '1') {
				$('#chkJobName'+ (i+1) ).wCheck('check',true);
			}
		}
	}
	
	jobGrid.clearSelect();
	
	if(selectedGridItem !== undefined) {
		$('#txtPrcCnt').val(selectedGridItem.cm_prccnt);
		$('#datSysOpen').val(selectedGridItem.sysopen);
		$('#datScmOpen').val(selectedGridItem.scmopen);
		
		for(var i=0; i<cboSvrCdData.length; i++) {
			if(cboSvrCdData[i].cm_micode == selectedGridItem.cm_dirbase) {
				$('[data-ax5select="cboSvrCd"]').ax5select('setValue',selectedGridItem.cm_dirbase,true);
				break;
			}
		}
		
		if(sysInfoStr.substr(3,1) === '1' &&  selectedGridItem.hasOwnProperty('cm_stdate') && selectedGridItem.hasOwnProperty('cm_eddate')) {
			$('#datStDate').prop( "disabled", 	false );
			$('#timeDeploy').prop( "disabled", 	false );
			$('#datEdDate').prop( "disabled", 	false );
			$('#timeDeployE').prop( "disabled", false );
			
			$('#datStDateDiv').css('pointer-events','auto');
			$('#datEdDateDiv').css('pointer-events','auto');
			
			
			var stDate = selectedGridItem.cm_stdate;
			var edDate = selectedGridItem.cm_eddate;
			
			var strTime = stDate.substr(0,4) + '/' + stDate.substr(4,2) + '/' + stDate.substr(6,2);
			$('#datStDate').val(strTime);
			
			strTime = stDate.substr(8,2) + ':' + stDate.substr(10,2);
			$('#timeDeploy').val(strTime);
			
			strTime = edDate.substr(0,4) + '/' + edDate.substr(4,2) + '/' + edDate.substr(6,2);
			$('#datEdDate').val(strTime);
			
			strTime = edDate.substr(8,2) + ':' + edDate.substr(10,2);
			$('#timeDeployE').val(strTime);
			
		} else {
			$('#datStDate').prop( "disabled", true );
			$('#timeDeploy').prop( "disabled", true );
			$('#datEdDate').prop( "disabled", true );
			$('#timeDeployE').prop( "disabled", true );
			
			$('#datStDateDiv').css('pointer-events','none');
			$('#datEdDateDiv').css('pointer-events','none');
		}
		if(sysInfoStr.substr(5,1) === '1' && selectedGridItem.hasOwnProperty('cm_systime') ) {
			var txtTimeStr = selectedGridItem.cm_systime;
			var txtTime = txtTimeStr.substr(0,2) + ':' + txtTimeStr.substr(2,2);
			$('#txtTime').val(txtTime);
			$('#txtTime').prop( "disabled", false );
		} else {
			$('#txtTime').val('');
			$('#txtTime').prop( "disabled", true );
		}
		
		if(sysInfoStr.substr(12,1) === '1' && selectedGridItem.hasOwnProperty('cm_prjname')) {
			$('#txtPrjName').val(selectedGridItem.cm_prjname);
			$('#txtPrjName').prop( "disabled", false );
		} else {
			$('#txtPrjName').val('');
			$('#txtPrjName').prop( "disabled", true );
		}
		
	}
	
	getSysJobInfo(selectedSysCboSysInfo.value);
}

//	선택된 시스템 JOB
function getSysJobInfo(sysCd) {
	var sysJobInfo		= new Object();;
	var sysJobInfoData  = new Object();
	sysJobInfo.UserID 	= userId;
	sysJobInfo.SysCd 	= sysCd;
	sysJobInfo.SecuYn 	= 'N';
	sysJobInfo.CloseYn 	= 'N';
	sysJobInfo.SelMsg 	= '';
	sysJobInfo.sortCd 	= 'CD';
	
	sysJobInfoData = {
		sysJobInfo	: sysJobInfo,
		requestType	: 'getJobInfo'
	}
	ajaxAsync('/webPage/administrator/SysInfoServlet', sysJobInfoData, 'json',successGetSysJobInfo);
}

//	선택된 시스템 JOB
function successGetSysJobInfo(data) {
	var checkedIndex = -1;
	for(var i=0; i<data.length; i++) {
		for(var j=0; j<jobGridData.length; j++) {
			if(data[i].cm_jobcd == jobGridData[j].cm_jobcd) {
				var jobObj = {};
				jobObj = data[i];
				jobGridData.splice(j,1);
				jobGridData.splice(0,0,jobObj);
				checkedIndex++;
				break;
			}
		}
	}
	jobGrid.setData(jobGridData);
	if(checkedIndex > -1) {
		for(var i=0; i<=checkedIndex; i++) {
			jobGrid.select(i);
		}
	}
}

// 시스템 유형 CBO
// 기준 서버구분 CBO
function getSysCodeInfo() {
	var codeInfos = getCodeInfoCommon([
										new CodeInfo('SYSGB','','N'),
										new CodeInfo('SYSINFO','','N'), 
										new CodeInfo('SERVERCD','','N')
										]);
	cboSysGbData 	= codeInfos.SYSGB;
	cboSvrCdData	= codeInfos.SERVERCD;
	sysInfoData 	= codeInfos.SYSINFO;
	
	cboOptions = [];
	$.each(cboSysGbData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	$('[data-ax5select="cboSysGb"]').ax5select({
        options: cboOptions
	});
	
	cboOptions = [];
	$.each(cboSvrCdData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	$('[data-ax5select="cboSvrCd"]').ax5select({
        options: cboOptions
	});
	
	makeSysInfoUlList();
}

// 시스템 속성 ul 만들어주기
function makeSysInfoUlList() {
	$('#ulSysInfo').empty();
	var liStr = null;
	var addId = null;
	sysInfoData.forEach(function(sysInfoItem, sysInfoIndex) {
		addId = Number(sysInfoItem.cm_micode);
		liStr  = '';
		liStr += '<li class="list-group-item dib width-50" style="min-width: 200px;">';
		liStr += '<div class="margin-3-top">';
		liStr += '	<input type="checkbox" class="checkbox-sysInfo" id="chkJobName'+addId+'" data-label="'+sysInfoItem.cm_codename+'"  value="'+sysInfoItem.cm_micode+'" />';
		liStr += '</div>';
		liStr += '</li>';
		$('#ulSysInfo').append(liStr);
	});
	
	$('input.checkbox-sysInfo').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

}
