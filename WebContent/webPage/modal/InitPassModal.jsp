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
			[비밀번호 초기화]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-xs-6">
					<label>사용자ID</label>
				</div>
				<div class="col-xs-6">
					<input id="txtUserId" name="txtUserId" class="form-control" type="text"></input>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-6">
					<label>비밀번호 4자리</label>
				</div>
				<div class="col-xs-6">
					<input id="txtPasswd" name="txtPasswd" class="form-control" type="password"></input>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-12">
					<label>초기화시 비밀번호 4자리로 세팅됩니다.</label>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-12">
					<button class="btn btn-default" id="btnReq">등록</button>
					<button class="btn btn-default" id="btnExit">닫기</button>
				</div>
			</div>
			        	
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/InitPassModal.js"/>"></script>