/** 체크아웃 화면 기능
 * 
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-01-29
 */
/*
 테스트 사용으로 인하여 값 강제적으로 넣어줌
var userName 	      = window.top.userName;
var userId 			  = window.top.userId;
var adminYN		  = window.top.adminYN;
var userDeptName = window.top.userDeptName;
var userDeptCd 	  = window.top.userDeptCd;
var reqCd 			  = window.top.reqCd;
*/

var userName 	      = "관리자";
var userId 			  = "MASTER";
var adminYN		  = "Y";
var userDeptName = "AzSoft";
var userDeptCd 	  = "000000100";
var reqCd 			  = "01";

console.log(userDeptName, userDeptCd);

//grid 생성
var firstGrid 	 = new ax5.ui.grid();
var secondGrid = new ax5.ui.grid();

var firstGridData = [];
var sysData 	  = null;
var srData 	  	  = null;
var prgData	  = null;
var treeData 	  = null;
var confirmData = null;
var gridSimpleData = [];
var secondGridData = [];

var options = [];
var strAcptNo = null;
var localHome = '';
var searchMOD = '';
var reqSw = false;
var outpos = '';
var localFileDownYN = false;
var dirCd = '';
var tmpPath = '';
var alertFlag = 0;
var firstGridColumns = null;
var excelAry = null;
var upFiles = null;

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



