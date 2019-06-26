/**
 * 디렉토리등록 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-26
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

var dirGrid	= new ax5.ui.grid();

var dirGridData		= [];
var cboSysCdData	= [];
var ulPrgInfoData	= [];
var ulJobInfoData	= [];
var delIndex		= -1;

dirGrid.setConfig({
    target: $('[data-ax5grid="dirGrid"]'),
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
            clickDirGrid(this.dindex);
        },
        onDBLClick: function () {
        	dblClickDirGrid(this.dindex);
        },
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_dirpath", label: "디렉토리",  		width: '50%'},
        {key: "jobNames",	label: "업무",  			width: '20%'},
        {key: "jawonNames", label: "프로그램종류",  	width: '30%'},
    ]
});

$('[data-ax5select="cboSysCd"]').ax5select({
    options: []
});
$('input.checkbox-dir').wCheck({theme: 'square-classic red', selector: 'checkmark', highlightLabel: true});

$(document).ready(function() {
	getSysInfo();
	
	
	// 시스템 콤보 변경
	$('#cboSysCd').bind('change', function() {
		getBaseInfo();
	});
	// 프로그램전체선택
	$('#chkAllPrg').bind('click', function() {
		var checkSw = $('#chkAllPrg').is(':checked');
		checkAllPrg(checkSw);
	});
	// 업무전체선택
	$('#chkAllJob').bind('click', function() {
		var checkSw = $('#chkAllJob').is(':checked');
		checkAllJob(checkSw);
	});
	// 추가
	$('#btnAdd').bind('click', function() {
		addPath();
	});
	// 조회
	$('#btnQry').bind('click', function() {
		getPathList();
	});
	// 등록
	$('#btnReq').bind('click', function() {
		savePath();
	});
});

// 등록
function savePath() {
	var selIn = dirGrid.selectedDataIndexs;
	var saveList = [];
	if(selIn.length === 0 ) {
		dialog.alert('등록할 디렉토리를 선택하여 주십시오.', function(){});
		return;
	}
	
	selIn.forEach(function(sel, index) {
		saveList.push(dirGrid.list[sel]);
	});
	
	var data  = new Object();
	data = {
		sysCD		: getSelectedVal('cboSysCd').value,
		UserId		: userId,
		saveList	: saveList,
		requestType	: 'savePath'
	}
	ajaxAsync('/webPage/administrator/DirectoryReg', data, 'json',successSavePath);
}
// 등록 완료
function successSavePath(data) {
	dialog.alert(data.retMsg, function(){});
}

// 디렉토리 추가
function addPath() {
	var jobNames	= '';
	var jobLs		= '';
	var jawonNames 	= '';
	var jawonLs 	= '';
	var selIndexs 	= dirGrid.selectedDataIndexs;
	var selItem		= null;
	var txtPath		= $('#txtPath').val().trim();
	var findSw		= false;
	var gridSelIn	= -1;
	var addItem		= null;
	
	// 선택된 업무 가져오기
	ulJobInfoData.forEach(function(item, index) {
		if($('#chkJob'+item.cm_jobcd).is(':checked')) {
			if(jobNames.length === 0 ) {
				jobNames += item.cm_jobname;
				jobLs += item.cm_jobcd;
			} else {
				jobNames += ','+item.cm_jobname;
				jobLs += ','+item.cm_jobcd;
			}
		}
	});
	// 선택된 프로그램 종류 가져오기
	ulPrgInfoData.forEach(function(item, index) {
		if($('#chkPrg'+item.cm_micode).is(':checked')) {
			if(jawonNames.length === 0 ) {
				jawonNames += item.cm_codename;
				jawonLs += item.cm_micode;
			} else {
				jawonNames += ','+item.cm_codename;
				jawonLs += ','+item.cm_micode;
			}
		}
	});
	// 선택된 그리드에 값 넣어주기
	if(txtPath.length === 0) {
		selIndexs.forEach(function(selIn, index) {
			selItem = dirGrid.list[selIn];
			selItem.jawonNames 	= jawonNames;
			selItem.jawonLs 	= jawonLs;
			selItem.jobNames 	= jobNames;
			selItem.jobLs 		= jobLs;
			dirGridData.splice(selIn, 1, selItem);
		});
	} else {
		// 기존 그리드 정보에서 directory 같은 것 있다면 바꿔주기
		for(var i=0; i<dirGridData.length; i++) {
			addItem = dirGridData[i];
			if(addItem.cm_dirpath === txtPath) {
				findSw 		= true;
				gridSelIn 	= i;
				addItem.jawonNames = jawonNames;
				addItem.jawonLs 	= jawonLs;
				addItem.jobNames 	= jobNames;
				addItem.jobLs 		= jobLs;
				dirGridData.splice(i, 1, addItem);
				break;
			}
		}
		// 새로운 directory일시 끝에 추가
		if(!findSw) {
			addItem = new Object();
			addItem.jawonNames  = jawonNames;
			addItem.jawonLs 	= jawonLs;
			addItem.jobNames 	= jobNames;
			addItem.jobLs 		= jobLs;
			addItem.cm_dirpath 	= txtPath;
			addItem.cm_dsncd 	= '';
			dirGridData.push(addItem);
		}
	}
	
	dirGrid.setData(dirGridData);
	
	if(txtPath.length !== 0 && !findSw) {
		dirGrid.select(dirGridData.length-1);
		dirGrid.focus('END');
	} else {
		dirGrid.select(gridSelIn,{selected: true});
	}
}

// 리스트 더블 클릭(삭제)
function dblClickDirGrid(index) {
	var selItem = dirGrid.list[index];
	confirmDialog.confirm({
		msg: '['+ selItem.cm_dirpath +'] 를 삭제할까요?',
	}, function(){
		if(this.key === 'ok') {
			var data  = new Object();
			data = {
				sysCD		: getSelectedVal('cboSysCd').value,
				spath		: selItem.cm_dirpath,
				dsnCD		: selItem.cm_dsncd,
				requestType	: 'removePath'
			}
			delIndex = index;
			ajaxAsync('/webPage/administrator/DirectoryReg', data, 'json',successRemovePath);
		}
	});
}
// 삭제 완료
function successRemovePath(data) {
	dialog.alert(data.retMsg, function() {});
	dirGridData.splice(delIndex,1);
	dirGrid.setData(dirGridData);
	delIndex = -1;
}

// 프로그램 전체선택
function checkAllPrg(checkSw) {
	var addId = null;
	ulPrgInfoData.forEach(function(item, index) {
		addId = item.cm_micode;
		if(checkSw) {
			$('#chkPrg'+addId).wCheck('check', true);
		} else {
			$('#chkPrg'+addId).wCheck('check', false);
		}
	});
}
// 업무 전체선택
function checkAllJob(checkSw) {
	var addId = null;
	ulJobInfoData.forEach(function(item, index) {
		addId = item.cm_jobcd;
		if(checkSw) {
			$('#chkJob'+addId).wCheck('check', true);
		} else {
			$('#chkJob'+addId).wCheck('check', false);
		}
	});
}

// 디렉토리 리스트 클릭
function clickDirGrid(index) {
	var selItem = dirGrid.list[index];
	var jobArr 	= selItem.jobLs.split(',');
	var prgArr 	= selItem.jawonLs.split(',');
	var addId 	= null;
	
	$('#txtPath').val(selItem.cm_dirpath);
	checkAllPrg(false);
	checkAllJob(false);
	ulJobInfoData.forEach(function(item, index) {
		jobArr.forEach(function(arrItem, indexJ) {
			if(item.cm_jobcd === arrItem) {
				$('#chkJob'+arrItem).wCheck('check', true);
				$('#chkJob'+arrItem).focus();
			}
		});
	});
	ulPrgInfoData.forEach(function(item, index) {
		prgArr.forEach(function(arrItem, indexP) {
			if(item.cm_micode === arrItem) {
				$('#chkPrg'+arrItem).wCheck('check', true); 
				$('#chkPrg'+arrItem).focus();
			}
		});
	});
}

// 디렉토리 리스트 가져오기
function getPathList() {
	var data = new Object();
	data = {
		sysCD 		: getSelectedVal('cboSysCd').value,
		spath 		: $('#txtPath').val().trim(),
		requestType	: 'getPathList'
	}
	ajaxAsync('/webPage/administrator/DirectoryReg', data, 'json',successGetPathList);
}
// 디렉토리 리스트 가져오기 완료
function successGetPathList(data) {
	dirGridData = data;
	dirGrid.setData(dirGridData);
}

// 디렉토리, 프로그램, 업무 정보 가져오기
function getBaseInfo() {
	var data = new Object();
	data = {
		sysCD 		: getSelectedVal('cboSysCd').value,
		baseCD 		: getSelectedVal('cboSysCd').cm_dirbase,
		requestType	: 'getBaseInfo'
	}
	ajaxAsync('/webPage/administrator/DirectoryReg', data, 'json',successGetBaseInfo);
}

// 디렉토리, 프로그램, 업무 정보 가져오기 완료
function successGetBaseInfo(data) {
	if(data.path[0].cm_volpath.length > 0 ) {
		$('#txtPath').val(data.path[0].cm_volpath);
	} else {
		$('#txtPath').val('');
	}
	ulJobInfoData = data.job;
	ulPrgInfoData = data.jawon;
	
	makeJobInfoUlList();
	makePrgInfoUlList();
}

// 시스템정보 가져오기
function getSysInfo() {
	var data = new Object();
	data = {
		UserId 		: '',
		SecuYn 		: 'N',
		SelMsg 		: 'N',
		CloseYn 	: 'N',
		ReqCd 		: '',
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/administrator/DirectoryReg', data, 'json',successGetSysInfo);
}
// 시스템정보 가져오기 완료
function successGetSysInfo(data) {
	cboSysCdData = data;
	$('[data-ax5select="cboSysCd"]').ax5select({
      options: injectCboDataToArr(cboSysCdData, 'cm_syscd' , 'cm_sysmsg')
	});
	
	for(var i=0; i<cboSysCdData.length; i++) {
		if(cboSysCdData[i].setyn === 'Y') {
			$('[data-ax5select="cboSysCd"]').ax5select('setValue', cboSysCdData[i].cm_syscd, true);
			break;
		}
	}
	$('#cboSysCd').trigger('change');
}

// 업무 리스트 만들기
function makeJobInfoUlList() {
	$('#ulJobInfo').empty();
	var liStr = null;
	var addId = null;
	ulJobInfoData.forEach(function(jobItem, sysInfoIndex) {
		addId = jobItem.cm_jobcd;
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '	<input type="checkbox" class="checkbox-job" id="chkJob'+addId+'" data-label="'+jobItem.cm_jobname+'"  value="'+addId+'" />';
		liStr += '</li>';
		$('#ulJobInfo').append(liStr);
	});
	
	$('input.checkbox-job').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

}

// 프로그램 리스트 만들기
function makePrgInfoUlList() {
	$('#ulPrgInfo').empty();
	var liStr = null;
	var addId = null;
	ulPrgInfoData.forEach(function(prgItem, sysInfoIndex) {
		addId = prgItem.cm_micode;
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '	<input type="checkbox" class="checkbox-prg" id="chkPrg'+addId+'" data-label="'+prgItem.cm_codename+'"  value="'+addId+'" />';
		liStr += '</li>';
		$('#ulPrgInfo').append(liStr);
	});
	
	$('input.checkbox-prg').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

}