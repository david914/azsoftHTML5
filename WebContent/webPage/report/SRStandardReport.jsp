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
</style>

<div id="header"></div>
<div id="wrapper">
	<div class="content">
		<div id="history_wrap">보고서 <strong>&gt; 개발/SR기준(집계)</strong></div>
		<div class="az_search_wrap">
			<div class="az_in_wrap sr_status">
				<div class="l-wrap width-100 vat">
					<div class="row">
						<div class="width-25 dib por">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*조회구분</label>
	                        </div>
							<div id="dateStd" data-ax5select="dateStd" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>
						    
						</div>
						<div class="width-25 dib por">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*요청부서</label>
	                        </div>
							<div id="reqDept" data-ax5select="reqDept" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>
						    
						</div>
						<div class="width-25 dib por">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*SR상태</label>
	                        </div>
							<div id="srStat" data-ax5select="srStat" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>
						    
						</div>
						<div class="width-20 dib vat">
							<label id="lbUser">개발시작월</label>
							<div id="picker1" data-ax5picker="picker1" class="az_input_group dib margin-10-left">
					            <input id="datStD" name="start_date" type="text" placeholder="yyyy/mm/dd" style="width:120px;"><span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>						
							</div>
						</div>
						<div class="vat dib margin-5-right float-right"><!--수정-->
							<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnSearch">조회</button>
						</div>
					</div>
					
					
					<div class="row margin-10-bottom">
						<div class="width-25 dib por">
						    
						</div>
						<div class="width-25 dib por">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*개발부서</label>
	                        </div>
							<div id="reqDept" data-ax5select="devDept" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>
						    
						</div>
						<div class="width-25 dib por vat">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*SR-ID/제목</label>
	                        </div>
						    <div class="ml_80 width-70 dib">
								<input class="width-100" id="srId" name="srId" type="text" placeholder="" onkeypress="">
							</div>
						</div>
						<div class="width-20 dib vat">
							<label id="lbUser">개발종료월</label>
							<div id="picker2" data-ax5picker="picker2" class="az_input_group dib margin-10-left">
					            <input id="datEdD" name="start_date" type="text" placeholder="yyyy/mm/dd" style="width:120px;"><span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>						
							</div>
						</div>
						<div class="vat dib margin-5-right float-right"><!--수정-->
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
