var pReqNo  = null;
var pReqCd  = null;
var pUserId = null;
var reqCd   = null; //선후행작업 reqcd 파라미터

var reqGrid     = new ax5.ui.grid();
var resultGrid  = new ax5.ui.grid();
var datReqDate	= new ax5.ui.picker();

var confirmDialog  = new ax5.ui.dialog();	//확인,취소 창
var confirmDialog2 = new ax5.ui.dialog();   //확인 창

var befJobListModal= new ax5.ui.modal();	//선후행작업확인 modal
var befJobModal    = new ax5.ui.modal();	//선행작업연결 modal
var requestDocModal= new ax5.ui.modal();	//테스트결과서 modal

var options 	   = [];

var reqInfoData    = null;
var reqGridData    = null; //체크인목록그리드 데이타
var reqGridOrgData = null; //체크인목록그리드 original 데이타 (변경X)
var reqGridChgData = null; //체크인목록그리드 항목상세보기 데이타 
var resultGridData = null; //처리결과그리드 데이타
var cboReqPassData = null; //처리구분 데이타
var cboPrcSysData  = null; //배포구분 데이타
var befJobData     = null; //선후행연결 데이타

var data           = null; //json parameter
var myWin 		   = null; //새창id

var isAdmin 	   = false;
var ingSw          = false;

//한번만 실행하도록 함
var gridSw1		   = false;
var gridSw2		   = false;

var f = document.getReqData;

pReqNo = f.acptno.value;
pReqCd = pReqNo.substr(4,2);
pUserId = f.user.value;

reqCd = pReqCd;

/* 코드정보 받아서 하도록 수정
//상위 TITLE TEXT SET
var subTitle = "";
if (reqCd == '01') subTitle = '체크아웃';
else if (reqCd == '02') subTitle = '이전버전체크아웃';
else if (reqCd == '03') subTitle = '테스트적용';
else if (reqCd == '04') subTitle = '운영적용';
else if (reqCd == '06') subTitle = '롤백';
else if (reqCd == '07') subTitle = '체크인';
else if (reqCd == '16') subTitle = '일괄등록';
else if (reqCd == '11') subTitle = '체크아웃취소';
else if (reqCd == '12') subTitle = '테스트적용취소';
var contentHistory = "변경신청 <strong> &gt; "+ subTitle+"요청상세</strong>";
$('#reqBody').contents().find('#history_wrap').html(contentHistory);
*/

