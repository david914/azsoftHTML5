<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-1">
		<label>분류유형</label>
	</div>
	<div class="col-sm-9">
		<div id="cboCattype" data-ax5select="cboCattype" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
	</div>
	<div class="col-sm-2">
		<button class="btn btn-default" id="btnReq">등록</button>
	</div>
</div>

<div class="row">
	<div class="col-sm-1">
		<label>신청구분</label>
	</div>
	<div class="col-sm-11">
		<div class="scrollBind" style="height: 65%; border: 1px dotted gray;;">
 			<ul class="list-group" id="ulReqInfo"></ul>
		</div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/ConfigurationTab6.js"/>"></script>