<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
<c:import url="/js/ecams/common/commonscript.jsp" />

<!-- contener S -->
<div id="wrapper">
    <div class="contentFrame">
        <!-- history S-->
        <div id="history_wrap">개발 <strong>&gt;??현황 </strong></div>
        <!-- history E-->         
	    <!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="l_wrap width-65 dib">
	                <div class="por">
	                	<!--신청부서S-->
	                	<div class="width-25 dib vat">
		                	<label class="dib poa">시스템</label>
		                	<div class="ml_100">
			                    <div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-90"></div>
		                	</div>
						</div>
						<!--시스템S-->
						<div class="width-25 dib vat">
							<label class="dib poa">진행상태</label>
							<div class="ml_100">
								<div id="cboStat" data-ax5select="cboStat" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-90"></div>
							</div>
						</div>	
						<!--처리구분S-->
						<div class="width-25 dib vat">
		                	<label class="dib poa" id="gbnLabel">처리구분</label>
		                	<div class="ml_100">
								<div id ="cboGbn" data-ax5select="cboGbn" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-90"></div>
		                	</div>
						</div>
					</div>
	                <div class="row por">
	                	<!--신청종류S-->
	                	<div class="width-25 dib vat">
		                	<label class="dib poa">신청종류</label>
		                	<div class="ml_100">
			                    <div data-ax5select="cboType" data-ax5select-config="{size:'sm', theme:'primary'}" class="width-90"></div> 	
		                	</div>
						</div>
						<!--진행상태S-->
						<div class="width-25 dib vat">
							<label class="dib poa">프로그램명/설명</label>
							<div class="ml_100 vat">
								<input id="txtDisc" type="text" placeholder="SR-ID/SR명을 입력하세요." class="width-90" />
		                	</div>
						</div>
						<!--SR-ID/SR명 S-->
						<div class="width-25 dib vat">
		                	<label class="dib poa">신청자명</label>
		                	<div class="ml_100 vat">
								<input id="txtName" type="text" placeholder="SR-ID/SR명을 입력하세요." class="width-90" />
		                	</div>
						</div>
						<div class="dib margin-5-top">
							<input id="checkSelf" tabindex="8" type="checkbox" value="optCkOut" style="margin-top: 5px;"s name="checkSelf"/>
							<label for="checkSelf" style="margin-top: -5px;">&nbsp;본인건만</label>
						</div>
					</div>					
					<div class="row thumbnail">
						<div class="width-35 dib">
							<span class="r_nail margin-10-top">반려 또는 취소</span>
							<span class="p_nail">시스템처리 중 에러발생</span>
							<span class="g_nail">처리완료</span>
							<span class="b_nail">진행중</span>
						</div>
						<div class="width-40 dib vat">
		                	<label class="dib poa">SR-ID/SR명/문서번호</label>
		                	<div class="ml_150 vat">
								<input id="txtId" type="text" placeholder="SR-ID/SR명을 입력하세요." class="width-100" />
		                	</div>
						</div>
					</div>			
				</div>
				<div class="r_wrap width-35 poa_r vat">
					<div class="height-30 tar">
						<input id="rdoStrDate"  type="radio" name="rdoDate" value="0" checked="checked"/>
						<label for="rdoStrDate" >신청일기준</label>
						<input id="rdoEndDate" type="radio" name="rdoDate" value="1"/>
						<label for="rdoEndDate">완료일기준</label>
					</div>
					<div class="row tar">
						<div id="divPicker" data-ax5picker="basic" class="az_input_group dib">
				            <input id="datStD" name="datStD" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
				            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
				            <span class="sim">∼</span>
				            <input id="datEdD" name="datEdD" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
				            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>		
						</div>
					</div>
					<div class="row tar">
						<div class="vat dib margin-5-left">
							<button class="btn_basic_s" data-grid-control="excel-export" id="btnExcel">엑셀저장</button>
						</div>
						<div class="vat dib margin-5-left">
							<button class="btn_basic_s" id="btnSearch">조회</button>
						</div>
						<div class="vat dib margin-5-left">
							<button class="btn_basic_s" id="btnReset">초기화</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--검색E-->		

	    <!-- 게시판 S-->
	    <div class="az_board_basic" style="height: 75%">
	    	<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
		</div>	
		<input type="hidden" id="param" value="${param.reqCd}">
	</div>
</div>

<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/dev/DistributeStatus.js"/>"></script>
