<%@page import="com.ecams.common.base.StringHelper"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<%
	String userId = StringHelper.evl(request.getParameter("userId"),"");
	String winPopSw = StringHelper.evl(request.getParameter("winPopSw"),"");
%>


<div class="contentFrame">	
    <div id="history_wrap">기본관리 <strong>&gt; 비밀번호변경</strong></div>
	<div class="padding-80-top">
		<div id="divContent">
			<div class="sm-row-fluid">
				<div class="sm-row">
					<div>
						<label id="lbUserId">사용자ID</label>
					</div>
					<div>
						<input id="txtUserId" name="txtUserId" type="text" class="width-100"></input>
					</div>
				</div>
				<div class="sm-row">
					<div>
						<label id="lbUserName">성명</label>
					</div>
					<div>
						<input id="txtUserName" name="txtUserName" type="text" class="width-100"></input>
					</div>
				</div>
				<div class="sm-row">
					<div>
						<label id="lbPw" >변경전비밀번호</label>
					</div>
					<div>
						<input id="txtPw" name="txtPw" type="password"  style="width:100%;"></input>
					</div>
				</div>
				<div class="sm-row">
					<div>
						<label id="lbUpdatePw1">변경후비밀번호</label>
					</div>
					<div>
						<input id="txtUpdatePw1" name="txtUpdatePw1" type="password" style="width:100%;"></input>
					</div>
				</div>
				<div class="sm-row">
					<div>
						<label id="lbUpdatePw2">확인비밀번호</label>
					</div>
					<div>
						<input id="txtUpdatePw2" name="txtUpdatePw2" type="password" style="width:100%;"></input>
					</div>
				</div>
				<div class="sm-row margin-15-top">
					<div class="col-xs-12 col-sm-12">
						<p class="txt_g" id="lb2">비밀번호는 숫자/영문/특수기호를 포함하는 8-12자리 이어야 합니다. (분기별 패스워드 변경)</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="divPw" class="margin-15-top" style="text-align:center">
		<button id="btnPw" name="btnPw" class="btn_basic">비밀번호변경</button>
	</div>
</div>

<input type="hidden" id="userId" name="userId" value="<%=userId%>"/>
<input type="hidden" id="winPopSw" name="winPopSw" value="<%=winPopSw%>"/>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/mypage/PwdChange.js"/>"></script>