$(document).ready(function() {
	console.log('CheckOut.js load');
	screenInit();
	
	$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
	
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
		checkOutClick();
	});
	
	$('#reqText').bind('keypress',function(event){
		if(event.keyCode == 13){
			checkOutClick();
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
	ajaxAsync('/webPage/dev/CheckOutServlet', tmpData, 'json',successGetSysCbo);
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
	
	if(sysData.length > 0){
		if(strAcptNo != null && strAcptNo !=""){
			var selectVal = $('select[name=cboSys] option:eq(0)').val();
			$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
		}else{
			for (var i=0;sysData.length>i;i++) {
					if (sysData[i].setyn == "Y") {
						var selectVal = $('select[name=cboSys] option:eq('+i+')').val();
						$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
						break;
					}
				}
			var selectVal = $('select[name=cboSys] option:eq(0)').val();
			if (i>=sysData.length) $('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);;
		}
	} else {
		if (strAcptNo != null && strAcptNo != "") {
			showToast('사용권한이 없는 시스템에 대하여 체크아웃요청을 의뢰하였습니다.');
		}
	}
	
	getPrgCbo();
	getFileTree();
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
	
	ajaxAsync('/webPage/dev/CheckOutServlet', tmpData, 'json', successGetSrIdCbo);
	
	
	
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
}

function getPrgCbo(){
	var ajaxReturnData = null;
	var progInfoData = new Object();
	progInfoData.SysCd = getSelectedVal('cboSys').value;
	progInfoData.SelMsg = 'ALL';
	
	var tmpData = {
		progData: 		progInfoData,
		requestType: 	'PRGCOMBO'
	}

	ajaxAsync('/webPage/dev/CheckOutServlet', tmpData, 'json',successGetPrgCbo);


}

function successGetPrgCbo(data){
	prgData = data;
	options = [];

	$.each(prgData,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboRsrccd"]').ax5select({
        options: options
	});
	
	getFileTree();
}

function changeSrId(){
	
	$('#reqText').val('');
	$('#btnSrInfo').attr('disabled',true);

	if (getSelectedIndex('cboSrId') < 1) return;
	
	$('#reqText').val(getSelectedVal('cboSrId').text);
	$('#btnSrInfo').attr('disabled',false);
	
}

function changeSys(){
	
	firstGrid.setData([]);
	fristGridData = [];
	if (getSelectedVal('cboSys').cm_sysinfo.substr(4,1) == "1" && getSelectedVal('cboSys').cm_stopsw == "1") {
		showToast('이관통제를 위하여 일시적으로 형상관리 사용을 중지합니다.');

		$('#btnSearch').prop('disabled',true);
		return;
	}
	localHome = "";
	if(getSelectedVal('cboSys').cm_sysinfo.substr(9,1) == "1"){

		$('[data-ax5select="cboSrId"]').ax5select("disable");
		$('#btnSearch').prop('disabled',false);
	}else {
		$('[data-ax5select="cboSrId"]').ax5select("enable");
		$('#btnSearch').prop('disabled',false);
	}
	if (getSelectedVal('cboSys').localyn == "S") {//S: server only
	} else {
		if (getSelectedVal('cboSys').localyn == "A" || getSelectedVal('cboSys').localyn == "L") { //A: ALL
			var devHomeData = new Object();
			devHomeData.UserId = userId;
			devHomeData.SysCd = getSelectedVal('cboSys').value;
			
			var tmpData = {
				treeInfoData: 	devHomeData,
				requestType: 	'getDevHome'
			}
			
			
			ajaxAsync('/webPage/dev/CheckOutServlet', tmpData, 'json',successGetDevHome);
		}
	}

	$('#btnSearch').prop('disabled',false);
	getFileTree();
	getPrgCbo();
}

function successGetDevHome(data){
	localHome = data;
	
	if(localHome.length == 0 || localHome == ''){
		showToast('로컬로 체크아웃을 받고자 하는 경우 \n [기본관리-사용자환경설정]에서 \n 로컬 홈디렉토리를 지정한 후 진행하시기 바랍니다.');
	}
	
}

function getFileTree(){
	var fileTreeInfoData = new Object();
	fileTreeInfoData.UserId = userId;
	fileTreeInfoData.SysCd = getSelectedVal('cboSys').value;
	fileTreeInfoData.SecuYn = 'Y';
	fileTreeInfoData.SinCd = reqCd;
	fileTreeInfoData.ReqCd = '';
	
	var tmpData = {
		treeInfoData: 	fileTreeInfoData,
		requestType: 	'getRsrcPath'
	}
	
	
	ajaxAsync('/webPage/dev/CheckOutServlet', tmpData, 'json',successGetFileTree);

	
}

function successGetFileTree(data){

	treeData = data;
	var setting = {
			data: {
				simpleData: {
					enable: true,
				}
			},
			callback:{
				onExpand: myOnExpand,
				onClick : onClickTree,
			}
	};
	
	if(treeData !== 'ERR') {
		var obj = treeData;
		
		for(var i in treeData){
			if(obj[i].cm_codename =='' ){
				delete obj[i]
				continue;
			}
			obj[i].name = obj[i].cm_codename;
			delete obj[i].cm_codename;
			obj[i].isParent = true;
		}
		obj = JSON.stringify(obj).replace(/null,/gi,''); // delete 를 해도 empty 값으로 남아있어서 지워줌
		obj = JSON.parse(obj);
		treeData = obj;
		
		ztree = $.fn.zTree.init($('#treeDemo'), setting, treeData);
	}
	else{
		console.log(treeData);
	}
}


// 폴더 펼칠때 실행하는 함수
function myOnExpand(event, treeId, treeNode) {
	//root node 만 비동기 방식으로 뽑아오는 조건
	if(treeNode.pid != -1 || treeNode.children != undefined){
		return false;
	};
	//로딩중 icon class 추가
	$('#'+treeNode.tId+'_ico').removeClass().addClass('button ico_loading');
	setTimeout(function(){

		var ajaxReturnData = null;
		var childFileTreeData = new Object();
		childFileTreeData.UserId = userId;
		childFileTreeData.SysCd = getSelectedVal('cboSys').value;
		childFileTreeData.FileInfo = treeNode.cm_info;
		childFileTreeData.Rsrccd = treeNode.cm_rsrccd == undefined ?  treeNode.cr_rsrccd : treeNode.cm_rsrccd;
		childFileTreeData.FileId = treeNode.id;
		
		var tmpData = {
			childFileTreeData: childFileTreeData,
			requestType: 	'CHILDFILETREE'
		}
		ajaxReturnData = ajaxCallWithJson('/webPage/dev/CheckOutServlet', tmpData, 'json');

		var obj = ajaxReturnData;
			
		for(var i in ajaxReturnData){
			if(obj[i].cm_dirpath =='' ){
				delete obj[i]
				continue;
			}
			obj[i].name = obj[i].cm_dirpath;
			delete obj[i].cm_dirpath;
			obj[i].isParent = true;
		}
		obj = JSON.stringify(obj).replace(/null,/gi,''); // delete 를 해도 empty 값으로 남아있어서 지워줌
		obj = JSON.parse(obj);
		ajaxReturnData = obj;
		
		ztree.addNodes(treeNode,ajaxReturnData)
		$('#'+treeNode.tId+'_ico').removeClass().addClass('button ico_open');
	}, 200);
};

function onClickTree(event, treeId, treeNode) {
	var sysCd  		= getSelectedVal('cboSys').value;
	var sysgb  		= getSelectedVal('cboSys').cm_sysgb;
	
	var hasChild 	= treeNode.children != undefined? true : false;
	var root 		= treeNode.root;
	var fileId 		= treeNode.id;
	var fileInfo 	= treeNode.cm_info;
	var dsncd  		= treeNode.dsncd;
	var fileinfo 	= treeNode.cm_info;
	var rsrccd 		= treeNode.cm_rsrccd;
	var subrsrccd	= treeNode.cr_rsrccd
	var fullpath = null;
	
	if(treeNode.cm_volpath == null){
		fullpath = treeNode.fullpath;
	}else{
		fullpath = treeNode.cm_volpath;
	}
	
	if(fileId != '-1' ) {
		if( rsrccd ===  undefined) rsrccd = subrsrccd;
		//if( root === 'true' && !hasChild ) 					getChildFileTree(fileInfo, rsrccd, fileId);
		if( dsncd !== undefined || fullpath !== undefined) 	makeFileDir(fullpath, dsncd, fileinfo, hasChild, sysgb, rsrccd, sysCd);
	}
	
	searchMOD = 'T';
	
}

function makeFileDir(fullpath, dsncd, fileinfo, hasChild, sysgb, rsrccd, sysCd){
	var lb6split 	= fullpath.split('/');;
	var lb6String1 	= '';
	var lb6		 	= '';
	var toDsnCd 	= fullpath;
	var strDsn 		= dsncd;
	var devToolCon 	= false;
	var getFileData = {};
	var rsrcname = $('#txtRsrcName').val().trim();
	var selectedSubnode = $('#chkbox_subnode').is(':checked');
	
	if(!devToolCon && fileinfo != undefined && fileinfo.substr(26,1) == '1') {
		devToolCon = true;
	}
	
	if (lb6split.length < 2){
		$('#idx_lbl_path').text('');
	}
	
	for (var i=0 ; i < lb6split.length ; i++){
		if (lb6split[i].length>0) {
			if (i==0 && lb6split[i].indexOf(':')>0) {
				lb6String1 = lb6split[i];
			} else {
				lb6String1 = lb6String1+ '/'+ lb6split[i];
			}
		}
	}
	
	if (lb6String1.length > 0){
		$('#idx_lbl_path').text(lb6String1);
	}
	
	if (selectedSubnode  && lb6String1.length > 0 ){//하위디렉토리 포함 일때
		toDsnCd = 'F' + lb6String1 + '/';
	}else if (!selectedSubnode && lb6String1.length > 0 && devToolCon && !hasChild){
		toDsnCd = 'F' + lb6String1;
	}else if (!selectedSubnode && lb6String1.length > 0){
		toDsnCd = 'G' + lb6String1 + '/';
	}else if (strDsn != '' && strDsn != null) toDsnCd = strDsn;
	else toDsnCd = '';
	
	if (toDsnCd.length > 0 || (toDsnCd.length == 0 && selectedSubnode) ) {

		getFileData.userid = userId;
		getFileData.syscd = sysCd;
		getFileData.sysgb = sysgb;
		if (toDsnCd.length > 0){
			getFileData.dsncd = toDsnCd;
		} 
		getFileData.rsrccd = rsrccd;
		getFileData.reqcd = reqCd;
		if(rsrcname === undefined) getFileData.rsrcname = '';
		else getFileData.rsrcname = rsrcname;
		getFileData.reqcd = reqCd;
		
		
		var getFileDataInfo = {
				requestType: 'GETFILEGRID',
				getFileData: getFileData
		}
		
		getFileGridData(getFileDataInfo );
		
	}
	
	searchMOD = 'T';
}

function getFileGridData(getFileData) {
	ajaxAsync('/webPage/dev/CheckOutServlet', getFileData, 'json',successGetFileGridData);	
}

function successGetFileGridData(data){
	if(data != 'ERR') {
		firstGridData = data;

		//컬럼제거하기
		firstGridColumns = firstGrid.columns;
		if(firstGridColumns[2].key == 'errmsg'){
			firstGrid.removeColumn(2);
		}
		
		if(firstGridData.length == 0 && alertFlag == 1){
			showToast('검색 결과가 없습니다.');
		}
		alertFlag = 0;
		
		$(firstGridData).each(function(i){

			if(firstGridData[i].cm_info.substr(57,1) == '1' &&  firstGridData[i].cm_info.substr(44,1) == '0'){
				firstGridData[i].selected_flag = '1';
				firstGridData[i].view_dirpath = '이클립스에서만 체크아웃이 가능합니다.';
			}
			
			if(firstGridData[i].selected_flag == '1' || firstGridData[i].cr_status != '0' || firstGridData[i].cr_nomodify != '0'){
				
				firstGridData[i].filterData = true;
			}
			else{
				firstGridData[i].filterData = false;
			}
		});
		firstGrid.setData(firstGridData);
		//fileGrid.refresh(); //체크아웃후 새로운 데이터 안가져옴
		//changeFileGridStyle(firstGridData);
		
		secondGrid.setData([]);
		secondGridData = [];
	}
}

function clickSearchBtn() {
	alertFlag = 1;
	var getFileData = {};
	var rsrcname 	= null;
	getFileData.userid 	= userId;
	getFileData.syscd 	= getSelectedVal('cboSys').value;
	getFileData.sysgb 	= getSelectedVal('cboSys').cm_sysgb;
	getFileData.rsrccd 	= getSelectedVal('cboRsrccd').value;
	getFileData.reqcd 	= reqCd;
	rsrcname = $('#txtRsrcName').val().trim();
	if(rsrcname === '' || rsrcname === undefined) {
		showToast('검색단어를 입력한 후 검색하시기 바랍니다.');
		return;
	}
	else getFileData.rsrcname = rsrcname;
	var getFileDataInfo = {
			requestType: 'GETFILEGRID',
			getFileData: getFileData
	}
	
	searchMOD = 'B';
	getFileGridData(getFileDataInfo);
	
}

function addDataRow() {

	var calcnt = 0;
	var vercnt = 0;
	var secondGridList = new Array;
	var firstGridSeleted = firstGrid.getList("selected");
	var ajaxReturnData;
	
	alertFlag = 0;
	localFileDownYN = false;//로컬로 파일 다운 YN 초기화
	$(firstGridSeleted).each(function(i){
		
		if(this.filterData == true){
			return true;
		}
//		if (exlSw == true && this.errmsg != "정상") {
//		tmpArc.removeItemAt(i--);
//		continue;
//		}
		
		//RSCHKITEM	[27]-개발툴연계, [04]-동시적용항목CHECK, [47]-디렉토리기준관리, [09] 실행모듈Check
		if ((this.cm_info.substr(26,1) == "1" || this.cm_info.substr(3,1) == "1" || 
				this.cm_info.substr(46,1) == "1" || this.cm_info.substr(8,1) == "1") && this.filterData == false){
			calcnt++;
		}
		//RSCHKITEM	[45]-로컬에서개발, [38]-서버/로컬동시체크아웃
		if ( this.cm_info.substr(44,1) == "1" && this.filterData == false) {//45:로컬에서개발
			localFileDownYN = true;//로컬로 파일 다운 여부
			if (this.pcdir1 == null || this.pcdir1 == "") {
				showToast("로컬 홈디렉토리를 지정하지 않았습니다. 기본관리>사용자환경설정에서 홈디렉토리지정 후 처리하시기 바랍니다.");
				return false;
			}
		}
		
		if (reqCd == "02"){
			if (this.cr_lstver == "sel"){
				vercnt++;
				calcnt++;
			}
		}
		
		if(this.filterData!=true){
			this.filterData = true;
			secondGridList.push($.extend({}, this, {__index: undefined}));
		}
	});
	
	
	if (vercnt>0){				
		showToast("버전을 선택하여 주십시요.");
		return;
	}
	if ((secondGrid.list.length + secondGridList.length) > 300){
		showToast("300건까지 신청 가능합니다.");
		return;
	}
	
	if (secondGridList.length != 0){
		if (calcnt > 0){
			if (secondGridList.length > 0){
					var downFileData = new Object();
					downFileData.strUserId = userId;
					downFileData.strReqCD = reqCd;
					downFileData.syscd = getSelectedVal('cboSys').value;
					downFileData.sayu = '';
					downFileData.localFileDownYN = localFileDownYN;
					
					var tmpData = {
						downFileData : downFileData,
						removedFileList : secondGridList,
						requestType : 'getDownFileList'
					}
					ajaxReturnData = ajaxCallWithJson('/webPage/dev/CheckOutServlet', tmpData, 'json');
					checkDuplication(ajaxReturnData);
				}
		} else {
			checkDuplication(secondGridList);
		}
	}
	
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
			if(firstGridData[j].cr_itemid == secondGridSeleted[i].cr_itemid && firstGridData[j].cr_rsrcname == secondGridSeleted[i].cr_rsrcname || 
				firstGridData[j].cr_itemid == originalData && originalData != null){
				
				firstGridData[j].filterData = "";
				return false;
			}
		});
	});
	secondGrid.removeRow("selected");
	firstGrid.repaint();
	secondGridData = clone(secondGrid.list);
	
	if (secondGrid.list.length == 0){

		$('[data-ax5select="cboSys"]').ax5select("enable");
		$('#btnReq').prop('disabled',true);
		$('#btnDiff').hide();
		outpos = "";
	} else if ($('#btnDiff').css('display') != 'none') {
		findSw = false;
		for (i=0;secondGrid.list.length>i;i++) {
			var secondGridItem = secondGrid.list[i];
			if (secondGridItem.cr_lstusr != userId 
			  && secondGridItem.cm_info.substr(1,1) == "1" 
			  && secondGridItem.cm_info.substr(2,1) == "0" 
			  && secondGridItem.cm_info.substr(9,1)=="0" 
			  && secondGridItem.cm_info.substr(44,1)=="1") {
				findSw = true;
			}
			if ( secondGridItem.cm_info.substr(44,1) == "1" ) {//45:로컬에서개발
				if ( outpos == "R" ) {
					outpos = "A";
				} else if ( outpos != "A" ) {
					outpos = "L";
				}
			} else {
				if ( outpos == "L" ){
					outpos = "A";
				} else if ( outpos != "A" ) {
					outpos = "R";
				}
			}
		}
		if ( !findSw ) {
			$('#btnDiff').hide();
			$('#btnReq').prop('disabled',false);
		}
	}
	$('#totalCnt').text(secondGrid.list.length);
}

