/**
 * 파일대사결과조회 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-07-03
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var fileGrid		= new ax5.ui.grid();

var fileGridData 	= [];
var cboDiffSayuData	= [];

fileGrid.setConfig({
    target: $('[data-ax5grid="fileGrid"]'),
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
        	this.self.clearSelect();
            this.self.select(this.dindex);
            clickFileGrid(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {
    		if(this.item.cd_syscd === '999'){
    			return "fontStyle-ing";
    			
     		} 
    		if (this.item.cm_micode === 'FE' || this.item.cm_micode === 'FK' || this.item.cm_micode === 'FZ'){
    			return "fontStyle-cncl";
     		}
    	},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "owner_nm", 	 	label: "담당자",  		width: '5%'},
        {key: "sysnm",	 		label: "시스템",  		width: '10%', align: "left"},
        {key: "cd_rsrcname", 	label: "프로그램명",  		width: '10%', align: "left"},
        {key: "cm_dirpath", 	label: "프로그램경로",  	width: '20%', align: "left"},
        {key: "cd_sayu",  		label: "불일치사유",  		width: '10%', align: "left"},
        {key: "cm_codename", 	label: "대사결과내용",  	width: '8%',  align: "left"},
        {key: "cd_svrip", 		label: "서버주소",  		width: '8%',  align: "left"},
        {key: "cd_svrname",  	label: "서버명",  		width: '5%',  align: "left"},
        {key: "cd_portno",  	label: "서버Port",  		width: '6%',  align: "left"},
        {key: "cd_diffdt",  	label: "불일치일자",  		width: '6%'},
        {key: "cd_errclsdt",  	label: "정리일자",  		width: '6%'},
        {key: "cd_errdaycnt",  	label: "불일치연속일수",  	width: '6%'},
    ]
});

$('#dateSt').val(getDate('DATE',-1));
$('#dateEd').val(getDate('DATE',0));

picker.bind({
    target: $('[data-ax5picker="basic"]'),
    direction: "top",
    content: {
        width: 220,
        margin: 10,
        type: 'date',
        config: {
            control: {
                left: '<i class="fa fa-chevron-left"></i>',
                yearTmpl: '%s',
                monthTmpl: '%s',
                right: '<i class="fa fa-chevron-right"></i>'
            },
            dateFormat: 'yyyy/MM/dd',
            lang: {
                yearTmpl: "%s년",
                months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                dayTmpl: "%s"
            }
        },
        formatter: {
            pattern: 'date'
        }
    },
    btns: {
        today: {
            label: "Today", onClick: function () {
                var today = new Date();
                this.self
                        .setContentValue(this.item.id, 0, ax5.util.date(today, {"return": "yyyy/MM/dd"}))
                        .setContentValue(this.item.id, 1, ax5.util.date(today, {"return": "yyyy/MM/dd"}))
                        .close();
            }
        },
        thisMonth: {
            label: "This Month", onClick: function () {
                var today = new Date();
                this.self
                        .setContentValue(this.item.id, 0, ax5.util.date(today, {"return": "yyyy/MM/01"}))
                        .setContentValue(this.item.id, 1, ax5.util.date(today, {"return": "yyyy/MM"})
                                + '/'
                                + ax5.util.daysOfMonth(today.getFullYear(), today.getMonth()))
                        .close();
            }
        },
        ok: {label: "Close", theme: "default"}
    }
});

$('[data-ax5select="cboDiffSayu"]').ax5select({
    options: []
});


$('input.checkbox-file').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

$(document).ready(function() {
	
	if(!adminYN) {
		$('#btnDel').prop('disabled', true);
	}
	
	$('#txtErr').val('1');
	$('#txtDiffSayu').css('display','none');
	$('#txtSys').prop('disabled', true);
	$('#txtPrg').prop('disabled', true);
	$('#txtIp').prop('disabled', true);
	$('#txtErrDate').prop('disabled', true);
	$('#txtDir').prop('disabled', true);
	$('#txtSys').prop('disabled', true);
	
	getCodeInfo();
	
	// 특정일 조회 클릭
	$('#chkDate').bind('click', function() {
		if($('#chkDate').is(':checked')) {
			$('#dateEd').prop('disabled', true);
			console.log($('#dateEd').siblings('.btn_calendar').css('background-color','rgb(235, 235, 228)'));
		} else {
			$('#dateEd').prop('disabled', false);
			console.log($('#dateEd').siblings('.btn_calendar').css('background-color','#fff'));
		}
	});
	// 불일치 발생사유 콤보 변경
	$('#cboDiffSayu').bind('change', function() {
		if(getSelectedVal('cboDiffSayu').value === '10') {
			$('#txtDiffSayu').css('display','');
		} else {
			$('#txtDiffSayu').css('display','none');
		}
	});
	
	// 조회 클릭
	$('#btnQry').bind('click' , function() {
		getMismatchList();
	});
	// 삭제 클릭
	$('#btnDel').bind('click' , function() {
		delMismatchList();
	});
	// 등록 클릭
	$('#btnReq').bind('click' , function() {
		insertMismatch();
	});
	// 엑셀저장
	$('#btnExcel').bind('click', function() {
		fileGrid.exportExcel('파일대사불일치현황.xls');
	});
});

// 불일치 삭제
function delMismatchList() {
	var selIn 		= fileGrid.selectedDataIndexs;
	var selItem 	= null;
	var dataList 	= [];
	var dataObj 	= null;
	
	if(selIn.length === 0 ) {
		dialog.alert('삭제할 대사결과를 선택하여 주십시오.', function() {});
		return;
	}
	
	selIn.forEach(function(selIndex, index) {
		selItem = fileGrid.list[selIndex];
		dataObj = new Object();
		dataObj = selItem;
		dataList.push(dataObj);
		dataObj = null;
	});
	
	var data = new Object();
	data = {
		dataList 	: dataList,
		requestType	: 'delMismatchList'
	}
	ajaxAsync('/webPage/report/FileMismatchReport', data, 'json',successDelMismatchList);
}

// 불일치 삭제 완료
function successDelMismatchList(data) {
	if(data === 'OK') {
		dialog.alert('정상적으로 삭제 되었습니다.', function(){});
	} else {
		dialog.alert('삭제중 오류가 발생하였습니다.', function(){});
	}
	$('#btnQry').trigger('click');
}


// 불일치 등록
function insertMismatch() {
	var dataList 	= [];
	var dataObj 	= null;
	var selIn 		= fileGrid.selectedDataIndexs;
	var selItem 	= null;
	var txtDiffSayu = $('#txtDiffSayu').val().trim();
	
	if(selIn.length === 0 ) {
		dialog.alert('파일을 선택해주세요', function() {});
		return;
	}
	
	if(getSelectedVal('cboDiffSayu').value === '10') {
		if( txtDiffSayu.length === 0 ) {
			dialog.alert('사유를 입력하여 주십시오.', function() {});
			return;
		}
	} else {
		txtDiffSayu = getSelectedVal('cboDiffSayu').cm_codename;
	}
	
	selIn.forEach(function(selIndex, index) {
		selItem = fileGrid.list[selIndex];
		dataObj = new Object();
		dataObj = selItem;
		dataObj.cd_sayu = txtDiffSayu;
		dataList.push(dataObj);
		dataObj = null;
	});
	
	var data = new Object();
	data = {
		dataList 	: dataList,
		requestType	: 'insertMismatch'
	}
	ajaxAsync('/webPage/report/FileMismatchReport', data, 'json',successInsertMismatch);
}

// 불일치 등록 완료
function successInsertMismatch() {
	dialog.alert('사유등록되었습니다.', function() {
		$('#btnQry').trigger('click');
	});
}

// 불일치현황 리스트 가져오기
function getMismatchList() {
	var chk = $('#chkDate').is(':checked') ? '1' : '0';
	var stDate = replaceAllString($('#dateSt').val().trim(),'/','');
	var edDate = replaceAllString($('#dateEd').val().trim(),'/','');
	var txtErr = $('#txtErr').val().trim();
	if(stDate > edDate) {
		dialog.alert('조회기간을 정확하게 선택하여 주세요.', function() {});
		return;
	}
	
	if(txtErr.length === 0 ) {
		dialog.alert('불일치 연속일수를 입력해주세요.', function() {});
		return;
	}
	
	var data = new Object();
	data = {
		chk 		: chk,
		strstd 		: stDate,
		stredd 		: edDate,
		errday 		: txtErr,
		userid 		: userId,
		requestType	: 'getMismatchList'
	}
	ajaxAsync('/webPage/report/FileMismatchReport', data, 'json',successGetMismatchList);
}

// 불일치현황 리스트 가져오기 완료
function successGetMismatchList(data) {
	fileGridData = data;
	fileGrid.setData(fileGridData);
}

// 불일치 발생사유 가져오기
function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('DIFFSAYU','ALL','N'),
		]);
	cboDiffSayuData = codeInfos.DIFFSAYU;
	$('[data-ax5select="cboDiffSayu"]').ax5select({
		options: injectCboDataToArr(cboDiffSayuData, 'cm_micode' , 'cm_codename')
	});
}

//파일대사 불일치 현황 그리드 클릭
function clickFileGrid(index) {
	var selItem = fileGrid.list[index];
	
	$('#txtSys').val(selItem.sysnm);
	$('#txtPrg').val(selItem.cd_rsrcname);
	$('#txtIp').val(selItem.cd_svrip + '[' + selItem.cd_portno + ']');
	$('#txtErrDate').val(selItem.cd_diffdt);
	$('#txtDir').val(selItem.cm_dirpath);
	$('#txtDiffSayu').val(selItem.cd_sayu);
}

