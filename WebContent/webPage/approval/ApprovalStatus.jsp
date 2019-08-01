<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
	<div id="history_wrap">결재확인<strong>&gt; 결재현황</strong></div>
	
	<div class="az_search_wrap">
		<div class="az_in_wrap">
			<div class="row vat">
				<div class="width-25 dib">
					<div class="tit_80 poa">
						<label>시스템</label>
					</div>
					<div class="ml_80">
						<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
					</div>
				</div>
				<div class="width-20 dib tar">
					<div class="tit_80 poa">
						<label>결재사유</label>
					</div>
					<div class="ml_80 tal">
						<div id="cboAppro" data-ax5select="cboAppro" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
					</div>
				</div>
				
				<div class="width-20 dib tar">
					<div class="tit_80 poa">
						<label>처리구분</label>
					</div>
					<div class="ml_80 tal">
						<div id="cboReq" data-ax5select="cboReq" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
					</div>
				</div>
				
				<div class="width-25 dib tar">
					<div class="tit_100 poa">
						<label>신청인</label>
					</div>
					<div class="ml_100 tal">
						<input id=txtUser type="text" class="width-100">
					</div>
					<div class="vat dib"></div>
				</div>
				
				<div class="width-10 dib tar">
					<div class="vat dib" style="float: right;">
						<button id="btnExcel" class="btn_basic_s" style="width: 70px;">엑셀저장</button>
					</div>
				</div>
			</div>
			
			<div class="row vat">
				<div class="width-25 dib">
					<div class="tit_80 poa">
						<label>신청부서</label>
					</div>
					<div class="ml_80">
						<div id="cboApproDe" data-ax5select="cboApproDe" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
					</div>
				</div>
				<div class="width-20 dib tar">
					<div class="tit_80 poa">
						<label>결재상태</label>
					</div>
					<div class="ml_80 tal">
						<div id="cboApproSta" data-ax5select="cboApproSta" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
					</div>
				</div>
				
				<div class="width-20 dib tar">
					<div class="tit_80 poa">
						<label>진행상태</label>
					</div>
					<div class="ml_80 tal">
						<div id="cboPrc" data-ax5select="cboPrc" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
					</div>
				</div>
				
				<div class="width-25 dib tar">
					<div class="tit_100 poa">
						<label>SR-ID/SR명</label>
					</div>
					<div class="ml_100 tal">
						<input id=txtSr type="text" class="width-100">
					</div>
					<div class="vat dib"></div>
				</div>
				
				<div class="width-10 dib tar">
					<div class="vat dib" style="float: right;">
						<button id="btnQry" class="btn_basic_s" style="width: 70px;">조&emsp;&emsp;회</button>
					</div>
				</div>
			</div>
			
			<div class="row vat">
				<div class="width-45 dib vat">
					<div class="row thumbnail">
						<div class="ml_80">
							<span class="r_nail">반려 또는 취소</span>
							<span class="p_nail">시스템처리 중 에러발생</span>
							<span class="g_nail">처리완료</span>
							<span class="b_nail">진행중</span>
						</div>
					</div>	
				</div>
				
				<div class="width-45 dib vat  tar">
					<div class="dib vat margin-3-top">
						<input id="optReq"  type="radio" name="radio"  value="0"/>
						<label for="optReq">신청일기준</label>
						<input id="optDep" type="radio"  name="radio"  value="2"/>
						<label for="optDep">적용예정일기준</label>
						<input id="optAppro" type="radio"  name="radio"  value="1"/>
						<label for="optAppro">결재일기준</label>
					</div>
					<div id="divPicker" class="az_input_group dib" data-ax5picker="basic">
						<input id="dateSt" name="start_date" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
						<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
						<span class="sim">&sim;</span>
						<input id="dateEd" name="end_date" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
						<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
					</div>
				</div>
				
				<div class="width-10 dib tar">
					<div class="vat dib" style="float: right;">
						<button id="btnInit" class="btn_basic_s" style="width: 70px;">초&nbsp;기&nbsp;화</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="az_board_basic margin-10-top" style="height: 75%;">
		<div data-ax5grid="approGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
	</div>
</div>
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/approval/ApprovalStatus.js"/>"></script>