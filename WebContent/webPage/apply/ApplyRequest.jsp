<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
<link rel="stylesheet" href="<c:url value="/styles/bootstrap-timepicker.css"/>" />
<style>
	.fontStyle-cncl {
		color: #FF0000;
	}
	.fontStyle-module {
		color: #FF8080;
	}
</style>

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
						<button id="btnSR" class="btn_basic_s margin-5-left" >SR정보확인</button>
					</div>
				</div>
				<div class="row">					
					<!-- 요청부서 -->	
					<div class="width-35 dib">
	                    <div class="tit_150 poa">
	                        <label id="lbUser">*시스템</label>
	                    </div>
	                    <div class="ml_150">
	                    	<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
                    <div class="width-23 dib">
                    	<div class="tit_150 poa" style="text-align:right;">
                        	<label id="lbUser">프로그램 유형</label>
                        </div>
                        <div class="ml_150">
                        	<div id="cboRsrccd" data-ax5select="cboRsrccd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
					
					<div class="dib" style="width:23.6%" id="cboReqDiv">
                    	<div class="tit_150 poa" style="text-align:right;">
                        	<label id="lbUser">신청구분</label>
                        </div>
	                    <div class="ml_150">
	                    	<div id="cboReq" data-ax5select="cboReq" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
				</div>	
				<div class="row por">
					<!-- 프로그램명/설명 -->		
                    <div class="tit_150 poa">
                    	<label id="lbUser">*프로그램명/설명</label>
                    </div>
                    <div class="ml_150 tal">
						<input id="txtRsrcName" name="txtRsrcName" type="text" style="width:80%;"></input>
					</div>						
					<div class="vat poa_r">
						 <button id="btnFind" class="btn_basic_s">검색</button>
					</div>
				</div>
			</div>
		</div>
		<!--검색E-->
	    <!-- 게시판 S-->
	    <div class="az_board_basic">
	    	<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height:280px"></div>
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

	    <!-- 게시판 S-->
	    <div class="az_board_basic">
	    	<div data-ax5grid="secondGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height:280px"></div>
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
	    
	    <div class="row">
			<!-- 요청부서 -->
			<div class="tit_150 poa">
				<label id="lbUser">*SR제목(신청사유)</label>
			</div>
			<div class="ml_150">
                  <input id="txtSayu" name="txtSayu" class="form-control" type="text" style="align-content:left;width:100%;"></input>
			</div>
	    </div>
		<div class="row">
			<div class="width-30 dib float-left">
				<div class="tit_150 poa">
					<label id="lblReqGbn">*처리구분</label>
				</div>
				<div class="ml_150">
					<div id="cboReqGbn" data-ax5select="cboReqGbn" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%;"></div>
				</div>
	
			</div>
			<div class="width-44 dib float-left" id="panCal" style="visibility:hidden; margin-left:50px;">
				<div class="tit_80 poa">
					<label id="lbUser">*적용일시</label>
				</div>
				<div class="ml_80 dib">
					<div class="input-group" data-ax5picker="txtReqDate" style="width:40%; font-size:0px; display:inline-block;" >
			            <input id="txtReqDate" type="text" class="f-cal" placeholder="yyyy/mm/dd">
			            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
			        </div>
			        <div style="width:40%; font-size:0px; display:inline-block;">
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




<!-- bootstrap

<div class="hpanel">
    <div class="panel-body" id="searchDiv">
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    	<div class="row">
		    	<div class="col-lg-1 col-md-1 col-sm-1 col-12">
		    		<label id="lblSrId" class="padding-5-top float-left">*SR-ID</label>
		    	</div>
		    	<div class="col-lg-10 col-md-10 col-sm-10 col-12" style="padding-left: 0;">
			    	<div id="cboSrId" data-ax5select="cboSrId" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		    	</div>
		    	<div class="col-lg-1 col-md-1 col-sm-1 col-12">
					<div class="float-right">
						<button id="btnSR"  class="btn btn-default">
							SR정보확인 <span class="glyphicon" aria-hidden="true"></span>
						</button>
					</div>
		    	</div>
	    	</div>
    	</div>
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    	<div class="row" style="height:5px;">
	    	</div>
	    </div>
    	<div class="col-lg-4 col-md-4 col-sm-4 col-12">
	    	<div class="row">
		    	<div class="col-lg-3 col-md-12 col-sm-12 col-12">
		    		<label id="lblSysId" class="padding-5-top float-left">*시스템</label>
		    	</div>
		    	<div class="col-lg-9 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    	<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		    	</div>
	    	</div>
    	</div>
    	<div class="col-lg-4 col-md-4 col-sm-4 col-12">
	    	<div class="row">
		    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
		    		<label id="lblRsrccd" class="padding-5-top float-left">프로그램유형</label>
		    	</div>
		    	<div class="col-lg-9 col-md-9 col-sm-9 col-12" style="padding-left: 0;">
			    	<div id="cboRsrccd" data-ax5select="cboRsrccd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
			    	<div id="cboReq" data-ax5select="cboReq" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		    	</div>
	    	</div>
    	</div>
    	<div class="col-lg-4 col-md-4 col-sm-4 col-12">
	    	<div class="row">
		    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
		    		<label id="lblRsrcName" class="padding-5-top float-left">프로그램명/설명</label>
		    	</div>
		    	<div class="col-lg-6 col-md-6 col-sm-6 col-12" style="padding-left: 0;">
		    		<input id="txtRsrcName" name="txtRsrcName" class="form-control" type="text" style="align-content:left;width:100%;"></input>
		    	</div>
		    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
					<div class="float-right">
						<button id="btnFind"  class="btn btn-default" onclick="btnFind_Click();">
							&nbsp;&nbsp;검&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;색&nbsp;&nbsp;<span class="glyphicon glyphicon-search" aria-hidden="true"> </span>
						</button>
					</div>
		    	</div>
	    	</div>
    	</div>
    </div>
