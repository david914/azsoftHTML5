<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp"/>


<!-- 담당자그리드 -->
<div class="row" style="padding-top: 5px;">
	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
		<div data-ax5grid="workerGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 27%;"></div>
	</div>
</div>


<div class="row" style="padding-top: 5px;">
	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
		<label><input type="checkbox" id="chkAll"/>전체보기</label>
	</div>
</div>

<!-- 작업시간내역 -->
<div class="row" style="padding-top: 5px;">
	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
		<div data-ax5grid="worktimeGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 27%;"></div>
	</div>
</div>


<!-- 개발계획 -->
<div class="row" style="padding-top: 5px;">
	<div class="col-sm-1">
		<label><input type="radio" id="radioPlan" name="group" value="HTML">개발계획</label>
	</div>
	
	<div class="col-sm-2">
		<div class="col-sm-12">
			<label style="padding-top: 25px;">예상소요시간</label>
			<input id="txtExpTime" name="txtExpTime" type="text" onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"></input>
		</div>
	</div>
	
	<div class="col-sm-2">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">예상개발시작일</label>
			<div class="input-group" data-ax5picker="ExpStdate">
	           <input id="ExpStdate" type="text" class="form-control" placeholder="yyyy/mm/dd">
	           <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
	    	</div>
		</div>
	</div>
	
	<div class="col-sm-2">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">예상개발종료일</label>
			<div class="input-group" data-ax5picker="ExpEnddate">
	           <input id="ExpEnddate" type="text" class="form-control" placeholder="yyyy/mm/dd">
	           <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
	    	</div>
		</div>
	</div>
	
    <div class="col-sm-2">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">기능점수등급</label>
		
			<div class="form-group">
            	<div id="selRate" data-ax5select="selRate" data-ax5select-config="{}"></div>
        	</div>
		</div>
	</div>
	
	<div class="col-sm-2" style="padding-top: 28px;">
		<button class="btn btn-default" id="btnRegPlan">등록</button>
	</div>
</div>

<!-- 개발실적 -->
<div class="row" style="padding-top: 5px;">
	<div class="col-sm-1">
		<label><input type="radio" id="radioResult" name="group" value="HTML">개발실적</label>
	</div>
		
	<div class="col-sm-2">
		<div class="col-sm-12">
			<label style="padding-top: 5px;">작업일</label>
			<div class="input-group" data-ax5picker="DevDate">
	           <input id="DevDate" type="text" class="form-control" placeholder="yyyy/mm/dd">
	           <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
	    	</div>
		</div>
	</div>
	
    <div class="col-sm-2">
		<div class="col-sm-12">
			<label style="padding-top: 30px;">작업시간</label>
			<input id="txtDevTime" name="txtDevTime" type="text" onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"></input>
		</div>
	</div>
	
	<div class="col-sm-2" style="padding-top: 28px;">
		<button class="btn btn-default" id="btnRegResult">등록</button>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/dev/DevPlan.js"/>"></script>