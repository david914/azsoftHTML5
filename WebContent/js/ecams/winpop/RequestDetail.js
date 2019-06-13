var pReqNo  = null;
var pUserId = null;

//var request = new Request();

$(document).ready(function(){

	$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

	var f = document.reqData;
	pReqNo = f.acptno.value;
	pUserId = f.user.value;
	
	console.log(pReqNo, pUserId);

	if (pReqNo == null) {
		swal({
            title: "정보오류",
            text: "신청정보가 없습니다.\n다시 로그인 하시기 바랍니다."
        });
		return;
	}
	
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
	});
}