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
	padding-left: 0px !important;
	padding-right: 0px !important;
	display: inline-block;
	padding-top: 5px;
}
.test .div1 * {
	margin: auto;
}

.test .div1 div {
	padding-left: 0px !important;
	padding-right: 0px !important;
}
#maingrid {
	background: lightgrey;
	height: 80%;
}
label {
	padding-left: 0px !important;
	padding-right: 0px !important;
	padding-top : 5px;
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
	<div class="col-lg-12 col-md-12 col-sm-12 binder-form" style="margin-top: 10px; height: 15%;">
	<div class="col-lg-12 col-md-12 col-sm-12 no-padding topBorder">
		<div class="col-lg-3 col-md-3 col-sm-3 form-group test">
			<div class="col-lg-12 col-md-12 col-sm-12 div1">
				<label class="col-lg-2 col-md-2 col-sm-2">시스템</label>
				<div class="col-lg-10 col-md-10 col-sm-10 form-group">
	            	<div id="systemSel" data-ax5select="systemSel" data-ax5select-config="{}"></div>
				</div>
			</div>
			<div class="col-lg-12 col-md-12 col-sm-12 div1">
				<label class="col-lg-2 col-md-2 col-sm-2">신청구분</label>
				<div class="col-lg-10 col-md-10 col-sm-10">
	            	<div id="reqDivSel" data-ax5select="reqDivSel" data-ax5select-config="{}"></div>
				</div>
			</div>
			<div class="col-lg-12 col-md-12 col-sm-12 div1">
				<label class="col-lg-2 col-md-2 col-sm-2">진행상태</label>
				<div class="col-lg-10 col-md-10 col-sm-10">
	            	<div id="statusSel" data-ax5select="statusSel" data-ax5select-config="{}"></div>
				</div>
			</div>			
		</div>
		<div class="col-lg-3 col-md-3 col-sm-3 form-group test">
			<div class="col-lg-12 col-md-12 col-sm-12 div1">
				<label class="col-lg-2 col-md-2 col-sm-2">신청부서</label>
				<div class="col-lg-10 col-md-10 col-sm-10">
	            	<div id="reqDeptSel" data-ax5select="reqDeptSel" data-ax5select-config="{}"></div>
				</div>
			</div>
			<div class="col-lg-12 col-md-12 col-sm-12 div1">
				<label class="col-lg-2 col-md-2 col-sm-2">처리구분</label>
				<div class="col-lg-10 col-md-10 col-sm-10">
	            	<div id="prcdDivSel" data-ax5select="prcdDivSel" data-ax5select-config="{}"></div>
				</div>
			</div>		
		</div>
		<div class="col-lg-3 col-md-3 col-sm-3 form-group test">
			<div class="col-lg-12 col-md-12 col-sm-12 div1">
				<label class="col-lg-3 col-md-3 col-sm-3">SR-ID/SR명</label>
				<div class="col-lg-9 col-md-9 col-sm-9">
					<input type="text" class="form-control" data-ax-path="srId" id="srId" onkeyup="enterKey()">
				</div>
			</div>
			<div class="col-lg-12 col-md-12 col-sm-12 div1">
				<label class="col-lg-3 col-md-3 col-sm-3">신청자</label>
				<div class="col-lg-9 col-md-9 col-sm-9">
					<input type="text" class="form-control" data-ax-path="reqUser" id="reqUser" onkeyup="enterKey()">
				</div>
			</div>
			<div class="col-lg-12 col-md-12 col-sm-12 div1">
				<label class="col-lg-3 col-md-3 col-sm-3">프로그램명/설명</label>
				<div class="col-lg-9 col-md-9 col-sm-9">
						<input type="text" class="form-control" data-ax-path="descript" id="descript" onkeyup="enterKey()">
				</div>
			</div>				
		</div>
		<div class="col-lg-3 col-md-3 col-sm-3 form-group test">
			<div class="col-lg-9 col-md-9 col-sm-9 div1">
				<div class="col-lg-12 col-md-12 col-sm-12 no-padding-side div1">
					<div>
						<div class="col-sm-10" style="margin-bottom: 5px;">
							<label class="wLabel-left" style="width: 0px;"></label>
							<input id="radioCkOut" tabindex="8" type="radio" name="radioStd" value="optCkOut" checked="checked"/>
							<label for="radioCkOut" style="margin-right: 10px;">신청일기준</label>
							<input id="radioCkIn" tabindex="8" type="radio" name="radioStd" value="optCkIn"/>
							<label for="radioCkIn">완료일기준</label>
						</div>
					</div>
				</div>
				<div class="col-lg-5 col-md-5 col-sm-5 div1">
					<div class="input-group" data-ax5picker="picker1">
			            <input id="datStD" name="datStD" type="text" class="form-control" value="2018/01/01">
			            <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
			        </div>
				</div>
 			           <span class="input-group-addon col-lg-2 col-md-2 col-sm-2 div1" style="background: white; border: 0px; width:20px; margin-top: 5px;">~</span>
				<div class="col-lg-5 col-md-5 col-sm-5 div1">
					<div class="input-group" data-ax5picker="picker2">
			            <input id="datEdD" name="datEdD" type="text" class="form-control">
			            <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
			        </div>
				</div>
			</div>
			<div class="col-lg-3 col-md-3 col-sm-3 div1">
				<button id="btnSearch" class="btn btn-default" style="width: 100%">
					   조회 <span class="glyphicon glyphicon-search" aria-hidden="true">   </span>
				</button>
				<button id="btnExcel" class="btn btn-default" style="width: 100%">
					엑셀저장 <span class="glyphicon glyphicon-file" aria-hidden="true"></span>
				</button>
			</div>
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
<script type="text/javascript" src="<c:url value="/js/ecams/report/ConfigReqReport.js"/>"></script>