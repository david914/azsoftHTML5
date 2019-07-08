<!--  
	* 화면명: 조직도
	* 화면호출: 사용자정보 -> 조직정보등록 클릭/ 소속조직 더블클릭/ 소속(겸직) 더블클릭
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<section>
	<div class="hpanel">
		<div class="panel-heading">
            <div class="panel-tools width-5">
                <a class="closebox width-100" onclick="popClose()"><i class="fa fa-times"></i></a>
            </div>
            <label id="titleLabel">[조직도]</label>
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-xs-4">
					<button class="btn btn-default" id="btnPlus">
						<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
					</button>
					<button class="btn btn-default" id="btnMinus">
						<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
					</button>
				</div>
				<div class="col-xs-6">
					<input id="txtFind" name="txtFind" class="form-control" type="text"></input>
				</div>
				<div class="col-xs-2">
					<button class="btn btn-default" id="btnFind">조회</button>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<div class="scrollBind" style="height: 550px; border: 1px dotted gray;">
						<ul id="tvOrgani" class="ztree"></ul>
					</div>
				</div>
			</div> 
			<div class="row">
				<div class="col-xs-12">
					<div class="float-right">
						<button class="btn btn-default" id="btnReq">적용</button>
						<button class="btn btn-default" id="btnExit">취소</button>
					</div>
				</div>
			</div>
			        	
        </div>
    </div>
</section>

<div id="rMenu">
	<ul>
		<li id="addMenu">조직추가(선택한 구분과 동일한 레벨)</li>
		<li id="addSubMenu">조직추가(선택한 구분의 하위레벨)</li>
		<li id="delMenu">조직삭제</li>
		<li id="reMenu">조직명바꾸기</li>
	</ul>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/OrganizationModal.js"/>"></script>