<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
<style>
.sel {
	min-width: 220px;
}
</style>

<!-- contener S -->
<div id="wrapper">
    <div class="contentFrame">
        <!-- history S-->
        <div id="history_wrap">보고서 <strong>&gt; 프로그램목록</strong></div>
        <!-- history E-->    
        <!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="por">					
					<!-- 시스템 -->	
					<div class="width-20 dib vat" style=" min-width: 215px;">
	                    <label id="lbUser" style="margin-right: 30px;">시스템</label>
						<div id="systemSel" data-ax5select="systemSel" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-65 dib" style=" min-width: 130px;">
							
					    </div>
					</div>				
					<!-- 조건선택1 -->	
					<div class="width-20 dib sel">
						<div class="tit_100 poa">
	                  	  <label id="lbUser">조건선택1</label>
						</div>
						<div class="ml_80">
							<div id="reqDeptSel" data-ax5select="conditionSel1" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-80 dib">
								
						    </div>
						</div>
						<div class="row">
							<div class="tit_100 poa">
		                    	<label id="prgStatusLabel"></label>
		                    </div>
		                    <div class="ml_80">
								<div id="prgStatusSel" data-ax5select="prgStatusSel" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-80 dib">
									
							    </div>
							</div>
						</div>
					</div>
					<!-- 조건선택2 -->	
					<div class="width-20 dib vat sel">
						<div class="tit_180 poa">
	                  	  <label id="lbUser">조건선택2</label>
						</div>
						<div class="ml_80">
							<div id="reqDeptSel" data-ax5select="conditionSel2" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-80 dib">
								
						    </div>
						</div>
						<div class="row">
		                    <div class="ml_80">
								<input id="conditionText" name="conditionText" type="text" minlength="8" maxlength="12" class="width-80">
							</div>
						</div>
					</div>		
					<!-- 범위 -->	
					<div class="width-20 dib vat sel">					
						<div class="tit_180 poa">
	                  	  <label id="lbUser">범위</label>
						</div>
	                    <div class="ml_80">
							<div id="rangeSel" data-ax5select="rangeSel" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-80 dib">
								
						    </div>
						    <div class="row">
						    	<label class="wLabel-left" style="width: 5px;"></label>
								<input id="checkDetail" tabindex="8" type="checkbox" value="optCkOut" style="margin-top: 5px;" checked="checked" name="checkDetail"/>
								<label for="checkDetail" style="margin-top: -5px;">&nbsp;세부항목포함</label>
						    </div>
						</div>
					</div>			
					<!-- 버튼 -->	
					<div class="dib tar vat float-right">
	                    <button class="btn_basic_s" id="btnExcel">엑셀저장</button>
	                    <div class="row">
	                    	<button class="btn_basic_s margin-5-left" id="btnSearch" style="width:70px;">조회</button>
	                    </div>
					</div>
				</div>	
			</div>
		</div>
		
		<div class="az_board_basic">
	    	<div id="mainGrid" data-ax5grid="mainGrid" data-ax5grid-config="{}" style="width:100%; height: 600px;">
		
			</div>
		</div>
		
		<form name="popPam">
			<input type="hidden" name="acptno"/>
			<input type="hidden" name="user"/>
			<input type="hidden" name="itemid"/> 
			<input type="hidden" name="syscd"/>
			<input type="hidden" name="rsrccd"/>
			<input type="hidden" name="rsrcname"/>
		</form>
    </div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/PrgListReport.js"/>"></script>