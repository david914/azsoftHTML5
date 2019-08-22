<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page errorPage="error.jsp" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ page import="com.ecams.common.base.StringHelper"%>
<%
	String userId = StringHelper.evl(request.getParameter("user"),"");
	String itemId = StringHelper.evl(request.getParameter("itemid"),"");
%>
<c:import url="/webPage/common/common.jsp" />

<body style="padding: 10px;height: 330px;">
    <div class="content" style="height: 100%;">
        <div id="history_wrap">	프로그램 <strong>&gt; 프로그램정보</strong></div>
		<!-- 하단 S-->
		<div class="az_search_wrap" style="height:calc(100% - 10px);">
			<div class="az_in_wrap" style="height: 100%;">
				<!-- tab_기본정보 S-->
				<div class="tab_wrap">
					<ul class="tabs">
						<li rel="tabProgBase" id="tab1" class="on" style="vertical-align: middle;">기본정보</li>
						<li rel="tabProgHistory" id="tab2" style="vertical-align: middle;">변경내역</li>
						<div class="r_wrap">
							<button id="btnExit" name="btnExit" class="btn_basic_n" style="float:right">닫기</button>
						</div>
					</ul>
				</div>
				<!-- tab E-->			
				<div> <!--  tab_container -->
			       	<!-- 프로그램기본정보 -->
			       	<div id="tabProgBase" class="tab_content" style="width:100%">
			       		<iframe id="frmProgBase" name="frmProgBase" src='/webPage/tab/programinfo/ProgBaseTab.jsp' width='100%' height='100%' frameborder="0" scrolling="no" ></iframe>
			       	</div>
			       	<!-- 프로그램기본정보  END -->
			       	
			       	<!-- 변경내역 START -->
			       	<div id="tabProgHistory" class="tab_content" style="width:100%">
			       		<iframe id="frmProgHistory" name="frmProgHistory" src='/webPage/tab/programinfo/ProgHistoryTab.jsp' width='100%' height='100%' frameborder="0" scrolling="no"></iframe>
			       	</div>
			       	<!-- 변경내역 END -->
			   	</div>
			</div>
		</div>
    </div>
<!-- 프로그램정보 보기 팝업 시 필요 데이터 -->
</body>
<form name="getSrcData">
	<input type="hidden" name="user" value="<%=userId%>"/>
	<input type="hidden" name="itemid" value="<%=itemId%>"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/winpop/PopProgramInfo.js"/>"></script>