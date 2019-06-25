<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-2">
		<label>SMS발신번호</label>
	</div>
	<div class="col-sm-2">
		<input id="txtSMSSend" name="txtSMSSend" class="form-control" type="text"></input>
	</div>
	<div class="col-sm-2">
		<label>발신사용자</label>
	</div>
	<div class="col-sm-2">
		<input id="txtUser" name="txtUser" class="form-control" type="text"></input>
	</div>
	<div class="col-sm-2">
		<div id="cboUser" data-ax5select="cboUser" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
	</div>
	<div class="col-sm-2">
		<button class="btn btn-default" id="btnReqUser">등록</button>
	</div>
</div>	

<div class="row">
	<div class="col-sm-4">
		<label>신청구분</label>
		<input type="checkbox" class="checkbox-noti float-right" id="chkAll" data-label="전체선택"/>
	</div>
	<div class="col-sm-8">
		<label>알림구분</label>
	</div>
</div>

<div class="row">
	<div class="col-sm-4">
		<div class="scrollBind" style="height: 25%; border: 1px dotted gray;;">
  			<ul class="list-group" id="ulReqInfo"></ul>
 		</div>
	</div>
	<div class="col-sm-4">
		<div class="scrollBind" style="height: 25%; border: 1px dotted gray;;">
  			<ul class="list-group" id="ulNotiInfo"></ul>
 		</div>
	</div>
	<div class="col-sm-4">
		<div class="col-sm-2">
			<label>업무중</label>
		</div>
		<div class="col-sm-10">
			<div id="cboCommon" data-ax5select="cboCommon" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		</div>
		<div class="col-sm-2">
			<label>업무후</label>
		</div>
		<div class="col-sm-10">
			<div id="cboHoli" data-ax5select="cboHoli" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		</div>
		<div class="col-sm-12">
			<div class="float-right">
				<button class="btn btn-default" id="btnReq">등록</button>
				<button class="btn btn-default" id="btnDel">폐기</button>
			</div>
		</div>
	</div>
</div>
	
<div class="row">
	<div class="col-sm-12">
		<div data-ax5grid="notiGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 50%;"></div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/ConfigurationTab5.js"/>"></script>