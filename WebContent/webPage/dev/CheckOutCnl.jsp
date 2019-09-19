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
                <div class="row por">
                	<div class="tit_60 poa">
                    	<label>*SR-ID</label>
                    </div>
                    <div class="ml_60 tal">
						<div id="cboSrId" data-ax5select="cboSrId" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:calc( 100% - 80px);"></div>						
					</div>
					<div class="vat poa_r">
						<button id="btnSR" class="btn_basic_s margin-5-left" disabled=true style="width:70px;">SR정보</button>
						<button id="btnExcelLoad" class="btn_basic_s margin-5-left" style="display:none; width:70px;">엑셀등록</button>
						<input type="file" name="excelFile" id="excelFile" style="display:none;" onchange='fileTypeCheck(this);''/>
					</div>
				</div>
				<div class="row por">	
					<!-- 시스템 -->		
	                <div class="width-40 dib vat">
	                    <label id="lbSystem" class="tit_60 poa">*시스템</label>
	                    <div class="ml_60 vat">
							<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:calc(100% - 10px);" class="dib width-100"></div>
						</div>
					</div>					
					<div class="width-60 dib vat" id="cboReqDiv" >
	                    <label id="lblProg" class="tit_120 poa" style="text-align:center;">*프로그램명/설명</label>
	                    <div class="ml_120 tal">
							<input id="txtRsrcName" name="txtRsrcName" type="text" style="width: calc(100% - 80px);"></input>
						</div>						
						<div class="vat poa_r" id="searchBox">
							 <button id="btnSearch" class="btn_basic_s" style="width:70px;">검색</button>
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
			<div class="por margin-5-top margin-5-bottom">
				<div class=""><input type="checkbox" class="checkbox-pie" id="chkDetail" data-label="체크아웃취소항목상세보기"></input></div>
				<div class="poa_r">
					<div class="vat dib">
						<button id="btnAdd" class="btn_basic_s">추가</button>
					</div>
					<div class="vat dib">
						<button id="btnDel" class="btn_basic_s">제거</button>
					</div>
				</div>
			</div>
			<!-- 게시판 E -->
		</div>
		
		<div>
			<!-- 게시판 S-->
		    <div class="az_board_basic az_board_basic_in" style="height: 39%;">
		    	<div data-ax5grid="second-grid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
			</div>	
			<!-- 게시판 E -->
		</div>
		
		<div class="row">
			<!-- 요청부서 -->
			<div class="tit_60 poa">
				<label>*신청사유</label>
			</div>
			<div class="ml_60">
				<input id="txtSayu" type="text" placeholder="" style="width:calc(100% - 101px)">
				<div class='tal float-right' style="display:inline; ">
					<button id="btnReq" class="btn_basic_s margin-5-left">체크아웃취소</button>
				</div>
			</div>
		</div>
</div>

<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
	<input type="hidden" name="srid"/>
</form>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"	src="<c:url value="/js/ecams/dev/CheckOutCnl.js"/>"></script>