confirmDialog.setConfig({
    lang:{
        "ok": "확인", "cancel": "취소"
    },
    width: 500
});
confirmDialog2.setConfig({
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

$('#txtAcptNo').val(pReqNo.substr(0,4)+'-'+pReqNo.substr(4,2)+'-'+pReqNo.substr(6));
createViewGrid1();
createViewGrid2();



function createViewGrid1() {
	reqGrid.setConfig({
	    target: $('[data-ax5grid="reqGrid"]'),
	    sortable: true, 
	    multiSort: true,
	    showRowSelector: true,
	    showLineNumber: true,
	    header: {
	        align: "center"
	    },
	    body: {
	        onClick: function () {
	        	//this.self.clearSelect();
	           this.self.select(this.dindex);
	        },
	        onDBLClick: function () {
	        	if (this.dindex < 0) return;
	
		       	var selIn = reqGrid.selectedDataIndexs;
		       	if(selIn.length === 0) return;
	       	 
		       	openWindow(2, '', this.item.cr_baseitem);
	        },
	    	trStyleClass: function () {
	    		if (this.item.ColorSw == '3'){
	    			return "fontStyle-cncl";
	    		} else if(this.item.ColorSw == '5'){
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
	            {type: 1, label: "프로그램정보"},
	            {type: 2, label: "처리결과확인"},
	            {type: 3, label: "스크립트확인"},
	            {type: 4, label: "Tmp파일무삭제"},
	            {type: 5, label: "개별회수"}
	        ],
	        popupFilter: function (item, param) {
	         	reqGrid.clearSelect();
	         	reqGrid.select(Number(param.dindex));
	       	 
		       	var selIn = reqGrid.selectedDataIndexs;
		       	if(selIn.length === 0) return;
	       	 
	        	if (param.item == undefined) return false;
	        	if (param.dindex < 0) return false;
	        	
	        	if (isAdmin || param.item.secusw == 'Y' ||
	    			    cmdOk.enabled == true || reqInfoData[0].confsw == '1') {
	        		
	        		var retType = '';
	        		
	        		if (param.item.cr_itemid == param.item.cr_baseitem) {
	        			retType = '1';
	        		}
	        		if (param.item.rst == 'Y') {
	        			retType = retType+'2';
	        		}
	        		
	        		findSw = false;
					//컴파일(39,61,1), 릴리즈스크립트(51,64,21), 적용스크립트 스크립트 실행(59,67,35), 형상관리저장 스크립트 실행(22), 체크아웃스크립트 실행(14)
	        		if (pReqCd == '01' || pReqCd == '02' || pReqCd == '11') {
	                	if (param.item.cm_info.substr(13,1) == '1') {
	                		findSw = true;
	                	}
	                } else if (pReqCd == '07') {
	                	if (param.item.cm_info.substr(21,1) == '1') {
	                		findSw = true;
	                	}
	                } else if (pReqCd == '08') {
	                	if (param.item.cm_info.substr(38,1) == '1' || param.item.cm_info.substr(50,1) == '1' || param.item.cm_info.substr(58,1) == '1' || param.item.cm_info.substr(21,1) == '1') {
	                		findSw = true;
	                	}
	                } else if (pReqCd == '03') {
	                	if (param.item.cm_info.substr(60,1) == '1' || param.item.cm_info.substr(63,1) == '1' || param.item.cm_info.substr(66,1) == '1' || param.item.cm_info.substr(21,1) == '1') {
	                		findSw = true;
	                	}
	                } else if (pReqCd == '04') {
	                	if (param.item.cm_info.substr(0,1) == '1' || param.item.cm_info.substr(20,1) == '1' || param.item.cm_info.substr(34,1) == '1' || param.item.cm_info.substr(21,1) == '1') {
	                		findSw = true;
	                	}
	                }
				    if (findSw) {
	        			retType = retType+'3';
					}
	
				    if (reqInfoData[0].prcsw == '0' && isAdmin && param.item.cr_status == '0') {
	        			retType = retType+'4';
					}
	
				    if ( reqInfoData[0].prcsw == '0' 
				    	&& (reqInfoData[0].signteam.substr(0,3) == 'SYS' || reqInfoData[0].signteamcd == '2' || isAdmin) ) {
	
				        
				        var i = 0;
				        var findSw = false;
				        for (i = 0 ; reqGridData.length>i ; i++) {
				        	if (reqGridData[i].cr_baseitem != param.item.cr_baseitem && reqGridData[i].ColorSw == '0') {
				        		findSw = true;
				        		break;
				        	}
				        }
				        if (findSw) {
				        	findSw == false;
				        	if (reqInfoData[0].signteamcd != '1' && isAdmin) findSw = true;
				        	else if (reqInfoData[0].signteamcd == '2') {
					        	findSw = true;
					        } else if (reqInfoData[0].signteamcd == '1') {
						        for (i = 0 ; reqGridData.length>i ; i++) {
						        	if (reqGridData[i].cr_baseitem == param.item.cr_baseitem && reqGridData[i].ColorSw == '5') {
						        	    if (param.item.cr_prcsys == reqInfoData[0].signteam) {
							        		findSw = true;
							        		break;
						        	    } else if (reqInfoData[0].signteam == 'SYSCB') {
						        	    	if (param.item.cr_prcsys == 'SYSGB') {
						        	    		findSw = true;
							        			break;
						        	    	}
						        	    }
						        	}
						        }
					        }
					        if (findSw) {
					        	if (reqInfoData[0].cr_prcsw == 'Y' && !isAdmin && reqInfoData[0].cr_qrycd == '04') {
					        	   findSw = false;
					        	}
	
						        if (findSw) {
				        			retType = retType+'5';
					        	}
					        }
				        } else if (reqInfoData[0].signteam.substr(0,3) == "SYS") {
				        	findSw = false;
					        for (i = 0 ; reqGridData.length>i ; i++) {
					        	if (reqGridData[i].cr_baseitem == param.item.cr_baseitem && reqGridData[i].ColorSw == '5') {
					        		findSw = true;
					        		break;
					        	}
					        }
	
					        if (findSw) {
					        	if (reqInfoData[0].cr_prcsw == 'Y' && reqInfoData[0].cr_qrycd == '04') {
					        		if (isAdmin) {
					        			$('#btnAllCncl').prop("disabled", false);	//전체회수 활성화
					        		}
					        	} 
					        }
	
				        }
					}
				    if (retType == '') return false;
				    
				    var retString;
				    
				    if (retType.indexOf('1')>-1){
				    	retString = (item.type == 1);
				    }
				    if (retType.indexOf('2')>-1){
				    	if (retType == '') retString = (item.type == 2);
				    	else retString = retString | (item.type == 2);
				    }
				    if (retType.indexOf('3')>-1){
				    	if (retType == '') retString = (item.type == 3);
				    	else retString = retString | (item.type == 3);
				    }
				    if (retType.indexOf('4')>-1){
				    	if (retType == '') retString = (item.type == 4);
				    	else retString = retString | (item.type == 4);
				    }
				    if (retType.indexOf('5')>-1){
				    	if (retType == '') retString = (item.type == 5);
				    	else retString = retString | (item.type == 5);
				    }
				    /*
				    else if (retType == '12') return item.type == 1 | item.type == 2;
				    else if (retType == '123') return item.type == 1 | item.type == 2 | item.type == 3;
				    else if (retType == '124') return item.type == 1 | item.type == 2 | item.type == 4;
				    else if (retType == '125') return item.type == 1 | item.type == 2 | item.type == 5;

				    else if (retType == '1234') return item.type == 1 | item.type == 2 | item.type == 3 | item.type == 4;
				    else if (retType == '1235') return item.type == 1 | item.type == 2 | item.type == 3 | item.type == 5;
				    else if (retType == '1245') return item.type == 1 | item.type == 2 | item.type == 4 | item.type == 5;
				    else if (retType == '12345') return item.type == 1 | item.type == 2 | item.type == 3 | item.type == 4 | item.type == 5;
				    else */
				    return retString;
				    
				} else {
					return false;
				}
	        },
	        onClick: function (item, param) {
	        	
	        	//새창팝업
	        	if ( item.type == '1' || item.type == '2' || item.type == '3' ) {
	        		openWindow(item.type, '', param.item.cr_baseitem);
	        		
	        	} else if ( item.type == '4' ) {
	        		if (ingSw) {
	        			confirmDialog2.alert('현재 신청하신 다른 내용을 처리 중입니다.');
	    			} else {
	    				mask.open();
	    		        confirmDialog.confirm({
					        title: '무삭제확인',
	    					msg: '처리 중 생성되는 Temp파일을 삭제하지 않을까요?',
	    				}, function(){
	    					if(this.key === 'ok') {
	    						tmpFileNotDelete(param.item.cr_baseitem);
	    					}
	    				});
						mask.close();
	    			}
	        	} else if ( item.type == '5' ) {
	        		if (ingSw) {
	        			confirmDialog2.alert('현재 신청하신 다른 내용을 처리 중입니다.');
	    			} else {
	    				mask.open();
	    		        confirmDialog.confirm({
					        title: '회수확인',
	    					msg: '프로그램 ['+param.item.cr_rsrcname+']를 회수처리할까요?',
	    				}, function(){
	    					if(this.key === 'ok') {
	    						progCncl(param.item.cr_baseitem, reqInfoData[0].signteam);
	    					}
	    				});
						mask.close();
	    			}
	        	}
	        	
	            reqGrid.contextMenu.close();//또는 return true;
	        }
	    },
	    columns: [
	        {key: "cr_rsrcname", label: "프로그램명",  width: '20%'},
	        {key: "cr_story", label: "프로그램설명",  width: '10%'},
	        {key: "cm_codename", label: "프로그램종류",  width: '10%'},
	        {key: "cm_jobname", label: "업무명",  width: '10%'},
	        {key: "cr_aftviewver", label: "버전",  width: '10%', align: 'center'},
	        {key: "cm_dirpath", label: "프로그램경로",  width: '20%'},
	        {key: "checkin", label: "수정구분",  width: '10%', align: 'center'},
	        {key: "priority", label: "우선순위",  width: '10%', editor: {type: "number"}, align: 'center'} 
	    ]
	});
};

function createViewGrid2() {
	resultGrid.setConfig({
		target: $('[data-ax5grid="resultGrid"]'),
		sortable: true, 
		multiSort: true,
		showLineNumber: true,
		header: {
			align: "center"
		},
		body: {
			onClick: function () {
				this.self.clearSelect();
				this.self.select(this.dindex);
			},
			onDBLClick: function () {
				if (this.dindex < 0) return;
				
				var selIn = resultGrid.selectedDataIndexs;
				if(selIn.length === 0) return;
				
				if (pReqNo != this.item.cr_acptno) {
					openWindow(2, this.item.cr_acptno, this.item.cr_seqno);
				} else {
					openWindow(2, '', this.item.cr_seqno);
				}
			},
			trStyleClass: function () {
				if (this.item.ColorSw == '3'){
					return "fontStyle-cncl";
				} else if(this.item.ColorSw == '0'){
					return "fontStyle-ing";
				} else if(this.item.ColorSw == '5'){
					return "fontStyle-error";
				} 
			},
			onDataChanged: function(){
				this.self.repaint();
			}
		},
		columns: [
			{key: "prcsys", label: "구분",  width: '10%'},
			{key: "cr_rsrcname", label: "프로그램명",  width: '15%'},
			{key: "jawon", label: "프로그램종류",  width: '15%'},
			{key: "cm_dirpath", label: "적용경로",  width: '20%'},
			{key: "cr_svrname", label: "적용서버",  width: '20%'},
			{key: "prcrst", label: "처리결과",  width: '10%'},
			{key: "prcdate", label: "처리일시",  width: '10%', align: 'center'} 
			]
	});
	
	getRstList();
};

$('[data-ax5select="cboPrcSys"]').ax5select({
    options: []
});


function dateInit() {
	$('#txtReqDate').val(getDate('DATE',0));
	datReqDate.bind(defaultPickerInfo('txtReqDate', 'top'));
	/*
	$('#txtReqTime').timepicker({
	    showMeridian : false,
	    minuteStep: 1
	 });
	*/
}

$(document).keyup(function (e) {
	if ($(".numberTxt").is(":focus") && (e.keyCode == 13)) {
		//커서 아웃될때
		if ($('#hourTxt').val() != '' && $('#hourTxt').val().length < 2) {
			$('#hourTxt').val('0'+$('#hourTxt').val());
		} else if ($('#hourTxt').val() == '') {
			$('#hourTxt').val('00');
		}
		if ($('#minTxt').val() != '' && $('#minTxt').val().length < 2) {
			$('#minTxt').val('0'+$('#minTxt').val());
		} else if ($('#minTxt').val() == '') {
			$('#minTxt').val('00');
		}
    }
});

$(document).ready(function(){
	//상위 TITLE TEXT SET
	var reqCodes = getCodeInfoCommon([
				new CodeInfo('REQUEST','','N')
		]);
	var reqCodeDatas = reqCodes.REQUEST;
	var i=0;
	var contentHistory = '';
	for (i=0; i<reqCodeDatas.length; i++) {
		if (reqCodeDatas[i].cm_micode == reqCd) {
			contentHistory = "변경신청 <strong> &gt; "+ reqCodeDatas[i].cm_codename+"상세</strong>";
			break;
		}
	}
	$('#reqBody').contents().find('#history_wrap').html(contentHistory);

	startFunction();
});
	
function startFunction() {
	
	$('input.checkbox-detail').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
	
	if (pReqNo == null) {
		confirmDialog2.alert('신청정보가 없습니다.\n다시 로그인 하시기 바랍니다.');
		return;
	}
	
	if (pReqCd == '01' || pReqCd == '02' || pReqCd == '11') {
		reqGrid.removeColumn(7);
		reqGrid.removeColumn(6);
	}

	dateInit();
	setTabMenu();
	getCodeInfo();
	
	
	$('#tab1Li').width($('#tab1Li').width()+10);
	$('#tab2Li').width($('#tab2Li').width()+10);

	/**
	 * ------------------------------------------------------------------------------------------------------------------------------
	 *                                                     select box change event
	 * ------------------------------------------------------------------------------------------------------------------------------
	 */
	//처리구분 콤보선택
	$('#cboReqPass').bind('change', function() {
		if (getSelectedVal('cboReqPass').value == '4') {
			//$("#reqgbnDiv").show();
			$("#reqgbnDiv").css("display","inline-block");
			//document.getElementById('reqgbnDiv').style.visibility = "visible";
			
			if (reqInfoData == null || reqInfoData.length < 1 || reqInfoData[0].cr_passok != '4') {
				$('#txtReqDate').val(getDate('DATE',0).substr(0,4)+'/'+getDate('DATE',0).substr(4,2)+'/'+getDate('DATE',0).substr(6));
				//$('#txtReqTime').val(getTime().substr(0,2)+':'+getTime().substr(2,2));
				
				$('#hourTxt').val(getTime().substr(0,2));
				$('#minTxt').val(getTime().substr(2,2));
			}
		} else {
			$("#reqgbnDiv").css("display","none");
			//document.getElementById('reqgbnDiv').style.visibility = "hidden";
		}
	});
	//배포구분 콤보선택
	$('#cboPrcSys').bind('change', function() {
		if (resultGridData == null || resultGridData.length < 1) return;
		
		var selectedIndex = getSelectedIndex('cboPrcSys');
		
		if (selectedIndex > 0) {
			if (pReqCd == getSelectedVal('cboPrcSys').qrycd) {
				var k = 0;
				var selValue = getSelectedVal('cboPrcSys').value;
				var tmpResultGridData = [];
				for(var i = 0 ; i < resultGridData.length ; i++){
					if (selValue == 'SYSCB') {
						if(resultGridData[i].cr_prcsys == 'SYSCB' || resultGridData[i].cr_prcsys == 'SYSGB'){
							tmpResultGridData[k++] = resultGridData[i];
						}
					} else if (selValue == resultGridData[i].cr_prcsys) {
						tmpResultGridData[k++] = resultGridData[i];
					}
				}
				resultGrid.setData(tmpResultGridData);
			} else {
				resultGrid.setData([]);
			}
		} else {
			resultGrid.setData(resultGridData);
		}
		resultGrid.repaint();
	});


	/**
	 * ------------------------------------------------------------------------------------------------------------------------------
	 *                                                     checkbox click event
	 * ------------------------------------------------------------------------------------------------------------------------------
	 */
	//항목상세보기
	$('#chkDetail').bind('click',function(){
		gridData_Filter();
	});
	
	
	/**
	 * ------------------------------------------------------------------------------------------------------------------------------
	 *                                                        button click event
	 * ------------------------------------------------------------------------------------------------------------------------------
	 */
	//처리구분 수정클릭
	$('#btnUpdate').bind('click', function() {
		if (ingSw) {
			confirmDialog2.alert('현재 신청내용 처리 중입니다. 잠시 후 이용해 주세요.');
			return;
		}
		if (getSelectedIndex('cboReqPass')<1) {
			confirmDialog2.alert('배포구분을 선택한 후 처리하시기 바랍니다.');
			return;
		}
		
		var reqFullDate = null;
		if (getSelectedVal('cboReqPass').value == '4') {
			var reqdate = replaceAllString($('#txtReqDate').val(), '/', '');
			//var reqtime = replaceAllString($('#txtReqTime').val(), ':', '');
			var reqtime = $('#hourTxt').val() + $('#minTxt').val();
			
			reqFullDate = reqdate + reqtime;
			var nowFullDate = getDate('DATE',0) + getTime();
			
			if(reqdate.length == 0) {
				confirmDialog2.alert('적용일자(특정일시)를 입력해 주시기 바랍니다.');
				return;
			}
			if(reqtime == 0) {
				confirmDialog2.alert('적용시간(특정일시)를 입력해 주시기 바랍니다.');
				return;
			}
			if( nowFullDate > reqFullDate) {
				confirmDialog2.alert('적용일시(특정일시)가 현재일시 이전입니다. 정확히 선택하여 주십시오.');
				return;
			}
		}
		updtDeploy(getSelectedVal('cboReqPass').value, reqFullDate);
	});
	
	//전체회수 클릭
	$('#btnAllCncl').bind('click', function() {
		if (ingSw) {
			confirmDialog2.alert('현재 신청내용 처리 중입니다. 잠시 후 이용해 주세요.');
		} else {
			if (reqInfoData[0].befsw == 'Y') {
				confirmDialog2.alert("다른 사용자가 선행작업으로 지정한 신청 건이 있습니다. \n"+
				                     "해당 신청 건 사용자에게 선행작업 해제 요청 후 \n" +
				                     "선행작업으로 지정한 신청 건이 없는 상태에서 진행하시기 바랍니다.");
				return;
			}
			
			
			mask.open();
	        confirmDialog.confirm({
				title: '전체회수',
				msg: '[' + $('#txtAcptNo').val() +'] 를 전체회수 할까요?',
			}, function(){
				if(this.key === 'ok') {
					confirmDialog.prompt({
				        title: "전체회수",
				        msg: '전체회수 사유를 입력하시기 바랍니다.'
				    }, function () {
				        if(this.key === 'ok') {
				        	if (this.input.value.trim() == '' || this.input.value.length == 0) {
				        		confirmDialog2.alert('전체회수 사유를 입력하시기 바랍니다.');
				        	} else {
				        		allCncl(this.input.value);
				        	}
				        }
				    });
				}
				mask.close();
			});
		}
	});
	//전체재처리 클릭
	$('#btnRetry').bind('click', function() {
		if (ingSw) {
			confirmDialog2.alert('현재 신청하신 다른 내용을 처리 중입니다.');
			return;
		}
		mask.open();
        confirmDialog.confirm({
			title: '작업확인',
			msg: '전체 재처리를 시작할까요?',
		}, function(){
			if(this.key === 'ok') {
				svrProc('Retry');
			}
			mask.close();
		});
	});
	//다음단계진행 클릭
	$('#btnNext').bind('click', function() {
		if (ingSw) {
			confirmDialog2.alert('현재 신청하신 다른 내용을 처리 중입니다.');
			return;
		}
		mask.open();
        confirmDialog.confirm({
			title: '작업확인',
			msg: '정지되어 있는 처리를 계속 진행할까요?',
		}, function(){
			if(this.key === 'ok') {
				svrProc('Sttry');
			}
			mask.close();
		});
	});
	//오류건 재처리 클릭
	$('#btnErrRetry').bind('click', function() {
		if (ingSw) {
			confirmDialog2.alert('현재 신청하신 다른 내용을 처리 중입니다.');
			return;
		}
		mask.open();
        confirmDialog.confirm({
			title: '작업확인',
			msg: '오류건에 대한 재처리를 시작할까요?',
		}, function(){
			if(this.key === 'ok') {
				svrProc('Errtry');
			}
			mask.close();
		});
	});
	//단계완료 클릭
	$('#btnStepEnd').bind('click', function() {
		if (ingSw) {
			confirmDialog2.alert('현재 신청하신 다른 내용을 처리 중입니다.');
			return;
		}

     	mask.open();
        confirmDialog.confirm({
			title: '단계완료처리확인',
			msg: '[신청번호 :'+$('#txtAcptNo').val()+']에 대한 현재 단계를 완료처리 할까요?',
		}, function(){
			if(this.key === 'ok') {
		        nextConf('1', '수기완료처리');
			}
			mask.close();
		});
	});
	//선택건회수 클릭
	$('#btnSelCncl').bind('click', function() {
		if (ingSw) {
			confirmDialog2.alert('현재 신청하신 다른 내용을 처리 중입니다.');
			return;
		}
		var allcncl = false;
		var cnclDataList = new Array;
		

		var reqGridSeleted = reqGrid.getList("selected");
		
		if (reqGridSeleted.length == 0) {
			confirmDialog2.alert('선택건 회수할 목록을 선택하십시오.');
			return;
		}
		for (var j=0; j < reqGridSeleted.length; j++) {
			for(var i =0; i < reqGridData.length; i++){
				if (reqGridData[i].check && reqGridData[i].visible) {
					//cnclDataList.push($.extend({}, this, {__index: undefined}));
					cnclDataList.push(reqGridData[i]);
				} else {
					if(reqGridData[i].baseitemid != reqGridData[i].cr_itemid){
						allcncl = true;
						break;
					}
				}
			}
		}
		
		if (allcncl) {
			mask.open();
	        confirmDialog.confirm({
				title: '전체회수',
				msg: '[' + $('#txtAcptNo').val() +'] 를 전체회수 할까요?',
			}, function(){
				if(this.key === 'ok') {
					confirmDialog.prompt({
				        title: "전체회수",
				        msg: '전체회수 사유를 입력하시기 바랍니다.'
				    }, function () {
				        if(this.key === 'ok') {
				        	if (this.input.value.trim() == '' || this.input.value.length == 0) {
				        		confirmDialog2.alert('전체회수 사유를 입력하시기 바랍니다.');
				        	} else {
				        		allCncl(this.input.value);
				        	}
				        }
				    });
				}
				mask.close();
			});
			cnclDataList = null;
		} else {
			if (cnclDataList.length != 0){
				selCncl(cnclDataList);
			}
		}
	});
	//우선순위적용 클릭
	$('#btnPriorityOrder').bind('click', function() {
		mask.open();
        confirmDialog.confirm({
			title: '확인',
			msg: '신청건에 대한 우선순위 정보를 Update 하시겠습니까?',
		}, function(){
			if(this.key === 'ok') {
				for(var i =0; i < reqGridData.length; i++){
					if(reqGridData[i].priority == '' || reqGridData[i].priority == null){
						confirmDialog2.alert('프로그램 ['+reqGridData[i].cr_rsrcname+']의 우선순위를 입력하시기 바랍니다.');
						mask.close();
						return;
					}
				}
				updatePriority();
			}
			mask.close();
		});
	});
	//새로고침 클릭
	$('#btnQry').bind('click', function() {
		
		//버튼 활성화여부 초기화
		resetScreen();
		
		getUserInfo();
		getPrcSysInfo();
	});
	//우선적용 클릭
	$('#btnPriority').bind('click', function() {
		var btnText = $('#btnPriority').text().trim();
     	mask.open();
        confirmDialog.confirm({
			title: btnText,
			msg: '[' + $('#txtAcptNo').val() +'] 를 ' + btnText + ' 할까요?',
		}, function(){
			if(this.key === 'ok') {
				if (btnText == '우선적용') {
					priorityProc('1');
				} else {
					priorityProc('0');
				}
			}
			mask.close();
		});
	});
	//결재클릭
	$('#btnApproval').bind('click', function() {
		if (ingSw) {
			confirmDialog2.alert('현재 신청하신 다른 내용을 처리 중입니다.');
			return;
		}
     	mask.open();
        confirmDialog.confirm({
			title: '결재확인',
			msg: '결재처리하시겠습니까?',
		}, function(){
			if(this.key === 'ok') {
		        nextConf('1',$('#txtApprovalMsg').value);
			}
			mask.close();
		});
	});
	//반려클릭
	$('#btnCncl').bind('click', function() {
		if (ingSw) {
			confirmDialog2.alert('현재 신청하신 다른 내용을 처리 중입니다.');
			return;
		}
	    if($('#txtApprovalMsg').value == ''){
	    	confirmDialog2.alert('반려의견을 입력하여 주십시오.');
	    	return;
	    }
     	mask.open();
        confirmDialog.confirm({
			title: '반려확인',
			msg: '반려처리하시겠습니까?',
		}, function(){
			if(this.key === 'ok') {
		        nextConf('3',$('#txtApprovalMsg').value);
			}
			mask.close();
		});
	});
	//닫기클릭
	$('#btnClose').bind('click', function() {
		close();
	});
	
	/**
	 * ------------------------------------------------------------------------------------------------------------------------------
	 * 										       button click -> modal popup event
	 * ------------------------------------------------------------------------------------------------------------------------------
	 */
	//테스트결과서 클릭
	$('#btnTestDoc').bind('click', function() {
		requestDocModal.open({
	        width: 700,
	        height: 360,
	        iframe: {
	            method: "get",
	            url: "../modal/request/RequestDocModal.jsp",
	            param: "callBack=requestDocModalCallBack"
	        },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	            }
	        }
	    }, function () {
	    });
	});
	//선후행작업확인 클릭
	$('#btnBefJob').bind('click', function() {
		openBefJobListModal();
	});
	
	/**
	 * ------------------------------------------------------------------------------------------------------------------------------
	 *                                             button click -> window open event
	 * ------------------------------------------------------------------------------------------------------------------------------
	 */
	//SR정보확인 클릭
	$('#btnSR').bind('click', function() {
		openWindow(4, '', reqInfoData[0].cc_srid);
	});
	//소스보기 클릭
	$('#btnSrcView').bind('click', function() {
		openWindow(5, '', '');
	});
	//소스비교 클릭
	$('#btnSrcDiff').bind('click', function() {
		openWindow(6, '', '');
	});
	//로그확인 클릭
	$('#btnLog').bind('click', function() {
		openWindow(7, '', '');
	});
	//결재정보 클릭
	$('#btnApprovalInfo').bind('click', function() {
		openWindow(8, '', '');
	});

	
	setTimeout(function() {
		//최초 화면로딩 시 조회(새로고침버튼 로직)
		$('#btnQry').trigger('click');
	}, 20);
};

//환성화 비활성화 초기화로직
function resetScreen(){
	$("#reqgbnDiv").css("display","none");											//처리구분 (영역 X)
	//document.getElementById('reqgbnDiv').style.visibility = "hidden";				//처리구분 (영역 O)
	$('[data-ax5select="cboReqPass"]').ax5select("disable");						//처리구분  콤보 비활성화
	document.getElementById('reqBtnDiv').style.visibility = "hidden";				//처리구분수정
	document.getElementById('SrDiv').style.visibility = "hidden";					//SR정보
	document.getElementById('lblApprovalMsg').style.visibility = "hidden";			//결재,반려의견
	document.getElementById('txtApprovalMsg').style.visibility = "hidden";			//결재,반려의견 입력 란
	
	//if (pReqCd != '07' && pReqCd != '03' && pReqCd != '04' && pReqCd != '06') {
	if (pReqCd == '01' || pReqCd == '02' || pReqCd == '11') {
		document.getElementById('btnPriorityOrder').style.visibility = "hidden";	//우선순위적용
		document.getElementById('btnSelCncl').style.visibility = "hidden";			//선택건회수
		document.getElementById('btnSrcView').style.visibility = "hidden";			//소스보기
		document.getElementById('btnSrcDiff').style.visibility = "hidden";			//소스비교
		document.getElementById('btnAllCncl').style.visibility = "hidden";			//전체회수
		document.getElementById('btnPriority').style.visibility = "hidden";			//우선적용,해제
	}

	$('#btnTestDoc').prop("disabled", true);					//테스트결과서
	$('#btnBefJob').prop("disabled", true);						//선후행작업확인
	
	$('#btnPriority').prop("disabled", true);					//우선적용
	$('#btnApproval').prop("disabled", true);					//결재
	$('#btnCncl').prop("disabled", true);						//반려
	
	$('#btnSrcView').prop("disabled", true);					//소스보기
	$('#btnSrcDiff').prop("disabled", true);					//소스비교
	$('#btnAllCncl').prop("disabled", true);					//전체회수
	$('#btnRetry').prop("disabled", true);						//전체재처리
	$('#btnNext').prop("disabled", true);						//다음단계진행
	$('#btnErrRetry').prop("disabled", true);					//오류건재처리
	$('#btnStepEnd').prop("disabled", true);					//단계완료

	$('#btnSelCncl').prop("disabled", true);					//선택건회수
	$('#btnPriorityOrder').prop("disabled", true);				//우선순위적용

	reqGrid.setData([]);
	reqGrid.repaint();
	resultGrid.setData([]);
	resultGrid.repaint();
}
var befJobModalCallBack = function() {
	befJobListModal.close();
}
var requestDocModalCallBack = function() {
	requestDocModal.close();
}
//항목상세보기
function gridData_Filter(){
	if (reqGridOrgData.length < 1) return;
	
	reqGridChgData = clone(reqGridOrgData);
	
	if(reqGridChgData.length == 0) {
		reqGridData = clone(reqGridOrgData);
		return;
	}
	
	for(var i =0; i < reqGridChgData.length; i++){
		if(reqGridChgData[i].cr_baseitem != reqGridChgData[i].cr_itemid){
			reqGridChgData.splice(i,1);
			i--;
		}
	};

	if (!$('#chkDetail').prop('checked')){
		reqGridData = clone(reqGridChgData);
		reqGrid.setData(reqGridData);
		reqGrid.repaint();
	} else{
		reqGridData = clone(reqGridOrgData);
		reqGrid.setData(reqGridData);
		reqGrid.repaint();
	}
}

//tmp파일 무삭제 처리시작
function tmpFileNotDelete(baseitem) {
	ingSw = true;
	
	data = new Object();
	data = {
		AcptNo 		: pReqNo,
		ItemId 		: baseitem,
		requestType : 'updtTemp'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json',successUpdtTemp);
}
//tmp파일 무삭제 처리완료
function successUpdtTemp(data) {
	ingSw = false;
	
	if (data == '0') {
		confirmDialog2.alert('Temp에 생성되는 스크립트파일이 삭제되지 않습니다.');
	}else  {
		confirmDialog2.alert('Temp에 생성되는 스크립트파일이 삭제되지 않도록 처리하는 중 오류가 발생하였습니다.');
	}
}
//개별회수 처리시작
function progCncl(baseitem, signteam){
	ingSw = true;
	
	data = new Object();
	data = {
		AcptNo 		: pReqNo,
		ItemId 		: baseitem,
		ItemId 		: signteam,
		requestType : 'progCncl'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json',successProgCncl);
}
//개별회수 처리완료
function successProgCncl(data) {
	ingSw = false;
	
	if (data == '2') {
		confirmDialog2.alert('현재 서버에서 다른처리를 진행 중입니다. 잠시 후 다시 처리하여 주시기 바랍니다.');
	} else if (data != '0') {
		confirmDialog2.alert('개별회수 처리중 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.\n\n'+data);
	} else {
		confirmDialog2.alert('개별회수 처리가 완료되었습니다.');
		
		if (data != '0') $('#btnNext').prop("disabled", false);	 //다음단계진행 활성화
		$('#btnQry').trigger('click');
	}
}
//선택건회수 처리시작
function selCncl(cnclDataList) {
	ingSw = true;
	
	data = new Object();
	data = {
		AcptNo 		: pReqNo,
		fileList 	: cnclDataList,
		PrcSys		: reqInfoData[0].confusr,
		requestType : 'progCncl_sel'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json',successProgCncl_sel);
}
//선택건회수 처리완료
function successProgCncl_sel(data) {
	ingSw = false;
	
	if (data == '2') {
		confirmDialog2.alert('현재 서버에서 다른처리를 진행 중입니다.\n 잠시 후 다시 처리하여 주시기 바랍니다.');
		
	} else if (data != '0') {
		confirmDialog2.alert('선택건회수 중 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.\n\n'+data);
	} else {
		confirmDialog2.alert('선택건 회수처리가 완료되었습니다.');
		$('#btnQry').trigger('click');
	}
}
//전체회수 처리시작
function allCncl(inputMsg) {
	ingSw = true;
	
	data =  new Object();
	data = {
		AcptNo			: pReqNo,
		UserId			: pUserId,
		conMsg			: inputMsg,
		ConfUsr			: reqInfoData[0].confusr,
		requestType		: 'reqCncl'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json',successReqCncl);
}
//전체회수 처리완료
function successReqCncl(data) {
	ingSw = false;
	
	if (data == '0') {
		confirmDialog2.alert('전체회수 처리가 완료되었습니다.', function(){close();});
	} else if (data == '2') {
		confirmDialog2.alert('현재 형상관리서버에서 다른처리를 진행하고 있습니다.\n잠시 후 다시 처리하여 주시기 바랍니다.');
	} else {
		confirmDialog2.alert('전체회수 처리에 실패하였습니다. 관리자에게 문의하시기 바랍니다.\n\n'+data);
	}
	$('#btnQry').trigger('click');
}
//우선순위적용 처리시작
function updatePriority() {
	ingSw = true;
	
	data =  new Object();
	data = {
		AcptNo			: pReqNo,
		fileList		: reqGridData,
		requestType		: 'updtSeq'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json',successUpdtSeq);
	
}
//우선순위적용 처리완료
function successUpdtSeq(data) {
	ingSw = false;
	
	if (data == '0') {
		confirmDialog2.alert('우선순위 수정이  완료 되었습니다.');
		$('#btnQry').trigger('click');
	} else if (data != '0') {
		confirmDialog2.alert('우선순위 수정 중 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.\n\n'+data);
	} else {
		confirmDialog2.alert('우선순위 수정 중 오류가 발생하였습니다.');
	}
}
//처리구분 수정
function updtDeploy(reqPass, deployDt) {
	ingSw = true;
	
	data =  new Object();
	data = {
		AcptNo			: pReqNo,
		ReqPass			: reqPass,
		DeployDate		: deployDt,
		PassCd			: '',
		requestType		: 'updtDeploy'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json',successUpdtDeploy);
}
//처리구분 수정완료
function successUpdtDeploy(data) {
	ingSw = false;
	
	if (data == '0') {
		confirmDialog2.alert('배포구분 수정이  완료 되었습니다.');
	}else{
		confirmDialog2.alert(data);
	}
	$('#btnQry').trigger('click');
}
//우선적용 또는 해제 처리시작
function priorityProc(parm) {
	ingSw = true;
	
	data =  new Object();
	data = {
		AcptNo			: pReqNo,
		priorityCD		: parm,
		requestType		: 'updtDeploy_2'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json',successUpdtDeploy_2);
}
//우선적용 또는 해제 완료
function successUpdtDeploy_2(data) {
	ingSw = false;
	
	var btnText = $('#btnPriority').text().trim();
	if (data == '0') {
		confirmDialog2.alert('[' + btnText + '] 처리가 완료되었습니다.');

		if (btnText == '우선적용') $('#btnPriority').text('우선적용해제');
		else $('#btnPriority').text('우선적용');
	} else {
		confirmDialog2.alert('[' + btnText + '] 처리 중 오류가 발생하였습니다. - ' + data);
	}
}

//결재, 반려 실행
function nextConf(gyulGbn, conMsg) {
	ingSw = true;
	
	if (null == conMsg || undefined  == conMsg || 'undefined ' == conMsg) {
		conMsg = '';
	}
	
	data =  new Object();
	data = {
		AcptNo			: pReqNo,
		UserId			: pUserId,
		conMsg			: conMsg,
		Cd				: gyulGbn,
		ReqCd			: pReqCd,
		requestType		: 'nextConf'
	}
	ajaxAsync('/webPage/approval/RequestStatus', data, 'json',successNextConf);
}
//결재, 반려 처리완료
function successNextConf(data) {
	ingSw = false;
	
	if (data == '0') {
		close();
	}else{
		confirmDialog2.alert('처리에 실패했습니다. \n[ERROR='+data+']');
	}
	$('#btnQry').trigger('click');
}
//자동처리 실행
function svrProc(prcSysGbn) {
	ingSw = true;
	
	data =  new Object();
	data = {
		AcptNo			: pReqNo,
		UserId			: pUserId,
		prcCd			: prcSysGbn,
		prcSys			: reqInfoData[0].signteam,
		requestType		: 'svrProc'
	}
	
	ajaxAsync('/webPage/approval/RequestStatus', data, 'json',successSvrProc);
}
//자동처리 완료
function successSvrProc(data) {
	ingSw = false;

	if (data == '0') {
		confirmDialog2.alert("재처리작업이 신청되었습니다. 잠시 후 다시받기를 하여 확인하여 주시기 바랍니다.");
	}else if (data == '2') {
		confirmDialog2.alert("현재 서버에서 다른처리를 진행 중입니다. 잠시 후 다시 처리하여 주시기 바랍니다.");
	} else  {
		confirmDialog2.alert("재처리작업 신청 중 오류가 발생하였습니다.");
	}
}

//어드민 여부 확인
function getUserInfo(){
	data =  new Object();
	data = {
		UserId			: pUserId,
		requestType		: 'getUserInfo'
	}
	ajaxAsync('/webPage/approval/RequestStatus', data, 'json',successGetUserInfo);
}

//어드민 여부 확인 완료
function successGetUserInfo(data) {
	if (data[0].cm_admin == '1') {
		isAdmin = true;
	}
	getReqInfo();
}

function setTabMenu(){
	//???????????????????????????????????????????/
	$("#tab2").show();
	resultGrid.align(); //그리드의 높이를 새로 잡아줌
	$("#tab2").hide();
	$(".tab_content:first").show();
	
	if (!gridSw1) {
		createViewGrid1();
		gridSw1 = true;
	}
	
	$("ul.tabs li").click(function () {
		$(".tab_content").hide();
		var activeTab = $(this).attr("rel");
		$("ul.tabs li").removeClass('on');
		$(this).addClass("on");
		$("#" + activeTab).fadeIn();

		if(this.id === 'tab2Li') {
			setTimeout(function() {
				if (!gridSw2) {
					createViewGrid2();
					gridSw2 = true;
				}
			}, 10);
		}
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
	data =  new Object();
	data = {
		UserId			: pUserId,
		AcptNo			: pReqNo,
		requestType		: 'getReqList'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json',successGetReqList);
}

//체크인 목록가져오기 완료
function successGetProgList(data) {
	reqGridData = data;
	reqGridOrgData = data;
	reqGrid.setData(reqGridData);
	reqGrid.repaint();
	
	//항목상세보기 옵션
	gridData_Filter();
	getRstList();
	
	for (var i=0; reqGridData.length>i ; i++) {
		tmpObj = {};
		tmpObj = reqGridData[i];
		if (tmpObj.check == 'true') {
			//if (pReqCd == '07' || pReqCd == '03' || pReqCd == '04' || pReqCd == '06') {
			if (pReqCd != '01' && pReqCd != '02' && pReqCd != '11') {
				$('#btnSelCncl').prop("disabled", false);	//선택건회수 활성화
				break;
			}
		}
	}
}
//처리결과 가져오기
function getRstList() {
	//처리결과가져오기
	data =  new Object();
	data = {
		UserId			: pUserId,
		AcptNo			: pReqNo,
		prcSys			: '',
		requestType		: 'getRstList'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json',successGetRstList);
}
//처리결과확인 목록 가져오기 완료
function successGetRstList(data) {
	resultGridData = data;
	resultGrid.setData(resultGridData);
	resultGrid.repaint();
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
		
		data =  new Object();
		data = {
			param			: param,
			requestType		: 'getProgList'
		}
		ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json', successGetProgList);
		
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
			//$('#txtReqTime').val(reqInfoData[0].aplydate.substr(8,2)+":"+reqInfoData[0].aplydate.substr(10));
			$('#hourTxt').val(reqInfoData[0].aplydate.substr(8,2));
			$('#minTxt').val(reqInfoData[0].aplydate.substr(10,2));
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
		if ( pReqCd == '04' && reqInfoData[0].befjob == '1' ) {	//선후행작업확인
			$('#btnBefJob').prop("disabled", false);
		}

		if (reqInfoData[0].srcview == 'Y' && pReqCd != '06') {
			$('#btnSrcView').prop("disabled", false);			//소스보기
			$('#btnSrcDiff').prop("disabled", false);			//소스비교
		}
		if (reqInfoData[0].log == '1') {
			$('#btnLog').prop("disabled", false);				//로그확인
		}

		//신청미완료건 결재자 여부확인
		if (reqInfoData[0].endsw == '0') {
			//Cmr3100.gyulChk(strAcptNo,pUserId);
			data =  new Object();
			data = {
				AcptNo			: pReqNo,
				UserId			: pUserId,
				requestType		: 'gyulChk'
			}
			ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json', successGyulChk);
			
		} else {//신청완료 건
			aftChk();
		}
	}
}
//결재자 여부확인완료
function successGyulChk(data) {
	//지금 로그인 사용자가 결재자 일때
	if (data == '0') {
		$('#btnApproval').prop("disabled", false); //활성화
		if (reqInfoData[0].prcsw == '0' && reqInfoData[0].signteamcd != '8') {
			$('#btnCncl').prop("disabled", false);
		} else {
			$('#btnCncl').prop("disabled", true); //비활성화
		}
		document.getElementById('lblApprovalMsg').style.visibility = "visible";
		document.getElementById('txtApprovalMsg').style.visibility = "visible";
	} else if (data != '1') {
		mx.controls.Alert.show("결재정보 체크 중 오류가 발생하였습니다.\n["+data+"]");
	}
	
	//선후행작업확인이 비활성일때
	if (pReqCd == '04' && $('#btnBefJob').is(':disabled')) {
		//관리자거나 신청자거나 반려가능 상태일때 선후행작업확인 활성화 시켜줌
		if(isAdmin || !$('#btnCncl').is(':disabled') || pUserId == reqInfoData[0].cr_editor){
			$('#btnBefJob').prop("disabled", false); //활성화
		}
	}
	aftChk();
}
function aftChk() {
	if (reqInfoData[0].cr_gyuljae == '1') $('#btnPriority').text('우선적용해제');
	else $('#btnPriority').text('우선적용');
	
	var signteam = reqInfoData[0].signteam;
	
	if (reqInfoData[0].prcsw == '0' && signteam.substr(0,3) == 'SYS') {
		if (isAdmin || reqInfoData[0].cr_editor == pUserId) {
			$('#btnRetry').prop("disabled", false);				//전체재처리
	      	if (reqInfoData[0].cr_editor == pUserId && reqInfoData[0].updtsw3 == '1') {
	         	if (reqInfoData[0].cr_prcsw == 'Y') {
	    			$('#btnStepEnd').prop("disabled", false);		//단계온료
	            	if (isAdmin || reqInfoData[0].cr_qrycd != '04') {
	            		$('#btnAllCncl').prop("disabled", false);	//전체회수
	            	}
	         	} else {
	         		if (signteam == 'SYSRC') {
		    			$('#btnStepEnd').prop("disabled", false);	//단계온료
	         		} else {
	            		$('#btnAllCncl').prop("disabled", false);	//전체회수
	         		}
	         	}
	      	} else if (isAdmin) {
        		$('#btnAllCncl').prop("disabled", false);			//전체회수
	          	if (reqInfoData[0].cr_prcsw == 'Y' || signteam == 'SYSRC') {
	    			$('#btnStepEnd').prop("disabled", false);		//단계온료
	         	}
	      	}
	      	if (reqInfoData[0].errtry == '1'){
	      		$('#btnErrRetry').prop("disabled", false);			//오류건재처리
	      	} else if (reqInfoData[0].sttry == '1') {
	      		$('#btnNext').prop("disabled", false);				//다음단계진행
	      	}
	   	}
		
	//신청 종료 아니면서 관리자 일때
	} else if (reqInfoData[0].prcsw == '0' && isAdmin) {
		$('#btnAllCncl').prop("disabled", false);					//전체회수
		$('#btnPriority').prop("disabled", false);					//우선적용
		
	//신청종료아니면서 신청자일때
	} else if(reqInfoData[0].prcsw == '0' && reqInfoData[0].cr_editor == pUserId){
		$('#btnAllCncl').prop("disabled", false);					//전체회수
		
	} else if (reqInfoData[0].prcsw == '0' && reqInfoData[0].updtsw3 == '1') {
		if (isAdmin || reqInfoData[0].cr_editor == pUserId) {
	   	   	if (reqInfoData[0].cr_prcsw == 'Y') {
				if (reqInfoData[0].cr_qrycd == '04' && isAdmin) {
					$('#btnAllCncl').prop("disabled", false);		//전체회수
				} else if (reqInfoData[0].cr_qrycd != '04') {
					$('#btnAllCncl').prop("disabled", false);		//전체회수
				} 
	   	   	} else {
				$('#btnAllCncl').prop("disabled", false);			//전체회수
			}
	   	}
	}

	if (reqInfoData[0].cr_status == '0' && (reqInfoData[0].cr_editor == pUserId || isAdmin) && reqInfoData[0].prcsw == '0') {
	    if (reqInfoData[0].updtsw1 == '1') {
	    	$('#btnPriorityOrder').prop("disabled", false);			//우선순위적용
	    }
	    
	    if (pReqCd == '04' && reqInfoData[0].updtsw2 == '1') {
	    	$('[data-ax5select="cboReqPass"]').ax5select("enable");//처리구분  콤보 활성화
			document.getElementById('reqBtnDiv').style.visibility = "visible"; //처리구분 수정
	    }
	} 
}

//처리구분 가져오기
function getPrcSysInfo() {
	data =  new Object();
	data = {
		AcptNo			: pReqNo,
		requestType		: 'getPrcSys'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json', successGetPrcSys);
}
//처리구분 가져오기 완료
function successGetPrcSys(data) {
	cboPrcSysData = data;
	
	options = [];
	$.each(cboPrcSysData,function(key,value) {
	    options.push({value: value.cm_micode, text: value.cm_codename, qrycd: value.qrycd});
	});
	
	$('[data-ax5select="cboPrcSys"]').ax5select({
        options: options
	});

	$('#cboPrcSys').trigger('change');
}



//새창팝업
function openWindow(type,acptNo, etcInfo) {
	var nHeight, nWidth, cURL, winName;

	if ( (type+'_'+pReqCd) == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}

    winName = type+'_pop_'+pReqCd;

    nWidth  = 1046;
	nHeight = 700;
    if (type === 1) {//프로그램정보
	    nHeight = 370;
	    nWidth  = 1200;
		cURL = "/webPage/winpop/PopProgramInfo.jsp";
	} else if (type === 2) {//처리결과확인
		cURL = "/webPage/winpop/PopPrcResultLog.jsp";
	} else if (type === 3) {//스크립트확인
		nHeight = 400;
		cURL = "/webPage/winpop/PopScript.jsp";
	} else if (type === 4) {//SR정보확인
		nHeight = 735;
		nWidth = 1100;
		cURL = "/webPage/winpop/PopSRInfo.jsp";
	} else if (type === 5) {//소스보기
		nWidth = 1200;
		cURL = "/webPage/winpop/PopRequestSourceView.jsp";
	} else if (type === 6) {//소스비교
		cURL = "/webPage/winpop/PopSourceDiffView.jsp";
	} else if (type === 7) {//로그확인
		cURL = "/webPage/winpop/PopServerLog.jsp";
	} else if (type === 8) {//결재정보
		nHeight = 480;
		cURL = "/webPage/winpop/PopApprovalInfo.jsp";
	} else {
		confirmDialog2.alert('window open - popup: invalid type ['+type+'] error', function(){return;});
	}
	
	var f = document.setReqData;
    f.user.value 	= pUserId;
    
	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	if (acptNo != '' && acptNo != null) {
		f.acptno.value	= acptNo;
	} else {
		f.acptno.value	= pReqNo;
	}
	if (etcInfo != '' && etcInfo != null) {
		if (type === 4) { //SR정보확인
			f.srid.value = etcInfo;
		} else if (type === 1 || type === 3 || type === 5 || type === 6) { //프로그램정보, 스크립트확인, 소스보기, 소스비교
			f.itemid.value = etcInfo;
		} else {
			f.etcinfo.value = etcInfo;
		} 
	}
    
    myWin = winOpen(f, winName, cURL, nHeight, nWidth);
    
}
//선행작업연결확인 모달 팝업
function openBefJobListModal() {
	befJobListModal.open({
        width: 1045,
        height: 400,
        iframe: {
            method: "get",
            url: "../modal/request/BefJobListModal.jsp",
            param: "callBack=befJobModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
            }
        }
    }, function () {
    });
}
//선행작업연결 모달
function openBefJobSetModal() {
	befJobModal.open({
        width: 915,
        height: 600,
	    iframe: {
	        method: "get",
	        url: "../modal/request/BefJobSetModal.jsp",
	        param: "calbefJobModaltModalCallBack"
	    },
	    onStateChanged: function () {
	        if (this.state === "open") {
	            mask.open();
	        }
	        else if (this.state === "close") {
            	if(befJobData != null){
            		updateBefJob(befJobData);
            	} else {
            		openBefJobListModal();
            	}
	            mask.close();
	        }
	    }
	}, function () {
	});
}
var befJobSetModalCallBack = function() {
	befJobModal.close();
}

//선행작업연결
function updateBefJob(befJobData){
	data =  new Object();
	data = {
		AcptNo			: pReqNo,
		befList		: befJobData,
		requestType		: 'updtBefJob'
	}
	ajaxAsync('/webPage/winpop/PopRequestDetailServlet', data, 'json', successUpdtBefJob);
}
//선후행작업연결완료
function successUpdtBefJob(data) {
	if (data != '0') {
		confirmDialog2.alert('선행작업 등록에 실패하였습니다.');
	} else {
		openBefJobListModal();
	}
}
