<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp"/>
<c:import url="/js/ecams/common/commonscript.jsp"/>

<script type="text/javascript" src="<c:url value="/js/ecams/register/SRRegister.js"/>"></script>

<!-- contener S -->
<div class="content">
	<!-- history S-->
	<div id="history_wrap"></div>
	<!-- history E-->         

	<!-- PrjListTab.jsp -->
  	<div class="az_board_basic" style="height:25%">
		<div class="l_wrap width-48 dib vat" style="width:100%; height:100%">
			<!-- frmPrjList -->
   			<iframe id="frmPrjList" name="frmPrjList" src='/webPage/tab/sr/PrjListTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
   		</div>
    </div>        
    
    <div class="half_wrap margin-10-top" style="height: 68%">
	 	<!-- SR등록/접수 START -->
		<iframe id="frmSRRegister" name="frmSRRegister" src='/webPage/tab/sr/SRRegisterTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
	    <!-- SR등록/접수  END -->
	</div>
</div>
<!-- contener E -->