var pReqNo  = null;
var pUserId = null;

var retGrid  	   = new ax5.ui.grid();

var options 	   = [];

var data           = null; //json parameter
var cboReqPassData = null; //처리구분콤보 데이타
var retGridData    = null; //처리결과목록 데이타

var f = document.getReqData;
pReqNo = f.acptno.value;
pUserId = f.user.value;

$('#txtAcptNo').val(pReqNo.substr(0,4)+'-'+pReqNo.substr(4,2)+'-'+pReqNo.substr(6));

retGrid.setConfig({
    target: $('[data-ax5grid="retGrid"]'),
    sortable: true, 
    multiSort: true,
    showLineNumber: true,
    header: {
        align: "center"
    },
    body: {
        onClick: function () {
        	//this.self.clearSelect();
           this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	if (this.dindex < 0) return;

	       	var selIn = retGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
	    	if (this.item.cr_rstfile == null || this.item.cr_rstfile == "") return;			
	    	
	       	getResultLog(this.item.cr_rstfile);
        },
    	trStyleClass: function () {
    		if (this.item.cr_prcrst != null && this.item.cr_prcrst != '' && this.item.cr_prcrst != '0000'){
    			return "fontStyle-error";
    		}
    	},
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    contextMenu: {},
    columns: [
        {key: "SYSGBN", label: "구분",  width: '12%'},
        {key: "basersrc", label: "기준프로그램",  width: '19%', align: 'left'},
        {key: "cr_rsrcname", label: "대상프로그램",  width: '19%', align: 'left'},
        {key: "JAWON", label: "프로그램종류",  width: '10%', align: 'left'},
        {key: "resultsvr", label: "적용서버",  width: '15%', align: 'left'},
        {key: "prcrstname", label: "처리결과",  width: '10%'},
        {key: "prcdt", label: "처리시간",  width: '15%'},
    ]
});

$(document).ready(function(){
	if (pReqNo == null) {
		return;
	}
	
	//처리구분 콤보선택
	$('#cboReqPass').bind('change', function() {
		retGrid.setData([]);
		
		if (retGridData == null || retGridData.length < 1) return;
		
		var retGridDataFilterData = [];
		retGridData.forEach(function(lstData, Index) {
			if ( getSelectedIndex('cboReqPass') == 0 ) {
				retGridDataFilterData.push(lstData);
			} else {
				if (lstData.cr_prcsys == getSelectedVal('cboReqPass').value) {
					retGridDataFilterData.push(lstData);
				}
			}
		});
		retGrid.setData(retGridDataFilterData);
		retGrid.repaint();
		if (retGridDataFilterData.length>0) {
			retGrid.select(0);
	    	if (retGridDataFilterData[0].cr_rstfile == null || retGridDataFilterData[0].cr_rstfile == "") return;			
	    	
	       	getResultLog(retGridDataFilterData[0].cr_rstfile);
		}
	});
	
	//조회 클릭
	$('#btnSearCh').bind('click', function() {
		if (pReqNo == null) {
			return;
		}
		getPrcResultList();
	});
	
	//닫기클릭
	$('#btnClose').bind('click', function() {
		close();
	});
	
	getPrcGbnInfo();
});

//처리구분정보 가져오기
function getPrcGbnInfo(){
	data = new Object();
	data = {
		AcptNo 		: pReqNo,
		requestType : 'getResultGbn'
	}
	ajaxAsync('/webPage/winpop/PopPrcResultLogServlet', data, 'json',successGetResultGbn);
}
//처리구분정보 가져오기 완료
function successGetResultGbn(data){
	cboReqPassData = data;
	
	options = [];
	$.each(cboReqPassData,function(key,value) {
	    options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboReqPass"]').ax5select({
		options: options
	});
	
	//최초 화면로딩 시 조회(조회버튼 로직)
	$('#btnSearCh').trigger('click');
}
//처리결과 목록조회하기
function getPrcResultList() {
	data = new Object();
	data = {
		AcptNo 		: pReqNo,
		UserId 		: pUserId,
		requestType : 'getResultList'
	}
	ajaxAsync('/webPage/winpop/PopPrcResultLogServlet', data, 'json',successGetResultList);
}
//로그가져오기  완료
function successGetResultList(data) {
	retGridData = data;
	//retGrid.setData(retGridData);
	
	$('#cboReqPass').trigger('change');
}

//로그정보 가져오기
function getResultLog(rstfile) {
	$('#txtRetLog').val('');
	
	data = new Object();
	data = {
		rstfile 	: rstfile,
		requestType : 'getFileText'
	}
	ajaxAsync('/webPage/winpop/PopPrcResultLogServlet', data, 'json',successGetFileText);
}
//로그정보 가져오기 완료
function successGetFileText(data){
	if (data.indexOf('ERROR:') > -1) {
		$('#txtRetLog').val(data.substr(data.indexOf('ERROR:')+6));
	} else {
		$('#txtRetLog').val(data);
	}
}