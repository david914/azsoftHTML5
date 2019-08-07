/**
 * [적용 > 롤백요청] 화면
 */
var userId = window.top.userId;
var reqCd = window.top.reqCd;

var firstGrid	   = new ax5.ui.grid();
var secondGrid	   = new ax5.ui.grid();
//var thirdGrid	   = new ax5.ui.grid();
var confirmDialog  = new ax5.ui.dialog();   //확인 창
var picker  	   = new ax5.ui.picker();

var firstGridData  = null; //롤백가능 운영요청건 데이타
var secondGridData = null; //추가대상그리드 데이타
//var thirdGridData  = null; //롤백대상그리드 데이타
var cboSysCdData   = null; //시스템 데이타

var data           = null; //json parameter
var options 	   = [];

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

$('[data-ax5select="cboSysCd"]').ax5select({
    options: []
});

firstGrid.setConfig({
    target: $('[data-ax5grid="firstGrid"]'),
    sortable: true, 
    multiSort: true,
    showLineNumber: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	this.self.clearSelect();
        	this.self.select(this.dindex);
        	
        	//secondGrid조회 액션
        	getFileList();
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    contextMenu: {},
    columns: [
        {key: "cc_srid", label: "SR-ID",  width: '10%'},
        {key: "cc_reqtitle", label: "SR제목",  width: '20%', align: 'left'},
        {key: "acptno", label: "신청번호",  width: '10%'},
        {key: "acptdate", label: "신청일시",  width: '10%'},
        {key: "cm_username", label: "신청자",  width: '10%'},
        {key: "cr_passcd", label: "신청사유",  width: '40%', align: 'left'} 
    ]
});


