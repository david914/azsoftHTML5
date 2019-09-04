<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
<style>
[data-ax5select] .ax5select-display.input-sm, [data-ax5select] .input-group-sm>.ax5select-display.form-control, [data-ax5select] .input-group-sm>.ax5select-display.input-group-addon, [data-ax5select] .input-group-sm>.input-group-btn>.ax5select-display.btn
{
	min-width : 0px !important;
}

.wCheck-label{
	margin-right : 0px !important;
}
</style>

<div class="half_wrap" style="height:100%;">
	<!--하단 좌측-->
	<div class="l_wrap width-48 vat write_wrap"><!--ver2-->
		<div class="row">
			<dl>
				<dt><label>SR번호</label></dt>
				<dd><div style="width:calc(100% - 69px);"><input id="txtSRID" name="txtSRID" type="text" style="width: 100%%;" disabled="disabled"></div><div class="poa_r"><input type="checkbox" class='checkbox-pie' data-label="신규등록" id="chkNew"></div></dd>
			</dl>
		</div>	
		<div class="row">
			<dl>				
				<dt><label>등록인</label></dt>
				<dd><input id="txtRegUser" name="txtRegUser" type="text" disabled="disabled" autocomplete="off"></dd>
			</dl>
		</div>
		<div class="row half cb">
			<dl>
				<dt><label>문서번호</label></dt>
				<dd><input id="txtDocuNum" name="txtDocuNum" type="text" autocomplete="off"></dd>
			</dl>
			<dl>
				<dt class="tar"><label>*요청부서</label></dt>
				<dd><input id="txtOrg" name="txtOrg" type="text" autocomplete="off"></dd>
			</dl>
		</div>
		<div class="row">
			<dl>
				<dt><label>*요청제목</label></dt>
				<dd><input id="txtReqSubject" name="txtReqSubject" type="text" autocomplete="off"></dd>
			</dl>
		</div>
		<div class="row">
			<dl>
				<dt><label>*상세내용</label></dt>
				<dd>
					<form>
						<textarea id="texReqContent" name="texReqContent" style="align-content:flex-start;width:100%;height:180px;resize: none;"></textarea>
					</form>
				</dd>
			</dl>
		</div>
		<!-- 분류유형 -->
		<div class="row">
		    <dl>
		    	<dt><label id="lbUser">*분류유형</label></dt>
			    <dd>
					<div id="cboCatTypeSR" data-ax5select="cboCatTypeSR" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib" style="min-width: 0;"></div>
				</dd>
			</dl>
		</div>
		<!-- 변경종류 -->
		<div class="row">
		    <dl>
		    	<dt><label id="lbUser">*변경종류</label></dt>
			    <dd>
					 <div id="cboChgType" data-ax5select="cboChgType" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib" style="min-width: 0;"></div>
				</dd>
			</dl>
		</div>				
		<!-- 작업순위 -->
		<div class="row">
		    <dl>
		    	<dt><label id="lbUser">*작업순위</label></dt>
			    <dd>
					<div id="cboWorkRank" data-ax5select="cboWorkRank" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib" style="min-width: 0;"></div>
				</dd>
			</dl>
		</div>			
		<!-- 보안요구사항 -->
		<div class="row">
		    <dl>
		    	<dt><label id="lbUser">보안요구사항</label></dt>
			    <dd>
					<div id="cboReqSecu" data-ax5select="cboReqSecu" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib" style="min-width: 0;"></div>
					<input id="txtReqSecu" name="txtReqSecu" class="form-control" type="text" style="display:none; min-width: 0;" autocomplete="off"></input>
				</dd>
			</dl>
		</div>
	</div>
	<!--하단 우측-->
	<div class="r_wrap width-48 vat write_wrap"><!--ver2-->		
		<div class="row">
			<dl>
				<dt><label>등록일시</label></dt>
				<dd><input id="txtRegDate" name="txtRegDate" type="text" style="width:100%;" disabled="disabled"></dd>
			</dl>
		</div>
		<div class="row">
			<dl>
				<dt><label>*완료요청일</label></dt>
				<dd>
					<div class="az_input-group" data-ax5picker="basic2">
		            	<input id="datReqComDate" type="text" class="f-cal" placeholder="yyyy/mm/dd" autocomplete="off"><span class="btn_calendar poa_r"><i class="fa fa-calendar-o"></i></span>
		         	</div>
		        </dd>
			</dl>
		</div>
		<div class="row">
			<dl>
				<dt>
					<div>
						<div style="display:none;" id="fileSave"></div>
						<button id="btnFileAdd" name="btnFileAdd" class="btn_basic_s vat mt3m">파일첨부</button>
					</div>
				</dt>
				<dd>
					<div class="az_board_basic scroll_h az_board_basic_in">
				    	<section>
							<div class="container-fluid">
								<div data-ax5grid="grid_fileList" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 115px;"></div>
							</div>
						</section>
				    </div>
				</dd>
			</dl>
		</div>
		<div class="row">
			<dl>
				<dt><label>*담당개발자</label></dt>						
				<dd>
					<div class="vat">
						<input id="txtUser" name="txtUser" type="text" style="width:15%;" class="vat" autocomplete="off">
						<div id="cboDevUser" data-ax5select="cboDevUser" data-ax5select-config="{size:'sm',theme:'primary'}" class="dib width-31"></div>
							<button id="btnAddDevUser" name="btnAddDevUser" class="btn_basic_s">추가</button>
							<button id="btnDelDevUser" name="btnDelDevUser" class="btn_basic_s">삭제</button>
					</div>
					<div class="az_board_basic scroll_h az_board_basic_in" style="height:45%;">
				    	<div data-ax5grid="devUserGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
				    </div>
				</dd>
			</dl>
		</div>
		<div class="row" id="gyulDiv" style="display: none;">
			<dl>
				<dt><label style="margin-left:-10px">결재/반려의견</label></dt>
				<dd>
					<form>
						<textarea id="txtConMsg" name="txtConMsg" style="align-content:flex-start;width:100%;height:50px;resize: none;"></textarea>
					</form>
				</dd>
			</dl>
		</div>
	</div>
	<!--하단 컨텐츠 버튼 -->
	<div class="btn_wrap_r">
		<button id="btnOK" name="btnOK" class="btn_basic" style="display: none;">결재</button><button id="btnCncl" name="btnCncl" class="btn_basic" style="display: none;">반려</button><button id="btnConf" name="btnConf" class="btn_basic" style="display: none;">결재정보</button><button id="btnRegister" name="btnRegister" class="btn_basic">등록</button><button id="btnUpdate" name="btnUpdate" class="btn_basic">수정</button><button id="btnDelete" name="btnDelete" class="btn_basic">삭제</button>
	</div>
	
</div>
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/tab/sr/SRRegisterTab.js"/>"></script>
