<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
<c:import url="/js/ecams/common/commonscript.jsp" />

<div class="half_wrap">
	<!--하단 좌측-->
	<div class="l_wrap width-48 vat write_wrap"><!--ver2-->
		<div class="row">
			<dl>
				<dt><label>SR번호</label></dt>
				<dd><input id="txtSRID" name="txtSRID" type="text" class="width-80" disabled="disabled"><label class="poa_r"><input type="checkbox" class='checkbox-pie' data-label="신규등록" id="chkNew"></label></dd>
			</dl>
		</div>	
		<div class="row">
			<dl>				
				<dt><label>등록인</label></dt>
				<dd><input id="txtRegUser" name="txtRegUser" type="text" disabled="disabled"></dd>
			</dl>
		</div>
		<div class="row half cb">
			<dl>
				<dt><label>문서번호</label></dt>
				<dd><input id="txtDocuNum" name="txtDocuNum" type="text"></dd>
			</dl>
			<dl>
				<dt class="tar"><label>*요청부서</label></dt>
				<dd><input id="txtOrg" name="txtOrg" type="text"></dd>
			</dl>
		</div>
		<div class="row">
			<dl>
				<dt><label>*요청제목</label></dt>
				<dd><input id="txtReqSubject" name="txtReqSubject" type="text"></dd>
			</dl>
		</div>
		<div class="row">
			<dl>
				<dt><label>*상세내용</label></dt>
				<dd>
					<form>
						<textarea id="texReqContent" name="texReqContent" style="align-content:left;width:100%;height:180px;resize: none;"></textarea>
					</form>
				</dd>
			</dl>
		</div>
		<!-- 분류유형 -->
		<div class="row">
		    <dl>
		    	<dt><label id="lbUser">*분류유형</label></dt>
			    <dd>
					<div id="cboCatTypeSR" data-ax5select="cboCatTypeSR" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib"></div>
				</dd>
			</dl>
		</div>
		<!-- 변경종류 -->
		<div class="row">
		    <dl>
		    	<dt><label id="lbUser">*변경종류</label></dt>
			    <dd>
					 <div id="cboChgType" data-ax5select="cboChgType" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib"></div>
				</dd>
			</dl>
		</div>				
		<!-- 작업순위 -->
		<div class="row">
		    <dl>
		    	<dt><label id="lbUser">*작업순위</label></dt>
			    <dd>
					<div id="cboWorkRank" data-ax5select="cboWorkRank" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib"></div>
				</dd>
			</dl>
		</div>			
		<!-- 보안요구사항 -->
		<div class="row">
		    <dl>
		    	<dt><label id="lbUser">보안요구사항</label></dt>
			    <dd>
					<div id="cboReqSecu" data-ax5select="cboReqSecu" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib"></div>
					<input id="txtReqSecu" name="txtReqSecu" class="form-control" type="text" style="display:none;"></input>
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
		            	<input id="datReqComDate" type="text" class="f-cal" placeholder="yyyy/mm/dd"><span class="btn_calendar poa_r"><i class="fa fa-calendar-o"></i></span>
		         	</div>
		        </dd>
			</dl>
		</div>
		<div class="row">
			<dl>
				<dt>
					<div>
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
						<input id="txtUser" name="txtUser" type="text" style="width:15%;" class="vat">
						<div id="cboDevUser" data-ax5select="cboDevUser" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="Cbo_User_Click()" class="dib width-60"></div>
						<div  class="poa_r vat">
							<button id="btnAddDevUser" name="btnAddDevUser" class="btn_basic_s">추가</button>
							<button id="btnDelDevUser" name="btnDelDevUser" class="btn_basic_s">삭제</button>
						</div>								
					</div>
					<div class="az_board_basic scroll_h az_board_basic_in">
				    	<div data-ax5grid="devUserGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 115px;"></div>
				    </div>
				</dd>
			</dl>
		</div>
	</div>
	<!--하단 컨텐츠 버튼 -->
	<div class="btn_wrap_r">
		<button id="btnRegister" name="btnRegister" class="btn_basic">등록</button><button id="btnUpdate" name="btnUpdate" class="btn_basic">수정</button><button id="btnDelete" name="btnDelete" class="btn_basic">반려</button>
	</div>
</div>

<script type="text/javascript" src="<c:url value="/js/ecams/tab/SR/SRRegisterTab.js"/>"></script>
