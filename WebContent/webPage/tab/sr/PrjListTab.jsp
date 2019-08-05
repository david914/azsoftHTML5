<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:import url="/webPage/common/common.jsp" />
<!-- 검색 S-->
<div class="az_search_wrap">
	<div class="az_in_wrap sr_status">
		<div class="l_wrap width-48 dib vat">
			<!-- 요청부서 -->
			<div class="width-30 dib">
				<label id="lbReqDepart">요청부서</label>
				<div id="cboReqDepart" data-ax5select="cboReqDepart"
					data-ax5select-config="{size:'sm',theme:'primary'}"
					class="width-15 dib" style="width: 50%;"></div>
			</div>
			<!-- 분류유형 -->
			<div class="width-30 dib">
				<label id="lbCatType">분류유형</label>
				<div id="cboCatType" data-ax5select="cboCatType"
					data-ax5select-config="{size:'sm',theme:'primary'}"
					class="width-15 dib" style="width: 50%;"></div>
			</div>
			<!-- 대상구분 -->
			<div class="width-30 dib">
				<label id="lbQryGbn">대상구분</label>
				<div id="cboQryGbn" data-ax5select="cboQryGbn"
					data-ax5select-config="{size:'sm',theme:'primary'}"
					class="width-15 dib" style="width: 50%;"></div>
			</div>
		</div>
		<div class="r_wrap width-48 dib vat">
			<label id="lbAcptDate">등록일</label>
			<div id="divPicker" data-ax5picker="basic" class="az_input_group dib">
				<input id="datStD" name="datStD" type="text"
					placeholder="yyyy/mm/dd" style="width: 100px;"> <span
					class="btn_calendar"><i class="fa fa-calendar-o"></i></span> <span
					class="sim">∼</span> <input id="datEdD" name="datEdD" type="text"
					placeholder="yyyy/mm/dd" style="width: 100px;"> <span
					class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
			</div>
			<div class="vat dib margin-5-left">
				<!---수정-->
				<button id="btnQry" name="btnQry" class="btn_basic_s">조회</button>
			</div>
			<div class="vat dib margin-5-left">
				<!---수정-->
				<button id="btnReset" name="btnReset" class="btn_basic_s">초기화</button>
			</div>
		</div>
	</div>
</div>
<!-- 검색 E-->
<!-- 게시판 S-->
<div class="az_board_basic" style="height: 65%">
	<div data-ax5grid="firstGrid"
		data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}"
		style="height: 100%;"></div>
</div>
<!-- 게시판 E -->

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"
	src="<c:url value="/js/ecams/tab/SR/PrjListTab.js"/>"></script>