function checkDuplication(downFileList) {

	var findSw = true;
	var secondGridList = new Array;
	
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
		$(downFileList).each(function(i){
			var currentItem = downFileList[i];
			//하단리스트에 추가한 프로그램중, 로컬 프로그램이 존재하는지 체크 시작  && 바이너리가 아닌거 && 체크아웃 대상인거 && 체크아웃무가 아닌거
			if( !findSw
				&&		currentItem.cm_info.substring(44,45)== '1'
				&& 	currentItem.cm_info.substring(1,2) 	== '1'
				&& 	currentItem.cm_info.substring(2,3) 	== '1'
				&& 	currentItem.cm_info.substring(9,10) == '1'
				&& 	currentItem.cr_lstusr != userId){
				findSw = true;
			}
			
			if(currentItem.baseitemid == currentItem.cr_itemid){
				$(firstGridData).each(function(j){
					if(firstGridData[j].cr_itemid == currentItem.cr_itemid) {
						firstGridData[j].filterData = true;
						secondGridList.push($.extend({}, firstGrid.list[j], {__index: undefined}));
						return false;
					}
					
				});
			}
		});
	}
	
	
	if(secondGrid.list.length > 0 ) {
		if((secondGrid.list.length + downFileList.length > 300) && localFileDownYN){
			showToast('300건 이하로 선택 가능합니다.[추가가능건수:'+(300-secondGrid.list.length)+']');
			return;
		}
	}else if (secondGrid.list.length > 300 && localFileDownYN ) {
		showToast('300건 이하로 선택 가능합니다.[추가가능건수:'+(secondGrid.list.length)+']');
		return;
	}
	
	firstGrid.repaint();
	secondGrid.addRow(secondGridList);	
	
	if(secondGrid.list.length > 0 ) {

		$('[data-ax5select="cboSys"]').ax5select("disable");
		$('#btnReq').show();
		//$('#btnDiff').show();
		
		secondGrid.list.forEach(function(requestFileGridData, requestFileGridDataIndex) {
			// grid row header 달기
			requestFileGridData.seq = requestFileGridDataIndex + 1;
			var currentItem = requestFileGridData;
			if( currentItem.cm_info.substr(44,1) == '1') {
				if( outpos == 'R'){
					outpos = 'A';
				} else if ( outpos != 'A'){
					outpos = 'L';
				}
			} else {
				if( outpos == 'L' ) {
					outpos = 'A';
				} else if ( outpos != 'A' ) {
					outpos = 'R';
				}
			}
		})
	}
	
	secondGridData = clone(secondGrid.list);
	simpleData();
}

