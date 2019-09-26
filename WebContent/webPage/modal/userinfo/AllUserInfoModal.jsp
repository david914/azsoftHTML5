<!--  
	* 화면명: 사용자정보 전체조회
	* 화면호출: 사용자정보 -> 전체사용자조회 클릭
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />


<body>
	<div class="pop-header">
		<div>
			<label>사용자정보전체조회</label>
		</div>
		<div>
			<button type="button" class="close" aria-label="닫기" onclick="popClose()">
			  <span aria-hidden="true">&times;</span>
			</button>
		</div> 
	</div>
	<div class="container-fluid pop_wrap">
		<!--line1-->					
		<div class="half_wrap_cb">
			<div class="l_wrap width-50">
				<label class="tit_80 poa">팀명</label>
				<div class="ml_80">
					<div id="cboTeam" data-ax5select="cboTeam" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
				</div>
			</div>
			<div class="r_wrap width-50 tar">			
		     	<input id="optAll"  type="radio" name="userRadio"  value="all" checked="checked"/>
				<label for="optAll" >전체</label>
				<input id="optActive" type="radio"  name="userRadio"  value="active"/>
				<label for="optActive">폐쇄사용자제외</label>
				<input id="optInActive" type="radio"  name="userRadio"  value="inActive"/>
				<label for="optInActive">폐쇄사용자만</label>
			</div>
		</div>
		<div class="half_wrap_cb" style="margin-top:5px;">
			<div class="l_wrap width-50">
				<div class="l_wrap width-45">
					<label class="tit_80 poa">성명</label>
					<div class="ml_80">
						<input id="txtUser" name="txtUser" type="text" class="width-100" autocomplete="off">
					</div>
				</div>
				<div class="r_wrap width-50">
					<label class="tit_80 poa">직무명</label>
					<div class="ml_80">
						<input id="txtRGTCD" name="txtRGTCD" type="text" class="width-100" autocomplete="off">
					</div>
				</div>
			</div>
			<div class="r_wrap width-50 tar">			
		     	<button id="btnExcel" class="btn_basic_s">엑셀저장</button>
				<button id="btnQry" class="btn_basic_s margin-5-left">조회</button>
			</div>
		</div>
		<!--line2-->
		<div class="row az_board_basic" style="height: 80%">
			<div data-ax5grid="userGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
		</div>
		<!--button-->
		<div class="row tar">
			<button id="btnExit" class="btn_basic_s margin-5-left">닫기</button>
		</div>
	</div>

</body>	

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/userinfo/AllUserInfoModal.js"/>"></script>