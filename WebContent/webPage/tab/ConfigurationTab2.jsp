<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-2">
		<label>삭제대상디렉토리구분</label>
	</div>
	<div class="col-sm-10">
		<div id="cboPathDiv" data-ax5select="cboPathDiv" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
	</div>
	
	<div class="col-sm-2">
		<label>삭제주기</label>
	</div>
	<div class="col-sm-5">
		<div class="col-sm-6">
			<input id="txtDelCycle" name="txtDelCycle" class="form-control" type="number"></input>
		</div>
		<div class="col-sm-6">
			<div id="cboDelCycle" data-ax5select="cboDelCycle" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		</div>
		
	</div>
	<div class="col-sm-5">
		<button class="btn btn-default" id="btnReq">등록</button>
		<button class="btn btn-default" id="btnDel">폐기</button>
	</div>
</div>

<div class="row">
	<div class="col-sm-12">
		<div data-ax5grid="delCycleGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 50%;"></div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/ConfigurationTab2.js"/>"></script>