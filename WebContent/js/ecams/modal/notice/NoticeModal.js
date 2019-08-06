/**
 * 공지사항-더블클릭 팝업 화면의 기능 정의
 * 
 * <pre>
 * &lt;b&gt;History&lt;/b&gt;
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-02-08
 * 
 */


var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var stDate = "";
var edDate = "";
var now 	= new Date();
var picker 	= new ax5.ui.picker();
var request =  new Request();
var memo_date 	= null;
var noticeInfo 	= null;
var dialog 		= new ax5.ui.dialog({title: "확인"});

picker.bind({
    target: $('[data-ax5picker="basic"]'),
    direction: "bottom",
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
            },
            marker: (function () {
                var marker = {};
                marker[ax5.util.date(new Date(), {'return': 'yyyy/MM/dd', 'add': {d: 0} } )] = true;

                return marker;
            })()
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

$('#dateStD').val(ax5.util.date(new Date(), {'return': 'yyyy/MM/dd', 'add': {d: 0} } ));
$('#dateEdD').val(ax5.util.date(new Date(), {'return': 'yyyy/MM/dd', 'add': {d: 0} } ));

$('input.checkbox-pop').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

$(document).ready(function() {
	popNoticeInit();
	
	// 팝업공지 클릭
	$('#chkPop').bind('click', function() {
		if($("#chkPop").is(":checked")){
			$('#divPicker').css('display','');
		}else {
			$('#divPicker').css('display','none');
		}
	})
	
	// 파일첨부
	$('#btnFile').bind('click', function() {
		fileOpen();
	});
	
	// 공지사항 삭제
	$('#btnRem').bind('click', function() {
		del();
	});
	
	$('#btnReg').bind('click', function() {
		checkNoticeVal();
	});
	
	$('#btnClose').bind('click', function() {
		popClose();
	});
});

// 화면 초기화
function popNoticeInit() {
	$('#divPicker').css('display','none');
	$('#btnRem').css('display','none');
	$('#btnReg').css('display','none');
	
	noticeInfo = window.parent.noticePopData;
	if(noticeInfo !== null) {
		if(noticeInfo.CM_NOTIYN === 'Y') {
			
			var startDate 	= replaceAllString(noticeInfo.CM_STDATE, "/", "");
			var endDate 	= replaceAllString(noticeInfo.CM_EDDATE, "/", "");
			startDate 		= ax5.util.date(startDate, {'return': 'yyyy/MM/dd', 'add': {d: 0}} );
			endDate 		= ax5.util.date(endDate, {'return': 'yyyy/MM/dd', 'add': {d: 0}} );
			
			$('#divPicker').css('display','');
			$('#dateStD').val(startDate);
			$('#dateEdD').val(endDate);
			$('#exampleCheck1').prop('checked',true);
		}
		
		$('#txtTitle').val(noticeInfo.CM_TITLE);
		$('#textareaContents').val(noticeInfo.CM_CONTENTS);
		
		if(userId !== noticeInfo.CM_EDITOR) {
			$('#btnRem').css('display','none');
			$('#btnReg').css('display','none');
			
			if(noticeInfo.CM_NOTIYN === 'Y') {
				$('#divPicker').empty();
				var htmlStr = '';
				htmlStr += '<input id="dateStD" name="dateStD" type="text" class="form-control" value="'+noticeInfo.CM_STDATE+'">';
				htmlStr += '	<span class="input-group-addon">~</span>';
				htmlStr += '<input id="dateEdD" name="dateEdD" type="text" class="form-control" value="'+noticeInfo.CM_EDDATE+'">';
				$('#divPicker').html(htmlStr);
			}
			
			$('#txtTitle').attr('disabled',true);
			$('#textareaContents').attr('disabled',true);
		} else {
			$('#btnRem').css('display','');
			$('#btnReg').css('display','');
			
		}
		
		$('#btnFile').text('첨부파일');
	} else if ( noticeInfo === null ) {
		$('#btnReg').css('display','');
	}
}

// 팝업 닫기
function popClose(){
	window.parent.fileLength = 0;
	window.parent.fileUploadModal.close();
	window.parent.popNoticeModal.close();
}

//공지사항 등록 및 수정시 유효성 체크
function checkNoticeVal(){
	var TODATE 		= "";
	var monthStr 	= "";
	var dayStr 		= "";
	
	var txtTitle 			= $('#txtTitle').val().trim();
	var textareaContents	= $('#textareaContents').val().trim();
	
	if($("#chkPop").is(":checked")){
		stDate = replaceAllString($("#dateStD").val(), "/", "");
		edDate = replaceAllString($("#dateEdD").val(), "/", "");
	}
	
	if(txtTitle.length === 0) {
		dialog.alert('제목을 입력하십시오.', function () {});
		return;
	}
	
	if(textareaContents.length === 0 ) {
		dialog.alert('내용을 입력하십시오.', function () {});
		return;
	}
	
	if($("#chkPop").is(":checked") && (edDate<stDate)) {
		dialog.alert('날짜 등록이 잘못되었습니다.', function () {});
		return;
	}
	
	confirmDialog.confirm({
		msg: '등록하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			updateNotice();
		}
	});
}

