/**
 * 커맨드수행 기능정의 화면
 * 
 * <pre>
 * 	작성자	: 김정우
 * 	버전 		: 1.0
 *  수정일 	: 2019-08-19
 * 
 */

var userName 	= window.top.userName;
var userid 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;
var strReqCD 	= window.top.reqCd;


//grid 생성
var comGrid = new ax5.ui.grid();


comGrid.setConfig({
     target: $('[data-ax5grid="comGrid"]'),
     sortable: true, 
     multiSort: true,
     header: {
         align: "center",
         columnHeight: 30
     },
     body: {
         columnHeight: 28,
         onClick: function () {
         	this.self.clearSelect();
            this.self.select(this.dindex);
         },
         onDBLClick: function () {
         	if (this.dindex < 0) return;
     		
 			openWindow(1, this.item.qrycd2, this.item.acptno2,'');
         },
     	trStyleClass: function () {
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
          	firstGrid.clearSelect();
          	firstGrid.select(Number(param.dindex));
        	 
        	var selIn = firstGrid.selectedDataIndexs;
        	if(selIn.length === 0) return;
        	 
         	if (param.item == undefined) return false;
         	if (param.dindex < 0) return false;
         	
         	
         	if (param.item.colorsw === '9') return item.type == 1 | item.type == 2;
         	else if ( (param.item.qrycd2 === '07' || param.item.qrycd2 === '03' || param.item.qrycd2 === '04' 
         			|| param.item.qrycd2 === '06' || param.item.qrycd2 === '16') 
         			&& (userid === param.item.editor2 || isAdmin) ) return true; 
         	else return item.type == 1 | item.type == 2;
         },
         onClick: function (item, param) {
     		/*swal({
                 title: item.label+"팝업",
                 text: "신청번호 ["+param.item.acptno2+"]["+param.item.qrycd2+"]"
             });*/
     		if (item.type === 3) {
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
     				} else {
     					console.log(this.key);
     				}
         			mask.close();
     			});
     			
     		} else {
     			openWindow(item.type, param.item.qrycd2, param.item.acptno2,'');
     		}
     		
             firstGrid.contextMenu.close();//또는 return true;
         }
     },
     columns: [
         {key: "syscd", label: "시스템",  width: '9%', align: 'left'},
         {key: "spms", label: "SR-ID",  width: '10%', align: 'left'},
         {key: "acptno", label: "신청번호",  width: '8%'},
         {key: "editor", label: "신청자",  width: '5%'},
         {key: "qrycd", label: "신청종류",  width: '8%', align: 'left'},
         {key: "passok", label: "처리구분",  width: '6%', align: 'left'},
         {key: "acptdate", label: "신청일시",  width: '8%'},
         {key: "sta", label: "진행상태",  width: '8%', align: 'left'},
         {key: "pgmid", label: "프로그램명",  width: '10%', align: 'left'},
         {key: "prcdate", label: "완료일시",  width: '8%'},
         {key: "prcreq", label: "적용예정일시",  width: '6%', align: 'left'},
         {key: "Sunhang", label: "선후행",  width: '4%'},
         {key: "sayu", label: "신청사유", width: '10%', align: 'left'} 	 
     ]
});

$('input:radio[name=comRadio]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});

$(document).ready(function(){
	getUserInfo();
});


/**
 * ajax sample
 * @returns
 */
//어드민 여부 확인
function getUserInfo(){ // 호출함수
	var data =  new Object();
	data = {
		UserId			: userid,
		requestType		: 'getUserInfo'
	}
	ajaxAsync('/webPage/approval/RequestStatus', data, 'json',successGetUserInfo);
}

// 어드민 여부 확인 완료
function successGetUserInfo(data) { // result function
	if(strReqCD != null && strReqCD != "") {
		$("#txtUser").text(data.cm_username);
	}
	if (data.cm_admin === '1') {
		isAdmin = true;
	}
}
