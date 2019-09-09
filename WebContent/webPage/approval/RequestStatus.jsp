<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
<div class="contentFrame">
    <!-- history S-->
    <div id="history_wrap">결재확인 <strong>&gt; 신청현황</strong></div>
    <!-- history E-->         
    <!-- 검색 S-->    
	<div class="az_search_wrap">
		<div class="az_in_wrap">
			<div class="l_wrap dib" style="width: 100%;">
                <div class="por">
                	<!--신청부서S-->
                	<div class="width-25 dib vat">
	                	<label class="tit-80 dib poa">신청부서</label>
	                	<div class="ml_80">
		                    <div id="cboDept" data-ax5select="cboDept" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
	                	</div>
					</div>
					<!--시스템S-->
					<div class="width-25 dib vat">
						<label class="tit-80 dib poa">&nbsp;&nbsp;&nbsp;시스템</label>
						<div class="ml_80">
							<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
						</div>
					</div>	
					<!--처리구분S-->
					<div class="width-25 dib vat">
	                	<label class="tit-80 dib poa">&nbsp;&nbsp;&nbsp;처리구분</label>
	                	<div class="ml_80">
							<div id="cboGbn" data-ax5select="cboGbn" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
	                	</div>
					</div>
					<!--신청자S-->
					<div class="width-25 dib vat">
	                	<label class="tit-80 dib poa">&nbsp;&nbsp;&nbsp;&nbsp;신청자</label>
	                	<div class="ml_80 vat">
							<input id="txtUser" type="text" placeholder="신청자을 입력하세요." class="width-100" />
	                	</div>
					</div>
				</div>
                <div class="row por">
                	<!--신청종류S-->
                	<div class="width-25 dib vat">
	                	<label class="tit-80 dib poa">신청종류</label>
	                	<div class="ml_80">
		                    <div id="cboSin" data-ax5select="cboSin" data-ax5select-config="{size:'sm', theme:'primary'}" style="width:100%;"></div> 	
	                	</div>
					</div>
					<!--진행상태S-->
					<div class="width-25 dib vat">
						<label class="tit-80 dib poa">&nbsp;&nbsp;&nbsp;진행상태</label>
						<div class="ml_80">
							<div id="cboSta" data-ax5select="cboSta" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
	                	</div>
					</div>
					<!--SR-ID/SR명 S-->
					<div class="width-50 dib vat">
	                	<label class="tit-80 dib poa">&nbsp;&nbsp;&nbsp;입력조건</label>
	                	<div class="ml_80 vat">
							<input id="txtSpms" type="text" placeholder="신청번호/SR-ID/SR명 을 입력하세요." class="width-100" />
	                	</div>
					</div>
				</div>
				<div class="row por">
					<div class="row thumbnail dib">
						<span class="r_nail">반려 또는 취소</span>
						<span class="p_nail">시스템처리 중 에러발생</span>
						<span class="g_nail">처리완료</span>
						<span class="b_nail">진행중</span>
					</div>	
					<div class="dib r_wrap">		
						<div class="dib vat">
							<input id="rdoStrDate"  type="radio" name="rdoDate" value="0" checked="checked"/>
							<label for="rdoStrDate" >신청일기준</label>
							<input id="rdoEndDate" type="radio" name="rdoDate" value="1"/>
							<label for="rdoEndDate">완료일기준</label>
						</div>		
						<div class="dib">
							<div id="divPicker" data-ax5picker="basic" class="az_input_group dib">
								<input id="datStD" name="datStD" type="text" placeholder="yyyy/mm/dd" style="width:100px;" class="f-cal" autocomplete="off">
								<button id="btnStD" class="btn_calendar"><i class="fa fa-calendar-o"></i></button>
								<span class="sim">∼</span>
								<input id="datEdD" name="datEdD" type="text" placeholder="yyyy/mm/dd" style="width:100px;" class="f-cal" autocomplete="off">
								<button id="btnEdD" class="btn_calendar"><i class="fa fa-calendar-o"></i></button>
							</div>
						</div>	
						<div class="dib vat">
							<div class="dib">
								<button class="btn_basic_s" data-grid-control="excel-export" id="btnExcel" style="margin-left: 5px; margin-right: 0px;">엑셀저장</button>
							</div>
							<div class="vat dib margin-5-left">
								<button class="btn_basic_s" id="btnQry" style="margin-left: 0px; margin-right: 0px;">조회</button>
							</div>
							<div class="vat dib margin-5-left">
								<button class="btn_basic_s" id="btnReset" style="margin-left: 0px; margin-right: 0px;">초기화</button>
							</div>
						</div>
					</div>
				</div>		
			</div>
		</div>
	</div>
	<!--검색E-->		
    <!-- 게시판 S-->
    <div class="az_board_basic" style="height: 80%">
    	<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
	</div>	
</div>
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/approval/RequestStatus.js"/>"></script>