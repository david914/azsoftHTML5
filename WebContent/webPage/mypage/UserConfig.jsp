<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
	<div id="history_wrap">기본관리<strong>&gt; 사용자환경설정</strong></div>
	     
	<div class="az_search_wrap">
		<div class="az_in_wrap">
			<div class="row vat">
				<div class="width-30 dib vat">
					<div class="tit_100 poa">
						<label>시스템명</label>
					</div>
					<div class="ml_100">
						<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
					</div>
				</div>
				<div class="width-70 dib">
					<div class="tit_100 poa margin-10-left">
						<label>Agent설치 경로</label>
					</div>
					<div class="ml_100 tal">
						<input id="txtAgentDir" type="text" class="width-100"></input>
					</div>
				</div>
			</div>
			
			<div class="row vat">
				<div class="width-100 dib">
						<div class="tit_100 poa">
							<label>개발 Home 경로</label>
						</div>
						<div class="ml_100 tal">
							<input id="txtDevDir" type="text" class="width-100"></input>
						</div>
				</div>
			</div>
			
			<div class="row vat">
				<div class="width-100">
					<div class="float-right">
						<button id="btnReq"  class="btn_basic_s">등록</button>
						<button id="btnDel"  class="btn_basic_s margin-5-left">삭제</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="row vat">
		<div class="width-100 dib">
			<div class="az_board_basic" style="height: 82%;">
				<div data-ax5grid="userConfigGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
			</div>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/mypage/UserConfig.js"/>"></script>