<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page errorPage="error.jsp" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ page import="com.ecams.common.base.StringHelper"%>
<link type="text/css" rel="stylesheet" href="/vendor/highlight/styles/vs.css" />
<script type="text/javascript" src="/vendor/highlight/highlight.pack.js"></script>
<%
	String acptNo = StringHelper.evl(request.getParameter("acptno"),"");
	String userId = StringHelper.evl(request.getParameter("user"),"");
	String itemId = StringHelper.evl(request.getParameter("itemid"),"");
%>
<c:import url="/webPage/common/common.jsp" />

<!-- contener S -->
<div id="wrapper">
    <div class="content">
        <!-- line1 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap por">
				<!-- 시스템 -->		
                <div class="width-25 dib vat">
                    <label id="lbSystem" style="width:50px;" class=" poa">시스템</label>
                    <div style="margin-left: 50px;">
						<input id="txtSysMsg" name="txtSysMsg" type="text" class="width-95 dib" >
					</div>
				</div>
			    <!-- 프로그램명 -->
                <div class="width-25 dib vat">
                    <label id="lbRsrcName" style="width:70px;" class="poa">프로그램명</label>
                    <div style="margin-left: 70px;">
						<input id="txtProgId" name="txtProgId" type="text" class="width-95 dib" >
					</div>
				</div>					
				<div class="width-50 dib vat">
				    <!-- 프로그램경로 -->
                    <div class="vat">
                        <label id="lbDirPath" class="tit_80 poa">프로그램경로</label>
						<div class="ml_80">
							<input id="txtDir" name="txtDir" type="text" class="width-100" style="width:calc(100% - 75px);" >
						</div>
						<button id="btnSrcDown" name="btnSrcDown" class="btn_basic margin-5-left margin-10-right poa_r" style="height:25px;padding: 0 7px 2px;">소스다운</button>
					</div>					
				</div>
			</div>
		</div>
		<!--line1 E-->
		<!-- line2 S-->
		<div class="half_wrap_cb" style="margin-top: 0px;">
			<div class="l_wrap width-70">
			    <div class="az_board_basic" style="height:150px;">
			    	<div data-ax5grid="grdProgHistory" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
				</div>	
			</div>
			<div class="l_wrap" style="height:150px;margin-left: 5px;width:calc(30% - 5px);">
				<textarea id="txtSayu" name="txtSayu" style="align-content:left;width:100%;height:100%;resize: none;"></textarea>
			</div>
		</div>
		<!-- line3 S -->
		<div class="row" style="height:calc(100% - 250px);"  >
			<textarea id="txtSrc" name="txtSrc" readonly="readonly" style="align-content:left;width:100%;height:100%;resize: none;"></textarea>
		</div>
		<!-- line3 E -->
	</div>
</div>

<form name="getSrcData">
	<input type="hidden" name="acptno" value="<%=acptNo%>"/>
	<input type="hidden" name="user" value="<%=userId%>"/>
	<input type="hidden" name="itemid" value="<%=itemId%>"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"	src="<c:url value="/js/ecams/winpop/PopSourceView.js"/>"></script>