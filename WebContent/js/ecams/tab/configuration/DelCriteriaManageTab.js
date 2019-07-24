/**
 * [환경설정 > 삭제시간관리 TAB] 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-24
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var delCycleGrid		= new ax5.ui.grid();

var delCycleGridData 	= null;
var cboPathDivData		= null;
var cboDelCycleData		= null;


delCycleGrid.setConfig({
    target: $('[data-ax5grid="delCycleGrid"]'),
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
            clickDelCycleGrid(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_codename", 	label: "디렉토리구분",  	width: '20%', align: 'left' },
        {key: "delterm", 		label: "삭제주기",  		width: '80%' },
    ]
});


$('[data-ax5select="cboPathDiv"]').ax5select({
    options: []
});
$('[data-ax5select="cboDelCycle"]').ax5select({
	options: []
});

$(document).ready(function() {
	getCodeInfo();
	getDelCycleList();
	
	// 등록
	$('#btnReq').bind('click', function() {
		insertDelCycle();
	});
	// 폐기
	$('#btnDel').bind('click', function() {
		deleteDelCycle();
	});
});


// 등록
function insertDelCycle() {
	
	var txtDelCycle = $('#txtDelCycle').val().trim();
	
	
	
	if(getSelectedIndex('cboPathDiv') <1 ) {
		dialog.alert('디렉토리구분을 선택하여 주십시오.', function() {});
		return;
	}
	
	if(txtDelCycle.length === 0 ) {
		dialog.alert('삭제주기를 입력하여 주십시오.', function() {});
		return;
	}
	if(txtDelCycle === '0' ) {
		dialog.alert('삭제주기에 0을 제외한 숫자를 입력하여 주십시오.', function() {});
		return;
	}
	
	if(getSelectedIndex('cboDelCycle') <1 ) {
		dialog.alert('삭제주기구분을 선택하여 주십시오.', function() {});
		return;
	}
	var data = new Object();
	data = {
		delgb 		: getSelectedVal('cboPathDiv').value,
		deljugi 	: txtDelCycle,
		jugigb 		: getSelectedVal('cboDelCycle').value,
		requestType	: 'insertDelCycle'
	}
	ajaxAsync('/webPage/administrator/Configuration', data, 'json',successInsertDelCycle);
}

// 등록 완료
function successInsertDelCycle(data) {
	dialog.alert(data.retmsg, function(){});
	getDelCycleList();
}

// 폐기
function deleteDelCycle() {
	if(getSelectedIndex('cboPathDiv') < 1) {
		dialog.alert('디렉토리구분을 선택하여 주십시오.', function() {});
		return;
	}
	
	var data = new Object();
	data = {
		delgb 		: getSelectedVal('cboPathDiv').value,
		requestType	: 'deleteDelCycle'
	}
	ajaxAsync('/webPage/administrator/Configuration', data, 'json',successDeleteDelCycle);
}

// 폐기 완료
function successDeleteDelCycle(data) {
	dialog.alert(data.retmsg, function(){});
	getDelCycleList();
}

// 삭제주기 관리 리스트 클릭
function clickDelCycleGrid(index) {
	var selItem = delCycleGrid.list[index];
	$('#txtDelCycle').val(selItem.cm_delterm);
	
	$('[data-ax5select="cboPathDiv"]').ax5select('setValue', selItem.cm_delcd, true);
	$('[data-ax5select="cboDelCycle"]').ax5select('setValue', selItem.cm_termcd, true);
}

// 삭제주기 관리 리스트 가져오기
function getDelCycleList() {
	var data = new Object();
	data = {
		requestType	: 'getDelCycleList'
	}
	ajaxAsync('/webPage/administrator/Configuration', data, 'json',successGetDelCycleList);
}

// 삭제주기 관리 리스트 가져오기 완료
function successGetDelCycleList(data) {
	delCycleGridData = data;
	delCycleGrid.setData(delCycleGridData);
}

//시간구분가져오기
function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
										new CodeInfo('ECAMSDIR','SEL','N'),
										new CodeInfo('DBTERM','SEL','N'),
										]);
	cboPathDivData 	= codeInfos.ECAMSDIR;
	cboDelCycleData = codeInfos.DBTERM;
	
	$('[data-ax5select="cboPathDiv"]').ax5select({
        options: injectCboDataToArr(cboPathDivData, 'cm_micode' , 'cm_codename')
	});
	
	$('[data-ax5select="cboDelCycle"]').ax5select({
		options: injectCboDataToArr(cboDelCycleData, 'cm_micode' , 'cm_codename')
	});
}
