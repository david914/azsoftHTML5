/**
 * 로그인 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-01-29
 */
var pwdChangeWin = null;

$(document).ready(function() {
	//$('body').css('background','#f8f8f8');
	screenInit();
});

function screenInit() {
	$('#ecamsLoginForm').bind('submit', loginSubmitAction);
	setInput();
}

function setInput() {
	if( getCookie('remember') === 'true'){
		$('#idx_input_id').val(getCookie('ecams_id'));
		$('#idx_input_pwd').val(getCookie('ecams_pwd'));
		$('#chkbox_remember').prop("checked",true);
	}else {
		$('#idx_input_id', 	'');
		$('#idx_input_pwd', '');
	}
}

function fnRsaEnc(value, rsaPublicKeyModulus, rsaPpublicKeyExponent) {
    var rsa = new RSAKey();
    rsa.setPublic(rsaPublicKeyModulus, rsaPpublicKeyExponent);

    var encValue = rsa.encrypt(value);     // 사용자ID와 비밀번호를 RSA로 암호화한다.
    return encValue;
}

var loginSubmitAction = function(e) {
	e.preventDefault();
    e.stopPropagation();
    
    var validationCheckFlag = checkValidation();
    var selectedRemember 	= $('#chkbox_remember').is(":checked");
    var loginValidReturnStr = null;
    var authCode 			= null;
    var userId 				= null;
    var sessionID			= null;
    
    if( ! validationCheckFlag ) return;

    if(selectedRemember) {
		setCookie('ecams_id', 	$('#idx_input_id').val());
    	setCookie('ecams_pwd', 	$('#idx_input_pwd').val());
    	setCookie('remember', 	true);
	} else {
		setCookie('ecams_id', 	'');
    	setCookie('ecams_pwd', 	'');
    	setCookie('remember', 	false);
	}
    
    try {
    	var encPassword = fnRsaEnc($('#idx_input_pwd').val(), $('#rsaPublicKeyModulus').val(), $('#rsaPublicKeyExponent').val());
    	if (null == encPassword || encPassword == '' || encPassword == undefined || encPassword == 'undefined') {
    		dialog.alert('아이디 또는 비밀번호를 다시 확인하세요.', function() {
    			return;
    		});
    	}
	} catch (err) {
		dialog.alert(err);
		return;
	} finally {
		$('#idx_input_pwd').val('');
	}
	
    loginValidReturnStr = isValidLogin(encPassword);
    
    if (loginValidReturnStr.indexOf('ENCERROR')>-1) {
		dialog.alert('비정상접근입니다. 다시 로그인 하시기 바랍니다.', function() {
			$('#idx_input_id').val('');
			$('#idx_input_pwd').val('');
			return;
		});
    }
    authCode= loginValidReturnStr.substring(0,1);
    userId	= loginValidReturnStr.substring(1,loginValidReturnStr.lenght);
    
    /*
  	auth_rtn==0:정상적인 로그인
	auth_rtn==3:비번초기화 후 입력비번이랑 주민번호랑 일치 할때
	auth_rtn==9:형상관리시스템 관리자 정상적인로그인
	*/    
    if ( authCode === '0' || authCode === '3' || authCode === '9') {
    	
    	if(authCode === '3') {
    		dialog.alert('비밀번호가 초기화 되었습니다.\n비밀번호 재설정 후 이용해 주시기 바랍니다.', function() {
    			openPwdChange(userId);
    		});
    		return;
    	}
    	
    	sessionID = setSessionLoginUser(userId);
    	updateLoginIp(userId);
    	
    	if( sessionID !== null && sessionID !== undefined ) {
    	    var form = document.createElement("form");
            var parm = new Array();
            var input = new Array();

            form.action = '/webPage/main/eCAMSBase.jsp';
            form.method = "post";

            parm.push( ['sessionID', sessionID] );

            for (var i = 0; i < parm.length; i++) {
                input[i] = document.createElement("input");
                input[i].setAttribute("type", "hidden");
                input[i].setAttribute('name', parm[i][0]);
                input[i].setAttribute("value", parm[i][1]);
                form.appendChild(input[i]);
            }
            document.body.appendChild(form);
            form.submit();
    	}
    } else {
    	//에러카운드 초과 했을때
    	if (authCode === '2') {
    		dialog.alert('비밀번호 오류 횟수가 초과 되었습니다. 관리자에게 문의하시기 바랍니다.', function() {});
    	}
    	//DB 사용자정보가 없을때
    	if (authCode === '7') {
    		dialog.alert('사용자 ID가 존재하지 않습니다. 관리자에게 문의하시기 바랍니다.', function() {});
    	}
    	//cm_active == 0 일때
    	if (authCode === '1') {
    		dialog.alert('해당 ID는 비활성화 상태입니다. 관리자에게 문의하시기 바랍니다.', function() {});
    	}
    	//CM_JUMINNUM 주민번호가 null 일때
    	if (authCode === '5') {
    		dialog.alert('관리자에게 문의하시기 바랍니다.', function() {});
    	}
    	//비번변경 주기 초과 했을 경우
    	if (authCode === '6') {
    		dialog.alert('비밀번호 변경주기를 초과했습니다. 관리자에게 문의하시기 바랍니다.', function() {});
    	}
    	
    	//비밀번호 틀렸을경우
    	if (authCode === '4') {
    		dialog.alert('아이디 또는 비밀번호를 다시 확인하세요.', function() {
    			$('#idx_input_pwd').val('');
    		});
    	}
    }
};

