<!-- 
화면 명: 테스트결과서
화면호출:
1) 현황 화면-> 상세 팝업 -> 테스트결과서 버튼
 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<body style="width: 100% !important; min-width: 0px !important">
<div class="pop-header">
	<div>
		<label>테스트결과서 확인</label>
	</div>
	<div>
		<button type="button" class="close" aria-label="닫기" id="btnExit">
		  <span aria-hidden="true">&times;</span>
		</button>
	</div> 
</div>

<div class="container-fluid pop_wrap">
	<div class="row">
		<div>
			<div class="az_board_basic" style="height:75%">
		    	<div data-ax5grid="grdReqDoc" style="height: 100%;"></div>
			</div>
		</div>
	</div>
	<div class="row tac">
		<button class="btn_basic margin-5-left" id="btnClose">닫기</button>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/request/RequestDocModal.js"/>"></script>