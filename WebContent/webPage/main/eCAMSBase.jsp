<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="sessionID" value="${param.sessionID }"></c:set>    
<!DOCTYPE html>
<html>
<head>
	<c:import url="/webPage/common/common.jsp" />
	<title>형상관리 시스템</title>
</head>

<style type="text/css">
    iframe {
    	min-width: 1045px;
    }
    
    #status{
        height: 50px;
	    top: 0px;
	    padding-top: 18px;
	    background: white;
	    z-index: 999999;
	    border-bottom: 1px solid #ddd;
    }
</style>

<body style="width: 100% !important; min-width: 0px !important;">
<div id="wrapper">
	<!-- Header -->
	<div id="header">	
		<h1 class="logo" id="logo" style="cursor: pointer;">azsoft</h1>
		<div class="lang_menu">
			<ul id="ulMenu"></ul>
		</div>
		<div class="log" id="status">
			<a id="approvalCnt" style="font-weight: bold; color: blue;">미결[0]</a>l
			<a id="srCnt" style="font-weight: bold; color: green;">SR[0]</a>l
			<a id="errCnt" style="font-weight: bold; color: red;">오류[0]</a>l
			<a id="loginUser"></a>l
			<a id="logOut">로그아웃</a>
		</div>
	</div>

	<!-- contener -->
	<div id="eCAMSFrame" class="content">
	</div>

	<!-- Footer-->
	<footer id="footer">
	    <ul>
	        <li class="logo_f"><img src="../../img/logo_f.png" alt="AZSOFT"></li>
	        <li class="copy">Copyright ⓒ AZSoft Corp. All Right Reserved</li>
	    </ul>
	</footer>
</div>
<input id="txtSessionID" type="hidden" value="${sessionID}">

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/main/eCAMSBase.js"/>"></script>
</body>

</html>