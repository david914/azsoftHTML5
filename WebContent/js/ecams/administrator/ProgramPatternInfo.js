/**
 * 프로그램유형정보 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-07-02
 * 
 */

/*var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드
*/

var userName 	= '관리자';
var userId 		= 'MASTER';
var adminYN 	= 'Y';

var prgGrid	= new ax5.ui.grid();
var cmdGrid	= new ax5.ui.grid();

var prgGridData = [];
var cmdGridData = [];
var scriptData	= [];
var fScriptData = [];
var chkData		= [];

var cboSysData	= [];

prgGrid.setConfig({
    target: $('[data-ax5grid="prgGrid"]'),
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
            clickPrgGrid(this.dindex);
        },
        onDBLClick: function () {},
        trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_codename", 	label: "프로그램유형",  width: '5%', align: "left"},
        {key: undefined,	label: "테스트적용", columns: [
	            {key: "devsvr1", 	label: "빌드서버", 	align: "left"},
	            {key: "build1", 	label: "컴파일", 		align: "left"},
	            {key: "module", 	label: "바이너리", 	align: "left"},
	            {key: "deploy1", 	label: "배포서버", 	align: "left"},
	            {key: "script1", 	label: "적용쉘", 		align: "left"},
	            {key: "etc1", 		label: "비고(바이너리생성시준)", width: '25%', align: "left"},
            ]
        },
        {key: undefined,	label: "운영적용", columns: [
	            {key: "realsvr1", 	label: "빌드서버", 	align: "left"},
	            {key: "build2", 	label: "컴파일", 		align: "left"},
	            {key: "deploy2", 	label: "배포서버", 	align: "left"},
	            {key: "script2", 	label: "적용쉘", 		align: "left"},
	            {key: "etc2", 		label: "비고",  width: '20%', align: "left"},
	        ]
	    },
    ]
});

cmdGrid.setConfig({
    target: $('[data-ax5grid="cmdGrid"]'),
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
        trStyleClass: function () {
        	if(this.item.errsw === 'Y'){
    			return "fontStyle-cncl";
    		}
    	},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "gbncd", 		label: "구분",  		width: '8%', align: "left"},
        {key: "rsrcname",	label: "프로그램유형",  width: '8%', align: "left"},
        {key: "cm_bldcd", 	label: "유형번호",  	width: '8%'},
        {key: "cm_seq", 	label: "순서",  		width: '8%'},
        {key: "cm_cmdname", label: "수행명령",  	width: '68%', align: "left"},
        
    ]
});

$('[data-ax5select="cboSys"]').ax5select({
    options: []
});

