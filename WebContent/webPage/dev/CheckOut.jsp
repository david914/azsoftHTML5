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
				<div class="az_in_wrap checkout_tit">
					<div class="row vat">
						<!-- 시스템 -->		
	                    <div class="width-30 dib">
	                    	<div class="tit_80 poa">
	                        	<label>*시스템</label>
	                        </div>
	                        <div class="ml_80">
						 		<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
							</div>
						</div>
						<!-- SR-ID -->		
	                    <div class="width-70 dib tar por" style="text-align:left;">
	                    	<div class="tit_150 poa">
	                        	<label style="margin-left:49px;">*SR-ID</label>
	                        </div>
	                        <div class="ml_150 tal">
	                        	<div class="width-75">
									<div id="cboSrId" data-ax5select="cboSrId" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
	                        	</div>
							</div>
							<div class="vat poa_r">
								<button id="btnSR" class="btn_basic_s margin-5-left" disabled=true style="width:70px;">SR정보</button>
								<button id="btnExcelLoad" class="btn_basic_s margin-5-left" style="display:none; width:70px;">엑셀등록</button>
								<input type="file" name="excelFile" id="excelFile" style="display:none;"/>
							</div>
						</div>
					</div>
					
					<div class="row vat">
						<!-- 프로그램유형 -->		
	                    <div class="width-30 dib">
	                    	<div class="tit_80 poa">
	                        	<label>프로그램유형</label>
	                        </div>
	                        <div class="ml_80">
								<div data-ax5select="cboRsrccd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
							</div>
						</div>
						<!-- 프로그램명/설명 -->		
	                    <div class="width-70 dib tar por">
	                    	<div class="tit_150 poa">
	                        	<label>*프로그램명/설명</label>
	                        </div>
	                        <div class="ml_150 tal">
								<input id="txtRsrcName" class="width-60 dib tal" placeholder="프로그램설명 을 입력"/>
							    <div class="dib vat" style="margin-left:5px;"><input type="checkbox" class='checkbox-pie' name = 'chkbox_subnode' id ='chkbox_subnode' data-label="하위폴더 포함하여 조회" checked> </div>
							</div>						
							<div class="vat dib">
								 <button id="btnSearch" class="btn_basic_s poa_r"  style="width:70px;">검색</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="half_wrap">
				<div class="l_wrap width-20">
					<div style="overflow-y: auto; height: 331px; background-color: white;">
						<ul id="treeDemo" class="ztree"></ul>				
					</div>
				</div>
				<div class="r_wrap width-80">
					<!-- 게시판 S-->
				    <div class="az_board_basic az_board_basic_in" style="height:37%">
				    	<div data-ax5grid="first-grid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" id="fileGrid" style="height:100%"></div>
					</div>	
					<div class="por margin-5-top margin-10-bottom">
						<div style="margin-left:5px;"><input type="checkbox" class='checkbox-pie' id='chkDetail' data-label="체크아웃항목상세보기"></div>
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
				<div class="row">
					<div class="margin-10-top">
						<!-- 게시판 S-->
					    <div class="az_board_basic az_board_basic_in" style="height:39%">
					    	<div data-ax5grid="second-grid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40, showRowSelector:true}" id="requestGrid" style="height:100%"></div>
						</div>	
						<!-- 게시판 E -->
					</div>
				</div>
			</div>
		<div class="row">
			<!-- 요청부서 -->
			<div class="tit_80 poa">
				<label>*신청사유</label>
			</div>
			<div class="ml_80">
				<input id="reqText" type="text" placeholder="" class="width-84">
				<div class='ml150 tal float-right' style="display:inline; ">
					<button id="btnDiff" class="btn_basic_s margin-5-left" style='display:none;'>파일비교</button>
					<button id="btnReq" class="btn_basic_s margin-5-left">체크아웃</button>
				</div>
			</div>
		</div>
	</div>

<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/dev/CheckOut.js"/>"></script>
