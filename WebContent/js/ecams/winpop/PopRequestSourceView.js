var pReqNo  = null;
var pItemId = null;
var pUserId = null;

var grdProgHistory = new ax5.ui.grid();

var selOptions 	   = [];

var grdProgHistoryData = null; //체크인목록그리드 데이타
var selectedGridItem   = null;
var srcData        = null;
var srcArray       = [];

var isAdmin 	   = false;
var ingSw          = false;
var findLine       = 0;
var svWord         = null;
var tmpDir         = null;
var downURL        = null;
var outName        = null;
var prettify       = null;
var tmpTab = null;
var tabIndex	   = 0;
var i			   = 0;
var tabSize		   = 0;
var tabSize2	   = 0;
var ingSw2		   = false;
var clickTab	   = null;
var clickTab2	   = null;
var onTab		   = null;
var rMenu		   = null;

var tmpInfo = new Object();
var tmpInfoData = new Object();

var f = document.getSrcData;

pReqNo = f.acptno.value;
pItemId = f.itemid.value;
pUserId = f.user.value;

grdProgHistory.setConfig({
    target: $('[data-ax5grid="grdProgHistory"]'),
    sortable: true, 
    multiSort: true,
    //showRowSelector: true,
    //showLineNumber: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
           this.self.clearSelect();
           this.self.select(this.dindex);
           grdProgView_Click();
        },
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: "cr_rsrcname", label: "프로그램명",  width: '70%', align: 'left'},
        {key: "cr_aftviewver", label: "버전",  width: '25%'},
        {key: "basename", label: "기준프로그램",  width: '70%', align: 'left'},
        {key: "cm_dirpath", label: "프로그램경로",  width: '120%', align: 'left'},
    ]
});

$('input:radio[name^="optradio"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});

$(document).ready(function(){
	rMenu = $("#context-menu");
	//pUserId = 'MASTER';
	//pItemId = '000000179672';
	if (pUserId == null || pUserId.length == 0) {
		dialog.alert('로그인 후 사용하시기 바랍니다.',function(){});
		return;		
	}
	if (pReqNo == null || pReqNo.length == 0) {
		dialog.alert('신청번호가 정확하지 않습니다. 확인 후 진행하시기 바랍니다.');
		return;
	}
	
	screenInit('M');
	
	//닫기클릭
	$('#btnClose').bind('click', function() {
		close();
	});
	$('#btnSearch').bind('click', function() { 
		btnSearch_click();
	});
	
	//검색단어 Enter키
	$('#txtSearch').bind('keypress', function(event){
		if(event.keyCode==13) {
			btnSearch_click();
		}
	});
	
	getTmpDir('99,F1');
	
	getReqList(pReqNo,pUserId);
	
	
});

function setTabMenu(){
	$("ul.tabs li").mousedown(function (e) {
		if (e.which == 1){
			if($(this).hasClass('on')) {
				return;
			}
			$(".tab_content").css('display', 'none');
			var activeTab = $(this).attr("rel");
			$("ul.tabs li").removeClass('on');
			$(this).addClass("on");
			$("#" + activeTab).css('display', 'block');
		} else if (e.which == 3){
			clickTab = $(this).attr("id");
			clickTab2 = $(this).attr("rel");
			if ($(this).hasClass('on')){
				onTab = "on";
			} else {
				onTab = "off";
			}
			showRMenu();
		}
	});
}

function showRMenu() {
	var y = 0;
	var x = 0;
	
	$("#context-menu ul").show(); 
	$("#contextmenu1").show();
	$("#contextmenu2").show();
	$(document).on('contextmenu', function() {
		  return false;
	});
	 x = event.clientX;
	 y = event.clientY;
     y += document.body.scrollTop; 
     x += document.body.scrollLeft; 
     rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});
  
     $("body").bind("mousedown", onBodyMouseDown); 
} 

function onBodyMouseDown(event){
	if (!(event.target.id == clickTab || $(event.target).parents("#context-menu").length>0)) {
		rMenu.css({"visibility" : "hidden"});
		$("body").unbind("mousedown", onBodyMouseDown); 
	}
} 


/* context menu 숨기기 */
function hideRMenu() { 
	if ($("#context-menu")) $("#context-menu").css({"visibility": "hidden"}); 
	$("body").unbind("mousedown", onBodyMouseDown); 
}

function contextmenu_click(gbn) {
	hideRMenu();
	
	if(clickTab === null) return;
	
	var tabid = clickTab;
    var contentname = clickTab2;
    console.log(clickTab + "/" + clickTab2);
	if (gbn === "1"){
		if ($("#tabs li").length === 1){
			dialog.alert("최소한 하나의 탭은 유지해야 합니다. ");
			return;
		}
        tabSize2 = tabSize2 - $("#" + tabid).outerWidth();
        $("#" + contentname).remove();
        $("#" + tabid).remove();
        if (tabSize < tabSize2){
			var cnt = $("#tabs li").length;
			var tmpWidth = 95 / cnt;
			$(".sourcetab").siblings().css({"width": tmpWidth + "%"});
		} else {
			$(".sourcetab").siblings().css({"width": "auto"});
		}
        if (onTab === "on"){
        	$("ul.tabs li").removeClass('on');
			$('ul.tabs li:last').addClass("on");
        	$('.tab_content:last').show();	
        }
	} else {
		tmpTab = $('#'+contentname.replace("tabSourceView","frmSourceView")).get(0).contentWindow;
		console.log('#'+contentname.replace("tabSourceView","frmSourceView"));
		tmpTab.btnSrcDown_click();
	}
}