function openPwdChange(userId) {
	var nHeight, nWidth, nTop, nLeft, cURL, cFeatures, winName;
	if (pwdChangeWin != null 
			&& !pwdChangeWin.closed ) {
		pwdChangeWin.close();
	}

    winName = 'pwdChangeWin';
	nHeight = 590;
    nWidth  = 1026;
    cURL = "../webPage/mypage/PwdChange.jsp";
	
	nTop  = parseInt((window.screen.availHeight/2) - (nHeight/2));
	nLeft = parseInt((window.screen.availWidth/2) - (nWidth/2));
	cFeatures = "top=" + nTop + ",left=" + nLeft + ",height=" + nHeight + ",width=" + nWidth + ",help=no,menubar=no,status=yes,resizable=yes,scroll=no";

	var f = document.popPam;   		//폼 name
	pwdChangeWin = window.open('',winName,cFeatures);
    
    
    f.userId.value	= userId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.winPopSw.value= 'true';    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.action		= cURL; 		//이동할 페이지
    f.target		= winName;    	//폼의 타겟 지정(위의 새창을 지정함)
    f.method		= "post"; 		//POST방식
    f.submit();
}

function setSessionLoginUser(userId) {
	var userInfo = {
		userId		: 	userId,
		requestType	: 	'SETSESSION'
	}
	return ajaxCallWithJson('/webPage/login/Login', userInfo, 'json');
}

function updateLoginIp(userId) {
	var form = document.popPam;
	var IpAddr = form.custIP.value;
	var Url = form.Url.value;
	
	var userInfo = {
		userId		: userId,
		IpAddr		: IpAddr,
		Url 		: Url, 
		requestType	: 'UPDATELOGINIP'
	}
	return ajaxCallWithJson('/webPage/login/Login', userInfo);
}

function isValidLogin(encPassword) {
	var ajaxReturnData = null;
	
	var userInfo = {
		userId		: 	$('#idx_input_id').val(),
		userPwd		: 	encPassword,//$('#idx_input_pwd').val()
		requestType	: 	'ISVALIDLOGIN'
	}
	ajaxReturnData = ajaxCallWithJson('/webPage/login/Login', userInfo, 'json');
	return ajaxReturnData;
}

function checkValidation() {
	var cookieId = $('#idx_input_id').val();
	var cookiePwd = $('#idx_input_pwd').val();
	var validationFlag = false;
	if( cookieId !== undefined && cookieId !== '' && cookiePwd !== undefined && cookiePwd !== '') validationFlag = true;
	else validationFlag = false;
	
	return validationFlag;
}

