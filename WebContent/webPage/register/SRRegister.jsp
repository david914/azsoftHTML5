<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<c:import url="/js/ecams/common/commonscript.jsp" />

<script type="text/javascript" src="<c:url value="/js/ecams/register/SRRegister.js"/>"></script>
<!-- contener S -->
<div id="wrapper">
    <div class="content">
    	<iframe id="frmPrjList" name="frmPrjList" src='/webPage/srcommon/PrjListTab.jsp' width='100%' frameborder="0" style="height: 30vh;"></iframe>
    	<iframe id="frmSRRegister" name="frmSRRegister" src='/webPage/srcommon/SRRegisterTab.jsp' width='100%' frameborder="0" style="height: 65vh;"></iframe>
	</div>
</div>