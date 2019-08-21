<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
<c:import url="/js/ecams/common/commonscript.jsp" />

<body style="padding: 10px !important; width: 100% !important; min-width: 0px !important;">
	<!-- line1 S -->
	<div class="row por">					
	    <div class="dib vat">
	    	<label class="tit_80 poa">개발자</label>
		    <div class="ml_80 width-60">
				<div id="cboProgramer" data-ax5select="cboProgramer" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100"></div>
			</div>
		</div>
		<div class="poa_r dib">
			<button id="btnExcel" class="btn_basic_s">엑셀저장</button>
		</div>
	</div>
	<!-- line2 S -->
	<div class="row az_board_basic"  style="height: 65%">
		<div data-ax5grid="PrgListGrid"
			data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}"
			style="height: 100%;"></div>
	</div>
</body>

<script type="text/javascript" src="<c:url value="/js/ecams/tab/sr/PrgListTab.js"/>"></script>