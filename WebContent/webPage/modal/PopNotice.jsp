<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />




<div class="pop-header">
	<div>
		<label id="lbSub">공지사항 등록</label>
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
			<label id="lbSub">제목</label>
			<input id="txtTitle" name="txtTitle" class="form-control" type="text"></input>
		</div>
	</div>
	<!--CM_TITLE -->
	<div class="row">
		<div>
			<textarea id="textareaContents" name="textareaContents" class="form-control margin-15-top" rows="12"></textarea>
		</div>
	</div>
	<div class="row">
		<div class="dib margin-3-top">
			<input type="checkbox" class="checkbox-pop" id="chkPop" data-label="팝업공지"/>
		</div>
		<div class="dib">
			<div id="divPicker" class="az_input_group" data-ax5picker="basic">
	            <input id="dateStD" name="dateStD" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
	            <span class="sim">∼</span>
	            <input id="dateEdD" name="dateEdD" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
	            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
			</div>
		</div>
	</div>
	
	<div class="row">
		<div class="l_wrap">
			<button id="btnFile" name="btnFile" class="btn_basic">파일첨부</button>
		</div>
		<div class="r_wrap">
			<div>
				<button id="btnRem" name="btnRem" class="btn_basic dib">삭제</button>
				<button id="btnReg" name="btnReg" class="btn_basic dib">등록</button>
				<button id="btnClo" name="btnClo" class="btn_basic dib">닫기</button>
			</div>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/FileUp.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/ecams/modal/PopNotice.js"/>"></script>