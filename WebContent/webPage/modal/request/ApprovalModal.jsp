<!-- 
화면 명: 결재팝업
화면호출:
1) 운영배포화면 -> 운영배포신청버튼 클릭
 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<body style="width: 100% !important; min-width: 820px !important">
<div class="pop-header">
	<div>
		<label id="lbSub">결재절차확정</label>
	</div>
	<div>
		<button type="button" class="close" aria-label="닫기" onclick="popClose()">
		  <span aria-hidden="true">&times;</span>
		</button>
	</div> 
</div>
<div class="container-fluid pop_wrap">
	<div class="row half_wrap_cb">
		<!--프로그램 신청목록-->
		<div class="l_wrap width-50">
			<div class="margin-5-right">
                <label id="" class="tit_80 poa">결재자</label>
                <div class="ml_80">
                	<label><input type="radio" /> 변경</label> <label><input type="radio" /> 추가</label>
                	<div class="poa_r">
                		<input type="text" id="txtName"/><button class="btn_basic_s margin-5-left" id="btnSearch">검색</button> 
                	</div>
                </div>
			</div>				
			<div class="row">
				<div class="az_board_basic az_board_basic_in" style="height:21%">
					<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height:100%"></div>
				</div>
			</div>
		</div>
		<!--프로그램 신청목록-->
		<div class="r_wrap width-50">
			<div class="margin-5-left">
				<div class="width-100" style="height:25px;">
                    <label id="" class="tit_80 poa">결재절차</label>
                    <div class="ml_80 tar" id="lblDel"><span class="txt_r">[제외방법 : 목록에서 선택 후  결재삭제버튼 클릭]</span></div>
				</div>				
				<div class="row">
					<div class="az_board_basic az_board_basic_in" style="height:21%">
		    			<div data-ax5grid="secondGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height:100%"></div>
					</div>
				</div>
			</div>
		</div>	
	</div>
	<div class="row">
		<div class="tal">
			<p class="txt_r">[추가방법 : 1.결재절차목록에서 추가 할 위치 선택 / 2.좌측에서 결재자 검색 / 3.목록에서 더블클릭]</p>
			<p class="txt_r">[변경방법 : 1.결재절차목록에서 변경 할 대상 선택 / 2.좌측의 목록에서 결재자 더블클릭]</p>
		</div>
	</div>
	<div class="row tac">
		<button id="btnDel" class="btn_basic">결재삭제</button>
		<button id="btnReg" class="btn_basic margin-5-left">등록</button>
		<button id="btnReg" class="btn_basic margin-5-left">취소</button>
	</div>	
</div>
<!-- contener E -->
</body>	

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/request/ApprovalModal.js"/>"></script>