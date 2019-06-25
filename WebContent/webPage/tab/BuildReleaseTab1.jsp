<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-1">
		<label>서버종류</label>
	</div>
	<div class="col-sm-4">
		<div 	id="cboBldGbn" data-ax5select="cboBldGbn" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
		</div>
	</div>
	<div class="col-sm-1">
		<label>유형구분</label>
	</div>
	<div class="col-sm-4">
		<div 	id="cboBldCd" data-ax5select="cboBldCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
		</div>
	</div>
	<div class="col-sm-2">
		<button class="btn btn-default" id="btnDel">
			유형삭제 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
	</div>
</div>

<div class="row">
	<div class="col-sm-1">
		<label>수행명령</label>
	</div>
	<div class="col-sm-11">
		<input id="txtComp" name="txtComp" class="form-control" type="text"></input>
	</div>
</div>

<div class="row">
	<div class="col-sm-1">
		<label>순서</label>
	</div>
	<div class="col-sm-3">
		<input id="txtSeq" name="txtSeq" class="form-control" type="number"></input>
	</div>
	<div class="col-sm-1">
		<label>오류MSG</label>
	</div>
	<div class="col-sm-3">
		<input id="txtErrMsg" name="txtErrMsg" class="form-control" type="text"></input>
	</div>
	
	<div class="col-sm-4">
		<input type="checkbox" class="checkbox-view" id="chkView" data-label="사용자조회"/>
		<button class="btn btn-default" id="btnScr">
			추가 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
		<button class="btn btn-default" id="btnDelScr">
			제거 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
		<button class="btn btn-default" id="btnReq">
			스크립트저장 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
		<button class="btn btn-default" id="btnCopy">
			새이름저장 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
	</div>
</div>
<div class="row">
	<div class="col-sm-12">
		<div data-ax5grid="editScriptGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 35%;"></div>
	</div>
</div>

<div class="row">
	<div class="col-sm-1">
		<label id="lblSvr">등록구분</label>
	</div>
	<div class="col-sm-3">
		<div 	id="cboBldGbnB" data-ax5select="cboBldGbnB" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
		</div>
	</div>
	<div class="col-sm-1">
		<label id="lblSvr">수행명령</label>
	</div>
	<div class="col-sm-5">
		<input id="txtOrder" name="txtOrder" class="form-control" type="text"></input>
	</div>
	<div class="col-sm-2">
		<button class="btn btn-default" id="btnQry">
			조회 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
	</div>
</div>

<div class="row">
	<div class="col-sm-12">
		<div data-ax5grid="scriptGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 45%;"></div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/BuildReleaseTab1.js"/>"></script>