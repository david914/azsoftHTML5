<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<c:import url="/js/ecams/common/commonscript.jsp" />

<script type="text/javascript" src="<c:url value="/js/ecams/register/SRRegister.js"/>"></script>
<!-- contener S -->
<div id="wrapper">
    <div class="content">
    	<div style="height:25%;">
			<c:import url="/webPage/srcommon/PrjListTab.jsp" />
    	</div>
    	<div style="height:75%;">
			<c:import url="/webPage/srcommon/SRRegisterTab.jsp" />
    	</div>
	</div>
</div>

 