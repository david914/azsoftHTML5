var pReqNo  = null;
var pUserId = null;

var reqGrid     = new ax5.ui.grid();
var resultGrid  = new ax5.ui.grid();
var picker 		= new ax5.ui.picker();
	
var reqGridData    = null; //체크인목록그리드 데이타
var resultGridData = null; //처리결과그리드 데이타
var cboReqPassData = null; //처리구분 데이타
var cboPrcSysData  = null; //배포구분 데이타

var f = document.reqData;
pReqNo = f.acptno.value;
pUserId = f.user.value;

console.log(pReqNo, pUserId);

if (pReqNo == null) {
	swal({
        title: "정보오류",
        text: "신청정보가 없습니다.\n다시 로그인 하시기 바랍니다."
    });
}

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

reqGrid.setConfig({
    target: $('[data-ax5grid="reqGrid"]'),
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
    		swal({
                title: "처리결과확인팝업",
                text: "신청번호 ["+pReqNo+"]["+param.item.cr_baseitem+"]"
    		});
    		
			//openWindow(1, pReqNo.substr(4,2), pReqNo, param.item.cr_baseitem);
        },
    	trStyleClass: function () {
    		if (this.item.colorsw == '3'){
    			return "fontStyle-cncl";
    		} else if(this.item.colorsw == '5'){
    			return "fontStyle-error";
    		} else if (this.item.cr_itemid != this.item.cr_baseitem){
    			return "fontStyle-module";
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
            {type: 1, label: "소스보기"},
            {type: 2, label: "소스비교"},
            {type: 3, label: "선택건회수"},
            {type: 3, label: "Tmp파일무삭제"},
            {type: 3, label: "스크립트확인"},
            {type: 3, label: "처리결과확인"}
        ],
        popupFilter: function (item, param) {
         	reqGrid.clearSelect();
         	reqGrid.select(Number(param.dindex));
       	 
	       	var selIn = reqGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
       	 
        	if (param.item == undefined) return false;
        	if (param.dindex < 0) return false;

        	return true;
        },
        onClick: function (item, param) {
    		//openWindow(item.type, param.item.qrycd2, param.item.acptno2,'');
    		
            reqGrid.contextMenu.close();//또는 return true;
        }
    },
    columns: [
        {key: "rsrcname", label: "프로그램명",  width: '20%'},
        {key: "story", label: "프로그램설명",  width: '15%'},
        {key: "jawon", label: "프로그램종류",  width: '15%'},
        {key: "jobname", label: "업무명",  width: '10%'},
        {key: "version", label: "신청버전",  width: '10%'},
        {key: "dirpath", label: "프로그램경로",  width: '20%'},
        {key: "priority", label: "우선순위",  width: '10%'} 
    ]
});

resultGrid.setConfig({
    target: $('[data-ax5grid="resultGrid"]'),
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
    		swal({
                title: "처리결과확인팝업",
                text: "신청번호 ["+pReqNo+"]["+param.item.cr_acptno+"]["+param.item.cr_seqno+"]"
    		});
    		
    		if (pReqNo != param.item.cr_acptno) {
    			//openWindow(1, pReqNo.substr(4,2), pReqNo+param.item.cr_acptno, param.item.cr_seqno);
    		} else {
    			//openWindow(1, pReqNo.substr(4,2), pReqNo, param.item.cr_seqno);
    		}
        },
    	trStyleClass: function () {
    		if (this.item.colorsw == '3'){
    			return "fontStyle-cncl";
    		} else if(this.item.colorsw == '5'){
    			return "fontStyle-error";
    		} else if (this.item.cr_itemid != this.item.cr_baseitem){
    			return "fontStyle-module";
    		} 
    	},
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: "prcsys", label: "구분",  width: '10%'},
        {key: "rsrcname", label: "프로그램명",  width: '15%'},
        {key: "jawon", label: "프로그램종류",  width: '15%'},
        {key: "dirpath", label: "적용경로",  width: '20%'},
        {key: "server", label: "적용서버",  width: '20%'},
        {key: "result", label: "처리결과",  width: '10%'},
        {key: "prcdate", label: "처리일시",  width: '10%'} 
    ]
});

$(document).ready(function(){
	$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

	$('#tab1Li').width($('#tab1Li').width()+10);
	$('#tab2Li').width($('#tab2Li').width()+10);
	setTabMenu();
});


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