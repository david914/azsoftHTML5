<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div id="header"></div>

<div id="wrapper">
	<div class="content">
		<div id="history_wrap">프로그램 <strong>&gt; 빌드/릴리즈정보</strong></div>

		<div class="tab_wrap">
			<ul class="tabUl">
				<li rel="tab1" id="tab1Li" class="on">1.빌드/릴리즈유형등록</li>
	        	<li rel="tab2" id="tab2Li">2.빌드/릴리즈유형연결</li>
			</ul>
		</div>
		<div>
	      	<!-- 빌드/릴리즈유형등록 -->
	       	<div id="tab1" class="tab_content">
	       		<iframe src='/webPage/tab/buildrelease/TypeRegistrationTab.jsp' width='100%' height='93%' frameborder="0"></iframe>
	       	</div>
	       	
	       	<!-- 빌드/릴리즈유형연결 -->
	       	<div id="tab2" class="tab_content">
	       		<iframe src='/webPage/tab/buildrelease/TypeConnectionTab.jsp' width='100%' height='93%' frameborder="0"></iframe>
	       	</div>
		</div>
	</div>
</div>
       
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/BuildReleaseInfo.js"/>"></script>