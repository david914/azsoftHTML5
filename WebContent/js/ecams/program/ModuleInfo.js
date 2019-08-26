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

var prgGrid		= new ax5.ui.grid();
var modGrid		= new ax5.ui.grid();
var modListGrid	= new ax5.ui.grid();

var prgGridData 	= [];
var fPrgGridData 	= [];
var modGridData	 	= [];
var fModGridData	= [];
var modListGridData	= [];

var cboSysCdData	= [];
var cboRsrcData		= [];

prgGrid.setConfig({
    target: $('[data-ax5grid="prgGrid"]'),
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
        {key: "cr_rsrcname", 	label: "프로그램명",  		width: '25%', align: "left"},
        {key: "jawon",			label: "프로그램종류",  	width: '15%', align: "left"},
        {key: "cm_dirpath", 	label: "프로그램경로",  	width: '40%', align: "left"},
        {key: "cr_lstver", 		label: "버전",  			width: '10%'},
    ]
});

modGrid.setConfig({
    target: $('[data-ax5grid="modGrid"]'),
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
        {key: "cr_rsrcname", 	label: "프로그램명",  		width: '25%', align: "left"},
        {key: "jawon",			label: "프로그램종류",  	width: '15%', align: "left"},
        {key: "cm_dirpath", 	label: "프로그램경로",  	width: '40%', align: "left"},
        {key: "cr_lstver", 		label: "버전",  			width: '10%'},
    ]
});

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
		{key: "cr_rsrcname", 	label: "프로그램명",  		width: '10%', align: "left"},
		{key: "jawon",			label: "프로그램종류",  	width: '10%', align: "left"},
		{key: "cm_dirpath", 	label: "프로그램경로",  	width: '30%', align: "left"},
		{key: "cr_rsrcname2", 	label: "맵핑프로그램명",  	width: '10%', align: "left"},
		{key: "jawon2", 		label: "맵핑프로그램종류",  width: '10%', align: "left"},
		{key: "cm_dirpath2", 	label: "맵핑프로그램경로",  	width: '30%', align: "left"},
		]
});
$('[data-ax5select="cboSysCd"]').ax5select({
    options: []
});

$('[data-ax5select="cboRsrc"]').ax5select({
	options: []
});

