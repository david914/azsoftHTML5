
var acptNo 		= window.parent.pReqNo;				//신청번호
var userId 		= window.parent.pUserId;			//접속자 ID

var reqData		= null;								//신청건정보

$(document).ready(function() {
	
	reqData		= clone(window.parent.reqInfoData);
	
	if (reqData[0].prcsw == '0' && reqData[0].updtsw2 == '1') {
		document.getElementById('btnBefJob').style.visibility = "visible";
	} else {
		document.getElementById('btnBefJob').style.visibility = "hidden";
	}
});