/**
 * 공지사항 화면 기능 정의
 * 
 * <pre>
 * 	작성자 	: 이용문
 * 	버전   	: 1.0
 *  수정일 	: 2019-06-27
 * 
 */

/*
var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드
*/


var userName 	= '관리자'
var userId 		= 'MASTER';
var adminYN 	= true;
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var picker			= new ax5.ui.picker();		// DATE PICKER
var popNoticeModal 	= new ax5.ui.modal();		// 공지사항등록/수정 팝업

var noticeGrid = new ax5.ui.grid();				// 공지사항 그리드

var noticeGridData 	= [];
var uploadData		= [];
var noticePopData 	= null;

var strStD 		= "";
var strEdD 		= "";
var fileLength 	= 0 ;

var uploadAcptno= null;
var downAcptno 	= null;
var downFileCnt = 0;

var fileUploadBtn = null;

var title_;
var class_;


var fileUploadModal = new ax5.ui.modal({
	theme: "warning",
    header: {
        title: '<i class="glyphicon glyphicon-file" aria-hidden="true"></i> [첨부파일]',
        btns: {
            minimize: {
                label: '<i class="fa fa-minus-circle" aria-hidden="true"></i>', onClick: function(){
                	fileUploadModal.minimize('bottom-right');
                }
            },
            restore: {
                label: '<i class="fa fa-plus-circle" aria-hidden="true"></i>', onClick: function(){
                	fileUploadModal.restore();
                }
            },
            close: {
                label: '<i class="fa fa-times-circle" aria-hidden="true"></i>', onClick: function(){
                	fileUploadModal.minimize('bottom-right');
                }
            }
        }
    }
});

var fileDownloadModal = new ax5.ui.modal({
	theme: "warning",
    header: {
        title: '<i class="glyphicon glyphicon-file" aria-hidden="true"></i> [첨부파일]',
        btns: {
            minimize: {
                label: '<i class="fa fa-minus-circle" aria-hidden="true"></i>', onClick: function(){
                	fileDownloadModal.minimize('bottom-right');
                }
            },
            restore: {
                label: '<i class="fa fa-plus-circle" aria-hidden="true"></i>', onClick: function(){
                	fileDownloadModal.restore();
                }
            },
            close: {
                label: '<i class="fa fa-times-circle" aria-hidden="true"></i>', onClick: function(){
                	fileDownloadModal.close();
                }
            }
        }
    }
});

noticeGrid.setConfig({
    target: $('[data-ax5grid="noticeGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	noticePopData = noticeGrid.list[noticeGrid.selectedDataIndexs];
        	openPopNotice();
        },
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: "CM_TITLE", 		label: "제목",  		width: '52%'},
        {key: "CM_USERNAME", 	label: "등록자",  	width: '8%'},
        {key: "CM_ACPTDATE", 	label: "등록일",  	width: '8%'},
        {key: "CM_STDATE", 		label: "팝업시작일",  	width: '8%'},
        {key: "CM_EDDATE", 		label: "팝업마감일",  	width: '8%'},
        {key: "CM_NOTIYN", 		label: "팝업",  		width: '8%'},
        {key: "fileCnt", 		label: "첨부파일",  	width: '8%',
         formatter: function(){
        	 var htmlStr = this.value > 0 ? "<button class='btn-ecams-grid' onclick='openFileDownload("+this.item.CM_ACPTNO+","+this.item.fileCnt+")' >첨부파일다운</button>" : '';
        	 return htmlStr;
         }
        }
    ]
});

$('#start_date').val(getDate('MON',-1));
$('#end_date').val(getDate('DATE',0));

