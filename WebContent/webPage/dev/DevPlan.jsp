<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp"/>

<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta  name="input1" model-name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>azsoft_형상관리시스템</title>

<!-- Vendor styles -->
<link rel="stylesheet" href="../../vendor/fontawesome/css/font-awesome.css" />
<link rel="stylesheet" href="../../vendor/metisMenu/dist/metisMenu.css" />
<link rel="stylesheet" href="../../vendor/animate.css/animate.css" />
<!-- <link rel="stylesheet" href="../../vendor/bootstrap/dist/css/bootstrap.css" /> -->
<link rel="stylesheet" href="../../vendor/wCheck-master/wCheck.css" />

<!-- App styles -->
<link rel="stylesheet" href="../../fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css" />
<link rel="stylesheet" href="../../fonts/pe-icon-7-stroke/css/helper.css" />
<!-- <link rel="stylesheet" href="../../styles/style.css"> -->

<!--  AX5UI -->
<link rel="stylesheet" href="../../styles/ax5/ax5calendar.css">
<link rel="stylesheet" href="../../styles/ax5/ax5select.css">
<link rel="stylesheet" href="../../styles/ax5/ax5menu.css">
<link rel="stylesheet" href="../../styles/ax5/ax5grid.css"><!-- openGrid -->
<link rel="stylesheet" href="../../styles/ax5/ax5toast.css">
<link rel="stylesheet" href="../../styles/ax5/ax5modal.css">
<link rel="stylesheet" href="../../styles/ax5/ax5mask.css">
<link rel="stylesheet" href="../../styles/ax5/ax5dialog.css">
<link rel="stylesheet" href="../../styles/ax5/ax5picker.css">

<!-- Toast UI Chart -->
<link rel="stylesheet" href="../../styles/tui-chart.css" />

<!-- FILE TREE -->
<link rel="stylesheet" href="../../styles/filetree/zTreeStyle.css">

<link rel="stylesheet" href="../../styles/jquery-ui.css">
<!-- eCAMS js, css -->
<link rel="stylesheet" href="../../css/ecams/common/ecamsStyle.css">
<link rel="stylesheet" href="../../css/ecams/common/toolTip2.css">
<link rel="stylesheet" href="../../css/ecams/login/loginPage.css">
</head>

<body>

<!-- contener S -->
<div id="wrapper">
    <div class="content">
        <!-- history S-->
        <div id="history_wrap">개발 <strong>&gt; 개발계획/실적</strong></div>
        <!-- history E-->         
	    
	    <!-- PrjListTab.jsp -->
	    <div class="az_board_basic">
			<div class="l_wrap width-48 dib vat" style="width:100%">
    			<iframe src='/webPage/srcommon/PrjListTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
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
			
			<div class="half_wrap margin-10-top" style="height:60%"> <!--  tab_container -->
		       	<!-- SR등록/접수 START -->
		       	<div id="tabSRRegister" class="tab_content mask_wrap" style="width:100%">
		       		<iframe src='/webPage/srcommon/SRRegisterTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
		       	</div>
		       	<!-- SR등록/접수  END -->
		       	
		       	<!-- 개발계획/실적등록 START -->
		       	<div id="tabDevPlan" class="tab_content" style="width:100%">
		       		<iframe src='/webPage/srcommon/DevPlanTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
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

</body>
</html>


<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/dev/DevPlan.js"/>"></script>