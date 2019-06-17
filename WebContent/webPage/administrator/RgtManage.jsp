<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-5">
		<div class="col-sm-2">
			<label>직무구분</label>
		</div>
		<div class="col-sm-8">
			<div id="cboDuty" data-ax5select="cboDuty" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		</div>
		<div class="col-sm-2">
			<input type="checkbox" class="checkbox-rgt" id="chkAll" data-label="전체선택"/>
		</div>
	</div>
	<div class="col-sm-7">
		<div class="col-sm-8">
			<label id="lbl">메뉴체계</label>
		</div>
		<div class="col-sm-4">
			<button class="btn btn-default" id="btnPlus">
				<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
			</button>
			<button class="btn btn-default" id="btnMinus">
				<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
			</button>
			<button class="btn btn-default" id="btnReq">적용</button>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-sm-5">
		<div class="scrollBind" style="height: 80%; border: 1px dotted gray;">
			<ul id="dutyUlInfo" class="ztree"></ul>
		</div>
	</div>
	<div class="col-sm-7">
		<div class="scrollBind" style="height: 80%; border: 1px dotted gray;">
			<ul id="tvMenu" class="ztree"></ul>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/RgtManage.js"/>"></script>