/**
 * eCAMS 공통 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문 +++
 * 	버전 : 1.1
 *  수정일 : 2019-02-07
 */


var dialog 			= new ax5.ui.dialog({title: "확인"});
var confirmDialog 	= new ax5.ui.dialog();	//알럿,확인창
var mask 			= new ax5.ui.mask();
var picker			= new ax5.ui.picker();
confirmDialog.setConfig({
    title: "선택창",
    theme: "info"
});

function copyReferenceNone(copyArray){
	return JSON.parse(JSON.stringify(copyArray));  // 
}


function ajaxCallWithJson(url, requestData, dataType) {
	var requestJson = JSON.stringify(requestData);
	var successData = null;
	$.ajax({
		type 	: 'POST',
		url 	: url,
		data 	: requestJson,
		dataType: dataType,
		async 	: false,
		/**
		 * async 안쓰는게 좋다고 함
		 * [Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. 
		 * For more help, check https://xhr.spec.whatwg.org/.
		 * 메인 쓰레드에서의 동기화된 XMLHttpRequest는 사용자 경험에 안좋은 영향을 미치기 때문에 더이상 사용하지 않습니다. 더 자세한 사항은 http://xhr.spec.whatwg.org/  를 참고해 주십시오.
		 */
		success : function(data) {
			successData =  copyReferenceNone(data);
		},
		error 	: function(req, stat, error) {
			console.log(error);
		}
	});
	
	if(successData != null) return successData;
	else return 'ERR';
};

function $F(caller) { 
    var f = caller;
    if(caller) f = f.caller;
    var pat = /^function\s+([a-zA-Z0-9_]+)\s*\(/i;

    pat.exec(f);  //메서드가 일치하는 부분을 찾으면 배열변수를 반환하고, 검색 결과를 반영하도록 RegExp 개체가 업데이트된다.

    var func = new Object(); 
    func.name = RegExp.$1; 
    
    return func; 
}


function ajaxAsync(url, requestData, dataType,successFunc,callbackFunc) {
	changeCursor(true);
	var calleeFuncName = $F(arguments.callee);
	var requestJson = JSON.stringify(requestData);
	var ajax = $.ajax({
		type 	: 'POST',
		url 	: url,
		data 	: requestJson,
		dataType: dataType,
		async 	: true,
		complete : function() {
			changeCursor(false);
		}
	}).then(successFunc, function(err) {
		console.log('============================에러발생가 발생한 호출 함수명 [' +calleeFuncName.name + ']==================');
		console.log('============================Ajax 통신중 error 발생 Error message START============================');
		console.log(err);
		console.log('============================Error message END============================');
	}).then(callbackFunc);
}

function changeCursor(cursorSw) {
	if(cursorSw) {
		$('html').css({'cursor':'wait'});
		$('body').css({'cursor':'wait'});
	} else {
		$('html').css({'cursor':'auto'});
		$('body').css({'cursor':'auto'});
	}
}

function Request(){
	var requestParam ="";
    this.getParameter = function(param){
    	var url = unescape(location.href); //현재 주소를 decoding
        var paramArr = (url.substring(url.indexOf("?")+1,url.length)).split("&"); //파라미터만 자르고, 다시 &그분자를 잘라서 배열에 넣는다. 

        for(var i = 0 ; i < paramArr.length ; i++){
            var temp = paramArr[i].split("="); //파라미터 변수명을 담음

            if(temp[0].toUpperCase() == param.toUpperCase()){
            	requestParam = paramArr[i].split("=")[1]; // 변수명과 일치할 경우 데이터 삽입
                break;
            }

        }
        return requestParam;
    };
}


function CodeInfo(MACODE, SelMsg, closeYn) {
	this.MACODE 	= MACODE;
	this.SelMsg 	= SelMsg;
	this.closeYn 	= closeYn;
};


/* 코드정보 가져오기 공통 함수 정의.
 * 한번에 여러개 혹은 하나의 코드정보를 가져옵니다.
 * 
 * EX)
 * var codeInfos = getCodeInfoCommon( [new CodeInfo('CATTYPE','ALL','N'),		>> CodeInfo 객체를    배열 형태로 파라미터 전달
										new CodeInfo('QRYGBN','ALL','N')] );
	
	cboCatTypeData 	= codeInfos.CATTYPE;	>> 리턴받은 DATA에서 MACODE값으로 해당 값을 불러서 사용하면 됩니다.
	cboQryGbnData 	= codeInfos.QRYGBN;
	SBUxMethod.refresh('cboCatType');
	SBUxMethod.refresh('cboQryGbn');
 */
function getCodeInfoCommon(codeInfoArr) {
	var returnCodeInfo = {};
	var ajaxReturnData = null;
	var codeInfo = {};
	var divisionMacode = '';
	codeInfo = {
		codeInfoData: 	codeInfoArr,
		requestType: 	'CODE_INFO'
	};
	ajaxReturnData = ajaxCallWithJson('/webPage/common/CommonCodeInfo', codeInfo, 'json');
	if(ajaxReturnData !== 'ERR') {
		return ajaxReturnData;
	} else {
		return null;
	}
}


/* 현재 날짜를 기준으로 
 *  dateSeparator = ['MON' , 'DATE', 'LASTDATE' , 'FIRSTDATE'] 중 하나 선택사용 
 *  increaseDecreaseNumber = 양수 혹은 음수
 *  
 *  EX)
 *  getDate('DATE',-1));  	>> 현재 날짜에서 하루전날짜
 *  getDate('DATE',0));		>> 현재 날짜
 *  getDate('MON',-1));		>> 한달 전
 *  getDate('MON',1)); 		>> 한달 후
 *  getDate('LASTDATE',0));	>> 현재달의 마지막 날짜
 *  getDate('FIRSTDATE',0));>> 현재달의 첫 날짜		 		
 * 
 */
function getDate(dateSeparator, increaseDecreaseNumber) {
	
	var calcuDate = new Date( new Date().getFullYear() 
						, new Date().getMonth().length === 1 ?  '0'+ new Date().getMonth() : new Date().getMonth()
						, new Date().getDate().length === 1 ? '0'+new Date().getDate() : new Date().getDate() );
	
	if(dateSeparator === 'MON'){
		if(calcuDate.getMonth() === '0' && increaseDecreaseNumber === -1){
			calcuDate.setFullYear(calcuDate.getFullYear() - 1);
			calcuDate.setMonth(11);
		}else if(calcuDate.getMonth() === '11' && increaseDecreaseNumber === 1){
			calcuDate.setFullYear(calcuDate.getFullYear() + 1);
            calcuDate.setMonth(0);
		}else {
        	calcuDate.setMonth(calcuDate.getMonth() + increaseDecreaseNumber);
        }
	}
	if(dateSeparator === 'DATE') calcuDate.setDate(calcuDate.getDate() + increaseDecreaseNumber);
	if(dateSeparator === 'LASTDATE') calcuDate.setDate(0);
	if(dateSeparator === 'FIRSTDATE') calcuDate.setDate(1);
	
	return changeDateToYYYYMMDD(calcuDate);
}

function getTime() {
	var d = new Date();
	var hour = '';
	var min = '';
	hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	min  = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	var currentTime = hour + '' + min;
	return currentTime;
}

/*
 * Javascript Date형식을 YYYYMMDD의 String으로 형 변환
 */
function changeDateToYYYYMMDD(date){
	
	var year 	= date.getFullYear();
	var month 	= (date.getMonth() + 1) <  10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
	var date 	= date.getDate() <  10 ? '0' + date.getDate() : date.getDate();
	return year+''+month+''+date;
}

// StringReplaceAll
// ex) replaceAllString($("#dateStD").val(), "/", "");
function replaceAllString(source, find, replacement){
	return source.split( find ).join( replacement );
}

function getSelectedIndex(id) {
	return $('[data-ax5select="'+id+'"]').ax5select("getValue")[0]['@index'];
}

function getSelectedVal(id) {
	return $('[data-ax5select="'+id+'"]').ax5select("getValue")[0];
}

// window load 되기 전까지 마우스 커서 wait 로 나타나게 처리
$('html').css({'cursor':'wait'});
$('body').css({'cursor':'wait'});
$(window).on('load',function(){
	$('html').css({'cursor':'auto'});
	$('body').css({'cursor':'auto'});
	
});


/*
 * promise 입니다.
 * 데이터의 처리 순서를 비동기로 처리해야 할시 사용하세요.
 */
var _promise = function(ms,action){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve(action);
		},ms)
	});
}

