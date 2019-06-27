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
var secondGridData = null;
var sysData 	  = null;
var srData 	  	  = null;
var gridSimpleData = null;
var secondGridList = [];

var options 	= [];
var strAcptNo = null;
var srSw 		= false;

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
	
	console.log(sysData);
	for(var i=0; i<sysData.length;i++){
		options.push({value: sysData[i].cm_syscd, text: sysData[i].cm_sysmsg, cm_sysgb: sysData[i].cm_sysgb, cm_sysinfo : sysData[i].cm_sysinfo, setyn:sysData[i].setyn});
	};
	
	$('[data-ax5select="cboSys"]').ax5select({
        options: options
	});
	
	if(sysData.length > 0){
		for (var i=0;sysData.length>i;i++) {
				if (sysData[i].setyn == "Y") {
					var selectVal = $('select[name=cboSys] option:eq('+i+')').val();
					$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
					break;
				}
				if(i>sysData.length){
					
				}
			}
	}
	getSrIdCbo();
	
}

function sysDataFilter(){
	var sysDataLength = sysData.length;
	options = [];
	for(var i=0; i<sysDataLength ; i++){
		var data = sysData[i];
		if (data.cm_syscd =='00000'){
			options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
		}else{
			if(getSelectedIndex('cboSrId') > 0){
				var syscd = getSelectedVal('cboSrId').syscd;
				var arySyscd = new Array(syscd.split(","));
				for(var j=0; j<arySyscd.length; j++){
					if(arySyscd[j] == data.cm_syscd){
						options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
					}
				}
			}else{
				options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
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
		options.push({value: value.cc_srid, text: value.srid, cc_reqtitle :value.cc_reqtitle, syscd:value.syscd});
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

	if (getSelectedIndex('cboSrId') < 0) return;
	
	
	sysDataFilter();

	var sysSelectIndex = 0;
	if(sysData.length == 1 || getSelectedIndex('cboSrId') == 0) sysSelectIndex = 0;
	else sysSelectIndex = 1;

	var selectVal = $('select[name=cboSys] option:eq('+sysSelectIndex+')').val();
	$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
	
	
	$('#txtSayu').val(getSelectedVal('cboSrId').text);
	$('#btnSR').attr('enabled','true');
	if (getSelectedIndex('cboSys') > 0) {
		findProc();
		changeSys();
	}
}

function changeSys(){
	firstGrid.setData([]);
	if (cboSys.selectedItem.cm_stopsw == "1") {
		Alert.show("이관통제를 위하여 일시적으로 형상관리 사용을 중지합니다.");
		cmdFind.enabled = false;
		return;
	} else cmdFind.enabled = true;
	
	if (cboSys.selectedItem.cm_sysinfo.substr(9,1) == "1") srSw = false;
	else srSw = true;
	if (srSw) {
		cboIsrId.enabled=true;						
		if (cboIsrId_dp.length==2) cboIsrId.selectedIndex = 1;	
	} else {
		cboIsrId.enabled=false;
		if (cboIsrId_dp.length>0) cboIsrId.selectedIndex = 0;
	}
//	if (cboIsrId.selectedIndex>-1) {
//		cboIsrId.dispatchEvent(new ListEvent(ListEvent.CHANGE));
//	}
	if(cboSys.selectedIndex>0) findProc();
}

function findProc()
{
	firstGrid.setData([]);
	
	if (getSelectedIndex('cboSys') < 0) return;
	if (srSw && getSelectedIndex('cboSrId')<1) return;

	var getFileListData = new Object();
	getFileListData.UserID = userId;
	getFileListData.syscd  = getSelectedVal('cboSys').value;
	getFileListData.sysgb  = getSelectedVal('cboSys').cm_sysgb;
	getFileListData.reqcd  = reqCd;
	getFileListData.txtProg = $('#txtRsrcName').val().trim();
	if (srSw) getFileListData.srid = getSelectedVal('cboSrId').value;
	
	var tmpData = {
			requestType : 'getFileList',
			getFileListData : getFileListData
	}	
	ajaxAsync('/webPage/dev/CheckOutCnlServlet', tmpData, 'json',successFindProc);
}

function successFindProc(data){
	fileGridData = data;
	checkSelectedFlag();
}

function checkSelectedFlag(){
	if(fileGridData.length >0){
		
		var i=0;
		var j=0;
		var fndItem=0;
		for (i=0;i<fileGridData.length;i++){
			fndItem=0;
			for (j=0;j<secondGrid.length;j++){
				if (fileGridData[i].cr_itemid == secondGridData[j].cr_itemid){
					fndItem++;
				}
			}
			if (fndItem > 0){
				fileGridData[i].selected_flag = true;
			}
			else{
				fileGridData[i].selected_flag = false;
			}
		}
		tmpobj1 = null;
		
	}
	
	firstGrid.setData(fileGridData);
	//grdLst1.selectedIndex = -1;
	//grdLst2.selectedIndex = -1;
}


















