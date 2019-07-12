/**
 * 시스템상세정보 - 서버별프로그램종류정보 팝업 화면 기능 정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-07
 * 
 */

var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드
var selectedSystem  = window.parent.selectedSystem;
	
var sysCd 	= null;	// 시스템정보 선택 코드
var sysInfo = null;	// 시스템 속성
var dirBase = null; // 기준서버

var svrItemGrid = new ax5.ui.grid();
var itemGrid 	= new ax5.ui.grid();

var svrItemGridData 	= null;
var fSvrItemGridData 	= null;		// 서버종류 콤보에 따라 필터된 그리드 정보
var itemGridData 		= null;

var cboOptions		= null;
var cboSvrItemData	= null;
var ulItemInfoData  = null;

///////////////////  화면 세팅 start////////////////////////////////////////////////
$('[data-ax5select="cboSvrItem"]').ax5select({
    options: []
});

svrItemGrid.setConfig({
    target: $('[data-ax5grid="svrItemGrid"]'),
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
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_codename", 	label: "서버종류",  		width: '20%'},
        {key: "cm_svrname", 	label: "서버명",  		width: '20%'},
        {key: "cm_svrip", 		label: "IP Address",  	width: '50%', align: "left"},
        {key: "cm_portno", 		label: "Port",  		width: '10%'}
    ]
});

itemGrid.setConfig({
    target: $('[data-ax5grid="itemGrid"]'),
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
            clickItemGrid(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "svrcd", 		label: "서버구분",  		width: 140},
        {key: "cm_svrname", label: "서버명",  		width: 140},
        {key: "cm_svrip", 	label: "IP Address",  	width: 200, 	align: "center"},
        {key: "cm_portno", 	label: "Port",  		width: 140, 	align: "center"},
        {key: "rsrccd", 	label: "형상항목",  		width: 140},
        {key: "cm_volpath", label: "홈디렉토리",  		width: 320},
    ]
});

$('input.checkbox-prg').wCheck({theme: 'square-classic red', selector: 'checkmark', highlightLabel: true});

///////////////////  화면 세팅 end////////////////////////////////////////////////


$(document).ready(function(){
	
	sysCd 	= selectedSystem.cm_syscd;
	sysInfo = selectedSystem.cm_sysinfo;
	dirBase = selectedSystem.cm_dirbase;
	
	_promise(50,getSvrList())
		.then(function(){
			return _promise(50,getSvrItemGrid()); 
		})
	getUlItemInfo();
	getItemList();
	
	///////////////////////  버튼 event start////////////////////////////////////////////////
	
	$('#cboSvrItem').bind('change',function() {
		filterSvrItemgrid();
	});
	
	// 등록 이벤트
	$('#btnReqItem').bind('click',function() {
		checkValItem('insert');
	});
	
	// 폐기 이벤트
	$('#btnClsItem').bind('click',function() {
		checkValItem('close');
	});
	
	// 조회 이벤트
	$('#btnQryItem').bind('click',function() {
		getItemList();
	});
	
	// 닫기 이벤트
	$('#btnExitItem').bind('click',function() {
		popClose();
	});
	
	// 서버종류 전체선택 클릭 이벤트
	$('#chkAllSvrItem').bind('change',function() {
		var checkSw = false;
		if($('#chkAllSvrItem').is(':checked')) checkSw = true;
		
		if(checkSw) {
			fSvrItemGridData.forEach(function(item, index) {
				svrItemGrid.select(index);
			});
		} else {
			fSvrItemGridData.forEach(function(item, index) {
				svrItemGrid.clearSelect(index);
			});
		}
	});
	
	// 프로그램종류 전체선택 클릭 이벤트
	$('#chkAllItem').bind('change', function(e) {
		var id = '';
		var checkSw = false;
		if($('#chkAllItem').is(':checked')) checkSw = true;
		
		for(var i=0; i<ulItemInfoData.length; i++) {
			var itemInfo = ulItemInfoData[i];
			id = itemInfo.cm_micode;
			if(checkSw) $('#chkPrg'+id).wCheck('check',true);
			if(!checkSw) $('#chkPrg'+id).wCheck('check',false);
		}
	})
	
	///////////////////////  버튼 event end////////////////////////////////////////////////
	
	
});


///////////////////////  버튼 function start////////////////////////////////////////////////
function popClose(){
	window.parent.parent.sysDetailModal.close();
}

function getSvrList() {
	var svrListData = new Object();
	svrListData = {
		SysCd		: sysCd,
		requestType	: 'getSvrList'
	}
	ajaxAsync('/webPage/tab/sysinfo/SvrPrgServlet', svrListData, 'json',successGetSvrList);
}

function successGetSvrList(data) {
	cboSvrItemData = data;
	cboOptions = [];
	$.each(cboSvrItemData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboSvrItem"]').ax5select({
        options: cboOptions
	});
}

function getSvrItemGrid() {
	var cboSvrData = new Object();
	cboSvrData = {
		SysCd		: sysCd,
		SvrCd		: null,
		requestType	: 'getSvrItemGrid'
	}
	ajaxAsync('/webPage/tab/sysinfo/SvrPrgServlet', cboSvrData, 'json',successGetSvrItemGrid);
}

function successGetSvrItemGrid(data) {
	svrItemGridData = data;
	filterSvrItemgrid();
}

