<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
		
<div class="az_search_wrap sm-row">
	<div class="az_in_wrap por">
		<!-- 시스템 -->		
		<div class="width-23 dib">
			<label class="tit_80 poa">등록구분</label>
			<div class="ml_80">
				<div id="cboBldGbn" data-ax5select="cboBldGbn" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
			</div>
		</div>
	    <!-- 프로그램종류 -->
		<div class="width-77 dib vat">
			<label class="tit_80 poa margin-5-left">유형구분</label>
			<div class="ml_80">
				<div class="dib vat width-80">
					<div id="cboBldCd" data-ax5select="cboBldCd" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
				</div>
				<div class="dib vat float-right">
					<button class="btn_basic_s dib margin-5-left" id="btnDel">유형삭제</button>
				</div>
			</div>	
		</div>
	    <!-- 수행명령 -->
		<div class="sm-row vat">
			<label class="tit_80 poa">수행명령</label>
			<div class="ml_80">
				<input id="txtComp" type="text" class="width-100">
			</div>
		</div>
		<div class="sm-row por">
	   		<!-- 순서 -->
			<div class="vat width-23 dib">
				<label class="tit_80 poa">순서</label>
				<div class="ml_80">
					<input id="txtSeq" name="txtSeq" type="text" class="width-100">
				</div>
			</div>
		    <!-- 오류MSG -->
			<div class="vat width-40 dib">
				<label class="tit_80 poa margin-5-left">오류MSG</label>
				<div class="ml_80">
					<input id="txtErrMsg" type="text" class="width-100">
				</div>
			</div>
			<!-- 버튼 -->				
			<div class="poa_r">
				<input type="checkbox" class="checkbox-view" id="chkView" data-label="사용자조회"/>
				<button id="btnScr" class="btn_basic_s margin-10-right">추가</button>
				<button id="btnDelScr" class="btn_basic_s margin-10-right">제거</button>
				<button id="btnReq" class="btn_basic_s margin-10-right">저장</button>
				<button id="btnCopy" class="btn_basic_s">새이름저장</button>		
			</div>		
		</div>
	</div>
</div>

<div class="az_board_basic" style="height: 35%">
	<div data-ax5grid="editScriptGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
</div>	

<div class="az_search_wrap sm-row">
	<div class="az_in_wrap por">
		<!-- 등록구분 -->		
		<div class="width-30 dib">
			<label id="lbUser" class="tit_80 poa">등록구분</label>
			<div class="ml_80">
				<div id="cboBldGbnB" data-ax5select="cboBldGbnB" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
			</div>
		</div>
		<div class="width-65 dib vat">
			<label class="tit_80 poa margin-10-left">수행명령</label>
			<div class="ml_80">
				<input id="txtOrder" class="width-80">
				<button id="btnQry" class="btn_basic_s margin-5-left">조회</button>
			</div>
		</div>
	</div>
</div>

<div class="az_board_basic" style="height: 40%">
	<div data-ax5grid="scriptGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
</div>	

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/buildrelease/TypeRegistrationTab.js"/>"></script>