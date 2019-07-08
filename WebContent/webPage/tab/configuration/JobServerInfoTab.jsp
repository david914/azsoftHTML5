<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-2">
		<label>작업구분</label>
	</div>
	<div class="col-sm-2">
		<div class ="col-sm-5">
			<label>IP Address</label>
		</div>
		<div class ="col-sm-7">
			<input id="txtIp" name="txtIp" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-2">
		<div class ="col-sm-5">
			<label>계정</label>
		</div>
		<div class ="col-sm-7">
			<input id="txtUser" name="txtUser" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-6">
		<div class ="col-sm-3">
			<label>대상확장자</label>
		</div>
		<div class ="col-sm-9">
			<input id="txtExeName" name="txtExeName" class="form-control" type="text"></input>
		</div>
	</div>
</div>	

<div class="row">
	<div class="col-sm-2">
		<div id="cboJobDiv" data-ax5select="cboJobDiv" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
	</div>
	<div class="col-sm-2">
		<div class ="col-sm-5">
			<label>Port</label>
		</div>
		<div class ="col-sm-7">
			<input id="txtPort" name="txtPort" class="form-control" type="number"></input>
		</div>
	</div>
	<div class="col-sm-2">
		<div class ="col-sm-5">
			<label>비밀번호</label>
		</div>
		<div class ="col-sm-7">
			<input id="txtPass" name="txtPass" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-6">
		<div class ="col-sm-3">
			<label>Agent경로</label>
		</div>
		<div class ="col-sm-3">
			<input id="txtAgent" name="txtAgent" class="form-control" type="text"></input>
		</div>
		<div class="col-sm-6">
			<input type="checkbox" class="checkbox-workserver" id="chkStop" data-label="장애"/>
			<button class="btn btn-default" id="btnReq">등록</button>
			<button class="btn btn-default" id="btnDel">폐기</button>
		</div>
	</div>
</div>
	
<div class="row">
	<div class="col-sm-12">
		<div data-ax5grid="workGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 50%;"></div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/configuration/JobServerInfoTab.js"/>"></script>