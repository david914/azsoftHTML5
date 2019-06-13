// http://axisj.com/
// http://ax5.io/ax5ui-grid/demo/1-formatter.html
// userid 및 ReqCD 가져오기
var userid = window.parent.userId;   
var strReqCD = "";
var request =  new Request();
strReqCD = request.getParameter('reqcd');

// grid 생성
var firstGrid = new ax5.ui.grid();

// 달력 생성
var picker = new ax5.ui.picker();

var myWin;
var isAdmin = false;

// 이 부분 지우면 영어명칭으로 바뀜
// ex) 월 -> MON
ax5.info.weekNames = [
    {label: "일"},
    {label: "월"},
    {label: "화"},
    {label: "수"},
    {label: "목"},
    {label: "금"},
    {label: "토"}
];

$(document).ready(function(){
	if(strReqCD != null && strReqCD != ""){
		if(strReqCD.length > 2) strReqCD.substring(0, 2);
		else strReqCD = "";
	}
	
	setGrid();
	 $('[data-grid-control]').click(function () {
         switch (this.getAttribute("data-grid-control")) {
             case "excel-export":
                 firstGrid.exportExcel("grid-to-excel.xls");
                 break;
         }
     });

	setPicker();
	getUserInfo();
	cboGbn_set();
});

function setPicker(){
	//default 오늘날짜 setting
	$('#datStD').val(getDate('DATE',0));
	$('#datEdD').val(getDate('DATE',0));
	
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
         onStateChanged: function () {
             /*if (this.state == "open") {
                 //console.log(this.item);
                 var selectedValue = this.self.getContentValue(this.item["$target"]);
                 if (!selectedValue) {
                     this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'return': 'yyyy/MM/dd', 'add': {d: 0}})]);
                     this.item.pickerCalendar[1].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'return': 'yyyy/MM/dd', 'add': {d: 0}})]);
                 }
             }*/
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
		
}

function getUserInfo(){
	var ajaxResultData = null;
	var tmpData = {
			requestType : 'UserInfochk',
			UserId : userid
	}	
	ajaxResultData = ajaxCallWithJson('/webPage/approval/RequestStatus', tmpData, 'json');
	
	if(strReqCD != null && strReqCD != ""){
		$("#txtUser").text(ajaxResultData[0].cm_username);
	}
	
	
	if (ajaxResultData[0].cm_admin === '1') {
		isAdmin = true;
	}
	
	getPMOInfo();
}

function getPMOInfo(){
	var ajaxResultData = null;
	var tmpData = {
			requestType : 'UserPMOInfo',
			UserId : userid
	}	
	ajaxResultData = ajaxCallWithJson('/webPage/approval/RequestStatus', tmpData, 'json');
	
	if(ajaxResultData.length > 1){
		strDeptCd = ajaxResultData.substring(1);
		strRgtCd = ajaxResultData.substring(0,1);
	}
	
	getSysInfo();
	getCodeInfo();
	getTeamInfoGrid2();
}


function getSysInfo(){
	var ajaxResultData = null;
	var tmpData = {
			requestType : 'SysInfo',
			UserId : userid
	}	
	var options = [];
	ajaxResultData = ajaxCallWithJson('/webPage/approval/RequestStatus', tmpData, 'json');
	
	
	$.each(ajaxResultData,function(key,value) {
		options.push({value: value.cm_syscd, text: value.cm_sysmsg});
	});
	
	$('[data-ax5select="cboSysCd"]').ax5select({
        options: options
	});
}

function getCodeInfo(){
	var ajaxResultData = null;
	var cboSin;
	var cboSta;
	var options = [];
	var tmpData = {
			requestType : 'CodeInfo_1',
	}	
	ajaxResultData = ajaxCallWithJson('/webPage/approval/RequestStatus', tmpData, 'json');
	
	cboSin = ajaxResultData;
	cboSta = ajaxResultData;
	
	cboSin.push({
		cm_macode : "REQUEST",
		cm_micode : "94",
		cm_codename : "테스트폐기"
	});
	
	cboSin = cboSin.filter(function(data) {
	   return data.cm_macode === "REQUEST";
	});
	
	if(strReqCD != null && strReqCD != ""){
		cboSta.push({
			cm_macode : "R3200STA",
			cm_micode : "RB",
			cm_codename : "긴급롤백미정리건"
		});
	}
	
	cboSta = cboSta.filter(function(data) {
		   return data.cm_macode === "R3200STA";
	});
	
	for(var i = 0 ; i < cboSta.length ; i++){
		if(cboSta[i].cm_micode == "9"){
			cboSta[i].cm_codename = "처리완료";
		}
	}
	
	$.each(cboSin,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboSin"]').ax5select({
        options: options
	});
	// default 전체선택
   // $('[data-ax5select="cboSin"]').ax5select("setValue", ['00',], true); // 다중선택시 [ ] 내부에  , 로 구분
	options = [];
	
	$.each(cboSta,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboSta"]').ax5select({
        options: options
	});
	// default 선택
    $('[data-ax5select="cboSta"]').ax5select("setValue", ['1'], true);
}

