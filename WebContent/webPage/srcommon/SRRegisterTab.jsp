<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
 
<section>
	<div class="container-fluid">
		<div class="border-style-black">
			<div class="row">
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 text-right no-padding margin-5-top"> 
						<label id="lbSRID">SR번호</label>
					</div>
					<div class="col-sm-3 col-xs-12 no-padding margin-3-top">
						<input id="txtSRID" name="txtSRID" class="form-control" type="text" readonly></input>
					</div>
					<div class="col-sm-2 col-xs-12 no-padding margin-5-top">
						<input type="checkbox" class="checkbox-pie form-check-input" id="chkNew">
		    			<label class="form-check-label" for="exampleCheck1" >신규등록</label>
					</div>
					
					<div class="col-sm-1 col-xs-12 text-right no-padding margin-5-top"> 
						<label id="lbRegUser">등록인</label>
					</div>
					<div class="col-sm-5 col-xs-12 no-padding margin-3-top">
						<input id="txtRegUser" name="txtRegUser" class="form-control" type="text" readonly></input>
					</div>
				</div> 
				
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 text-right no-padding margin-5-top"> 
						<label id="lbRegDate">등록일시</label>
					</div>
					<div class="col-sm-11 col-xs-12 no-padding margin-3-top">
						<input id="txtRegDate" name="txtRegDate" class="form-control" type="text" readonly></input>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 text-right no-padding margin-10-top"> 
						<label id="lbDocuNum">문서번호</label>
					</div>
					<div class="col-sm-5 col-xs-12 no-padding margin-3-top">
						<input id="txtDocuNum" name="txtDocuNum" class="form-control" type="text"></input>
					</div>
					<div class="col-sm-1 col-xs-12 text-right no-padding margin-10-top">
						<label id="lbReqDept">*요청부서</label>
					</div>
					<div class="col-sm-5 col-xs-12 text-right no-padding margin-5-top"> 
						<input id="txtDept" name="txtDept" class="form-control" type="text"></input>
					</div>
				</div> 
				
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 text-right no-padding margin-10-top"> 
						<label id="lbRegComDate">*완료요청일</label>
					</div>
					<div class="col-sm-11 col-xs-12 no-padding">
						<div class="input-group" data-ax5picker="basic2">
				            <input id="datReqComDate" type="text" class="form-control" placeholder="yyyy/mm/dd">
				            <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
				        </div>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 text-right no-padding margin-5-top"> 
						<label id="lbReqSubject">*요청제목</label>
					</div>
					<div class="col-sm-11 col-xs-12 no-padding">
						<input id="txtReqSubject" name="txtReqSubject" class="form-control" type="text"></input>
					</div>
				</div> 
				<div class="col-sm-6 col-xs-12 no-padding height-30px">
				</div>
			</div>
			
			
			<div class="row">
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 text-right no-padding margin-5-top"> 
						<label id="lbReqContent">*상세내용</label>
					</div>
					<div class="col-sm-11 col-xs-12 no-padding margin-5-top">
						<textarea id="texReqContent" name="texReqContent" class="form-control" style="align-content:left;width:100%;height:265px;resize: none;"></textarea>
					</div>
				</div>
				
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 text-right no-padding margin-5-top"> 
						<button id="btnFileAdd" class="btn btn-default" onclick="openSrModal()">파일첨부</button>
					</div>
					<div class="col-sm-11 col-xs-12 no-padding margin-3-top">
						<section>
							<div class="container-fluid">
								<div data-ax5grid="grid_fileList" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 25%;"></div>
							</div>
						</section>
					</div>
				</div>
				
				<div class="col-sm-6 offset-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 text-right no-padding margin-5-top"> 
						<label id="lbDevUser">*담당개발자</label>
					</div>
					<div class="col-sm-1 col-xs-12 no-padding margin-3-top">
						<input id="txtDevUser" name="txtDevUser" class="form-control" type="text"></input>
					</div>
					
					<div class="col-sm-8 col-xs-12 no-padding margin-3-top">
		                <div id="cboDevUser" data-ax5select="cboDevUser" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
					
					<div class="col-sm-1 col-xs-12 no-padding margin-3-top">
						<button id="btnAddDevUser" class="btn btn-default" onclick="openSrModal()">추가</button>
					</div>
					
					<div class="col-sm-1 col-xs-12 no-padding margin-3-top">
						<button id="btnDelDevUser" class="btn btn-default" onclick="openSrModal()">삭제</button>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 no-padding text-right margin-10-top">
						<label id="lbCatTypeSR">*분류유형</label>
					</div>
				
					<div class="col-sm-11 col-xs-12 no-padding margin-5-top"> 
		                 <div id="cboCatTypeSR" data-ax5select="cboCatTypeSR" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
				
				<div class="col-sm-6 offset-col-sm-6 col-xs-12"  style="float:right;">
					<div class="col-sm-1 col-xs-12 no-padding height-30px">
					</div>
				
					<div class="col-sm-11 col-xs-12 no-padding margin-5-top"> 
						<section>
							<div class="container-fluid">
								<div data-ax5grid="devUserGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 25%;"></div>
							</div>
						</section>
					</div>
				</div>
				
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 no-padding text-right margin-10-top">
						<label id="lbChgType">*변경종류</label>
					</div>
				
					<div class="col-sm-11 col-xs-12 no-padding margin-5-top"> 
		                <div id="cboChgType" data-ax5select="cboChgType" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
				
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 no-padding text-right margin-10-top">
						<label id="lbWorkRank">*작업순위</label>
					</div>
				
					<div class="col-sm-11 col-xs-12 no-padding margin-5-top"> 
		                <div id="cboWorkRank" data-ax5select="cboWorkRank" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
				
				<div class="col-sm-6 col-xs-12">
					<div class="col-sm-1 col-xs-12 no-padding text-right margin-10-top">
						<label id="lbReqSecu">보안요구사항</label>
					</div>
				
					<div class="col-sm-11 col-xs-12 no-padding margin-5-top"> 
		                <div id="cboReqSecu" data-ax5select="cboReqSecu" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
						<input id="txtReqSecu" name="txtReqSecu" class="form-control" type="text" style="display:none;"></input>
					</div>
				</div>
			</div>
			
			<div class="row-fluid">
				<div class="col-sm-9 col-xs-12 height-30px">
				</div>
				<div class="col-sm-1 col-xs-12 no-padding margin-5-top">
					<button id="btnRegister" class="btn btn-default" onclick="openSrModal()">등록</button>
				</div>
				<div class="col-sm-1 col-xs-12 no-padding margin-5-top"> 
					<button id="btnUpdate" class="btn btn-default" onclick="openSrModal()">수정</button>
				</div>
				
				<div class="col-sm-1 col-xs-12 no-padding margin-5-top"> 
					<button id="btnDelete" class="btn btn-default" onclick="openSrModal()">반려</button>
				</div>
			</div>
			
		</div>
	</div>
</section>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/srcommon/SRRegisterTab.js"/>"></script>