/* 등록 버튼을 누른 경우 처리 이벤트 헨들러 */
function checkOutClick()
{
	if( !$('#cboSrId').prop('disabled') && getSelectedIndex('cboSrId') < 1){
		showToast("SR-ID를 선택하여 주십시오.");
		return;
	}
	var tmpSayu = $('#reqText').val().trim();
	if (tmpSayu.length == 0){
		showToast("신청사유를 입력하여 주십시오.");
		$('#reqText').focus();
		return;
	}
	if (secondGrid.list == 0){
		showToast("신청할 파일을 추가하여 주십시오.");
		return;
	}
	if (reqSw == true) {
		showToast("현재 처리중입니다. 잠시 기다려 주시기 바랍니다.");
		return;
	}
	confirmDialog.confirm({
		msg: '체크아웃 하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			ckoConfirm();
		}
	});
}

function ckoConfirm(){
	var strQry = "";
	var strRsrcCd = "";
	var ajaxReturnData;
	strQry = reqCd;
	for (var x=0;x<secondGrid.list.length;x++) {
		if (strRsrcCd != null && strRsrcCd != "") {
			if (strRsrcCd.indexOf(secondGrid.list[x].cr_rsrccd)<0) {
				strRsrcCd = strRsrcCd + "," + secondGrid.list[x].cr_rsrccd;
			}
		} else strRsrcCd = secondGrid.list[x].cr_rsrccd;
	}
	
	var confirmInfoData = new Object();
	confirmInfoData.sysCd = getSelectedVal('cboSys').value;
	confirmInfoData.strReqCd = reqCd;
	confirmInfoData.strRsrcCd = strRsrcCd;
	confirmInfoData.ReqCd = reqCd;
	confirmInfoData.userId = userId;
	confirmInfoData.strQry = strQry;
	
	var tmpData = {
			requestType : 'confSelect',
			confirmInfoData : confirmInfoData
	}	
	ajaxReturnData = ajaxCallWithJson('/webPage/dev/CheckOutServlet', tmpData, 'json');
	
	if (ajaxReturnData == "X") {
		showToast("로컬PC에서 파일을 전송하는 결재단계가 지정되지 않았습니다. 형상관리시스템담당자에게 연락하여 주시기 바랍니다.");
	} else	if (ajaxReturnData == "C") {
		confirmDialog.confirm({
			msg: '결재자를 지정하시겠습니까?',
		}, function(){
			if(this.key === 'ok') {
				confCall("Y");
			}
			else{
				confCall('N');
			}
		});
	} else if (ajaxReturnData == "Y") {
		confCall("Y");
    } else if (ajaxReturnData != "N") {
    	showToast("결재정보가 등록되지 않았습니다. 형상관리시스템담당자에게 연락하여 주시기 바랍니다.");
    } else {
		confCall("N");
    }
}

