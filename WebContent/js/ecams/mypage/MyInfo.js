
var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부

var jobGrid		= new ax5.ui.grid();
var pgmGrid		= new ax5.ui.grid();

var jobGridData		= null;
var pgmGridData		= null;

var cboPositionData	= null;
var cboDutyData		= null;

var ulDutyInfoData	= null;
var ulJobInfoData	= null;

var myWin 			= null;

jobGrid.setConfig({
    target: $('[data-ax5grid="jobGrid"]'),
    sortable: true, 
    multiSort: true,
    header: {
        align: "center"
    },
    body: {
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "jobgrp", 	label: "시스템",  			width: '40%', align: 'left'},
        {key: "job", 		label: "업무명 (업무코드)",  	width: '60%', align: 'left'}
    ]
});

pgmGrid.setConfig({
    target: $('[data-ax5grid="pgmGrid"]'),
    sortable: true, 
    multiSort: true,
    header: {
        align: "center"
    },
    body: {
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            if (this.colIndex == 8) {
        		if (this.item.cr_status == '3' || this.item.cr_status == '5' ||
        			this.item.cr_status == 'B' || this.item.cr_status == 'E' || this.item.cr_status == 'G') {
                	console.log("신청 페이지 이동!!");
                	window.parent.changePage(this.item.cr_status);
        		} else {
        			if (this.item.popinfo != null && this.item.popinfo != '') {
                    	console.log("상세페이지로  이동!! ");
                    	
                    	openWindow(1, this.item.popinfo);
        			}
        		}
        	}
        },
        onDBLClick: function () {
         	if (this.dindex < 0) return;
         	if (this.item.cr_itemid == null || this.item.cr_itemid == '') return;
         	if (this.colIndex == 8) return;
         	
        	openWindow(2, this.item.cr_itemid);
        },
    	trStyleClass: function () {},
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
            {type: 1, label: "프로그램정보"}
        ],
        popupFilter: function (item, param) {
        	pgmGrid.clearSelect();
        	pgmGrid.select(Number(param.dindex));
       	 
	       	var selIn = pgmGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
       	 
        	if (param.item == undefined) return false;
        	if (param.dindex < 0) return false;
        	if (param.colIndex == 8) return false;
        	
        	return true;
        },
        onClick: function (item, param) {
         	if (param.item.cr_itemid == null || param.item.cr_itemid == '') return;
         	
        	openWindow(2, param.item.cr_itemid);
        	pgmGrid.contextMenu.close();//또는 return true;
        }
    },
    columns: [
        {key: "cm_sysmsg", 	label: "시스템",  		width: '10%', align: 'left'},
        {key: "cm_jobname",	label: "업무",  		width: '10%', align: 'left'},
        {key: "cm_dirpath",	label: "프로그램경로",  	width: '20%', align: 'left'},
        {key: "cr_rsrcname",label: "프로그램명",  	width: '15%', align: 'left'},
        {key: "jawon", 		label: "프로그램종류",  	width: '10%', align: 'left'},
        {key: "sta", 		label: "상태",  		width: '6%', align: 'left'},
        {key: "version", 	label: "버전",  		width: '5%'},
        {key: "cr_story", 	label: "프로그램설명",  	width: '15%', align: 'left'},
        {key: "", 		label: "바로가기",  		width: '7%', 
        	formatter: function() {
        		var title = "";
        		if (this.item.cr_status == '3' || this.item.cr_status == '5' ||
        			this.item.cr_status == 'B' || this.item.cr_status == 'E' || this.item.cr_status == 'G') {
                	if (this.item.cr_status == '3' || this.item.cr_status == '5') {
                		title = "체크인 신청화면으로 이동";
                	} else if (this.item.cr_status == 'B' || this.item.cr_status == 'E') {
                		title = "테스트배포 신청화면으로 이동";
                	} else if (this.item.cr_status == 'G') {
                		title = "운영배포 신청화면으로 이동";
                	} 
        		} else {
        			if (this.item.popinfo != null && this.item.popinfo != '') {
        				title = "신청상세화면 새창으로 열기 [신청번호:"+this.item.popinfo+"]";
        			} 
        		}
        		
        		if (title == '') {
        			return '';
        		} else {
        			return '<img width="16px" height="16px" src="/img/next_page.png" alt="file download" style="cursor:pointer;margin-top: 2px;" title="'+title+'"/>';
        		}
        	}
        }
    ]
});

