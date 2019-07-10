<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<style>
.div1 {
	background: lightgray;
}
.div2 {
	background: lightgreen;
}
</style>
<div id="header"></div>
<div id="wrapper">
	<div class="content">
		<div id="history_wrap">보고서 <strong>&gt; 프로그램목록</strong></div>
		<div class="az_search_wrap">
			<div class="az_in_wrap sr_status">
				<div class="l-wrap width-100 vat">
					<div class="row margin-10-bottom">
						<div class="width-20 dib vat">
							<div class="tit_100 dib vat">
								<label>*시스템</label>
							</div>
							<div class="width-60 dib" id="systemSel" data-ax5select="systemSel" data-ax5select-config="{}">
							</div>
						</div>
						<div class="width-15 dib">
							<div class="tit_100 dib vat">
								<label>*조건선택1</label>
							</div>
							<div class="width-50 dib" id="reqDeptSel" data-ax5select="conditionSel1" data-ax5select-config="{}">
							</div>
							<div class="tit_100 dib vat margin-5-top">
								<label id="prgStatusLabel">*프로그램상태</label>
							</div>
							<div class="width-50 dib margin-5-top"" id="prgStatusSel" data-ax5select="prgStatusSel" data-ax5select-config="{}">
							</div>
						</div>
						<div class="width-15 dib vat">
							<div class="tit_100 dib vat">
								<label>*조건선택2</label>
							</div>
							<div class="width-50 dib" id="reqDeptSel" data-ax5select="conditionSel2" data-ax5select-config="{}">
							</div>
							<div class="tit_100 dib vat margin-5-top">
								<label></label>
							</div>
							<div class="width-50 dib margin-5-top">
								<input type="text" class="width-100" data-ax-path="conditionText" id="conditionText" onkeyup="enterKey()" disabled="disabled">
							</div>
						</div>
						<div class="width-15 dib vat">
							<div class="tit_100 dib vat">
								<label>*범위</label>
							</div>
							<div class="width-50 dib" id="rangeSel" data-ax5select="rangeSel" data-ax5select-config="{}">
							</div>
							<div class="width-50 dib margin-10-top">
								<label class="wLabel-left" style="width: 0px;"></label>
								<input id="checkDetail" tabindex="8" type="checkbox" name="checkStd" value="optCkOut" style="margin-top: 5px;" checked="checked"/>
								<label for="radioCkOut" style="margin-top: -5px;">세부항목포함</label>
							</div>
						</div>
						<div class="width-5 float-right margin-20-right">
							<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnExcel">엑셀저장</button>
							<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnSearch">조회</button>
						</div>
					</div>					
				</div>
						
			</div>
		</div>
	
	</div>
	
	<div class="az_board_basic">
		<div id="mainGrid" data-ax5grid="mainGrid" data-ax5grid-config="{}" style="width:100%; height: 600px;">
		
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/PrgListReport.js"/>"></script>