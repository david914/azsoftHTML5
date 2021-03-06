<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.ecams.common.base.StringHelper"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<link rel="stylesheet" href="<c:url value="/styles/bootstrap-timepicker.css"/>" />

<%
	String acptNo = StringHelper.evl(request.getParameter("acptno"),"");
	String userId = StringHelper.evl(request.getParameter("user"),"");
%>

<style>
.timePickerDiv{
	width: 95px;
	height: 25px;
	text-align: center;
	background-color: #fff;
	border: 1px solid #ccc;
}
.timePickerDiv:hover, .timePickerDiv:focus{
	width: 95px;
	height: 25px;
	text-align: center;
	background-color: #fff;
	border: 1px solid #326aab;
}
.numberTxt, .numberTxt:hover, .numberTxt:focus {
	padding: 0px;
	margin: 0px;
	width: 35px;
	height: 22px;
	vertical-align: middle;
    text-align: right;
    border: 0px;
}
input[type="number"] {
    position: relative;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
      /*-webkit-appearance: none;*/
      opacity: .5;
      background-color: #fff;
}
</style>

<script type="text/javascript">
	function maxLengthCheck(object) {
		if (object.value.length > object.maxLength){
			object.value = object.value.slice(0, object.maxLength);
		}
		if (object.value < Number(object.min) || object.value > Number(object.max)) {
			object.value = '';
		}
	}
	//커서 아웃될때
	function changeTimeTxt() {
		if (!$('#hourTxt').is(":focus")) {
			if ($('#hourTxt').val() != '' && $('#hourTxt').val().length < 2) {
				$('#hourTxt').val('0'+$('#hourTxt').val());
			} else if ($('#hourTxt').val() == '') {
				$('#hourTxt').val('00');
			}
		}
		if (!$('#minTxt').is(":focus")) {
			if ($('#minTxt').val() != '' && $('#minTxt').val().length < 2) {
				$('#minTxt').val('0'+$('#minTxt').val());
			} else if ($('#minTxt').val() == '') {
				$('#minTxt').val('00');
			}
		}
	}
</script>

