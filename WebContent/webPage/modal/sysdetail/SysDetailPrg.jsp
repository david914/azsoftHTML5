<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-7">
		<div class="col-sm-3">
			<label id="lblSvrItem">서버종류</label>
		</div>
		<div class="col-sm-5">
			<div 	id="cboSvrItem" data-ax5select="cboSvrItem" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
			</div>
		</div>
		<div class="col-sm-4">
			<input type="checkbox" class="checkbox-prg" id="chkAllSvrItem" data-label="전체선택"  />
		</div>
		<div class="col-sm-12">
			<div data-ax5grid="svrItemGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 45%;"></div>
		</div>
	</div>
	
	<div class="col-sm-5">
		<div class="col-sm-8">
			<label id="lblItem">[프로그램종류]</label>
		</div>
		<div class="col-sm-4">
			<input type="checkbox" class="checkbox-prg" id="chkAllItem" data-label="전체선택"  />
		</div>
		<div class="col-sm-12">
			<div class="scrollBind" style="height: 235px; border: 1px solid black;">
				<ul class="list-group" id="ulItemInfo"></ul>
			</div>
		</div>
	</div>
	
	<div class="col-sm-1">
		<label id="lblHome">홈디렉토리</label>
	</div>
	<div class="col-sm-7">
		<input id="txtVolpath" name="txtVolpath" class="form-control" type="text"></input>
	</div>
	<div class="col-sm-4">
		<button class="btn btn-default" id="btnReqItem">
			등록 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
		<button class="btn btn-default" id="btnClsItem">
			폐기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
		<button class="btn btn-default" id="btnQryItem">
			조회 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
		<button class="btn btn-default" id="btnExitItem">
			닫기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
	</div>
	
	<div class="col-sm-12">
		<div data-ax5grid="itemGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 45%;"></div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/sysdetail/SysDetailPrg.js"/>"></script>