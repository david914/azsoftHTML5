var userid  = window.parent.userId;
//var pReqNo  = request.getParameter('acptno');
//var pUserId = request.getParameter('user');

$(document).ready(function(){

	$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
	/*if (userid != pUserId) {
		swal({
            title: "사용자 정보 불일치 ["+pReqNo+"]",
            text: "["+pUserId+"]이 접근을 시도했습니다. \n다시 로그인 하시기 바랍니다."
        });
		return;
	}*/
	$('#tab1Li').width($('#tab1Li').width()+10);
	$('#tab2Li').width($('#tab2Li').width()+10);
	setTabMenu();
});


function setTabMenu(){
	$(".tab_content").hide();
	$(".tab_content:first").show();
	$("ul.tabs li").click(function () {
		$("ul.tabs li").removeClass("active").css("color", "#333");
		$(this).addClass("active").css("color", "darkred");
		$(".tab_content").hide();
		
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).fadeIn();
		// 페이지를 처음 불러올때 미리 불러오면 셀 width 깨짐 현상이 있어 클릭후 처움 ifram 을 새로 불러오도록 수정
		// 수정 후 첫 페이지 load 시에 fadeIn이 매끄럽지 않아 추후 수정이 필요함
		/*if(urlArr[$(this).index()] == null && $(this).index() > 0){
			urlArr[$(this).index()] = $("#" + activeTab).children("iframe");
			$("#" + activeTab).children("iframe").attr("src",$("#" + activeTab).children("iframe").attr("src"));
			
			$("#" + activeTab).children("iframe").on('load',function(){
				$("#" + activeTab).fadeIn();
			});
			return;
		}*/
		//$("#" + activeTab).fadeIn();
	});
}