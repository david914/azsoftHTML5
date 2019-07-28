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

.width-70 {
	width: calc(100% - 120px);
	min-width: 90px;
}

.pic-wid {
	width: 140px;
}
</style>

<div id="wrapper">
	<div class="content">
		<div id="history_wrap">보고서 <strong>&gt; 개발/SR기준(집계)</strong></div>
		<div class="az_search_wrap" style="min-width: 1050px;">
			<div class="az_in_wrap sr_status">
				<div class="l-wrap width-100 vat">
					<div class="row">
						<div class="dib" style="width: 90%; max-width: 1350px;">
						<div class="width-25 dib por">
							<div class="tit_80 poa">
	                        	<label>*조회구분</label>
	                        </div>
							<div id="dateStd" data-ax5select="dateStd" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>
						    
						</div>
						<div class="width-25 dib por">
							<div class="tit_80 poa">
	                        	<label>*요청부서</label>
	                        </div>
							<div id="reqDept" data-ax5select="reqDept" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>
						    
						</div>
						<div class="width-25 dib por">
							<div class="tit_80 poa">
	                        	<label>*SR상태</label>
	                        </div>
							<div id="srStat" data-ax5select="srStat" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>
						    
						</div>
						<div class="width-15 dib vat" style="min-width: 223px;">
							<label>개발시작월</label>
							<div id="picker1" data-ax5picker="picker1" class="az_input_group dib margin-10-left pic-wid">
					            <input id="datStD" type="text" placeholder="yyyy/mm/dd" class="width-70">
					            <span class="btn_calendar width-30"><i class="fa fa-calendar-o"></i></span>						
							</div>
						</div>
						</div>
						
						<div class="vat dib margin-5-right float-right width-5"><!--수정-->
							<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnSearch">조회</button>
						</div>
					</div>
					
					
					<div class="row margin-10-bottom">
					<div class="dib" style="width: 90%; max-width: 1350px;">
						<div class="width-25 dib por">
						    
						</div>
						<div class="width-25 dib por">
							<div class="tit_80 poa">
	                        	<label>*개발부서</label>
	                        </div>
							<div id="reqDept" data-ax5select="devDept" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>
						    
						</div>
						<div class="width-25 dib por vat">
							<div class="tit_80 poa">
	                        	<label>*SR-ID/제목</label>
	                        </div>
						    <div class="ml_80 width-70 dib">
								<input class="width-100" id="srId" type="text" placeholder="" onkeypress="">
							</div>
						</div>
						<div class="width-15 dib vat" style="min-width: 223px;">
							<label>개발종료월</label>
							<div id="picker2" data-ax5picker="picker2" class="az_input_group dib margin-10-left pic-wid">
					            <input id="datEdD" type="text" placeholder="yyyy/mm/dd" class="width-70">
					            <span class="btn_calendar width-30"><i class="fa fa-calendar-o"></i></span>						
							</div>
						</div>
						</div>
						
						<div class="vat dib margin-5-right float-right width-5"><!--수정-->
							<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnExcel">엑셀저장</button>
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
<script type="text/javascript" src="<c:url value="/js/ecams/report/SRStandardReport.js"/>"></script>