<body id="reqBody" style="padding: 10px;" onmouseup="changeTimeTxt()">
    <div class="content">
        <!-- history S-->
        <div id="history_wrap">	변경신청 <strong>&gt; 요청상세</strong></div>
        <!-- history E-->
		<div class="az_search_wrap">
			<div class="az_in_wrap">			
				<div class="row vat cb">
					<!-- line1 -->		
                    <div class="width-30 float-left">
						<div class="margin-5-right">
	                    	<label class="tit_80 poa">신청번호</label>
	                        <div class="ml_80">
								<input id="txtAcptNo" class="width-100" type="text" readonly>
							</div>
						</div>
					</div>	
                    <div class="width-70 float-left">
						<div>
	                    	<label class="tit_80 poa">&nbsp;&nbsp;신청사유</label>
	                        <div class="ml_80">
								<input id="txtSayu" class="width-100" type="text" readonly>
							</div>
						</div>
					</div>
				</div>							
				<div class="row vat cb">
					<!-- line2 -->		
                    <div class="width-30 float-left">
						<div class="margin-5-right">
	                    	<label class="tit_80 poa">시스템</label>
	                        <div class="ml_80">
								<input id="txtSyscd" class="width-100" type="text" readonly>
							</div>
						</div>
					</div>
                    <div class="width-70 float-left por">
						<div class="dib width-33">
	                    	<label class="tit_80 poa">&nbsp;&nbsp;신청일시</label>
	                        <div class="ml_80">
								<input id="txtAcptDate" class="width-100" type="text" readonly>
							</div>
						</div>
						<div class="dib margin-10-left" style="width:calc(67% - 225px);"><!-- width-33 -->
	                    	<label class="tit_80 poa">완료일시</label>
	                        <div class="ml_80">
								<input id="txtPrcDate" class="width-100" type="text" readonly>
							</div>
						</div>
						<div class="dib poa_r">
							<button id="btnTestDoc" class="btn_basic_s">테스트결과서</button><button id="btnBefJob" class="btn_basic_s margin-5-left">선후행작업확인</button>
						</div>
					</div>
				</div>						
				<div class="row vat cb">
					<!-- line3 -->		
                    <div class="width-30 float-left">
						<div class="margin-5-right">
	                    	<label class="tit_80 poa">신청자</label>
	                        <div class="ml_80">
								<input id="txtEditor" class="width-100" type="text" readonly>
							</div>
						</div>
					</div>	
                    <div class="width-70 float-left por">
						<div class="dib width-33" style="vertical-align: top;">
	                    	<label class="tit_80 poa">&nbsp;&nbsp;처리구분</label>
	                        <div class="ml_80">
								<div id="cboReqPass" data-ax5select="cboReqPass" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib"></div>
							</div>
						</div>
						
						
						<div class="dib margin-5-left width-40">
							<div id="reqgbnDiv"  style="position: relative; display: inline-block;" >
								<!--
								<div class="input-group dib" data-ax5picker="txtReqDate" style="display:inline-block;" >
						            <input id="txtReqDate" type="text" class="f-cal" placeholder="yyyy/mm/dd" style="width:90px;">
						            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
						        </div>
						        -->
						        <div class="input-group dib" data-ax5picker="txtReqDate" style="display:inline-block;" >
									<input id="txtReqDate" type="text" class="f-cal" placeholder="yyyy/mm/dd" style="width:90px;">
									<button id="btnReqDate" class="btn_calendar"><i class="fa fa-calendar-o"></i></button>
								</div>
						        <div class="dib vat timePickerDiv">
						        	<!-- style="text-align: center; background-color: #fff; width:90px; height: 25px; border: 1px; border-style: inset;" -->
						        	<!--  
									<input id="txtReqTime" type="text" class="f-cal" required="required" style="width:55px;">
									<span class="btn_calendar"><i class="fa fa-clock-o"></i></span>
									-->
									<input class="numberTxt" type="number" id="hourTxt" min="0" max="23" maxlength="2" oninput="maxLengthCheck(this)">
									<label style="height: 22px; vertical-align: top; font-size: 12px;">&nbsp;:&nbsp;</label>
									<input class="numberTxt" type="number" id="minTxt" min="0" max="59" maxlength="2" oninput="maxLengthCheck(this)">
								</div>
							</div> 
							<div id="reqBtnDiv" style="display: inline-block; vertical-align: top;">
						    	<button id="btnUpdate" class="btn_basic_s margin-5-left">수정</button>
						    </div>
						</div>
					</div>						
					<div class="row vat cb">
						<!-- line4 -->		
	                    <div class="width-30 float-left">
							<div class="margin-5-right margin-5-top">
		                    	<label class="tit_80 poa">신청구분</label>
		                        <div class="ml_80">
									<input id="txtReqGbn" class="width-100" type="text" readonly> 
								</div>
							</div>
						</div>			
						<div class="width-70 float-left por margin-5-top" id="SrDiv">
							<div class="dib" style="width:calc(100% - 109.31px);">
		                    	<label class="tit_80 poa">&nbsp;&nbsp;SR-ID</label>
		                        <div class="ml_80 margin-5-right">
									<input id="txtSR" class="width-100" type="text" readonly>
								</div>
							</div>
							<div style="display: inline-block; vertical-align: top;">
								<button id="btnSR" class="btn_basic_s" style="width: 109.31px;">SR정보확인</button>
						    </div>
						</div>
					</div>				
					<div class="row vat cb">
						<!-- line5 -->		
	                    <div class="width-30 float-left">
							<div class="margin-5-right">
		                    	<label class="tit_80 poa">진행상태</label>
		                        <div class="ml_80">
									<input id="txtStatus" class="width-100" type="text" readonly>
								</div>
							</div>
						</div>	
	                    <div class="width-70 float-left por">
	                    	<label id="lblErrMsg" class="txt_r font_12 margin-5-left"></label>
	                    </div>
					</div>					
				</div>
			</div>
			<!--tab-->
	        <div class="tab_wrap margin-10-top">
				<ul class="tabs">
					<li rel="tab1" id="tab1Li" class="on">신청목록</li><li rel="tab2" id="tab2Li">처리결과확인</li>
					<div class="r_wrap margin-10-right" id="btnBox" style="display:none;">
						<button class="btn_basic_s" id="btnSrcView">소스보기</button>
						<button class="btn_basic_s margin-2-left" id="btnSrcDiff">소스비교</button>
						<button class="btn_basic_s margin-2-left" id="btnPriority">우선적용</button>
						<button class="btn_basic_s margin-2-left" id="btnAllCncl">전체회수</button>
						<button class="btn_basic_s margin-2-left" id="btnRetry">전체재처리</button>
						<button class="btn_basic_s margin-2-left" id="btnNext">다음단계진행</button>
						<button class="btn_basic_s margin-2-left" id="btnErrRetry">오류건재처리</button>
						<button class="btn_basic_s margin-2-left" id="btnStepEnd">단계완료</button>
						<button class="btn_basic_s margin-2-left" id="btnLog">로그확인</button>
					</div>
				</ul>
			</div>
		  	<div class="tab_container" style="height: 55%;">
		      	<div id="tab1" class="tab_content" style="height: 100%;">
					<div class="row half_wrap_cb" style="height: 100%;">
						<div class="l_wrap">
							<label><input type="checkbox" id="chkDetail" class="checkbox-detail" data-label="항목상세보기"/></label>
							<button class="btn_basic_s margin-5-left" id="btnSelCncl">선택건회수</button>
				    	</div>
						<div class="r_wrap">
							<button class="btn_basic_s" id="btnPriorityOrder">우선순위적용</button>
			    		</div>
			    		<div class="l_wrap width-100 margin-10-top" style="height: 85%;">
						    <div class="panel-body text-center" id="gridDiv1" style="height: 100%;">
						    	<div data-ax5grid="reqGrid" style="height: 100%;"></div>
						    </div>
					    </div>
				    </div>
		       	</div>
		       	<div id="tab2" class="tab_content" style="height: 100%;">
					<div class="row half_wrap_cb" style="height: 100%;">
						<div class="l_wrap width-100">
		    				<label class="tit_80 poa">배포구분</label>
		    				<div class="ml_80 width-20 dib">
								<div id="cboPrcSys" data-ax5select="cboPrcSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%;"></div>
		    				</div>
			    		</div>
			    		<div class="l_wrap width-100 margin-10-top" style="height: 85%;">
						    <div class="panel-body text-center" id="gridDiv2" style="height: 100%;">
						    	<div data-ax5grid="resultGrid"  style="height: 100%;"></div>
						    </div>
					    </div>
					</div>
				</div>
		   	</div>
			<!--tab-->
			
			<div class="row margin-10-top"><!--  vat cb -->
	            <div class="width-65 float-left margin-10-top">
					<div class="margin-5-right">
	                	<label id="lblApprovalMsg" class="tit_100 poa">결재/반려의견</label>
	                    <div class="ml_100">
	    					<!-- <textarea id="txtApprovalMsg" class="width-100"></textarea> -->
	    					<input id="txtApprovalMsg" class="width-100" type="text">
						</div>
					</div>
				</div>
				<div class="width-35 float-right margin-10-top tar">
					<button class="btn_basic_s" id="btnQry" >새로고침</button>
					<button class="btn_basic_s margin-2-left" id="btnApprovalInfo">결재정보</button>
					<button class="btn_basic_s margin-2-left" id="btnApproval">결재</button>
					<button class="btn_basic_s margin-2-left" id="btnCncl">반려</button>
					<button class="btn_basic_s margin-2-left margin-10-right" id="btnClose">닫기</button>
				</div>
			</div>
		</div>
	</div>
</body>
<!-- contener E -->

<form name="getReqData">
	<input type="hidden" name="acptno" value="<%=acptNo%>"/>
	<input type="hidden" name="user" value="<%=userId%>"/>
</form>

<form name="setReqData">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
	<input type="hidden" name="itemid"/>
	<input type="hidden" name="srid"/>
	<input type="hidden" name="etcinfo"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script src="<c:url value="/scripts/bootstrap-timepicker.min.js"/>" type="text/javascript"></script>
<script type="text/javascript"	src="<c:url value="/js/ecams/winpop/PopRequestDetail.js"/>"></script>