$('[data-ax5select="cboPosition"]').ax5select({
    options: []
});

$('[data-ax5select="cboDuty"]').ax5select({
    options: []
});

$('[data-ax5select="cboSysCd"]').ax5select({
	options: []
});

$('input:radio[name^="userRadio"]').wRadio({theme: 'circle-radial red', selector: 'checkmark_black'});
$('input.checkbox-user').wCheck({theme: 'square-classic red', selector: 'checkmark_black', highlightLabel: true});


$(document).ready(function() {
	$('[data-ax5select="cboPosition"]').ax5select("disable");	//직급콤보 비활성화
	$('[data-ax5select="cboDuty"]').ax5select("disable");		//직위콤보 비활성화
	
	if (userId == null || userId == '') return;
	
	$('#txtUserId').val(userId);
	$('#txtUserName').val(userName);
	
	if (adminYN) {
		$('#chkManage').wCheck('check', true);
	} else {
		$('#chkManage').wCheck('check', false);
	}
	
	//코드정보 조회
	getCodeInfo();
	
	//현재 개발중인 프로그램목록 가져오기
	getDevProgramList();
});

//현재 개발중인 프로그램목록 가져오기
function getDevProgramList() {
	var data = new Object();
	data = {
		UserId 		: userId,
		requestType	: 'getDevProgramList'
	}
	ajaxAsync('/webPage/mypage/MyInfoServlet', data, 'json',successGetDevProgramList);
}
//개발중인 프로그램목록 가져오기 완료
function successGetDevProgramList(data){
	pgmGridData = data;
	pgmGrid.setData(pgmGridData);
}

function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
						new CodeInfo('POSITION','SEL','N'),
						new CodeInfo('DUTY',	'SEL','N')
					]);
	cboPositionData 	= codeInfos.POSITION;
	cboDutyData 		= codeInfos.DUTY;
	
	$('[data-ax5select="cboPosition"]').ax5select({
        options: injectCboDataToArr(cboPositionData, 'cm_micode' , 'cm_codename')
	});
	$('[data-ax5select="cboDuty"]').ax5select({
        options: injectCboDataToArr(cboDutyData, 'cm_micode' , 'cm_codename')
	});
	
	//사용자조회
	getUserInfo();
};
function getUserInfo() {
	//사용자정보 조회
	var data = new Object();
	data = {
		userId 		: userId,
		userName 	: '',
		requestType	: 'getUserInfo'
	}
	ajaxAsync('/webPage/mypage/MyInfoServlet', data, 'json',successGetUserInfo);
}

