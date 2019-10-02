var userid 		= window.top.userId;
var mainGrid	= new ax5.ui.grid();
var picker		= new ax5.ui.picker();
var selectedItem = null;
var systemSelData = [];
var columnData	= 
	[ 
		{key : "cm_sysmsg",label : "시스템",align : "left",width: "10%"}, 
		{key : "cr_rsrcname",label : "프로그램명",align : "left",width: "11%"}, 
		{key : "cm_dirpath",label : "프로그램경로",align : "left",width: "20%"}, 
		{key : "jawon",label : "프로그램종류",align : "left",width: "7%"}, 
		{key : "cm_deptname",label : "신청팀",align : "center",width: "5%"}, 
		{key : "cm_username",label : "신청자",align : "left",width: "3%"}, 
		{key : "acptdate",label : "신청일시",align : "left",width: "5%"}, 
		{key : "dayTerm",label : "경과일수",align : "left",width: "5%"}, 
		{key : "acptno",label : "신청번호",align : "center",width: "7%"}, 
		{key : "cr_itsmid",label : "SR-ID",align : "center",width: "8%"}, 
	];

picker.bind({
    target: $('[data-ax5picker="basic"]'),
    direction: "top",
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
});

mainGrid.setConfig({
	target : $('[data-ax5grid="mainGrid"]'),
	showLineNumber : true,
	showRowSelector : false,
	multipleSelect : false,
	lineNumberColumnWidth : 40,
	rowSelectorColumnWidth : 27,
	header : {align: "center"},
	body : {
		columnHeight: 24,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            selectedItem = this.item;
        },
	},
	columns : columnData,
	contextMenu: {
        iconWidth: 20,
        acceleratorWidth: 100,
        itemClickAndClose: false,
        icons: {
            'arrow': '<i class="fa fa-caret-right"></i>'
        },
        items: [
        	{type: 1, label: "프로그램정보"}
        ],
        popupFilter: function (item, param) {
                return true;
        },
        onClick: function (item, param) {
        	 console.log(item, param);
        	mainGrid.contextMenu.close();
        	openWindow(item.type, 'win', '', selectedItem.cr_itemid);
        }
   }
});

//체크박스
$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

$(document).ready(function() {
	setDateEnable();
	getSysInfo();
	var oldVal = "";
	// 기간 선택 달력의 경우 두번째 달력 값 선택 또는 변경시 자동으로 달력 닫히게 추가
	$('#dateEd').bind('propertychange change keyup paste input', function() {
		var currentVal =  $("#dateEd").val();
		if(currentVal != oldVal){
			picker.close();
		}
		oldVal = currentVal;
	});
	//조회
	$("#btnSearch").bind('click', function() {
		search();
	});
	//엑셀
	$("#btnExcel").on('click', function() {
		var st_date = new Date().toLocaleString();
		var today = st_date.substr(0, st_date.indexOf("오"));
		mainGrid.exportExcel("장기체크아웃현황 " + today + ".xls");
	});

	$('#chkDay').bind('click', function() {
		setDateEnable();
	});
	
	//엔터조회
	$("#txtUser, #txtPath, #dayTerm").bind('keypress', function() {
		if(window.event.keyCode == 13) search();
	})
	
});

function search() {
	var inputData = new Object();
	var stDt;
	var edDt;
	var chkDay;
	
	if($('#chkDay').is(':checked')) {
		stDt = replaceAllString($("#dateSt").val(), '/', '');
		edDt = replaceAllString($("#dateEd").val(), '/', '');
		chkDay = "1";
	} else {
		stDt = "";
		edDt = "";
		chkDay = "0";
	}
	console.log($("[data-ax5select='systemSel']").ax5select("getValue")[0].value);
	inputData = {
		strSys : $("[data-ax5select='systemSel']").ax5select("getValue")[0].value,
		stDt : stDt,
		edDt : edDt,
		chkDay : chkDay,
		txtUser : $("#txtUser").val(),
		txtPath : $("#txtPath").val(),
		dayTerm : $("#dayTerm").val(),
		userId  : userid
	}
	ajaxData = {
			Data : inputData,
			UserId : userid,
			requestType : "getReqList"
	}
	var ajaxResult = ajaxCallWithJson('/webPage/report/ChkOutListReport', ajaxData, 'json');
	mainGrid.setData(ajaxResult);
}

function getSysInfo() {
	var ajaxData = {
			UserId : userid,
			requestType	: 'getSysInfo'
		};
		ajaxAsync('/webPage/report/ChkOutListReport', ajaxData, 'json', SuccessGetSysInfo);
}

function SuccessGetSysInfo(data) {
	systemSelData = data;
	
	$('[data-ax5select="systemSel"]').ax5select({
        options: injectCboDataToArr(systemSelData, 'cm_syscd' , 'cm_sysmsg')
	});
}

function setDateEnable() {
	var today = getDate('DATE',0);
	var lastMonth = getDate('DATE', -30);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	lastMonth = lastMonth.substr(0,4) + '/' + lastMonth.substr(4,2) + '/' + lastMonth.substr(6,2);
	if($('#chkDay').is(':checked')) {
		$('#dateSt').prop("disabled", false);
		$('#dateEd').prop("disabled", false);	
		$('#dateSt').val(today);
		$('#dateEd').val(lastMonth);
	} else {
		$('#dateSt').prop("disabled", true);
		$('#dateEd').prop("disabled", true);
	}
}

function openWindow(type,reqCd,reqNo,itemId) {
	var nHeight, nWidth, nTop, nLeft, cURL, cFeatures, winName;
	if ( (type+'_'+reqCd) == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}
    winName = type+'_'+reqCd;
	nHeight = screen.height - 300;
    nWidth  = screen.width - 400;
    cURL = "../winpop/PopProgramInfo.jsp";
	var winWidth  = document.body.clientWidth;  // 현재창의 너비
	var winHeight = document.body.clientHeight; // 현재창의 높이
	var winX      = window.screenX;// 현재창의 x좌표
	var winY      = window.screenY; // 현재창의 y좌표
	nLeft = winX + (winWidth - nWidth) / 2;
	nTop = winY + (winHeight - nHeight) / 2;

	cFeatures = "top=" + nTop + ",left=" + nLeft + ",height=" + nHeight + ",width=" + nWidth + ",help=no,menubar=no,status=yes,resizable=yes,scroll=no";
	
	var f = document.popPam;   		//폼 name
	f.acptno.value	= '';    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.user.value 	= userid;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.itemid.value	= itemId;
    console.log(selectedItem.cr_rsrccd);
    console.log(selectedItem.cr_rsrcname);
    console.log(f);
	f.syscd.value = selectedItem.cr_syscd;
	f.rsrccd.value = selectedItem.cr_rsrccd;
	f.rsrcname.value = selectedItem.cr_rsrcname.trim();
    myWin = window.open(cURL,winName,cFeatures);
    f.action		= cURL; 		//이동할 페이지
    f.target		= winName;    	//폼의 타겟 지정(위의 새창을 지정함)
    f.method		= "post"; 		//POST방식
    f.submit();
    
}
