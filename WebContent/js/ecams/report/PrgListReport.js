
//var userid 		= window.top.userId;
var userid 		= "MASTER";
var mainGrid		= new ax5.ui.grid();
var SecuYn = null;
var L_SysCd = null;
var columnData = 
	[ 
		{key : "job",label : "시스템",align : "center",width: "7%"}, 
		{key : "cr_rsrcname",label : "프로그램명",align : "center",width: "14%"}, 
		{key : "cm_dirpath",label : "프로그램경로",align : "center",width: "24%"}, 
		{key : "sta",label : "상태",align : "center",width: "7%"}, 
		{key : "cr_lstver",label : "버전",align : "center",width: "5%"}, 
		{key : "rsrccd",label : "프로그램종류",align : "center",width: "12%"}, 
		{key : "cr_story",label : "프로그램설명",align : "center",width: "10%"}, 
		{key : "cm_username",label : "최종변경자",align : "center",width: "8%"}, 
		{key : "cr_lastdate",label : "최종변경일",align : "center",width: "10%"} 
	];

$(document).ready(function() {
	
	$('input:checkBox[name=checkStd]').wCheck({theme: 'circle-classic blue', selector: 'checkmark', highlightLabel: true});
	mainGrid.setConfig({
		target : $('[data-ax5grid="mainGrid"]'),
		showLineNumber : true,
		showRowSelector : false,
		multipleSelect : false,
		lineNumberColumnWidth : 40,
		rowSelectorColumnWidth : 27,
		body : {
			columnHeight: 24,
	        onClick: function () {
	        	this.self.clearSelect();
	            this.self.select(this.dindex);
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
            	{type: 1, label: "프로그램정보"},
                {type: 2, label: "소스보기"}
            ],
            popupFilter: function (item, param) {
                //console.log(item, param);
                if(param.element) {
                    return true;
                }else{
                    return item.type == 1;
                }
            },
            onClick: function (item, param) {
                console.log(item, param);
                
                if(item.type === 1) {
                	mainGrid.contextMenu.close();
                	openWindow(item.type, 'win', '', param);
                } else if(item.type === 2) {
                	mainGrid.contextMenu.close();
                	openWindow(item.type, 'win', '', param);                	
                } else {		                    	
                	mainGrid.contextMenu.close();
                	modal();		                    	
                }
                //또는 return true;
            }
       }
	}); 
	
	isAdmin();
	comboSet();	
})

function isAdmin() {
	var ajaxData = {
			requestType : 'isAdmin',
			UserId : userid
	}
	ajaxResultData = ajaxCallWithJson('/webPage/report/PrgListReport', ajaxData, 'json');
	SecuYn = ajaxResultData ? "Y" : "N"; 
}

//콤보 데이터 셋
function comboSet() {
	
	var ajaxResult = new Array();
	var comboData = new Array();
	var ajaxData = new Object();
	var selectMenu = ["systemSel", "conditionSel1",  "conditionSel2", "prgStatusSel"];
	
	//범위
	$('[data-ax5select="rangeSel"]').ax5select({
		options: [
			{value: "0", cm_macode: "OPTION", text: "전체"},
			{value: "1", cm_macode: "OPTION", text: "신규중 제외"},
			{value: "2", cm_macode: "OPTION", text: "신규중"},
			{value: "3", cm_macode: "OPTION", text: "폐기분 제외"},
			{value: "4", cm_macode: "OPTION", text: "폐기분"}
		]
	});
	
	//시스템
	ajaxData = {
		UserId : userid,
		tmp : SecuYn,
		requestType	: 'getSysInfo'
	};
	ajaxResult.push(ajaxCallWithJson('/webPage/report/PrgListReport', ajaxData, 'json'));
	
	//조건선택1
	ajaxData.requestType = 'getJogun';
	ajaxData.cnt = "1";
	ajaxResult.push(ajaxCallWithJson('/webPage/report/PrgListReport', ajaxData, 'json'));
	
	//조건선택2
	ajaxData.requestType = 'getJogun';
	ajaxData.cnt = "0";
	ajaxResult.push(ajaxCallWithJson('/webPage/report/PrgListReport', ajaxData, 'json'));
	
	console.log(ajaxResult);
	//콤보박스에 들어갈 데이터 세팅
	$.each(ajaxResult, function(index, value) {
		comboData[index] = [];
		$.each(value, function(key, value2) {
			if(index == 0) {
				comboData[index].push({value : value2.cm_syscd, text : value2.cm_sysmsg});		
			} else {
				comboData[index].push({value : key == 0 ? 0 : value2.cm_micode, text : value2.cm_codename});
			}
		})
	});
	comboData[1][2].value = 2; //조건선택1의 프로그램상태 밸류값 따로 세팅 안 해줄 시 3으로 들어가서 2로 직접 대입
	
	for(var i = 0; i < selectMenu.length; i++) {
		$('[data-ax5select="' + selectMenu[i] + '"]').ax5select({
			options: comboData[i],
			onStateChanged : function(item) {
				if(item.state == "changeValue") {		
					//조건선택2의 선택값에 따른 텍스트필드, 라벨 세팅
					if($("[data-ax5select='conditionSel2']").ax5select("getValue")[0].value == 0) {
						$("#conditionText").prop('disabled', true);
						$("#conditionTextLabel").text("");
					} else {
						$("#conditionText").prop('disabled', false);
						$("#conditionTextLabel").text($("[data-ax5select='conditionSel2']").ax5select("getValue")[0].text);
					}
					
					//조건 선택시마다 조회 이벤트 돌리도록 세팅
					if(item.item.name != "conditionSel2" && $("[data-ax5select='conditionSel1']").ax5select("getValue")[0].value != 0) {
						var sysCd = $("[data-ax5select='systemSel']").ax5select("getValue")[0].value;
						var condCd = $("[data-ax5select='conditionSel1']").ax5select("getValue")[0].value;
						prgOptionSet(sysCd, condCd);
						$("#btnSearch").trigger('click');
					} else if(item.item.name != "conditionSel2" && $("[data-ax5select='conditionSel1']").ax5select("getValue")[0].value == 0) {
						$('[data-ax5select="prgStatusSel"]').ax5select("disable");			
					}
				}
			}
		});	
	}	
	
	//첫 화면 디폴트 출력값 세팅
	prgOptionSet('90001', '2');
	$('[data-ax5select="conditionSel1"]').ax5select("setValue", '2', true);
	$('[data-ax5select="prgStatusSel"]').ax5select("setValue", '5', true);
	$("#btnSearch").trigger('click');
}

