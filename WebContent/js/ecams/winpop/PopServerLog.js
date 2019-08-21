var pReqNo  = null;
var pUserId = null;

var datReqDate	= new ax5.ui.picker();	//처리일시 picker

var options 	   = [];

var data           = null; //json parameter

var f = document.getReqData;
pReqNo = f.acptno.value;
pUserId = f.user.value;

$('#txtAcptNo').val(pReqNo.substr(0,4)+'-'+pReqNo.substr(4,2)+'-'+pReqNo.substr(6));

ax5.info.weekNames = [
    {label: "일"},
    {label: "월"},
    {label: "화"},
    {label: "수"},
    {label: "목"},
    {label: "금"},
    {label: "토"}
];

function dateInit() {
	$('#txtPrcDate').val(getDate('DATE',0));
	datReqDate.bind(defaultPickerInfo('txtPrcDate', 'top'));
}

$(document).ready(function(){
	if (pReqNo == null) {
		return;
	}
	
	dateInit();
	
	//조회 클릭
	$('#btnSearCh').bind('click', function() {
		if (pReqNo == null) {
			return;
		}
		getSvrLog();
	});
	
	//닫기클릭
	$('#btnClose').bind('click', function() {
		close();
	});

	//최초 화면로딩 시 조회(조회버튼 로직)
	$('#btnSearCh').trigger('click');
});

//조회클릭
function getSvrLog() {
	$('#txtSvrLog').val('');
	$('#txtRetLog').val('');
	
	data = new Object();
	data = {
		AcptNo 		: pReqNo,
		strDate 	: replaceAllString($('#txtPrcDate').val(), '/', ''),
		requestType : 'getLogView'
	}
	ajaxAsync('/webPage/winpop/PopServerLogServlet', data, 'json',successGetLogView);
}
//로그가져오기  완료
function successGetLogView(data) {
	$('#txtSvrLog').val(data[0].file1);
	$('#txtRetLog').val(data[0].file2);
}