<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
<c:import url="/js/ecams/common/commonscript.jsp" />

<body style="padding: 10px !important; width: 100% !important; min-width: 0px !important;">
	<div class="row por">					
		<div class="dib vat">
			<label class="tit_80 poa">개발자</label>
			<div class="ml_20">
				<div class="ml_80 width-80">
					<div id="cboProgramer2" data-ax5select="cboProgramer2" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100"></div>
				</div>
			</div>
		</div>
		
		<div class="dib">
			<label class="wLabel-left"></label>
			<input id="rdoOpt1" tabindex="8" type="radio" name="radioAppli" checked="checked" style="margin-top:6px;"/>
			<label for="rdoOpt1">신청건별</label>
			<input id="rdoOpt2" tabindex="8" type="radio" name="radioAppli" style="margin-top:6px;"/>
			<label for="rdoOpt2" >프로그램별</label>
		</div>
		<div class="poa_r dib">
			<button  id="btnExcel" class="btn_basic_s">엑셀저장</button>
		</div>
	</div>
	<!-- line2 S -->
	<div class="row az_board_basic"  style="height: 65%">
		<div data-ax5grid="ReqListGrid"
			data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}"
			style="height: 100%;"></div>
	</div>
</body>

<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
	<input type="hidden" name="srid"/>
</form>
		
<script type="text/javascript" src="<c:url value="/js/ecams/tab/sr/ReqHistoryTab.js"/>"></script>