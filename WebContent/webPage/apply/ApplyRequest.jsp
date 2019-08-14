<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
 <!-- history S-->
        <div id="history_wrap"></div>
        <!-- history E-->         
	    <!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap">
                <div class="row por">
                	<div class="tit_150 poa">
                    	<label>*SR-ID</label>
                    </div>
                    <div class="ml_150 tal">
						<div id="cboSrId" data-ax5select="cboSrId" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:80%;"></div>						
					</div>
					<div class="vat poa_r">
						<button id="btnSR" class="btn_basic_s margin-5-left" disabled=true style="width:70px;">SR정보</button>
					</div>
				</div>
				<div class="row por">			
                    <div class="tit_150 poa">
                        <label>*시스템</label>
                    </div>		
                    <div class="ml_150">
						<div class="width-30 dib">
		                    <div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
	                    <div class="width-25 dib">
	                    	<div class="tit_100 poa text-right">
	                        	<label>프로그램 유형</label>
	                        </div>
	                        <div class="ml_100">
	                        	<div id="cboRsrccd" data-ax5select="cboRsrccd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
							</div>
						</div>
						
						<div class="width-25 dib" id="cboReqDiv">
	                    	<div class="tit_100 poa text-right">
	                        	<label>신청구분</label>
	                        </div>
		                    <div class="ml_100">
		                    	<div id="cboReq" data-ax5select="cboReq" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
							</div>
						</div>
					</div>
				</div>	
				<div class="row por" id="progRow">
					<!-- 프로그램명/설명 -->		
                    <div class="tit_150 poa">
                    	<label>*프로그램명/설명</label>
                    </div>
                    <div class="ml_150 tal">
						<input id="txtRsrcName" name="txtRsrcName" type="text" class="width-80"></input>
					</div>						
					<div class="vat poa_r" id="searchBox">
						 <button id="btnFind" class="btn_basic_s" style="width:70px;">검색</button>
					</div>
				</div>
			</div>
		</div>
		<!--검색E-->
	    <!-- 게시판 S-->
		<div>
		    <div class="az_board_basic az_board_basic_in" style="height:36%">
		    	<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height:100%;"></div>
			</div>	
			<!-- 게시판 E -->
			<div class="por margin-5-top margin-10-bottom">
				<div class=""><input type="checkbox" class="checkbox-pie" id="chkDetail" data-label="항목상세보기" checked></input></div>
				<div class="poa_r">
					<div class="vat dib">
						<button id="btnAdd" class="btn_basic_s margin-5-left">추가</button>
					</div>
					<div class="vat dib">
						<button id="btnDel" class="btn_basic_s margin-5-left">제거</button>
					</div>
				</div>
			</div>
		</div>
	
		    <!-- 게시판 S-->
		<div>
		    <div class="az_board_basic az_board_basic_in" style="height:38%">
		    	<div data-ax5grid="secondGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height:100%"></div>
			</div>
		</div>		
		<!-- 
		<div class="por margin-5-top margin-10-bottom">
			<div class="poa_r">
				<div class="vat dib">
					<button id="btnRequest" class="btn_basic_s margin-5-left">운영배포요청</button>
				</div>
			</div>
	    </div>
	     -->
	    
	    <div class="row" id="sayuBox">
			<!-- 요청부서 -->
			<div class="tit_80 poa">
				<label>*신청사유</label>
			</div>
			<div class="ml_80" id="sayuInputBox">
                  <input id="txtSayu" name="txtSayu" class="width-100" type="text" style="align-content:left;"></input>
			</div>
	    </div>
		<div class="row">
			<div class="width-30 dib float-left">
				<div class="tit_80 poa">
					<label id="lblReqGbn">*처리구분</label>
				</div>
				<div class="ml_80">
					<div id="cboReqGbn" class="width-100" data-ax5select="cboReqGbn" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
				</div>
	
			</div>
			<div class="width-37 dib float-left" id="panCal" style="display:none;; margin-left:50px;">
				<div class="tit_80 poa">
					<label>*적용일시</label>
				</div>
				<div class="ml_80 dib">
					<div class="input-group width-40 dib" data-ax5picker="txtReqDate"style=" font-size:0px;" >
			            <input id="txtReqDate" type="text" class="f-cal" placeholder="yyyy/mm/dd">
			            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
			        </div>
			        <div style="font-size:0px; " class='width-40 dib'>
						<input id="txtReqTime" name="txtReqTime" type="text" class="f-cal"></input>
						<span class="btn_calendar"><i class="fa fa-clock-o"></i></span>
					</div>
				</div>
			</div>
	   			<div class='ml150 tal float-right' style="display:inline;">
					<div style="display:inline-block;">
		   				<input type="checkbox" class="checkbox-pie" id="chkBefJob" data-label="선행작업"></input>
		   				<input type="checkbox" class="checkbox-pie" id="chkSvr" data-label="버전UP만적용"></input>
					</div>
					<button id="btnFileUpload" class="btn_basic_s margin-5-left" >테스트결과서</button>
					<button id="btnDiff" class="btn_basic_s margin-5-left" style='display:none;'>파일비교</button>
					<button id="btnRequest" class="btn_basic_s margin-5-left" disabled=true>체크인</button>
				</div>
		</div>
</div>

<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
	<input type="hidden" name="srid"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script src="<c:url value="/scripts/bootstrap-timepicker.min.js"/>" type="text/javascript"></script>
<script type="text/javascript"	src="<c:url value="/js/ecams/apply/ApplyRequest.js"/>"></script>