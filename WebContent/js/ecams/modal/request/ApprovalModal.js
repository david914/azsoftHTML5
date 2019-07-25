
var acptNo 		= window.parent.pReqNo;				//신청번호
var userId 		= window.parent.pUserId;			//접속자 ID
var reqCd 		= window.parent.reqCd;			//접속자 ID
var sysCd 		= window.parent.sysCd;
var jobCd		= window.parent.jobCd;

var firstGrid  	= new ax5.ui.grid();
var secondGrid  	= new ax5.ui.grid();

var firstGridData = null; 							//선후행목록 데이타
var firstGridSimpleData = null;
var secondGridData = null; 							//선후행목록 데이타
var data          = null;							//json parameter
var prgData		= null;
var selCd = "";

firstGrid.setConfig({
    target: $('[data-ax5grid="firstGrid"]'),
    sortable: true, 
    multiSort: true,
    multipleSelect : false,
    page : {
    	display:false
    }
    ,
    showLineNumber: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	//this.self.clearSelect();
           this.self.select(this.dindex);
        },
    	trStyleClass: function () {
    		if (this.item.colorsw == '3'){
    			return "fontStyle-cncl";
    		} else if(this.item.colorsw == '5'){
    			return "fontStyle-eror";
    		} else if (this.item.colorsw == '0'){
    			return "fontStyle-ing";
    		}
    	},
    	onDataChanged: function(){
    	    this.self.repaint();
    	},
        onDBLClick: function () {
        	addDataRow(this);
        },
        onClick: function () {
        	getReqPgmList(this);
        }
    },
    columns: [
        {key: "rgtcd", label: "직무/직위",  width: '50%'},
        {key: "cm_username", label: "성명",  width: '50%'}
    ]
});

secondGrid.setConfig({
    target: $('[data-ax5grid="secondGrid"]'),
    sortable: true, 
    multiSort: true,
    multipleSelect : false,
    page : {
    	display:false
    }
    ,
    showLineNumber: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	//this.self.clearSelect();
           this.self.select(this.dindex);
        },
    	trStyleClass: function () {
    		if (this.item.colorsw == '3'){
    			return "fontStyle-cncl";
    		} else if(this.item.colorsw == '5'){
    			return "fontStyle-eror";
    		} else if (this.item.colorsw == '0'){
    			return "fontStyle-ing";
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
            {type: 1, label: "결재(순차)"},
            {type: 2, label: "후결(순차)"}
        ],
        popupFilter: function (item, param) {
        	if(param.dindex == undefined || param.dindex == null || param.dindex < 0){
        		return false;
        	}
        	
        	if((param.item.cm_gubun == '3' || param.item.cm_gubun == '6') && param.item.userSetable == false){
        		return false;
			}
        	
        	return true;
       	 
        },
        onClick: function (item, param) {
	        contextMenuClick(param.item, item);
	        firstGrid.contextMenu.close();//또는 return true;
        	
        },
    },
    columns: [
        {key: "cm_name", label: "단계명칭",  width: '35%'},
        {key: "arysv", label: "결재자",  width: '33%'},
        {key: "cm_sgnname", label: "결재",  width: '32%'}
    ]
});


$(document).ready(function() {

	$('#btnDel').hide();
	$('#lblDel').hide();
	
	$('#btnClose').bind('click',function() {
		window.parent.befJobData = [];
		popClose();
	});
	
	$('#btnReq').bind('click',function(){
		window.parent.befJobData = thirdGrid.list;
		popClose();
	});

	$('#btnSearch').bind('click',function(){
		if($('#txtName').val().trim().length <1 ){
			showToast("검색할 사용자를 입력한 후 처리하시기 바랍니다.");
			$('#txtName').focus();
			return;
		}
		
		selCd = "I";
		firstGrid.setData([]);
		getSignUser();
	});
	
	$('#txtName').bind('keypress',function(){
		if(event.keyCode == 13){
			$('#btnSearch').click();
		}
	});
});

function popClose(){
	window.parent.approvalModal.close();
}

