<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />


<div id="wrapper">
    <div class="contentFrame"> 
        <!-- history S-->
        <div id="history_wrap"></div>
        <!-- history E-->      
	    <!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap por">
				<!-- 시스템 -->		
                <div class="width-30 dib vat">
                    <label id="lbSystem" class="poa" style="width:50px;">시스템</label>
                    <div class="vat" style="margin-left: 50px;">
						<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" class="dib" style="width:calc(100% - 10px);"></div>
					</div>
				</div>
			    <!-- 프로그램종류 -->
                <div class="width-30 dib vat">
                    <label id="lbJawon" class="tit_80 poa">프로그램종류</label>
                    <div class="ml_80 vat">
						<div id="cboRsrc" data-ax5select="cboRsrc" data-ax5select-config="{size:'sm',theme:'primary'}" class="dib" style="width:calc(100% - 10px);" ></div>
					</div>
				</div>
			    <!-- 프로그램명 -->
                <div class="width-40 dib vat">						
					<input id="optAll"  type="radio" name="radio" value="all"/>
					<label for="optAll">전체</label>
					<input id="optPrg" type="radio" name="radio" value="prg"/>
					<label for="optPrg">프로그램명</label>
					<input id="optMod" type="radio"  name="radio" value="mod"/>
					<label for="optMod">맵핑프로그램명</label>
					<input id="txtRsrcName" name="txtRsrcName" type="text" class="dib" style="width:calc(100% - 300px);">
					<button id="btnQry" name="btnQry" class="btn_basic_s margin-5-left margin-10-right poa_r" data-grid-control="excel-export">조회</button>
				</div>				
				<div class="margin-5-top tar">
					<button id="btnExcel" class="btn_basic_s">엑셀저장</button>
					<button id="btnDel" class="btn_basic_s margin-5-left">폐기</button>
					<button id="btnReq" class="btn_basic_s margin-5-left">맵핑등록</button>
				</div>
			</div>
		</div>
	    <!-- 검색 E-->
	    <!-- 게시판 S-->
	    <div class="az_board_basic" style="height:calc(100% - 130px);">
	    	<div data-ax5grid="modListGrid" style="height: 100%;"></div>
		</div>	
		<!-- 게시판 E -->
	</div>
</div>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/program/ModuleInfo.js"/>"></script>
	