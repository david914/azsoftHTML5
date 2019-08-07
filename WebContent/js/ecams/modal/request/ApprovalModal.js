
var userId 		= window.parent.pUserId;			//접속자 ID
var reqCd 		= window.parent.reqCd;			//접속자 ID
var sysCd 		= window.parent.sysCd;
var jobCd		= window.parent.jobCd;

var firstGrid  	= new ax5.ui.grid();
var secondGrid  	= new ax5.ui.grid();

var firstGridData = []; 							//선후행목록 데이타
var firstGridSimpleData = [];
var secondGridData = []; 							//선후행목록 데이타
var data          = null;							//json parameter
var prgData		= null;
var selCd = "";
var beforSelIndex = -9;

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
        	confSet(this.item);
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
       		secondGridClick(this.dindex);
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
        	removeSecondGrid(this.item, this.dindex);
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
        		return true;
        	}
        	
        	if((param.item.cm_gubun == '3' || param.item.cm_gubun == '6') && param.item.userSetable == false){
        		return true;
			}
        	return false;
       	 
        },
        onClick: function (item, param) {
	        contextMenuClick(param.item, item);
	        secondGrid.contextMenu.close();//또는 return true;
        	
        }
    },
    columns: [
        {key: "cm_name", label: "단계명칭",  width: '35%'},
        {key: "arysv_text", label: "결재자",  width: '33%'},
        {key: "cm_sgnname", label: "결재",  width: '32%'}
    ]
});


