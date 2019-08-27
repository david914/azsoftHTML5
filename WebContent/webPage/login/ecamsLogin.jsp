<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>형상관리 로그인</title>

<c:import url="/webPage/common/common.jsp" />

<link rel="stylesheet" href="<c:url value="/css/ecams/login/loginPage.css" />">
</head>
<body>
	<section class="height-100">
		<div class="login-form">
		    <form id="ecamsLoginForm" method="post">
		        <h2 class="text-center">로그인</h2>       
		        <div class="form-group ui input focus">
		        	<input id="idx_input_id" name="idx_input_id" class="form-control az_login_input" placeholder="아이디를 입력하세요." required="required" />
		        </div>
		        <div class="form-group">
		            <input type ="password" id="idx_input_pwd" name="idx_input_pwd" class="form-control az_login_input" placeholder="비밀번호를 입력하세요" required="required"/>
		        </div>
		        <div class="form-group">
		        	<button class ="az_login_btn" id="idx_login_btn" style="width:100%" type="submit">로그인</button>
		        </div>
		        <div class="clearfix">
		            <input type="checkbox" id="chkbox_remember" name="chkbox_remember"/> <label for="chkbox_remember">아이디/비밀번호 저장</label>
		            <a href="#" class="pull-right" style="display:none">Forgot Password?</a>
		        </div>        
		    </form>
		    <p class="text-center"><a href="#" style="display:none">Create an Account</a></p>
		    
		</div>
	</section>
	
	<form name="popPam">
		<input type="hidden" name="userId"/>
		<input type="hidden" name="winPopSw"/>
	</form>
	
	<c:import url="/js/ecams/common/commonscript.jsp" />
	<script type="text/javascript" src="<c:url value="/js/ecams/login/login.js"/>"></script>
</body>
</html>