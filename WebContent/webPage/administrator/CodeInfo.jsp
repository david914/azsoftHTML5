<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div id="wrapper">
	<!-- Header -->
	<div id="header"></div>
	<div class="content">
		<div id="history_wrap">관리자<strong>&gt; 코드정보</strong></div>
		
		<div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="row vat">
					<div class="width-25 dib">
						<div class="tit_80 poa">
							<label>구분명</label>
						</div>
						<div class="ml_80 tit_80 poa">
							<label>코드값</label>
						</div>
					</div>
					<div class="width-45 dib">
						<div class="tit_80 poa">
							<label>코드설명</label>
						</div>
					</div>
					
					<div class="width-30 dib vat">
						<div class="vat dib" style="float: right;">
							<button id="btnJob" class="btn_basic_s mw-80">업무정보</button>
						</div>
					</div>
				
					<div class="width-25 dib">
						<div class="tit_80 poa">
							<label>대구분</label>
						</div>
						<div class="ml_80 vat">
							<input id="txtMaCode" name="txtMaCode" type="text" class="width-100">
						</div>
					</div>
					<div class="width-45 dib">
						<div class="width-100 dib vat">
							<input id="txtMaName" name="txtMaName" type="text" class="width-100">
						</div>
					</div>
					
					<div class="width-25 dib vat tar">
						<div class="tit_80 poa">
							<label>검색조건</label>
						</div>
						<div class="ml_80 vat width-50 tal">
							<div id="cboQry" data-ax5select="cboQry" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
						</div>
					</div>
					
					<div class="width-5 dib vat">
						<div class="vat dib" style="float: right;">
							<button id="btnQry" class="btn_basic_s mw-80">조회</button>
						</div>
					</div>
				
					<div class="width-25 dib">
						<div class="tit_80 poa">
							<label>소구분</label>
						</div>
						<div class="ml_80 vat">
							<input id="txtMiCode" name="txtMaCode" type="text" class="width-100">
						</div>
					</div>
					<div class="width-45 dib">
						<div class="width-100 dib vat">
							<input id="txtMiName" name="txtMaName" type="text" class="width-100">
						</div>
					</div>
					
					<div class="width-10 dib vat tar">
						<div class="tit_80 poa">
							<label>소구분순서</label>
						</div>
						<div class="ml_80 vat tal">
							<input id="txtMaCode" name="txtMaCode" type="text" class="width-100 vat dib">
						</div>
					</div>
					<div class="width-15 dib vat margin-3-top">
						<input id="optUse"  type="radio" name="radio"  value="use"/>
						<label for="optUse">사용</label>
						<input id="optNotUse" type="radio"  name="radio"  value="notUse"/>
						<label for="optNotUse">미사용</label>
					</div>
					<div class="width-5 dib vat">
						<div class="vat dib" style="float: right;">
							<button id="btnReq" class="btn_basic_s mw-80">적용</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="az_board_basic margin-10-top" style="height: 75%;">
			<div data-ax5grid="codeGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>
	</div>
</div>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/CodeInfo.js"/>"></script>
	