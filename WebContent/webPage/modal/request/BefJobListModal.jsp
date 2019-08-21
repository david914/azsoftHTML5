<!-- 
화면 명: 선/후행작업확인
화면호출:
1) 현황 화면 -> 체크인상세 -> 선후행작업확인 버튼
 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<style>
.fontStyle-ing {
	color: #0000FF;
}
.fontStyle-cncl {
	color: #FF0000;
}
.fontStyle-eror {
	color: #FF00FF;
}
</style>

<c:import url="/webPage/common/common.jsp" />

<body style="width: 100% !important; min-width: 0px !important">
<div class="pop-header">
	<div>
		<label>선/후행 작업확인</label>
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
		    	<div data-ax5grid="grdBefJob" style="height: 100%;"></div>
			</div>
		</div>
	</div>
	<div class="row tac">
		<button class="btn_basic" id="btnBefJob">선행작업연결</button>
		<button class="btn_basic margin-5-left" id="btnClose">닫기</button>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/request/BefJobListModal.js"/>"></script>