</div>


<div class="hpanel">
    <div class="panel-body text-center" id="grid1Div" style="border: 0px;border-style: none;">
    	<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 30%;"></div>
    </div>
</div>

<div class="hpanel">
    <div class="panel-body" id="detailDiv" style="border: 0px;border-style: none;">
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    	<div class="row">
		    	<div class="col-lg-1 col-md-1 col-sm-1 col-12">
		    		<div class="float-left" style="padding-top:5px;padding-bottom:3px;">
	    				<input type="checkbox" class="checkbox-pie" id="chkDetail" data-label="항목상세보기" checked></input>
	   				</div>
				</div>
		    	<div class="col-lg-5 col-md-5 col-sm-5 col-12" style="padding: 0 1 0 0;">
					<div class="float-right">
						<button id="btnAdd"  class="btn btn-default" >
							추 가 <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
						</button>
					</div>
				</div>
		    	<div class="col-lg-6 col-md-6 col-sm-6 col-12" style="padding: 0 0 0 1;">
					<div class="float-left">
						<button id="btnDel"  class="btn btn-default" >
							제 거 <span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
						</button>
					</div>
				</div>
	    	</div>
    	</div>
    </div>
</div>

<div class="hpanel">
    <div class="panel-body text-center" id="grid2Div" style="border: 0px;border-style: none;">
    	<div data-ax5grid="secondGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 36%;"></div>
    </div>
</div>

<div class="hpanel">
    <div class="panel-body" id="reqDiv">
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    	<div class="row">
		    	<div class="col-lg-1 col-md-1 col-sm-1 col-12">
		    		<label id="lblSayu" class="padding-5-top float-left">*SR제목/사유</label>
		    	</div>
		    	<div class="col-lg-11 col-md-11 col-sm-11 col-12" style="padding-left: 0;">
		    		<input id="txtSayu" name="txtSayu" class="form-control" type="text" style="align-content:left;width:100%;"></input>
		    	</div>
	    	</div>
    	</div>
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    	<div class="row" style="height:5px;">
	    	</div>
	    </div>
    	<div class="col-lg-4 col-md-4 col-sm-4 col-12">
	    	<div class="row">
		    	<div class="col-lg-3 col-md-12 col-sm-12 col-12">
		    		<label id="lblReqGbn" class="padding-5-top float-left">*처리구분</label>
		    	</div>
		    	<div class="col-lg-9 col-md-9 col-sm-9 col-12" style="padding: 0;">
			    	<div id="cboReqGbn" data-ax5select="cboReqGbn" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		    	</div>
	    	</div>
    	</div>
    	<div class="col-lg-4 col-md-4 col-sm-4 col-12" id="panCal" style="visibility:hidden;">
	    	<div class="row">
		    	<div class="col-lg-2 col-md-3 col-sm-3 col-12">
		    		<label id="lblReqDate" class="padding-5-top float-left">*적용일시</label>
		    	</div>
	    		<div class="col-lg-5 col-md-12 col-sm-12 col-12" style="padding: 0;">
	    			<div class="input-group" data-ax5picker="txtReqDate" >
			            <input id="txtReqDate" type="text" class="form-control" placeholder="yyyy/mm/dd">
			            <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
			        </div>
	    		</div>
	    		<div class="col-lg-5 col-md-12 col-sm-12 col-12" style="padding: 0;">
			        
		      		<div class="input-group bootstrap-timepicker timepicker" style="width:50%; float:left;">
						<input  id="txtReqTime"  name="txtReqTime" type="text" class="form-control input-small" required="required" readonly></input>
						<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
					</div>
	    		</div>
	    	</div>
    	</div>
    	<div class="col-lg-4 col-md-4 col-sm-4 col-12">
	    	<div class="row">
		    	<div class="col-lg-9 col-md-9 col-sm-9 col-12" style="padding: 0;">
		    		<div class="float-right" style="padding-top:5px;padding-bottom:3px;">
	    				<input type="checkbox" class="checkbox-pie" id="chkBefJob" data-label="선행작업"></input>
	    				<input type="checkbox" class="checkbox-pie" id="chkSvr" data-label="버전UP만적용"></input>
	   				</div>
	   			</div>
		    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
					<div class="float-right">
						<button id="btnDiff"  class="btn btn-default" onclick="btnRequest_Click();">
							파일비교 <span class="glyphicon" aria-hidden="true" style='display:none;'></span>
						</button>
						<button id="btnRequest"  class="btn btn-default" onclick="btnRequest_Click();">
							운영배포신청 <span class="glyphicon" aria-hidden="true"></span>
						</button>
					</div>
				</div>
   			</div>
		</div>
    </div>
</div>
 -->
<c:import url="/js/ecams/common/commonscript.jsp" />
<script src="<c:url value="/scripts/bootstrap-timepicker.min.js"/>" type="text/javascript"></script>
<script type="text/javascript"	src="<c:url value="/js/ecams/apply/ApplyRequest.js"/>"></script>