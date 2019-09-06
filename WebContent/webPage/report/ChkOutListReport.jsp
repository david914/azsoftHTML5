<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<style>
.width-75 {
	width: calc(90% - 60px);
}
.block1 {
	width: calc(30% - 200px);
	min-width: 250px;
	margin-right: 20px;
}
label {
	min-width: 54px;
}
</style>

<div id="wrapper">
    <div class="contentFrame">
        <!-- history S-->
        <div id="history_wrap">보고서 <strong>&gt; 형상관리신청현황</strong></div>
        <!-- history E-->         
	    <!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="l_wrap width-70 dib">
	                <div class="por">
	                	<!--시스템S-->
	                	<div class="width-25 dib">
		                	<label class="dib">시스템　</label>
		                    <div id="systemSel" data-ax5select="systemSel" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-75 dib tal">
						    </div>
						</div>
	                	<div class="width-50 dib vat" style="">
		                	<label class="dib">프로그램경로</label>
		                    <input id="txtPath" data-ax-path="txtPath" type="text" class="width-75"/>
						</div>
					</div>
					<!--line2-->
					<div class="row">
						<div class="dib search_field">
							<div class="dib vat"><label></label></div>
							<div class="block1 dib por"></div>
							<!--신청인S-->
							<div class="dib vat width-11">
			                	<label>신청자</label>
			                </div>
			                <div class="dib vat">
								<input id="txtUser" data-ax-path="txtUser" type="text" />
							</div>
							<div class="dib vat">
			                	<label>경과일수</label>
								<input id="dayTerm" data-ax-path="dayTerm" type="text"/>
							</div>
						</div>
					</div>
				</div>
				<div class="r_wrap width-30 poa_r vat">
					<div class="row tar">
						<input type="checkbox" class="checkbox-pie" id="chkDay" data-label="신청일 기준"/>
						<div id="divPicker" data-ax5picker="basic" class="az_input_group dib">
							<input id="dateSt" name="start_date" type="text" placeholder="yyyy/mm/dd" style="width:92px;">
							<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
							<span class="sim">&sim;</span>
							<input id="dateEd" name="end_date" type="text" placeholder="yyyy/mm/dd" style="width:92px;">
							<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
						</div>
					</div>
					<div class="row tar">
						<div class="vat dib margin-5-left">
							<button class="btn_basic_s" id="btnExcel">엑셀저장</button>
						</div>
						<div class="vat dib margin-5-left">
							<button class="btn_basic_s" id="btnSearch">조회</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--검색E-->		

	    <!-- 게시판 S-->
	    <div class="az_board_basic">
	    	<div id="mainGrid" data-ax5grid="mainGrid" data-ax5grid-config="{}" style="width:100%; height: 600px;">
			</div>
		</div>
		<form name="popPam">
			<input type="hidden" name="acptno"/>
			<input type="hidden" name="user"/>
			<input type="hidden" name="itemid"/> 
			<input type="hidden" name="syscd"/>
			<input type="hidden" name="rsrccd"/>
			<input type="hidden" name="rsrcname"/>
		</form>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/ChkOutListReport.js"/>"></script>