function simpleData(){
	
	var swFind = false;
	
	if (secondGrid.list.length < 1 || secondGrid.getList('selected').length < 1) {
		firstGridSimpleData = [];
	}
	else{
		var secondItem =  secondGird.getList('selected')[0];
		
		for(var i =0; i < firstGridData.length; i++){
			if(secondItem.cm_gubun != "3" && secondItem.cm_gubun != "6"      ||
			   secondItem.cm_gubun == "3" && firstGridData[i].cm_gubun != "3"  ||
			   secondItem.cm_gubun == "6" && firstGridData[i].cm_gubun != "6" ){
				
				continue;
			}
			if(secondItem.cm_position.indexOf(firstGridData[i].cm_rgtcd) >= 0){
				var copyData = clone(firstGridData[i]);
				firstGridSimpleData.push(copyData);
			}
		}
	}
	
	firstGrid.setData(firstGridSimpleData);
}

function getSignUser(){
	var signUserInfoData = new Object();
	
	signUserInfoData = {
		txtName   :   $('#txtName').val().trim(),
		requestType	: 	'getSignUser'
	}
	
	ajaxAsync('/webPage/apply/ApplyRequest', signUserInfoData, 'json',successGetSignUser);
} 

function successGetSignUser(data){
	firstGridData = data;
	firstGrid.setData(data);
}

function cmdInit(){
	var tmpRgt = "";
	var tmpPos = "";
	var tmpRgt2 = "";
	var findSw = false;
	
	for (var i=0 ; secondGridData.length>i ; i++) {
		if (secondGridData[i].visible == "1") {
			$('#btnDel').show();
			$('#lblDel').show();
		}
		if (secondGridData[i].cm_gubun == "3") {//팀내책임자[3]
			if (secondGridData[i].cm_position != null && secondGridData[i].cm_position != "") {
				tmpRgt = tmpRgt + "," + secondGridData[i].cm_position;
			}
		} 
		if (secondGridData[i].cm_gubun == "6") {//업무책임자[6]
			if (secondGridData[i].cm_position != null && secondGridData[i].cm_position != "") {
				tmpRgt2 = tmpRgt2 + "," + secondGridData[i].cm_position;
			}
		} 
	}
	if ((tmpRgt != null && tmpRgt != "") || (tmpRgt2 != null && tmpRgt2 != "")) {
		selCd = "U";

		var signListInfoData = new Object();
		
		signListInfoData = {
			UserId	  :   userId,
			tmpRgt   :   tmpRgt,
			SysCd	 :	 sysCd,
			JobCd		 : 	 jobCd,
			tmpRgt2	 :   tmpRgt2,
			requestType	: 	'getSignLst_dept'
		}
		
		ajaxAsync('/webPage/apply/ApplyRequest', signUserInfoData, 'json',successGetSignList);
	}
}

function successGetSignList(data){
	firstGridData = data;
	simpleData();
}

function contextMenuClick(data, item){
	
	if (data.delsw == false && item.label == "참조") {
		showToast("해당단계는 참조로 변경할 수 없습니다.");
		return;
	}
	//tmpRender.data.cm_sgnname = tmpItem.caption;
	
	var intCodeSet = "2";
	selObj.cm_sgnname = tmpItem.caption;
	if ( item.type == "2" ) {
		intCodeSet = "4";
	}
	data.cm_blank = intCodeSet;
	data.cm_common = intCodeSet;
	data.cm_congbn = intCodeSet;
	data.cm_emg = intCodeSet;
	data.cm_emg2 = intCodeSet;
	data.cm_holi = intCodeSet;
	
	//grdLst2_dp.setItemAt(selObj,grdLst2.selectedIndex);
	secondGrid.repaint();
	
}

