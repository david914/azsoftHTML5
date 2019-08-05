<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
<c:import url="/js/ecams/common/commonscript.jsp" />

<style>
.fontStyle-cncl {
	color: #d12832;
}
.fontStyle-rec {
	color: #f16832;
}
.fontStyle-dev {
	color: #00523d;
}
.fontStyle-test {
	color: #8f6fff;
}
.fontStyle-apply {
	color: #326aab;
}
.fontStyle-end {
	color: #2B2B2B;
}
</style>

<!-- contener S -->
<div id="wrapper">
    <div class="content">
        <!-- history S-->
        <div id="history_wrap">등록 <strong>&gt; SR진행현황</strong></div>
        <!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="l_wrap width-65 dib">
	                <div class="por">
	                	<!--요청부서S-->
	                	<div class="width-25 dib vat">
		                	<label class="tit-80 dib poa">요청부서</label>
		                	<div class="ml_80">
			                    <div id="cboDept1" data-ax5select="cboDept1" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		                	</div>
						</div>
						<!--SR상태S-->
						<div class="width-25 dib vat">
							<label class="tit-80 dib poa">&nbsp;&nbsp;&nbsp;&nbsp;SR상태</label>
							<div class="ml_80">
								<div id="cboSta1" data-ax5select="cboSta1" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
							</div>
						</div>	
						<!--SR-ID/SR명/문서번호S-->
						<div class="width-25 dib vat">
		                	<label class="tit-80 dib poa">&nbsp;&nbsp;&nbsp;&nbsp;SR-ID/SR명/문서번호</label>
		                	<div class="ml_80">
								<input id="txtTit" type="text" class="width-100" />
		                	</div>
						</div>
					</div>
	                <div class="row por">
	                	<!--등록부서S-->
	                	<div class="width-25 dib vat">
		                	<label class="tit-80 dib poa">등록부서</label>
		                	<div class="ml_80">
			                    <div data-ax5select="cboDept2" data-ax5select="cboDept2" data-ax5select-config="{size:'sm', theme:'primary'}" style="width:100%;"></div> 	
		                	</div>
						</div>
						<!--개발자상태S-->
						<div class="width-25 dib vat">
							<label class="tit-80 dib poa">&nbsp;&nbsp;&nbsp;&nbsp;개발자상태</label>
							<div class="ml_80">
								<div data-ax5select="cboSta2" data-ax5select="cboSta2" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		                	</div>
						</div>
					</div>					
					<div class="row thumbnail">
						<span class="r_nail">접수</span>
						<span class="p_nail">개발</span>
						<span class="g_nail">테스트</span>
						<span class="b_nail">적용</span>
						<span class="b_nail">처리완료</span>
						<span class="b_nail">반려 또는 취소</span>
					</div>			
				</div>
				<div class="r_wrap width-35 poa_r vat">
					<div class="height-30 tar">
						<input id="rdoAll"  type="radio" name="rdoDaeSang" value="0" checked="checked"/>
						<label for="rdoAll" >전체대상</label>
						<input id="rdoTeam" type="radio" name="rdoDaeSang" value="1"/>
						<label for="rdoTeam">팀내진행건</label>
						<input id="rdoMy" type="radio" name="rdoDaeSang" value="1"/>
						<label for="rdoMy">내진행건만</label>
					</div>
					<div class="row tar">
						<label class="tit-80 dib">등록일</label>
						<div id="divPicker" data-ax5picker="basic" class="az_input_group dib">
				            <input id="datStD" name="datStD" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
				            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
				            <span class="sim">∼</span>
				            <input id="datEdD" name="datEdD" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
				            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>		
						</div>
					</div>
					<div class="row tar">
						<div class="dib">
							<button class="btn_basic_s" data-grid-control="excel-export" id="btnExcel">엑셀저장</button>
						</div>
						<div class="vat dib margin-5-left">
							<button class="btn_basic_s" id="btnQry">조회</button>
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
	    <div class="az_board_basic" style="height: 85%">
	    	<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 82%;"></div>
		</div>	
	</div>
</div>

<form name="popPam">
	<input type="hidden" name="srid"/>
	<input type="hidden" name="user"/>
</form>

<script type="text/javascript" src="<c:url value="/js/ecams/register/SRStatus.js"/>"></script>