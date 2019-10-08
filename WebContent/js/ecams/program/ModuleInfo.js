/**
 * 실행모듈정보 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-28
 * 
 */

var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드

var modListGrid	= new ax5.ui.grid();
var moduleInfoModal = new ax5.ui.modal();

var modListGridData	= [];

var cboSysCdData	= [];
var cboRsrcData		= [];

var sysCD           = '';

modListGrid.setConfig({
	target: $('[data-ax5grid="modListGrid"]'),
	sortable: true, 
	multiSort: true,
	showRowSelector: true,
	header: {
		align: "center",
	},
	body: {
		onClick: function () {
			this.self.select(this.dindex);
		},
		onDBLClick: function () {
			dblClickDirGrid(this.dindex);
		},
		trStyleClass: function () {
			if(this.item.status === 'ER'){
				return "text-danger";
			}
		},
		onDataChanged: function(){
			this.self.repaint();
		}
	},
	columns: [
		{key: "cr_rsrcname", 	label: "프로그램명",  		width: '20%', align: "left"},
		{key: "jawon",			label: "프로그램종류",  	width: '10%', align: "left"},
		{key: "cm_dirpath", 	label: "프로그램경로",  	width: '20%', align: "left"},
		{key: "cr_rsrcname2", 	label: "맵핑프로그램명",  	width: '20%', align: "left"},
		{key: "jawon2", 		label: "맵핑프로그램종류",  width: '10%', align: "left"},
		{key: "cm_dirpath2", 	label: "맵핑프로그램경로",  	width: '20%', align: "left"},
		]
});
$('[data-ax5select="cboSysCd"]').ax5select({
    options: []
});

$('[data-ax5select="cboRsrc"]').ax5select({
	options: []
});

