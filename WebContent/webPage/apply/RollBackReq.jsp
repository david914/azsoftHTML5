<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<style>
.fontStyle-notaccess {
	color: #d12832;
}
.fontStyle-module {
	color: #FF8080;
}
</style>

<body style="padding: 10px;">
    <div class="content">
        <!-- history S-->
        <div id="history_wrap">적용 <strong>&gt; RollBack요청</strong></div>
		<!-- 설명1 -->
		<div class="width-100 float-left margin-5-top por" style="height: 30px;">
           	<label class="tit-80 dib poa">운영배포신청목록 조회</label>
		</div>
        <!-- 검색 S-->
        <div class="az_search_wrap" style="margin: 0px;">
			<div class="az_in_wrap">
				<div class="l_wrap width-25 dib">
	                <div class="por">
						<!--시스템S-->
		               	<div class="width-100 dib vat">
		                	<label class="tit-80 dib poa">시스템</label>
		                	<div class="ml_80">
			                    <div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:90%;"></div>
		                	</div>
						</div>
					</div>
				</div>
				<div class="r_wrap width-75">
					<label class="tit-80 dib">운영적용일</label>
					<div id="divPicker" data-ax5picker="basic" class="az_input_group dib">
				        <input id="datStD" name="datStD" type="text" class="f-cal" placeholder="yyyy/mm/dd" style="width:100px;">
						<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
						<span class="sim">&sim;</span>
				        <input id="datEdD" name="datEdD" type="text" class="f-cal" placeholder="yyyy/mm/dd" style="width:100px;">
						<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
					</div>
					<div class="vat dib margin-5-left">
						<button class="btn_basic_s" id="btnQry">조회</button>
					</div>
				</div>
			</div>
		    <!-- 롤백가능 운영적용신청 목록 S-->
		    <div class="az_board_basic" style="height:25%; padding-top:10px;">
		    	<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
			</div>
		</div>
		<!-- 설명2 -->
		<div class="width-100 float-left margin-5-top por" style="height: 30px;">
           	<label class="tit-80 dib poa">롤백대상 프로그램목록 선택 및 신청</label>
		</div>
		
        <div class="az_search_wrap" style="margin: 0px;">
		    <!-- 선택한 운영적용신청 프로그램목록 S-->
		    <div class="az_board_basic margin-5-top" style="height:50%">
		    	<div data-ax5grid="secondGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
			</div>
			<!--
			//목록 추가/제거버튼
			<div class="width-100 float-left margin-5-top por" style="height: 30px;">
				<div class="dib poa_r">
					<button class="btn_basic_s" id="btnAdd">추가</button><button class="btn_basic_s margin-5-left" id="btnDel">제거</button>
				</div>
		    </div>
		    //롤백대상 프로그램추가
		    <div class="az_board_basic margin-5-top" style="height: 28%">
		    	<div data-ax5grid="thirdGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
			</div>
			-->
			<!-- 신청사유 S -->
		    <div class="width-100 float-left margin-10-top por">
		    	<div class="dib" style="width: calc(100% - 77px);">
		           	<label class="tit-80 dib poa">신청사유</label>
		           	<div class="ml_80">
						<input id="txtSayu" type="text" placeholder="신청사유를 입력하세요." class="width-100"/><!-- Style="width: 80px;" -->
		           	</div>
	           	</div>
				<div class="dib poa_r">
					<button class="btn_basic_s" id="btnReq">롤백신청</button>
				</div>
		    </div>
		</div>
	</div>
</body>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/apply/RollBackReq.js"/>"></script>