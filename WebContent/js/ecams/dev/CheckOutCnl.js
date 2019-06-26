/** 체크아웃 화면 기능
 * 
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-01-29
 */
var userName 	      = window.top.userName;
var userId 			  = window.top.userId;
var adminYN		  = window.top.adminYN;
var userDeptName = window.top.userDeptName;
var userDeptCd 	  = window.top.userDeptCd;
var reqCd 			  = window.top.reqCd;

//grid 생성
var firstGrid 	 = new ax5.ui.grid();
var secondGrid = new ax5.ui.grid();

var fileGridData = null;
var sysData 	  = null;
var srData 	  	  = null;
var gridSimpleData = null;
var secondGridList = [];

var options = [];
var strAcptNo = null;

firstGrid.setConfig({
    target: $('[data-ax5grid="first-grid"]'),
    sortable: true, 
    multiSort: true,
    multipleSelect: true,
    showRowSelector: true, //checkbox option
    //rowSelectorColumnWidth: 26 
    header: {
        align: 'center',
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	//this.self.clearSelect(); //기존선택된 row deselect 처리 (multipleSelect 할땐 제외해야함)
        	this.self.select(this.dindex);
        	firstGridClick();
        },
        onDBLClick: function () {
        	this.self.clearSelect();
        	this.self.select(this.dindex);
        	addDataRow();
        },
    	trStyleClass: function () {
    		if(this.item.filterData == true){
    			return 'fontStyle-cncl';
    		} else {
    			return '';
    		}
    	},
    	onDataChanged: function(){
    		//그리드 새로고침 (스타일 유지)
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
            {type: 1, label: "추가"}
        ],
        popupFilter: function (item, param) {
         	//firstGrid.clearSelect();
         	//firstGrid.select(Number(param.dindex));
        	if(firstGrid.getList('selected').length < 1){
        		return false;
        	}
         	return true;
       	 
        },
        onClick: function (item, param) {
	        	
	        addDataRow();
	        firstGrid.contextMenu.close();//또는 return true;
        	
        }
    },
    columns: [
        {key: 'view_dirpath', label: '프로그램경로',  width: '30%'},
        {key: 'cr_rsrcname', label: '프로그램명',  width: '15%'},
        {key: 'jawon', label: '프로그램종류',  width: '10%'},
        {key: 'cr_story', label: '프로그램설명',  width: '20%'},
        {key: 'codename', label: '상태',  width: '5%'},
        {key: 'cr_lstver', label: '버전',  width: '5%'},
        {key: 'cm_username', label: '수정자',  width: '5%'},
        {key: 'lastdt', label: '수정일',  width: '10%'}//formatter: function(){	return '<button>' + this.value + '</button>"}, 	
    ]
});

secondGrid.setConfig({
    target: $('[data-ax5grid="second-grid"]'),
    sortable: true, 
    multiSort: true,
    multipleSelect: true,
    showRowSelector: true, //checkbox option
    //rowSelectorColumnWidth: 26 
    header: {
        align: 'center',
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
            // console.log(this);
        	//this.self.clearSelect(); //기존선택된 row deselect 처리 (multipleSelect 할땐 제외해야함)
            this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	this.self.clearSelect();
        	this.self.select(this.dindex);
        	deleteDataRow();
        },
    	trStyleClass: function () {
    	},
    	onDataChanged: function(){
    		//그리드 새로고침 (스타일 유지)
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
        	//secondGrid.clearSelect();
        	//secondGrid.select(Number(param.dindex));
        	if(secondGrid.getList('selected').length < 1){
        		return false;
        	}
         	return true;
       	 
        },
        onClick: function (item, param) {
	        	
	        deleteDataRow();
	        secondGrid.contextMenu.close();//또는 return true;
        	
        }
    },
    columns: [
        {key: 'view_dirpath', label: '프로그램경로',  width: '30%'},
        {key: 'cr_rsrcname', label: '프로그램명',  width: '10%'},
        {key: 'jobname', label: '업무명',  width: '5%'},
        {key: 'jawon', label: '프로그램종류',  width: '5%'},
        {key: 'cr_story', label: '프로그램설명',  width: '20%'},
        {key: 'cr_lstver', label: '신청버전',  width: '5%'},
        {key: 'pcdir1', label: '로컬위치',  width: '10%'},
        {key: 'cm_username', label: '수정자',  width: '5%'},
        {key: 'lastdt', label: '수정일',  width: '10%'}//formatter: function(){	return '<button>' + this.value + '</button>'}, 	
    ]
});

$('[data-ax5select="cboSrId"]').ax5select({
    options: []
});


$(document).ready(function() {
	console.log('CheckOutCnl.js load');
	screenInit();
	
	$('#cboSrId').bind('change',function(){
		changeSrId();
	});

	$('#cboSys').bind('change',function(){
		changeSys();
	});
	
	$('#btnSR').bind('click',function(){
		idx_button_srinfo();
	});
	
	$('#btnSearch').bind('click',function(){
		clickSearchBtn();
	});
	
	$('#btnDel').bind('click',function(){
		deleteDataRow()
	});
	
	$('#btnAdd').bind('click',function(){
		addDataRow();
	});
	
	$('#btnReq').bind('click',function(){
		checkoutClick();
	});
	
	$('#reqText').bind('keypress',function(event){
		if(event.keyCode == 13){
			checkoutClick();
		}
	});
	
	$('#txtRsrcName').bind('keypress',function(event){
		if(event.keyCode == 13){
			clickSearchBtn();
		}
	});
	
	$('#chkDetail').bind('click',function(){
		simpleData();
	});
	
	$('#btnExcelLoad').bind('click',function(){
		$('#excelFile').click();
	});
	
	//파일의 change 가 안먹히므로 html file onchange로 빠짐
	$('#excelFile').on('change',function(){
		//fileTypeCheck(this);
	});
	
});



