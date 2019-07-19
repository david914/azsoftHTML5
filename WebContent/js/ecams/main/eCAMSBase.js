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

$(document).ready(function() {
	screenInit();
	// eCAMS Main Load
	$('#eCAMSFrame').empty();
	$iFrm = $('<IFRAME id="iFrm" frameBorder="0" name="iFrm" scrolling="yes" src="/webPage/main/eCAMSMainNew.jsp" style=" width:100%; min-width:1024px;" marginwidth="0" marginheight="0" onload="frameLoad()"></IFRAME>');
	$iFrm.appendTo('#eCAMSFrame');
	
	
	// ifrmae contents의 height에 맞게 height 값 추가
	
	$(window).resize(function(){
		resize();
	});
});


function resize(){
	 if($('#iFrm').contents().find(".contentFrame").length == 0){
		 return;
	 }
	 
	var addHeight = 0;
	 var intervalck = 1;
	 var contentFrameHeight = 0;
	 var frameHeight = 0;
	 var contentHeight = window.innerHeight - $('#header').height() - $('#footer').height() - 20;

	 contentFrameHeight = Math.round($('#iFrm').contents().find(".contentFrame").height()+addHeight); // 프레임 내부에 컨텐츠 div 높이 구해오기
	 
	 if(contentHeight > contentFrameHeight){
		 frameHeight = contentHeight;
	 }
	 else{
		 frameHeight = contentFrameHeight;
	 }

	 if($('#iFrm').height() != frameHeight ){
		 $('#iFrm').css("height",frameHeight+ "px");
	 }
}

// 프레임을 불러오고나서 height 가 변하는 부분이 있을경우 사용
function frameLoad(){
	if($('#iFrm').contents().find(".contentFrame").length == 0){
		return;
	}
	
	var frameHeight = 0;
	var addHeight = 0;
	var contentHeight = window.innerHeight - $('#header').height() - $('#footer').height() - 20;

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
	 },300);
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
	
	$('#loginUserName').html(userName + '님 로그인');
	
	meneSet();
}


// 메뉴데이터 가져오기 완료
function successGetMenuData(data) {
	menuData = data;
	console.log(menuData);
	
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
	var parentMenuName = '';
	
	// 접속 메뉴 request code 가져오기 수정.
	var findReqCd = false;
	for(var i=0; i<menuData.length; i++) {
		if(menuData[i].link === event.target.link && event.target.innerText === menuData[i].text) {
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
		$iFrm = $('<IFRAME id="iFrm" frameBorder="0" name="iFrm" scrolling="yes" src="'+pathName+'" style=" width:100%; min-width:1024px;" marginwidth="0" marginheight="0"  onload="frameLoad()"></IFRAME>');
		$iFrm.appendTo('#eCAMSFrame');
		
		//상위 TITLE TEXT SET
		//parentMenuName = $(event.target).closest('ul').closest('li').children('a')[0].innerText;
		//$('#ecamsTitleText').html('['+parentMenuName+'] '+event.target.innerText);
	}
}

function goHome() {
	location.reload();
}

function logOut() {
	window.location.replace('/webPage/login/ecamsLogin.jsp');
}

function resizeIframe(iframe) {
    var addHeight = 0;
    
    //var h = window. innerHeight; document.getElementById("top"). tyle.height = (h - 90) + "px";
    
    /*console.log("window.innerHeight : "+window.innerHeight);
    console.log("document.getEflementById('header').style.heght : "+document.getElementById('header').style.height);*/
    
    iframe.css("height",iframe.contents().find(".contentFrame").height() + addHeight + "px");
    //iframe.css("height", (window.innerHeight -85) + "px");
    return iframe.contents().find(".contentFrame").height() + addHeight;
  }