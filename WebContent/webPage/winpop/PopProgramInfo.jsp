<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page errorPage="error.jsp" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ page import="com.ecams.common.base.StringHelper"%>
<%
	String userId = StringHelper.evl(request.getParameter("user"),"");
	String itemId = StringHelper.evl(request.getParameter("itemid"),"");
%>
<c:import url="/webPage/common/common.jsp" />
<!-- contener S -->
<div id="wrapper">
    <div class="content">    
		<!-- 하단 S-->
		<div class="half_wrap margin-10-top">
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
			<div style="height:38%"> <!--  tab_container -->
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
		<form name="getSrcData">
			<input type="hidden" name="user" value="<%=userId%>"/>
			<input type="hidden" name="itemid" value="<%=itemId%>"/>
		</form>
    </div>
</div>
<!-- 프로그램정보 보기 팝업 시 필요 데이터 -->
</body>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/winpop/PopProgramInfo.js"/>"></script>