<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<section>
	<div class="hpanel">
        <div class="panel-body">
        	
			<ul class="tabs">
				<label id="lblSysMsg"></label>
		        <li class="active" rel="tab1" id="tab1Li">1.빌드/릴리즈유형등록</li>
		        <li rel="tab2" id="tab2Li">2.빌드/릴리즈유형연결</li>
		   	</ul>
		   	
		   	<div class="tab_container">
		       	<!-- 서버정보 START -->
		       	<div id="tab1" class="tab_content">
		       		<iframe src='/webPage/administrator/BuildReleaseTab1.jsp' width='100%' height='93%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 서버정보 END -->
		       	
		       	<!-- 계정정보 START -->
		       	<div id="tab2" class="tab_content">
		       		<iframe src='/webPage/administrator/BuildReleaseTab2.jsp' width='100%' height='93%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 계정정보 END -->
		   	</div>
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/BuildReleaseInfo.js"/>"></script>