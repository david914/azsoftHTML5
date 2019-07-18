<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp"/>

<body style="width: 100% !important; min-width: 0px !important; height: 100%; min-height: 0px !important;">
<!-- contener S -->
<div id="wrapper">
    <div class="content">
        <!-- history S-->
        <div id="history_wrap">개발 <strong>&gt; 프로그램등록</strong></div>
        <!-- history E-->   
		<!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap sr_status">
				<!--입력 좌측-->
				<div class="l_wrap width-70 vat">
					<div class="row">
						<!-- 시스템 -->	
						<div class="width-100 dib por">
							<div class="tit_100 poa">
	                        	<label id="lbSystem">*시스템</label>
	                        </div>
							<div id="cboSystem" data-ax5select="cboSystem" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-25 ml_100 dib"></div>
							<!-- 프로그램종류 -->
							<div class="dib">
								<div class="poa_r width-50 tar"> 
									<div class="tit_100 dib vat">
				                        <label id="lbJawon">*프로그램종류</label>
				                    </div>
									<div id="cboJawon" data-ax5select="cboJawon" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-30 dib tal"></div>
								    <input class="width-50 margin-5-left" id="txtExeName" name="txtExeName" type="text" readonly="readonly" disabled="disabled"><!--수정-->
								</div>
							</div>
						</div>						
					</div>										 	
					<div class="row">						
						<!-- 프로그램명 -->		
						<div class="width-100">
							<div class="tit_100 poa">
	                        	<label id="lbRsrcName">*프로그램명</label>
	                        </div>
	                        <div class="ml_100">
								<input class="width-100" id="txtRsrcName" name="txtRsrcName" type="text" class="form-control">
							</div>
						</div>
					</div>	
					<div class="row">						
						<!-- 프로그램설명 -->		
						<div class="width-100">
							<div class="tit_100 poa">
	                        	<label id="lbStory">*프로그램설명</label>
	                        </div>
	                        <div class="ml_100">
								<input class="width-100" id="txtStory" name="txtStory" type="text" class="form-control">
							</div>
						</div>
					</div>									 
					<div class="row">						
						<!-- 프로그램경로 -->		
						<div class="width-100">
							<div class="tit_100 poa">
	                        	<label id="lbDir">*프로그램경로</label>
	                        </div>
	                        <div class="ml_100">
								<div id="cboDir" data-ax5select="cboDir" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100"></div>
							</div>
						</div>
					</div>											 
					<div class="row">						
						<!-- SR-ID -->		
						<div class="width-100">
							<div class="tit_100 poa">
	                        	<label id="lbSRID">SR-ID</label>
	                       	</div>
	                        <div class="ml_100">
								<div id="cboSRID" data-ax5select="cboSRID" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100"></div>
							</div>
						</div>
					</div>	
					<div class="row" style="font-size: 14px;">
						<div class="dib margin-7-top width-100 por">
							<p>- 프로그램명은 소스파일 기준으로 확장자까지 입력하여 주시기 바랍니다.</p>
							<p>- 시스템/프로그램종류/프로그램명을 검색조건으로 사용합니다.</p>
						</div>
					</div>
				</div>
				<!--입력 우측-->
				<div class="r_wrap tar width-30 vat">
					<div class="row ml_7">							
						<!-- 업무 -->		
						<div>
							<div class="tit_100 poa tar">
	                        	<label id="lbJob">*업무</label>
	                        </div>
							<div id="cboJob" data-ax5select="cboJob" data-ax5select-config="{size:'sm',theme:'primary'}" class="ml_100 tal"></div>
						</div>
					</div>
					<div class="row ml_7">							
						<div class="vat dib">
							<button id="btnRegist" name="btnRegist" class="btn_basic_s">등록</button>
						</div>
						<div class="vat dib margin-5-left"><!--수정-->
							<button id="btnDevRep" name="btnDevRep" class="btn_basic_s">개발영역연결등록</button>
						</div>
					</div>
					<div class="row ml_7">
						<div class="vat dib">
							<button id="btnLocalRep" name=btnLocalRep class="btn_basic_s" disabled="true">로컬영역연결등록</button>
						</div>
					</div>
					<div class="row ml_7">						
						<div class="vat dib">
							<button id="btnInit" name="btnInit" class="btn_basic_s">초기화</button>
						</div>
						<div class="vat dib margin-5-left"><!--수정-->
							<button id="btnQry" name="btnQry" class="btn_basic_s" data-grid-control="excel-export">조회</button>
						</div>
						<div class="vat dib margin-5-left"><!--수정-->
							<button id="btnDel" name="btnDel" class="btn_basic_s" data-grid-control="excel-export">삭제</button>
						</div>
					</div>
				</div>		
			</div>
		</div>
		<!-- 게시판 S-->
	    <div class="az_board_basic" style="height:60%;">
	    	<div data-ax5grid="grdProgList" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
		</div>	
		<!-- 게시판 E -->
	</div>
</div>
<!-- contener E -->
</body>

<form name="popPam" id="popPam" method="post">
	<INPUT type="hidden" name="UserId" id="UserId"> 
	<INPUT type="hidden" name="SysCd" id="SysCd">
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/dev/ProgRegister.js"/>"></script>