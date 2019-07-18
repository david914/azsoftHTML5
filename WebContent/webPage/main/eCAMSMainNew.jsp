<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<body style="width: 100% !important; min-width: 0px !important; height: 98% !important; min-height: 0px !important">
	<div id="wrapper">
		<div class="row">
			<div class="width-50">
				<div id='calendar'></div>
			</div>
		</div>
	</div>
</body>

<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/main/eCAMSMainNew.js"/>"></script>