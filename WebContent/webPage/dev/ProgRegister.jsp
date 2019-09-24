<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp"/>

<!-- contener S -->
    <div class="contentFrame">
        <!-- history S-->
        <div id="history_wrap"></div>
        <!-- history E-->   
		<!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap sr_status">
				<div class="l_wrap dib" style="width:calc(100% - 160px);">
	                <div class="por">
	                	<div class="width-33 dib vat">
		                	<label class="tit-60 dib poa">*시스템</label>
		                	<div class="ml_60">
			                    <div id="cboSystem1" data-ax5select="cboSystem1" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		                	</div>
						</div>
						<div class="width-33 dib vat">
							<label class="tit-150 dib poa">&nbsp;&nbsp;&nbsp;프로그램종류</label>
							<div class="ml_100">
								<div id="cboJawon1" data-ax5select="cboJawon1" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
							</div>
						</div>	
						<div class="width-33 dib vat">
		                	<label class="tit-150 dib poa">&nbsp;&nbsp;&nbsp;프로그램명</label>
		                	<div class="ml_80">
								<input id="txtRsrcName1" type="text" placeholder="프로그램명을 입력하세요." class="width-100" />
		                	</div>
						</div>
					</div>
				</div>
				<div class="r_wrap">
					<div class="vat dib">
						<div class="vat dib">
							<button id="btnInit1" name="btnInit1" class="btn_basic_s">초기화</button>
						</div>
						<div class="vat dib margin-5-left">
							<button id="btnQry" name="btnQry" class="btn_basic_s">조회</button>
						</div>
						<div class="vat dib margin-5-left">
							<button id="btnDel" name="btnDel" class="btn_basic_s">삭제</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 게시판 S-->
	    <div class="az_board_basic" style="height:65%;">
	    	<div data-ax5grid="grdProgList" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
		</div>
		<!-- 게시판 E -->
		<div class="half_wrap" style="margin-top:10px;">
			<div class="row">
				<div class="l_wrap width-50">
	               	<label class="tit-150 dib poa">*시스템</label>
	               	<div class="ml_100">
	                    <div id="cboSystem2" data-ax5select="cboSystem2" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
	               	</div>
				</div>
				<div class="r_wrap width-50">
					<label class="tit-150 dib poa">&nbsp;&nbsp;&nbsp;*프로그램종류</label>
					<div class="ml_100">
						<div id="cboJawon2" data-ax5select="cboJawon2" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-30 dib tal"></div>
					    <input id="txtExeName" name="txtExeName" type="text" readonly="readonly" disabled="disabled" style="width:calc(70% - 5px);">
					</div>
				</div>
			</div>
			<div class="row">
				<div class="l_wrap width-50" style="margin-top:3px;">
               		<label class="tit-150 dib poa">*프로그램명</label>
	               	<div class="ml_100">
						<input id="txtRsrcName2" type="text" placeholder="프로그램명을 입력하세요." class="width-100" />
	               	</div>
				</div>
				<div class="r_wrap width-50" style="margin-top:3px;">
					<label class="tit-150 dib poa">&nbsp;&nbsp;&nbsp;*업무</label>
					<div class="ml_100">
						<div id="cboJob" data-ax5select="cboJob" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="l_wrap width-100" style="margin-top:3px;">
               		<label class="tit-150 dib poa">*프로그램설명</label>
	               	<div class="ml_100">
						<input id="txtStory" type="text" placeholder="프로그램설명을 입력하세요." class="width-100" />
	               	</div>
				</div>
			</div>
			<div class="row">
				<div class="l_wrap width-100" style="margin-top:3px;">
	               	<label class="tit-150 dib poa">*프로그램경로</label>
	               	<div class="ml_100">
	                    <div id="cboDir" data-ax5select="cboDir" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
	               	</div>
				</div>
			</div>
			<div class="row">
				<div class="l_wrap" style="width:calc(100% - 130px);margin-top:3px;">
	               	<label class="tit-150 dib poa">SR정보</label>
	               	<div class="ml_100">
	                    <div id="cboSRID" data-ax5select="cboSRID" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
	               	</div>
				</div>
				<div class="r_wrap" style="margin-top:3px;">
					<div class="vat dib">
						<div class="vat dib">
							<button id="btnInit2" name="btnInit2" class="btn_basic_s" style="width:65px;">초기화</button>
						</div>
						<div class="vat dib">
							<button id="btnRegist" name="btnRegist" class="btn_basic_s" style="width:54px;">등록</button>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="l_wrap" style="width:calc(100% - 130px);margin-top:7px;">
					<p class="txt_r font_12">프로그램명은 소스파일 기준으로 확장자까지 입력하여 주시기 바랍니다.</p>
				</div>
				<div class="r_wrap" style="margin-top:3px;">
					<button id="btnDevRep" name="btnDevRep" class="btn_basic_s">개발영역연결등록</button>
				</div>
			</div>
		</div>
	</div>
<!-- contener E -->

<form name="popPam" id="popPam" method="post">
	<INPUT type="hidden" name="UserId" id="UserId"> 
	<INPUT type="hidden" name="SysCd" id="SysCd">
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/dev/ProgRegister.js"/>"></script>