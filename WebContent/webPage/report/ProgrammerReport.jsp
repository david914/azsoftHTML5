<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

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
	                        	<label id="lbUser">*연구소 실 별</label>
						    </div>
						</div>
						<div class="width-15 dib por">
							<div class="poa">
	                        	<label id="lbUser">*SR등급</label>
						    </div>
						</div>
						<div class="width-30 dib por">
							<div class="poa">
	                        	<label id="lbUser">*개발자ID/개발자명</label>
	                        </div>
							<div id="step3" data-ax5select="step3" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>						    
						</div>
						<div class="width-40 dib vat">
							<div class="width-60 dib"></div>
							<label id="lbUser">*월 별</label>

							<div class="vat dib margin-10-right float-right"><!--수정-->
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
							<input class="width-90" id="developerId" name="developerId" type="text" placeholder="" onkeypress="enterKey()">
						</div>

						<div class="width-40 dib vat">
							<div class="width-60 dib"></div>
							<div id="picker" data-ax5picker="picker" class="az_input_group dib">
					            <input id="date" name="date" type="text" placeholder="yyyy-mm" style="width:150px;"><span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>						
							</div>
							<div class="vat dib margin-10-right float-right"><!--수정-->
								<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnExcel">엑셀저장</button>
							</div>
						</div>
					</div>
					<div class="margin-10-bottom">
						<div class="dib por width-100">
							<div class="vat dib margin-10-right float-right"><!--수정-->
								<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="reset" onclick="reset()">초기화</button>
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