/**
 * 빌드/릴리즈유형등록 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-18
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var userName 	= '관리자';
var userId 		= 'MASTER';
var adminYN 	= 'Y';

var editScriptGrid		= new ax5.ui.grid();
var scriptGrid			= new ax5.ui.grid();

var editScriptGridData 	= null;
var scriptGridData		= null;

var cboBldGbnData	= null;
var cboBldCdData	= null;
var fCboBldCdData	= null;
var cboBldGbnBData	= null;

var cboOptions		= null;
var newBldCdValue	= null;

editScriptGrid.setConfig({
    target: $('[data-ax5grid="editScriptGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 25,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            clickEditGrid(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_seq", 	label: "순서",  		width: '5%' },
        {key: "cm_cmdname", label: "수행명령",  	width: '95%', align: 'left'},
    ]
});

scriptGrid.setConfig({
    target: $('[data-ax5grid="scriptGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 25,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_codename", 	label: "빌드패턴",  	width: '10%'},
        {key: "cm_seq", 		label: "순서",  		width: '5%' },
        {key: "cm_cmdname", 	label: "수행명령",  	width: '85%', align: 'left'},
    ]
});

$('[data-ax5select="cboBldGbn"]').ax5select({
    options: []
});

$('[data-ax5select="cboBldCd"]').ax5select({
    options: []
});

$('[data-ax5select="cboBldGbnB"]').ax5select({
    options: []
});

$('input.checkbox-view').wCheck({theme: 'square-classic red', selector: 'checkmark', highlightLabel: true});


$(document).ready(function() {
	
	getCodeInfo();
	
	$('#cboBldGbnB').bind('change', function() {
		$('#btnQry').trigger('click');
	});

	// 서버종류 변경시
	$('#cboBldGbn').bind('change', function() {
		var selGbn = getSelectedVal('cboBldGbn').value;
		fCboBldCdData = [];
		cboBldCdData.forEach(function(bldCdItem, index) {
			if(selGbn === bldCdItem.cm_bldgbn) fCboBldCdData.push(bldCdItem);
		});
		
		if(fCboBldCdData.length === 0 ) {
			var newBldCd 	= new Object();
			newBldCd.value 	= 0;
			newBldCd.text 	= '유형신규등록';
			newBldCd.cm_micode = '00';
			newBldCd.cm_bldgbn = selGbn;
			fCboBldCdData.push(newBldCd);
		}
		
		
		if(fCboBldCdData[0].cm_micode == '00') {
			var cnt = 0;
			var newBldCd = new Object();
			var i = 0;
			for(i=1; i<fCboBldCdData.length; i++) {
				++cnt;
				if(Number(fCboBldCdData[i].cm_micode) != cnt) break;
			}
			
			if(i >= cnt) ++cnt;
			
			newBldCd = fCboBldCdData[0];
			if(cnt < 10) newBldCd.cm_micode = '00' + String(cnt);
			else if (cnt < 100) newBldCd.cm_micode = '0' + String(cnt);
			else newBldCd.cm_micode = String(cnt);
			
			fCboBldCdData.splice(0,1,newBldCd);
		}
		
		cboOptions = [];
		$.each(fCboBldCdData,function(key,value) {
			cboOptions.push({value: value.value, text: value.cm_codename, cm_micode : value.cm_micode, cm_bldgbn : value.cm_bldgbn});
		});
		
		$('[data-ax5select="cboBldCd"]').ax5select({
	        options: cboOptions
		});
		
		
		if(fCboBldCdData.length > 0 ) $('#cboBldCd').trigger('change');
	});
	
	// 유형구분 변경시
	$('#cboBldCd').bind('change', function() {
		//getSelectedVal('cboBldGbn')
		var bldCdVal 	= $('[data-ax5select="cboBldCd"]').ax5select("getValue")[0].cm_micode;
		var bldGbnVal 	= $('[data-ax5select="cboBldGbn"]').ax5select("getValue")[0].value;
		var bldCdSelIn	= $('#cboBldCd option').index($('#cboBldCd option:selected'));
		$('#btnDel').prop(  "disabled", true );
		$('#btnCopy').prop( "disabled", true );
		
		if(newBldCdValue !== null) {
			$('[data-ax5select="cboBldCd"]').ax5select('setValue',newBldCdValue ,true);
			bldCdSelIn		= $('#cboBldCd option').index($('#cboBldCd option:selected'));
			bldCdVal 		= $('[data-ax5select="cboBldCd"]').ax5select("getValue")[0].cm_micode;
			newBldCdValue 	= null;
		}
		if(bldCdSelIn === 0) {
			editScriptGridData = [];
			editScriptGrid.setData(editScriptGridData);
			return;
		} 
		
		$('#btnDel').prop(  "disabled", false );
		$('#btnCopy').prop( "disabled", false );
		
		var data = new Object();
		data = {
			Cbo_BldGbn_code : bldGbnVal,
			Cbo_BldCd0_code : bldCdVal,
			requestType	: 'getScript'
		}
		ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successGetScript);
	});
	
	// 유형 삭제 클릭
	$('#btnDel').bind('click', function() {
		delScript();
	});
	
	// 추가 클릭
	$('#btnScr').bind('click', function() {
		addEditGrid();
	});
	
	// 삭제 클릭
	$('#btnDelScr').bind('click', function() {
		deleteEditGrid();
	});
	
	// 저장 클릭
	$('#btnReq').bind('click', function() {
		insertScript();
	});
	
	// 새이름 저장 클릭
	$('#btnCopy').bind('click', function() {
		copyScript();
	});
	
	// 조회 클릭
	$('#btnQry').bind('click', function() {
		getExistScript();
	});
	
	// 수행명령 엔터
	$('#txtOrder').bind('keypress', function(event) {
		if(event.keyCode==13) {
			$('#btnQry').trigger('click');
		}
	})
});

// 스크립트 가져오기
function getExistScript() {
	var bldGbn 		= getSelectedVal('cboBldGbnB').value;
	var data = new Object();
	data = {
		Cbo_BldGbn 	: bldGbn,
		msg 		: $('#txtOrder').val().trim(),
		requestType	: 'getExistScript'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successGetExistScript);
}

// 스크립트 가져오기 완료
function successGetExistScript(data) {
	scriptGridData = data;
	scriptGrid.setData(scriptGridData);
}

// 스크립트 유형 삭제
function delScript() {
	var bldCd 		= $('[data-ax5select="cboBldCd"]').ax5select("getValue")[0].cm_micode;
	var bldGbn 		= $('[data-ax5select="cboBldGbn"]').ax5select("getValue")[0].value;
	
	var data = new Object();
	data = {
		Cbo_BldGbn 	: bldGbn,
		Cbo_BldCd0 	: bldCd,
		requestType	: 'delScript'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successDelScript);
}

function successDelScript(data) {
	if(data > 0) {
		dialog.alert('삭제처리를 완료하였습니다.', function() {
			getBldCd();
		});
	} else {
		dialog.alert('새이름으로 저장처리 중 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.', function() {});
	}
}

// 스크립트 새이름 저장
function copyScript() {
	var bldCd 		= $('[data-ax5select="cboBldCd"]').ax5select("getValue")[0].cm_micode;
	var bldGbn 		= $('[data-ax5select="cboBldGbn"]').ax5select("getValue")[0].value;
	var txtErrMsg	= $('#txtErrMsg').val().trim();
	var NewBld		= fCboBldCdData[0].cm_micode;
	
	var data = new Object();
	data = {
		Cbo_BldGbn 	: bldGbn,
		Cbo_BldCd0 	: bldCd,
		Txt_Comp2 	: txtErrMsg,
		NewBld 		: NewBld,
		requestType	: 'copyScript'
	}
	newBldCdValue = bldGbn + NewBld;
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successCopyScript);
}

// 스크립트 새이름 저장 완료
function successCopyScript(data) {
	if(data > 0) {
		dialog.alert('새이름으로 저장처리를 완료하였습니다.', function() {
			getBldCd();
		});
	} else {
		dialog.alert('새이름으로 저장처리 중 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.', function() {});
	}
}

// 스크립트 저장 
function insertScript() {
	if(editScriptGridData.length === 0 ) { 
		dialog.alert('빌드용 수행명령을 입력한 후 등록하십시오.', function(){});
		return;
	}
	
	var bldCd 		= $('[data-ax5select="cboBldCd"]').ax5select("getValue")[0].cm_micode;
	var bldGbn 		= $('[data-ax5select="cboBldGbn"]').ax5select("getValue")[0].value;
	var txtErrMsg	= $('#txtErrMsg').val().trim();
	var runType		= 'R';
	
	if(fCboBldCdData.length === 1 && bldCd === '00' ) bldCd = '01';
	
	var data = new Object();
	data = {
		Cbo_BldGbn 	: bldGbn,
		Cbo_BldCd0 	: bldCd,
		Txt_Comp2 	: txtErrMsg,
		runType 	: runType,
		Lv_File0_dp : editScriptGridData,
		requestType	: 'insertScript'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successInsertScript);
}

// 스크립트 저장 완료
function successInsertScript(data) {
	if(data > 0) {
		dialog.alert('등록처리를 완료하였습니다.', function() {
			getBldCd();
		});
	} else {
		dialog.alert('등록처리 중 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.', function() {});
	}
}

// 수정 스크립트 그리드에 추가하기
function addEditGrid() {
	var txtComp = $('#txtComp').val().trim();
	var txtSeq = $('#txtSeq').val().trim();
	
	if(txtComp.length === 0 ) {
		dialog.alert('수행명령을 입력하여 주십시오.', function(){});
		return;
	}
	if(txtSeq.length === 0 ) {
		dialog.alert('수행순서를 입력하여 주십시오.', function(){});
		return;
	}
	
	var newGridItem 		= new Object();
	newGridItem.cm_cmdname 	= txtComp;
	newGridItem.cm_seq 		= txtSeq;
	
	if($('#chkView').is(':checked')) newGridItem.cm_viewyn = 'Y';
	else newGridItem.cm_viewyn = 'N';
	
	for(var i=0; i<editScriptGridData.length; i++) {
		if(editScriptGridData[i].cm_seq == txtSeq) {
			editScriptGridData.splice(i,1);
			break;
		}
	}
	
	editScriptGridData.push(newGridItem);
	editScriptGridData.sort(function(a,b) {
		return Number(a.cm_seq) < Number(b.cm_seq) ? -1 : Number(a.cm_seq) > Number(b.cm_seq) ? 1 : 0;
	});
	editScriptGrid.setData(editScriptGridData);
}

// 수정 스크립트 그리드 삭제하기
function deleteEditGrid() {
	var selIn = editScriptGrid.selectedDataIndexs;
	var selItem = null;
	if(selIn.length === 0 ) { 
		dialog.alert('삭제 할 정보를 그리드에서 선택 후 눌러주세요.', function(){});
		return;
	}
	
	editScriptGridData.splice(selIn,1);
	editScriptGrid.setData(editScriptGridData);
}

// 스크립트 수정 그리드 선택
function clickEditGrid(index) {
	var selItem = editScriptGrid.list[index];
	
	$('#txtComp').val(selItem.cm_cmdname);
	$('#txtSeq').val(selItem.cm_seq);
	$('#txtErrMsg').val(selItem.cm_errword);
	
	if(selItem.cm_viewyn === 'Y') $('#chkView').wCheck('check', true);
	else $('#chkView').wCheck('check', false);
}

// 유형구분 선택시 스크립트 가져오기
function successGetScript(data) {
	editScriptGridData = data;
	editScriptGrid.setData(editScriptGridData);
	if(editScriptGridData.length > 0 ) $('#txtErrMsg').val(editScriptGridData[0].cm_errword);
}

// 유형구분 가져오기
function getBldCd(){
	var data = new Object();
	data = {
		requestType	: 'getBldCd'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successGetBldCd, changeCboBldGbn);
}

// 트리거 콜백으로 쓰기위해서 function으로 뺌
function changeCboBldGbn() {
	$('#cboBldGbn').trigger('change');
}

// 우형구분 가져오기 완료
function successGetBldCd(data) {
	cboBldCdData = data;
	
	// value는 유일값이어야하는데 중복값이 너무 많아서 선택 안됨.
	// 그래서  따로 value 만들기.
	for(var i=0; i<cboBldCdData.length; i++) {
		cboBldCdData[i].value = cboBldCdData[i].cm_bldgbn + cboBldCdData[i].cm_micode;
	}
}

// 등록구분 가져오기
function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('BLDGBN','','N'),
		]);
	cboBldGbnData 		= codeInfos.BLDGBN;
	cboBldGbnBData 		= codeInfos.BLDGBN;
	
	cboOptions = [];
	$.each(cboBldGbnData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	$('[data-ax5select="cboBldGbn"]').ax5select({
        options: cboOptions
	});
	
	$('[data-ax5select="cboBldGbnB"]').ax5select({
        options: cboOptions
	});
	getBldCd();
	getExistScript();
};