function beForAndAfterDataLoading(beForAndAfter,msg){
	if(beForAndAfter === 'BEFORE'){
		$('html').css({'cursor':'wait'});
		$('body').css({'cursor':'wait'});
	}
	
	if(beForAndAfter === 'AFTER'){
		$('html').css({'cursor':'auto'});
		$('body').css({'cursor':'auto'});
	}
	
}

function defaultPickerInfo(dataAx5picker, direction) {
	if (direction == '' || direction == null) direction = "bottom";
	return {
		target: $('[data-ax5picker="'+dataAx5picker+'"]'),
		direction: direction,
		content: {
			width: 220,
			margin: 10,
			type: 'date',
			config: {
				control: {
					left: '<i class="fa fa-chevron-left"></i>',
					yearTmpl: '%s',
					monthTmpl: '%s',
					right: '<i class="fa fa-chevron-right"></i>'
				},
				dateFormat: 'yyyy/MM/dd',
				lang: {
					yearTmpl: "%s년",
					months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
					dayTmpl: "%s"
				},dimensions: {
					height: 140,
					width : 75,
					colHeadHeight: 11,
					controlHeight: 25,
				}
			},
			formatter: {
				pattern: 'date'
			}
		},
		btns: {
			today: {
				label: "Today", onClick: function () {
					var today = new Date();
					this.self
					.setContentValue(this.item.id, 0, ax5.util.date(today, {"return": "yyyy/MM/dd"}))
					.setContentValue(this.item.id, 1, ax5.util.date(today, {"return": "yyyy/MM/dd"}))
					.close();
				}
			},
			thisMonth: {
				label: "This Month", onClick: function () {
					var today = new Date();
					this.self
					.setContentValue(this.item.id, 0, ax5.util.date(today, {"return": "yyyy/MM/01"}))
					.setContentValue(this.item.id, 1, ax5.util.date(today, {"return": "yyyy/MM"})
							+ '/'
							+ ax5.util.daysOfMonth(today.getFullYear(), today.getMonth()))
							.close();
				}
			},
			ok: {label: "Close", theme: "default"}
		}
		
	};
}

