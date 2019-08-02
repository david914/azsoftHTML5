/**
 * 메인화면 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-01-29
 */
var userId 		= null;
var userName	= null;
var adminYN 	= null;
var userDeptName= null;
var userDeptCd 	= null;
var request 	= new Request();
var sessionID 	= null;
var reqCd		= null;
var iframeHeight= 0;
var menuData	= null;
var contentHeight = 0;
var contentHistory = "";

$(document).ready(function() {
	
	contentHeight = window.innerHeight - $('#header').height() - $('#footer').height() - 20;
	screenInit();
	// eCAMS Main Load
	$('#eCAMSFrame').empty();
	$iFrm = $('<IFRAME id="iFrm" frameBorder="0" name="iFrm" scrolling="yes" src="/webPage/main/eCAMSMainNew.jsp" style=" width:100%; height:'+contentHeight+'px; min-width:1024px;" marginwidth="0" marginheight="0" onload="frameLoad()"></IFRAME>');
	$iFrm.appendTo('#eCAMSFrame');
	
	
	// ifrmae contents의 height에 맞게 height 값 추가
	$(window).resize(function(){
		resize();
	});
	
	// azsoft 로고 클릭시 메인 페이지 이동
	$('#logo').bind('click', function() {
		goHome();
	});
	
	// 로그아웃 클릭
	$('#logOut').bind('click', function() {
		confirmDialog.confirm({
			msg: '로그아웃 하시겠습니까?',
		}, function(){
			if(this.key === 'ok') {
				logOut();
			}
		});
		
	});
	
	$('#approvalCnt, #errCnt, #srCnt').bind('click', function() {
		changePage(this.id);
	});
});

// 미결/SR/오류 건수 클릭시 페이지 이동
function changePage(division) {
	var pathName = '';
	var mainTitle = '';
	var subTitle = '';
	
	if(division === 'approvalCnt') {
		pathName = '/webPage/approval/ApprovalStatus.jsp';
		mainTitle = '결재확인';
		subTitle = '결재현황';
	}
	if(division === 'srCnt') {
		pathName = '/webPage/register/SRStatus.jsp';
		mainTitle = '등록';
		subTitle = 'SR진행현황(등록)';
	}
	if(division === 'errCnt') {
		pathName = '/webPage/approval/RequestStatus.jsp';
		mainTitle = '결재확인';
		subTitle = '신청현황';
	}
	
	
	$('#eCAMSFrame').empty();
	$iFrm = $('<IFRAME id="iFrm" frameBorder="0" name="iFrm" scrolling="yes" src="'+pathName+'" style=" width:100%;  height:'+contentHeight+'px; min-width:1024px;" marginwidth="0" marginheight="0"  onload="frameLoad()"></IFRAME>');
	$iFrm.appendTo('#eCAMSFrame');

	//상위 TITLE TEXT SET
	contentHistory = mainTitle + "<strong> &gt; "+ subTitle+"</strong>";
}

//세로 스크롤바
(function($) {
    $.fn.hasVerticalScrollBar = function() {
    	console.log(this.get(0));
    	console.log(this.get(0).scrollHeight);
    	console.log(this.innerHeight());
        return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
    }
})(jQuery);

function resize(){
	if($('#iFrm').contents().find(".contentFrame").length == 0){
		return;
	}
	 
	var addHeight = 0;
	var intervalck = 1;
	var contentFrameHeight = 0;
	var frameHeight = 0;
	
	contentHeight = window.innerHeight - $('#header').height() - $('#footer').height() - 20;
	contentFrameHeight = Math.round($('#iFrm').contents().find(".contentFrame").height()+addHeight); // 프레임 내부에 컨텐츠 div 높이 구해오기
	
	
	/*console.log('resize menu [' + contentHistory + ']');
	console.log('프레임 height [' + contentFrameHeight + ']');
	console.log('전체 height [' + contentHeight + ']');*/
	
	if(contentHeight > contentFrameHeight){
		frameHeight = contentHeight;
	} else {
		frameHeight = contentFrameHeight;
	}
	
	if($('#iFrm').height() != frameHeight ){
		$('#iFrm').css("height", frameHeight + "px");
		console.log($('#iFrm').hasVerticalScrollBar());
	}
}

// 프레임을 불러오고나서 height 가 변하는 부분이 있을경우 사용
function frameLoad(){
	$('#iFrm').contents().find('#history_wrap').html(contentHistory);
	
	if($('#iFrm').contents().find(".contentFrame").length == 0){
		return;
	}
	
	var frameHeight = 0;
	var addHeight = 0;
	contentHeight = window.innerHeight - $('#header').height() - $('#footer').height() - 20;

	var resize_test = setInterval(function(){
		resize();	
		contentFrameHeight = Math.round($('#iFrm').contents().find(".contentFrame").height()+addHeight); // 프레임 내부에 컨텐츠 div 높이 구해오기
		 if(contentHeight > contentFrameHeight){
			 frameHeight = contentHeight;
		 }
		 else{
			 frameHeight = contentFrameHeight;
		 }

		 if($('#iFrm').height() == frameHeight ){
			 clearInterval(resize_test);
			 return;
		 }
	 },1);
}

