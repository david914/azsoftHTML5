<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">  	
	<div id="history_wrap">보고서<strong>&gt; 파일대사불일치현황</strong></div>
	     
	<div class="az_search_wrap">
		<div class="az_in_wrap">
			<div class="l_wrap width-70">
				<div class="vat dib vat">
					<input type="checkbox" class="checkbox-file" id="chkDate" data-label="특정일 조회"/>
				</div>
				<div class="vat dib ">
					<label>조회기간</label>
				</div>
				<div id="divPicker" class="az_input_group dib" data-ax5picker="basic">
					<input id="dateSt" name="start_date" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
					<span class="sim">&sim;</span>
					<input id="dateEd" name="end_date" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
					<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
				</div>
				<div class="vat dib">
					<label class="margin-10-left">불일치연속일수</label>
				</div>
				<div class="vat dib">
					<input id="txtErr" type="text" class="width-30">
				</div>
			</div>
			<div class="r_wrap">
				<div class="vat dib">
					<button id="btnExcel" name="btnExlTmp" class="btn_basic_s float-right" style="cursor: pointer;">엑셀저장</button>
				</div>
				<div class="vat dib margin-5-left">
					<button id="btnQry" name="btnQry" class="btn_basic_s float-right" style="cursor: pointer;">조회</button>
				</div>
			</div>
		</div>
	</div>
	<div class="az_board_basic" style="height: 70%;">
		<div data-ax5grid="fileGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
	</div>
	
	<div class="az_search_wrap">
		<div class="az_in_wrap">
			<div class="sm-row vat">
				<div class="width-20 dib">
					<div class="tit_100 poa">
						<label>시스템명</label>
					</div>
					<div class="ml_100">
						<input id="txtSys" type="text" class="width-100">
					</div>
					<div class="vat dib"></div>
				</div>
				<div class="width-20 dib tar">
					<div class="tit_80 poa">
						<label>프로그램명</label>
					</div>
					<div class="ml_80">
						<input id="txtPrg" type="text" class="width-100">
					</div>
					<div class="vat dib"></div>
				</div>
				
				<div class="width-20 dib tar">
					<div class="tit_80 poa">
						<label>서버IP</label>
					</div>
					<div class="ml_80">
						<input id="txtIp" type="text" class="width-100">
					</div>
					<div class="vat dib"></div>
				</div>
				
				<div class="width-20 dib tar">
					<div class="tit_80 poa">
						<label>불일치일자</label>
					</div>
					<div class="ml_80">
						<input id="txtErrDate" type="text" class="width-100">
					</div>
					<div class="vat dib"></div>
				</div>
			</div>
				
			<div class="sm-row">
				<div class="width-80 dib" style="width: 80% !important;">
					<div class="tit_100 poa">
						<label>프로그램 경로</label>
					</div>
					<div class="ml_100">
						<input id="txtDir" type="text" class="width-100">
					</div>
				</div>
			</div>
				
			<div class="sm-row vat">
				<div class="width-80 dib" style="width: 80%">
					<div class="ml_100" style="white-space: nowrap;">
						<label class="fontStyle-ing">*온라인 긴급상황 발생에 따른 담당자의 프로그램 수정, 야간배치작업을 위한 담당자의 프로그램 수정 등의 불일치 발생사유 입력</label>
					</div>
				</div>
			</div>
				
			<div class="sm-row vat">
				<div class="width-60 dib">
					<div class="tit_100 poa">
						<label>불일치 발생사유</label>
					</div>
					<div class="ml_100">
						<div id="cboDiffSayu" data-ax5select="cboDiffSayu" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
					</div>
				</div>
				<div class="width-20 dib vat">
					<input id="txtDiffSayu" type="text" class="width-100">
					<div class="vat dib"></div>
				</div>
				<div class="width-20 dib vat">
					<div>
						<div class="vat dib float-right">
							<button id="btnDel" name="btnDel" class="btn_basic_s">삭제</button>
							<button id="btnReq" name="btnReq" class="btn_basic_s margin-5-left">등록</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/FileMismatchReport.js"/>"></script>
	