function getTeamInfoGrid2(){
	var ajaxResultData = null;
	var tmpData = {
			requestType : 'TeamInfo',
	}	
	var options = [];
	ajaxResultData = ajaxCallWithJson('/webPage/approval/RequestStatus', tmpData, 'json');
	
	$.each(ajaxResultData,function(key,value) {
	    options.push({value: value.cm_deptcd, text: value.cm_deptname});
	});
	console.log(options);
	
	$('[data-ax5select="cboDept"]').ax5select({
        options: options
	});
}

function cboGbn_set(){
	var options = [];
	var cboGbn = [
			{cm_codename : "전체", cm_micode : "ALL", cm_macode : "REQPASS"},
			{cm_codename : "일반적용", cm_micode : "4", cm_macode : "REQPASS"},
			{cm_codename : "수시적용", cm_micode : "0", cm_macode : "REQPASS"},
			{cm_codename : "긴급적용", cm_micode : "2", cm_macode : "REQPASS"}
		]
	
	$.each(cboGbn,function(key,value) {
	    options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboGbn"]').ax5select({
        options: options
	});
}

function reset_btn(){
	firstGrid.setData([]); // grid 초기화
	$('[data-ax5select="cboSta"]').ax5select("setValue", ['1'], true); // 진행상태 초기화
	$('[data-ax5select="cboSin"]').ax5select("setValue", ['00'], true); // 신청종류 초기화
	setPicker();	// 달력 초기화
	$('[data-ax5select="cboGbn"]').ax5select("setValue", ['ALL'], true); // 처리구분 초기화
	$('[data-ax5select="cboSysCd"]').ax5select("setValue", ['00000'], true); // 시스템 초기화
	$('[data-ax5select="cboDept"]').ax5select("setValue", ['0'], true); // 신청부서 초기화
	document.getElementById("rdoStrDate").checked = true;
	$("#txtUser").val('');
	$("#txtSpms").val('');
	$("#lbTotalCnt").text("총0건");
}

