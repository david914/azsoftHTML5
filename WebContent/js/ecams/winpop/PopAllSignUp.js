/**
 * [사용자정보 > 사용자일괄등록] 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-24
 * 
 */


var userId 		= $('#userId').val();			// 접속자 ID

var signUpGrid	= new ax5.ui.grid();
var signUpGridData 	= null;

var tmpPath			= '';
var uploadJspFile 	= '';
var errSw			= false;

signUpGrid.setConfig({
    target: $('[data-ax5grid="signUpGrid"]'),
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
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "CM_USERID", 		label: "*사용자ID",  	width: '8%'},
        {key: "CM_USERNAME",	label: "*이름",  		width: '7%'},
        {key: "CM_UPPERPROJECT",label: "*본부명",  	width: '9%'},
        {key: "CM_PROJECT", 	label: "*부서명",  	width: '9%'},
        {key: "CM_POSITION", 	label: "*직위명",  	width: '7%'},
        {key: "CM_CODENAME", 	label: "직무명",  	width: '9%'},
        {key: "CM_SYSCD", 		label: "시스템명",  	width: '15%'},
        {key: "CM_JOBNAME", 	label: "업무명",  	width: '15%'},
        {key: "CM_EMAIL", 		label: "이메일주소",  	width: '10%'},
        {key: "CM_TELNO1", 		label: "전화번호",  	width: '8%'},
        {key: "CM_TELNO2", 		label: "핸드폰번호",  	width: '8%'},
    ]
});

$('input:radio[name^="radio"]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});

$(document).ready(function() {
	getTmpDir();
	
	$('#btnExcel').prop('disabled', true);
	$('#btnDbSave').prop('disabled', true);
	
	// 엑셀열기 클릭
	$('#btnExcelOpen').bind('click', function() {
		$('#excelFile').trigger('click');
	});
	// 엑셀 파일 선택
	$('#excelFile').bind('change', function() {
		fileTypeCheck(this);
	})
	// 셀추가 클릭
	$('#btnCellAd').bind('click', function() {
		
	});
	// 엑셀저장 클릭
	$('#btnExcel').bind('click', function() {
		signUpGrid.exportExcel('사용자일괄등록.xls');
	});
	// 디비저장 클릭
	$('#btnDbSave').bind('click', function() {
		saveDb();
	});
});

// 유저목록 디비 저장
function saveDb() {
	for(var i = 0; i < signUpGridData.length; i++) {
		var data = signUpGridData[i];
		if(data.CM_USERID)
			
		if(data.CM_USERID === null || data.CM_USERID === ''){
			dialog.alert('ID를 입력하세요.', function() {});
			return;
		}
		if(data.CM_USERNAME === null || data.CM_USERNAME === ''){
			dialog.alert('이름을 입력하세요.', function() {});
			return;
		}
		if(data.CM_POSITION === null || data.CM_POSITION === ''){
			dialog.alert('직위를 입력하세요.', function() {});
			return;
		}
	}
	
	var data = new Object();
	data = {
		rtList 		: signUpGridData,
		requestType	: 'saveDb'
	}
	ajaxAsync('/webPage/administrator/UserInfo', data, 'json',successSaveDb);
}

// 유저목록 디비 저장 완료
function successSaveDb(data) {
	console.log(data);
	dialog.alert('처리되었습니다.', function() {});
}

//엑셀 파일 업로드시 파일타입 체크
function fileTypeCheck(obj) {
	var pathpoint = obj.value.lastIndexOf('.');
	var filepoint = obj.value.substring(pathpoint+1,obj.length);
	filetype = filepoint.toLowerCase();
	if(filetype=='xls' || filetype=='xlsx') {
		startUpload();
	} else {
		dialog.alert('엑셀 파일만 업로드 가능합니다.', function() {});
		parentObj  = obj.parentNode
		node = parentObj.replaceChild(obj.cloneNode(true),obj);
		return false;
	}
}

//엑셀 파일을 임시 경로에 업로드
function startUpload() {
	var excelFileSub = $('#excelFile')[0].files[0];
	var excelFile = null;
	
	// 파일 업로드 jsp 를 호출해야함
	var formData = new FormData();
	
	// 테스트 임시경로
	tmpPath = 'C:\\fileupload\\tmp\\';
	formData.append('fullName', tmpPath + userId + "_signUpExcel.tmp");
	formData.append('fullpath', tmpPath);
	formData.append('file',excelFileSub);
	
    $.ajax({
        url:'/webPage/fileupload/'+uploadJspFile,
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
// 엑셀파일 완료 후 
function onUploadCompleteData(filePath){
	var headerDef = new  Array();
	filePath = replaceAllString(filePath,"\n","");
	
	headerDef.push("CM_USERID");
	headerDef.push("CM_USERNAME");
	headerDef.push("CM_UPPERPROJECT");
	headerDef.push("CM_PROJECT");
	headerDef.push("CM_POSITION");
	headerDef.push("CM_CODENAME");
	headerDef.push("CM_SYSCD");
	headerDef.push("CM_JOBNAME");
	headerDef.push("CM_EMAIL");
	headerDef.push("CM_TELNO1");
	headerDef.push("CM_TELNO2");
	
	var tmpData = {
		filePath : filePath,
		headerDef: headerDef,
		requestType: 'getArrayCollection'
	}
	ajaxAsync('/webPage/administrator/BatchReg', tmpData, 'json',successGetArrayCollection);
}

// 읽어온 엑셀 정보 그리드에 세팅
function successGetArrayCollection(data) {
	signUpGridData = data;
	signUpGridData.splice(0,1);
	signUpGrid.setData(signUpGridData);
	
	
	
	if( signUpGridData.length > 0 ) {
		$('#btnExcel').prop('disabled', false);
		$('#btnDbSave').prop('disabled', false);
	}
}

//엑셀 파일 업로드시 파일 올릴 경로 가져오기
function getTmpDir() {
	var data = new Object();
	data = {
		pCode 		: '99',
		requestType	: 'getTmpDir'
	}
	ajaxAsync('/webPage/administrator/BatchReg', data, 'json',successGetTmpDir);
}
//엑셀 파일 업로드시 파일 올릴 경로 가져오기 완료 AND 업로드할때 사용할 JSP 파일명 가져오기
function successGetTmpDir(data) {
	tmpPath = data;
	var data = new Object();
	data = {
		pCode 		: 'F2',
		requestType	: 'getTmpDir'
	}
	ajaxAsync('/webPage/administrator/BatchReg', data, 'json',successGetUploadJspName);
}
//업로드할때 사용할 JSP 파일명 가져오기 완료
function successGetUploadJspName(data) {
	uploadJspFile = data;
}
