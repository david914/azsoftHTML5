<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame" style="display: flow-root;">
	<div id="history_wrap">관리자 <strong>&gt; 시스템정보</strong></div>
	
	<div class="sm-row vat por">
		<div class="width-50 dib vat float-left" id="divLeft">
			<div class="margin-5-right">
				<div class="margin-5-bottom" id="leftSearchBox">
					<input id="txtFindSys" style="width:calc(100% - 126px);" type="text" placeholder="시스템코드 또는 시스템명을 입력하여 조회하세요."/>
					<input type="checkbox" class="checkbox-pie" id="chkCls" data-label="폐기포함"/>
					<button class="btn_basic_s" id="btnQry">조회</button>
				</div>
				<div class="az_board_basic" style="height: 86%"  id="divSysInfoGrid">
			    	<div data-ax5grid="sysInfoGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
				</div>
			</div>
		</div>
		<div class="width-50 dib vat float-right" id="divRight">
			<div class="half_wrap">
				<div class="sm-row">
					<ul>
						<li>
							<label class="tit_80 dib poa">시스템코드</label>
							<div class="ml_80">
								<input id="txtSysCd" name="txtSysCd" type="text" class="width-30" maxlength="5" />
								<div class="dib vat">
									<input type="checkbox" class="checkbox-pie" id="chkOpen" data-label="신규"  />
						    		<div id="chkSelfDiv" class="dis-i-b">
								    	<input type="checkbox" class="checkbox-pie" id="chkSelf" data-label="시스템코드수동부여" checked="checked"  />
						    		</div>
								</div>
							</div>						
						</li>
						<li class="sm-row">
							<label class="tit_80 dib poa">시스템명</label>
							<div class="ml_80">
								<input id="txtSysMsg" name="txtSysMsg" type="text" class="width-100" />
							</div>
						</li>
						<li class="sm-row">
							<label class="tit_80 dib poa"></label>
							<div class="ml_80">
			                    <div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" onchange="cboSysClick()"></div>
							</div>
						</li>
						
						<li class="sm-row half_wrap_cb">
							<div class="width-50 l_wrap">
								<label class="tit_80 dib poa">시스템유형</label>
								<div class="ml_80">
				                   <div id="cboSysGb" data-ax5select="cboSysGb" data-ax5select-config="{size:'sm',theme:'primary'}"  style="width:100%;" ></div>
								</div>
							</div>
							<div class="width-50 vat r_wrap">
								<label class="tit_100 dib poa margin-10-left">프로세스제한</label>
								<div class="ml_100 tar">
									<input id="txtPrcCnt" name="txtPrcCnt" type="text" class="width-100"/>
								</div>
							</div>
						</li>
						
						<li class="sm-row half_wrap_cb">
							<div class="width-100 l_wrap vat">
								<label class="tit_80 dib poa">기준서버</label>
								<div class="ml_80">
									<div id="cboSvrCd" data-ax5select="cboSvrCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
								</div>
							</div>
						</li>
						
						<li class="sm-row">
							<div class="half_wrap_cb">
								<div class="l_wrap width-50">
									<label class="tit_80 dib poa">시스템오픈</label>
									<div class="ml_80">
										<div id="divPicker" class="az_input_group width-100" data-ax5picker="datSysOpen">
											<input id="datSysOpen" type="text" placeholder="yyyy/mm/dd" class="f-cal" autocomplete="off">
											<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
										</div>
									</div>
								</div>
								<div class="r_wrap width-50">
									<label class="tit_100 dib poa margin-10-left">형상관리오픈</label>
									<div class="ml_100">
										<div id="divPicker" class="az_input_group width-100" data-ax5picker="datScmOpen">
											<input id="datScmOpen" type="text" placeholder="yyyy/mm/dd" class="f-cal" autocomplete="off">
											<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
										</div>
									</div>
								</div>
							</div>
						</li>
						
						<li class="sm-row">
							<label class="tit_80 dib poa">프로젝트명</label>
							<div class="ml_80">
								<input id="txtPrjName" type="text" class="width-100" />
							</div>
						</li>
						<li class="sm-row">
							<label class="tit_80 dib poa">프로세스유형</label>
							<div class="ml_80">
								<!-- <input id="txtPrc" type="text" class="width-100" /> -->
								<div id="cboPrc" data-ax5select="cboPrc" data-ax5select-config="{size:'sm',theme:'primary'}"  style="width:100%;" ></div>
							</div>
						</li>
						
						<li class="sm-row">
		    				<div class="width-60 float-left margin-5-bottom">
		    					<label class="tit_80 dib poa">중단시작</label>
		    					<div class="ml_80">
									<div id="divPicker" data-ax5picker="datStDate" class="dib width-100 por">
										<input id="datStDate" type="text" class="f-cal" autocomplete="off">
										<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
									</div>
								</div>
		    				</div>
		    				<div class="width-40 float-right por">
		    					<input id="timeDeploy" type="text" class="timepicker width-100" autocomplete="off" maxlength="5"/>
		    				</div>
		    			</li>
		   				
		   				<li class="sm-row">
		   					<div class="width-60 float-left margin-5-bottom">
		    					<label class="tit_80 dib poa">중단종료</label>
		    					<div class="ml_80">
									<div id="divPicker" data-ax5picker="datEdDate" class="dib width-100">
										<input id="datEdDate" type="text" class="f-cal" autocomplete="off">
										<span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
									</div>
								</div>
		    				</div>
		    				<div class="width-40 float-right">
		    					<input id="timeDeployE" type="text" class="timepicker width-100" autocomplete="off" maxlength="5"/>
		    				</div>
						</li>
					</ul>
				</div>
				<div class="sm-row">
					<div class="float-left">
						<div class="sm-row">
		    				<div class="width-60 float-left margin-5-bottom">
								<div class="float-left">
									<label class="tit_80 dib poa">시스템속성</label>
								</div>
								<div class="float-right">
									<label style="margin-right: 5px;">적용시간</label>
								</div>
							</div>
		    				<div class="width-40 float-right por">
		    					<input id="txtTime" type="text" class="timepicker width-100" autocomplete="off" maxlength="5"/>
		    				</div>
						</div>
						<div class="sm-row">
							<div class="width-100 float-left">
								<div class="scrollBind sm-row" style="height: 13%">
				    				<ul class="list-group" id="ulSysInfo">
					    			</ul>
				    			</div>
							</div>
						</div>
					</div>
				</div>
				<div class="sm-row">
					<div class="width-100 float-left">
						<div class="sm-row" style="margin-top: 5px;">
							<label class="tit_80 dib poa">업무</label>
							<div class="ml_80">
								<input id="txtJobname" name="txtJobname" type="text" class="width-100" />
							</div>
							
							<div class="az_board_basic scroll_h az_board_basic_in sm-row" style="height: 32%" id="jobGridBox">
								<div data-ax5grid="jobGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="sm-row tar">
		<div class="width-100 float-right" style="right: 5px; margin-top: 15px;">
			<button id="btnFact" class="btn_basic_s" >처리펙터추가</button>
			<button id="btnReleaseTimeSet" class="btn_basic_s">정기배포설정</button>
			<button id="btnAdd" class="btn_basic_s">등록</button>
			<button id="btnDel" class="btn_basic_s">폐기</button>
			<button id="btnJob" class="btn_basic_s">업무등록</button>
			<button id="btnSysDetail" class="btn_basic_s">시스템상세정보</button>
			<button id="btnProg" class="btn_basic_s">프로그램종류정보</button>
			<button id="btnDir" class="btn_basic_s">공통디렉토리</button>
			<button id="btnCopy" class="btn_basic_s">시스템정보복사</button>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/SysInfo.js"/>"></script>