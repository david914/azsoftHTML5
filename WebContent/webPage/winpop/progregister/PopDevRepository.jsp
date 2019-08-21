<!--  
	* 화면명: 개발영역연결등록
	* 화면호출: 프로그램등록 -> 개발영역연결등록 버튼
-->

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>

<c:import url="/webPage/common/common.jsp"/>

<head>
	<title>개발영역연결등록</title>
</head>

<% 
	String UserId = request.getParameter("UserId"); 
    String SysCd = request.getParameter("SysCd"); 
%> 

<body style="padding: 10px !important; width: 100% !important; min-width: 0px !important;">
<!-- contener S -->
    <div class="contentFrame">
        <!-- history S-->
        <div id="history_wrap">	프로그램등록 <strong>&gt; 개발영역연결등록</strong></div>
        <!-- history E-->
        <!-- history E-->
        <!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="cb">
					<!-- 시스템 -->		
                    <div class="width-50 float-left">
						<div class="margin-5-right">
							<label class="tit_100 poa">*1. 시스템</label>
	                        <div class="ml_100">
								<div id="cboSystem" data-ax5select="cboSystem" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib">
								</div>
							</div>
						</div>
					</div>
					<!-- 서버선택 -->		
                    <div class="width-50 float-left">
						<div class="margin-5-right">
							<label class="tit_100 poa">*2. 서버선택</label>
	                        <div class="ml_100 tal">
								<div id="cboSvr" data-ax5select="cboSvr" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100">
							    </div>
							</div>
						</div>
					</div>
				</div>
				<div class="row vat cb">					
					<!-- 기준디렉토리 -->		
					<div class="width-50 float-left">
						<div class="margin-5-right">
	                    	<label class="tit_100 poa">*3. 기준디렉토리</label>
	                        <div class="ml_100">
								<div id="cboDir" data-ax5select="cboDir" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100"></div>
							</div>
						</div>
					</div>
					<div class="width-50 float-left">
						<div class="margin-5-left">
	                        <div class="tit_100 poa">
								<input id="txtDir" type="text" style="width: 615px;" placeholder="기준디렉토리기준으로 하위디렉토리 입력 후 조회"></input> <!-- class="width-200" style="width: 820px;"-->
							</div>
						</div>
						<div class="margin-5-left">
							<div style="margin-left: 615px;">
								<button id="btnQry" class="btn_basic_s margin-5-left">디렉토리조회</button> <!-- class="ml_300" -->
							</div>
						</div>
					</div>
					
				</div>				
				<div class="row vat cb">
					<!-- 추출대상확장자 -->		
                    <div class="width-50 float-left">
						<div class="margin-5-right">
	                    	<label class="tit_100 poa">추출대상확장자</label>
	                        <div class="ml_100">
								<input id="txtExe" class="width-100" type="text"></input>
							</div>
						</div>
					</div>
					<!-- 추출제외확장자 -->		
                    <div class="width-50 float-left">
						<div class="margin-5-left">
	                    	<label class="tit_100 poa">추출제외확장자</label>
	                        <div class="ml_100">
								<input id="txtNoExe" class="width-100" type="text"></input>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--검색E-->
		<div class="half_wrap margin-10-top">
			<div class="l_wrap width-40" style="height: 400px;"> <!-- scrollBind -->
				<!-- 디렉토리 트리 -->	
				<div class="scrollBind" style="height: 100%; border: 1px dotted gray; OVERFLOW-Y:auto">
					<ul id="treeDir" class="ztree"></ul>
				</div>
			</div>
			<div class="r_wrap width-60">
				<!-- 게시판 S-->
				<div>
				    <div class="az_board_basic az_board_basic_in margin-10-left">
				    	<!-- 프로그램목록 그리드 -->
				    	<div data-ax5grid="grdProgList" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 400px; width:100%"></div>
					</div>	
				</div>
				<!-- 게시판 E -->
			</div>
		</div>
		<!-- info S -->
		<div class="row">
			<p class="txt_r font_12">1. 디렉토리선택 후 오른쪽마우스 클릭 [파일추출] : 추출대상확장자 입력 후 추출 시 입력한 확장자를 가진 파일만 추출</p>
			<p class="txt_r font_12">2. 추출된 파일목록에서 등록할 파일선택(프로그램설명은 목록에서 직접입력 가능)</p>
			<p class="txt_r font_12">3. 업무, 프로그램종류, 프로그램설명 입력 후 등록버트 클릭, 단! 프로그램 설명은 목록에 입력한 경우 목록의 내용으로 등록</p>
		</div>
		<!-- info E -->
		<!-- 검색 S -->
		<div class="az_search_wrap row">
			<div class="az_in_wrap">
				<div class="cb">
					<!--left-->
					<div class="float-left width-90">
						<div class="row vat cb">
							<!-- line1 -->		
		                    <div class="width-50 float-left">
		                    	<div class="tit_100 poa">
		                        	<label>*프로그램종류</label>
		                        </div>
		                        <div class="ml_100">
									<div id="cboJawon" data-ax5select="cboJawon" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-50 dib">
								    </div><input id="txtExeName" type="text" class="width-45 margin-5-left">
								</div>
							</div>
							<!-- 업무 -->		
		                    <div class="width-50 float-right">
		                    	<div class="tit_100 poa">
		                        	<label>*업무</label>
		                        </div>
		                        <div class="ml_60 tal">
									<div id="cboJob" data-ax5select="cboJob" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100">
								    </div>
								</div>
							</div>
						</div>
						<div class="row">					
							<!-- 프로그램설명 -->		
		                    <div class="tit_100 poa">
		                        <label>*프로그램설명</label>
		                    </div>
		                    <div class="ml_100">
		                        <input id="txtStory" type="text" class="width-100">
		                    </div>
						</div>				
						<div class="row vat">
							<div class="tit_100 poa">
	                        	<label>*SR-ID</label>
	                        </div>
	                        <div class="ml_100">
								<div id="cboSRID" data-ax5select="cboSRID" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100">
							    </div>
							</div>
						</div>
					</div>
					<!--right-->
					<div class="float-right tar width-10">
						<div class="row"><button id="btnInit" class="btn_basic_s" style="width:90px">초기화</button></div>
						<div class="row"><button id="btnExcel" class="btn_basic_s margin-5-left" style="width:90px">엑셀저장</button></div>
						<div class="row"><button id="btnRegist" class="btn_basic_s margin-5-left" style="width:90px">등록</button></div>
					</div>
				</div>
			</div>
		</div>
		<!-- 검색 E -->
	</div>
<!-- contener E -->
</body>

<input type=hidden id="UserId" value=<%=UserId%>>
<input type=hidden id="SysCd" value=<%=SysCd%>>

<div id="rMenu"> 
 	<ul> 
 		<li id="contextmenu1" onclick="contextmenu_click('1');">파일추출</li> 
 		<li id="contextmenu2" onclick="contextmenu_click('9');">파일추출(하위폴더포함)</li>
 	</ul> 
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/winpop/progregister/PopDevRepository.js"/>"></script>