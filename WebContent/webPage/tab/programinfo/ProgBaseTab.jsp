<!--  
	* 화면명: 프로그램정보
	* 화면호출:
	 1) 프로그램정보 -> 기본정보 탭
-->

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<!-- contener S -->
<div id="wrapper" style="height:100%">
	<!-- 하단 입력 S-->
	<div class="margin-5-top">
	    <!-- 시스템 -->
        <div class="width-33 dib vat">
            <label id="lbSysMsg" class="tit_80 poa">시스템</label>
            <div class="ml_80">
		          <input id="txtSysMsg" name="txtSysMsg" type="text" class="width-80">
			</div>
		</div>	
	    <!-- 프로그램 종류 -->
        <div class="width-33 dib vat">
            <label id="lbRsrcCd" class="tit_80 poa">프로그램종류</label>
            <div class="ml_80" id="divPrgTxt">
				<input id="txtRsrcCd" name="txtRsrcCd" type="text" class="width-80">
			</div>
			<div class="ml_80" id="divPrgCbo">
				<div id="cboRsrcCd" data-ax5select="cboRsrcCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="" class="width-80 dib"></div>
			</div>
		</div>	
	    <!-- 업무  -->
        <div class="width-33 dib vat">
            <label id="lbJob" class="tit_80 poa">업무</label>
            <div class="ml_80" id="divJobTxt">
				<input id="txtJob" name="txtRsrcCd" type="text" class="width-80">
			</div>
            <div class="ml_80" id="divJobCbo">
				<div id="cboJob" data-ax5select="cboJob" data-ax5select-config="{size:'sm',theme:'primary'}" style="" class="width-80 dib"></div>
			</div>
		</div>				
	</div>
	<div class="margin-5-top">
	    <!-- 프로그램명 -->
        <div class="width-33 dib vat">
            <label id="lbProgId" class="tit_80 poa">프로그램명</label>
            <div class="ml_80">
				<input id="txtProgId" name="txtProgId" type="text" class="width-80">
			</div>
		</div>	
	    <!-- 상태 -->
        <div class="width-33 dib vat">
            <label id="lbProgSta" class="tit_80 poa">상태</label>
            <div class="ml_80">
				<input id="txtProgSta" name="txtProgSta" type="text" class="width-80">
			</div>
		</div>
	    <!-- SR-ID -->
        <div class="width-33 dib vat">
            <label id="lbSRID" class="tit_80 poa">SR-ID</label>
            <div class="ml_80" id="divSRTxt">
				<input id="txtSR" name="txtSR" type="text" class="width-80 dib" >
			</div>
            <div class="ml_80" id="divSRCbo">
			    <div id="cboSR" data-ax5select="cboSR" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-80 dib"></div>
			</div>
		</div>		
	</div>
	<div class="margin-5-top">
	    <!-- 프로그램설명 -->
        <label id="lbStory" class="tit_80 poa">프로그램설명</label>
        <div class="ml_80">
			<input id="txtStory" name="txtStory" type="text" class="width-100">
		</div>
	</div>			
	<div class="margin-5-top por">
        <label id="lbDir" class="tit_80 poa">프로그램경로</label>
        <div class="ml_80" id="divDirTxt">
			<input id="txtDir" name="txtDir" type="text" class="width-100">
		</div>
        <div class="ml_80" id="divDirCbo">
		    <div id="cboDir" data-ax5select="cboDir" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib"></div>
		</div>
		<!-- <button class="btn_basic_s margin-5-left margin-10-right poa_r" data-grid-control="excel-export">경로복사</button>-->
	</div>
	<div class="margin-5-top">
		<div class="half_wrap_cb">
			<!--left-->
			<div class="l_wrap width-40">
				<div>
				    <!-- 신규등록인 -->
	                <div class="width-40 dib vat">
	                    <label id="lbCreator" class="tit_80 poa">신규등록인</label>
	                    <div class="ml_80">
							<input id="txtCreator" name="txtCreator" type="text" class="width-80">
						</div>
					</div>				
				    <!-- 최종변경인 -->
	                <div class="width-50 dib vat">
	                    <label id="lbEditor" class="tit_80 poa">최종변경인</label>
	                    <div class="ml_80">
							<input id="txtEditor" name="txtEditor" type="text" class="width-40 dib">
							<div id="cboEditor" data-ax5select="cboEditor" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-30 dib"></div>
						</div>
					</div>
				</div>						
				<div class="row">
				    <!-- 신규등록일 -->
	                <div class="width-40 dib vat">
	                    <label id="lbCreatDt" class="tit_80 poa">신규등록일</label>
	                    <div class="ml_80">
							<input id="txtCreatDt" name="txtCreatDt" type="text" class="width-80">
						</div>
					</div>				
				    <!-- 최종변경일 -->
	                <div class="width-50 dib vat">
	                    <label id="lbLastDt" class="tit_80 poa">최종변경일</label>
	                    <div class="ml_80">
							<input id="txtLastDt" name="txtLastDt" type="text" class="width-70">
						</div>
					</div>
				</div>						
			</div>
			<!--right-->
			<div class="r_wrap width-60">						
				<div class="half_wrap_cb">
					<div class="l_wrap">
						<div>
						    <!-- 신규등록인 -->
			                <div class="dib vat">
			                    <label id="lbLastEditor" class="tit_80 poa">변경인</label>
			                    <div class="ml_80">
									<label class="title_s">체크인</label><input id="txtCkInEditor" name="txtCkInEditor" type="text" class="width-15">
									<label class="title_s">개발</label><input id="txtDevEditor" name="txtDevEditor" type="text" class="width-15">
									<label class="title_s">테스트</label><input id="txtTestEditor" name="txtTestEditor" type="text" class="width-15">
									<label class="title_s">운영</label><input id="txtRealEditor" name="txtRealEditor" type="text" class="width-15">
								</div>
							</div>
						</div>						
						<div class="row">
						    <!-- 신규등록인 -->
			                <div class="dib vat">
			                    <label id="lbLastDate" class="tit_80 poa">변경일</label>
			                    <div class="ml_80">
									<input id="txtCkInLastDt" name="txtCkInLastDt" type="text" class="width-25">
									<input id="txtDevLastDt" name="txtDevLastDt" type="text" class="width-25">
									<input id="txtTestLastDt" name="txtTestLastDt" type="text" class="width-25">
									<input id="txtRealLastDt" name="txtRealLastDt" type="text" class="width-25">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>		
	<div class="tar margin-10-top">
		<button id="btnDel" name="btnDel" onclick="cmd_click()" class="btn_basic">삭제</button>
		<button id="btnRegist" name="btnRegist" onclick="cmd_click()" class="btn_basic">소스비교</button>
		<button id="btnView" name="btnView" onclick="cmd_click()" class="btn_basic">소스보기</button>
		<button id="btnDiff" name=""btnDiff"" onclick="cmd_click()" class="btn_basic">수정</button>
		<button id="btnClose" name=""btnClose"" onclick="cmd_click()" class="btn_basic">폐기</button>
	<!-- <button id="btnReg" name="btnReg" onclick="cmd_click()" class="btn_basic">닫기</button>-->
	</div>
	<!--페이지버튼 E-->
	<!-- 하단 입력 E-->	
   <!-- contener E -->
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/tab/programinfo/ProgBaseTab.js"/>"></script>