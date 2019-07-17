<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<style>
.color-red {
	color: red;
	font-weight: bold;
}
</style>

<c:import url="/webPage/common/common.jsp" />

<div id="header"></div>
<div id="wrapper">
	<div class="content">
		<div id="history_wrap">보고서 <strong>&gt; 개발자별현황</strong></div>
		<div class="az_search_wrap">
			<div class="az_in_wrap sr_status">
				<div class="l-wrap width-100 vat">
					<div>
						<div class="width-43 dib por"></div>

						<div class="width-30 dib por">
							<div class="poa">
	                        	<label>[날짜선택 컴포넌트 들어갈 자리]</label>
	                        </div>
						</div>
						<div class="width-20 dib vat">
							<div class="vat dib margin-10-right float-right"><!--수정-->
								<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnSearch">조회</button>
							</div>
						</div>
					</div>					
				</div>						
			</div>
		</div>	
	</div>
	
	<div class="az_board_basic margin-15-left" style="width: 98%;">
		<label >*부서별 의뢰 현황</label>
		<div id="mainGrid1" data-ax5grid="mainGrid1" data-ax5grid-config="{}" style="width:100%; height: 200px;">
		
		</div>
		<label>*업무 등급별 처리현황(S:4주~, A:3~4주, B:2~3주, C:1주, D:단순업무)</label>
		<div id="mainGrid2" data-ax5grid="mainGrid2" data-ax5grid-config="{}" style="width:100%; height: 200px;">
		
		</div>
		<label>*연구소 실 별 처리 현황</label>
		<div id="mainGrid3" data-ax5grid="mainGrid3" data-ax5grid-config="{}" style="width:100%; height: 200px;">
		
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/DevGradeReport.js"/>"></script>