secondGrid.setConfig({
    target: $('[data-ax5grid="secondGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: true,
    showLineNumber: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	if (this.item.selected_flag == '1') {
            	this.self.clearSelect(this.dindex);
        		return;
        	}
        	this.self.select(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {
    		if (this.item.selected_flag == '1'){
    			return "fontStyle-notaccess";
    		} else if (this.item.cr_itemid != this.item.baseitem){
    			return "fontStyle-module";
    		}
    	},
    	onDataChanged: function(){
    		console.log(this);
    		if (this.item.selected_flag == '1') {
            	this.self.clearSelect(this.dindex);
        		return;
        	}
    	    this.self.repaint();
    	}
    },
    contextMenu: {/*
        iconWidth: 20,
        acceleratorWidth: 100,
        itemClickAndClose: false,
        icons: {
            'arrow': '<i class="fa fa-caret-right"></i>'
        },
        items: [
            {type: 1, label: "추가"}
        ],
        popupFilter: function (item, param) {
        	secondGrid.clearSelect();
        	secondGrid.select(Number(param.dindex));
       	 
	       	var selIn = secondGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
       	 
        	if (param.item == undefined) return false;
        	if (param.dindex < 0) return false;
        	
        	return true;
        },
        onClick: function (item, param) {
	       	thirdGridAdd();
        	secondGrid.contextMenu.close();//또는 return true;
        }*/
    },
    columns: [
        {key: "cm_dirpath", label: "프로그램경로",  width: '25%', align: 'left'},
        {key: "cr_rsrcname", label: "프로그램명",  width: '10%', align: 'left'},
        {key: "jawon", label: "프로그램종류",  width: '8%', align: 'left'},
        {key: "cr_realdep", label: "운영버전",  width: '5%'},
        {key: "cr_realbefver", label: "롤백버전",  width: '5%'},
        {key: "cr_lastdate", label: "수정일",  width: '10%'},
        {key: "codename", label: "프로그램상태",  width: '8%', align: 'left'},
        {key: "ermsg", label: "체크결과",  width: '10%', align: 'left'},
        {key: "cr_story", label: "프로그램설명",  width: '17%', align: 'left'} 
    ]
});
/*
thirdGrid.setConfig({
    target: $('[data-ax5grid="thirdGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: true,
    showLineNumber: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	//this.self.clearSelect();
        	this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	if (this.dindex < 0) return;

	       	var selIn = thirdGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
	       	if (this.item.cr_itemid != this.item.cr_baseitem) return;
	       	
	       	//thirdGrid에서 제거
	       	thirdGridDel();
        },
    	trStyleClass: function () {
    		if (this.item.cr_itemid != this.item.cr_baseitem){
    			return "fontStyle-module";
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
            {type: 1, label: "제거"}
        ],
        popupFilter: function (item, param) {
        	thirdGrid.clearSelect();
        	thirdGrid.select(Number(param.dindex));
       	 
	       	var selIn = thirdGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
       	 
        	if (param.item == undefined) return false;
        	if (param.dindex < 0) return false;
	       	if (this.item.cr_itemid != this.item.cr_baseitem) return;
        	
        	return true;
        },
        onClick: function (item, param) {
	       	thirdGridDel();
        	thirdGrid.contextMenu.close();//또는 return true;
        }
    },
    columns: [
        {key: "cr_rsrcname", label: "프로그램경로",  width: '20%'},
        {key: "cr_story", label: "프로그램명",  width: '10%'},
        {key: "cm_dirpath", label: "프로그램종류",  width: '20%'},
        {key: "cm_jobname", label: "운영버전",  width: '10%'},
        {key: "cr_version", label: "롤백버전",  width: '10%'},
        {key: "cm_dirpath", label: "최종수정일",  width: '20%'},
        {key: "checkin", label: "체크결과",  width: '10%'}
    ]
});
*/
$(document).ready(function(){
	var today = getDate('DATE',0);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	$('#datStD').val(today);
	$('#datEdD').val(today);
	
	//조회버튼 클릭
	$('#btnQry').bind('click',function(){
		if (getSelectedIndex('cboSysCd') < 0) {
			confirmDialog.alert('시스템을 선택하시기 바랍니다.');
			return;
		}
		
		rollbackReqSearch();
	});
	/*
	//추가버튼 클릭
	$('#btnAdd').bind('click',function(){
		thirdGridAdd();
	});
	//제거버튼 클릭
	$('#btnDel').bind('click',function(){
		thirdGridDel();
	});
	*/
	//신청버튼 클릭
	$('#btnReq').bind('click',function(){
	});
	
	//시스템정보 가져오기
	system_getData();
});
/*
//신청목록에 추가
function thirdGridAdd() {
	
}
//신청목록에서 제거
function thirdGridDel() {
	
}
*/
//시스템정보 가져오기
function system_getData() {
	data =  new Object();
	data = {
		UserId			: userId,
		ReqCd			: reqCd,
		SecuYn			: 'Y',
		SelMsg			: '',
		CloseYn			: 'N',
		requestType		: 'getSysInfo'
	}
	ajaxAsync('/webPage/apply/RollBackReqServlet', data, 'json', successGetSysInfo);
}
//시스템정보 가져오기완료
function successGetSysInfo(data) {
	cboSysCdData = data;
	options = [];
	$.each(cboSysCdData,function(key,value) {
	    options.push({value: value.cm_syscd, text: value.cm_sysmsg, TstSw: value.TstSw, cm_sysinfo: value.cm_sysinfo, cm_sysfc1: value.cm_sysfc1});
	});
	$('[data-ax5select="cboSysCd"]').ax5select({
        options: options
	});
	
	if (cboSysCdData.length > 0) {
		$('#btnQry').trigger('click');
	}
}
//운영배포신청목록조회
function rollbackReqSearch(){
	firstGrid.setData([]);
	
	data =  new Object();
	data = {
		UserId			: userId,
		QryCd			: '0',
		stDate			: replaceAllString($('#datStD').val(), '/', ''),
		edDate			: replaceAllString($('#datEdD').val(), '/', ''),
		SysCd			: getSelectedVal('cboSysCd').value,
		requestType		: 'getBefList'
	}
	ajaxAsync('/webPage/apply/RollBackReqServlet', data, 'json', successGetBefList);
}
//조회완료
function successGetBefList(data) {
	firstGridData = data;
	firstGrid.setData(firstGridData);
}
//신청프로그램목록 조회
function getFileList() {
	secondGrid.setData([]);
	
	data =  new Object();
	data = {
		UserId			: userId,
		AcptNo			: firstGridData[firstGrid.selectedDataIndexs].cr_acptno,
		requestType		: 'getBefReq_Prog'
	}
	ajaxAsync('/webPage/apply/RollBackReqServlet', data, 'json', successGetBefReq_Prog);
}
//신청프로그램목록조회 완료
function successGetBefReq_Prog(data){
	secondGridData = data;
	//secondGrid.setData(secondGridData);
	
	var i=0;
	var errflg = false;
	for (i=0; i<secondGridData.lengh; i++) {
		if (secondGridData[i].version > 0 && secondGridData[i].selected_flag == '1') {
			errflg = true;
			break;
		}
	}
	if (errflg) {
		//체크아웃중인 프로그램이 있습니다. 체크아웃취소 후 처리하시기 바랍니다.
		return;
	}

	var calcnt = 0;
	for (i=0; i<secondGridData.length; i++){
		console.log('++++++++++++++++:'+secondGridData[i].selected_flag+','+ secondGridData[i].cr_status);
		/*if (secondGridData[i].selected_flag == '1' || secondGridData[i].cr_status != '0'){
			secondGridData.splice(i--,1);
			continue;
		}*/
		console.log('++++++++++++++++3,8:'+(secondGridData[i].cm_info).substr(3,1)+','+(secondGridData[i].cm_info).substr(8,1));
		if ((secondGridData[i].cm_info).substr(3,1) == '1'){
			calcnt++;
		}
		if ((secondGridData[i].cm_info).substr(8,1) == '1'){
			calcnt++;
		}
	}
	
	if (secondGridData.length > 0) {
		if (calcnt > 0){
			var param = new Object();
			param.ReqCD = reqCd;
			param.cm_syscd = getSelectedVal('cboSysCd').value;
			param.UserId = userId;
			param.QryCd = '';
			param.QryName = '';
			param.cm_sysfc1 = getSelectedVal('cboSysCd').cm_sysfc1;
			param.qrygbn = 'L';
			
			data =  new Object();
			data = {
				gridData		: secondGridData,
				param			: param,
				requestType		: 'getDownFileList'
			}
			ajaxAsync('/webPage/apply/RollBackReqServlet', data, 'json', successGetDownFileList);
		} else {
			secondGrid.setData(secondGridData);
			secondGrid.repaint();
		}
	}
}
//상세프로그램항목 가져오기완료
function successGetDownFileList(data){
	console.log(data);
	//secondGridData = data;
	//secondGrid.setData(secondGridData);
	var secondGridList = new Array;
	$(data).each(function(j){
		data[0].disable_selection = false;
		secondGridList.push($.extend({}, data[j], {__index: undefined}));
	});
	secondGrid.addRow(secondGridList);
	secondGrid.repaint();
	
	/*
	var firstGridSeleted = firstGrid.getList("selected");
	$(firstGridSeleted).each(function(i){
	
	});
	*/
	
}

//그리드에 마우스 툴팁 달기
/*
$(document).on("mouseenter","[data-ax5grid-panel='body'] span",function(event){
	if(this.innerHTML == ""){
		return;
	}
	//첫번째 컬럼에만 툴팁 달기
	if($(this).closest("td").index() > 0) return;
	//그리드 정보 가져오기
	var gridRowInfo = secondGrid.list[parseInt($(this).closest("td").closest("tr").attr("data-ax5grid-tr-data-index"))];
	
	$(this).attr("title",'운영배포신청목록을 조회하여 롤백대상 신청건을 클릭하시면 롤백가능한 프로그램이 조회됩니다.');
	
	// title을 변수에 저장
	title_ = $(this).attr("title");
	// class를 변수에 저장
	class_ = $(this).attr("class");
	// title 속성 삭제 ( 기본 툴팁 기능 방지 )
	$(this).attr("title","");
	
	$("body").append("<div id='tip'></div>");
	if (class_ == "img") {
		$("#tip").html(imgTag);
		$("#tip").css("width","100px");
	} else {
		$("#tip").css("display","inline-block");
		$("#tip").html('<pre>'+title_+'</pre>');
	}
	
	var pageX = event.pageX;
	var pageY = event.pageY;
	
	$("#tip").css({left : pageX + "px", top : pageY + "px"}).fadeIn(100);
	return;
}).on('mouseleave',"[data-ax5grid-panel='body'] span",function(){
	$(this).attr("title", '');
	$("#tip").remove();	
});
*/
