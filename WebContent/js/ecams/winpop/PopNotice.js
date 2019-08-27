/**
 * 공지사항 새창 기능정의
 * 
 * <pre>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-08-27
 * 
 */

var cm_acptno 	= null;
var downAcptno 	= null;
var noticeInfo	= null;
var downFileCnt = 0;
var popNoticeSw	= true;
var today 		= getDate('DATE',0);

var fileDownloadModal 	= new ax5.ui.modal();		// 파일다운로드모달 (하나씩 파일첨부 가능)

var noticeInfo 	= null;
var dialog 		= new ax5.ui.dialog({title: "공지사항 확인"});


$('input.checkbox-pop').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

$(document).ready(function() {
	cm_acptno 	= $('#cm_acptno').val();
	
	if(cm_acptno === null) {
		dialog.alert('공지사항 번호가 전달되지 않았습니다. 관리자에게 문의하세요.', function() {});
		return;
	}
	
	getNoticeInfo();
	
	// 파일첨부
	$('#btnFile').bind('click', function() {
		openFileDownload(noticeInfo.CM_ACPTNO, noticeInfo.fileCnt);
	});
	
	$('#chkPopYn').bind('click', function() {
		setCookie('notice' + noticeInfo.CM_ACPTNO + '_' + today, 	false);
		window.close();
	});
	
 	// 닫기 클릭
	$('#btnClose').bind('click', function() {
		window.close();
	});
});

// 공지사항 정보 가져오기
function getNoticeInfo() {
	var data = new Object();
	data = {
		cm_acptno 	: cm_acptno,
		requestType	: 'getPopNoticeInfo'
	}
	ajaxAsync('/webPage/mypage/Notice', data, 'json',successGetNoticeInfo);
}

// 공지사항 정보 가져오기 완료
function successGetNoticeInfo(data) {
	noticeInfo = data;
	$('#txtTitle').val(data.CM_TITLE);
	$('#textareaContents').val(data.CM_CONTENTS);
	
	if(data.fileCnt <= 0 ) {
		$('#btnFile').css('display', 'none');
	} else {
		// 첨부 파일 존재시 좀더 길게
		top.window.resizeTo(615,465);
	}
}

var fileDownloadModalCallBack = function() {
	fileDownloadModal.close();
}

//다운로드 모달 오픈
function openFileDownload(acptno,fileCnt) {
	if(acptno !== '') {
		downAcptno = acptno;
		downFileCnt = fileCnt;
	}
	fileDownloadModal.open({
        width: 520,
        height: 315,
        iframe: {
            method: "get",
            url: 	"../modal/notice/FileDownloadModalNew.jsp",
            param: "callBack=fileDownloadModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
            }
            else if (this.state === "close") {
            	selectedGridItem = noticeGrid.getList('selected')[0];
            	$('#btnQry').trigger('click');
            }
        }
    }, function () {
    });
}