function cmdQry_Proc(){
	var tmpObj = {};
	var ajaxResultData = null;
	
	tmpObj.strStD = $("#datStD").val().substr(0,4) + $("#datStD").val().substr(5,2) + $("#datStD").val().substr(8,2);
	tmpObj.strEdD = $("#datEdD").val().substr(0,4) + $("#datEdD").val().substr(5,2) + $("#datEdD").val().substr(8,2);

	if($('[data-ax5select="cboSysCd"]').ax5select("getValue")[0]['@index'] > 0){
		tmpObj.strSys = $('[data-ax5select="cboSysCd"]').ax5select("getValue")[0].value;
	} 
	
	tmpObj.cboGbn = $('[data-ax5select="cboGbn"]').ax5select("getValue")[0].value;
	
	if($('[data-ax5select="cboSin"]').ax5select("getValue")[0]['@index'] > 0){
		tmpObj.strQry = $('[data-ax5select="cboSin"]').ax5select("getValue")[0].value;	// 멀티셀렉트 가능하게 수정해야됨
	} 
	
	if($('[data-ax5select="cboDept"]').ax5select("getValue")[0]['@index'] > 0){
		tmpObj.strTeam = $('[data-ax5select="cboDept"]').ax5select("getValue")[0].value;
	} 
	
	if($('[data-ax5select="cboSta"]').ax5select("getValue")[0]['@index'] > 0){
		tmpObj.strSta = $('[data-ax5select="cboSta"]').ax5select("getValue")[0].value;
	}
	
	tmpObj.dategbn = $('input[name="rdoDate"]:checked').val();

	tmpObj.txtUser = document.getElementById("txtUser").value.trim();
	tmpObj.txtSpms = document.getElementById("txtSpms").value.trim();
	
	tmpObj.strUserId = userid;
	
	console.log(tmpObj);
	
	var tmpData = {
		requestType : 'get_SelectList',
		prjData: tmpObj
	}	

	ajaxAsync('/webPage/approval/RequestStatus', tmpData, 'json', successGetSelectList);
}

function successGetSelectList(data) {
	firstGrid.setData(data);
	
	var cnt = Object.keys(data).length;	
	
	$("#lbTotalCnt").text("총" + cnt + "건");
	
	firstGrid.setData(data);
	
	tmpObj = null;
}

