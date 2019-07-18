<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<div id="wrapper">
	<!-- Header -->
	<div class="content">    	
		<div id="history_wrap">보고서<strong>&gt; 파일대사예외등록현황</strong></div>
	     
		<div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="row vat">
					<div class="width-25 dib">
						<div class="tit_80 poa">
							<label>적용구분</label>
						</div>
						<div class="ml_80">
							<div id="cboDeploy" data-ax5select="cboDeploy" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
						</div>
					</div>
					<div class="width-25 dib tar">
						<div class="tit_80 poa">
							<label>시스템</label>
						</div>
						<div class="ml_80 tal">
							<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
						</div>
					</div>
			
					<div class="width-50 dib tar">
						<div class="tit_150 poa">
							<label>프로그램종류</label>
						</div>
						<div class="ml_150 tal">
							<div id="cboPrgDiv" data-ax5select="cboPrgDiv" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
						</div>
					</div>
				</div>
		
				<div class="row vat">
					<div class="width-50 dib">
						<div class="tit_80 poa">
							<label>프로그램명</label>
						</div>
						<div class="ml_80">
							<input id="txtPrgName" type="text" class="width-100">
						</div>
						<div class="vat dib"></div>
					</div>
					<div class="width-50 dib tar vat">
						<div class="tit_150 poa">
							<label>프로그램경로</label>
						</div>
						<div class="ml_150 tal vat">
							<div id="cboDir" data-ax5select="cboDir" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
							<input id="txtDir" type="text" class="width-100 vat" placeholder="프로그램 경로 직접입력">
						</div>
					</div>
				</div>
			
				<div class="row vat">
					<div class="width-50 dib">
						<div class="tit_80 poa">
							<label>사유구분</label>
						</div>
						<div class="ml_80">
							<div id="cboSayu" data-ax5select="cboSayu" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
						</div>
					</div>
					<div class="width-50 dib vat">
						<div>
							<div class="vat dib" style="float: right;">
								<button id="btnQry" class="btn_basic_s">조회</button>
							</div>
							<div class="vat dib" style="float: right;">
								<button id="btnDel" class="btn_basic_s">삭제</button>
							</div>
							<div class="vat dib" style="float: right;">
								<button id="btnReq" class="btn_basic_s">등록</button>
							</div>
							<div class="vat dib" style="float: right;">
								<button id="btnExcel" class="btn_basic_s">엑셀저장</button>
							</div>
						</div>
					</div>
				</div>
		
				<div class="row vat">
					<div class="width-50 dib">
						<div class="tit_80 poa">
							<label>등록사유</label>
						</div>
						<div class="ml_80">
							<input id="txtSayu" type="text" class="width-100">
						</div>
						<div class="vat dib"></div>
					</div>
					<div class="width-50 dib vat tar">
						<div class="tit_80" style="float: right;">
							<label id="lblCnt">총 0 건</label>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	      
		<div class="az_board_basic margin-10-top" style="height: 68%;">
			<div data-ax5grid="fileGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>
	</div>
</div>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/FileExceptionRegReport.js"/>"></script>
	