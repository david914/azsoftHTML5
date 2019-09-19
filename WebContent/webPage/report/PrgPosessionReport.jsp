<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<style>
.color-red {
	color: red;
	font-weight: bold;
}

</style>

<div id="wrapper">
	<div class="contentFrame">
		<div id="history_wrap">보고서 <strong>&gt; 프로그램보유현황</strong></div>
		<div class="az_search_wrap">
			<div class="az_in_wrap sr_status">
				<div class="l-wrap width-100 vat">
					<div>
						<div class="width-22 dib por">
							<div class="vat dib margin-10-right">
	                        	<label>시스템</label>
	                        </div>
	                        <div id="sysInfo" data-ax5select="sysInfo" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="dib" style="width:calc(100% - 80px);">
						    </div>
						</div>

						<div class="width-40 dib por vat">
							<div class="dib vat margin-10-right">
	                        	<label>조회기준일</label>
	                        </div>
	                        <div id="picker" data-ax5picker="picker" class="az_input_group dib">
								<div class="dib margin-40-right">
					            	<input id="date" type="text" placeholder="yyyy/mm/dd" style="width:150px;"><span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>						
								</div>
							</div>													    
						</div>
						<div class="width-10 dib vat">
							<div class="vat dib margin-5-right float-right poa" id="btnDiv" style="right:0;">
								<button class="btn_basic_s margin-10-right" data-grid-control="excel-export" style="width: 70px;" id="btnSearch">조 회</button>
							</div>
						</div>
					</div>					
				</div>						
			</div>
		</div>	
		<div class="az_board_basic margin-15-left" style="width: 98%;">
			<div id="mainGrid" data-ax5grid="mainGrid" data-ax5grid-config="{}" style="width:100%; height: 320px;">
			
			</div>
			<div class="hpanel margin-5-top" style="font-size:0px;">
			    <div class="panel-body text-center dib" id="pieDiv" style="width: 30%; border: 1px solid #ddd; height:397px; margin-right:5px;">
			    	<label>시스템별 파일 보유현황</label>
			    	<div id="pieAppliKinds" flow="down"></div>
			    </div>
			    <div class="panel-body text-center dib" id="barDiv" style="width: calc(70% - 5px); border: 1px solid #ddd; height:397px;">
			    	<label>파일 종류별 보유현황</label>
			    	<div id="barAppliKinds" flow="down"></div>
			    </div>
			</div>	
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/PrgPosessionReport.js"/>"></script>