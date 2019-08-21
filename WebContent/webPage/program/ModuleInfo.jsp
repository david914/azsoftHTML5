<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />


<div class="content">
	<div id="history_wrap">프로그램 <strong>&gt; 실행모듈정보</strong></div>
</div>

<div class="half_wrap_w">
	<div class="l_wrap width-50 dib margin-10-bottom">
		<div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="por">					
					<div class="width-40 dib vat">
						<label class="title">[프로그램목록]</label>
					</div>
					
					<div class="width-50 dib vat">
						<label class="tit_80 dib poa">프로그램종류</label>
						<div class="ml_80">
							<div id="cboRsrc" data-ax5select="cboRsrc" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-70 dib"></div> 
							<div class="vat dib poa_r">
								<input type="checkbox" class="checkbox-module" id="chkNoPrg" data-label="미연결건"/>
							</div>
						</div>
						
					</div>
					
				</div>	
				
				<div class="sm-row por vat">					
					<div class="width-40 dib">
						<label>시스템</label>
						<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-70 dib"></div> 
					</div>
					
					<div class="width-50 dib vat">
						<label class="tit_80 dib poa">프로그램명</label>
						<div class="ml_80">
							<input id="txtPrg" type="text" class="width-70 dib">
						</div>										
						<div class="vat poa_r">
							<button id="btnQryPrg" class="btn_basic_s">검색</button>
						</div>
					</div>
				</div>	
			</div>
		</div>
		
		<div class="az_board_basic" style="height: 25%">
			<div data-ax5grid="prgGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>	
	</div>
	
	<div class="r_wrap width-50 dib margin-10-bottom">
		<div class="margin-5-left">
			<div class="az_search_wrap">
				<div class="az_in_wrap">
					<div class="por">					
						<div class="width-40 dib vat">
							<label id="lbUser" class="title">[맵핑프로그램목록]</label>
						</div>
					</div>	
					<div class="sm-row por vat">
						<div class="vat">
							<label>프로그램명</label>
							<input id="txtMod" type="text" class="width-60">									
							<div class="vat dib margin-5-left">
								<button id="btnQryMod" class="btn_basic_s">검색</button>
							</div>
							<div class="vat poa_r">
								<input type="checkbox" class="checkbox-module " id="chkNoMod" data-label="미연결건"/>
							</div>
						</div>
					</div>	
				</div>
			</div>
			<div class="az_board_basic" style="height: 25%">
				<div data-ax5grid="modGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
			</div>	
		</div>
	</div>
</div>

<div class="por">
	<div class="sm-row vat margin-10-left">
		<label class="title">[연관등록목록]</label>
					
		<input id="optAll"  type="radio" name="radio" value="all"/>
		<label for="optAll">전체</label>
		<input id="optPrg" type="radio" name="radio" value="prg"/>
		<label for="optPrg">프로그램명</label>
		<input id="optMod" type="radio"  name="radio" value="mod"/>
		<label for="optMod">맵핑프로그램명</label>
			
		<input id="txtModList" type="text" class="width-40">
		
		<div class="vat dib margin-5-left">
			<button id="btnQry" class="btn_basic_s">검색</button>
		</div>
		
		<div class="dib poa_r">
			<div class="vat dib margin-5-left">
				<button id="btnExcel" class="btn_basic_s">엑셀저장</button>
			</div>
			<div class="vat dib margin-5-left">
				<button id="btnReq" class="btn_basic_p">등록</button>
			</div>
			<div class="vat dib margin-5-left">
				<button id="btnDel" class="btn_basic_p">폐기</button>
			</div>
		</div>
	</div>
	<div class="sm-row cb por">			
		<div class="az_board_basic" style="height: 55%;">
			<div data-ax5grid="modListGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>				
	</div>	
</div>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/program/ModuleInfo.js"/>"></script>
	