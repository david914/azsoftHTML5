
var userGrid 		= new ax5.ui.grid(); 
var tab2Grid		= new ax5.ui.grid();
var tab3Grid		= new ax5.ui.grid();
var selPositionData = null;
var picker1			= new ax5.ui.picker();
var picker2			= new ax5.ui.picker();
var binderModel		= new ax5.ui.binder();
var myWin			= null;

var testModal		= new ax5.ui.modal();

var menu = new ax5.ui.menu({
	theme : 'primary',
	acceleratorWidth: 100,
	items : [
		{label : "새창 열기", type: 3},
		{label : "팝업창 열기"}
	]
});

var columnData = 
	[ 
		{key : "cm_username",label : "이름",align : "center",width: "20%"}, 
		{key : "cm_userid",label : "ID",align : "center",width: "20%"}, 
		{key : "cm_position",label : "직위코드",align : "center",width: "20%"}, 
		{key : "position",label : "직위",align : "center",width: "10%"}, 
		{key : "cm_duty",label : "직책코드",align : "center",width: "20%"}, 
		{key : "duty",label : "직책",align : "center",width: "10%"} 
	];

$(document).ready(function() {	
			userGrid.setConfig({
				target : $('[data-ax5grid="first-grid"]'),
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
			            gridClick();
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
		                	{type: 3, label: "새창 띄우기"},
		                    {label: "팝업창 띄우기"}
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
		                    
		                    if(item.type === 3) {
		                    	userGrid.contextMenu.close();
		                    	openWindow(item.type, 'win', '', param);
		                    } else {		                    	
		                    	userGrid.contextMenu.close();
		                    	modal();		                    	
		                    }
		                    //또는 return true;
		                }
		           }
				
			}); /* 테스트용 데이터 생성 */
			
			$(".tab_content:eq(1)").show();
			tab2Grid.setConfig({
				target : $('[data-ax5grid="tab2-grid"]'),
				showLineNumber : true,
				showRowSelector : false,
				multipleSelect : false,
				lineNumberColumnWidth : 40,
				rowSelectorColumnWidth : 27,
				columns : columnData
			}); /* 테스트용 데이터 생성 */
			$(".tab_content:eq(2)").show();
			tab3Grid.setConfig({
			target : $('[data-ax5grid="tab3-grid"]'),
			showLineNumber : true,
			showRowSelector : false,
			multipleSelect : false,
			lineNumberColumnWidth : 40,
			rowSelectorColumnWidth : 27,
			columns : columnData
			}); /* 테스트용 데이터 생성 */
			
			comboSet();
			setTabMenu();
			
	        picker1.bind({
	            target: $('[data-picker-date="date1"]'),
	            content: {
	                type: 'date',
	                config: {
	                    mode: "day"//, selectMode: "month"
	                },
	                formatter: {
	                    pattern: 'date(day)'
	                },
	            }
	        });
	        
	        picker2.bind({
	        	target: $('[data-picker-date="date2"]'),
	        	content: {
	        		type: 'date',
	        		config: {
	        			mode: "day"//, selectMode: "month"
	        		},
	        		formatter: {
	        			pattern: 'date(day)'
	        		},
	        	}
	        });
			
	        $('input:radio[name=active]').wRadio({theme: 'circle-classic blue', selector: 'checkmark', highlightLabel: true});
		});

$("#btnSearch").click(function() {
	memberList();
});

function memberList() {
	var option = 0;
	if($("#active1").is(":checked")) option += 1;
	if($("#active2").is(":checked")) option += 2;
	var inputData = new Object();
	
	inputData.name = $("#inputName").val();
	inputData.id = $("#inputId").val();
	inputData.position = $("[data-ax5select='selPosition']").ax5select("getValue")[0].text;
	inputData.duty = $("[data-ax5select='selDuty']").ax5select("getValue")[0].text;
	inputData.option = option;
	inputData.stDt = $("#stDt").val();
	inputData.edDt = $("#edDt").val();
	
	var ajaxData;
	ajaxData = new Object();
	ajaxData = {
		info		: inputData,
		requestType	: 'GETUSERLIST'
	}
	ajaxAsync('/webPage/administrator/KDH_testServlet', ajaxData, 'json', successSearch);
}

function successSearch(data) {
	var gridData = data;
	userGrid.setData(gridData);	
}

function comboSet() {
	
	var ajaxData;
	ajaxData = new Object();
	ajaxData = {
		requestType	: 'GETPOSITIONLIST'
	}
	
	var ajaxResult1 = ajaxCallWithJson('/webPage/administrator/KDH_testServlet', ajaxData, 'json');
	ajaxData.requestType = "GETDUTYLIST";
	var ajaxResult2 = ajaxCallWithJson('/webPage/administrator/KDH_testServlet', ajaxData, 'json');
	
	selPositionData = [];
	selDutyData = [];
	for(var i = 0; i < ajaxResult1.length; i++) {
		selPositionData.push({text: ajaxResult1[i]});
	}
	
	for(var i = 0; i < ajaxResult2.length; i++) {
		selDutyData.push({text: ajaxResult2[i]});
	}
	
	$('[data-ax5select="selPosition"]').ax5select({
        options: selPositionData
	});
	
	$('[data-ax5select="selDuty"]').ax5select({
        options: selDutyData
	});
}