$('input.checkbox-module').wCheck({theme: 'square-classic blue', selector: 'checkmark', highlightLabel: true});
$('input:radio[name^="radio"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});

$(document).ready(function() {
	$('#optPrg').wRadio('check', true);
	getSysInfo();
	
	$('#cboSysCd').bind('change', function() {
		if(getSelectedIndex('cboSysCd') < 1) {
			return;
		}
		getRsrcList();
		getRelatList();
	});
	
	$('#cboRsrc').bind('change', function() {
		if(getSelectedIndex('cboRsrc') < 1) {
			dialog.alert('프로그램종류를 선택하여 주시기 바랍니다.', function() {});
			return;
		}
		
		$('#btnQryPrg').trigger('click');
		$('#btnQryMod').trigger('click');
	});
	
	// 전체, 프로그램명, 맵핑프로그램명 클릭(라디오버튼)
	$('input:radio[name^="radio"]').bind('click', function() {
		
	});
	// 프로그램목록 미연결건 클릭
	$('#chkNoPrg').bind('click', function() {
		progFilter();
	});
	// 맵핑프로그램목록 미연결건 클릭
	$('#chkNoMod').bind('click', function() {
		modFilter();
	});
	// 프로그램 목록 엔터
	$('#txtPrg').bind('keypress', function(event) {
		if(event.keyCode === 13) {
			$('#btnQryPrg').trigger('click');
		}
	});
	// 맵핑 프로그램 목록 엔터
	$('#txtMod').bind('keypress', function(event) {
		if(event.keyCode === 13) {
			$('#btnQryMod').trigger('click');
		}
	});
	// 맵핑 리스트 엔터
	$('#txtModList').bind('keypress', function(event) {
		if(event.keyCode === 13) {
			$('#btnQry').trigger('click');
		}
	});
	
	// 프로그램 목록 검색
	$('#btnQryPrg').bind('click', function() {
		getProgList();
	});
	// 맵핑 프로그램 검색
	$('#btnQryMod').bind('click', function() {
		getModList();
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
	
	$('#btnQryPrg').trigger('click');
	$('#btnQryMod').trigger('click');
	$('#btnQry').trigger('click');
}

// 등록
function updtRelat() {
	var selInPrg = prgGrid.selectedDataIndexs;
	var selInMod = modGrid.selectedDataIndexs;
	var progList = [];
	if(getSelectedIndex('cboSysCd') < 1) {
		dialog.alert('시스템을 선택하여 주십시오.', function() {});
		return;
	}
	
	if(selInPrg.length === 0 ){
		dialog.alert('선택된 프로그램목로기 없습ㅂ니다. 프로그램을 선택한 후 처리하십시오.', function() {});
		return;
	}
	
	if(selInMod.length === 0 ){
		dialog.alert('선택된 맵핑프로그램목록이 없습니다. 맵핑프로그램을 선택한 후 처리하십시오.', function() {});
		return;
	}
	
	selInPrg.forEach(function(selInP, index) {
		selInMod.forEach(function(selInM, index) {
			var prgItem = prgGrid.list[selInP];
			var modItem = modGrid.list[selInM];
			var tmpItem = new Object();
			tmpItem.cr_itemid 	= prgItem.cr_itemid;
			tmpItem.cr_prcitem 	= modItem.cr_itemid;
			tmpItem.check 		= 'true';
			progList.push(tmpItem);
			tmpItem = null;
			prgItem = null;
			modItem = null;
		});
	});
	
	var data = new Object();
	data = {
		UserId 		: userId,
		SysCd 		: getSelectedVal('cboSysCd').value,
		progList 	: progList,
		requestType	: 'updtRelat'
	}
	ajaxAsync('/webPage/program/ModuleInfo', data, 'json',successUpdtRelat);
}
// 등록 완료
function successUpdtRelat(data) {
	if(data === '0' ) {
		dialog.alert('프로그램과 맵핑프로그램의 연결등록을 완료하였습니다.', function(){});
	} else {
		dialog.alert('프로그램과 맵핑프로그램의  연결등록처리에 실패하였습니다.', function(){});
	}
	
	$('#btnQryPrg').trigger('click');
	$('#btnQryMod').trigger('click');
	$('#btnQry').trigger('click');
}

// 모듈 미연결건 필터
function modFilter() {
	var checkSw = $('#chkNoMod').is(':checked');
	fModGridData = [];
	if(checkSw) {
		modGridData.forEach(function(item, index) {
			if(item.srccnt === '0') {
				fModGridData.push(item);
			}
		});
	} else {
		fModGridData = modGridData;
	}
	
	modGrid.setData(fModGridData);
}

// 프로그램 미연결건 필터
function progFilter() {
	var checkSw = $('#chkNoPrg').is(':checked');
	fPrgGridData = [];
	
	if(checkSw) {
		prgGridData.forEach(function(item, index) {
			if(item.modcnt === '0') {
				fPrgGridData.push(item);
			}
		});
	} else {
		fPrgGridData = prgGridData;
	}
	
	prgGrid.setData(fPrgGridData);
}

// 프로그램 목록 가져오기
function getProgList() {
	
	if(getSelectedIndex('cboSysCd') < 1) {
		dialog.alert('시스템을 선택하여 주십시오.', function() {});
		return;
	}
	
	if(getSelectedIndex('cboRsrc') < 1) {
		dialog.alert('프로그램 종류를 선택하여 주십시오.', function() {});
		return;
	}
	
	var data = new Object();
	data = {
		UserId 		: userId,
		SysCd 		: getSelectedVal('cboSysCd').value,
		ProgId 		: $('#txtPrg').val().trim(),
		subSw 		: false,
		rsrcCd 		: getSelectedVal('cboRsrc').value,
		requestType	: 'getProgList'
	}
	ajaxAsync('/webPage/program/ModuleInfo', data, 'json',successGetProgList);
}

// 모듈 목록 가져오기
function getModList() {
	
	if(getSelectedIndex('cboSysCd') < 1) {
		dialog.alert('시스템을 선택하여 주십시오.', function() {});
		return;
	}
	
	if(getSelectedIndex('cboRsrc') < 1) {
		dialog.alert('프로그램 종류를 선택하여 주십시오.', function() {});
		return;
	}
	
	var data = new Object();
	data = {
		UserId 		: userId,
		SysCd 		: getSelectedVal('cboSysCd').value,
		ProgId 		: $('#txtMod').val().trim(),
		subSw 		: false,
		rsrcCd 		: getSelectedVal('cboRsrc').samersrc,
		requestType	: 'getModList'
	}
	ajaxAsync('/webPage/program/ModuleInfo', data, 'json',successGetModList);
}
// 모듈 목록 가져오기 완료
function successGetModList(data) {
	modGridData = data;
	modFilter();
}

// 프로그램 목록 가져오기 완료
function successGetProgList(data) {
	prgGridData =data;
	progFilter();
}

// 맵핑연결 리스트 가져오기
function getRelatList() {
	
	var GbnCd = $('#optAll').is(':checked') ? 'A'
				: $('#optPrg').is(':checked') ? 'P'
				: $('#optMod').is(':checked') ? 'A' : '';
	
	var data = new Object();
	data = {
		UserId 		: userId,
		SysCd 		: getSelectedVal('cboSysCd').value,
		GbnCd 		: GbnCd,
		ProgId 		: $('#txtModList').val().trim(),
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
	
	if(cboSysCdData.length === 2) {
		$('[data-ax5select="cboRsrc"]').ax5select('setValue', cboRsrcData[1].cm_micode, true);
		$('#cboRsrc').trigger('change');
	}
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
}