function screenInit() {
	getSysCbo();
	getSrIdCbo();
	$('#btnReq').attr('disabled',true);
}

function getSysCbo(){
	var sysInfoData = new Object();
	sysInfoData.SelMsg = 'SEL';
	sysInfoData.UserId = userId;
	sysInfoData.SecuYn = 'y';
	sysInfoData.ReqCd = reqCd;
	sysInfoData.CloseYn = 'n';
	
	var tmpData = {
			requestType : 'getSysInfo',
			sysData : sysInfoData
	}	
	ajaxAsync('/webPage/dev/CheckOutCnlServlet', tmpData, 'json',successGetSysCbo);
}

function successGetSysCbo(data){
	sysData = data;
	options = [];
	
	for(var i=0; i<sysData.length;i++){
		if(sysData[i].cm_syscd == '00000' || sysData[i].cm_sysinfo.substr(0,1) == '1'){
			sysData.splice(i,1);
			i--;
			continue;
		}
		options.push({value: sysData[i].cm_syscd, text: sysData[i].cm_sysmsg, cm_sysgb: sysData[i].cm_sysgb, cm_sysinfo : sysData[i].cm_sysinfo});
	};
	
	$('[data-ax5select="cboSys"]').ax5select({
        options: options
	});
	
	if(sysData.lenght > 0){
		if(strAcptNo != null && strAcptNo !=""){
			var selectVal = $('select[name=cboSys] option:eq(0)').val();
			$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
		}else{
			for (var i=0;sysData.lenght>i;i++) {
					if (sysData[i].setyn == "Y") {
						var selectVal = $('select[name=cboSys] option:eq('+i+')').val();
						$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
						break;
					}
				}
			var selectVal = $('select[name=cboSys] option:eq(0)').val();
			if (i>=sysData.lenght) $('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);;
		}
	} else {
		if (strAcptNo != null && strAcptNo != "") {
			showToast('사용권한이 없는 시스템에 대하여 체크아웃요청을 의뢰하였습니다.');
		}
	}
	
}

function sysDataFilter(){
	var sysDataLength = sysData.length;
	options = [];
	
	for(var i=0; i<sysDataLength ; i++){
		var data = sysData[i];
		
		if(data.cm_sysinfo.substr(0,1) == '1'){
			sysData.splice(i,1);
			i--;
			continue;
		}else if (data.cm_syscd =='00000'){
			options.push({value: sysData[i].cm_syscd, text: sysData[i].cm_sysmsg, cm_sysgb: sysData[i].cm_sysgb, cm_sysinfo : sysData[i].cm_sysinfo});
		}else{
			if(getSelectedIndex('cboSrId') > 0){
				var syscd = getSelectedVal('cboSys').value;
				var arySyscd = new Array(syscd.split(","));
				for(var i=0; i<arySyscd.length; i++){
					if(arySyscd[i] == data.cm_syscd){
						options.push({value: sysData[i].cm_syscd, text: sysData[i].cm_sysmsg, cm_sysgb: sysData[i].cm_sysgb, cm_sysinfo : sysData[i].cm_sysinfo});
					}
				}
				sysData.splice(i,1);
				i--;
				continue;
			}else{
				sysData.splice(i,1);
				i--;
				continue;
			}
		}
		
	}

	$('[data-ax5select="cboSys"]').ax5select({
        options: options
	});
}

function getSrIdCbo(){
	var ajaxResultData = null;
	var srInfoData = new Object();
	srInfoData.userid = userId;
	srInfoData.secuyn = 'Y';
	srInfoData.reqcd = reqCd;
	srInfoData.qrygbn = '01';
	
	var tmpData = {
		srData: 		srInfoData,
		requestType: 	'getPrjList'
	}

	ajaxAsync('/webPage/dev/CheckOutCnlServlet', tmpData, 'json', successGetSrIdCbo);

}

function successGetSrIdCbo(data){
	srData = data;
	options = [];
	options.push({value:'SR정보 선택 또는 해당없음',text:'SR정보 선택 또는 해당없음'});
	
	$.each(srData,function(key,value) {
		if(value.setyn === 'Y') selectedSrId = value.cc_srid;
		options.push({value: value.cc_srid, text: value.srid, cc_reqtitle :value.cc_reqtitle});
	});
	
	$('[data-ax5select="cboSrId"]').ax5select({
        options: options
	});
	
	if(srData.length > 0){
		$('[data-ax-path="cboSrId"]').val(srData[0].cc_srid).trigger('change');
	}
}

function changeSrId(){
	
	$('#txtSayu').val('');
	$('#btnSR').attr('enabled','false');

	if (getSelectedIndex('cboSrId') < 1) return;
	
	$('#txtSayu').val(getSelectedVal('cboSrId').text);
	$('#btnSR').attr('enabled','true');
	
	sysDataFilter();
	
}


function findProc()
{
	grdLst1_dp.source = null;
	grdLst1.dataProvider = grdLst1_dp;
	
	if (cboSys.selectedIndex < 0) return;
	if (srSw && cboIsrId.selectedIndex<1) return;
	
	var etcObj = {};
	etcObj.UserID = strUserId;
	etcObj.syscd  = cboSys.selectedItem.cm_syscd;
	etcObj.sysgb  = cboSys.selectedItem.cm_sysgb;
	etcObj.reqcd  = strReqCD;
	etcObj.txtProg = mx.utils.StringUtil.trim(txtProg.text);
	if (srSw) etcObj.srid = cboIsrId.selectedItem.cc_srid;
	
	Cmr0101.getFileList(etcObj);
	etcObj = null;
}
