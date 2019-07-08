<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-2">
		<label>디렉토리구분</label>
	</div>
	<div class="col-sm-4">
		<div id="cboPathDiv" data-ax5select="cboPathDiv" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
	</div>
	<div class="col-sm-2">
		<label>배포서버 IP Address</label>
	</div>
	<div class="col-sm-4">
		<input id="txtIp" name="txtIp" class="form-control" type="text"></input>
	</div>
	
	<div class="col-sm-2">
		<label>디렉토리명</label>
	</div>
	<div class="col-sm-4">
		<input id="txtPathName" name="txtPathName" class="form-control" type="text"></input>
	</div>
	<div class="col-sm-2">
		<label>배포서버 Port</label>
	</div>
	<div class="col-sm-4">
		<input id="txtPort" name="txtPort" class="form-control" type="number"></input>
	</div>
	
	<div class="col-sm-12">
		<button class="btn btn-default float-right" id="btnReq">등록</button>
		<button class="btn btn-default float-right" id="btnDel">폐기</button>
	</div>
</div>

<div class="row">
	<div class="col-sm-12">
		<div data-ax5grid="dirGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 50%;"></div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/configuration/DirectoryPolicyTab.js"/>"></script>