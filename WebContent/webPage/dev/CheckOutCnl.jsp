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
                        	<label>*시스템</label>
                        </div>
                        <div class="ml_150">
							<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
					<!-- SR-ID -->		
                    <div class="width-50 dib tar por">
                    	<div class="tit_150 poa">
                        	<label>*SR-ID</label>
                        </div>
                        <div class="ml_150 tal">
							<div id="cboSrId" data-ax5select="cboSrId" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"  >
					    		<select data-ax-path="cboSrId"></select>
					    	</div>
						</div>
					</div>
                    <div class="width-20 dib tar por vat">
						<div class="vat poa_r">
							<button id="btnSR" class="btn_basic_s margin-5-left" disabled=true style="width:70px;">SR정보</button>
						</div>
					</div>
				</div>	
				<div class="row vat">
					
					<!-- 프로그램명/설명 -->		
                    <div class="width-80 dib">
                    	<div class="tit_150 poa" style="text-align: left;">
                        	<label>*프로그램명/설명</label>
                        </div>
                        <div class="ml_150 tal">
							<input id="txtRsrcName" type="text" placeholder="" class="width-100 dib">
						</div>
					</div>
                    <div class="width-20 dib tar por vat">
						<div class="vat dib">
							 <button id="btnSearch" class="btn_basic_s poa_r" style="width:70px;">검색</button>
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
		    <div class="az_board_basic az_board_basic_in" style="height: 39%;">
		    	<div data-ax5grid="second-grid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
			</div>	
			<!-- 게시판 E -->
		</div>
		
		<div class="row">
			<!-- 요청부서 -->
			<div class="tit_80 poa">
				<label>*신청사유</label>
			</div>
			<div class="ml_80">
				<input id="txtSayu" type="text" placeholder="" class="width-84">
				<div class='ml150 tal float-right' style="display:inline; ">
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