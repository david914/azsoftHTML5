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
	$('#side-menu').click(clickSideMenu);
	$('.hide-menu').on('click', function(event){
        event.preventDefault();
        if ($(window).width() < 769) {
            $("body").toggleClass("show-sidebar");
        } else {
            $("body").toggleClass("hide-sidebar");
        }
    });
	
	
	// eCAMS Main Load
	$('#eCAMSFrame').empty();
	$iFrm = $('<IFRAME id="iFrm" frameBorder="0" name="iFrm" scrolling="yes" src="/webPage/main/eCAMSMain.jsp" style=" width:100%; height: 92vh"></IFRAME>');
	$iFrm.appendTo('#eCAMSFrame');
	
});

function screenInit() {
	if( sessionID === null ) sessionID =$('#txtSessionID').val();
	console.log(sessionID);
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

function meneSet() {
	var ajaxUserData = null;
	
	var userInfo = {
		requestType : 'MenuList',
		UserId 	: userId
	}   
	ajaxUserData = ajaxCallWithJson('/webPage/main/eCAMSBaseServlet', userInfo, 'json');
	
	menuData = ajaxUserData;
	
	var menuHtmlStr = '';
	menuData.forEach(function(menuItem, menuItemIndex) {
		if(menuItem.link === undefined || menuItem.link === null) {
			if(menuHtmlStr.length > 1) {
				menuHtmlStr += '</ul>\n';
				menuHtmlStr += '</li>\n';
			}
			menuHtmlStr += '<li>\n';
			menuHtmlStr += '<a href="doneMove"><span class="nav-label">'+menuItem.text+'</span><span class="fa arrow"></span> </a>\n';
			menuHtmlStr += '<ul class="nav nav-second-level">\n';
		}else if(menuItem.link !== null) {
			menuHtmlStr += '<li><a href="'+menuItem.link+'">'+menuItem.text+'</a></li>\n';
		}
		
		if((menuItemIndex+1) === menuData.length) {
			menuHtmlStr += '</ul>\n';
			menuHtmlStr += '</li>\n';
		}
	});
	
	$('#side-menu').html(menuHtmlStr);
	$('#side-menu').metisMenu();
}

function clickSideMenu(event) {
	event.preventDefault();
	
	// 사이드메뉴 선택된 영역 a태크 아닐시 반환
	if( event.target.pathname === undefined) return;
	
	var $iFrm = '';
	var pathName = event.target.pathname;
	var parentMenuName = '';
	
	// 접속 메뉴 request code 가져오기 수정.
	var findReqCd = false;
	for(var i=0; i<menuData.length; i++) {
		if(menuData[i].link === event.target.pathname) {
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
		$iFrm = $('<IFRAME id="iFrm" frameBorder="0" name="iFrm" scrolling="yes" src="'+event.target.href+'" style=" width:100%; height: 92vh"></IFRAME>');
		$iFrm.appendTo('#eCAMSFrame');
		
		//상위 TITLE TEXT SET
		parentMenuName = $(event.target).closest('ul').closest('li').children('a')[0].innerText;
		$('#ecamsTitleText').html('['+parentMenuName+'] '+event.target.innerText);
	}
	
	// ifrmae contents의 height에 맞게 height 값 추가
/*	$("#iFrm").on("load resize",function(){
		$("#iFrm").css("height","");
		console.log("load height : "+$("#iFrm").contents().height());
		if(iframeHeight != $("#iFrm").contents().height() + 20){
			iframeHeight = resizeIframe($("#iFrm"));
		}
	})*/
}

function goHome() {
	location.reload();
}

function logOut() {
	window.location.replace('/webPage/login/ecamsLogin.jsp');
}

function resizeIframe(iframe) {
    var addHeight = 20;
    
    //var h = window. innerHeight; document. getElementById("top"). style. height = (h - 90) + "px";
    
    /*console.log("window.innerHeight : "+window.innerHeight);
    console.log("document.getEflementById('header').style.heght : "+document.getElementById('header').style.height);*/
    
    iframe.css("height",iframe.contents().height() + addHeight + "px");
    return iframe.contents().height() + addHeight;
  }