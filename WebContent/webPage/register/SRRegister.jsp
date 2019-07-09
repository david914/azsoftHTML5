<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<c:import url="/js/ecams/common/commonscript.jsp" />

<script type="text/javascript" src="<c:url value="/js/ecams/register/SRRegister.js"/>"></script>
<!-- contener S -->
<div id="wrapper">
    <div class="content">
    	<iframe src='/webPage/srcommon/PrjListTab.jsp' width='100%' frameborder="0" style="height: 30vh;"></iframe>
    	<iframe src='/webPage/srcommon/SRRegisterTab.jsp' width='100%' frameborder="0" style="height: 65vh;"></iframe>
	</div>
</div>

<!--   Footer
<footer id="footer">
    <ul>
        <li class="logo_f"><img src="../../img/logo_f.png" alt="AZSOFT"></li>
        <li class="copy">Copyright ⓒ AZSoft Corp. All Right Reserved</li>
    </ul>
</footer>
 -->