function confCall(GbnCd){
	var strQry = "";
	var tmpRsrc = "";
	var ajaxReturnData;
	strQry = reqCd;
	for (var x=0;x<secondGridData.length;x++) {
		if (tmpRsrc != null && tmpRsrc != "") {
			if (tmpRsrc.indexOf(secondGridData[x].cr_rsrccd) < 0)
                tmpRsrc = tmpRsrc + "," + secondGridData[x].cr_rsrccd;
		} else tmpRsrc = secondGridData[x].cr_rsrccd;
	}
	

	var confirmInfoData = new Object();
	confirmInfoData.UserID = userId;
	confirmInfoData.ReqCD  = reqCd;
	confirmInfoData.SysCd  = getSelectedVal('cboSys').value;
	confirmInfoData.Rsrccd = tmpRsrc;
	confirmInfoData.QryCd = strQry;
	confirmInfoData.EmgSw = "N";
	confirmInfoData.PrjNo = "";
//	if (optPos1.selected) etcObj.OutPos = "R";
//	else etcObj.OutPos = "L";
	confirmInfoData.OutPos = outpos;
	if (getSelectedIndex('cboSrId') > 0) confirmInfoData.PrjNo = getSelectedVal('cboSrId').value;
	
  	if (GbnCd == "Y") {//결재팝업
		gyulPopUp = Confirm_select(PopUpManager.createPopUp(this, Confirm_select, true));
		gyulPopUp.parentfuc = reqQuest;
		gyulPopUp.parentvar = confirmInfoData;
        PopUpManager.centerPopUp(gyulPopUp);//팝업을 중앙에 위치하도록 함
        gyulPopUp.minitApp();
       
	} else if (GbnCd == "N") {

		var tmpData = {
			confirmInfoData: 	confirmInfoData,
			requestType: 	'Confirm_Info'
		}
		
		ajaxReturnData = ajaxCallWithJson('/webPage/dev/CheckOutServlet', tmpData, 'json');
		confirmData = ajaxReturnData;
		requestCheckOut();
	}
}

