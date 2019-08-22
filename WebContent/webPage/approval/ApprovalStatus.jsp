<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
	<div id="history_wrap">결재확인<strong>&gt; 결재현황</strong></div>
	
	<div class="az_search_wrap">
		<div class="az_in_wrap">
			<div class="l_wrap dib" style="width: 100%;">
                <div class="por">
					<div class="width-25 dib vat">
						<label class="tit_80 poa">시스템</label>
						<div class="ml_80">
							<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
						</div>
					</div>
					<div class="width-25 dib vat">
						<label class="tit_80 poa">&nbsp;&nbsp;&nbsp;신청종류</label>
						<div class="ml_80">
							<div id="cboAppro" data-ax5select="cboAppro" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
						</div>
					</div>
					
					<div class="width-25 dib vat">
						<label class="tit_80 poa">&nbsp;&nbsp;&nbsp;처리구분</label>
						<div class="ml_80">
							<div id="cboReq" data-ax5select="cboReq" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
						</div>
					</div>
					
					<div class="width-25 dib vat">
						<label class="tit_80 poa">&nbsp;&nbsp;&nbsp;신청자</label>
						<div class="ml_80">
							<input id=txtUser type="text" class="width-100" placeholder="신청자을 입력하세요.">
						</div>
						<div class="vat dib"></div>
					</div>
				</div>
                <div class="row por">
					<div class="width-25 dib vat">
						<label class="tit_80 poa">신청부서</label>
						<div class="ml_80">
							<div id="cboApproDe" data-ax5select="cboApproDe" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
						</div>
					</div>
					<div class="width-25 dib vat">
						<label class="tit_80 poa">&nbsp;&nbsp;&nbsp;결재상태</label>
						<div class="ml_80 tal">
							<div id="cboApproSta" data-ax5select="cboApproSta" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
						</div>
					</div>
					
					<div class="width-25 dib vat">
						<label class="tit_80 poa">&nbsp;&nbsp;&nbsp;진행상태</label>
						<div class="ml_80 tal">
							<div id="cboPrc" data-ax5select="cboPrc" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
						</div>
					</div>
					
					<div class="width-25 dib vat">
						<label class="tit_80 poa">&nbsp;&nbsp;&nbsp;SR-ID/SR명</label>
						<div class="ml_80">
							<input id=txtSr type="text" class="width-100" placeholder="SR-ID/SR명을 입력하세요.">
						</div>
						<div class="vat dib"></div>
					</div>
				</div>
				<div class="row por">
					<div class="row thumbnail dib">
						<span class="r_nail">반려 또는 취소</span>
						<span class="p_nail">시스템처리 중 에러발생</span>
						<span class="g_nail">처리완료</span>
						<span class="b_nail">진행중</span>
					</div>
					<div class="dib r_wrap" style="margin-top: 5px;">		
						<div class="dib vat">
							<input id="optReq"  type="radio" name="radio"  value="0"/>
							<label for="optReq">신청일기준</label>
							<input id="optDep" type="radio"  name="radio"  value="2"/>
							<label for="optDep">적용예정일기준</label>
							<input id="optAppro" type="radio"  name="radio"  value="1"/>
							<label for="optAppro">결재일기준</label>
						</div>
						<div class="dib">
							<div id="divPicker" class="az_input_group dib" data-ax5picker="basic">
								<input id="dateSt" name="start_date" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
								<button class="btn_calendar"><i class="fa fa-calendar-o"></i></button>
								<span class="sim">&sim;</span>
								<input id="dateEd" name="end_date" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
								<button class="btn_calendar"><i class="fa fa-calendar-o"></i></button>
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
								<button class="btn_basic_s" id="btnInit" style="margin-left: 0px; margin-right: 0px;">초기화</button>
							</div>
						</div>
					</div>		
				</div>
			</div>
		</div>
	</div>
	<div class="az_board_basic" style="height: 78%;">
		<div data-ax5grid="approGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
	</div>
</div>
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
	<input type="hidden" name="srid"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/approval/ApprovalStatus.js"/>"></script>