picker.bind({
    target: $('[data-ax5picker="basic"]'),
    direction: "top",
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
            }
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


$(document).ready(function() {
	getNoticeInfo();
	
	if(!adminYN) {
		$('#btnReg').prop('disabled',true);
	}
	
	$('#btnReg').bind('click', function() {
		noticePopData = null;
		openPopNotice();
	});
	
	// 엔터 이벤트
	$('#txtFind').bind('keypress', function(event) {
		if(event.keyCode === 13) {
			$('#btnQry').trigger('click');
		}
	});
	
	// 엑셀저장
	$('#btnExcel').bind('click', function() {
		noticeGrid.exportExcel("공지사항.xls");
	});
	
	// 조회
	$('#btnQry').bind('click', function() {
		getNoticeInfo();
	});
})

// 공지사항 정보 가져오기
function getNoticeInfo() {
	console.log('check');
	var TxtFind_text = $('#txtFind').val().trim();
	strStD = replaceAllString($("#start_date").val(), "/", "");
	strEdD = replaceAllString($("#end_date").val(), "/", "");

	var data = new Object();
	data = {
		UserId 			: userId,
		CboFind_micode 	: '02',
		TxtFind_text 	: TxtFind_text,
		dateStD 		: strStD,
		dateEdD 		: strEdD,
		requestType	: 'getNoticeIfno'
	}
	ajaxAsync('/webPage/mypage/Notice', data, 'json',successGetNoticeInfo);
}

//공지사항 정보 가져오기 완료
function successGetNoticeInfo(data) {
	noticeGridData = data;
	noticeGrid.setData(noticeGridData);
	// 조회건수 : <strong>총 0건</strong></span>
	$('#lbCnt').html('조회건수 : <strong>총'+data.length+'건</strong>');
}

// 공지사항 등록 /수정 오픈
function openPopNotice(){
	popNoticeModal.open({
        width: 600,
        height: 440,
        iframe: {
            method: "get",
            url: "../modal/PopNotice.jsp",
            param: "callBack=popNoticeModalCallBack"
        },
        onStateChanged: function () {
            // mask
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
                $('#btnQry').trigger('click');
            }
        }
    }, function () {
    });
}

var popNoticeModalCallBack = function(){
	popNoticeModal.close();
};

var fileUploadModalCallBack = function() {
	fileLength = 0;
	fileUploadModal.close();
}

var fileDownloadModalCallBack = function() {
	fileDownloadModal.close();
}

// 첨부파일 모달 오픈
function openFileUpload() {
	fileUploadModal.open({
        width: 600,
        height: 360,
        iframe: {
            method: "get",
            url: 	"../modal/FileUp.jsp",
            param: "callBack=fileUploadModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
            }
            else if (this.state === "close") {
            	$('#btnQry').trigger('click');
            }
        }
    }, function () {
    });
}

// 다운로드 모달 오픈
function openFileDownload(acptno,fileCnt) {
	if(acptno !== '') {
		downAcptno = acptno;
		downFileCnt = fileCnt;
	}
	fileDownloadModal.open({
        width: 600,
        height: 360,
        iframe: {
            method: "get",
            url: 	"../modal/FileDownload.jsp",
            param: "callBack=fileDownloadModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
            }
            else if (this.state === "close") {
            	$('#btnQry').trigger('click');
            }
        }
    }, function () {
    });
}

// 공지사항 등록시 파입 업로드
function fileInfoInsert(data) {
	uploadData = data;
	var testArr = []
	testArr.push(data[0]);
	var data = new Object();
	data = {
		fileInfo : uploadData,
		requestType	: 'insertNoticeFileInfo'
	}
	ajaxAsync('/webPage/mypage/Notice', data, 'json');
}

function checkModalLength() {
	return $("div[id*='modal']").length;
}

function returnFileModal() {
	return $("div[id*='modal-15']");
}

//그리드에 마우스 툴팁 달기
$(document).on("mouseenter","[data-ax5grid-panel='body'] span",function(event){
	if(this.innerHTML == ""){
		return;
	}
	//첫번째 컬럼에만 툴팁 달기
	if($(this).closest("td").index() > 0) return;
	
	//그리드 정보 가져오기
	var gridRowInfo = noticeGrid.list[parseInt($(this).closest("td").closest("tr").attr("data-ax5grid-tr-data-index"))];
	var contents = gridRowInfo.CM_CONTENTS;
	
	if(contents.length > 500 ) {
		contents = contents.substring(0,500) + '....';
	}
	
	$(this).attr("title",contents);
	
	// title을 변수에 저장
	title_ = $(this).attr("title");
	// class를 변수에 저장
	class_ = $(this).attr("class");
	// title 속성 삭제 ( 기본 툴팁 기능 방지 )
	$(this).attr("title","");
	
	$("body").append("<div id='tip'></div>");
	if (class_ == "img") {
		$("#tip").html(imgTag);
		$("#tip").css("width","100px");
	} else {
		$("#tip").css("width","300px");
		$("#tip").text(title_);
	}
	
	var pageX = event.pageX;
	var pageY = event.pageY;
	
	$("#tip").css({left : pageX + "px", top : pageY + "px"}).fadeIn(500);
	return;
}).on('mouseleave',"[data-ax5grid-panel='body'] span",function(){
	$(this).attr("title", title_);
	$("#tip").remove();	
});