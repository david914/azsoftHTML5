<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<style>
.year-btn {
	height: 12px; 
	width: 15px; 
	font-size: 1pt;
	background: inherit;
}
.month-btn {
	height: 25px;
	width: 25px; 
	background: inherit;
	border: 1px;
	border-radius: 50%;
}

.dateBtn:hover {
	text-shadow: 0 0 2px red;
}

.dateBtn:active {
	padding-top : 2px;
	color: #fff;
}
.date-div {
	background: #fff;
	border: 1px solid lightgray;
	text-align: center;
}
.mb-div {
	padding-bottom: 3px;
}
</style>

<div id="header"></div>
<div id="wrapper">
	<div class="content">
		<div id="history_wrap">보고서 <strong>&gt; 개발자별현황</strong></div>
		<div class="az_search_wrap">
			<div class="az_in_wrap sr_status">
				<div class="l-wrap width-100 vat">
					<div>
						<div class="width-15 dib por">
							<div class="poa">
	                        	<label>*연구소 실 별</label>
						    </div>
						</div>
						<div class="width-15 dib por">
							<div class="poa">
	                        	<label>*SR등급</label>
						    </div>
						</div>
						<div class="width-30 dib por">
							<div class="poa">
	                        	<label>*개발자ID/개발자명</label>
	                        </div>
							<div id="step3" data-ax5select="step3" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>						    
						</div>
						<div class="width-40 dib vat">

							<div class="vat dib margin-10-right float-right">
								<label style="margin-right: 180px;">*월 별</label>
								<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnSearch">조회</button>
							</div>
						</div>
					</div>					
					
					<div>
						<!-- 연구소 실 별 -->
						<div class="width-15 dib por">
						    <div id="dept" data-ax5select="dept" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="dib width-90">
						    </div>
						</div>
						<!-- SR등급 -->
						<div class="width-15 dib por">
							<div id="rate" data-ax5select="rate" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="dib width-90">
						    </div>						    
						</div>
						<!-- 개발자ID/개발자명 -->
						<div class="width-30 dib por vat">
							<input class="width-90" id="developerId" type="text" placeholder="">
						</div>

						<div class="width-40 dib vat">
							<div class="dib float-right">
								<div class="dib margin-40-right date-div">
									<button type="button" class="month-btn dateBtn" id="month-prev"><div class="mb-div">◀</div></button>
									<label style="margin-right: 10px; margin-left: 10px; width: 26px;" id="month">7월</label>
									<label id="year">2019년</label>
									<div class="por width-10 dib">
			                        	<button type="button" class="dib year-btn dateBtn" id="year-next">▲</button>
			                        	<button type="button" class="dib year-btn dateBtn" id="year-prev">▼</button>
			                        </div>
									<button type="button" class="month-btn dateBtn" id="month-next"><div class="mb-div">▶</div></button>
								</div>
								<div class="vat dib margin-10-right float-right">
									<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px; margin-top: 1px;" id="btnExcel">엑셀저장</button>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div class="dib por width-100">
							<div class="vat dib margin-10-right float-right">
								<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="reset">초기화</button>
							</div>
						</div>
					</div>
				</div>						
			</div>
		</div>	
	</div>
	
	<div class="az_board_basic">
		<div id="mainGrid" data-ax5grid="mainGrid" data-ax5grid-config="{}" style="width:100%; height: 600px;">
		
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/ProgrammerReport.js"/>"></script>