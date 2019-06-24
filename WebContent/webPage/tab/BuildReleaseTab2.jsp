<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-7">
		<div class="col-sm-2">
			<label>시스템</label>
		</div>
		<div class="col-sm-3">
			<div 	id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
			</div>
		</div>
		<div class="col-sm-2">
			<label>요청구분</label>
		</div>
		<div class="col-sm-3">
			<div 	id="cboQry" data-ax5select="cboQry" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
			</div>
		</div>
		<div class="col-sm-2">
			<input type="checkbox" class="checkbox-view" id="chkGridAll" data-label="전체선택"/>
		</div>
		<div class="col-sm-12">
			<div data-ax5grid="conInfoGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 35%;"></div>
		</div>
		<div class="col-sm-12">
			<button class="btn btn-default float-right" id="btnDell">삭제</button>
		</div>
	</div>
	
	<div class="col-sm-5">
		<div class="col-sm-4">
			<label>프로그램종류</label>
		</div>
		<div class="col-sm-2">
			<input type="checkbox" class="checkbox-view" id="chkPrgAll" data-label="전체선택"/>
		</div>
		
		<div class="col-sm-4">
			<label>업무</label>
		</div>
		<div class="col-sm-2">
			<input type="checkbox" class="checkbox-view" id="chkJobAll" data-label="전체선택"/>
		</div>
		<div class="col-sm-6">
			<div class="scrollBind" style="height: 35%; border: 1px dotted gray;;">
   				<ul class="list-group" id="ulPrgInfo">
    			</ul>
   			</div>
		</div>
		<div class="col-sm-6">
			<div id="scrollBindJob" class="scrollBind" style="height: 35%; border: 1px dotted gray;;">
   				<ul class="list-group" id="ulJobInfo">
    			</ul>
   			</div>
		</div>
		<div class="col-sm-12">
			<label>[등록순서] 시스템선택-->요청구분선택-->프로그램종류선택--></label>
		</div>
		<div class="col-sm-12">
			<label>업무선택-->실행구분선택-->스크립트유형선택-->등록버튼 클릭</label>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-1">
		<label>실행구분</label>
	</div>
	<div class="col-sm-7">
		<div 	id="cboPrcSys" data-ax5select="cboPrcSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
		</div>
	</div>
	<div class="col-sm-4">
		<input type="checkbox" class="checkbox-view" id="chkExe" data-label="실행여부선택"/>
		<input type="checkbox" class="checkbox-view" id="chkLocal" data-label="형상관리서버에서 실행"/>
		<input type="checkbox" class="checkbox-view" id="chkSeq" data-label="쉘순차 실행"/>
		<input type="checkbox" class="checkbox-view" id="chkBatch" data-label="일괄쉘 실행"/>
	</div>
</div>
<div class="row">
	<div class="col-sm-1">
		<label>스크립트유형</label>
	</div>
	<div class="col-sm-7">
		<div 	id="cboBldCd" data-ax5select="cboBldCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
		</div>
	</div>
	<div class="col-sm-2">
		<input id="optBefore"  type="radio" name="releaseChk" value="before" checked="checked"/>
		<label for="optBefore" >파일송수신 전</label>
		<input id="optAfter" type="radio" name="releaseChk" value="after"/>
		<label for="optAfter" class="margin-35-right" >파일송수신 후</label>
	</div>
	<div class="col-sm-2">
		<button class="btn btn-default float-right" id="btnReq">등록</button>
	</div>
</div>	
<div class="row">
	<div class="col-sm-12">
		<div data-ax5grid="scriptGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 35%;"></div>
	</div>
</div>



<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/BuildReleaseTab2.js"/>"></script>