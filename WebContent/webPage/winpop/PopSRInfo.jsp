<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp"/>

<!-- contener S -->
<body style="padding: 10px !important; width: 100% !important; min-width: 0px !important;">
    <div class="content">
        <!-- history S-->
        <div id="history_wrap">요구관리 <strong>&gt; SR정보</strong></div>
        <!-- history E-->         
	    
	    <!-- PrjListTab.jsp -->
	    <div class="az_board_basic" style="height:5%">
			<div class="l_wrap width-10 dib vat" style="width:100%; height:100%">
				<div class="width-15 dib">
					<label>SR-ID</label>
					<input id="txtSRID" type="text" disabled="disabled">
				</div>

				<div class="width-30 dib">
					<label>SR명</label>
					<input id="txtSRTitle" type="text" disabled="disabled" class="width-80">
				</div>

				<div class="width-20 dib">
					<label>상태</label>
					<input id="txtSRSta" type="text" disabled="disabled">
				</div>
    		</div>
	    </div>
	    
		<!-- 하단 S-->
		<div class="half_wrap margin-10-top" style="height: 90%">
			<!-- tab S-->
			<div class="tab_wrap">
				<ul class="tabs">
					<li rel="tabSRRegister" id="tab1">SR등록/접수</li>
					<li rel="tabDevPlan" id="tab2" class="on">개발계획/실적등록</li>
					<li rel="tabReqHistory" id="tab3">변경요청이력</li>
					<li rel="tabPrgList" id="tab4">프로그램목록</li>
					<li rel="tabTestCase" id="tab5">단위테스트</li>
					<li rel="tabDevCheck" id="tab6">개발검수</li>
					<li rel="tabMoniteringCheck" id="tab7">모니터링체크</li>
					<li rel="tabSRComplete" id="tab8">SR완료</li>
				</ul>
			</div>
			<!-- tab E-->
			
			<div class="half_wrap margin-10-top" style="height:80%"> <!--  tab_container -->
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
		       	
		       	<!-- 단위테스트 START -->
		       	<div id="tabTestCase" class="tab_content" style="width:100%">
		       		<iframe id="frmTestCase" name="frmTestCase" src='/webPage/tab/SR/TestCaseTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 단위테스트 END -->
		       	
		       	<!-- 개발검수 START -->
		       	<div id="tabDevCheck" class="tab_content" style="width:100%">
		       		<iframe id="frmDevCheck" name="frmDevCheck" src='/webPage/tab/SR/DevCheckTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 개발검수 END -->
		       	
		       	<!-- 모니터링체크 START -->
		       	<div id="tabMoniteringCheck" class="tab_content" style="width:100%">
		       		<iframe id="frmMoniteringCheck" name="frmMoniteringCheck" src='/webPage/tab/SR/MoniteringCheckTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 모니터링체크 END -->
		       	
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

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/winpop/PopSRInfo.js"/>"></script>