function setGrid(){
	firstGrid.setConfig({
        target: $('[data-ax5grid="first-grid"]'),
        sortable: true, 
        multiSort: true,
        //multipleSelect: true,
        //showRowSelector: true, //checkbox option
        //rowSelectorColumnWidth: 26 
        header: {
            align: "center",
            columnHeight: 30
        },
        body: {
            columnHeight: 28,
            onClick: function () {
                // console.log(this);
            	this.self.clearSelect(); //기존선택된 row deselect 처리 (multipleSelect 할땐 제외해야함)
                this.self.select(this.dindex);
            },
            onDBLClick: function () {
        		//alert('신청상세팝업');
            	//console.log(this);
            	//Sweet Alert [https://sweetalert.js.org/guides/]
            	
            	if (this.dindex < 0) return;
            	
        		swal({
                    title: "신청상세팝업",
                    text: "신청번호 ["+this.item.acptno2+"]["+param.item.qrycd2+"]["+this.dindex+"]"
                });

    			new_win_popup(1, param.item.qrycd2, this.item.acptno2,'');
            },
        	trStyleClass: function () {
        		//console.log(this); -> string으로 변환하면 item 데이타 로그 볼수 없음
        		//console.log('++++++colorsw:'+this.item.colorsw);
        		if(this.item.colorsw === '5'){
        			return "fontStyle-error";
        		} else if (this.item.colorsw === '3'){
        			return "fontStyle-cncl";
        		} else if (this.item.colorsw === '0'){
        			return "fontStyle-ing";
        		} else {
        		}
        	},
        	onDataChanged: function(){
        		//그리드 새로고침 (스타일 유지)
        	    this.self.repaint();
        	}
        },
        contextMenu: {
            iconWidth: 20,
            acceleratorWidth: 100,
            itemClickAndClose: false,
            icons: {
                'arrow': '<i class="fa fa-caret-right"></i>'
            },
            items: [
                {type: 1, label: "변경신청상세"},
                {type: 2, label: "결재정보"},
                {type: 3, label: "전체회수"}
            ],
            popupFilter: function (item, param) {
                console.log(item, param);
            	//param.item.qrycd2 -> 01,02,03,04,06,07,11,12,16
            	
            	/** 
            	 * return 값에 따른 context menu filter
            	 * 
            	 * return true; -> 모든 context menu 보기
            	 * return item.type == 1; --> type이 1인 context menu만 보기
            	 * return item.type == 1 | item.type == 2; --> type 이 1,2인 context menu만 보기
            	 * 
            	 * ex)
	            	if(param.item.qrycd2 === '01'){
	            		return item.type == 1 | item.type == 2;
	            	}
            	 */
            	
            	if (param.item == undefined) return false;
            	if (param.dindex < 0) return false;
            	
            	console.log(param.item, param.item.editor2, isAdmin, param.item.colorsw);
            	
            	if (param.item.colorsw === '9') return item.type == 1 | item.type == 2;
            	else if ( (param.item.qrycd2 === '07' || param.item.qrycd2 === '03' || param.item.qrycd2 === '04' 
            			|| param.item.qrycd2 === '06' || param.item.qrycd2 === '16') 
            			&& (userid === param.item.editor2 || isAdmin) ) return true; 
            	else return item.type == 1 | item.type == 2;
            },
            onClick: function (item, param) {
                //console.log(item, param);
        		swal({
                    title: item.label+"팝업",
                    text: "신청번호 ["+param.item.acptno2+"]["+param.item.qrycd2+"]"
                });
            	/*mask.open();
        		dialog.alert("신청번호 ["+param.item.acptno2+"]["+param.item.qrycd2+"]",function(){
        			mask.close();
        		});*/
        		if (item.type === 3) {
        			//param.item.befsw = 'Y';
        			if (param.item.befsw === 'Y') {
        				swal({
                            title: "선행작업확인",
                            text: "다른 사용자가 선행작업으로 지정한 신청 건이 있습니다. \n\n"+
		                          "해당 신청 건 사용자에게 선행작업 해제 요청 후 \n" +
		                          "선행작업으로 지정한 신청 건이 없는 상태에서\n진행하시기 바랍니다."
                        });
        				return;
        			}

                	mask.open();
        			confirmDialog.confirm({
        				title: '전체회수 여부확인',
        				msg: '신청번호 ['+param.item.acptno+'] 를  \n전체회수 하시겠습니까?',
        			}, function(){
        				if(this.key === 'ok') {
        					console.log('OK click!!');
        					//inputmsg pop
        					//Cmr3200.reqCncl(grdLst.selectedItem.acptno2,strUserId,msgPopUp.txtMsg.text,strConfUsr);
        				} else {
        					console.log(this.key);
        				}
            			mask.close();
        			});
        			
        		} else {
        			new_win_popup(item.type, param.item.qrycd2, param.item.acptno2,'');
        		}
        		
                firstGrid.contextMenu.close();//또는 return true;
            }
        },
        columns: [
            {key: "syscd", label: "시스템",  width: '10%'},
            {key: "spms", label: "SR-ID",  width: '10%'},
            {key: "acptno", label: "신청번호",  width: '10%'},
            {key: "editor", label: "신청자",  width: '10%'},
            {key: "qrycd", label: "신청종류",  width: '10%'},
            {key: "passok", label: "처리구분",  width: '10%'},
            {key: "acptdate", label: "신청일시",  width: '10%'},
            {key: "sta", label: "진행상태",  width: '10%'},
            {key: "pgmid", label: "프로그램명",  width: '10%'},
            {key: "prcdate", label: "완료일시",  width: '10%'},
            {key: "prcreq", label: "적용예정일시",  width: '10%'},
            {key: "Sunhang", label: "선후행",  width: '10%'},
            {key: "sayu", label: "신청사유", width: '10%'}	//formatter: function(){	return "<button>" + this.value + "</button>"}, 	 
        ]
    });
}

function new_win_popup(type,reqCd,reqNo,rsrcName) {
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
	}
	
	nTop  = parseInt((window.screen.availHeight/2) - (nHeight/2));
	nLeft = parseInt((window.screen.availWidth/2) - (nWidth/2));
	cFeatures = "top=" + nTop + ",left=" + nLeft + ",height=" + nHeight + ",width=" + nWidth + ",help=no,menubar=no,status=yes,resizable=yes,scroll=no";

	var f=document.popPam;   //폼 name
    myWin=window.open('',winName,cFeatures);
    f.acptno.value = reqNo;    //POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.user.value = userid;    //POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.action=cURL; //이동할 페이지
    f.target=winName;    //폼의 타겟 지정(위의 새창을 지정함)
    f.method="post"; //POST방식
    f.submit();
    
}