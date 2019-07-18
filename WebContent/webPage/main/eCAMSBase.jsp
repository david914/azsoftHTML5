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
  	h1.logo{display: inline-block; font-size: 25px; font-weight: bold; line-height: 45px; margin-left: 15px; color: #2471c8;}
	.lang_menu {position: absolute; top: 0; margin-left: 100px; height: 50px; width: 1024px; z-index: 10000;}
  	.lang_menu:after{content: ''; display: block; zoom: 1;}
	.lang_menu ul li{float: left; width: 82px; text-align: center;}
  	.lang_menu ul li a{display: block; font-size: 14px; font-weight: bold; color: #333; padding-top: 15px; height: 50px;}
    .lang_menu ul li div.active{display: block; border-top: solid 3px #2471c8;}
    .lang_menu ul li .menu_box{display: none; width: 135px; background-color: #fff; margin-top: -3px; z-index: 1000; -webkit-box-shadow: 0 6px 16px rgba(0,0,0,.175); box-shadow: 0 6px 16px rgba(0,0,0,.175);}
    .lang_menu ul li .menu_box p{display: block; padding: 10px 5px; border-bottom: 1px solid #eee; text-align: left; font-size: 12px; cursor: pointer;}
    .lang_menu ul li .menu_box p:last-child{border-bottom: 0;}
    .lang_menu ul li .menu_box p img{margin-top: 2px;}
    footer {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>

<body>

<!-- Header -->
<div id="header">	
	<h1 class="logo">azsoft</h1>
	<div class="lang_menu">
		<ul id="ulMenu"></ul>
	</div>
</div>

<!-- contener -->
<div class="wrapper">
	<div id="eCAMSFrame" class="content">
	</div>
</div>

<!-- Footer-->
<footer id="footer">
    <ul>
        <li class="logo_f"><img src="../../img/logo_f.png" alt="AZSOFT"></li>
        <li class="copy">Copyright ⓒ AZSoft Corp. All Right Reserved</li>
    </ul>
</footer>


<%-- 
<div id="header">
    <div id="logo" class="light-version">
    	<img src="<c:url value="/img/top_log.gif"/>" alt="logo" onclick="goHome()">
    </div>
    <nav role="navigation">
        <div class="header-link hide-menu"><i class="fa fa-bars"></i></div>
        <div class="small-logo">
            <span class="text-primary">eCAMS LOGO</span>
        </div>
        
        <form role="search" class="navbar-title-text-main" method="post" action="#">
        	<span id="ecamsTitleText">eCAMS MAIN PAGE</span>
        </form> 
        <div class="mobile-menu">
            <button type="button" class="navbar-toggle mobile-menu-toggle" data-toggle="collapse" data-target="#mobile-collapse">
                <i class="fa fa-chevron-down"></i>
            </button>
            <div class="collapse mobile-navbar" id="mobile-collapse">
                <ul class="nav navbar-nav">
                    <li>
                        <a class="" href="login.html">Login</a>
                    </li>
                    <li>
                        <a class="" href="login.html">Logout</a>
                    </li>
                    <li>
                        <a class="" href="profile.html">Profile</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="navbar-right">
            <ul class="nav navbar-nav no-borders">
                <li class="dropdown">
                    <a href="#" style="font-size: 10px; margin-top: 2px;" id="loginUserName">로그인</a>
                </li>
                <li class="dropdown">
                    <a href="#" onclick="logOut()">
                        <i class="pe-7s-upload pe-rotate-90"></i>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
</div>

<aside id="menu" style="overflow:auto;">
    <div id="navigation" >
        <ul class="nav" id="side-menu">
        </ul>
    </div>
</aside>

<div id="wrapper">
	<div id="eCAMSFrame">
	</div>
</div>

<footer class="footer">
    <span class="pull-right">
        Copyright ⓒ AZSoft Corp. All Right Reserved
    </span>
	<img src="<c:url value="/img/azsoft.jpg"/>">
</footer>

 --%>

<input id="txtSessionID" type="hidden" value="${sessionID}">

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/main/eCAMSBase.js"/>"></script>

</body>

</html>