function reqQuest() //결재팝업
{
	var closeFlag = gyulPopUp.closeFlag;

	confirm_dp = new ArrayCollection(gyulPopUp.grdLst2_dp.source);
	PopUpManager.removePopUp(gyulPopUp);

	if (closeFlag) requestCheckOut();
	else return;
}

function requestCheckOut(){
	
	reqSw = true;
	var ajaxReturnStr = null;
	var requestData = {};
	requestData.UserID = userId;
	requestData.ReqCD  = reqCd;
	requestData.Sayu	 = $('#reqText').val().trim();
	requestData.cm_syscd = getSelectedVal('cboSys').value;
	requestData.cm_sysgb = getSelectedVal('cboSys').cm_sysgb;
	requestData.ckoutpos = outpos;
	
	if(!$('#cboSrId').prop('disabled') && getSelectedIndex('cboSrId') > 0 ) {
		requestData.srid 		 = getSelectedVal('cboSrId').value;
		requestData.cc_reqtitle  = getSelectedVal('cboSrId').cc_reqtitle;
	}else {
		requestData.srid  		 = '';
		requestData.cc_reqtitle  = '';
	}
	requestData.ckoutpos = outpos;
	var tmpData = {
		requestData: 	requestData,
		requestFiles:	secondGridData,
		requestConfirmData:	confirmData,
		requestType: 	'request_Check_Out'
	}

	ajaxReturnData = ajaxCallWithJson('/webPage/dev/CheckOutServlet', tmpData, 'json');
	
	reqSw = false;
	//파일업로드 팝업 미개발
	/*
	if (upFiles.length > 0){
		fileUpPop2 = fileUpSender(PopUpManager.createPopUp(this, fileUpSender, true));
        PopUpManager.centerPopUp(fileUpPop2);//팝업을 중앙에 위치하도록 함
        fileUpPop2._arrUploadFiles = new ArrayCollection(upFiles.source);
        fileUpPop2.acptNo = event.result
        fileUpPop2.fileGb = "1";
	    fileUpPop2.parentfuc = fileSenderClose;
	    fileUpPop2.initCom();
	}else{
		fileSenderClose_sub();
	}
	*/
	fileSenderClose();
}

function fileSenderClose(){

	var ajaxResultData = null;
	if ( outpos == "A" || outpos == "L" ) {
		var tmpData = {
				ACPTNO		: 	strAcptNo,
				requestType	: 	'svrFileMake'
			}
			
			ajaxResultData = ajaxCallWithJson('/webPage/dev/CheckOut', tmpData, 'json');
			if(ajaxResultData !== 'ERR' && ajaxResultData === '0'){
				
				var fileInfo = {
					ACPTNO		: 	strAcptNo,
					requestType	: 	'getProgFileList'
				}
				
				ajaxResultDataWithGetFileList = ajaxCallWithJson('/webPage/dev/CheckOut', fileInfo, 'json');
				if(ajaxResultDataWithGetFileList !== 'ERR' && ajaxResultDataWithGetFileList === '0'){
					
					var progFiles = ajaxResultDataWithGetFileList;
					if (progFiles.length == 0) {
						ckout_end();
					} else {
						if (progFiles[0].cr_rsrcname == "ERROR") {
							alert("결재처리 중 오류가 발생하였습니다.");
							ckout_end();
							return;
						} else { // 파일업로드 팝업만들기 미개발
							fileUpDownPop = progFileUpDown_Agent(PopUpManager.createPopUp(this, progFileUpDown_Agent, true));
				            PopUpManager.centerPopUp(fileUpDownPop);//팝업을 중앙에 위치하도록 함
			    	        fileUpDownPop.acptNo = strAcptNo;
			    	        fileUpDownPop.UserId = userId;
			    	        fileUpDownPop.progFile_dp = progFiles;
			    	        fileUpDownPop.popType = "G";
			    	        fileUpDownPop.parentFunc = fileDownChk_Close;
			        	    fileUpDownPop.initApp();
						}
					}
				}
				return;
				
			}
			
			alert(ajaxResultData + '[조치 후 체크아웃 상세화면에서 재처리하시기 바랍니다.]');
			ckout_end();
			return;
	} else {
		ckout_end();
	}
}

function ckout_end(){
	confirmDialog.confirm({
		msg: '체크아웃 신청완료! 상세 정보를 확인하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			cmd_detail(); //미개발
		}
	});
	
	secondGrid.setData([]);
	secondGridData = [];
	
	upFiles = null;
	upFiles = new Array();
	
	$('[data-ax5select="cboSys"]').ax5select("disable");
	
	$('#btnDiff').hide();
	$('#btnReq').prop('disabled',true);
	outpos = "";

//neo. 화면클리어 제거됨.
//	if (chkCLEAR.selected){//화면클리어
//		subnode_checkbox.selected = false;
//		rsrc_txt.text = "";
//		if (cboIsrId.selectedIndex<1) sayu_txt.text="";
//		list1_grid_dp1 = null;
//		list1_grid_dp1 = new ArrayCollection();
//			list1_grid.dataProvider = list1_grid_dp1;
//		//jobcd_combo.selectedIndex = 0;
//		//jobcd_combo.selectedItem = cboJob_dp.getItemAt(0);
//	} else{//입력상태 그대로
		if(searchMOD == "B"){//B:조회버튼 클릭시,  T:트리구조 클릭시
			clickSearchBtn();
		}else {
			if (ztree.getSelectedNodes(true).length == 0){
				return;
			}
			$('#'+ztree.getNodesByParam("id", ztree.getSelectedNodes(true)[0].id)[0].tId+'_a').click();
		}
