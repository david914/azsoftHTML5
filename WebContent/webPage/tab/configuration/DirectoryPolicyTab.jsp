<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<body style="height: 95% !important">
	<div class="row half_wrap_cb">			
		<div class="l_wrap width-25">
            <label class="tit_150 poa">디렉토리구분</label>
            <div class="ml_150 por">
                <div>
					<div id="cboPathDiv" data-ax5select="cboPathDiv" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:80%;" ></div>
				</div>
			</div>
		</div>		
		<div class="l_wrap width-25">
            <label class="tit_150 poa">배포서버 IP Address</label>
            <div class="ml_150 por">
                <input id="txtIp" type="text" class="width-50 dib">
			</div>
		</div>
		<div class="l_wrap width-25">
            <label class="tit_80 poa">디렉토리명</label>
            <div class="ml_80 por">
                <input id="txtPathName" type="text" class="width-50 dib">
			</div>
		</div>
		<div class="l_wrap width-25">
            <label class="tit_100 poa">배포서버 Port</label>
            <div class="ml_100 por">
                <div>
					<input id="txtPort" type="text" class="width-50 dib">
				</div>
				<div class="dib poa_r">
					<button id="btnReq" class="btn_basic_s margin-20-left">등록</button>
					<button id="btnDel" class="btn_basic_s margin-5-left">폐기</button>
				</div>
			</div>
		</div>
	</div>
	
    <div class="row az_board_basic" style="height: 80%;">
    	<div data-ax5grid="dirGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>	
	</div>	
</body>		

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/configuration/DirectoryPolicyTab.js"/>"></script>