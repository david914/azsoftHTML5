<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />


<div id="header"></div>

<div id="wrapper">
	<div class="content">
		<div id="history_wrap">관리자 <strong>&gt; 시스템정보</strong></div>

		<div class="az_board_basic" style="height: 40%">
	    	<div data-ax5grid="sysInfoGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
		</div>
		
		<div class="row vat por tar">
			<div class="dib">
				<label id="lblSysCd" class="dib">시스템코드/시스템명</label>
				<input id="txtSysCd" name="txtTitle" class="form-control width-50 dib" type="text" />
			</div>
			
			<div class="dib margin-3-top">
				<input type="checkbox" class="checkbox-pie" id="chkCls" data-label="폐기포함"/>
			</div>
			
			<div class="dib margin-10-right">
				<div class="vat dib margin-5-left">
					<button class="btn_basic_s" id="btnQry">조회</button>
				</div>
				<div class="vat dib margin-5-left">
					<button class="btn_basic_s" id="btnFact">처리펙터추가</button>
				</div>
			</div>
		</div>
		
		<div class="half_wrap margin-10-top">
			<!--시스템정보 하단 좌측-->
			<div class="l_wrap width-33">
				<ul>
					<li>
						<label class="tit_80 dib poa">시스템코드</label>
						<div class="ml_80">
							<input id="txtSysCd" name="txtSysCd" type="text" class="width-30" />
							<div class="dib poa_r margin-3-top">
								<input type="checkbox" class="checkbox-pie" id="chkOpen" data-label="신규"  />
					    		<div id="chkSelfDiv" class="dis-i-b">
							    	<input type="checkbox" class="checkbox-pie" id="chkSelf" data-label="시스템코드수동부여" checked="checked"  />
					    		</div>
							</div>
						</div>						
					</li>
					<li class="row">
						<label class="tit_80 dib poa">시스템명</label>
						<div class="ml_80">
							<input id="txtSysMsg" name="txtSysMsg" type="text" class="width-100" />
						</div>
					</li>
					<li class="row">
						<label class="tit_80 dib poa"></label>
						<div class="ml_80">
		                    <div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" onchange="cboSysClick()"></div>
						</div>
					</li>
					
					<li class="row half_wrap_cb">
						<div class="width-50 l_wrap">
							<label class="tit_80 dib poa">시스템유형</label>
							<div class="ml_80">
			                   <div id="cboSysGb" data-ax5select="cboSysGb" data-ax5select-config="{size:'sm',theme:'primary'}"  style="width:100%;" ></div>
							</div>
						</div>
						<div class="width-50 vat r_wrap">
							<label class="tit_80 dib poa margin-5-left">프로세스제한</label>
							<div class="ml_80 tar">
								<input id="txtPrcCnt" name="txtPrcCnt" type="text" class="width-100" />
							</div>
						</div>
					</li>
					
					<li class="row half_wrap_cb">
						<div class="width-100 l_wrap vat">
							<label class="tit_80 dib poa">기존서버구분</label>
							<div class="ml_80">
								<div id="cboSvrCd" data-ax5select="cboSvrCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
							</div>
						</div>
					</li>
					
					<li class="row">
						<div class="half_wrap_cb">
							<div class="l_wrap width-50">
								<label class="tit_80 dib poa">시스템오픈</label>
								<div class="ml_80">
									<div id="divPicker" class="az_input_group dib" data-ax5picker="datSysOpen">
										<input id="datSysOpen" type="text" placeholder="yyyy/mm/dd" class="width-70" ><span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
									</div>
								</div>
							</div>
							<div class="r_wrap width-50">
								<label class="tit_80 dib poa">형상관리오픈</label>
								<div class="ml_80 tar">
									<div id="divPicker" class="az_input_group dib" data-ax5picker="datScmOpen">
										<input id="datScmOpen" type="text" placeholder="yyyy/mm/dd" class="width-70" >
										<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
									</div>
								</div>
							</div>
						</div>
					</li>
					
					<li class="row">
						<label class="tit_80 dib poa">프로젝트명</label>
						<div class="ml_80">
							<input id="txtPrjName" type="text" class="width-100" />
						</div>
					</li>
					<li class="row">
						<label class="tit_80 dib poa">프로세스유형</label>
						<div class="ml_80">
							<input id="txtPrc" type="text" class="width-100" />
						</div>
					</li>
					
				</ul>
			</div>
			
			<!--시스템 정보 하단 중간-->
			<div class="l_wrap width-33">
				<div class="margin-10-left margin-5-right">
					<label class="tit_80 dib poa">업무</label>
					<input id="txtJobname" name="txtJobname" type="text" class="width-0 ml_80" />
					
					<div class="az_board_basic scroll_h az_board_basic_in row" style="height: 27%">
						<div data-ax5grid="jobGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
					</div>
				</div>
			</div>
			
			<!--cell_3-->
			<div class="r_wrap width-33">
				<ul>
					<li><label class="tit_80 dib poa">시스템속성</label></li>
					<li class="tar">
						<label class="tit_80 dib poa">적용시간</label>
						<input id="txtTime" name="txtTime" type="text" class="width-30 ml_80"><span class="btn_calendar vat"><i class="fa fa-clock-o"></i></span> 
					</li>
				</ul>
				<div class="scrollBind row">
    				<ul class="list-group" id="ulSysInfo">
	    			</ul>
    			</div>
    			
    			<div class="row">
	    			<label class="tit_80 dib poa">중단시작</label>
					<div class="ml_80">
						<div id="divPicker" class="az_input_group dib" data-ax5picker="datStDate">
							<input id="datStDate" type="text" placeholder="yyyy/mm/dd" style="width:100px;" ><span class="btn_calendar margin-5-left"><i class="fa fa-calendar-o"></i></span>
						</div>
						<div class="dib vat">
							<input id="timeDeploy" name="timeDeploy" type="text" class="width-30 ml_80"><span class="btn_calendar vat"><i class="fa fa-clock-o"></i></span>
						</div>
					</div>
    			</div>
   				<!-- <div class="row">
					<label class="tit_80 dib poa">중단시작</label>
					<div class="ml_80">
						<div id="divPicker" class="az_input_group dib" data-ax5picker="datStDate">
							<input id="datStDate" type="text" placeholder="yyyy/mm/dd" class="width-70" >
							<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
						</div>
						<input id="timeDeploy" name="timeDeploy" type="text" class="width-30 ml_80"><span class="btn_calendar vat"><i class="fa fa-clock-o"></i></span>		
					</div>
				</div> -->
   				
   				<div class="row">
					<label class="tit_80 dib poa">중단종료</label>
					<div class="ml_80">
						<div id="divPicker" class="az_input_group dib" data-ax5picker="datEdDate">
							<input id="datEdDate" type="text" placeholder="yyyy/mm/dd" class="width-70" >
							<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
						</div>
						<input id="timeDeployE" name="timeDeployE" type="text" class="width-30 ml_80"><span class="btn_calendar vat"><i class="fa fa-clock-o"></i></span>
					</div>
				</div>
			</div>
		</div>
		
		<div class="row tar">
			<button id="btnReleaseTimeSet" class="btn_basic">정기배포설정</button>
			<button id="btnAdd" name="btnReg" class="btn_basic">등록</button>
			<button id="btnDel" name="btnReg" class="btn_basic">폐기</button>
			<button id="btnJob" name="btnReg" class="btn_basic">업무등록</button>
			<button id="btnSysDetail" name="btnReg" class="btn_basic">시스템상세정보</button>
			<button id="btnProg" name="btnReg" class="btn_basic">프로그램종류정보</button>
			<button id="btnDir" name="btnReg" class="btn_basic">공통디렉토리</button>
			<button id="btnCopy" name="btnReg" class="btn_basic">시스템정보복사</button>
		</div>
		
	</div>
</div>
	    
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/SysInfo.js"/>"></script>