//	}
}

/* 미개발
 * SR 정보 
 */
function cmdReqInfo_Click(){
	if (cboIsrId.selectedIndex < 1) {
		Alert.show("SR정보를 확인 할 SR-ID를 선택하십시오.");
		return;
	}
	ExternalInterface.call("winopen",userId,"SRINFO",cboIsrId.selectedItem.cc_srid);
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

//체크아웃상세보기
function simpleData(){
	
	if (secondGrid.list.length < 1) return;
	
	gridSimpleData = clone(secondGridData);
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
	$('#totalCnt').text(secondGrid.list.length);
}

function fileTypeCheck(obj) {
	
	pathpoint = obj.value.lastIndexOf('.');
	filepoint = obj.value.substring(pathpoint+1,obj.length);
	filetype = filepoint.toLowerCase();
	if(filetype=='xls' || filetype=='xlsx') {
		getTmpDir('99');
	} else {
		showToast('엑셀(*.xls,*.xlsx) 파일만 업로드 가능합니다.');
		parentObj  = obj.parentNode
		node = parentObj.replaceChild(obj.cloneNode(true),obj);
		return false;

	}
}

/*일괄체크아웃엑셀가져오기*/
function getTmpDir(dirCdPram){
	var ajaxReturnData = null;
	dirCd = dirCdPram;
	var tmpData = {
		pCode: 	dirCd,
		requestType: 	'getTmpDir'
	}
	ajaxReturnData = ajaxCallWithJson('/webPage/dev/CheckOutServlet', tmpData, 'json');
	getTmpPath(ajaxReturnData);
}

function formatFileSize(numSize) {
	var strReturn;
	numSize = Number(numSize / 1000);
	strReturn = String(numSize.toFixed(1) + " KB");
	if (numSize > 1000) {
		numSize = numSize / 1000;
		strReturn = String(numSize.toFixed(1) + " MB");
		if (numSize > 1000) {
			numSize = numSize / 1000;
			strReturn = String(numSize.toFixed(1) + " GB");
		}
	}
	return strReturn;
}
function getTmpPath(result){
	if (dirCd == "99") {
		tmpPath = result ;
		dirCd = "F2";
		
		getTmpDir(dirCd);
		
	} else if (dirCd == "F2") {
		startUpload(result);
	}
}

function startUpload(strURL) {
	var excelFileSub = $('#excelFile')[0].files[0];
	var excelFile = null;
	
	// 파일 업로드 jsp 를 호출해야함
	var formData = new FormData();
	tmpPath = 'C:\\eCAMS\\webTmp\\'; // 테스트 임시경로
	formData.append('fullName',tmpPath);
	formData.append('fullpath',tmpPath+userId+"_excel.tmp");
	formData.append('file',excelFileSub);
	
	// ajax
    $.ajax({
        url:'/webPage/fileupload/'+strURL,
        type:'POST',
        data:formData,
        async:false,
        cache:false,
        contentType:false,
        processData:false
    }).done(function(response){
    	onUploadCompleteData(response);
    	
    }).fail(function(xhr,status,errorThrown){
    	alert('오류가 발생했습니다. \r 오류명 : '+errorThrown + '\r상태 : '+status);
    }).always(function(){
    	// file 초기화
    	var agent = navigator.userAgent.toLowerCase();
    	if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ){
    	    $("#excelFile").replaceWith( $("#excelFile").clone(true) );
    	} else {
    	    $("#excelFile").val("");
    	}
    });
}

function onUploadCompleteData(filePath){
	var headerDef = new  Array();
	headerDef.push("cr_rsrcname");
	filePath = replaceAllString(filePath,"\n","");
	
	var tmpData = {
			filePath : filePath,
			headerDef: headerDef,
			requestType: 'getArrayCollection'
	}
	ajaxAsync('/webPage/dev/CheckOutServlet', tmpData, 'json',successGetArrayCollection);	
}

function successGetArrayCollection(data){
	excelAry = data;
	for (var i=0;excelAry.length>i;i++) {
		for (var j=i+1;excelAry.length>j;j++) {
			if (excelAry[i].cr_rsrcname == excelAry[j].cr_rsrcname) {
				excelAry.splice(i,1);
				i--;
				break;
			}
		}
	}
	alertFlag = 1;
	
	// ax5grid 컬럼추가하기 
	firstGridColumns = firstGrid.columns;
	if(firstGridColumns[2].key != 'errmsg'){
		var excelDataColums = {key: 'errmsg', label: '체크결과',  width: '15%'};
		firstGridColumns.splice(2, 0,excelDataColums);
		firstGrid.config.columns = firstGridColumns;
	}
	firstGrid.setConfig();
	secondGrid.setData([]);
	secondGridData = [];
	
	var fileData = {};
	fileData.SysCd = getSelectedVal('cboSys').value;
	fileData.SysGb = getSelectedVal('cboSys').cm_sysgb;
	fileData.ReqCd = reqCd;
	var tmpData = {
			fileList : excelAry,
			fileData: fileData,
			requestType: 'getFileList_excel'
	}
	ajaxAsync('/webPage/dev/CheckOutServlet', tmpData, 'json',successGetFileList_excel);
}

