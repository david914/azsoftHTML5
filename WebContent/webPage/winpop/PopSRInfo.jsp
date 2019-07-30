<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp"/>

<head>
	<title>SR정보</title>
</head>

<% 
	String UserId = request.getParameter("user"); 
    String SRId = request.getParameter("srid"); 
    String AcptNo = request.getParameter("acptno");
%> 

<!-- contener S -->
<body style="padding: 10px !important; width: 100% !important; min-width: 0px !important;">
    <div class="content">
        <!-- history S-->
        <div id="history_wrap">요구관리 <strong>&gt; SR정보</strong></div>
        <!-- history E-->         
	    
	    <div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="cb">
					<!-- line1 -->		
                    <div class="width-30 float-left">
						<div class="margin-5-right">
	                    	<label class="tit_80 poa">SR-ID</label>
	                        <div class="ml_80">
								<input class="width-100" type="text" id="txtSRID">
							</div>
						</div>
					</div>	
                    <div class="width-70 float-left">
						<div>
	                    	<label class="tit_80 poa tac">상태</label>
	                        <div class="ml_80">
								<input class="width-100" type="text" id="txtSRSta">
							</div>
						</div>
					</div>
				</div>	
				<div class="row">
					<!-- line2 -->	
                	<label class="tit_80 poa">SR명</label>
                    <div class="ml_80">
						<input class="width-100" type="text" id="txtSRTitle">
					</div>
				</div>
			</div>
		</div>
	    
		<!-- 하단 S-->
		<div class="half_wrap margin-10-top" style="height: 80%">
			<!-- tab S-->
			<div class="tab_wrap">
				<ul class="tabs">
					<li rel="tabSRRegister" id="tab1">SR등록/접수</li>
					<li rel="tabDevPlan" id="tab2" class="on">개발계획/실적등록</li>
					<li rel="tabReqHistory" id="tab3">변경요청이력</li>
					<li rel="tabPrgList" id="tab4">프로그램목록</li>
					<li rel="tabSRComplete" id="tab5">SR완료</li>
				</ul>
			</div>
			<!-- tab E-->
			
			<div class="half_wrap margin-10-top" style="height:97%"> <!--  tab_container -->
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
		       	
		       	<!-- 변경요청이력 START -->
		       	<div id="tabReqHistory" class="tab_content" style="width:100%">
		       		<iframe id="frmReqHistory" name="frmReqHistory" src='/webPage/tab/SR/ReqHistoryTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 변경요청이력 END -->
		       	
		       	<!-- 프로그램목록 START -->
		       	<div id="tabPrgList" class="tab_content" style="width:100%">
		       		<iframe id="frmPrgList" name="frmPrgList" src='/webPage/tab/SR/PrgListTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 프로그램목록 END -->
		       	
		       	<!-- SR완료 START -->
		       	<div id="tabSRComplete" class="tab_content" style="width:100%">
		       		<iframe id="frmSRComplete" name="frmSRComplete" src='/webPage/tab/SR/SRCompleteTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
		       	</div>
		       	<!-- SR완료 END -->
		   	</div>
		   	
		</div>
    </div>
</body>
<!-- contener E -->

<input type=hidden id="UserId" value=<%=UserId%>>
<input type=hidden id="SRId" value=<%=SRId%>>
<input type=hidden id="AcptNo" value=<%=AcptNo%>>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/winpop/PopSRInfo.js"/>"></script>