$(document).ready(function() {

	$('#btnDel').hide();
	$('#lblDel').hide();
	
	$('#btnClose').bind('click',function() {
		window.parent.confirmData = [];
		popClose();
	});
	
	$('#btnReq').bind('click',function(){
		register();
	});

	$('#btnSearch').bind('click',function(){
		if($('#txtName').val().trim().length <1 ){
			dialog.alert("검색할 사용자를 입력한 후 처리하시기 바랍니다.");
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
	
	$('[name = "optBase"]').bind('change',function(){
		if($(this).val() == "추가"){
			selCd = "U";
			$("#AddArea").show();
			firstGrid.setData(firstGridData);
		}
		else{
			selCd = "I";
			$("#AddArea").hide();
			firstGrid.setData(firstGridSimpleData);
		}
	})
	
	getConfirmInfo();
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
		var secondItem =  secondGrid.getList('selected')[0];
		
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
	
	var tmpData = {
		txtName   :   $('#txtName').val().trim(),
		requestType	: 	'getSignUser'
	}
	
	ajaxAsync('/webPage/apply/ApplyRequest', tmpData, 'json',successGetSignUser);
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

		
		 var tmpData = {
			UserId	  :   userId,
			tmpRgt   :   tmpRgt,
			SysCd	 :	 sysCd,
			JobCd		 : 	 jobCd,
			tmpRgt2	 :   tmpRgt2,
			requestType	: 	'getSignLst_dept'
		}
		
		ajaxAsync('/webPage/apply/ApplyRequest', tmpData, 'json',successGetSignList);
	}
}

function successGetSignList(data){
	firstGridData = data;
	simpleData();
}

function contextMenuClick(data, item){
	if (data.delsw == false && item.label == "참조") {
		dialog.alert("해당단계는 참조로 변경할 수 없습니다.");
		return;
	}
	//tmpRender.data.cm_sgnname = tmpItem.caption;
	
	var intCodeSet = "2";
	//selObj.cm_sgnname = tmpItem.caption;
	if ( item.type == "2" ) {
		intCodeSet = "4";
	}
	secondGridData[data.__index].cm_blank = intCodeSet;
	secondGridData[data.__index].cm_common = intCodeSet;
	secondGridData[data.__index].cm_congbn = intCodeSet;
	secondGridData[data.__index].cm_emg = intCodeSet;
	secondGridData[data.__index].cm_emg2 = intCodeSet;
	secondGridData[data.__index].cm_holi = intCodeSet;
	secondGridData[data.__index].cm_sgnname = item.label;
	
	//grdLst2_dp.setItemAt(selObj,grdLst2.selectedIndex);
	secondGrid.repaint();
	
}

//결재자 추가
function confSet(data){
	var i = 0;
	var swFind = false;
	
	if (data == null || data == "") {
		dialog.alert("결재자를 선택한 후 처리하시기 바랍니다.");
		return;
	}
	
	if (data.length > 1) {
		dialog.alert("결재자를 다수로 선택할 수 없습니다. 한사람씩 선택하여 주시기 바랍니다.");
		return;
	}
	
	if ($('[name = "optBase"]').val() == "변경") {//변경일때
	//	if (data == null && grdLst2_dp.length>0) {
	//    	Alert.show("결재 추가할 단계를 선택한 후 처리하시기 바랍니다.");
	//    	return;
	// }
	    if (secondGridData.length == 0) swFind = true;
	}
	for (i = 0;i < secondGridData.length;i++) {
		if (selCd == "U") {
			if (secondGridData[i].cm_gubun == "3" || secondGridData[i].cm_gubun == "6") {
				if (secondGridData[i].delyn == "N" && secondGridData[i].cm_gubun == data.gubun) {
					if (secondGridData[i].cm_position.indexOf(data.cm_rgtcd)>=0) {
			   			swFind = true;
			   			break;
					}
				}			
			}
		} else if (selCd == "I") {
			swFind = true;
			for (i = 0;i < secondGridData.length;i++) {
			  	if (secondGridData[i].cm_gubun == "3" || secondGridData[i].cm_gubun == "6") {
			  		if (secondGridData[i].cm_baseuser != null) {
			  			if (secondGridData[i].cm_baseuser == data.cm_signuser) {
			  				dialog.alert("이미 결재단계에 등록된 결재자입니다. 확인 후 처리하시기 바랍니다.");
		  					return;
		  				}
			  		}
			  	}
			}
		}
	}

	if ( swFind ) {
	var etcObj = new Object();
	var etcsubObj = new Object();
	var etcsubarc = [];
		if (selCd == "U") {
			etcObj = secondGridData[i];
			etcObj.cm_baseuser = data.cm_signuser;
	
			etcsubObj.SvTag  = data.cm_username;
			etcsubObj.SvUser = data.cm_daegyul;
			etcsubarc.push(etcsubObj);
			etcObj.arysv = etcsubarc;
			etcObj.arysv_text = data.cm_username;
	
			etcObj.delsw = false;
			//etcObj.cm_duty = secondGridData[i].cm_position;
  			secondGridData[i] = etcObj;
		} else {
	  		etcObj.cm_name = data.rgtcd;		
	  		etcObj.cm_sgnname = "결재(순차)";
	  		etcObj.cm_baseuser = data.cm_signuser;
	  		etcObj.cm_congbn = "2";
			etcObj.cm_emg2 = "2";
			etcObj.cm_prcsw = "N";
			etcObj.cm_common = "2";
			etcObj.cm_blank = "2";
			etcObj.cm_holi = "2";
			etcObj.cm_emg = "2";
			etcObj.cm_duty = data.cm_rgtcd;
			etcObj.cm_position = data.cm_rgtcd;
			etcObj.cm_gubun = "3";
			etcObj.cm_seqno = "0";
			etcObj.delyn = "Y";
			
			etcsubObj.SvTag  = data.cm_username;
			etcsubObj.SvUser = data.cm_daegyul;
			etcsubarc.push(etcsubObj);
			etcObj.arysv = etcsubarc;
			etcObj.arysv_text = data.cm_username;
			
			etcObj.delsw = true;
			etcObj.userSetable = false;
			
			if (secondGridData.length == 0) secondGridData.push(etcObj);
	  		//else grdLst2_dp.addItemAt(etcObj,grdLst2.selectedIndex);
	  		//결재절차 그리드[grdLst2]에서 선택한 index값이 없을때는 그리드의 len 갑으로 셋팅
	  		else if ( beforSelIndex == -9 ){
	  			secondGridData.push(etcObj);
	  		} else{
	  			secondGridData.splice(beforSelIndex,0,etcObj);
	  		}
	  		//20141021. 결재자 추가 후 결재절차 그리드 선택값 클리어.
			secondGrid.clearSelect();
			beforSelIndex = -9;
		}
		secondGrid.setData(secondGridData);
	}
}

function deleteRow(){
	var secondGridSelected = second.getList('selected');
	
	var findSw = false;
	
	for(var i=0 ;  i>secondGridSelected.length ; i++ ){
		if(secondGridSelected[i].visible == '1'){
			secondGrid.removeRow(secondGridSelected.dindex);
			findSw = true;
		}
	}
	if(findSw){
		dialog.alert('삭제대상을 선택한 후 처리하시기 바랍니다.');
		return;
	}
}

function register(){
	if(secondGridData.length == 0){
		dialog.alert('결재정보가 없습니다. 관리자에게 등록요청한 후 처리하시기 바랍니다.');
		return;
	}
	var Msg = '결재절차를 등록하고, 계속 진행하시겠습니까?';
	if(reqCd == '41'){
		Msg = 'SR등록 결재를 신청합니다.';
	}
	mask.open();
	confirmDialog.confirm({
		msg: Msg,
	}, function(){
		if(this.key === 'ok') {
			registerAfter();
		}
		mask.close();
	});
}

function registerAfter(){
	var findSw = false;
	var i = 0;
	var j = 0;
	//var gubun3Cnt:int = 0;
	var tmpAry = null;
	var tmpNAry = null;
	var tmpNObj = null;
	
	for (i = 0;secondGridData.length>i;i++) {
		if (secondGridData[i].cm_gubun != "8") {
			if (secondGridData[i].arysv[0].SvUser == null || secondGridData[i].arysv[0].SvUser == "") {
				   dialog.alert("[" + secondGridData[i].cm_name + "]에 대한 결재자를 지정한 후 처리하십시오.");
				   return;
			}
		}
	}
	for (i=0;secondGridData.length>i;i++){
		tmpAry = secondGridData[i].arysv;
		if (tmpAry.length < 2){
			continue;
		}
		tmpNAry =[];
		for (j=0;j<tmpAry.length;j++){
			if (tmpAry[j].selectedFlag == "1"){
				tmpNAry.push(tmpAry[j]);
				break;
			}
		}
		tmpNObj = new Object;
		tmpNObj = secondGridData[i];
		tmpNObj.arysv = tmpNAry;
		secondGridData[i] = tmpNObj;
	}
	secondGrid.repaint();
	closeFlag = true;
	window.parent.confirmData = secondGridData;
	popClose();
}

function getConfirmInfo(){
	var Confirm_Info = new Object();
	Confirm_Info = window.parent.confirmInfoData;
	
	var tmpData = {
			confirmInfoData   :   Confirm_Info,
			requestType	: 	'Confirm_Info'
		}
		
		ajaxAsync('/webPage/apply/ApplyRequest', tmpData, 'json',successGetConfirmInfo);
}

function successGetConfirmInfo(data){
	
	$(data).each(function(){
		this.arysv_text = this.arysv[0].SvTag;
	})
	secondGridData = data;
	secondGrid.setData(secondGridData);
	
	if(secondGridData.length == 0 ){
		dialog.alert('결재정보가 없습니다. 관리자에게 등룍요청한 후 처리하시기 바랍니다.');
		$("#btnReq").prop('disabled',true);
		return;
	}
	else{
		$("#btnReq").prop('disabled',false);
	}
	cmdInit();
}

function removeSecondGrid(data, index){
	if(data == null){
		return;
	}

	if (data.delyn == null || data.delyn == "") return;
	if (data.delyn != "Y") return;
		if (data.cm_gubun == "3" || data.cm_gubun == "6" || data.cm_gubun == "C"
		     || data.cm_gubun == "R") {

			
			confirmDialog.confirm({
				msg: "결재단계 ["+data.cm_name+"]를 취소할까요?",
			}, function(){
				if(this.key === 'ok') {
					cnclProc(data, index);
				}
			});
		}
}

function cnclProc(data, index){
	var tmpObj = new Object();
	//var etcsubarc:ArrayCollection = new ArrayCollection();

	if (data.delsw == true) {
		secondGrid.removeRow(index);
		secondGridData.splice(index,1);
	} else {
		tmpObj = data;
		tmpObj.userSetable = true;
		//tmpObj.arysv = etcsubarc;
		tmpObj.arysv[0].SvTag = "";
		tmpObj.arysv[0].SvUser = "";
		tmpObj.cm_baseuser = "";
		if (tmpObj.cm_position == null || tmpObj.cm_position == "") {
			tmpObj.cm_gubun = "C";
		}
		secondGridData[i]=tmpObj;
	}
	secondGrid.setData(secondGridData);
	//201441021. 결재절차 그리드에서 제거 후 선택 값 클리어
	secondGrid.clearSelect();
	beforSelIndex = -9;
}

function secondGridClick(index){
	
	if(index == null || index == undefined){
		return;
	}
	if(index == beforSelIndex){
		beforSelIndex = -9;
		secondGrid.clearSelect();
		return;
	}
	
	beforSelIndex = index;
	
	console.log($(":input:radio[name=optBase]:checked").val());
	if($(":input:radio[name=optBase]:checked").val() == "변경"){
		simpleData();
	}
}
