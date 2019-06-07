/**
 * 시스템상세정보 팝업 화면 기능 정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-05-31
 * 
 */

var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드
var selectedSystem  = window.parent.selectedSystem;

var urlArr = [];

$(document).ready(function(){
	$('#tab1Li').width($('#tab1Li').width()+10);
	$('#tab2Li').width($('#tab2Li').width()+10);
	$('#tab3Li').width($('#tab3Li').width()+10);
	setTabMenu();
})

function setTabMenu(){
	$(".tab_content").hide();
	$(".tab_content:first").show();
	$("ul.tabs li").click(function () {
		$("ul.tabs li").removeClass("active").css("color", "#333");
		$(this).addClass("active").css("color", "darkred");
		$(".tab_content").hide();
		
		var activeTab = $(this).attr("rel");
		
		// 페이지를 처음 불러올때 미리 불러오면 셀 width 깨짐 현상이 있어 클릭후 처움 ifram 을 새로 불러오도록 수정
		// 수정 후 첫 페이지 load 시에 fadeIn이 매끄럽지 않아 추후 수정이 필요함
		if(urlArr[$(this).index()] == null && $(this).index() > 0){
			urlArr[$(this).index()] = $("#" + activeTab).children("iframe");
			$("#" + activeTab).children("iframe").attr("src",$("#" + activeTab).children("iframe").attr("src"));
			
			$("#" + activeTab).children("iframe").on('load',function(){
				$("#" + activeTab).fadeIn();
			});
			return;
		}
		$("#" + activeTab).fadeIn();
	});
}
