<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div id="wrapper">
	<!-- Header -->
	<div id="header"></div>
    <div class="content">    	
        <!-- history S-->
        <div id="history_wrap">관리자<strong>&gt; Agent모니터링</strong></div>
        <!-- history E-->    
        
        <div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="l_wrap width-70">
					<div class="vat dib">
						<label class="dib">시스템</label>
					</div>
					<div class="width-30 vat dib">
						<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div> 
					</div>
					<div class="dib">
						<input id="optAll"  type="radio" name="radio" value="1"/>
						<label for="optAll">전체</label>
						<input id="optNormal" type="radio" name="radio" value="2"/>
						<label for="optNormal">정상</label>
						<input id="optErr" type="radio"  name="radio" value="3"/>
						<label for="optErr">장애</label>
					</div>
				</div>	
				<div class="r_wrap">
					<div class="vat dib">
						<button id="btnExcel" name="btnReg" class="btn_basic_s" style="cursor: pointer;" >엑셀저장</button>
					</div>
					<div class="vat dib">
						<button id="btnQry" class="btn_basic_s" style="cursor: pointer;">조회</button>
					</div>
				</div>
			</div>
		</div>
		<div class="az_board_basic margin-10-top" style="height: 80%;">
			<div data-ax5grid="agentGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/AgentMornitoring.js"/>"></script>
	