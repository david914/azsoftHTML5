<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<body style="height: 95% !important">
	<div class="sm-row half_wrap_cb">	
		<div class="l_wrap width-20">
            <label class="tit_80 poa">작업구분</label>
            <div class="ml_80">
				<div id="cboJobDiv" data-ax5select="cboJobDiv" data-ax5select-config="{size:'sm',theme:'primary'}" class="margin-5-right width-100 dib"></div>
			</div>
		</div>		
		<div class="l_wrap width-20">
            <label class="tit_80 poa margin-5-left">IP Address</label>
            <div class="ml_80 por">
            	<input id="txtIp" type="text" class="width-100 dib">
			</div>
		</div>				
		<div class="l_wrap width-20">
            <label class="tit_80 poa margin-5-left">계정</label>
            <div class="ml_80 por">
            	<input id="txtUser" type="text" class="width-100 dib">
			</div>
		</div>				
		<div class="l_wrap width-40">
            <label class="tit_80 poa margin-5-left">대상확장자</label>
            <div class="ml_80 por">
            	<input id="txtExeName" type="text" class="width-100 dib">
			</div>
		</div>		
	</div>
	<div class="sm-row half_wrap_cb">	
		<div class="l_wrap width-20">
            <label class="tit_80 poa margin-5-left">Port</label>
            <div class="ml_80 por">
            	<input id="txtPort" type="text" class="width-100 dib">
			</div>
		</div>				
		<div class="l_wrap width-20">
            <label class="tit_80 poa margin-5-left">비밀번호</label>
            <div class="ml_80 por">
            	<input id="txtPass" type="text" class="width-100 dib">
			</div>
		</div>				
		<div class="l_wrap width-60">
            <label class="tit_80 poa margin-5-left">Agent경로</label>
            <div class="ml_80 por">
            	<input id="txtAgent" type="text" class="width-80 dib"> <label class="margin-5-left"><input type="checkbox" />장애</label>
            </div>
		</div>
	</div>
	<div class="sm-row tar">
		<button id="btnReq" class="btn_basic_s">등록</button>
		<button id="btnDel" class="btn_basic_s">폐기</button>
	</div>
    <div class="sm-row az_board_basic" style="height: 72%">
    	<div data-ax5grid="workGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
	</div>	
</body>		

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/configuration/JobServerInfoTab.js"/>"></script>