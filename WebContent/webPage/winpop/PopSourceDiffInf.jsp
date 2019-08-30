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
<div id="wrapper">
    <div class="content">
        <!-- line1 S-->    
		<div style="width:100%; display: inline-block; padding: 3px 0; border-top: 1px solid #ccc;">
			<div class="az_search_wrap" style="width:57%; margin-right:5px;vertical-align: top;">
				<div class="az_in_wrap por" style="width:100%;">
					<!-- 시스템 -->		
	                <div class="width-50 dib vat">
	                    <label id="lbSystem" style="width:50px;" class=" poa">시스템</label>
	                    <div style="margin-left: 50px;">
							<input id="txtSysMsg" name="txtSysMsg" type="text" class="width-100" readonly >
						</div>
					</div>
				    <!-- 프로그램명 -->
	                <div class="width-50 dib vat">
	                    <label id="lbRsrcName" style="width:70px;margin-left:10px;" class="poa">프로그램명</label>
	                    <div style="margin-left: 90px;">
							<input id="txtProgId" name="txtProgId" type="text" style="width:100%"; readonly>
						</div>
					</div>					
				</div>
				<div class="dib vat" style="width:99%;">
				    <!-- 프로그램경로 -->
	                   <div class="vat">
	                       <label id="lbDirPath" class="poa" style="margin-left: 10px;">경로</label>
						 <div style="margin-left: 60px;margin-top: 2px;">
							<input id="txtDir" name="txtDir" type="text" style="width:100%;" readonly>
						</div>
					</div>					
				</div>
				<div class="margin-5-right" style="width:99%;">                	
					<!-- 게시판 S-->
				    <div style="height:150px;width:100%; margin-top: 2px;">
				    	<div data-ax5grid="grdProgHistory_Acptno" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
					</div>	
				</div>
			</div>
			<div class="az_search_wrap" style="width:42%;vertical-align: top;">
				<!-- 게시판 S-->
			    <div class="az_board_basic" style="height:151px;">
			    	<div data-ax5grid="grdProgHistory" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
				</div>	
				<div class="r_wrap width-60 tar" style="margin-top:2px;">
					<input id="optWord"  type="radio" name="optradio"  value="W" onchange="optradio_change();" checked/>
					<label for="optWord">단어검색</label>
					<input id="optLine" type="radio"  name="optradio"  value="L" onchange="optradio_change();"/>
					<label for="optLine">라인검색</label>
					<input id="txtSearch" name="txtSearch" type="text" style="width:200px;" onchange="txtSearch_change();" >
					<button id="btnSearch" name="btnSearch"  class="btn_basic_s margin-5-left" >찾기</button>
					
					<button id="btnExcel" class="btn_basic_s margin-5-left" style="margin-top:2px">엑셀저장</button>
					<button id="btnVerDiff" class="btn_basic_s" style="margin-top:2px">버전비교</button>
					<button id="btnSrcDiff" class="btn_basic_s" style="margin-top:2px">변경내용</button>
					<button id="btnChgPart" class="btn_basic_s" style="margin-top:2px">변경위치</button>
				</div>
			</div>
		</div>
		
		<!--line1 E-->
		<div class="vat cb" style="margin-top:-12px;">
			<div>
               	<label class="tit_60 poa txt_r">삭제라인</label>
                <div class="ml_60">
					<input class="width-8 txt_r" id="txtDelLine" type="text" style="text-align: center;" readonly/>
					<label class="tit_60 poa txt_b">추가라인</label>
					<input class="width-8 txt_b ml_60" id="txtAddLine" type="text" style="text-align: center;" readonly />
	               	<label class="tit_60 poa" style="color: #b21db2;">변경(전)</label>
					<input class="width-8 ml_60" id="txtBefLine" type="text" style="text-align: center;color: #b21db2;" readonly />
	               	<label class="tit_60 poa" style="color: #b21db2;">변경(후)</label>
					<input class="width-8 ml_60" id="txtAftLine" type="text" style="text-align: center;color: #b21db2;" readonly />
				</div>
			</div>
		</div>	
		<div class="margin-5-top width-100" style="height:calc(100% - 370px);">
			<!-- 게시판 S-->
		    <div class="az_board_basic" style="height:100%";>
		    	<div data-ax5grid="grdDiffSrc" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
			</div>	
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
<script type="text/javascript"	src="<c:url value="/js/ecams/winpop/PopSourceDiffInf.js"/>"></script>