<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
	<div id="history_wrap">프로그램 <strong>&gt; 빌드/릴리즈정보</strong></div>

	<div class="tab_wrap">
		<ul class="tabs">
			<li rel="tab1" id="tab1Li" class="on">1.빌드/릴리즈유형등록</li>
        	<li rel="tab2" id="tab2Li">2.빌드/릴리즈유형연결</li>
		</ul>
	</div>
	<div>
      	<!-- 빌드/릴리즈유형등록 -->
       	<div id="tab1" class="tab_content" style="padding-top: 0px;">
       		<iframe src='/webPage/tab/buildrelease/TypeRegistrationTab.jsp' width='100%' height='88%' frameborder="0"></iframe>
       	</div>
       	
       	<!-- 빌드/릴리즈유형연결 -->
       	<div id="tab2" class="tab_content" style="padding-top: 0px;">
       		<iframe src='/webPage/tab/buildrelease/TypeConnectionTab.jsp' width='100%' height='88%' frameborder="0"></iframe>
       	</div>
	</div>
</div>
       
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/BuildReleaseInfo.js"/>"></script>