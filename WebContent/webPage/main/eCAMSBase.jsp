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
    
    #subbox {
    	width: 183;
    	height: 40px;
    	background: white;
    	margin-top: 29px;
    	display: none;
    	margin-left: -34px;
    	padding-top: 9px;
    	border-top: 3px solid #2471c8;
    	box-shadow: 0 6px 16px rgba(0,0,0,.175);
    	padding-left: 5px;
    	padding-right: 5px;
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
			<div class="dib" id="msrBd"style="width: 191px; height: 30px;position: relative; overflow: hidden;">
				<div class="dib por" id="msrDiv" style="min-width: 191px;">
					<a class="cntInfo" id="approvalCnt" style="font-weight: bold; color: blue;">미결[0]</a><span>l</span>
					<a class="cntInfo" id="srCnt" style="font-weight: bold; color: green;">SR[0]</a><span>l</span>
					<a class="cntInfo" id="errCnt" style="font-weight: bold; color: red;">오류[0]</a>
				</div>
			</div>
			<div class="dib vat" id="msrIcon" style="margin-right: 5px; display: none; height: 32px;">
				<img src="../../img/menu2.png" id="menuIcon" style="width: 20px; height: 15px; margin-top: 1px;">
			</div>
			<span id="spn1" class="vat" style="margin-left: -4px; margin-right: -4px;">l</span>
			<div id="subbox" class="poa" style="">
			
			</div>
			<a id="loginUser" class="vat"></a><span class="vat">l</span>
			<a id="logOut" class="vat">로그아웃</a>
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