<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div id="wrapper">
	<!-- Header -->
	<div id="header"></div>
    <div class="content">    	
        <!-- history S-->
        <div id="history_wrap">관리자<strong>&gt; 프로퍼티관리</strong></div>
        <!-- history E-->    
        
        <div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="l_wrap width-70">
					<div class="vat dib">
						<label class="dib">구분</label>
					</div>
					<div class="width-30 vat dib">
						<div id="cboCode" data-ax5select="cboCode" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div> 
					</div>
					<div class="vat dib">
						<button id="btnSave" class="btn_basic_s" style="cursor: pointer;">Properties저장</button>
					</div>
				</div>	
				<div class="r_wrap">
				</div>
			</div>
		</div>
		<div class="az_board_basic margin-10-top" style="height: 60%;">
			<div data-ax5grid="proGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>
		
		<div class="az_search_wrap margin-10-top">
			<div class="az_in_wrap">
				<div class="l_wrap width-90">
					<div class="vat dib">
						<label class="dib">DBCONN</label>
					</div>
					<input id="txtConn" name="txtConn" type="password" class="width-20">
					<div class="vat dib">
						<label class="dib">DBUSER</label>
					</div>
					<input id="txtUser" name="txtUser" type="password" class="width-20">
					<div class="vat dib">
						<label class="dib">DBPASS</label>
					</div>
					<input id="txtPass" name="txtPass" type="password" class="width-20">
					<button id="btnSvrSave" class="btn_basic_s" style="cursor: pointer;">Properties저장</button>
				</div>	
			</div>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/PropertyManage.js"/>"></script>
	