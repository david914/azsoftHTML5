<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<style>
.font-blue {
	color: blue;
}

.font-red {
	color: red;
	font-weight: bold;
}

label {
	min-width: 54px;
}

.pic-wid {
	width: 140px;
}

.block1 {
	width: calc(26% - 152px);
	min-width: 90px;
	margin-right: 20px;
}

.sys {
	min-width: 140px;
}

.tr-sum td span {
	color: red;
	font-weight: bold;
}
.width-95 {
	width: calc(100% - 80px);
}
</style>

<div id="wrapper">
	<div class="contentFrame">
		<div id="history_wrap">보고서 <strong>&gt; 형상관리운영현황</strong></div>
		<div class="az_search_wrap" style="min-width: 1117px;">
			<div class="az_in_wrap sr_status">
				<div class="l-wrap width-100 vat">
					<div class="row">
						<div class="dib width-95">
							<div class="dib vat">
	                        	<label>*조회구분</label>
	                        </div>
							<div id="dateStd" data-ax5select="dateStd" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="block1 dib por">
						    </div>
							<div class="dib vat">
	                        	<label>*1단계</label>
	                        </div>
							<div id="step1" data-ax5select="step1" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="block1 dib por">
						    </div>
							<div class="dib vat">
	                        	<label>*3단계</label>
	                        </div>
							<div id="step3" data-ax5select="step3" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="block1 dib por">
						    </div>						    
							<div class="dib vat">
	                        	<label>시스템</label>
	                        </div>
							<div id="systemSel" data-ax5select="systemSel" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="block1 dib por sys">
						    </div>						    
							<div class="dib vat" style="width: 220px;">
								<label>개발시작월</label>
								<div id="picker1" data-ax5picker="picker1" class="az_input_group dib margin-10-left pic-wid">
						            <input id="datStD" type="text" placeholder="yyyy/mm/dd" class="width-70 dib">
						            <span class="btn_calendar width-25"><i class="fa fa-calendar-o"></i></span>						
								</div>
							</div>
						</div>
						<div class="vat dib margin-5-right float-right"><!--수정-->
							<button class="btn_basic_s" data-grid-control="excel-export" id="btnSearch">&nbsp;&nbsp;&nbsp;조 회&nbsp;&nbsp;&nbsp;</button>
						</div>
					</div>
					
					<div class="row margin-10-bottom">
						<div class="dib width-95">
							<div class="dib vat"><label></label></div>
							<div class="block1 dib por">						    
							</div>
							<div class="dib vat">
	                        	<label>*2단계</label>
	                        </div>
							<div id="step2" data-ax5select="step2" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="block1 dib por">
							</div>
							<div class="dib vat">
	                        	<label>*4단계</label>
	                        </div>
							<div id="step4" data-ax5select="step4" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="block1 dib por">
							</div>
							<div class="dib vat"><label></label></div>
							<div class="block1 dib por sys">		    
							</div>
							<div class="dib vat" style="width: 220px;">
								<label>개발종료월</label>
								<div id="picker2" data-ax5picker="picker2" class="az_input_group dib margin-10-left pic-wid">
						            <input id="datEdD" type="text" placeholder="yyyy/mm/dd" class="width-70 dib">
						            <span class="btn_calendar width-25"><i class="fa fa-calendar-o"></i></span>						
								</div>
							</div>
						</div>
						<div class="vat dib margin-5-right float-right"><!--수정-->
							<button class="btn_basic_s" data-grid-control="excel-export" id="btnExcel">엑셀저장</button>
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
<script type="text/javascript" src="<c:url value="/js/ecams/report/ConfigOpReport.js"/>"></script>
