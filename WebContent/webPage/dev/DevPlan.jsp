<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp"/>

<!-- contener S -->
<div id="wrapper">
    <div class="content">
        <!-- history S-->
        <div id="history_wrap">개발 <strong>&gt; 개발계획/실적</strong></div>
        <!-- history E-->         
	    
	    <!-- PrjListTab.jsp -->
	    <div class="az_board_basic" style="height:30%">
			<div class="l_wrap width-48 dib vat" style="width:100%; height:100%">
    			<!-- <iframe id="frmPrjList" name="frmPrjList" src='/webPage/srcommon/PrjListTab.jsp' width='100%' height='100%' frameborder="0"></iframe> -->
    			<c:import url="/webPage/srcommon/PrjListTab.jsp" />
    		</div>
	    </div>
	    
		<!-- 하단 S-->
		<div class="half_wrap margin-10-top">
			<!-- tab S-->
			<div class="tab_wrap">
				<ul class="tabs">
					<li rel="tabSRRegister" id="tab1Li">SR등록/접수</li><li rel="tabDevPlan" id="tab2Li" class="on">개발계획/실적등록</li>
				</ul>
			</div>
			<!-- tab E-->
			
			<div class="half_wrap margin-10-top" style="height:50%"> <!--  tab_container -->
		       	<!-- SR등록/접수 START -->
		       	<div id="tabSRRegister" class="tab_content mask_wrap" style="width:100%">
		       		<iframe id="frmSRRegister" name="frmSRRegister" src='/webPage/tab/SR/SRRegisterTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
		       	</div>
		       	<!-- SR등록/접수  END -->
		       	
		       	<!-- 개발계획/실적등록 START -->
		       	<div id="tabDevPlan" class="tab_content" style="width:100%">
		       		<iframe id="frmDevPlan" name="frmDevPlan" src='/webPage/tab/SR/DevPlanTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 개발계획/실적등록 END -->
		   	</div>
		   	
		</div>
    </div>
</div>
	<!-- Footer-->
	<footer id="footer">
	    <ul>
	        <li class="logo_f"><img src="../../img/logo_f.png" alt="AZSOFT"></li>
	        <li class="copy">Copyright ⓒ AZSoft Corp. All Right Reserved</li>
	    </ul>
	</footer>
	<input id="txtSessionID" type="hidden" value="FE5E5695B40130B57F234A35A59EF651">

<!-- contener E -->

</html>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/dev/DevPlan.js"/>"></script>