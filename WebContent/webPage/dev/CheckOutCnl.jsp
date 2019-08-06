<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
 <!-- history S-->
        <div id="history_wrap">개발 <strong>&gt; 체크아웃취소</strong></div>
        <!-- history E-->      
        <!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap checkout_tit">
				<div class="row vat">
					<!-- 시스템 -->		
                    <div class="width-30 dib">
                    	<div class="tit_150 poa">
                        	<label id="lbUser">*시스템</label>
                        </div>
                        <div class="ml_150">
							<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
					<!-- SR-ID -->		
                    <div class="width-50 dib tar por">
                    	<div class="tit_150 poa">
                        	<label id="lbUser">*SR-ID</label>
                        </div>
                        <div class="ml_150 tal">
							<div id="cboSrId" data-ax5select="cboSrId" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"  >
					    		<select data-ax-path="cboSrId"></select>
					    	</div>
						</div>
					</div>
                    <div class="width-20 dib tar por vat">
						<div class="vat poa_r">
							<button id="btnSR" class="btn_basic_s margin-5-left" >SR정보</button>
						</div>
					</div>
				</div>	
				<div class="row vat">
					
					<!-- 프로그램명/설명 -->		
                    <div class="width-80 dib">
                    	<div class="tit_150 poa" style="text-align: left;">
                        	<label id="lbUser">*프로그램명/설명</label>
                        </div>
                        <div class="ml_150 tal">
							<input id="txtRsrcName" type="text" placeholder="" class="width-100 dib">
						</div>
					</div>
                    <div class="width-20 dib tar por vat">
						<div class="vat dib">
							 <button id="btnSearch" class="btn_basic_s poa_r" >검색</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--검색E-->
		<div>
			<!-- 게시판 S-->
		    <div class="az_board_basic az_board_basic_in" style="height: 37%;">
		    	<div data-ax5grid="first-grid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
			</div>	
			<div class="por margin-5-top margin-10-bottom">
				<div class=""><input type="checkbox" class="checkbox-pie" id="chkDetail" data-label="체크아웃취소항목상세보기"></input></div>
				<div class="poa_r">
					<div class="vat dib">
						<button id="btnAdd" class="btn_basic_s margin-5-left">추가</button>
					</div>
					<div class="vat dib">
						<button id="btnDel" class="btn_basic_s margin-5-left">제거</button>
					</div>
				</div>
			</div>
			<!-- 게시판 E -->
		</div>
		
		<div>
			<!-- 게시판 S-->
		    <div class="az_board_basic az_board_basic_in" style="height: 38%;">
		    	<div data-ax5grid="second-grid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
			</div>	
			<!-- 게시판 E -->
		</div>
		
		<div class="row">
			<!-- 요청부서 -->
			<div class="tit_80 poa">
				<label id="lbUser">*신청사유</label>
			</div>
			<div class="ml_80">
				<input id="txtSayu" type="text" placeholder="" class="width-84">
				<div class='ml150 tal float-right' style="display:inline; ">
					<button id="btnReq" class="btn_basic_s margin-5-left">체크아웃취소</button>
				</div>
			</div>
		</div>
<!-- 
<div class="hpanel">
    <div class="panel-body" id="searchDiv">
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    	<div class="row">
		    	<div class="col-lg-1 col-md-1 col-sm-1 col-12">
		    		<label id="lblSrId" class="padding-5-top float-left">*SR-ID</label>
		    	</div>
		    	<div class="col-lg-10 col-md-10 col-sm-10 col-12" style="padding-left: 0;">
			    	<div id="cboSrId" data-ax5select="cboSrId" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"  >
			    		<select data-ax-path="cboSrId"></select>
			    	</div>
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
		    	</div>
		    	<div class="col-lg-9 col-md-9 col-sm-9 col-12" style="padding-left: 0;">
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
						<button id="btnSearch"  class="btn btn-default" >
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
    	<div data-ax5grid="first-grid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 30%;"></div>
    </div>
</div>

<div class="hpanel">
    <div class="panel-body" id="detailDiv" style="border: 0px;border-style: none;">
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    	<div class="row">
		    	<div class="col-lg-1 col-md-1 col-sm-1 col-12">
		    		<div class="float-left" style="padding-top:5px;padding-bottom:3px;">
	    				<input type="checkbox" class="checkbox-pie" id="chkDetail" data-label="항목상세보기"></input>
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
    	<div data-ax5grid="second-grid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 36%;"></div>
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
		    	</div>
		    	<div class="col-lg-9 col-md-9 col-sm-9 col-12" style="padding: 0;">
		    	</div>
	    	</div>
    	</div>
    	<div class="col-lg-4 col-md-4 col-sm-4 col-12" id="panCal" style="visibility:hidden;">
	    	<div class="row">
		    	<div class="col-lg-2 col-md-3 col-sm-3 col-12">
		    	</div>
	    		<div class="col-lg-5 col-md-12 col-sm-12 col-12" style="padding: 0;">
	    		</div>
	    		<div class="col-lg-5 col-md-12 col-sm-12 col-12" style="padding: 0;">
	    		</div>
	    	</div>
    	</div>
    	<div class="col-lg-4 col-md-4 col-sm-4 col-12">
	    	<div class="row">
		    	<div class="col-lg-9 col-md-9 col-sm-9 col-12" style="padding: 0;">
	   			</div>
		    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
					<div class="float-right">
						<button id="btnReq"  class="btn btn-default" >
							체크아웃취소 <span class="glyphicon" aria-hidden="true"></span>
						</button>
					</div>
				</div>
   			</div>
		</div>
    </div>
</div>
 -->
</div>
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
	<input type="hidden" name="srid"/>
</form>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"	src="<c:url value="/js/ecams/dev/CheckOutCnl.js"/>"></script>