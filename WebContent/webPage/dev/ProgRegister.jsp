<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp"/>

<div class="row" style="padding-top: 5px;">
	<div class="col-sm-4">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">시스템</label>
		
			<div class="form-group">
            	<div id="selSystem" data-ax5select="selSystem" data-ax5select-config="{}"></div>
        	</div>
		</div>
	</div>
	
	<div class="col-sm-4">
		<div class="col-sm-6">
			<label style="padding-top: 5px;">프로그램종류</label>
		
			<div class="form-group">
            	<div id="selJawon" data-ax5select="selJawon" data-ax5select-config="{}"></div>
        	</div>
		</div>
		<div class="col-sm-6" style="padding-top: 25px;">
			<input id="txtExeName" name="txtExeName" type="text"></input>
		</div>
	</div>
	
	<div class="col-sm-4">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">업무</label>
		
			<div class="form-group">
            	<div id="selJob" data-ax5select="selJob" data-ax5select-config="{}"></div>
        	</div>
		</div>
	</div>
</div>

<div class="row" style="padding-top: 5px;">
	<div class="col-sm-8">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">프로그램명</label>
			<input id="txtRsrcName" name="txtRsrcName" type="text"></input>
		</div>
	</div>
	
	<div class="col-sm-4">
		<button class="btn btn-default" id="btnRegist">등록</button>
		<button class="btn btn-default" id="btnDevRep">개발영역연결등록</button>
	</div>
</div>

<div class="row" style="padding-top: 5px;">
	<div class="col-sm-8">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">프로그램설명</label>
			<input id="txtStory" name="txtStory" type="text"></input>
		</div>
	</div>
	
	<div class="col-sm-4">
		<button class="btn btn-default" id="btnLocalRep">로컬영역연결등록</button>
	</div>
</div>

<div class="row" style="padding-top: 5px;">
	<div class="col-sm-8">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">프로그램경로</label>
			<div class="form-group">
            	<div id="selDir" data-ax5select="selDir" data-ax5select-config="{}"></div>
        	</div>
		</div>
	</div>
	
	<div class="col-sm-4">
		<button class="btn btn-default" id="btnInit">초기화</button>
		<button class="btn btn-default" id="btnQry">조회</button>
		<button class="btn btn-default" id="btnDel">삭제</button>
	</div>
</div>

<div class="row" style="padding-top: 5px;">
	<div class="col-sm-8">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">SR-ID</label>
			<div class="form-group">
            	<div id="selSRID" data-ax5select="selSRID" data-ax5select-config="{}"></div>
        	</div>
		</div>
	</div>
</div>

<div class="row" style="padding-top: 5px; padding-left: 30px;">
	<label id="lbTotalCnt" name="lbTotalCnt" style="padding-top: 5px; text-align: right;">총0건</label>
</div>

<!-- 프로그램 그리드 -->
<div class="row" style="padding-top: 5px;">
	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
		<div data-ax5grid="progGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 50%;"></div>
	</div>
</div>

<form name="popPam" id="popPam" method="post">
	<INPUT type="hidden" name="UserId" id="UserId"> 
	<INPUT type="hidden" name="SysCd" id="SysCd">
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/dev/ProgRegister.js"/>"></script>