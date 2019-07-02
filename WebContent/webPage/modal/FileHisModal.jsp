<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />


<div class="pop-header">
	<div>
		<label id="lbSub">대사기록조회</label>
	</div>
	<div>
		<button type="button" class="close" aria-label="닫기" onclick="popClose()">
		  <span aria-hidden="true">&times;</span>
		</button>
	</div> 
</div>
<div class="container-fluid">
	<div class="row">
		<div>
			<div class="az_board_basic" style="height: 87%;">
				<div data-ax5grid="fileHisGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
			</div>
		</div>
	</div>
	
	
	<div class="row">
		<div class="l_wrap">
			<label>대사 합계건 조회 방법:기록건을 선택한 후 마우스 오른쪽 버튼 클릭 또는 더블클릭</label>
		</div>
		<div class="r_wrap">
			<div>
				<button id="btnClose" name="btnClose" class="btn_basic dib">닫기</button>
			</div>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/FileHisModal.js"/>"></script>
