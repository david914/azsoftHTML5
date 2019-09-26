var userid 		= window.top.userId;
var strReqCD 	= window.top.reqCd;


var firstGrid 	= new ax5.ui.grid();
var picker  	= new ax5.ui.picker();

var confirmDialog   = new ax5.ui.dialog();   //확인 창

var options 		= [];

var firstGridData 	= null; //그리드 데이타
var cboDept1Data 	= null; //요청부서 데이타
var cboDept2Data	= null; //등록부서 데이타
var cboSta1Data		= null; //SR상태 데이타
var cboSta2Data		= null; //개발자상태 데이타

var myWin 			= null; //새창ID

var data =  new Object();

confirmDialog.setConfig({
	Title: "확인",
    theme: "info",
    width: 500
});

ax5.info.weekNames = [
    {label: "일"},
    {label: "월"},
    {label: "화"},
    {label: "수"},
    {label: "목"},
    {label: "금"},
    {label: "토"}
];
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

firstGrid.setConfig({
    target: $('[data-ax5grid="firstGrid"]'),
    sortable: true, 
    multiSort: true,
    header: {
        align: "center"
    },
    body: {
        	onClick: function () {
        	this.self.clearSelect();
        	this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	if (this.dindex < 0) return;
			openWindow(this.item.isrid);
        },
    	trStyleClass: function () {
    		if(this.item.color === '3' || this.item.color === 'A'){
    			return "fontStyle-cncl";
    		} else if (this.item.color === 'R'){
    			return "fontStyle-rec";
    		} else if (this.item.color === 'C'){
    			return "fontStyle-dev";
    		} else if (this.item.color === 'T'){
    			return "fontStyle-test";
    		} else if (this.item.color === 'P'){
    			return "fontStyle-apply";
    		} else if (this.item.color === '9'){
    			return "fontStyle-end";
    		} else {
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
            {type: 1, label: "SR정보"}
        ],
        popupFilter: function (item, param) {
         	firstGrid.clearSelect();
         	firstGrid.select(Number(param.dindex));
         	
         	var selIn = firstGrid.selectedDataIndexs;
        	if(selIn.length === 0) return;
        	 
         	if (param.item == undefined) return false;
         	if (param.dindex < 0) return false;
         	
         	return true;
        },
        onClick: function (item, param) {
        	openWindow(param.item.isrid);
            firstGrid.contextMenu.close();//또는 return true;
        }
    },
    columns: [
        {key: "isrid", label: "SR-ID",  width: '6%'},
        {key: "genieid", label: "문서번호",  width: '6%'},
        {key: "recvdate", label: "등록일",  width: '5%'},
        {key: "reqdept", label: "요청부서",  width: '5%', align: 'left'},
        {key: "reqsta1", label: "SR상태",  width: '5%', align: 'left'},
        {key: "reqtitle", label: "요청제목",  width: '15%', align: 'left'},
        {key: "reqedday", label: "완료요청일",  width: '5%'},
        {key: "comdept", label: "등록부서",  width: '5%', align: 'left'},
        {key: "recvuser", label: "등록인",  width: '4%'},
        {key: "recvdept", label: "개발부서",  width: '5%', align: 'left'},
        {key: "devuser", label: "개발담당자",  width: '5%'},
        {key: "reqsta2", label: "개발자상태",  width: '5%', align: 'left'},
        {key: "chgdevterm", label: "개발기간", width: '8%', align: 'left'},
        {key: "chgdevtime", label: "개발계획공수", width: '6%'},
        {key: "realworktime", label: "개발투입공수", width: '6%'},
        {key: "chgpercent", label: "개발진행율", width: '6%'},
        {key: "chgedgbn", label: "변경종료구분", width: '6%'},
        {key: "chgeddate", label: "변경종료일", width: '6%'},
        {key: "isredgbn", label: "SR완료구분", width: '6%', align: 'left'},
        {key: "isreddate", label: "SR완료일", width: '6%'}
    ]
});

$(document).ready(function(){
	$('input:radio[name^="rdoDaeSang"]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});
	
	dateInit();
	dept_set1();
	
	//SR상태 change
	$('#cboSta1').bind('change', function() {
		data_setEnable();
	});
	//개발자상태 chnage
	$('#cboSta2').bind('change', function() {
		data_setEnable();
	});
	
	//엑셀저장버튼
	$('#btnExcel').bind('click', function() {
		firstGrid.exportExcel("grid-to-excel.xls");
	});
	//조회버튼
	$('#btnQry').bind('click', function() {
		cmdQry_Proc();
	});
	//초기화버튼
	$('#btnReset').bind('click', function() {
		resetScreen();
	});
});

function dateInit() {
	$('#datStD').val(getDate('DATE',0));
	//picker.bind(defaultPickerInfo('datStD', 'top'));
	$('#datEdD').val(getDate('DATE',0));
	//picker.bind(defaultPickerInfo('datEdD', 'top'));
}

//요청부서 가져오기
function dept_set1(){
	data =  new Object();
	data = {
		SelMsg			: 'ALL',
		cm_useyn		: 'Y',
		gubun			: 'req',
		itYn			: 'N',
		requestType		: 'getTeamInfoGrid2'
	}
	ajaxAsync('/webPage/regist/SRStatus', data, 'json',successGetTeamInfoGrid1);
}
//요청부서 가져오기 완료
function successGetTeamInfoGrid1(data) {
	cboDept1Data = data;
	
	options = [];
	$.each(cboDept1Data,function(key,value) {
		options.push({value: value.cm_deptcd, text: value.cm_deptname});
	});
	
	$('[data-ax5select="cboDept1"]').ax5select({
        options: options
	});
	
	dept_set2();
} 
//등록부서 가져오기
function dept_set2(){
	data =  new Object();
	data = {
		SelMsg			: 'ALL',
		cm_useyn		: 'Y',
		gubun			: 'DEPT',
		itYn			: 'N',
		requestType		: 'getTeamInfoGrid2'
	}
	ajaxAsync('/webPage/regist/SRStatus', data, 'json',successGetTeamInfoGrid2);
}
//등록부서 가져오기완료
function successGetTeamInfoGrid2(data) {
	cboDept2Data = data;
	
	options = [];
	$.each(cboDept2Data,function(key,value) {
		options.push({value: value.cm_deptcd, text: value.cm_deptname});
	});
	
	$('[data-ax5select="cboDept2"]').ax5select({
        options: options
	});

	getCodeInfo();
}
//sr상태, 개발자상태 데이타가져오기
function getCodeInfo(){
	var codeInfos = getCodeInfoCommon([
										new CodeInfo('ISRSTA','ALL','N'),
										new CodeInfo('ISRSTAUSR','ALL','N')
									  ]);
	cboSta1Data	= codeInfos.ISRSTA;
	cboSta2Data = codeInfos.ISRSTAUSR;
	
	options = [];
	$.each(cboSta1Data,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	options.push({value: 'XX', text: '미완료전체'});
	$('[data-ax5select="cboSta1"]').ax5select({
        options: options
	});
	
	options = [];
	$.each(cboSta2Data,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	options.push({value: 'XX', text: '미완료전체'});
	$('[data-ax5select="cboSta2"]').ax5select({
        options: options
	});
	
	resetScreen();
}
//초기화
function resetScreen() {
	var today = getDate('DATE',0);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	$('#datStD').val(today);
	$('#datEdD').val(today);
	
	firstGrid.setData([]); 												// grid 초기화
	$('[data-ax5select="cboDept1"]').ax5select("setValue", '0', true); 	// 요청부서 초기화
	$('[data-ax5select="cboDept2"]').ax5select("setValue", '0', true); 	// 등록부서 초기화
	$("#txtSpms").val('');												// SR-ID 초기화
	
	// SR상태,개발자상태 초기화
	$('[data-ax5select="cboSta1"]').ax5select("setValue", '4', true);	//SR상태 default 진행중
	$('[data-ax5select="cboSta2"]').ax5select("setValue", '00',	true);	//개발자상태 default 전체
	
	data_setEnable();
}
function data_setEnable() {
	if (getSelectedIndex('cboSta1') < 0) return;

	$('#datStD').prop("disabled", true);
	$('#datEdD').prop("disabled", true);
	$('#btnStD').prop("disabled", true);
	$('#btnEdD').prop("disabled", true);
	
	if (getSelectedVal('cboSta1').value == '00' ||
			getSelectedVal('cboSta1').value == '3' ||
			getSelectedVal('cboSta1').value == '8' ||
			getSelectedVal('cboSta1').value == '9') {
		
	    if ( getSelectedVal('cboSta2').value == '00' ) {
			$('#datStD').prop("disabled", false);
			$('#datEdD').prop("disabled", false);
			$('#btnStD').prop("disabled", false);
			$('#btnEdD').prop("disabled", false);
	    }
	}
	
	cmdQry_Proc();
}

//조회
function cmdQry_Proc(){
	var errSw = false;
	if(getSelectedVal('cboSta2').value != '00' && getSelectedVal('cboSta2').value != '00'){
		// 3 : 제외 , 8 : 진행중단 , 9 : 완료
		if(getSelectedVal('cboSta2').value != '3' && getSelectedVal('cboSta2').value != '8' && getSelectedVal('cboSta2').value != '9'){
			if(getSelectedVal('cboSta1').value == '0') errSw = true;
			else if(getSelectedVal('cboSta1').value == '3') errSw = true;
			else if(getSelectedVal('cboSta1').value == '8') errSw = true;
			else if(getSelectedVal('cboSta1').value == '9') errSw = true;
    	}
	}
	if(errSw){
		confirmDialog.alert('상태를 정확하게 선택하여 주시기 바랍니다.');
		return;
	}
	
	var strStD = replaceAllString($('#datStD').val(), '/', '');
	var strEdD = replaceAllString($('#datEdD').val(), '/', '');
	
	if(strStD > strEdD){
		confirmDialog.alert('조회기간을 정확하게 선택하여 주십시오.');
		return;
	}  

	var param = new Object();
	
	if(!$('#datStD').is(':disabled')  && !$('#datEdD').is(':disabled')){
		param.stday = strStD;
		param.edday = strEdD;	 
	}  
	if ( getSelectedVal('cboDept1').value != '0' ) {
		param.reqdept = getSelectedVal('cboDept1').value;
	}
	if ( getSelectedVal('cboDept2').value != '0' ) {
		param.recvdept = getSelectedVal('cboDept2').value;
	}
	if ( getSelectedVal('cboSta1').value != '00' ) {
		param.reqsta1 = getSelectedVal('cboSta1').value;
	}
	if ( getSelectedVal('cboSta2').value != '00' ) {
		param.reqsta2 = getSelectedVal('cboSta2').value;
	}
	if ($('#txtTit').val() != undefined && $('#txtTit').val().length > 0){
		param.reqtit = $('#txtTit').val();
	}	
	param.selfsw = $('input[name="rdoDaeSang"]:checked').val();
					
	param.userid = userid;

	data =  new Object();
	data = {
		prjData		: param,
		requestType : 'get_SelectList'			
	}
	ajaxAsync('/webPage/regist/SRStatus', data, 'json', successGet_SelectList);
}
//조회 가져오기완료
function successGet_SelectList(data) {
	//console.log(data);
	firstGridData = data;
	firstGrid.setData(firstGridData);
}

//새창팝업
function openWindow(srid) {
	var nHeight, nWidth, cURL, winName;

    winName = 'SRInfo';
    
	if (myWin != null) {
        if (!myWin.closed) {
        	myWin.close();
        }
	}

    nWidth  = 1105;
	nHeight = 735;
	cURL = "/webPage/winpop/PopSRInfo.jsp";
	
	var f = document.popPam;
    f.user.value = userid;
    f.srid.value = srid;
    
    myWin = winOpen(f, winName, cURL, nHeight, nWidth);
}