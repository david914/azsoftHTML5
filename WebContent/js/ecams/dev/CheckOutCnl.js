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
var approvalModal 		= new ax5.ui.modal();

//grid 생성
var firstGrid 	 = new ax5.ui.grid();
var secondGrid = new ax5.ui.grid();

var firstGridData = [];
var sysData 	  = null;
var srData 	  	  = null;
var gridSimpleData = null;
var secondGridData = [];
var confirmData = [];
var confirmInfoData = null;

var options 	= [];
var srSw 		= false;
var acptNo = "";
var winDevRep        = null; //SR정보 새창

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
    		if(this.item.selected_flag == '1'){
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
         	//firstGridData.clearSelect();
         	//firstGridData.select(Number(param.dindex));
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
        {key: 'acptdate', label: '신청일시',  width: '10%'},
        {key: 'cm_dirpath', label: '프로그램경로',  width: '25%'},
        {key: 'cr_rsrcname', label: '프로그램명',  width: '25%'},
        {key: 'cm_jobname', label: '업무명',  width: '12%'},
        {key: 'jawon', label: '프로그램종류',  width: '9%'},
        {key: 'cr_story', label: '프로그램설명',  width: '9%'},
        {key: 'acptno', label: '신청번호',  width: '10%'},
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
    		simpleData();
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
        {key: 'cm_dirpath', label: '프로그램경로',  width: '32%'},
        {key: 'cr_rsrcname', label: '프로그램명',  width: '32%'},
        {key: 'cm_jobname', label: '업무명',  width: '12%'},
        {key: 'jawon', label: '프로그램종류',  width: '12%'},
        {key: 'cr_story', label: '프로그램설명',  width: '12%'},
    ]
});

$('[data-ax5select="cboSrId"]').ax5select({
    options: []
});