function successGetFileList_excel(data){
	var tmpAry = data;
	var tmpAry2 = new Array;
	var tmpObj = {};
	var tmpObj2 = {};
	var errcnt = 0;
	/*
	tmpObj2 = excelAry[0];
	tmpObj2.result = "처리결과";
	excelAry.splice(0,0,tmpObj2);
	*/
	tmpObj2 = null;
	for (var i=0;i<tmpAry.length;i++){
		tmpObj = {};
		tmpObj = tmpAry[i];
		tmpObj2 = {};
		tmpObj2 = excelAry[Number(tmpObj.linenum)];
		tmpObj2.result = tmpObj.errmsg;
		//excelAry.splice(Number(tmpObj.linenum),0,tmpObj2);
		tmpObj2 = null;

		tmpAry2.push(tmpObj);
		tmpObj = null;
	}
	$(tmpAry2).each(function(i){

		if(tmpAry2[i].errmsg == '정상'){
			
			tmpAry2[i].filterData = false;
		}
		else{
			tmpAry2[i].filterData = true;
		}
	});

	firstGrid.setData(tmpAry2);
	firstGridData = tmpAry2;
	tmpObj = null;
	tmpObj2 = null;
	if (tmpAry2.length == 0){
		showToast("정상으로 체크아웃 할 파일이 없습니다.");
		alertFlag = 0;
		return;
	} else {
		alertFlag = 2;
		//selectall_checkbox.selected = true;
		//select_grid1();
	}
}

//파일비교 미개발
function cmdDiff_click(){
	var tmpArray = new Array;
	var tmpObj = {};
	
	for (var i=0;secondGridData.length>i;i++) {
		var Data = secondGridData[i];
		if (Data.cr_lstusr != userId 
		   && Data.cm_info.substr(1,1) == "1"//체크아웃대상
		   && Data.cm_info.substr(2,1) == "0"//체크아웃무 아닌거
		   && Data.cm_info.substr(9,1)=="0" //바이너리 아닌거
		   && Data.cm_info.substr(44,1)=="1") {//로컬개발인거
			tmpObj = {};
			tmpObj = Data;
			tmpObj.errflag = "0";
			tmpObj.sendflag = "0";
			tmpObj.cm_dirpath = Data.pcdir1;
			tmpObj.pcdir = Data.localdir;
			tmpArray.push(tmpObj);
			tmpObj = null;
		}
	}
	tmpObj = null;
	if (tmpArray.length>0) {
		fileUpDownPop = progFileUpDown_Agent(PopUpManager.createPopUp(this, progFileUpDown_Agent, true));
        PopUpManager.centerPopUp(fileUpDownPop);//팝업을 중앙에 위치하도록 함
        fileUpDownPop.acptNo = syscd_combo.selectedItem.cm_syscd;
        fileUpDownPop.UserId = userId;
        fileUpDownPop.acptNo = "999999999999";
        fileUpDownPop.progFile_dp = tmpArray;
        fileUpDownPop.popType = "F";
        fileUpDownPop.parentFunc = FileUpLoad_Handler;
	    fileUpDownPop.initApp();
		} 
}
function FileUpLoad_Handler(ret){
	var tmpArray = new ArrayCollection();
	var tmpObj = {};
	if (ret){
		for (var i=0;fileUpDownPop.listgrid_dp.length>i;i++) {
			if (fileUpDownPop.listgrid_dp.getItemAt(i).errflag != "ERROR") {
				tmpObj = {};
				tmpObj = fileUpDownPop.listgrid_dp.getItemAt(i);
				tmpArray.addItem(tmpObj);
				tmpObj = null;
			}	
		}
		Cmr0100.diffList(userId,tmpArray.toArray());
	}
	PopUpManager.removePopUp(fileUpDownPop);
	
	tmpObj = null;
	tmpArray = null;
}
function difflist_resultHandler(event){
	var tmpArray = new ArrayCollection(event.result);
	if (tmpArray.length>0) {
		modPopUp = eCmr0100_relat(PopUpManager.createPopUp(this, eCmr0100_relat, true));
		PopUpManager.centerPopUp(modPopUp);//팝업을 중앙에 위치하도록 함
//		modPopUp.width = screen.width - 80;
//		modPopUp.height = screen.height - 200;
        modPopUp.grdLst_dp = tmpArray;
        modPopUp.parentFunc = merge_Handler;
	    modPopUp.minitApp();	
	} else {
		Alert.show("수정된 부분이 없습니다. 체크아웃요청을 진행해 주시기 바랍니다.");
		regist_button.enabled = true;
	}
}
function merge_Handler(ret){
	var tmpArray = new ArrayCollection();
	var tmpObj = {};
	var j = 0;
	if (ret) tmpArray = modPopUp.grdLst_dp;
	PopUpManager.removePopUp(modPopUp);
	if (ret) {			
		for (var i=0;tmpArray.length>i;i++) {
			for (j=0;list2_grid_dp1.length>j;j++) {
				if (tmpArray.getItemAt(i).cr_itemid == list2_grid_dp1.getItemAt(j).cr_itemid) {
					tmpObj = {};
					tmpObj = list2_grid_dp1.getItemAt(j);
					tmpObj.chkrstcd = tmpArray.getItemAt(i).chkrstcd;
					list2_grid_dp1.setItemAt(tmpObj,j);
					tmpObj = null;
					break;
				}
			}	
		}
		regist_button.enabled = true;
	}
	tmpArray = null;
	tmpObj = null;
}
