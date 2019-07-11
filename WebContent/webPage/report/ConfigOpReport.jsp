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
}

label {
	min-width: 54px;
}
</style>

<div id="header"></div>
<div id="wrapper">
	<div class="content">
		<div id="history_wrap">보고서 <strong>&gt; 형상관리운영현황</strong></div>
		<div class="az_search_wrap" style="min-width: 1117px;">
			<div class="az_in_wrap sr_status">
				<div class="l-wrap width-100 vat">
					<div class="row">
						<div class="width-18 dib por">
							<div class="width-25 dib vat">
	                        	<label>*조회구분</label>
	                        </div>
							<div id="dateStd" data-ax5select="dateStd" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-65 dib">
						    </div>
						    
						</div>
						<div class="width-17 dib por">
							<div class="width-20 dib vat">
	                        	<label>*1단계</label>
	                        </div>
							<div id="step1" data-ax5select="step1" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 dib">
						    </div>
						    
						</div>
						<div class="width-17 dib por">
							<div class="width-20 dib vat">
	                        	<label>*3단계</label>
	                        </div>
							<div id="step3" data-ax5select="step3" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 dib">
						    </div>						    
						</div>
						<div class="width-17 dib por">
							<div class="width-20 dib vat">
	                        	<label>*시스템</label>
	                        </div>
							<div id="systemSel" data-ax5select="systemSel" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 dib">
						    </div>						    
						</div>
						<div class="width-25 dib vat" style="margin-left: 5%;">
							<label>개발시작월</label>
							<div id="picker1" data-ax5picker="picker1" class="az_input_group dib margin-10-left width-40">
					            <input id="datStD" type="text" placeholder="yyyy/mm/dd" class="width-70 dib">
					            <span class="btn_calendar width-25"><i class="fa fa-calendar-o"></i></span>						
							</div>
							<div class="vat dib margin-5-right float-right width-20"><!--수정-->
								<button class="btn_basic_s" data-grid-control="excel-export" id="btnSearch">　조회　</button>
							</div>
						</div>
					</div>
					
					<div class="row margin-10-bottom">
						<div class="width-18 dib por">
						    
						</div>
						<div class="width-17 dib por">
							<div class="width-20 dib vat">
	                        	<label>*2단계</label>
	                        </div>
							<div id="step2" data-ax5select="step2" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 dib">
						    </div>						    
						</div>
						<div class="width-17 dib por">
							<div class="width-20 dib vat">
	                        	<label>*4단계</label>
	                        </div>
							<div id="step4" data-ax5select="step4" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 dib">
						    </div>						    
						</div>
						<div class="width-17 dib por">
					    
						</div>

						<div class="width-25 dib vat" style="margin-left: 5%;">
							<label>개발종료월</label>
							<div id="picker2" data-ax5picker="picker2" class="az_input_group dib margin-10-left width-40">
					            <input id="datEdD" type="text" placeholder="yyyy/mm/dd" class="width-70 dib">
					            <span class="btn_calendar width-25"><i class="fa fa-calendar-o"></i></span>						
							</div>
							<div class="vat dib margin-5-right float-right width-20"><!--수정-->
								<button class="btn_basic_s" data-grid-control="excel-export" id="btnExcel">엑셀저장</button>
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
<script type="text/javascript" src="<c:url value="/js/ecams/report/ConfigOpReport.js"/>"></script>