$(document).ready(function() {
	console.log('CheckOutCnl.js load');
	screenInit();

	$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
	
	$('#cboSrId').bind('change',function(){
		changeSrId();
	});

	$('#cboSys').bind('change',function(){
		changeSys();
	});
	
	$('#btnSR').bind('click',function(){
		cmdReqInfo_Click();
	});
	
	$('#btnSearch').bind('click',function(){
		findProc();
	});
	
	$('#btnDel').bind('click',function(){
		deleteDataRow()
	});
	
	$('#btnAdd').bind('click',function(){
		addDataRow();
	});
	
	$('#btnReq').bind('click',function(){
		checkOutCnlClick();
	});
	
	$('#reqText').bind('keypress',function(event){
		if(event.keyCode == 13){
			checkOutCnlClick();
		}
	});
	
	$('#txtRsrcName').bind('keypress',function(event){
		if(event.keyCode == 13){
			findProc();
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
	console.log(data);
	options = [];
	var selectVal;
	
	for(var i=0; i<sysData.length;i++){
		options.push({value: sysData[i].cm_syscd, text: sysData[i].cm_sysmsg, cm_sysgb: sysData[i].cm_sysgb, cm_sysinfo : sysData[i].cm_sysinfo, setyn:sysData[i].setyn});
	};
	
	$('[data-ax5select="cboSys"]').ax5select({
        options: options
	});
	
	if(sysData.length > 0){
		for (var i=0;sysData.length>i;i++) {
				if (sysData[i].setyn == "Y") {
					selectVal = $('select[name=cboSys] option:eq('+i+')').val();
					$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
					break;
				}
				if(i>sysData.length){
					selectVal = $('select[name=cboSys] option:eq(0)').val();
					$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
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
		if(data.cm_sysinfo.substr(0,1) == '1'){
			continue;
		}else if (data.cm_syscd =='00000'){
			options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
		}else{
			if(getSelectedIndex('cboSrId') > 0){
				var syscd = getSelectedVal('cboSrId').syscd;
				var arySyscd = syscd.split(",");
				for(var j=0; j<arySyscd.length; j++){
					if(arySyscd[j] == data.cm_syscd){
						options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
					}
				}
				continue;
			}else{
				options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
			}
		}
		
	}

	$('[data-ax5select="cboSys"]').ax5select({
        options: options
	});

	return options.length;
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
	firstGrid.setData([]);
	firstGridaData = [];
	$('#txtSayu').val('');
	$('#btnSR').attr('disabled',false);

	if(sysData.length > 0){
		var sysLength = sysDataFilter();
	
		var sysSelectIndex = 0;
		if(sysLength == 1 || getSelectedIndex('cboSrId') == 0) sysSelectIndex = 0;
		else sysSelectIndex = 1;
	
		var selectVal = $('select[name=cboSys] option:eq('+sysSelectIndex+')').val();
		$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
		
		
		$('#txtSayu').val(getSelectedVal('cboSrId').text);
		$('#btnSR').attr('disabled',false);
		if (getSelectedIndex('cboSys') > 0) {
			changeSys();
		}
	}
}

function changeSys(){
	firstGrid.setData([]);
	firstGridaData = [];
	if (getSelectedVal('cboSys').cm_stopsw == "1") {
		dialog.alert("이관통제를 위하여 일시적으로 형상관리 사용을 중지합니다.");
		$('#btnSearch').prop('disabled',true);
		return;
	} else $('#btnSearch').prop('disabled',false);
	
	if (getSelectedVal('cboSys').cm_sysinfo.substr(9,1) == "1") srSw = false;
	else srSw = true;
	var srIdSelectIndex = 0;
	if (srSw) {
		$('[data-ax5select="cboSrId"]').ax5select("enabled");
		if (srData.length==2) srIdSelectIndex = 1;	
	} else {
		$('[data-ax5select="cboSrId"]').ax5select("disabled");
		if (srData.length>0) srIdSelectIndex = 0;
	}
	var selectVal = $('select[name=cboSrId] option:eq('+srIdSelectIndex+')').val();
	$('[data-ax5select="cboSrId"]').ax5select('setValue',selectVal,true);
	if(getSelectedIndex('cboSys')>0) findProc();
}

function findProc()
{
	firstGrid.setData([]);
	firstGridData = [];
	
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
	firstGridData = data;
	checkSelectedFlag();
}

function checkSelectedFlag(){
	if(firstGridData.length >0){
		
		var i=0;
		var j=0;
		var fndItem=0;
		for (i=0;i<firstGridData.length;i++){
			fndItem=0;
			for (j=0;j<secondGridData.length;j++){
				if (firstGridData[i].cr_itemid == secondGridData[j].cr_itemid){
					fndItem++;
				}
			}
			if (fndItem > 0){
				firstGridData[i].selected_flag = '1';
			}
			else{
				firstGridData[i].selected_flag = '0';
			}
		}
		tmpobj1 = null;
		
	}
	
	firstGrid.setData(firstGridData);
	//grdLst1.selectedIndex = -1;
	//grdLst2.selectedIndex = -1;
}

//상세보기
function simpleData(){
	gridSimpleData = clone(secondGrid.list);
	if(secondGrid.list.length == 0){
		secondGridData = clone(secondGrid.list);
		return;
	}
	for(var i =0; i < gridSimpleData.length; i++){
		if(gridSimpleData[i].baseitemid != gridSimpleData[i].cr_itemid){
			gridSimpleData.splice(i,1);
			i--;
		}
	};
	if (!$('#chkDetail').is(':checked')){
		secondGrid.list = clone(gridSimpleData);
		secondGrid.repaint();
	}
	else{
		secondGrid.list = clone(secondGridData);
		secondGrid.repaint();
	}
}


function addDataRow() {

	var calcnt = 0;
	var secondGridList = new Array;
	var firstGridSeleted = firstGrid.getList("selected");
	var ajaxReturnData;
	
	$(firstGridSeleted).each(function(i){
		if(this.selected_flag == '1'){
			return true;
		}
		
		//RSCHKITEM	[27]-개발툴연계, [04]-동시적용항목CHECK, [47]-디렉토리기준관리, [09] 실행모듈Check
		if ((this.cm_info.substr(26,1) == "1" || this.cm_info.substr(3,1) == "1" || 
				this.cm_info.substr(46,1) == "1" || this.cm_info.substr(8,1) == "1")){
			calcnt++;
		}
				
		if(this.selected_flag!='1'){
			this.selected_flag = '1';
			var copyData = this;
			secondGridList.push($.extend({}, copyData, {__index: undefined}));
		}
	});
	
	if (calcnt > 0){
		if (secondGridList.length > 0){
				var tmpData = {
					fileList : secondGridList,
					requestType : 'getDownFileList'
				}
				ajaxReturnData = ajaxCallWithJson('/webPage/dev/CheckOutCnlServlet', tmpData, 'json');
				checkDuplication(ajaxReturnData);
			}
	} else {
		checkDuplication(secondGridList);
		checkSelectedFlag();
		if (secondGridData.length > 0){
			$('[data-ax5select="cboSys"]').ax5select("disabled");
			$('[data-ax5select="cboSrId"]').ax5select("disabled");
			$('#btnReq').attr('disabled',false);
		}
	}
	
}


function checkDuplication(downFileList) {
	if(downFileList == 'ERR'){
		dialog.alert("에러가 발생했습니다.");
		return;
	}
	if(secondGridData.length > 0 ){
		$(secondGridData).each(function(i){
			$(downFileList).each(function(j){
				if( secondGridData[i].cr_itemid == downFileList[j].cr_itemid ){
					downFileList.splice(j,1);
					return false;
				}
			});
		});
	}
	
	if(downFileList.length > 0) {
		var secondGridList = new Array;
		$(downFileList).each(function(i){
			var currentItem = downFileList[i];
			if(currentItem.baseitemid == currentItem.cr_itemid){
				$(firstGridData).each(function(j){
					if(firstGridData[j].cr_itemid == currentItem.cr_itemid) {
						firstGridData[j].selected_flag = '1';
						var copyData = clone(firstGrid.list[j]); //리스트의 주소지를 가져오므로 clone 을 해서 add 해줘야함
						secondGridList.push($.extend({}, copyData, {__index: undefined}));
						return false;
					}
					
				});
			}
		});
	}
	firstGrid.repaint();
	secondGrid.addRow(secondGridList);
	
	if(secondGrid.list.length > 0 ) {

		$('[data-ax5select="cboSys"]').ax5select("disable");
		$('[data-ax5select="cboSrId"]').ax5select("disable")
		$('#btnReq').prop('disabled',false);
	}
	secondGridData = clone(secondGrid.list);
	simpleData();
}


function deleteDataRow() {

	var secondGridSeleted = secondGrid.getList("selected");
	var originalData = null;
	
	$(secondGridSeleted).each(function(i){
		originalData = null;
		if( this.cm_info.substr(3,1) == '1' || this.cm_info.substr(8,1) == '1'){
			if($('#chkDetail').is(':checked')){
				for(var x=0; x<secondGrid.list.length; x++){
					if(secondGrid.list[x].baseitemid == this.cr_itemid){
						secondGrid.select(x,{selected:true} );
					}
				}
			}
		}
		else if (this.cr_itemid != this.baseitemid){
			for(var x=0; x<secondGrid.list.length; x++){
				if(secondGrid.list[x].cr_itemid == this.baseitemid){
					secondGrid.select(x,{selected:true} );
					originalData = secondGrid.list[x].baseitemid;
				}
			}
		}
		$(firstGridData).each(function(j){
			if(firstGridData[j].cr_itemid == secondGridSeleted[i].cr_itemid || 
				firstGridData[j].cr_itemid == originalData && originalData != null){
				
				firstGridData[j].selected_flag = "0";
				return false;
			}
		});
	});
	secondGrid.removeRow("selected");
	firstGrid.repaint();
	
	if (secondGrid.list.length == 0){
		$('[data-ax5select="cboSys"]').ax5select("enable");
		$('[data-ax5select="cboSrId"]').ax5select("enable")
		$('#btnReq').prop('disabled',true);
	}
	secondGridData = clone(secondGrid.list);
}

//그리드 리스트 클릭 퉅팁 미개발
function firstGridClick(){
	/*
	console.log(firstGrid.getList("selected"));
	if (firstGrid.getList("selected").selectedIndex < 0) {
		list1_grid = "";
		return;
	}
	list1_grid.toolTip = list1_grid.selectedItem.view_dirpath;
*/
}
function checkOutCnlClick(){
	if (srSw && getSelectedIndex('cboSrId') < 1) {
		dialog.alert("SR-ID를 선택하여 주십시오.");
		return;
	}
	if (secondGridData.length == 0){
		dialog.alert("신청할 파일을 입력하여 주십시오.");
		return;
	}
	if ($('#txtSayu').val().trim().length == 0){
		dialog.alert("신청사유를 입력하여 주십시오.");
		$('#txtSayu').focus();
		return;
	}
	confirmDialog.confirm({
		msg: '체크아웃취소 신청하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			cnclConfirm();
		}
	});
}

function cnclConfirm(){
	var strQry = ""
	var ajaxReturnData;
	var strRsrcCd = "";
	for (x=0;x<secondGridData.length;x++) {
		if (strRsrcCd.length > 0) {
			strRsrcCd = strRsrcCd + ",";
		}
		strRsrcCd = strRsrcCd + secondGridData[x].cr_rsrccd;
	}
	$('#btnReq').attr('disabled',true);

	confirmInfoData = new Object();
	confirmInfoData.SysCd = getSelectedVal('cboSys').value;
	confirmInfoData.strRsrcCd = strRsrcCd;
	confirmInfoData.ReqCd = reqCd;
	confirmInfoData.UserID = userId;
	confirmInfoData.strQry = strQry;
	
	var tmpData = {
			requestType : 'confSelect',
			confirmInfoData : confirmInfoData
	}	
	ajaxReturnData = ajaxCallWithJson('/webPage/apply/ApplyRequest', tmpData, 'json');
	confCheck(ajaxReturnData);
}

function confCheck(data){
	if (data == "C") {
		confirmDialog.confirm({
			msg: '결재자를 지정하시겠습니까?',
		}, function(){
			if(this.key === 'ok') {
				confCall("Y");
			}
			else{
				confCall("N")
			}
		});
	} else if (data == "Y") {
		confCall("Y");
    } else if (data != "N") {
    	$('#btnReq').attr('disabled',false);
    	dialog.alert("결재정보가 등록되지 않았습니다. 형상관리시스템담당자에게 연락하여 주시기 바랍니다.");
    } else {
		confCall("N");
    }

}

function confCall(GbnCd)
{
	var strQry = "";
	var tmpRsrc = "";
	var strIsrId= "";

	strQry = reqCd;
	for (var x=0;x<secondGridData.length;x++) {
		if (tmpRsrc.length > 0) {
			if (tmpRsrc.indexOf(secondGridData[x].cr_rsrccd) < 0)
                tmpRsrc = tmpRsrc + "," + secondGridData[x].cr_rsrccd;
		} else tmpRsrc = secondGridData[x].cr_rsrccd;
	}

	if (srSw) strIsrId = getSelectedVal('cboSrId').value;
	else strIsrId = "";
	confirmData = [];
	confirmInfoData = new Object();
	confirmInfoData.UserID = userId;
	confirmInfoData.ReqCd  = reqCd;
	confirmInfoData.SysCd  = getSelectedVal('cboSys').value;
	confirmInfoData.Rsrccd = tmpRsrc;
	confirmInfoData.QryCd = strQry;
	confirmInfoData.EmgSw = "N";
	confirmInfoData.JobCd = "";
	confirmInfoData.deployCd = "0";
	confirmInfoData.PrjNo = strIsrId;
	// 결재팝업
	if (GbnCd == "Y") {
		approvalModal.open({
	        width: 820,
	        height: 365,
	        iframe: {
	            method: "get",
	            url: "../modal/request/ApprovalModal.jsp",
	            param: "callBack=modalCallBack"
		    },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	            	if(confirmData.length > 0){
	            		reqQuestConf();
	            	}
	            	$('#btnReq').prop('disabled', false);
	                mask.close();
	            }
	        }
		});
		 
        
	} else if (GbnCd == "N") {
		
		var tmpData = {
				requestType : 'Confirm_Info',
				confInfoData : confirmInfoData
		}	
		
		ajaxReturnData = ajaxCallWithJson('/webPage/dev/CheckOutCnlServlet', tmpData, 'json');
		successConfInfo(ajaxReturnData);
	}
}

function successConfInfo(data){
	
	confirmData = data;
	
	for (var i=0;confirmData.length>i;i++) {
		if (confirmData[i].arysv[0].SvUser == null || confirmData[i].arysv[0].SvUser == "") {
			confirmData.splice(i,1);
			i--;
		}
	}

	reqQuestConf();
}

function reqQuestConf(){
	var CheckOutCnlData = new Object();

	CheckOutCnlData.UserID = userId;
	CheckOutCnlData.ReqCD  = reqCd;
	CheckOutCnlData.isrid  = "";
	CheckOutCnlData.isrsub  = "";
	CheckOutCnlData.syscd = getSelectedVal('cboSys').value;
	CheckOutCnlData.sayu = $("#txtSayu").val().trim();
	
	CheckOutCnlData.EmgCd = "0";
	if (srSw){
		CheckOutCnlData.srid = getSelectedVal('cboSrId').value;
		CheckOutCnlData.cc_reqtitle = "";
	} else {
		CheckOutCnlData.srid = "";
		CheckOutCnlData.cc_reqtitle = "";
	}

	var tmpData = {
			requestType : 'request_Check_Out_Cancel',
			confInfoData : CheckOutCnlData,
			CheckOutCnlList : secondGridData,
			confirmData : confirmData
	}	
	
	ajaxReturnData = ajaxCallWithJson('/webPage/dev/CheckOutCnlServlet', tmpData, 'json');
	successRequest(ajaxReturnData);

}

function successRequest(data){
	if (data.length == 12){
		secondGrid.setData([]);
		secondGridData = [];
		
		acptNo = data;
		if (reqCd == "11"){
			confirmDialog.confirm({
				msg: '체크아웃취소 신청완료!\n상세 정보를 확인하시겠습니까?',
			}, function(){
				if(this.key === 'ok') {
					cmdDetail();
				}
				else{
					findRefresh();
				}
			});
		}
		else {
			confirmDialog.confirm({
				msg: '테스트적용취소 신청완료!\n상세 정보를 확인하시겠습니까?',
			}, function(){
				if(this.key === 'ok') {
					cmdDetail();
				}
				else{
					findRefresh();
				}
			})
		}
		
	}
	else{
		if (reqCd == "11")  dialog.alert("체크아웃취소 신청실패.");
	    else dialog.alert("테스트적용취소 신청실패.");
	}
}

function findRefresh(){

	firstGrid.setData([]);
	firstGridaData = [];

	$('[data-ax5select="cboSys"]').ax5select("enabled");
	$('[data-ax5select="cboSrId"]').ax5select("enabled");
	$('#btnReq').attr('disabled',true);
	findProc();
}

function cmdDetail(){
	
	var winName = "checkCnlEnd";
	var f = document.popPam;   		//폼 name
    
    f.acptno.value	= acptNo;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.user.value 	= userId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    
	nHeight = 740;
    nWidth  = 1200;

	cURL = "/webPage/winpop/PopRequestDetail.jsp";
    myWin = winOpen(f, winName, cURL, nHeight, nWidth);
    
    findRefresh();
}

/*
		상세보기 미개발
		private function cmd_detail1(event:CloseEvent):void{
			if (event.detail == mx.controls.Alert.YES) {
	    		ExternalInterface.call("winopen",strUserId,"G11",acptNo,"");
			}
		}
		private function cmd_detail2(event:CloseEvent):void{
			if (event.detail == mx.controls.Alert.YES) {
	    		ExternalInterface.call("winopen",strUserId,"G12",acptNo,"");
			}
		}

		private function confChk1(event:CloseEvent):void {

			if (event.detail == mx.controls.Alert.YES) {
				confCall("Y");
			} else {
				confCall("N");
			}
		}
*/

/*
 * SR 정보 
 */
function cmdReqInfo_Click(){
	if (getSelectedIndex('cboSrId') < 1) {
		dialog.alert('SR정보를 확인 할 SR-ID를 선택하십시오.',function(){});
		return;
	}
	
	//ExternalInterface.call("winopen",userId,"SRINFO",cboIsrId.selectedItem.cc_srid);
	var nHeight, nWidth;
	if(winDevRep != null
			&& !winDevRep.closed) {
		winDevRep.close();
	}	
	
	var form = document.popPam;   						  //폼 name
	form.user.value = userId; 	 						  //POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.srid.value = getSelectedVal('cboSrId').value;    //POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)	
	form.acptno.value = '';

	nHeight	= 725;
    nWidth = 1200;
    
    winDevRep = winOpen(form, 'devRep', '/webPage/winpop/PopSRInfo.jsp', nHeight, nWidth);
}