//결재자 추가
function confSet(){
	var i = 0;
	var swFind = false;
	
	if (grdLst1.selectedItem == null || grdLst1.selectedItem == "") {
		Alert.show("결재자를 선택한 후 처리하시기 바랍니다.");
		return;
	}
	if (grdLst1.selectedItems.length > 1) {
		Alert.show("결재자를 다수로 선택할 수 없습니다. 한사람씩 선택하여 주시기 바랍니다.");
		return;
	}
	
	if (optBase2.selected) {//변경일때
	//	if (grdLst2.selectedItem == null && grdLst2_dp.length>0) {
	//    	Alert.show("결재 추가할 단계를 선택한 후 처리하시기 바랍니다.");
	//    	return;
	//    }
	    if (grdLst2_dp.length == 0) swFind = true;
	}
	for (i = 0;i < grdLst2_dp.length;i++) {
		if (selCd == "U") {
			if (grdLst2_dp.getItemAt(i).cm_gubun == "3" || grdLst2_dp.getItemAt(i).cm_gubun == "6") {
				if (grdLst2_dp.getItemAt(i).delyn == "N" && grdLst2_dp.getItemAt(i).cm_gubun == grdLst1.selectedItem.gubun) {
					if (grdLst2_dp.getItemAt(i).cm_position.indexOf(grdLst1.selectedItem.cm_rgtcd)>=0) {
			   			swFind = true;
			   			break;
					}
				}			
			}
		} else if (selCd == "I") {
			swFind = true;
			for (i = 0;i < grdLst2_dp.length;i++) {
			  	if (grdLst2_dp.getItemAt(i).cm_gubun == "3" || grdLst2_dp.getItemAt(i).cm_gubun == "6") {
			  		if (grdLst2_dp.getItemAt(i).cm_baseuser != null) {
			  			if (grdLst2_dp.getItemAt(i).cm_baseuser == grdLst1.selectedItem.cm_signuser) {
		  					Alert.show("이미 결재단계에 등록된 결재자입니다. 확인 후 처리하시기 바랍니다.");
		  					return;
		  				}
			  		}
			  	}
			}
		}
	}

	if ( swFind ) {
	var etcObj = {};
	var etcsubObj = {};
	var etcsubarc = new ArrayCollection();
		if (selCd == "U") {
		etcObj = grdLst2_dp.getItemAt(i);
		etcObj.cm_baseuser = grdLst1.selectedItem.cm_signuser;

		etcsubObj.SvTag  = grdLst1.selectedItem.cm_username;
		etcsubObj.SvUser = grdLst1.selectedItem.cm_daegyul;
		etcsubarc.addItem(etcsubObj);
		etcObj.arysv = etcsubarc;

		etcObj.delsw = false;
		//etcObj.cm_duty = grdLst2_dp.getItemAt(i).cm_position;
		grdLst2_dp.setItemAt(etcObj,i);
		} else {
  		etcObj.cm_name = grdLst1.selectedItem.rgtcd;		
  		etcObj.cm_sgnname = "결재(순차)";
  		etcObj.cm_baseuser = grdLst1.selectedItem.cm_signuser;
  		etcObj.cm_congbn = "2";
		etcObj.cm_emg2 = "2";
		etcObj.cm_prcsw = "N";
		etcObj.cm_common = "2";
		etcObj.cm_blank = "2";
		etcObj.cm_holi = "2";
		etcObj.cm_emg = "2";
		etcObj.cm_duty = grdLst1.selectedItem.cm_rgtcd;
		etcObj.cm_position = grdLst1.selectedItem.cm_rgtcd;
		etcObj.cm_gubun = "3";
		etcObj.cm_seqno = "0";
		etcObj.delyn = "Y";
		
		etcsubObj.SvTag  = grdLst1.selectedItem.cm_username;
		etcsubObj.SvUser = grdLst1.selectedItem.cm_daegyul;
		etcsubarc.addItem(etcsubObj);
		etcObj.arysv = etcsubarc;
		
		etcObj.delsw = true;
		etcObj.userSetable = false;
		
		if (grdLst2_dp.length == 0) grdLst2_dp.addItem(etcObj);
  		//else grdLst2_dp.addItemAt(etcObj,grdLst2.selectedIndex);
  		//결재절차 그리드[grdLst2]에서 선택한 index값이 없을때는 그리드의 len 갑으로 셋팅
  		else if ( beforSelIndex == -9 ){
  			grdLst2_dp.addItemAt(etcObj,grdLst2_dp.length);
  		} else{
  			grdLst2_dp.addItemAt(etcObj,beforSelIndex);
  		}
  		//20141021. 결재자 추가 후 결재절차 그리드 선택값 클리어.
  		grdLst2.selectedIndex = -1;
  		beforSelIndex = -9;
		}
		grdLst2_dp.refresh();
		etcObj = null;
		etcsubObj = null;
		etcsubarc = null;
	}
}
