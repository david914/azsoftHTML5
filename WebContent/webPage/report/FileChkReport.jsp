<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<!-- Header -->
<div id="header"></div>

<div id="wrapper">
    <div class="content">    	
        <!-- history S-->
        <div id="history_wrap">보고서<strong>&gt; 파일대사결과조회</strong></div>
        <!-- history E-->    
        
        <div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="l_wrap width-70">
					<div class="vat dib">
						<label class="dib">조회일</label>
					</div>
					<div id="divPicker" class="az_input_group dib" data-ax5picker="basic">
			            <input id="dateSt" name="start_date" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
						<span class="sim">&sim;</span>
						<input id="dateEd" name="end_date" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
			            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
					</div>
					<div class="vat dib">
						<button id="btnChkSearch" name="btnChkSearch" class="btn_basic_s" style="cursor: pointer;" >대사기록조회</button>
					</div>
					
					<div class="width-40 vat dib" id="cboDiv">
						<div id="cboDiff" data-ax5select="cboDiff" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div> 
					</div>
					<div class="vat dib">
						<button id="btnExcel" name="btnExcel" class="btn_basic_s" style="cursor: pointer;" >엑셀저장</button>
					</div>
				</div>
			</div>
		</div>
		<div class="az_board_basic margin-10-top" style="height: 80%;">
			<div data-ax5grid="fileGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/FileChkReport.js"/>"></script>
	