//조건선택1의 값에 따른 프로그램종류/상태 콤보박스 세팅
function prgOptionSet(sysCd, condCd) {
	
	$("#prgStatusLabel").text($('[data-ax5select="conditionSel1"').ax5select("getValue")[0].text);
	$('[data-ax5select="prgStatusSel"]').ax5select("enable");
	
	var ajaxData = new Object();
	var ajaxResult = new Object();
	var comboData = [];
	
	ajaxData.requestType = 'getCode';
	ajaxData.L_SysCd = "" + sysCd;
	ajaxData.cnt = "" + condCd;
	ajaxResult = ajaxCallWithJson('/webPage/report/PrgListReport', ajaxData, 'json');
	
	$.each(ajaxResult, function(key, value) {
		comboData.push({value : key == 0 ? '' : value.cm_micode, text : value.cm_codename});
	})
	
	$('[data-ax5select="prgStatusSel"]').ax5select({
		options: comboData,
		onStateChanged : function(item) {
			if(item.state == "changeValue") {					
				$("#btnSearch").trigger('click');
			}
		}
	});	
}

//조회 이벤트 시
$("#btnSearch").bind('click', function() {
		
	if($('[data-ax5select="conditionSel1"]').ax5select("getValue")[0].value == 0) {
		dialog.alert('조건을 먼저 선택해주세요.',function(){});
		return;
	} 
	
	var inputData = new Object();
	var tmpObj = {};
	
	tmpObj = {	
			UserId : userid,
			SecuYn : SecuYn,
			L_SysCd : $('[data-ax5select="systemSel"]').ax5select("getValue")[0].value,
			L_JobCd : "0000",
			Cbo_Cond10_code : $('[data-ax5select="conditionSel1"]').ax5select("getValue")[0].value,
			Cbo_Cond11_code : $('[data-ax5select="conditionSel2"]').ax5select("getValue")[0].value,
			Cbo_Cond2_code : $('[data-ax5select="prgStatusSel"]').ax5select("getValue")[0].value,
			Txt_Cond : $("#conditionText").val(),
			Cbo_Option : $('[data-ax5select="rangeSel"]').ax5select("getValue")[0].value,
			Chk_Aply : $("#checkDetail").is(':checked')
	}
	
	ajaxData = {
			prjData : tmpObj,
			UserId : userid,
			requestType : "getSql_Qry"
	}
	var ajaxResult = ajaxCallWithJson('/webPage/report/PrgListReport', ajaxData, 'json');
	mainGrid.setData(ajaxResult);
	
	
})

//엑셀저장
$("#btnExcel").on('click', function() {
	var st_date = new Date().toLocaleString();
	var today = st_date.substr(0, st_date.indexOf("오"));
	
	mainGrid.exportExcel("프로그램목록 " + today + ".xls");
})

//엔터키
$("#conditionText").bind('keypress', function(event) {
	if(window.event.keyCode == 13) $("#btnSearch").trigger("click");
});

//컨텍스트메뉴 팝업
function openWindow(type,reqCd,reqNo,rsrcName) {
	var nHeight, nWidth, nTop, nLeft, cURL, cFeatures, winName;

	if ( (type+'_'+reqCd) == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}

    winName = type+'_'+reqCd;
    
	if (type === 1) {
		nHeight = screen.height - 300;
	    nWidth  = screen.width - 400;
	    cURL = "../winpop/ProgrmInfo.jsp";
	} else if (type === 2) {
		nHeight = 400;
	    nWidth  = 900;
		cURL = "../winpop/ApprovalInfo.jsp";
	}
	
	var winWidth  = document.body.clientWidth;  // 현재창의 너비
	var winHeight = document.body.clientHeight; // 현재창의 높이
	var winX      = window.screenX;// 현재창의 x좌표
	var winY      = window.screenY; // 현재창의 y좌표
	nLeft = winX + (winWidth - nWidth) / 2;
	nTop = winY + (winHeight - nHeight) / 2;

	cFeatures = "top=" + nTop + ",left=" + nLeft + ",height=" + nHeight + ",width=" + nWidth + ",help=no,menubar=no,status=yes,resizable=yes,scroll=no";

	var f = document.popPam;   		//폼 name
    myWin = window.open(cURL,winName,cFeatures);
    
//    f.formName.value	= rsrcName.item.cm_username;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
//    f.formId.value	= rsrcName.item.cm_userid;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
//    f.formPosition.value	= rsrcName.item.position;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
//    f.formDuty.value	= rsrcName.item.duty;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
//    
    f.action		= cURL; 		//이동할 페이지
    f.target		= winName;    	//폼의 타겟 지정(위의 새창을 지정함)
    f.method		= "post"; 		//POST방식
    f.submit();
    
}