$('input:radio[name^="radio"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});

$(document).ready(function() {
	//userId = 'cishappy';
	$('#optPrg').wRadio('check', true);
	getSysInfo();
	
	$('#cboSysCd').bind('change', function() {
		if(getSelectedIndex('cboSysCd') < 1) {
			modListGridData	= [];
			modListGrid.setData([]);
			cboRsrcData = [];
			$('[data-ax5select="cboRsrc"]').ax5select({
		        options: []
			});
			return;
		}
		getRsrcList();
		getRelatList();
	});
	
	// 전체, 프로그램명, 맵핑프로그램명 클릭(라디오버튼)
	$('input:radio[name^="radio"]').bind('click', function() {
		
	});
	// 맵핑 리스트 엔터
	$('#txtRsrcName').bind('keypress', function(event) {
		if(event.keyCode === 13) {
			$('#btnQry').trigger('click');
		}
	});
	// 맵핑 리스트 검색
	$('#btnQry').bind('click', function() {
		getRelatList();
	});
	// 엑셀 저장
	$('#btnExcel').bind('click', function() {
		var excelStr = '['+ getSelectedVal('cboSysCd').cm_sysmsg + '] 연관등록목록.xls';
		modListGrid.exportExcel(excelStr);
	});
	// 등록
	$('#btnReq').bind('click', function() {
		updtRelat();
	});
	// 폐기
	$('#btnDel').bind('click', function() {
		delRelat();
	});	
});

// 폐기
function delRelat() {
	var selIn 	 = modListGrid.selectedDataIndexs;
	var progList = [];
	
	if(getSelectedIndex('cboSysCd') < 1) {
		dialog.alert('시스템을 선택하여 주십시오.', function() {});
		return;
	}
	
	if(selIn.length === 0 ){
		dialog.alert('선택된 목록이 없습니다. 목록에서 해제 할 대상을 선택한 후 처리하십시오.', function() {});
		return;
	}
	
	
	selIn.forEach(function(selInex, index) {
		var item = modListGrid.list[selInex];
		item.cr_itemid = item.cd_itemid;
		item.cr_prcitem = item.cd_prcitem;
		progList.push(item);
	});
	
	var data = new Object();
	data = {
		UserId 		: userId,
		progList 	: progList,
		requestType	: 'delRelat'
	}
	ajaxAsync('/webPage/program/ModuleInfo', data, 'json',successDelRelat);
}

// 폐기 완료
function successDelRelat(data) {
	if(data === '0' ) {
		dialog.alert('프로그램과 맵핑프로그램의 연결해제를 완료하였습니다.', function(){});
	} else {
		dialog.alert('프로그램과 맵핑프로그램의 연결해제처리에 실패하였습니다.', function(){});
	}
	
	$('#btnQry').trigger('click');
}

// 맵핑연결 리스트 가져오기
function getRelatList() {
	if(getSelectedIndex('cboSysCd') < 1) {
		dialog.alert('시스템을 선택해 주시기 바랍니다.',function(){});
		return;
	}
	
	var GbnCd = $('#optAll').is(':checked') ? 'A'
				: $('#optPrg').is(':checked') ? 'P'
				: $('#optMod').is(':checked') ? 'A' : '';
	
	var data = new Object();
	var rsrcCD = "";
	if (cboRsrcData != null && cboRsrcData.length > 0) rsrcCD = getSelectedVal('cboRsrc').value;
	data = {
		UserId 		: userId,
		SysCd 		: getSelectedVal('cboSysCd').value,
		RsrcCd 		: rsrcCD,
		GbnCd 		: GbnCd,
		ProgId 		: $('#txtRsrcName').val().trim(),
		subSw 		: false,
		requestType	: 'getRelatList'
	}
	ajaxAsync('/webPage/program/ModuleInfo', data, 'json',successGetRelatList);
}

// 맵핑연결 리스트 가져오기 완료
function successGetRelatList(data) {
	var rowSelector = $('[data-ax5grid-column-attr="rowSelector"]');
	$(rowSelector).attr('data-ax5grid-selected',"false");
	
	modListGridData = data;
	modListGrid.setData(modListGridData);
}

// 프로그램 종류 리스트 가져오기
function getRsrcList() {
	var data = new Object();
	data = {
		SysCd 		: getSelectedVal('cboSysCd').value,
		SelMsg 		: 'SEL',
		requestType	: 'getRsrcList'
	}
	ajaxAsync('/webPage/program/ModuleInfo', data, 'json',successGetRsrcList);
}
// 프로그램 종류 리스트 가져오기 완료
function successGetRsrcList(data) {
	cboRsrcData = data;
	
	$('[data-ax5select="cboRsrc"]').ax5select({
      options: injectCboDataToArr(cboRsrcData, 'cm_micode' , 'cm_codename')
	});
	
	$('[data-ax5select="cboRsrc"]').ax5select('setValue', 	'0000', 	true); 	// 프로그램유형 초기화
}

//시스템 콤보 가져오기
function getSysInfo() {
	var data = new Object();
	data = {
		UserId 		: userId,
		SecuYn 		: 'Y',
		SelMsg 		: 'SEL',
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/program/ModuleInfo', data, 'json',successGetSysInfo);
}
// 시스템 콤보 가져오기 완료
function successGetSysInfo(data) {
	cboSysCdData = data;
	
	cboSysCdData = cboSysCdData.filter(function(data) {
		if(data.cm_sysinfo.substr(0,1) === '1') return false;
		else return true;
	});
	$('[data-ax5select="cboSysCd"]').ax5select({
      options: injectCboDataToArr(cboSysCdData, 'cm_syscd' , 'cm_sysmsg')
	});
	
	var sysSelectIndex = 0;
	if(cboSysCdData.length == 2) sysSelectIndex = 1;
	else sysSelectIndex = 0;
	var selectVal = $('select[name=cboSysCd] option:eq('+sysSelectIndex+')').val();
	$('[data-ax5select="cboSysCd"]').ax5select('setValue',selectVal,true);
	$('#cboSysCd').trigger('change');
}
//등록
function updtRelat() {

	if(getSelectedIndex('cboSysCd') < 1) {
		dialog.alert('시스템을 선택하여 주십시오.', function() {});
		return;
	}
	
	sysCD = getSelectedVal('cboSysCd').value;
	
	//console.log(tmpWidth+', '+tmpHeight);
	
	moduleInfoModal.open({
        width: 1024,
        height: 670,
        defaultSize : true,
        iframe: {
            method: "get",
            url: "../modal/moduleinfo/ModuleInfoModal.jsp",
            param: "callBack=modalCallBack"
	    },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
            }
        }
	});
	
}