// 공지사항 수정 및 등록
function updateNotice(){
	var updateData = {};
	if(noticeInfo === null) {
		updateData.memo_id = '';
		updateData.user_id = userId;
	} else {
		updateData.memo_id = noticeInfo.CM_ACPTNO;
		updateData.user_id = noticeInfo.CM_EDITOR;
	}
	
	updateData.txtTitle 		= $("#txtTitle").val().trim();
	updateData.textareaContents = $("#textareaContents").val().trim();
	updateData.chkNotice 		= $('#chkPop').prop("checked").toString();
	updateData.stDate = stDate;
	updateData.edDate = edDate;
	
	var data = new Object();
	data = {
		requestType : 'updateNotice',
		UserId : userId,
		dataObj : updateData
	}
	ajaxAsync('/webPage/modal/notice/NoticeModal', data, 'json',successUpdateNotice);
}

// 공지사항 수정 및 등록 완료
function successUpdateNotice(data) {
	// 첨부파일 존재시
	if(window.parent.fileLength > 1) {
		window.parent.uploadAcptno = data;
		window.parent.showAndHideUploadModal('show');
		$(window.parent.fileUploadBtn).trigger('click');
	}
	dialog.alert('등록 되었습니다.', function () {
		window.parent.fileLength = 0;
		window.parent.fileUploadModal.close();
		window.parent.popNoticeModal.close();
	});
}


//파일첨부
function fileOpen() {
	if(noticeInfo !== null) {
		window.parent.downAcptno = noticeInfo.CM_ACPTNO;
		window.parent.downFileCnt = noticeInfo.fileCnt;
		window.parent.openFileDownload('','');
	} else {
		if(window.parent.checkModalLength() > 1) {
			window.parent.showAndHideUploadModal('show');
		}
		else window.parent.openFileUpload();
	}
}

// 공지사항 삭제
function del() {
	confirmDialog.confirm({
		msg: '공지사항을 삭제하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			
			stDate = replaceAllString($("#dateStD").val(), "/", "");
			edDate = replaceAllString($("#dateEdD").val(), "/", "");
			
			var delData = {};
			delData.memo_id = noticeInfo.CM_ACPTNO;
			delData.user_id = noticeInfo.CM_EDITOR;
			delData.txtTitle = document.getElementById("txtTitle").value;
			delData.textareaContents = $("#textareaContents").val();
			delData.chkNotice = $('#chkPop').prop("checked").toString();
			delData.stDate = stDate;
			delData.edDate = edDate;
			var data = new Object();
			data = {
				requestType : 'deleteNotice',
				UserId 	: userId,
				dataObj : delData
			}
			ajaxAsync('/webPage/modal/notice/NoticeModal', data, 'json',successDel);
		}
	});
}

// 공지사항 삭제 완료
function successDel(data) {
	dialog.alert('공지사항이 삭제되었습니다.', function () {
		window.parent.fileLength = 0;
		window.parent.fileUploadModal.close();
		window.parent.popNoticeModal.close();
	});
}