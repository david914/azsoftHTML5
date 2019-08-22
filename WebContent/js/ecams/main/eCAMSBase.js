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
var resizeInterval = null;
var folding = null;
var resizeDelay = null;

$(document).ready(function() {
	
	contentHeight = window.innerHeight - $('#header').height() - $('#footer').height() - 20;
	screenInit();
	
	//압축메뉴 마우스오버효과
	$("#msrIcon, #subbox").bind('mouseover', function() {
		$("#subbox").css({"display" : "inline-block"});
		$("#menuIcon").attr("src", "../../img/menu2_highlight.png");
	})
	$("#msrIcon, #subbox").bind('mouseout', function() {
		$("#subbox").css({"display" : "none"});				
		$("#menuIcon").attr("src", "../../img/menu2.png");
	})
	
	//미결 SR 오류 마우스오버효과
	var color = "";
	$(".cntInfo").hover(function() {	
		color = this.style.color;
		$(this).css({"text-shadow" : " 0 0 2px " + color, "color" : "white"});
	}, function() {
		$(this).css({"text-shadow" : " 0 0 0px white", "color" : color});
	})
	
	setTimeout(function() {
		folding = $(window).width() < 1200 ? false : true;
		$(window).trigger('resize');
	}, 300);
	
	// ifrmae contents의 height에 맞게 height 값 추가
	$(window).resize(function(){		
		clearTimeout(resizeDelay);
		resizeDelay = setTimeout(function() {	
			menuFolding();
			resize();
		}, 200);
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

// eCAMS Main Load [session 에서 유저정보 가져온 후 로딩됨]
function loadEcamsMain() {
	$('#eCAMSFrame').empty();
	$iFrm = $('<IFRAME id="iFrm" frameBorder="0" name="iFrm" scrolling="yes" src="/webPage/main/eCAMSMainNew.jsp" style=" width:100%; height:'+contentHeight+'px; min-width:1024px;" marginwidth="0" marginheight="0" onload="frameLoad()"></IFRAME>');
	$iFrm.appendTo('#eCAMSFrame');
}

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

	if(division == '3' || division == '5') {
		pathName = '/webPage/apply/ApplyRequest.jsp';
		mainTitle = '개발';
		subTitle = '체크인';
	} else if(division == 'B' || division == 'E') {
		pathName = '/webPage/apply/ApplyRequest.jsp';
		mainTitle = '테스트';
		subTitle = '테스트배포';
	} else if(division == 'G') {
		pathName = '/webPage/apply/ApplyRequest.jsp';
		mainTitle = '운영';
		subTitle = '운영배포';
	} else {
		return;
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

    	/*
    	console.log(this.get(0));
    	console.log(this.get(0).scrollHeight);
    	console.log(this.innerHeight());
    	*/
        return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
    }
})(jQuery);

function resize(){
	if($('#iFrm').contents().find(".contentFrame").length == 0){
		return;
	}
	var iFrame = $('#iFrm').contents();
	contentHeight = window.innerHeight - $('#header').height() - $('#footer').height() - 20;
	if(window.innerHeight < 768){
		//return;
	}
	var heightArr = new Array() ;
	var contentFrame = iFrame.find(".contentFrame");
	$('#iFrm').css('min-height',768 - $('#header').height() - $('#footer').height() - 20+'px');
	$('#iFrm').height(contentHeight);
	//contentFrame.height(contentHeight);
	var cnt = 0;
	var heightCk = false;
	if(contentHeight > contentFrame.height()+2){
		heightCk = true;
	}

	iFrame.find("[data-ax5grid-container='root']").each(function(){
		var gridId = $(this).attr("data-ax5grid-instance");
		var height = contentHeight;
		var gridParent = $(this).parent("div").parent("div.az_board_basic")[0].style.height;
		if(gridParent.indexOf('%') < 1){
			return;
		}

		var parentTopHeihgt = gridParent.replace("%",""); 
		//var parentHeight = $(this).parent("div")[0].style.height.replace("%",""); 100% 로 고정

		if(parentTopHeihgt > 100 || parentTopHeihgt.length > 3){
			return true;
		}

		height = Math.round(height * ( parentTopHeihgt / 100 ));

		var tmpObj = new Object();
		tmpObj.gridId = gridId;
		tmpObj.height = height;

		heightArr.push(tmpObj);
	});

	var obj = $('#iFrm').get(0).contentWindow;
	for(var key in obj){
		if(obj[key]== null || key == null || obj[key].length < 0){
			continue;
		}

		if(obj[key] == 'grid@'){
			for(var i=0; i<heightArr.length; i++){
				if(obj[key].id == heightArr[i].gridId){
					heightArr[i].grid = obj[key];
					if(contentHeight <= contentFrame.height()+2){
						console.log("---------------------------");
						obj[key].setHeight(heightArr[i].height);
					}
					cnt ++;
					if(cnt > heightArr.length){
						break;
					}
				}
			}
		}
	};


	console.log("--Start-- contentHeight = " + contentHeight, "contentFrame = "+contentFrame.height())
	setTimeout(function(){	
		if(contentHeight > contentFrame.height()){
			var simHeight = (contentHeight - contentFrame.height()) / heightArr.length;
			for(var i=0; i<heightArr.length; i++ ){
				heightArr[i].grid.setHeight(heightArr[i].height + simHeight);
				console.log("grid Name : "+ heightArr[i].gridId, "grid Height : "+ heightArr[i].height,  "simHeight :" + simHeight)
			}
		}
		console.log("---Add---contentHeight = " + contentHeight, "contentFrame = "+contentFrame.height())
	},100)

	console.log("-End- contentHeight = " + contentHeight, "contentFrame = "+contentFrame.height())

	return;
	
	var addHeight = 0;
	var contentFrameHeight = 0;
	var frameHeight = 0;
	
	//contentHeight = window.innerHeight - $('#header').height() - $('#footer').height() - 20;
	contentFrameHeight = Math.round($('#iFrm').contents().find(".contentFrame").height()+addHeight); // 프레임 내부에 컨텐츠 div 높이 구해오기
	
	/*
	console.log('resize menu [' + contentHistory + ']');
	console.log('프레임 height [' + contentFrameHeight + ']');
	console.log('전체 height [' + contentHeight + ']');
	*/
	
	if(contentHeight > contentFrameHeight){
		frameHeight = contentHeight;
	} else {
		frameHeight = contentFrameHeight;
	}
	
	if($('#iFrm').height() != frameHeight ){
		$('#iFrm').css("height", frameHeight + "px");
		//console.log($('#iFrm').hasVerticalScrollBar());
	}
	
//	var winWidth = window.width();
//	var folding = winWidth < 1150 ? true : false;
//	
//	if(!folding) {
//		$("#msrDiv").animate({"margin-left": 300}, 500, function() {alert("숨김")});
//	}else {
//		$("#msrDiv").animate({"margin-left": 0}, 500, function() {alert("보임")});		
//	}
}

// 프레임을 불러오고나서 height 가 변하는 부분이 있을경우 사용
function frameLoad(){
	$('#iFrm').contents().find('#history_wrap').html(contentHistory);
	
	resize();
	return;
	
	if($('#iFrm').contents().find(".contentFrame").length == 0){
		return;
	}
	$('#iFrm').contents().find("html").css('overflow', 'hidden');
	var frameHeight = 0;
	var addHeight = 0;
	var check = 1;
	contentHeight = window.innerHeight - $('#header').height() - $('#footer').height() - 20;

	resizeInterval = setInterval(function(){
		resize();	
		//console.log(check++);
		contentFrameHeight = Math.round($('#iFrm').contents().find(".contentFrame").height()+addHeight); // 프레임 내부에 컨텐츠 div 높이 구해오기
		 if(contentHeight > contentFrameHeight){
			 frameHeight = contentHeight;
		 }
		 else{
			 frameHeight = contentFrameHeight;
		 }

		 if($('#iFrm').height() == frameHeight ){
			 clearInterval(resizeInterval);
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

// 세션 가져오기
function getSession() {
	var data = new Object();
	data = {
		requestType : 'GETSESSIONUSERDATA',
		sessionID 	: sessionID
	}
	ajaxAsync('/webPage/main/eCAMSBaseServlet', data, 'json',successGetSession);
}

//세션 가져오기 완료
function successGetSession(data) {
	console.log(data);
	userName		= data.userName;
	userId 			= data.userId;
	adminYN 		= data.adminYN === 'true' ? true : false;
	userDeptCd 		= data.deptCd;
	userDeptName	= data.deptName;
	
	if(userId == undefined) {
		window.location.replace('/webPage/login/ecamsLogin.jsp');
		return;
	} else {
		loadEcamsMain();
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

	clearInterval(resizeInterval);
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

function menuFolding() {
	var winWidth = $(window).width();
	
	if(winWidth < 1200 && !folding) {
		$("#msrDiv").animate({"margin-left": 300}, 500, function() {
			$("#subbox").append($("#msrDiv").children());
		});
		$("#msrIcon").fadeIn(700);
		$("#msrBd").animate({"width":"0px"}, 500);
		folding = true;
	} else if(winWidth >= 1200 && folding){
		$("#msrDiv").append($("#subbox").children());
		$("#msrIcon").fadeOut();
		$("#msrBd").animate({"width":"191px"}, 500);
		$("#msrDiv").animate({"margin-left": 0}, 500);	
		folding = false;
	}
}