//tab 메뉴 만들기 주소 : http://jsfiddle.net/3n74v/
var urlArr = [];

function setTabMenu(){
	$(".tab_content").hide();
	$(".tab_content:first").show();
	$("ul.tabs li").click(function () {
		$("ul.tabs li").removeClass("active").css("color", "#333");
		$(this).addClass("active").css("color", "darkred");
		$(".tab_content").hide();
		
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).fadeIn();
	});
}

function gridClick() {
	var index = userGrid.selectedDataIndexs;
	var item = userGrid.list[index];
	$("#tab1Name").val(item.cm_username);
	$("#tab1Id").val(item.cm_userid);
	$("#tab1Position").val(item.position);
	$("#tab1Duty").val(item.duty);
	
	var inputData = new Object();
	inputData.duty = item.duty;
	inputData.cm_userid = item.cm_userid;
	
	var ajaxData1 = new Object();
	var ajaxData2 = new Object();
	ajaxData1 = {
		info		: inputData,
		requestType	: 'GETUSERLISTDUTY'
	}
	ajaxData2 = {
		info		: inputData,
		requestType : 'GETUSERINFO'
	}
	
	var ajaxResult1 = ajaxCallWithJson('/webPage/administrator/KDH_testServlet', ajaxData1, 'json');
	var ajaxResult2 = ajaxCallWithJson('/webPage/administrator/KDH_testServlet', ajaxData2, 'json');
	console.log(ajaxResult2);
	
	tab2Grid.setData(ajaxResult1);	
    binderModel.setModel({
        name: ajaxResult2.name,
        tel: ajaxResult2.tel,
        email: ajaxResult2.email,
        creatDt: ajaxResult2.creatDt,
        lastLogin: ajaxResult2.lastLogin,
        ip : ajaxResult2.ip
    }, $(".binder-form"));
}

function modal() {
	var gridSelectedIndex 	= userGrid.selectedDataIndexs;
	if(gridSelectedIndex.length === 0 ) {
		dialog.alert('시스템을 그리드에서 선택후 눌러주세요.',function(){});
		return;
	}
	selectedSystem = userGrid.list[gridSelectedIndex];
	testModal.open({
        width: 400,
        height: 300,
        iframe: {
            method: "get",
            url: "../modal/KDH_testModal.jsp",
            param: "callBack=sysDetailModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
                selectedSystem = null;
            }
        }
    }, function () {
    });
};


var sysDetailModalCallBack = function() {
	sysDetailModal.close();
}

function enterKey() {
	if(window.event.keyCode == 13) {
		memberList();
	}
}

$("#btnExcel").on('click', function() {
	var st_date = new Date().toLocaleString();
	var today = st_date.substr(0, st_date.indexOf("오"));
	
	userGrid.exportExcel("사용자리스트 " + today + ".xls");
})

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
	    cURL = "../winpop/RequestDetail.jsp";
	} else if (type === 2) {
		nHeight = 400;
	    nWidth  = 900;
		cURL = "../winpop/ApprovalInfo.jsp";
	} else if (type === 3) {
		nHeight	= 300;
		nWidth	= 400;
		cURL = "../winpop/KDH_testWin.jsp";
	}
	
	var winWidth  = document.body.clientWidth;  // 현재창의 너비
	var winHeight = document.body.clientHeight; // 현재창의 높이
	var winX      = window.screenX;// 현재창의 x좌표
	var winY      = window.screenY; // 현재창의 y좌표
	nLeft = winX + (winWidth - nWidth) / 2;
	nTop = winY + (winHeight - nHeight) / 2;

	cFeatures = "top=" + nTop + ",left=" + nLeft + ",height=" + nHeight + ",width=" + nWidth + ",help=no,menubar=no,status=yes,resizable=yes,scroll=no";

	var f = document.popPam;   		//폼 name
    myWin = window.open('',winName,cFeatures);
    
    console.log(rsrcName);
    
    f.formName.value	= rsrcName.item.cm_username;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.formId.value	= rsrcName.item.cm_userid;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.formPosition.value	= rsrcName.item.position;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.formDuty.value	= rsrcName.item.duty;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    
    f.action		= cURL; 		//이동할 페이지
    f.target		= winName;    	//폼의 타겟 지정(위의 새창을 지정함)
    f.method		= "post"; 		//POST방식
    f.submit();
    
}