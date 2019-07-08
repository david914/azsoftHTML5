<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-2">
		<label>시간구분</label>
	</div>
	<div class="col-sm-10">
		<div id="cboTimeDiv" data-ax5select="cboTimeDiv" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
	</div>
	<div class="col-sm-2">
		<label>운영시간</label>
	</div>
	<div class="col-sm-6">
		<div class="col-sm-5">
			<div class='input-group date'>
    			<input id="txtTimeSt" type='text' class="form-control" />
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-time"></span>
                </span>
    		</div>
		</div>
		<div class="col-sm-2">
			<label>~</label>
		</div>
		<div class="col-sm-5">
			<div class='input-group date'>
    			<input id="txtTimeEd" type='text' class="form-control" />
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-time"></span>
                </span>
    		</div>
		</div>
	</div>
	<div class="col-sm-4">
		<button class="btn btn-default" id="btnReq">등록</button>
		<button class="btn btn-default" id="btnDel">폐기</button>
	</div>
</div>

<div class="row">
	<div class="col-sm-12">
		<div data-ax5grid="operTimeGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 50%;"></div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/configuration/OperTimeManageTab.js"/>"></script>