/**
 *	cbo 데이터 세팅시 자바에서 받아온 모든 데이터 편하게 넣어주기
 *
 *  !!!!기존 사용법
 *  cboBldCdData = data;
 *  cboOptions = [];
	$.each(cboBldCdData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboBldCd"]').ax5select({
        options: cboOptions
    });
    
    
    !!!!injectCboDataToArr function 사용시
    cboSysCdData = data;
	$('[data-ax5select="cboSysCd"]').ax5select({
        options: injectCboDataToArr(cboSysCdData, 'cm_syscd' , 'cm_sysmsg')
	});
 *   
 */
function injectCboDataToArr(data, value, text) {
	var cboOptionObj	= null;
	var cboOptions 	= [];
	var keyArr		= [];
	data.forEach(function(item, index) {
		cboOptionObj = new Object();
		cboOptionObj = item;
		cboOptionObj.value = item[value];
		cboOptionObj.text = item[text];
		cboOptions.push(cboOptionObj);
		cboOptionObj = null;
	});
	return cboOptions; 
}

String.prototype.trim = function() { 
	return this.replace(/^\s+|\s+$/g,""); 
}

function winOpen(form, winName, cURL, nHeight, nWidth) {
	var cFeatures 	= '';
	var tmpWindow 	= '';
	var nTop	 	= '';
	var nLeft 		= '';
	
    cURL = 'http://'+location.host + cURL;
    nTop  = parseInt((window.screen.availHeight/2) - (nHeight/2));
	nLeft = parseInt((window.screen.availWidth/2) - (nWidth/2));
	
    form.action		= cURL; 		//이동할 페이지
    form.target		= winName;    	//폼의 타겟 지정(위의 새창을 지정함)
    form.method		= "post"; 		//POST방식
    
	cFeatures = "top=" + nTop + ",left=" + nLeft + ",height=" + nHeight + ",width=" + nWidth + ",help=no,menubar=no,status=yes,resizable=yes,scroll=no";
	
	tmpWindow = window.open('',winName,cFeatures);
	form.submit();
	return tmpWindow;
}

function clone(obj){
	if(Array.isArray(obj)){
		return obj.slice();
	}
	
	var output = {};
	for(var i in obj){
		output[i] = obj[i];
	}
	return output
	
}

/**
 * 캘린더 선택시 앞의 input 창에 클릭 이벤트를 주어 달력이 켜지도록
 * @returns
 */
$('.btn_calendar').bind('click', function() {
	if($(this).css('background-color') === 'rgb(255, 255, 255)') {
		var inputs = $(this).siblings().prevAll('input');
		$(inputs[0]).trigger('click');
	}
});

/**
 * byte 용량을 환산하여 반환
 * 용량의 크기에 따라 MB, KB, byte 단위로 환산함
 * ex) byte(102020, 1) > 102.0 KB
 * @param fileSize  byte 값
 * @param fixed     환산된 용량의 소수점 자릿수
 * @returns {String}
 */
function byte(fileSize, fixed) {
    var str = null;
    
    //GB 단위 이상일때 GB 단위로 환산
    if (fileSize >= 1024 * 1024 * 1024) {
        fileSize = fileSize / (1024 * 1024 * 1024);
        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
        str = commaNum(fileSize) + ' GB';
    }
    //MB 단위 이상일때 MB 단위로 환산
    else if (fileSize >= 1024 * 1024) {
        fileSize = fileSize / (1024 * 1024);
        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
        str = commaNum(fileSize) + ' MB';
    }
    //KB 단위 이상일때 KB 단위로 환산
    else if (fileSize >= 1024) {
        fileSize = fileSize / 1024;
        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
        str = commaNum(fileSize) + ' KB';
    }
    //KB 단위보다 작을때 byte 단위로 환산
    else {
        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
        str = commaNum(fileSize) + ' byte';
    }
    return str;
}

// 숫자 3자리마다 콤마 삽입
function commaNum(n) {
    var txtNumber = '' + n;
    var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
    var arrNumber = txtNumber.split('.');
    arrNumber[0] += '.';
    do {
        arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
    }
    while (rxSplit.test(arrNumber[0]));
    if(arrNumber.length > 1) {
        return arrNumber.join('');
    } else {
        return arrNumber[0].split('.')[0];
    }
}
/*
function getRegexp(type) {
	if( type === 'NUM')
		return /[^0-9]/g;
	if( type === 'KOR')
		return /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
	if( type === 'NUM')
		return /[^0-9]/g;
	if( type === 'NUM')
		return /[^0-9]/g;
	if( type === 'NUM')
		return /[^0-9]/g;
}

*/