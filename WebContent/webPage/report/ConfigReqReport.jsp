<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<style>
.width-75 {
	width: calc(90% - 60px);
}
</style>

<!-- contener S -->
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
	                	<div class="width-25 dib vat" style="">
		                	<label class="dib">신청번호</label>
		                    <input id="acptNo" data-ax-path="acptNo" type="text" class="width-75"/>
						</div>
						<!--SR-ID/SR명 S-->
						<div class="width-50 dib vat" style="">
		                	<label class="tit_100">SR-ID/SR명</label>
							<input id="srId" data-ax-path="srId" type="text" class="width-40" />
						</div>
					</div>
					<!--line2-->
					<div class="row">
						<!--시스템S-->
						<div class="width-25 dib">
							<label>신청구분</label>
							<div id="reqDivSel" data-ax5select="reqDivSel" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-75 dib tal">
								
						    </div>
						</div>	
						<!--신청부서S-->
						<div class="width-25 dib">
		                	<label>신청부서</label>
							<div id="reqDeptSel" data-ax5select="reqDeptSel" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-75 dib tal">
								
						    </div>
						</div>
						<!--신청인S-->
						<div class="width-50 dib vat">
		                	<label class="tit_100">신청자</label>
							<input id="reqUser" data-ax-path="reqUser" type="text"  class="width-40 " />
						</div>
					</div>
					<!--line3-->
					<div class="row">
						<!--진행상태S-->
						<div class="width-25 dib">
							<label>진행상태</label>
							<div id="statusSel" data-ax5select="statusSel" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-75 dib tal">
								
						    </div>
						</div>	
						<!--처리구분S-->
						<div class="width-25 dib">
		                	<label>처리구분</label>
							<div id="prcdDivSel" data-ax5select="prcdDivSel" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-75 dib tal">
								
						    </div>
						</div>
						<!--신청인S-->
						<div class="width-50 dib vat">
		                	<label class="tit_100">프로그램명/설명</label>
							<input id="descript" name="descript" type="text" class="width-40" />
						</div>
					</div>		
				</div>
				<div class="r_wrap width-30 poa_r vat">
					<div class="height-30 tar margin-right-50">
						<label class="wLabel-left" style="width: 0px;"></label>
						<input id="radioCkOut" name="radioGroup" tabindex="8" type="radio" value="optCkOut" checked="checked"/>
						<label for="radioCkOut" style="margin-right: 10px;">신청일기준</label>
						<input id="radioCkIn" name="radioGroup" tabindex="8" type="radio" value="optCkIn"/>
						<label for="radioCkIn">완료일기준</label>
					</div>
					<div class="row tar">
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
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/ConfigReqReport.js"/>"></script>