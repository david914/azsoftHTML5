<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<div class="contentFrame">
	<div id="history_wrap">보고서<strong>&gt; 파일대사결과조회</strong></div>
      
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
			</div>
			<div class="r_wrap width-30">
				<div class="float-right vat dib">
					<button id="btnExcel" name="btnExcel" class="btn_basic_s" style="cursor: pointer;" >엑셀저장</button>
				</div>
				<div class="float-right dib" id="cboDiv" style="width: 50% !important;">
					<div id="cboDiff" data-ax5select="cboDiff" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
				</div>
			</div>
		</div>
	</div>
	<div class="az_board_basic margin-10-top" style="height: 88%;">
		<div data-ax5grid="fileGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/FileChkReport.js"/>"></script>
	