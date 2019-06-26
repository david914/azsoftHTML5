/**
 * 개발계획/실적등록 화면 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 방지연
 * 	버전 : 1.0
 *  수정일 : 2019-06-26
 */

var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;
var strReqCD	 	= "42";

var urlArr = [];

$(document).ready(function(){
	$('#tabSRRegister').width($('#tabSRRegister').width()+10);
	$('#tabDevPlan').width($('#tabDevPlan').width()+10);
	setTabMenu();
});

function setTabMenu(){
	$(".tab_content").hide();
	//$(".tab_content:first").show();
	$("#tabDevPlan").fadeIn();
	$("ul.tabs li").click(function () {
		$("ul.tabs li").removeClass("active").css("color", "#333");
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