function lang_open(){
	  var $gnb = jQuery(".lang_menu > ul > li");
	  $gnb.find("> a").mouseenter(function(){
	      var $this = jQuery(this);
	      $this.css('color','#2471c8')
	      $this.parent('li').children('div').addClass("active");
	      $gnb.find("> div").hide();
	      $this.parent('li').children('div').show();
	   }),
	  $gnb.mouseleave(function(){
	      var $this = jQuery(this);
	      $this.children('a').css('color','')
	      $this.children('div').removeClass("active");
	  });
}
	

function screenInit() {
	if( sessionID === null ) sessionID =$('#txtSessionID').val();
	if( sessionID === null || sessionID === '' || sessionID === 'undefinded' ) {
		window.location.replace('/webPage/login/ecamsLogin.jsp');
		return;
	}
	getSession();
}

function getSession() {
	var ajaxUserData = null;
	var sessionInfo = {
		requestType : 'GETSESSIONUSERDATA',
		sessionID 	: sessionID
	}   
	ajaxUserData = ajaxCallWithJson('/webPage/main/eCAMSBaseServlet', sessionInfo, 'json');
	
	userName		= ajaxUserData.userName;
	userId 			= ajaxUserData.userId;
	adminYN 		= ajaxUserData.adminYN;
	userDeptCd 		= ajaxUserData.deptCd;
	userDeptName	= ajaxUserData.deptName;
	
	if(userId == undefined) {
		window.location.replace('/webPage/login/ecamsLogin.jsp');
		return;
	}
	
	$('#loginUser').html(userName + '님 로그인');
	
	meneSet();
}


// 메뉴데이터 가져오기 완료
function successGetMenuData(data) {
	menuData = data;
	
	$('#ulMenu').empty();
	var menuHtmlStr = '';
	menuData.forEach(function(menuItem, menuItemIndex) {
		if(menuItem.link === undefined || menuItem.link === null) {
			if(menuHtmlStr.length > 1) {
				menuHtmlStr += '</div>\n';
				menuHtmlStr += '</li>\n';
			}
			menuHtmlStr += '<li class="lang_open">\n';
			menuHtmlStr += '	<a href="#" link="doneMove">'+menuItem.text+'</a>\n';
			menuHtmlStr += '	<div class="menu_box">\n';
		}else if(menuItem.link !== null) {
			menuHtmlStr += '<p onclick="clickSideMenu(event)" link="'+menuItem.link+'">'+menuItem.text+'</p>\n';
		}
		
		if((menuItemIndex+1) === menuData.length) {
			menuHtmlStr += '</div>\n';
			menuHtmlStr += '</li>\n';
		}
	});
	
	$('#ulMenu').html(menuHtmlStr);
	
	lang_open();
}

// 메뉴데이터 가져오기
function meneSet() {
	var data = new Object();
	data = {
		UserId 		: userId,
		requestType	: 'MenuList'
	}
	ajaxAsync('/webPage/main/eCAMSBaseServlet', data, 'json',successGetMenuData);
}

function clickSideMenu(event) {
	event.preventDefault();
	var $iFrm = '';
	var pathName = event.target.getAttribute('link');
	
	// 접속 메뉴 request code 가져오기 수정.
	var findReqCd = false;
	for(var i=0; i<menuData.length; i++) {
		if(menuData[i].link === event.target.getAttribute('link') && event.target.innerText === menuData[i].text) {
			reqCd = menuData[i].reqcd;
			findReqCd = true;
			break;
		}
	} 
	if(!findReqCd) reqCd = null;
	
	
	// 하위 메뉴일시만 이동
	if( pathName.indexOf('doneMove') < 0) {
		//IFRAME 지워준후 다시그리기
		$('#eCAMSFrame').empty();
		$iFrm = $('<IFRAME id="iFrm" frameBorder="0" name="iFrm" scrolling="yes" src="'+pathName+'" style=" width:100%;  height:'+contentHeight+'px; min-width:1024px;" marginwidth="0" marginheight="0"  onload="frameLoad()"></IFRAME>');
		$iFrm.appendTo('#eCAMSFrame');
		

		//상위 TITLE TEXT SET
		var selectePtag = $(event.target);
		contentHistory = selectePtag.parent('div.menu_box').siblings('a').text() + "<strong> &gt; "+ selectePtag.text()+"</strong>";
	}
}

function goHome() {
	location.reload();
}

function logOut() {
	window.location.replace('/webPage/login/ecamsLogin.jsp');
}

