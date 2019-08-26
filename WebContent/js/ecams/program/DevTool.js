/**
 * 개발툴연계 화면
 * 
 * <pre>
 * 	작성자	: 허정규
 * 	버전 		: 1.0
 *  수정일 	: 2019-08-26
 * 
 */

var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부

var firstGrid		= new ax5.ui.grid();

var cboSysData		= [];
var cboReqData		= [];
var firstGridData 		= [];
var myWin			= null;
 
firstGrid.setConfig({
    target: $('[data-ax5grid="firstGrid"]'),
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
        },
    	trStyleClass: function () {
    		if(this.item.cr_status === 'Z'){
    			return "fontStyle-cncl";
     		} 
     		if(this.item.cr_status === '0' && this.item.visible === '1'){
    			return "fontStyle-ing";
     		} 
    	},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cr_rsrcname", 	label: "프로그램명",  	width: '20%', align: "left"},
        {key: "cr_story",	 	label: "프로그램설명",  	width: '30%', align: "left", editor: {type: "text"}},
        {key: "rsrctype", 	label: "리소스타입",  	width: '20%'},
        {key: "cm_dirpath", 	label: "프로그램경로",  	width: '30%', align: "left"}
    ]
});

$('[data-ax5select="cboSys"]').ax5select({
    options: []
});
$('[data-ax5select="cboJob"]').ax5select({
	options: []
});

$(document).ready(function() {
	
	$('#btnInit').bind('click', function() {
		screenInit();
	});
	
	$('#cboSys').bind('change',function(){
		getJobCbo();
	});

	$('#btnList').bind('click',function(){
		getPfmList();
	});

	$('#btnReq').bind('click',function(){
		insertPrg();
	});
	
	getSysCbo();
});


function getSysCbo(){

	var tmpData = {
			UserID: 	userId,
		requestType: 	'getSysCd'
	}
	
	ajaxAsync('/webPage/program/DevTool', tmpData, 'json',successGetSysCd);
}

function successGetSysCd(data){
	var options = [];
	
	for(var i=0; i<data.length;i++){
		options.push({value: data[i].cm_syscd, text: data[i].cm_sysmsg, cm_sysgb: data[i].cm_sysgb, cm_sysinfo : data[i].cm_sysinfo});
	};
	
	$('[data-ax5select="cboSys"]').ax5select({
        options: options
	});

	if(data.length > 0){
		if(data.length == 2){
			var selectVal = $('select[name=cboSys] option:eq(1)').val();
			$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
		}
	}
}


function getJobCbo(){

	var tmpData = {
		UserID: 	userId,
		SysCd:  getSelectedVal('cboSys').value,
		requestType: 	'getJobCd'
	}
	
	
	ajaxAsync('/webPage/program/DevTool', tmpData, 'json',successGetJobCbo);
}

function successGetJobCbo(data){
	var options = [];
	
	for(var i=0; i<data.length;i++){
		options.push({value: data[i].cm_jobcd, text: data[i].cm_jobname, });
	};
	
	$('[data-ax5select="cboJob"]').ax5select({
        options: options
	});

}

function getPfmList(){

		var stDay = "";
		var edDay = "";
		var tmpUser = "";
		
		if (getSelectedIndex('cboSys') <= 0) {
			dialog.alert("시스템을 선택하여 주시기 바랍니다."); 
			return;
		}
		if (getSelectedIndex('cboJob') <= 0) {
			dialog.alert("업무를 선택하여 주시기 바랍니다."); 
			return;
		}
		
		var PfmListData = new Object();
		PfmListData.tmpUser = tmpUser;
		PfmListData.fileName = $("#txtSearch").val().trim();
		PfmListData.SysCd = getSelectedVal('cboSys').value;
		PfmListData.JobCd = getSelectedVal('cboJob').value;
		
		var tmpData = {
				PfmListData: 	PfmListData,
				requestType: 	'getPfmList'
			}
			
			
		ajaxAsync('/webPage/program/DevTool', tmpData, 'json',successGetPfmList);
			//Cmd0101.getPfmList(tmpUser,mx.utils.$("#txtSearch").val().trim(),getSelectedVal('cboSys').value,getSelectedVal('getJobCd').value);   			
}

