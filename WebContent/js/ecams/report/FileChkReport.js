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
var fileHisModal 	= new ax5.ui.modal();
var fileSumModal 	= new ax5.ui.modal();

var fileGridData 	= [];
var fFileGridData	= [];
var cboDiffData		= [];

var stDate	= '';
var edDate	= '';
var detail	= '';

var DaesaResult = null;
var fileSumSelItem = null;

fileGrid.setConfig({
    target: $('[data-ax5grid="fileGrid"]'),
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
            clickFileGrid(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {
    		/*
				D1	CMD0026 Update실패
				FA	접근권한없음
				FC	체크섬오류
				FD	파일Date불일치
				FE	형상관리미존재
				FK	운영서버미존재
				FL	Last버전파일생성실패
				FM	MD5불일치
				FS	파일Size불일치
				FX	파일Size및파일Data불일치
				FZ	형상관리폐기자원
				RF	대상파일전송실패
				RG	결과파일수신실패
				RP	결과파일분석실패
				RR	ecams_fileinf실행실패
				RT	Temp디렉토리생성실패			
			*/
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
    contextMenu: {
        iconWidth: 20,
        acceleratorWidth: 100,
        itemClickAndClose: false,
        icons: {
            'arrow': '<i class="fa fa-caret-right"></i>'
        },
        items: [
            {type: 1, label: "소스비교"},
        ],
        popupFilter: function (item, param) {
        	
        	fileGrid.clearSelect();
        	fileGrid.select(Number(param.dindex));
        	
        	var selItem = fileGrid.list[param.dindex];
        	
        	// 소스비교 컨텍스트 메뉴 활성화
        	if(selItem.binyn === "N" 
        		&& selItem.cm_micode !== "FO" 
        			&& selItem.cm_micode !== "FK" 
        				&& selItem.cm_micode !== "FL" 
        					&& selItem.cm_micode !== "FZ"){
        		return true;
        	} else {
        		return false;
        	}
        },
        onClick: function (item, param) {
        	var selItem = fileGrid.list[param.dindex];
        	
        	if(selItem.cm_micode == "FD" || selItem.cm_micode == "FM" || selItem.cm_micode == "FS" || selItem.cm_micode == "FX"){
        		// 소스비교 창 켜주기
        	}
        	fileGrid.contextMenu.close();
        }
    },
    columns: [
        {key: "cm_sysmsg", 	 	label: "시스템명",  		width: '10%'},
        {key: "cd_dirpath",	 	label: "디렉토리",  		width: '15%', align: "left"},
        {key: "cd_rsrcname", 	label: "파일명",  		width: '10%', align: "left"},
        {key: "cm_username", 	label: "최종변경인",  		width: '6%', align: "left"},
        {key: "svrname",  		label: "서버",  			width: '8%'},
        {key: "cd_portno", 		label: "Port",  		width: '8%'},
        {key: "cm_codename", 	label: "일치여부",  		width: '6%', align: "left"},
        {key: "cd_ecamssize",  	label: "형상관리Size",  	width: '6%', align: "right"},
        {key: "cd_ecamsdate",  	label: "형상관리date",  	width: '6%'},
        {key: "cd_ecamsmd5",  	label: "형상관리md5",  	width: '6%'},
        {key: "cd_svrsize",  	label: "서버Size",  		width: '6%', align: "right"},
        {key: "cd_svrdate",  	label: "서버date",  		width: '6%'},
        {key: "cd_svrmd5",  	label: "서버md5",  		width: '6%'},
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

$('[data-ax5select="cboDiff"]').ax5select({
    options: []
});


$(document).ready(function() {
	
	getCodeInfo();
	
	$('#cboDiv').css('display','none');
	$('#btnExcel').css('display','none');
	
	// 대사기록조회 클릭
	$('#btnChkSearch').bind('click' , function(){
		openFileHisModal();
	});
	// 엑셀저장
	$('#btnExcel').bind('click', function() {
		fileGrid.exportExcel('파일대사결과조회.xls');
	});
	// 파일대사구분 콤보 변경
	$('#cboDiff').bind('change', function() {
		filterFileDiff();
	});
});

// 파일대사 구분 필터
function filterFileDiff() {
	var diffDiv = getSelectedVal('cboDiff').value;
	
	fFileGridData = [];
	if(getSelectedIndex('cboDiff') > 0) {
		fileGridData.forEach(function(item,index) {
			if(item.cm_micode === diffDiv)
			fFileGridData.push(item);
		});
	} else {
		fFileGridData = fileGridData;
	}
	
	fileGrid.setData(fFileGridData);
}

//검색조건 가져오기
function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('DIFFRST','ALL','N'),
		]);
	cboDiffData = codeInfos.DIFFRST;
	cboDiffData[0].cm_micode = 'ALL';
	$('[data-ax5select="cboDiff"]').ax5select({
		options: injectCboDataToArr(cboDiffData, 'cm_micode' , 'cm_codename')
	});
}

// 대사기록조회 모달 오픈
function openFileHisModal() {
	
	stDate = replaceAllString($('#dateSt').val().trim(),'/','');
	edDate = replaceAllString($('#dateEd').val().trim(),'/','');
	detail = 'Y';
	
	fileHisModal.open({
        width: 1024,
        height: 800,
        iframe: {
            method: "get",
            url: "../modal/filechkreport/FileHisModal.jsp",
            param: "callBack=fileHisModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
                stDate = '';
            	edDate = '';
            	detail = '';
            }
        }
    }, function () {
    });
}

var fileHisModalCallBack = function() {
	fileHisModal.close();
}

//대사내용합계표 모달 오픈
function openFileSumModal(selItem) {
	DaesaResult = new Object();
	DaesaResult.diffdt 	= selItem.cd_diffdt;
	DaesaResult.diffseq = selItem.cd_diffseq;
	DaesaResult.portno 	= selItem.cd_portno;
	DaesaResult.svrip 	= selItem.cd_svrip;			
	DaesaResult.detail 	= detail;
	DaesaResult.UserId 	= userId;
	
	fileSumModal.open({
        width: 1048,
        height: 600,
        iframe: {
            method: "get",
            url: "../modal/filechkreport/FileSumModal.jsp",
            param: "callBack=fileSumModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
            }
            else if (this.state === "close") {
            }
        }
    }, function () {
    });
}

var fileSumModalCallBack = function() {
	fileSumModal.close();
}

// 파일대사 결과조회 가져오기
function getResult() {
	var data = new Object();
	data = {
		UserId 		: userId,
		diffdt 		: DaesaResult.diffdt,
		diffSeq 	: DaesaResult.diffseq,
		svrIp 		: fileSumSelItem.cd_svrip,
		SysCd 		: fileSumSelItem.cm_syscd,
		diffRst 	: fileSumSelItem.cd_diffrst,
		portNo 		: fileSumSelItem.cd_portno,
		requestType	: 'getResult'
	}
	ajaxAsync('/webPage/report/FileChkReport', data, 'json',successGetResult);
}

// 파일대사결과조회 가져오기 완료
function successGetResult(data) {
	
	if(data.length > 0 && data[0].ERROR !== undefined) {
		dialog.alert(data[0].ERROR, function() {});
		return;
	}
	
	$('#cboDiv').css('display','');
	$('#btnExcel').css('display','');
	
	fileGridData = data;
	
	$('#cboDiff').trigger('change');
}

// 파일 대사 결과조회 그리드 클릭
function clickFileGrid(index) {
	var selItem = fileGrid.list[index];
	
}