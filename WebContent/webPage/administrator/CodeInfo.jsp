<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<!-- Header -->
<div id="header"></div>

<div id="wrapper">
    <div class="content">    	
        <!-- history S-->
        <div id="history_wrap">관리자<strong>&gt; 코드정보</strong></div>
        <!-- history E-->    
             
		<div class="half_wrap">
			<div class="l_wrap dib width-60 vat"><!--ver2-->
				<label class="width-7">구분명</label>
				<label class="width-30">코드값</label>
				<label class="width-60">코드설명</label>
			</div>
			<div class="r_wrap dib width-40 vat"><!--ver2-->
				<button id="btnJob" name="btnJob" class="width-10 float-right btn_basic_s" style="cursor: pointer;">업무정보</button>
			</div>
			
			<div class="l_wrap dib width-60 vat"><!--ver2-->
				<label class="width-7">대구분</label>
				<input id="txtMaCode" name="txtMaCode" type="text" class="width-30">
				<input id="txtMaName" name="txtMaName" type="text" class="width-60">
			</div>
			<div class="r_wrap dib width-40 vat"><!--ver2-->
				<label class="width-10">검색조건</label>
				<div class="width-65 dib">
					<div id="cboQry" data-ax5select="cboQry" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
				</div>
				<button id="btnQry" name="btnQry" class="width-10 float-right btn_basic_s" style="cursor: pointer;">조회</button>
			</div>
			
			<div class="l_wrap dib width-60 vat"><!--ver2-->
				<label class="width-7">소구분</label>
				<input id="txtMiCode" name="txtMiCode" type="text" class="width-30">
				<input id="txtMiName" name="txtMiName" type="text" class="width-60">
			</div>
			
			<div class="r_wrap dib width-40 vat"><!--ver2-->
				<label class="width-10">소구분순서</label>
				<div class="width-65 dib">
					<input id="txtSeq" name="txtSeq" type="text" class="width-60">
					<div class="width-30 dib">
						<input id="optUse"  type="radio" name="radio"  value="use"/>
						<label for="optUse">사용</label>
						<input id="optNotUse" type="radio"  name="radio"  value="notUse"/>
						<label for="optNotUse">미사용</label>
					</div>
				</div>
				<button id="btnReq" name="btnReq" class="width-10 float-right btn_basic" style="cursor: pointer;">적용</button>
			</div>
		</div>
		<div class="az_board_basic margin-10-top" style="height: 75%;">
			<div data-ax5grid="codeGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/CodeInfo.js"/>"></script>
	