<%@page import="com.ecams.common.base.StringHelper"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<%
	String userId = StringHelper.evl(request.getParameter("userId"),"");
%>

<section>
	<div class="row">
		<div class="col-sm-4">
			<input id="optAll"  type="radio" name="singUpRadio"  value="all"/>
			<label for="optAll" >전체</label>
			<input id="optNomal" type="radio"  name="singUpRadio"  value="normal"/>
			<label for="optNomal">정상</label>
			<input id="optError" type="radio"  name="singUpRadio"  value="error"/>
			<label for="optError">장애</label>
		</div>
		<div class="col-sm-8">
			<button class="btn btn-default" id="btnExcelOpen">엑셀열기</button>
			<button class="btn btn-default" id="btnCellAd">셀추가</button>
			<button class="btn btn-default" id="btnExcel">엑셀저장</button>
			<button class="btn btn-default" id="btnDbSave">디비저장</button>
			<label id="lblCnt">총 0건</label>
		</div>
	</div>
	<div class="row">
		<div class="col-sm-12">
			<div data-ax5grid="signUpGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 20%;"></div>
		</div>
	</div>
</section>


<input type="hidden" id="userId" name="userId" value="<%=userId%>"/>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/winpop/AllSignUp.js"/>"></script>