function successGetPfmList(data){
	
	firstGridData = data;
	$(firstGridData).each(function(i){
		if(this.cr_status != "Z"){
			firstGridData.splice(i,1);
		}
	});
	
	firstGrid.setData(firstGridData);
}

function insertPrg(){

	if (getSelectedIndex('cboSys') <= 0) {
		dialog.alert("시스템을 선택하여 주시기 바랍니다.");
		return;
	}
	if (getSelectedIndex('cboJob') <= 0) {
		dialog.alert("업무를 선택하여 주시기 바랍니다.");
		return;
	}
	
	if(firstGrid.getList('selected').length < 1){
		dialog.alert("등록할 프로그램을 선택한 후 처리하시기 바랍니다.");
		return;
	}
	var firstGridSelected = firstGrid.getList('selected');
	for (var i=0;firstGridSelected.length>i;i++) {				
		if (firstGridSelected[i].cr_story == null && firstGridSelected[i].cr_story == "") {
			dialog.alert("프로그램설명을 입력하여 주시기 바랍니다. ["+firstGridSelected[i].cr_rsrcname+"]");
			return;
		}
	}
	
	var tmpObj = new Object();
	var tmpArray = new Array();
	j = 0;
	for (i=0;firstGridSelected.length>i;i++) {
		if (firstGridSelected[i].cr_status == "Z") {
			tmpObj = new Object();
			var strExe = firstGridSelected[i].cm_exename;
			if (strExe != null && strExe != "") {
					if (strExe.substr(strExe.length-1) == ",") strExe = strExe.substr(0,strExe.length-1);
			}
			tmpObj.cm_dirpath = firstGridSelected[i].cm_dirpath;
			tmpObj.cm_info = firstGridSelected[i].cm_info;
			tmpObj.cm_dsncd = "";
			tmpObj.cr_rsrccd = firstGridSelected[i].cr_rsrccd;
			tmpObj.cr_rsrcname = firstGridSelected[i].cr_rsrcname;
			if (firstGridSelected[i].cm_info.substr(43,1) == "1") {
				if (firstGridSelected[i].cr_rsrcname.indexOf(".")<0) {
					tmpObj.cr_rsrcname = firstGridSelected[i].cr_rsrcname + strExe;
				}
			}
			if (firstGridSelected[i].cr_story != null && firstGridSelected[i].cr_story != "") {
				tmpObj.cr_story = firstGridSelected[i].cr_story
			}
			tmpArray.push(tmpObj);
			tmpObj = null;
		} 
	}
	tmpObj = new Object();
	tmpObj.userid = strUserId;
	tmpObj.cr_syscd = getSelectedVal('cboSys').value;
	tmpObj.cr_jobcd = getSelectedVal('cboJob').value;
	tmpObj.cm_jobname = getSelectedVal('cboJob').cm_jobname;
	
	var tmpData = {
			ectData: 	tmpObj,
			fileList  : 	tmpArray,
			requestType: 	'insCmr0020'
		}
		
		
	ajaxAsync('/webPage/program/DevTool', tmpData, 'json',successInsertPrg);
	//Cmd0101.insCmr0020(tmpObj,tmpArray.toArray());
}

function successInsertPrg(data){

	if (data == "OK") {
		dialog.alert("선택한 건에 대한 신규등록처리가 완료되었습니다. 결과를 확인하시기 바랍니다.");
	
		for (var i=0;i<firstGridData.length;i++){
			if (firstGridData[i].visible == "1" && firstGridData[i].checked == "1") {
				firstGridData[i].visible = "0";
				firstGridData[i].__disable_selection__ = true;
				firstGridData[i].checked = "0";
				firstGridData[i].cr_status = "3";						
			}
		}
	} else {
		dialog.alert(data);
	}
}