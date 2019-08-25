
var acptNo 		= window.parent.pReqNo;				//신청번호
var userId 		= window.parent.pUserId;			//접속자 ID

var grdReqDoc  	= new ax5.ui.grid();

var grdReqDocData = null; 							//문서목록 데이타
var data          = null;							//json parameter
var fileHomePath  = null;							//첨부문서 홈 경로

grdReqDoc.setConfig({
    target: $('[data-ax5grid="grdReqDoc"]'),
    //sortable: true, 
    //multiSort: true,
    showLineNumber: true,
    header: {
        align: "center"
    },
    body: {
        onClick: function () {
        	this.self.clearSelect();
        	this.self.select(this.dindex);
        	if (this.colIndex == 1) {
        		//location.href = '/webPage/fileupload/upload?f='+this.item.orgname+'&folderPath='+fileHomePath+'\\'+this.item.savename;
        		location.href = '/webPage/fileupload/upload?fullPath='+fileHomePath+'/'+this.item.savename+'&fileName='+this.item.orgname;
        	}
        },
        onDBLClick: function () {
        	if (this.dindex < 0) return;

	       	var selIn = grdReqDoc.selectedDataIndexs;
	       	if(selIn.length === 0) return;
	       	
	       	//문서열기
			//location.href = '/webPage/fileupload/upload?f='+this.item.orgname+'&folderPath='+fileHomePath+'\\'+this.item.savename;
    		location.href = '/webPage/fileupload/upload?fullPath='+fileHomePath+'/'+this.item.savename+'&fileName='+this.item.orgname;
        },
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: "orgname", label: "파일명",  width: '85%', align: "left"},
        {key: 'b', label: '', align: 'center', 
        	formatter: function() {
        		return '<img width="16px" height="16px" src="/img/download.png" alt="file download" style="cursor:pointer"/>';
        	}
        }
    ]
});

$(document).ready(function() {
	//문서 홈 경로 가져오기
	data = new Object();
	data = {
		pathCd 		: '21',
		requestType : 'getTmpDir'
	}
	ajaxAsync('/webPage/modal/request/RequestDocModalServlet', data, 'json', successGetTmpDir);
	
	//X버튼 닫기
	$('#btnExit').bind('click', function() {
		popClose();
	});
	//하단 닫기버튼
	$('#btnClose').bind('click', function() {
		popClose();
	});
});
//문서 홈 경로 가져오기 완료
function successGetTmpDir(data){
	
	fileHomePath = data;
	
	//첨부문서 리스트 가져오기
	data = new Object();
	data = {
		AcptNo 		: acptNo,
		GbnCd		: '1',
		requestType : 'getFileList'
	}
	ajaxAsync('/webPage/modal/request/RequestDocModalServlet', data, 'json', successGetFileList);
	
}
//첨부문서 리스트 가져오기 완료
function successGetFileList(data){
	grdReqDocData = data;
	grdReqDoc.setData(grdReqDocData);
}
//모달닫기
function popClose() {
	window.parent.requestDocModal.close();
}