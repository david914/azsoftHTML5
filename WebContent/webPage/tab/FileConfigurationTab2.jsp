<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="l_wrap width-100 vat write_wrap_100 ">
	
	<div class="row">
		<label style="color: blue;">[등록대상] 하나의 디렉토리에 파일이 너무 많아서 파일대사 시 하나의 디렉토리에 대해서 별도로 파일을 생성해야 하는 경우 등록</label>
	</div>
	<div class="row">
		<label style="color: blue;">[대상조회] 검색할 디렉토리 입력 후 엔터</label>
	</div>
	
	<div class="row">
		<dl>
			<dt>
				<label>디렉토리</label>
			</dt>
			<dd>
				<input id="txtEtcDir" name="txtEtcDir" type="text" class="width-96">
				<button id="btEtcReq" name="btEtcReq" class="btn_basic_s width-3 float-right" style="cursor: pointer;">등록</button>
			</dd>
		</dl>
	</div>
	<div class="row">
		<dl>
			<dd>
				<div class="az_board_basic margin-10-top" style="height: 38%;">
					<div data-ax5grid="dirGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%"></div>
				</div>
			</dd>
		</dl>
	</div>
	<div class="row">
		<dl>
			<dt>
				<label>예외디렉토리</label>
			</dt>
			<dd>
				<div class="az_board_basic" style="height: 38%;">
					<div data-ax5grid="dirEtcGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%"></div>
				</div>
			</dd>
		</dl>
	</div>
	<div class="row">
		<button id="btEtcDel" name="btEtcDel" class="btn_basic_s width-3 float-right" style="cursor: pointer;">삭제</button>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/FileConfigurationTab2.js"/>"></script>