function filterSvrItemgrid() {
	fSvrItemGridData = null;
	svrItemGridData.forEach(function(item, index) {
		
		if(getSelectedVal('cboSvrItem').value === item.cm_micode) {
			fSvrItemGridData = [];
			fSvrItemGridData.push(item);
		}
	})
	svrItemGrid.setData(fSvrItemGridData);
}

function getUlItemInfo() {
	var ulItemData = new Object();
	ulItemData = {
		SysCd		: sysCd,
		requestType	: 'getUlItemInfo'
	}
	ajaxAsync('/webPage/tab/sysinfo/SvrPrgServlet', ulItemData, 'json',successGetUlItemInfo);
}

function successGetUlItemInfo(data) {
	ulItemInfoData = data;
	
	$('#ulItemInfo').empty();
	var liStr 	= null;
	var addId 	= null;
	var value 	= null;
	for(var i=0; i< ulItemInfoData.length; i++) {
		var item = ulItemInfoData[i];
		value = item.cm_codename;
		addId = item.cm_micode;
		liStr  = '';
		liStr += '<li class="list-group-item dib width-50" style="min-width: 50px;">';
		liStr += '	<input type="checkbox" class="checkbox-prginfo" id="chkPrg'+addId+'" data-label="'+value+'"  value="'+addId+'" />';
		liStr += '</li>';
		$('#ulItemInfo').append(liStr);
	}
	
	$('input.checkbox-prginfo').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
}

function getItemList() {
	var itemData = new Object();
	itemData = {
		SysCd		: sysCd,
		requestType	: 'getItemList'
	}
	ajaxAsync('/webPage/tab/sysinfo/SvrPrgServlet', itemData, 'json',successGetItemList);
}

function successGetItemList(data) {
	itemGridData = data;
	itemGrid.setData(itemGridData);
}

function clickItemGrid(selIndex) {
	var item = itemGrid.list[selIndex];
	$('#chkAllItem').wCheck('check',false);
	$('#chkAllItem').trigger('change');
	
	$('[data-ax5select="cboSvrItem"]').ax5select('setValue',item.cm_svrcd,true);
	
	$('#chkAllSvrItem').wCheck('check',false);
	$('#chkAllSvrItem').trigger('change');
	
	$('#cboSvrItem').trigger('change');
	fSvrItemGridData.forEach(function(svrItem, index) {
		if(svrItem.cm_micode === item.cm_svrcd
				&& svrItem.cm_seqno === item.cm_seqno) 
			svrItemGrid.select(index);
	});
	
	ulItemInfoData.forEach(function(ulItem, index) {
		if(ulItem.cm_micode === item.cm_rsrccd) 
			$('#chkPrg'+ulItem.cm_micode).wCheck('check',true);
	})
	
	$('#txtVolpath').val(item.cm_volpath);
	
}

function checkValItem(kinds) {
	var requestType	= kinds === 'insert' ? 'insertItem': 'closeItem';
	var svrItemIn 	= svrItemGrid.selectedDataIndexs;
	var prgSw		= false;
	var cm_volpath	= $('#txtVolpath').val().trim();
	var seqs		= '';
	var rsrcCds		= '';
	if(svrItemIn.length < 1) {
		dialog('서버를 선택하여 주시기 바랍니다.', function(){});
		return;
	}
	
	ulItemInfoData.forEach(function(ulItem, index) {
		if($('#chkPrg'+ulItem.cm_micode).is(':checked')) prgSw = true;
	});
	
	if(!prgSw) {
		dialog('프로그램종류를 선택하여 주시기 바랍니다.', function(){});
		return;
	}
	
	if(cm_volpath.length < 1 && kinds === 'insert') {
		dialog('홈디렉토리를 입력하여 주시기 바랍니다.', function(){});
		return;
	}
	
	svrItemIn.forEach(function(svrIndex, index) {
		var item = svrItemGrid.list[svrIndex];
		if(seqs.length > 0 ) seqs += ',';
		else seqs += item.cm_seqno;
	})
	
	ulItemInfoData.forEach(function(ulItem, index) {
		if($('#chkPrg'+ulItem.cm_micode).is(':checked')) {
			if(rsrcCds.length > 0 ) rsrcCds += ',';
			else rsrcCds += ulItem.cm_micode;
		}
	});
	
	var tmpObj = new Object();
	tmpObj.cm_syscd = sysCd;
	
	tmpObj.cm_svrcd 	= getSelectedVal('cboSvrItem').value;
	tmpObj.cm_seqno 	= seqs;
	tmpObj.cm_rsrccd 	= rsrcCds;
	tmpObj.cm_volpath 	= cm_volpath;
	tmpObj.userid = userId;
	
	var insertItemData = new Object();
	insertItemData = {
		etcData		: tmpObj,
		requestType	: requestType
	}
	ajaxAsync('/webPage/tab/sysinfo/SvrPrgServlet', insertItemData, 'json', 
				kinds === 'insert'?successInsertItem : successClosetItem);
}

function successInsertItem(data) {
	dialog.alert('서버별프로그램연결정보 등록처리를 완료하였습니다.', function(){
		$('#btnQryItem').trigger('click');
	});
}

function successClosetItem(data) {
	dialog.alert('서버별프로그램연결정보 폐기처리를 완료하였습니다.', function(){
		$('#btnQryItem').trigger('click');
	});
}
/////////////////////  버튼 function end////////////////////////////////////////////////