//사용자정보가져오기 완료
function successGetUserInfo(data){
	var userInfo = data[0];
	
	if(userInfo.ID === 'ERROR') {
		dialog.alert('등록되지 않은 사용자입니다.', function() {});
		return;
	}
	
	$('#txtUserId').val(userInfo.cm_userid);
	$('#txtUserName').val(userInfo.cm_username);
	$('#txtIp').val(userInfo.cm_ipaddress);
	$('#txtTel1').val(userInfo.cm_telno1);
	$('#txtTel2').val(userInfo.cm_telno2);
	$('#txtDaeGyul').val(userInfo.Txt_DaeGyul);
	$('#txtBlankTerm').val(userInfo.Txt_BlankTerm);
	$('#txtBlankSayu').val(userInfo.Txt_BlankSayu);
	$('#txtLogin').val(userInfo.cm_logindt);
	$('#txtCreatdt').val(userInfo.cm_creatdt);
	$('#txtErrCnt').val(userInfo.cm_ercount);
	$('#txtOrg').val(userInfo.deptname1);
	$('#txtOrgAdd').val(userInfo.deptname2);
	$('#txtEMail').val(userInfo.cm_email);
	

	$('[data-ax5select="cboPosition"]').ax5select('setValue', userInfo.cm_position, true);
	$('[data-ax5select="cboDuty"]').ax5select('setValue', userInfo.cm_duty, true);
	
	if(userInfo.cm_manid === 'Y') {
		$('#optManCheck').wRadio('check', true);
	} else {
		$('#optOutCheck').wRadio('check', true);
	}
	
	if(userInfo.cm_admin === '1') {
		$('#chkManage').wCheck('check', true);
	} else {
		$('#chkManage').wCheck('check', false);
	}
	
	if(userInfo.cm_handrun === 'Y') {
		$('#chkHand').wCheck('check', true);
	} else {
		$('#chkHand').wCheck('check', false);
	}
	
	getUserRgtCd();
}
// 사용자 권한 가져오기
function getUserRgtCd() {
	var data = new Object();
	data = {
		UserId 		: $('#txtUserId').val().trim(),
		requestType	: 'getUserRgtCd'
	}
	ajaxAsync('/webPage/mypage/MyInfoServlet', data, 'json',successGetUserRgtCd);
}
// 사용자 권한 가져오기 완료
function successGetUserRgtCd(data) {
	ulDutyInfoData = data;
	
	makeDutyInfoUlList();
	getUserJobList();
}
//담당직무 리스트
function makeDutyInfoUlList() {
	$('#ulDutyInfo').empty();
	var liStr = null;
	var addId = null;
	ulDutyInfoData.forEach(function(item, index) {
		addId = item.cm_micode;
		liStr  = '';
		liStr += '<li class="list-group-item">';
		if(item.checkbox !== undefined && item.checkbox === 'true') {
			liStr += '	<input type="checkbox" class="checkbox-duty" id="chkDuty'+addId+'" data-label="'+item.cm_codename+'"  value="'+addId+'" checked="checked" disabled/>';
		} else {
			liStr += '	<input type="checkbox" class="checkbox-duty" id="chkDuty'+addId+'" data-label="'+item.cm_codename+'"  value="'+addId+'" disabled/>';
		}
		liStr += '</li>';
		$('#ulDutyInfo').append(liStr);
	});
	
	$('input.checkbox-duty').wCheck({theme: 'square-inset blue', selector: 'checkmark_black', highlightLabel: true});
}
// 사용자 업무 리스트 가져오기
function getUserJobList() {
	var data = new Object();
	data = {
		gbnCd 		: 'USER',
		UserId 		: $('#txtUserId').val().trim(),
		requestType	: 'getUserJobList'
	}
	ajaxAsync('/webPage/mypage/MyInfoServlet', data, 'json',successGetUserJobList);
}
//담당업무 가져오기 완료
function successGetUserJobList(data) {
	jobGridData = data;
	jobGrid.setData(jobGridData);
}

function openWindow(type, popinfo) {
	var nHeight, nWidth, cURL, winName;
	if ( (type+'_'+popinfo.substr(5,2)) == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}
    winName = type+'_'+popinfo.substr(5,2);
    
	var f = document.popPam;
    f.user.value 	= userId;
    
    if (type == '1') {
        f.acptno.value	= popinfo;
        
		nHeight = 740;
	    nWidth  = 1200;
		cURL = "/webPage/winpop/PopRequestDetail.jsp";
    } else {
        f.itemid.value	= popinfo;
        
    	nHeight = 350;
    	nWidth  = 1200;
		cURL = "/webPage/winpop/PopProgramInfo.jsp";
    }
	
    myWin = winOpen(f, winName, cURL, nHeight, nWidth);
}