<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<body style="height: 95% !important">
	<div class="row half_wrap_cb">			
		<div class="l_wrap width-20">
			<label class="tit_150 poa">삭제대상디렉토리구분</label>
			<div class="ml_150 por">
				<div>
					<div id="cboPathDiv" data-ax5select="cboPathDiv" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
				</div>
			</div>
		</div>
		<div class="r_wrap width-50">
	           <label class="tit_80 poa">삭제주기</label>
	           <div class="ml_80 por">
				<input id="txtDelCycle" type="text" class="dib" style="width:70px;">
	            <div class="dib">
	                <div>
						<div id="cboDelCycle" data-ax5select="cboDelCycle" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
					</div>
				</div>	
				<div class="dib poa_r">
					<button id="btnReq" class="btn_basic_s margin-20-left">등록</button>
					<button id="btnDel" class="btn_basic_s margin-5-left">폐기</button>
				</div>
			</div>
		</div>
	</div>
	
	<div class="row az_board_basic" style="height: 80%;">
	   	<div data-ax5grid="delCycleGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
	</div>	
</body>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/configuration/DelCriteriaManageTab.js"/>"></script>