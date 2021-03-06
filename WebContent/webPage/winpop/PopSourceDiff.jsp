<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page errorPage="error.jsp" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ page import="com.ecams.common.base.StringHelper"%>
<%
	String acptNo = StringHelper.evl(request.getParameter("acptno"),"");
	String userId = StringHelper.evl(request.getParameter("user"),"");
	String itemId = StringHelper.evl(request.getParameter("itemid"),"");
%>
<c:import url="/webPage/common/common.jsp" />

<!-- contener S -->
<body id="wrapper" style="padding: 10px;">
   <div class="content">
        <!-- history S-->
        <div id="history_wrap"></div>
        <!-- history E-->
        <!-- line1 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap por">
				<!-- 시스템 -->		
                <div class="width-25 dib vat">
                    <label id="lbSystem" style="width:50px;" class=" poa">시스템</label>
                    <div style="margin-left: 50px;">
						<input id="txtSysMsg" name="txtSysMsg" type="text" class="width-95 dib" readonly >
					</div>
				</div>
			    <!-- 프로그램명 -->
                <div class="width-25 dib vat">
                    <label id="lbRsrcName" style="width:70px;" class="poa">프로그램명</label>
                    <div style="margin-left: 70px;">
						<input id="txtProgId" name="txtProgId" type="text" class="width-95 dib" readonly>
					</div>
				</div>					
				<div class="width-50 dib vat">
				    <!-- 프로그램경로 -->
                    <div class="vat">
                        <label id="lbDirPath" class="tit_80 poa">프로그램경로</label>
						<div class="ml_80">
							<input id="txtDir" name="txtDir" type="text" class="width-100" readonly>
						</div>
					</div>					
				</div>
			</div>
		</div>
		<!--line1 E-->
		<!-- line2 S-->	
		<div class="margin-5-top vat cb" style="margin-top: 0px;">				
            <div class="l_wrap" style="width:calc(100% - 150px);">
            	<div class="cb">
            		<!-- line 1-->
            		<div class="l_wrap" style="width:calc(100% - 105px);)">
						<div class="margin-5-right">                	
							<!-- 게시판 S-->
						    <div class="az_board_basic" style="height:150px;">
						    	<div data-ax5grid="grdProgHistory" style="height: 100%;"></div>
							</div>	
						</div>
					</div>
					<div class="r_wrap">
						<div class="margin-10-right">
		                	<div>
								<button id="btnVerDiff" class="btn_basic_s" style="width:92px;">버전비교</button>
		                	</div>
		                	<div class="margin-3-top">
								<button id="btnSrcDiff" class="btn_basic_s" style="width:92px;">변경내용</button>
		                	</div>
		                	<div class="margin-3-top">
								<button id="btnChgPart" class="btn_basic_s" style="width:92px;">변경위치</button>
		                	</div>
		                	<div class="margin-3-top">
		                		<button id="btnLeft" class="btn_basic_s">Prev</button>
		                		<button id="btnRight" class="btn_basic_s">Next</button>
		                	</div>
						</div>
					</div>
				</div>
			</div>	
            <div class="r_wrap" style="width:150px">
				<div class="margin-5-left">
					<div>
	                	<label class="tit_60 poa txt_r">삭제라인</label>
	                    <div class="ml_60">
							<input class="width-100 txt_r" id="txtDelLine" type="text" style="text-align: center;" readonly/>
						</div>
					</div>
					<div class="margin-3-top">
	                	<label class="tit_60 poa txt_b">추가라인</label>
	                    <div class="ml_60">
							<input class="width-100 txt_b" id="txtAddLine" type="text" style="text-align: center;" readonly />
						</div>
					</div>
					<div class="margin-3-top">
	                	<label class="tit_60 poa" style="color: #b21db2;">변경(전)</label>
	                    <div class="ml_60">
							<input class="width-100" id="txtBefLine" type="text" style="text-align: center;color: #b21db2;" readonly />
						</div>
					</div>
					<div class="margin-3-top">
	                	<label class="tit_60 poa" style="color: #b21db2;">변경(후)</label>
	                    <div class="ml_60">
							<input class="width-100" id="txtAftLine" type="text" style="text-align: center;color: #b21db2;" readonly />
						</div>
					</div>
				</div>
			</div>
		</div>	
		<!-- line2 e-->		
		<!-- line3 s-->
		<div class="margin-5-top cb width-100">
			<div class="l_wrap width-50">
				<input id="optAll"  type="radio" name="optSysGbn"  value="ALL" onchange="optSysGbn_change();" checked/>
				<label for="optAll">전체</label>
				<input id="optVer"  type="radio" name="optSysGbn"  value="VER" onchange="optSysGbn_change();"/>
				<label for="optVer">체크인</label>
				<input id="optDev"  type="radio" name="optSysGbn"  value="DEV" onchange="optSysGbn_change();"/>
				<label for="optDev">개발</label>
				<input id="optTest"  type="radio" name="optSysGbn"  value="TEST" onchange="optSysGbn_change();"/>
				<label for="optTest">테스트</label>
				<input id="optReal"  type="radio" name="optSysGbn"  value="REAL" onchange="optSysGbn_change();"/>
				<label for="optReal">운영</label>
			</div>
			<div class="r_wrap width-50 tar">
				<input id="optWord"  type="radio" name="optradio"  value="W" onchange="optradio_change();" checked/>
				<label for="optWord">단어검색</label>
				<input id="optLine" type="radio"  name="optradio"  value="L" onchange="optradio_change();"/>
				<label for="optLine">라인검색</label>
				<input id="txtSearch" name="txtSearch" type="text" style="width:200px;" onchange="txtSearch_change();" >
				<button id="btnSearch" name="btnSearch"  class="btn_basic_s" >찾기</button>
				<button id="btnExcel" class="btn_basic_s">엑셀저장</button>
				<button id="btnExit" name="btnExit" class="btn_basic_s">닫기</button>
			</div>
		</div>	
		<!-- line3 e-->	
		<!-- line4 s-->
		<div class="margin-5-top width-100" style="height:calc(100% - 370px);">
			<!-- 게시판 S-->
		    <div class="az_board_basic margin-5-bottom" style="height:100%";>
		    	<div data-ax5grid="grdDiffSrc" style="height: 100%;"></div>
			</div>	
			<!-- 게시판 E -->
			<!-- line4 e-->
			<div class="row">
	        	<label class="tit_60 poa">변경(전)</label>
	            <div class="ml_60">
					<input id="txtBefSrc" class="width-100" type="text" readonly />
				</div>
			</div>
			<div class="margin-5-top">
	        	<label class="tit_60 poa">변경(후)</label>
	            <div class="ml_60">
					<input id="txtAftSrc" class="width-100" type="text" readonly />
				</div>
			</div>
		</div>	
	</div>
</div>

<form name="getSrcData">
	<input type="hidden" name="acptno" value="<%=acptNo%>"/>
	<input type="hidden" name="user" value="<%=userId%>"/>
	<input type="hidden" name="itemid" value="<%=itemId%>"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"	src="<c:url value="/js/ecams/winpop/PopSourceDiff.js"/>"></script>