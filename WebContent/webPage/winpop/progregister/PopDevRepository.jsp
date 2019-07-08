<!--  
	* 화면명: 개발영역연결등록
	* 화면호출: 프로그램등록 -> 개발영역연결등록 버튼
-->

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>

<c:import url="/webPage/common/common.jsp"/>

<head>
	<title>개발영역연결등록</title>
</head>

<% 
	String UserId = request.getParameter("UserId"); 
    String SysCd = request.getParameter("SysCd"); 
%> 

<body>
<div class="row" style="padding-top: 5px;">
	<div class="col-sm-4">
		<div class="col-sm-6">
			<label style="padding-top: 5px;">시스템</label>
		
			<div class="form-group">
            	<div id="selSystem" data-ax5select="selSystem" data-ax5select-config="{}"></div>
        	</div>
		</div>
	</div>
	
	<div class="col-sm-4">
		<div class="col-sm-8">
			<label style="padding-top: 5px;">기준디렉토리</label>
		
			<div class="form-group">
            	<div id="selDir" data-ax5select="selDir" data-ax5select-config="{}"></div>
        	</div>
		</div>
		
		<button class="btn btn-default" id="btnQry">디렉토리조회</button>
	</div>
</div>

<div class="row" style="padding-top: 5px;">
	<div class="col-sm-4">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">서버선택</label>
		
			<div class="form-group">
            	<div id="selSvr" data-ax5select="selSvr" data-ax5select-config="{}"></div>
        	</div>
		</div>
	</div>
	
	<div class="col-sm-4">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">추출대상확장자</label>
			<input id="txtExe" name="txtExe" type="text"/>
		</div>
	</div>
</div>

<div class="row" style="padding-top: 5px;">
	<div class="col-sm-4">
		<div class="col-lg-12 col-md-12 col-sm-12 col-12">
			<label><input type="checkbox" id="chkAll"/>하위폴더포함조회</label>
		</div>	
	</div>
	
	<div class="col-sm-8">
		<label style="padding-top: 5px;">추출제외확장자</label>
		<input id="txtNoExe" name="txtNoExe" type="text"/>
	</div>
</div>


<div class="row" style="padding-top: 5px;">
	<!-- 디렉토리 트리 -->
	<div class="col-sm-3">
		<div class="scrollBind" style="height: 495px; border: 1px dotted gray;">
			<ul id="treeDir" class="ztree"></ul>
		</div>
	</div>
	
	<!-- 프로그램목록 그리드 -->
	<div class="col-sm-9">
		<div data-ax5grid="proglistGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 495px;"></div>
	</div>
</div>

<div class="row" style="padding-top: 5px;">
	<div class="col-sm-4">
		<label style="padding-top: 5px;">프로그램종류</label>
	
		<div class="form-group">
           	<div id="selJawon" data-ax5select="selJawon" data-ax5select-config="{}"></div>
       	</div>
	</div>
	
	<div class="col-sm-2" style="padding-top: 25px;">
		<input id="txtExeName" name="txtExeName" type="text"></input>
	</div>
	
	<div class="col-sm-4">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">업무</label>
		
			<div class="form-group">
            	<div id="selJob" data-ax5select="selJob" data-ax5select-config="{}"></div>
        	</div>
		</div>
	</div>
	
	<div class="col-sm-2">
		<button class="btn btn-default" id="btnInit">초기화</button>
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
		<button class="btn btn-default" id="btnExcel">엑셀저장</button>
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
	
	<div class="col-sm-4">
		<button class="btn btn-default" id="btnRegist">등록</button>
	</div>
</div>

<input type=hidden name="UserId" id="UserId" value=<%=UserId%>>
<input type=hidden name="SysCd" id="SysCd" value=<%=SysCd%>>

<div id="rMenu"> 
 	<ul> 
 		<li id="contextmenu" onclick="contextmenu_click();">파일추출</li> 
 	</ul> 
</div>

</body> 


<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/winpop/progregister/PopDevRepository.js"/>"></script>