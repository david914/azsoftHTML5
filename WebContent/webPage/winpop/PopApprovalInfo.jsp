<%@page import="com.ecams.common.base.StringHelper"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<%
	request.setCharacterEncoding("UTF-8");
	String userId = StringHelper.evl(request.getParameter("user"),"");
	String acptNo = StringHelper.evl(request.getParameter("acptno"),"");
%>
<body style="width: 100% !important; padding: 10px;">
	<div class="content">    	
		<div id="history_wrap">공통<strong>&gt; 결재정보</strong></div>
		     
		<div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="row vat">
					<label class="tit_80 poa">신청번호</label>
					<div class="ml_80 vat">
						<input type="text" class="width-30" id="txtAcpt" readonly>
						<input type="text" class="width-70" id="txtLocatCncl" readonly>
					</div>
				</div>
				
				<div class="row vat">
					<label class="tit_80 poa">현재상황</label>
					<div class="ml_80 vat">
						<input type="text" class="width-100" id="txtLocat" readonly>
					</div>
				</div>
			</div>
		</div>
		<div class="row vat">
			<div class="width-100 dib">
				<div class="az_board_basic" style="height: 67%;">
					<div data-ax5grid="approvalGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
				</div>
			</div>
		</div>
		<div class="row vat">
			<div class="width-25 dib vat">
				<label class="tit_80 poa" id="lblBlank">변경후결재</label>
				<div class="ml_80 vat" id="divBlank">
					<div id="cboBlank" data-ax5select="cboBlank" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
				</div>
			</div>
			<div class="width-25 dib vat">
				<label class="tit_80 poa" id="lblSayu">사유구분</label>
				<div class="ml_80 vat" id="divSayu">
					<div id="cboSayu" data-ax5select="cboSayu" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
				</div>
			</div>
			<div class="width-25 dib vat" id="divUser">
				<label class="tit_80 poa">대결재</label>
				<div class="ml_80 vat">
					<div id="cboUser" data-ax5select="cboUser" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
				</div>
			</div>
			<div class="width-23 dib vat margin-10-bottom">
				<div class="vat dib" style="float: right;">
					<button class="btn_basic_s" id="btnUpdate">수정</button>
					<button class="btn_basic_s" id="btnClose">닫기</button>
				</div>
			</div>
		</div>
		
	</div> 
</body>

<input type="hidden" id="userId" name="userId" 	value="<%=userId%>"/>
<input type="hidden" id="acptNo" name="acptNo"  value="<%=acptNo%>"/>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"	src="<c:url value="/js/ecams/winpop/PopApprovalInfo.js"/>"></script>