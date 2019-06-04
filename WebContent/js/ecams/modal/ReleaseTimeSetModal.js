/**
 * 정기배포일괄등록 팝업 화면 기능 정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-05-29
 * 
 */

var releaseGrid = new ax5.ui.grid();
var releaseGridData = null;

releaseGrid.setConfig({
    target: $('[data-ax5grid="releaseGrid"]'),
    sortable: false, 
    multiSort: false,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 25,
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
        {key: "chcked", label: "정기배포사용",  width: '40%',
    	 formatter: function(){
        	 var htmlStr = '';
        	 if(this.item.checked === 'true') {
        		 htmlStr += '<input id="check'+this.item.cm_syscd+'" type="radio" name="release'+this.item.cm_syscd+'" value="optCheck" checked="checked" onclick="checkR(event)"/>';
        		 htmlStr += '<label for="check'+this.item.cm_syscd+'">설정</label>';
        		 htmlStr += '<input id="checkUn'+this.item.cm_syscd+'" type="radio" name="release'+this.item.cm_syscd+'" value="optUnCheck" onclick="checkR(event)"/>';
        		 htmlStr += '<label for="checkUn'+this.item.cm_syscd+'">해제</label>';
        	 }
        	 if(this.item.checked === 'false') {
        		 htmlStr += '<input id="check'+this.item.cm_syscd+'" type="radio" name="release'+this.item.cm_syscd+'" value="optCheck" onclick="checkR(event)"/>';
        		 htmlStr += '<label for="check'+this.item.cm_syscd+'">설정</label>';
        		 htmlStr += '<input id="checkUn'+this.item.cm_syscd+'" type="radio" name="release'+this.item.cm_syscd+'" value="optUnCheck" checked="checked" onclick="checkR(event)"/>';
        		 htmlStr += '<label for="checkUn'+this.item.cm_syscd+'">해제</label>';
        	 }
        	 return htmlStr;
         }
        },
        {key: "cm_sysmsg", label: "시스템명",  width: '40%'},
        {key: "cm_systime", label: "배포시간",  width: '20%'},
    ]
});

$('input:radio[name=releaseChk]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});
function checkR(event) {
	var id = event.target.id;
	
	if(event.target.value === 'optCheck') 	id = id.substr(5,5);
	if(event.target.value === 'optUnCheck') id = id.substr(7,5);
	
	releaseGridData.forEach(function(item, index) {
		if(item.cm_syscd === id) {
			if(event.target.value === 'optCheck') 	item.checked = 'true';
			if(event.target.value === 'optUnCheck') item.checked = 'false';
			
			releaseGridData.splice(index,1,item);
		}
	});
}
function popClose(){
	window.parent.relModal.close();
}

$(document).ready(function(){
	getReleaseTime();
	
	// 전체설정/전체해제
	$('input:radio[name^="release"]').bind('click', function() {
		var checkYn = 'true';
		if(this.value === 'optUnCheck') {
			checkYn = 'false';
		}
		releaseGridData.forEach(function(item, index) {
			item.checked = checkYn;
			releaseGridData.splice(index,1,item);
		});
		releaseGrid.setData(releaseGridData);
		$('input:radio[name^="release"]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});
	});
	
	// 조회
	$('#btnSearch').bind('click',function() {
		getReleaseTime();
	});
	
	// 등록
	$('#btnReleaseTimeSet').bind('click',function() {
		setReleaseTime();
	});
	
	// 닫기
	$('#btnClose').bind('click',function() {
		window.parent.relModal.close();
	});
});


// 정기배포 설정값 등록
function setReleaseTime(txtTime) {
	var chkYN = false;
	var txtTime = null;
	releaseGridData.forEach(function(item, index) {
		if(item.checked === 'true') {
			chkYN = true;
		}
	});
	
	txtTime = $('#txtTime').val();
	if(chkYN && txtTime.length <= 0) {
		dialog.alert('정기배포시간을 확인해 주세요.',function(){});
		return;
	}
	txtTime = replaceAllString(txtTime, ':', '');
	
	var systemInfoDta = new Object(); 
	systemInfoDta = {
		requestType		: 'setReleaseTime',
		releaseGridData : releaseGridData,
		txtTime 		: txtTime,
	}
	ajaxAsync('/webPage/modal/ReleaseTimeSet', systemInfoDta, 'json',successSetReleaseTime);
}

function successSetReleaseTime(data) {
	if(data === 0) {
		dialog.alert('정기배포 시간을 일괄등록 완료 하였습니다.',
				function(){
					getReleaseTime();
				});
	}
}

// 정기배포 설정값 조회
function getReleaseTime() {
	var systemInfoDta = new Object(); 
	systemInfoDta = {
		requestType	: 	'getReleaseTime'
	}
	ajaxAsync('/webPage/modal/ReleaseTimeSet', systemInfoDta, 'json',successgetReleaseTime);
}

// 정기배포 설정값 조회 결과
function successgetReleaseTime(data) {
	releaseGridData = data;
	releaseGrid.setData(releaseGridData);
	
	$('input:radio[name^="release"]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});
}