<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<style>

.test {
	height: 13%;
	padding-top: 5px;
}
.test .div1{
	padding-left: 0px;
	padding-right: 0px;
	display: inline-block;
	padding-top: 5px;
}
.test .div1 * {
	margin: auto;
}

.test .div1 div {
	padding-left: 0px;
	padding-right: 0px;
}
#maingrid {
	background: lightgrey;
	height: 80%;
}
label {
	padding-left: 0px !important;
	padding-right: 0px !important;
	padding-top : 1%;
}
.form-group {
	margin-bottom: 0px !important;
}
.topBorder {
/* 	border: 1px solid #ddd; */
	height: 100%;
	border-radius: 5px;
	box-shadow: 1px 1px 4px 1px lightgrey;
	
}
</style>
<div style="height: 100%; width: 100%;">

	<!-- data input section -->
	<div class="col-lg-12 col-md-12 col-sm-12 binder-form" style="margin-top: 10px; height: 9.5%;">
	<div class="col-lg-12 col-md-12 col-sm-12 no-padding topBorder">
		<div class="col-lg-3 col-md-3 col-sm-3 form-group test">
			<div class="col-lg-12 col-md-12 col-sm-12 div1">
				<label class="col-lg-2 col-md-2 col-sm-2">시스템</label>
				<div class="col-lg-10 col-md-10 col-sm-10 form-group">
	            	<div id="systemSel" data-ax5select="systemSel" data-ax5select-config="{}"></div>
				</div>
			</div>
	
		</div>
		<div class="col-lg-5 col-md-5 col-sm-5 form-group test">
			<div class="col-lg-4 col-md-4 col-sm-4 div1" style="padding-top: 0px;">
				<div class="col-lg-12 col-md-12 col-sm-12 div1">
					<label class="col-lg-4 col-md-4 col-sm-4">조건선택1</label>
					<div class="col-lg-8 col-md-8 col-sm-8">
		            	<div id="reqDeptSel" data-ax5select="conditionSel1" data-ax5select-config="{}"></div>
					</div>
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 div1">
					<label class="col-lg-4 col-md-4 col-sm-4" id="prgStatusLabel">프로그램상태</label>
					<div class="col-lg-8 col-md-8 col-sm-8">
		            	<div id="prgStatusSel" data-ax5select="prgStatusSel" data-ax5select-config="{}"></div>
					</div>
				</div>
			</div>		
			<div class="col-lg-4 col-md-4 col-sm-4 div1" style="padding-top: 0px; padding-left: 5%;">
				<div class="col-lg-12 col-md-12 col-sm-12 div1">
					<label class="col-lg-4 col-md-4 col-sm-4">조건선택2</label>
					<div class="col-lg-8 col-md-8 col-sm-8">
		            	<div id="reqDeptSel" data-ax5select="conditionSel2" data-ax5select-config="{}"></div>
					</div>
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 div1">
					<label class="col-lg-4 col-md-4 col-sm-4" id="conditionTextLabel"></label>
					<div class="col-lg-8 col-md-8 col-sm-8">
		            	<input type="text" class="form-control" data-ax-path="conditionText" id="conditionText" onkeyup="enterKey()" disabled="disabled">
					</div>
				</div>
			</div>		
			<div class="col-lg-4 col-md-4 col-sm-4 div1" style="padding-top: 0px; padding-left: 5%;">
				<div class="col-lg-12 col-md-12 col-sm-12 div1">
					<label class="col-lg-3 col-md-3 col-sm-3">범위</label>
					<div class="col-lg-9 col-md-9 col-sm-9">
		            	<div id=rangeSel data-ax5select="rangeSel" data-ax5select-config="{}"></div>
					</div>
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 div1">
						<label class="wLabel-left" style="width: 0px;"></label>
						<input id="checkDetail" tabindex="8" type="checkbox" name="checkStd" value="optCkOut" style="margin-top: 5px;" checked="checked"/>
						<label for="radioCkOut" style="margin-top: -5px;">세부항목포함</label>
<!-- 					<label class="col-lg-8 col-md-8 col-sm-8">세부항목포함</label> -->
				</div>
			</div>		
		</div>


			<div class="col-lg-1 col-md-1 col-sm-1 div1" style="margin-rignt: 1%; margin-top: 0.5%; float: right;">
				<button id="btnSearch" class="btn btn-default" style="width: 100%">
					   조회 <span class="glyphicon glyphicon-search" aria-hidden="true">   </span>
				</button>
				<button id="btnExcel" class="btn btn-default" style="width: 100%">
					엑셀저장 <span class="glyphicon glyphicon-file" aria-hidden="true"></span>
				</button>
			</div>
		</div>
	</div>
	
	<!-- 구분선 -->
	<div class="col-lg-12 col-md-12 col-sm-12" style="margin: 5px;"></div>
	
	<!-- 그리드 -->
	<div class="col-lg-12 col-md-12 col-sm-12">
		<div id="mainGrid" data-ax5grid="mainGrid" data-ax5grid-config="{}" style="width:100%;">
		
		</div>
	</div>
</div>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/PrgListReport.js"/>"></script>