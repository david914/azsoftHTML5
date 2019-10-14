<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<body id="tabBody">	
	<div class="az_search_wrap">
		<!--left wrap-->
		<div class="l_wrap width-50">		
			<div class="margin-5-left margin-5-right">
				<div class="sm-row">
					<label class="tit_80 poa">시스템코드</label>
	                <div class="ml_80">
	                	<input id="txtSysCd" class="vat width-20 dib" type="text"></input>
						<div id="cboSys" class="dib" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:calc(80% - 65px);"></div>
						<div class="dib tar">
							<input type="checkbox" class="checkbox-pie" id="chkOpen" data-label="신규"  />
						</div>
					</div>
				</div>		
				<div class="sm-row">
					<label class="tit_80 dib poa">시스템명</label>
					<div class="ml_80">
						<input id="txtSysMsg" name="txtSysMsg" type="text" class="width-100" />
					</div>
				</div>	
				<div class="sm-row">
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
				</div>
				<div class="sm-row width-100 l_wrap margin-5-bottom">
					<label class="tit_80 dib poa">기준서버</label>
					<div class="ml_80">
						<div id="cboSvrCd" data-ax5select="cboSvrCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
				<div class="sm-row">
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
				<div class="sm-row width-100 l_wrap ">
					<label class="tit_80 dib poa">프로젝트명</label>
					<div class="ml_80">
						<input id="txtPrjName" type="text" class="width-100" />
					</div>
				</div>
				<div class="sm-row width-100 l_wrap  margin-5-bottom">
					<label class="tit_80 dib poa">프로세스유형</label>
					<div class="ml_80">
						<div id="cboPrc" data-ax5select="cboPrc" data-ax5select-config="{size:'sm',theme:'primary'}"  style="width:100%;" ></div>
					</div>
				</div>
				<div class="sm-row">
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
    			</div>
   				<div class="sm-row">
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
				</div>
				<div class="sm-row width-100 l_wrap" style="height:20px;">
					<label class="tit_80 dib poa">시스템속성</label>
				</div>
				<div class="sm-row width-100 l_wrap">
					<div class="scrollBind sm-row" style="height: calc(100% - 410px);">
	    				<ul class="list-group" id="ulSysInfo">
		    			</ul>
	    			</div>
				</div>
			</div>
		</div>
		<div class="r_wrap" style="height:calc(100% - 140px);width:calc(50% - 10px);">
			<div class="sm-row">
				<label class="tit_60 dib poa">업무</label>
				<div class="ml_60">
					<input id="txtJobname" name="txtJobname" type="text" class="width-100" />
				</div>
				
				<div class="az_board_basic scroll_h az_board_basic_in" style="height: 100%;margin-top:7px;" id="jobGridBox">
					<div data-ax5grid="jobGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="tar">
		<div class="width-100 float-right">
			<button id="btnAdd" class="btn_basic_s">등록</button>
			<button id="btnDel" class="btn_basic_s">폐기</button>
			<button id="btnJob" class="btn_basic_s">업무등록</button>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/tab/sysinfo/SysDetailTab.js"/>"></script>