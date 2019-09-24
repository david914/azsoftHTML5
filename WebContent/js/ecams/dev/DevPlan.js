/**
 * 개발계획/실적등록 화면 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 방지연
 * 	버전 : 1.0
 *  수정일 : 2019-06-26
 */

var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;
var strReqCd	 	= window.top.reqCd;

//public
var strIsrId = "";
var strQryGbn = "";
var cboQryGbnData = [];
var loadSrReg = false;
var loadPrjList = false;

var urlArr = [];

$(document).ready(function(){
	//tab메뉴
	$('#tabSRRegister').width($('#tabSRRegister').width()+10);
	$('#tabDevPlan').width($('#tabDevPlan').width()+10);
	$("#tabDevPlan").show(); //개발계획실적탭

	$('#datStD').val(getDate('DATE',-1));
	$('#datEdD').val(getDate('DATE',0));

	$("#datStD, #datEdD").bind('change', function(){
		var dataId = $(this).prop("id");
		var dataStd = $('#frmPrjList').contents().find("#"+dataId).val($(this).val());
	});

	$(document).on("focusout",function(){
		setTimeout(function(){
			if(document.activeElement instanceof HTMLIFrameElement){
				$('[data-picker-btn="ok"]').click();
			}
		},0);
	});
	
	$('.btn_calendar').bind('click', function(e) {
		e.preventDefault();
	    e.stopPropagation();
		if($(this).css('background-color') === 'rgb(255, 255, 255)') {
			var inputs = $(this).siblings().prevAll('input');
			$(inputs.prevObject[0]).trigger('click');
		}
	});

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
		onStateChanged: function () {
			console.log(this.state);
	        if (this.state == "open") {
	            var selectedValue = this.self.getContentValue(this.item["$target"]);
	            if (!selectedValue) {
	                this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'add': {d: 0}})]);
	            }
	        }
	        if(this.state == "changeValue"){
	    		$("#btnStD").focus();
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
	
	$(document).on("click",".ax5-ui-picker",function(){
		$("#btnStD").focus();
	});
	
	strQryGbn = "01";
	if(strReqCd != null && strReqCd != "") {
		if(strReqCd.length > 3) strReqGbn = strReqCd.substr(0,2);
	}
	
	strReqCd = "42";
	
	initScreen();
	
	document.getElementById('frmPrjList').onload = function() {
		loadPrjList = true;
	};
	
	document.getElementById('frmSRRegister').onload = function() {
		setSRRegData();
	};
	
	document.getElementById('frmDevPlan').onload = function() {
		loadSrReg = true;
	}
	
//	document.getElementById('frmDevPlan').onload = function() {
		clickTabMenu();
//	}
		
	callPrjList();
});

//페이지 로딩 완료시 다음 진행 
var inter = null;

function callSRRegister(data) {
   inter = setInterval(function(){
      if(loadSrReg) {
         iSRID_Click(data);
         clearInterval(inter);
      }
   },100);
}

function callPrjList() {
	inter = setInterval(function(){
		if(loadPrjList) {
			setCbo();
			clearInterval(inter);
		}
	},100);
}

function setCbo() {
	//PrjListTab 대상구분 콤보박스 데이터
	cboQryGbnData.push({value: "00", text: "전체", dateyn: "Y"});
	cboQryGbnData.push({value: "01", text: "개발계획등록대상", dateyn: "N"});
	cboQryGbnData.push({value: "02", text: "개발실적등록대상", dateyn: "N"});
	
//	if(strQryGbn != null && strQryGbn != "") {
//		for(var i=0; i<cboQryGbnData.length; i++) {
//			if(cboQryGbnData[i].value == strQryGbn) {
//				$('[data-ax5select="cboQryGbn"]').ax5select("setValue", cboQryGbnData[i].value, true);
//				break;
//			}
//		}
//	}
	
	var tmpTab = $('#frmPrjList').get(0).contentWindow;
	tmpTab.strReqCD = strReqCd;
	$('#cboQryGbn').trigger('change');
}

function setSRRegData() {
	var tmpTab = $('#frmSRRegister').get(0).contentWindow;
	tmpTab.createViewGrid();
	tmpTab.strReqCd = "XX";
}