$('input:radio[name^="radio"]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});

$(document).ready(function() {
	$('#optQry').wRadio('check', true);
	getSysInfo();
	
	$('input:radio[name^="radio"]').click('bind', function() {
		if(getSelectedIndex('cboSys') < 1) {
			return;
		} else {
			
			if($('#optChk').is(':checked')) {
				if(cmdGrid.columns.length === 5) {
					cmdGrid.removeColumn(4);
					cmdGrid.removeColumn(3);
					cmdGrid.removeColumn(2);
					cmdGrid.removeColumn(0);
					cmdGrid.addColumn({key: "errmsg", 	label: "체크결과",  	width: '92%', align: "left"});
					getProgInfoChk();
				}
			} else {
				prgGrid.clearSelect();
				if(cmdGrid.columns.length === 2) {
					cmdGrid.removeColumn(1);
					cmdGrid.addColumn({key: "gbncd", 		label: "구분",  		width: '8%', align: "left"}, 0);
			        cmdGrid.addColumn({key: "cm_bldcd", 	label: "유형번호",  	width: '8%'});
			        cmdGrid.addColumn({key: "cm_seq", 		label: "순서",  		width: '8%'});
			        cmdGrid.addColumn({key: "cm_cmdname", 	label: "수행명령",  	width: '68%', align: "left"});
			        getRsrcScript();
				}
			}
		}
	});
	
	// 시스템 콤보 변경
	$('#cboSys').bind('change', function() {
		if(getSelectedIndex('cboSys') < 1) {
			return;
		}
		getProgInfo();
		if($('#optChk').is(':checked')) {
			getProgInfoChk();
		} else {
			getRsrcScript();
		}
	});
});

// 프로그램 유형정보 그리드 클릭
function clickPrgGrid(index) {
	var selItem = prgGrid.list[index];
	fScriptData = [];

	scriptData.forEach(function(item, index) {
		if(selItem.cm_rsrccd === item.cm_rsrccd || selItem.cm_samersrccd === item.cm_rsrccd) {
			if(selItem.build1 === 'Y' && item.cm_qrycd === '03' && item.cm_prcsys === 'SYSCB') {
				fScriptData.push(item);
			}
			if (selItem.script1 == "Y" && item.cm_qrycd == "03" && item.cm_prcsys == "SYSED") {
				fScriptData.push(item);
			}
			if (selItem.build2 == "Y" && item.cm_qrycd == "04" && item.cm_prcsys == "SYSCB") {
				fScriptData.push(item);
			}
			if (selItem.script2 == "Y" && item.cm_qrycd == "04" && item.cm_prcsys == "SYSED") {
				fScriptData.push(item);
			}
		}
	});
	
	filterCmdGrid();
}

// 하위 그리드 필터
function filterCmdGrid() {
	if($('#optChk').is(':checked')) {
		cmdGrid.setData(chkData);
	} else {
		if(prgGrid.selectedDataIndexs.length === 0 ) {
			cmdGrid.setData(scriptData);
		} else {
			cmdGrid.setData(fScriptData);
		}
	}
}

// 프로그램 유형정보 가져오기
function getProgInfo() {
	var data = new Object();
	data = {
		sysCd 		: getSelectedVal('cboSys').value,
		requestType	: 'getProgInfo'
	}
	ajaxAsync('/webPage/administrator/ProgramPatternInfo', data, 'json',successGetProgInfo);
}
// 프로그램 유형정보 가져오기 완료
function successGetProgInfo(data) {
	prgGridData = data;
	prgGrid.setData(prgGridData);
}

// 스크립트 리스트 가져오기
function getRsrcScript() {
	var etcData = new Object();
	etcData.cm_syscd = getSelectedVal('cboSys').value;
	var data = new Object();
	data = {
		etcData 	: etcData,
		requestType	: 'getRsrcScript'
	}
	ajaxAsync('/webPage/administrator/ProgramPatternInfo', data, 'json',successGetRsrcScript);
}
// 스크립트 리스트 가져오기 완료
function successGetRsrcScript(data) {
	scriptData = data;
	filterCmdGrid();
}

// 점검 리스트 가져오기
function getProgInfoChk() {
	var data = new Object();
	data = {
		sysCd 		: getSelectedVal('cboSys').value,
		requestType	: 'getProgInfoChk'
	}
	ajaxAsync('/webPage/administrator/ProgramPatternInfo', data, 'json',successGetProgInfoChk);
}
// 점검 리스트 가져오기 완료
function successGetProgInfoChk(data) {
	chkData = data;
	filterCmdGrid();
}

// 시스템 콤보 가져오기
function getSysInfo() {
	var data = new Object();
	data = {
		UserId 		: userId,
		SecuYn 		: 'Y',
		SelMsg 		: 'SEL',
		CloseYn 	: 'N',
		ReqCd 		: 'D12',
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/administrator/ProgramPatternInfo', data, 'json',successGetSysInfo);
}

// 시스템 콤보 가져오기 완료
function successGetSysInfo(data) {
	cboSysData = data;
	
	$('[data-ax5select="cboSys"]').ax5select({
      options: injectCboDataToArr(cboSysData, 'cm_syscd' , 'cm_sysmsg')
	});
}












