/**
 * [결재정보 > 대결가능범위등록] 팝업 기능정의
 * 
 * <pre>
 * 	작성자	: 방지연
 * 	버전 		: 1.0
 *  수정일 	: 2019-07-05
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var grdRangeList		= new ax5.ui.grid();

var grdRangeListData 		= [];
var cboPosData				= [];	//직위 콤보박스 데이터
var cboRgtData				= [];	//직무 콤보박스 데이터
var lstPosData				= null; //대결가능범위 체크리스트 데이터
var lstRgtData				= null; //대결가능범위 체크리스트 데이터
var addId 					= null;

var tmpInfo     			= new Object(); 
var tmpInfoData 			= new Object();

$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
$('input.radio-pie').wRadio({theme: 'circle-radial red', selector: 'checkmark'});

grdRangeList.setConfig({
    target: $('[data-ax5grid="grdRangeList"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    showLineNumber: false,
    header: {
        align: "center",
        columnHeight: 30,
        selector: false
    },
    body: {
        columnHeight: 25,
        onClick: function () {
            this.self.select(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "gbncd", 		label: "구분",  		width: 70},
        {key: "cm_teamck",	label: "동일팀",  	width: 100},
        {key: "cm_rpos", 	label: "직위",  		width: 100},
        {key: "cm_spos", 	label: "대결직위", 	width: 100}
    ]
});

$(document).ready(function() {
	// 직위,직무 콤보박스 변경이벤트
	$('#cboPos').bind('change', function() {
		cboPos_Change();
	});
	
	// 직위 클릭이벤트
	$('#rdoPos').bind('click', function() {
		rdoPos_Click();
	});
	
	// 직무 클릭이벤트
	$('#rdoRgt').bind('click', function() {
		rdoRgt_Click();
	});
	
	// 직위 전체선택
	$('#chkAll').bind('click', function() {
		chkAll_Click();
	});
	
	// 조회
	$('#btnQry').bind('click', function() {
		btnQry_Click();
	});
	
	// 닫기
	$('#btnClose').bind('click', function() {
		btnClose_Click();
	});
	
	// 등록
	$('#btnReg').bind('click', function() {
		btnReg_Click();
	});
	
	// 폐기
	$('#btnDel').bind('click', function() {
		btnDel_Click();
	});
	
	$('#rdoRgt').wRadio("check", true);
	$('#chkTeam').wCheck("check", true);
	
	getCodeInfo();
	btnQry_Click();
});

function getCodeInfo(){
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('POSITION', '','N'),
		new CodeInfo('RGTCD', '','N')
	]);
	
	cboPosData = codeInfos.POSITION;
	cboRgtData = codeInfos.RGTCD;

	lstPosData = cboPosData;
	lstRgtData = cboRgtData;
	
	if($('#rdoRgt').is(':checked')) {
		$('[data-ax5select="cboPos"]').ax5select({
	        options: injectCboDataToArr(cboRgtData, 'cm_micode' , 'cm_codename')
	   	});
		
		setLstPos(lstRgtData);
		rdoRgt_Click();
	}else {
		$('[data-ax5select="cboPos"]').ax5select({
	        options: injectCboDataToArr(cboPosData, 'cm_micode' , 'cm_codename')
	   	});
		
		setLstPos(cboPosData);
		rdoPos_click();
	}	
}

function cboPos_Change() {
	if(getSelectedIndex('cboPos') < 0) return;
	
	var tmpGbn = "";
	var i = 0;
	
	if($('#rdoPos').is(':checked')) tmpGbn = "0";
	else tmpGbn = "1";
	
	if($('#rdoPos').is(':checked')) {
		lstPosData.forEach(function(item, index) {
			addId = item.cm_macode+"_"+item.cm_micode;
			$('#lstPos'+addId).wCheck('check', false);
		});
	}else {
		lstRgtData.forEach(function(item, index) {
			addId = item.cm_macode+"_"+item.cm_micode;
			$('#lstPos'+addId).wCheck('check', false);
		});
	}
	
	//Cmm0300_Blank.getBlankList(tmpGbn,cboPos.selectedItem.cm_micode);
	tmpInfo = new Object();
	tmpInfo.gbnCd = tmpGbn;
	tmpInfo.posCd = getSelectedVal('cboPos').value;
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETBLANKLIST'
	}
	
	ajaxAsync('/webPage/modal/approvalInfo/SubApprovalRangeServlet', tmpInfoData, 'json', successGetBlankList);
}

function successGetBlankList(data) {
	var tmpData = data;
	var i = 0;
	var j = 0;
	var k = 0;
	
	for(j=0; j<tmpData.length; j++) {
		if($('#rdoPos').is(':checked')) { 
			for(i=0; i<lstPosData.length; i++) {
				if(tmpData[j].cm_sposition == lstPosData[i].cm_micode) {
					consol.log("cm_position: " + tmpData[j].cm_sposition + ", m")
					addId = lstPosData[i].cm_macode + "_" + lstPosData[i].cm_micode;
					$('#lstPos'+addId).wCheck('check', true);
					if(i>k) {
						$('#lstPos'+addId).remove();
						
						addId = lstPosData[i].cm_macode + "_" + lstPosData[i].cm_micode;
						liStr  = '';
						liStr += '<li class="list-group-item">';
						liStr += '<label><input type="checkbox" class="checkbox-cm_micode" id="lstPos'+addId+'" value="'+data.cm_micode+'"/>'+data.cm_codename+'</label>';
						liStr += '</li>';
						
						$('#lstPos'+lstPosData[k-1].cm_macode + "_" + lstPosData[k-1].cm_micode).after(liStr);
					}else {
						k++;
					}
				}
			}
		}else {
			for(i=0; i<lstRgtData.length; i++) {
				if(tmpData[j].cm_sposition == lstRgtData[i].cm_micode) {
					addId = lstRgtData[i].cm_macode + "_" + lstRgtData[i].cm_micode;
					$('#lstPos'+addId).wCheck('check', true);
					if(i>k) {
						$('#lstPos'+addId).remove();
						
						addId = lstRgtData[i].cm_macode + "_" + lstRgtData[i].cm_micode;
						liStr  = '';
						liStr += '<li class="list-group-item">';
						liStr += '<label><input type="checkbox" class="checkbox-cm_micode" id="lstPos'+addId+'" value="'+data.cm_micode+'"/>'+data.cm_codename+'</label>';
						liStr += '</li>';
						
						$('#lstPos'+lstRgtData[k-1].cm_macode + "_" + lstRgtData[k-1].cm_micode).after(liStr);
					}else {
						k++;
					}
				}
			}
		}
	}
	
	if($('#rdoPos').is(':checked')) { 
		setLstPos(lstPosData);
	}else {
		setLstPos(lstRgtData);
	}
}

function rdoPos_Click() {
	$('[data-ax5select="cboPos"]').ax5select({
        options: injectCboDataToArr(cboPosData, 'cm_micode' , 'cm_codename')
   	});
	
	setLstPos(lstPosData);
	$('#chkAll').wCheck("check", false);
	$('#chkAll').wCheck("disabled", false);
	btnQry_Click();
}

function rdoRgt_Click() {
	$('[data-ax5select="cboPos"]').ax5select({
        options: injectCboDataToArr(cboRgtData, 'cm_micode' , 'cm_codename')
   	});
	
	setLstPos(lstRgtData);
	$('#chkAll').wCheck("check", false);
	$('#chkAll').wCheck("disabled", true);
	btnQry_Click();
}

function btnQry_Click() {
	grdRangeList.setData([]);
	
	tmpInfo = new Object();
	if($('#rdoPos').is(':checked')) tmpInfo.gbnCd = "0";
	else  tmpInfo.gbnCd = "1";
	tmpInfo.posCd = "";
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETBLANKLIST'
	}
	
	ajaxAsync('/webPage/modal/approvalInfo/SubApprovalRangeServlet', tmpInfoData, 'json', successGetBlankList2);
}

function successGetBlankList2(data) {
	grdRangeListData = data;
	grdRangeList.setData(grdRangeListData);
}

function btnClose_Click() {
	window.parent.subApprovalRangeModal.close();
}

function btnReg_Click() {
	
}

function btnDel_Click() {
	
}

function setLstPos(data) {
	$('#lstPos').empty();
	
	data.forEach(function(data, Index) {
		addId = data.cm_macode + "_" + data.cm_micode;
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '<label><input type="checkbox" class="checkbox-cm_micode" id="lstPos'+addId+'" value="'+data.cm_micode+'"/>'+data.cm_codename+'</label>';
		liStr += '</li>';
		
		$('#lstPos').append(liStr);
	});
	
	$('input.checkbox-cm_micode').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
}

function chkAll_Click() {
	lstPosData.forEach(function(item, index) {
		addId = item.cm_macode + "_" + item.cm_micode;
		if($('#chkAll').is(':checked')) {
			$('#lstPos'+addId).wCheck('check', true);
		} else {
			$('#lstPos'+addId).wCheck('check', false);
		}
	});
}