//환성화 비활성화 초기화로직
function screenInit(gbn){
	if (gbn == 'M') {
		$('#Txt_Acptno').val(pReqNo.substr(0,4)+'-'+pReqNo.substr(4,2)+'-'+pReqNo.substr(6));
		grdProgHistory.setData([]);
		grdProgHistory.repaint();
	}
}
function getTmpDir(dirCd){
	
	var tmpInfoData = {
		pCode: 	dirCd,
		requestType: 	'GETECAMSDIR'
	}
	ajaxAsync('/webPage/winpop/RequestSourceViewServlet', tmpInfoData, 'json', successeCAMSDir);
	
}
function successeCAMSDir(data) {
	
	selOptions = data;
	selOptions = selOptions.filter(function(data) {
		if(data.cm_pathcd == '99') tmpDir = data.cm_path;
		else downURL = data.cm_path;
	});
	
}
function getReqList(acptno, userid){
	
	var tmpInfoData = {
		acptno: 	acptno,
		userid:		userid,
		requestType: 	'GETREQLIST'
	}
	ajaxAsync('/webPage/winpop/RequestSourceViewServlet', tmpInfoData, 'json', successProgList);
	
}

function successProgList(data) {
	
	grdProgHistoryData = data;
	grdProgHistory.setData(grdProgHistoryData);
	
	if (grdProgHistoryData == null || grdProgHistoryData.length == 0) return;
	grdProgHistory.select(0);
	selectedGridItem = grdProgHistory.list[0];
	grdProgView_Click();
}

function grdProgView_Click() {
	if (!ingSw2){
		ingSw2 = true;
	} else {
		return;
	}
	selectedGridItem = grdProgHistory.list[grdProgHistory.selectedDataIndexs];
	if(tabIndex > 0){
		for (i = 0; tabIndex > i; i++) {
			if (document.getElementById("tab"+i) !== null){
				if (document.getElementById("tab"+i).innerHTML === selectedGridItem.cr_rsrcname){
					if(!$('#tab'+i).hasClass('on')){
						$("ul.tabs li").removeClass('on');
						$("#tab"+i).addClass('on');
					    $('.tab_content').css('display', 'none');
					    $('#tabSourceView'+i).css('display', 'block');
					}
					ingSw2 = false;
					return;
				}
			}
		}
	}
	
	if ($("#tabs li").length === 10){
		dialog.alert("10개까지만 동시에 확인가능합니다.");
		ingSw2 = false;
		return;
	}
	
	tabSize = $("#tabs").outerWidth();
	$("#tabs").append("<li rel='tabSourceView" + tabIndex + "'id='tab" + tabIndex + "' class='sourcetab'></li>"); 
    $("#content").append("<div id='tabSourceView" + tabIndex + "' class='tab_content' style='width:100%; height:100%;'><iframe id='frmSourceView" + tabIndex + "' name='frmSourceView" + tabIndex + "' src='/webPage/tab/sourceview/SourceViewTab.jsp' width='100%' height='100%' frameborder='0'></iframe></div>");
	document.getElementById('frmSourceView'+tabIndex).onload = function() {
		tmpTab = $('#frmSourceView'+tabIndex).get(0).contentWindow;
		tmpTab.pReqNo = pReqNo;
		tmpTab.pItemId = selectedGridItem.cr_itemid;
		tmpTab.pUserId = pUserId;
		tmpTab.rsrcname = selectedGridItem.cr_rsrcname;
		tmpTab.ver = selectedGridItem.cr_ver;
		tmpTab.cr_aftviewver = selectedGridItem.cr_aftviewver;
		tmpTab.basename = selectedGridItem.basename;
		tmpTab.downURL = downURL;
		tmpTab.tmpDir = tmpDir;
		tmpTab.status = selectedGridItem.cr_status;
		tmpTab.elementInit();
		document.getElementById("tab"+tabIndex).innerHTML = selectedGridItem.cr_rsrcname;
		tabSize2 = tabSize2 + $("#tab" + tabIndex).outerWidth();
		
		if (tabSize < tabSize2){
			var cnt = $("#tabs li").length;
			var tmpWidth = 95 / cnt;
			$(".sourcetab").siblings().css({"width": tmpWidth + "%"});
		} else {
			$(".sourcetab").siblings().css({"width": "auto"});
		}
		$("ul.tabs li").removeClass('on');
		$("#tab"+tabIndex).addClass('on');
	    $('.tab_content').css('display', 'none');
	    $('#tabSourceView'+tabIndex).css('display', 'block');
	    $("ul.tabs li").unbind('click');
		setTabMenu();
		tabIndex++;
		ingSw2 = false;
	}
}
function optradio_change() {
	for (i = 0; tabIndex > i; i++) {
		if($('#tab'+i).hasClass('on')){
			break;
		}
	}
	
	tmpTab = $('#frmSourceView'+i).get(0).contentWindow;
	tmpTab.txtSearch_change();
	
	$('#txtSearch').val('');
	
	if ($('[name="optradio"]:checked').val() == 'W') {
		$('#txtSearch').prop("placeholder", "검색할 단어를 입력하세요.");
	} else {
		$('#txtSearch').prop("placeholder", "검색할 라인번호를 입력하세요.");
	}
	
}

function btnSearch_click() {
	for (i = 0; tabIndex > i; i++) {
		if($('#tab'+i).hasClass('on')){
			break;
		}
	}
	tmpTab = $('#frmSourceView'+i).get(0).contentWindow;
	tmpTab.btnSearch_click($('#txtSearch').val().trim(),$('[name="optradio"]:checked').val());
}
