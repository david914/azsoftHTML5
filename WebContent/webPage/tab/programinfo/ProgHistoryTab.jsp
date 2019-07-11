<!--  
	* 화면명: 프로그램정보
	* 화면호출:
	 1) 프로그램정보 -> 변경내역 탭
-->

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<!-- contener S -->
<div id="wrapper">
	<!-- 하단 입력 S-->
	<div class="row">
	    <!-- 시스템 -->
        <div class="width-45 dib vat">
            <label id="lbSysMsg2" class="tit_100 poa">프로그램명</label>
            <div class="ml_100">txtSysMsg2
				<input id="txtProgId2" name="" type="text" class="width-100">
			</div>
		</div>	
	    <!-- 프로그램 종류 -->
        <div class="width-45 dib vat">
            <label id="lbStory2" class="tit_100 poa">프로그램한글명</label>
            <div class="ml_100">
				<input id="txtStory2" name="txtStory2" type="text" class="width-100">
			</div>
		</div>				
	</div>		
	<div class="row por">
        <label id="lbUser" class="tit_80 poa">의뢰구분</label>
        <div class="ml_80">
			<div id="cboReq" data-ax5select="cboReq" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-80 dib"></div>
		</div>
		<button id="btnQry2" class="btn_basic_s margin-5-left margin-10-right poa_r" data-grid-control="excel-export">조회</button>
	</div>
	<!-- 하단 입력 E-->			
    <!-- 게시판 S-->
    <div class="row az_board_basic az_board_basic_in">
	    <div data-ax5grid="grdProgHistory" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
	</div>	
	<!-- 게시판 E -->
</div>
<!-- 페이지버튼 S-->
   <!-- contener E -->
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/tab/programinfo/ProgHistoryTab.js"/>"></script>
