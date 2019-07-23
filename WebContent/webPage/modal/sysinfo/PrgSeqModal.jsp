<!--  
	* 화면명: 프로그램유형별처리속성관리
	* 화면호출: 프로그램종류정보 -> 프로그램처리속성 트리구조 작성 클릭
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<body style="width: 100% !important; min-width: 0px !important">
	<div class="pop-header">
		<div>
			<label>프로그램유형별 처리속성관리</label>
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
				<div class="margin-5-right">
					<div>
						<button id="btnPlus" class="btn_basic_s"><i class="fas fa-plus"></i></button>
						<button id="btnMinus" class="btn_basic_s margin-5-left"><i class="fas fa-minus"></i></button>
				 	</div>
				 	<div class="row scrollBind" style="height:80%">
						<ul id="tvPrgSeq" class="ztree"></ul>
					</div>
				</div>
			</div>
			<div class="r_wrap width-50">
				<div class="margin-5-left">
					<label>처리속성</label>
					<div class="row scrollBind" style="height:80%">
						<ul class="list-group" id="ulCode"></ul>
					</div>
				</div>
			</div>
		</div>
		<div class="row txt_r">기본구조를 설정한 후 기본구조의 최하위속성에 처리속성을 맵핑합니다.</div>
		<!--button-->
		<div class="row tac">
			<button id="btnReq" class="btn_basic">등록</button>
			<button id="btnExit" class="btn_basic margin-5-left">닫기</button>
		</div>
	</div>
</body>

 
<!-- <section>
	<div class="hpanel">
		<div class="panel-heading">
            <div class="panel-tools width-5">
                <a class="closebox width-100" onclick="popClose()"><i class="fa fa-times"></i></a>
            </div>
			[프로그램유형별처리속성관리]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-sm-6">
					<button class="btn btn-default" id="btnPlus">
						<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
					</button>
					<button class="btn btn-default" id="btnMinus">
						<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
					</button>
				</div>
				<div class="col-sm-6">
					<label id="lbl">처리속성</label>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-6">
					<div class="scrollBind" style="height: 600px; border: 1px dotted gray;">
						<ul id="tvPrgSeq" class="ztree"></ul>
					</div>
				</div>
				<div class="col-sm-6">
					<div class="scrollBind" style="height: 600px; border: 1px dotted gray;">
	    				<ul class="list-group" id="ulCode">
	    				</ul>
    				</div>
				</div>
			</div> 
			<div class="row">
				<div class="col-sm-6">
					<label id="lbl">[기본구조를 설정한 후 기본구조의 최하위속성에 처리속성을 맵핑합니다.]</label>
				</div>
				<div class="col-sm-6">
					<button class="btn btn-default" id="btnReq">
						등록<span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
					</button>
					<button class="btn btn-default" id="btnExit">
						닫기<span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
					</button>
				</div>
			</div>
			        	
        </div>
    </div>
</section>

<div id="rMenu">
	<ul>
		<li id="addMenu" onclick="addMenu();">구분추가(선택한 구분과 동일한 레벨)</li>
		<li id="addSubMenu" onclick="addSubMenu();">구분추가(선택한 구분의 하위레벨)</li>
		<li id="delMenu" onclick="delMenu();">구분삭제</li>
		<li id="reMenu" onclick="reMenu();">구분명바꾸기</li>
	</ul>
</div>
 -->		
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/sysinfo/PrgSeqModal.js"/>"></script>