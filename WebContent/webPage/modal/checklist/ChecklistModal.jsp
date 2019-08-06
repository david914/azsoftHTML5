<!--  
	* 화면명: 체크리스트항목등록 모달
	* 화면호출: 체크리스트 메뉴트리 우클릭 -> 항목등록/수정
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<body style="width: 100% !important; min-width: 0px !important">
	
	<div class="pop-header">
		<div>
			<label id="lbSub" class="margin-5-left">항목명 입력</label>
		</div>
		<div>
			<button type="button" class="close" aria-label="닫기">
			  <span aria-hidden="true">&times;</span>
			</button>
		</div> 
	</div>
	<div style="padding: 5px;">
		<div class="container-fluid">
			<!--CM_TITLE -->
			<div class="row">
				<div>
					<textarea id="content" name="content" class="form-control" rows="12"></textarea>
				</div>
			</div>
			<div class="">
				<div class="dib margin-3-top margin-5-left">
					<input id="checkEssential" tabindex="8" type="checkbox" value="optCkOut" style="margin-top: 5px;" checked="checked" name="checkEssential"/>
					<label for="checkEssential" style="margin-top: -5px;">&nbsp;필수항목</label>
				</div>
			</div>
			
			<div class="tac">
				<div>
					<button class="btn_basic_s" id="btnQry">확인</button>
					<button class="btn_basic_s" id="btnCancel">취소</button>
				</div>
			</div>
		</div>
	</div>
</body>
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/checklist/checklistModal.js"/>"></script>
