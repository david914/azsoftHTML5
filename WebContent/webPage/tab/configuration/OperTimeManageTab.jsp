<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<body style="height: 95% !important">
	<div class="row half_wrap_cb">			
		<div class="l_wrap width-20">
			<label class="tit_80 poa">시간구분</label>
			<div class="ml_80 por">
				<div>
					<div id="cboTimeDiv" data-ax5select="cboTimeDiv" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
				</div>
			</div>
		</div>
		<div class="r_wrap width-50">
           <label class="tit_80 poa">운영시간</label>
           <div class="ml_80 por">
	           	<div class="width-30 dib vat">
					<input id="txtTimeSt" type="text" class="timepicker width-100" autocomplete="off" />
	           	</div>
	           	<span class="margin-5-left margin-5-right vam">&#8767;</span>
	           	<div class="width-30 dib vat">
	           		<input id="txtTimeEd" type="text" class="timepicker width-100" autocomplete="off" />
	           	</div>

				<div class="dib poa_r">
					<button id="btnReq" class="btn_basic_s margin-20-left">등록</button>
					<button id="btnDel" class="btn_basic_s margin-5-left">폐기</button>
				</div>
			</div>
		</div>
	</div>
	<div class="row az_board_basic" style="height: 80%">
		<div data-ax5grid="operTimeGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
	</div>	
</body>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/configuration/OperTimeManageTab.js"/>"></script>