function initScreen() {
	//$("#tab1").prop('disabled',true);
	$("#tab1").unbind("click");
	//$("#tab2").prop('disabled',true);
	$("#tab2").unbind("click");
}

//자식(PrjListTab)에서 호출하는 함수 subScreenInit()
function initSubScreen() {
	var tmpTab1 = $('#frmSRRegister').get(0).contentWindow;
	var tmpTab2 = $('#frmDevPlan').get(0).contentWindow;
	
	tmpTab1.elementInit("M"); 
	tmpTab2.screenInit("M");
	tmpTab1.strIsrId = "";
	tmpTab2.strIsrId = "";
}

//PrjListTab 에서 그리드 클릭 이벤트
function iSRID_Click(data) {
	strIsrId = "";
	
	//$("#tab1").prop('disabled',true);
	$("#tab1").unbind("click");
	//$("#tab2").prop('disabled',true);
	$("#tab2").unbind("click");
	
	if(data == null) return;
	
	strIsrId = data.cc_srid;
	
	if(data.isrproc.indexOf("41") >= 0) {
		//$("#tab1").prop('disabled',false);
		$("#tab1").bind("click", clickTabMenu());
	}
	if(data.isrproc.indexOf("42") >= 0) {
		//$("#tab2").prop('disabled',false);
		$("#tab2").bind("click", clickTabMenu());
	}
	
	data = null;
	changeTabMenu();
	//clickTabMenu();
	
	//$('#tab2').trigger('click');
}

//tabnavi_click
function changeTabMenu() {
	if(document.getElementById("tab1").className == "on") { //$('#tab1').is(':enabled')
		var tmpGrid = $('#frmPrjList').get(0).contentWindow.firstGrid;
		var tmpGridSelectedIndex = tmpGrid.selectedDataIndexs;
		var tmpSelectedGridItem = tmpGrid.list[tmpGrid.selectedDataIndexs];
		var tmpTab = $('#frmSRRegister').get(0).contentWindow;
		tmpTab.createViewGrid();
		console.log("tmpGridSelectedIndex: " + tmpGridSelectedIndex);
		
		if(tmpGridSelectedIndex < 0) {
			tmpTab.elementInit("M");
			return;
		}
		
		if(tmpTab.strIsrId == strIsrId) return;
		
		tmpTab.strStatus = tmpSelectedGridItem.cc_status;
		tmpTab.strIsrId = strIsrId;
		tmpTab.elementInit("M"); //tab1.screenInit("M");
		tmpTab.firstGridClick(strIsrId); //tab1.grdPrj_click(strIsrId)
		
	}else if(document.getElementById("tab2").className == "on") { //$('#tab2').is(':enabled')
		var tmpGrid = $('#frmPrjList').get(0).contentWindow.firstGrid;
		var tmpGridSelectedIndex = tmpGrid.selectedDataIndexs;
		var tmpSelectedGridItem = tmpGrid.list[tmpGrid.selectedDataIndexs];
		var tmpTab = $('#frmDevPlan').get(0).contentWindow;
		
		if(tmpGridSelectedIndex < 0) {
			tmpTab.screenInit("M"); //tab2.screenInit("M");
			return;
		}
		
		//if(tmpTab.strIsrId == strIsrId) return;
		
		tmpTab.strIsrId = strIsrId; 
		tmpTab.strStatus = tmpSelectedGridItem.cc_status;
		
//		tmpTab.screenInit("M");
		
		if(strIsrId != null && strIsrId != "") {
			tmpTab.initDevPlan(); //tab2.devPlanCall();
		}
	}
}

//탭메뉴 클릭 이벤트
function clickTabMenu() {
	$("ul.tabs li").click(function () {
		//이미 on상태면 pass
		if($(this).hasClass("on")) {
			changeTabMenu();
			return;
		}
	
		$(".tab_content").hide();
		var activeTab = $(this).attr("rel");
		
		//tab메뉴 클릭에 따라 색상 변경
		$("ul.tabs li").removeClass('on');
		$(this).addClass("on");
		
		$("#" + activeTab).fadeIn();
		changeTabMenu();
	});
}