<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div id="wrapper">
	<!-- Header -->
	<div id="header"></div>
    <div class="content">    	
        <!-- history S-->
        <div id="history_wrap">관리자<strong>&gt; 실행모듈정보</strong></div>
        <!-- history E-->    
        
        <div class="half_wrap">
			<div class="l_wrap width-50"><!--ver2-->
				<label class="width-30">[프로그램목록]</label>
				<label class="width-10">프로그램종류</label>
				<div class="width-45 dib">
					<div id="cboRsrc" data-ax5select="cboRsrc" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
				</div>
				<div class="width-10 dib vat">
					<input type="checkbox" class="checkbox-module" id="chkNoPrg" data-label="미연결건"/>
				</div>
			</div>
			
			<div class="r_wrap width-50"><!--ver2-->
				<label class="width-100">[맵핑프로그램목록]</label>
			</div>
			
			<div class="width-50"><!--ver2-->
				<label class="width-7">시스템</label>
				<div class="width-23 dib">
					<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
				</div>
				<label class="width-10">프로그램명</label>
				<input id="txtPrg" name="txtPrg" type="text" class="width-45">
				<button id="btnQryPrg" name="btnQryPrg" class="width-5 btn_basic_s" style="cursor: pointer;">적용</button>
			</div>
			
			<div class="r_wrap width-50"><!--ver2-->
				<label class="width-9">프로그램명</label>
				<input id="txtMod" name="txtMod" type="text" class="width-50">
				<button id="btnQryMod" name="btnQryMod" class="width-5 btn_basic_s" style="cursor: pointer;">검색</button>
				<div class="width-10 dib float-right">
					<input type="checkbox" class="checkbox-module" id="chkNoMod" data-label="미연결건"/>
				</div>
			</div>
		</div>

		<div class="l_wrap dib width-50 vat"><!--ver2-->
			<div class="az_board_basic margin-10-top" style="height: 20%;">
				<div data-ax5grid="prgGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
			</div>
		</div>
		
		<div class="r_wrap dib width-50 vat"><!--ver2-->
			<div class="az_board_basic margin-10-top" style="height: 20%;">
				<div data-ax5grid="modGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
			</div>
		</div>
		
		<div class="az_search_wrap margin-5-top">
			<div class="az_in_wrap">
				<div class="l_wrap width-70">
					<div class="vat dib">
						<label class="dib">[연관등록목록]</label>
					</div>
					<div class="dib">
						<input id="optAll"  type="radio" name="radio" value="all"/>
						<label for="optAll">전체</label>
						<input id="optPrg" type="radio" name="radio" value="prg"/>
						<label for="optPrg">프로그램명</label>
						<input id="optMod" type="radio"  name="radio" value="mod"/>
						<label for="optMod">맵핑프로그램명</label>
					</div>
					<input id="txtModList" name="txtModList" type="text" class="width-30 dib">
					<button id="btnQry" name="btnQry" class="width-5 btn_basic_s" style="cursor: pointer;">검색</button>
				</div>	
				<div class="r_wrap">
					<div class="vat dib">
						<button id="btnExcel" name="btnReg" class="btn_basic_s" style="cursor: pointer;" >엑셀저장</button>
					</div>
					<div class="vat dib">
						<button id="btnReq" class="btn_basic_s" style="cursor: pointer;">등록</button>
					</div>
				</div>
			</div>
		</div>
		
		<div class="az_board_basic" style="height: 50%;">
			<div data-ax5grid="modListGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>
		
		<div class="r_wrap">
			<div class="vat dib">
				<button id="btnDel" name="btnDel" class="btn_basic_s" style="cursor: pointer;" >폐기</button>
			</div>
		</div>
		
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/program/ModuleInfo.js"/>"></script>
	