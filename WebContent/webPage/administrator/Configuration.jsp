<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<section>
	<div class="hpanel">
        <div class="panel-body">
        	
        	<div class="row">
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>IP Address(내부망)</label>
        			</div>
        			<div class="col-xs-8">
        				<input id="txtIpIn" name="txtIpIn" class="form-control" type="text"></input>
        			</div>
        		</div>
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>비밀번호변경주기</label>
        			</div>
        			<div class="col-xs-4">
        				<input id="txtPassCycle" name="txtPassCycle" class="form-control" type="number"></input>
        			</div>
        			<div class="col-xs-4">
        				<div id="cboPassCycle" data-ax5select="cboPassCycle" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
        			</div>
        		</div>
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>초기비밀번호</label>
        			</div>
        			<div class="col-xs-8">
        				<input id="txtInitPass" name="txtInitPass" class="form-control" type="text"></input>
        			</div>
        		</div>
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>미사용ID잠금기준일</label>
        			</div>
        			<div class="col-xs-6">
        				<input id="txtLockBaseDt" name="txtLockBaseDt" class="form-control" type="number"></input>
        			</div>
        			<div class="col-xs-2">
        				<label>일</label>
        			</div>
        		</div>
        	</div>
        	<div class="row">
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>IP Address(외부망)</label>
        			</div>
        			<div class="col-xs-8">
        				<input id="txtIpOut" name="txtIpOut" class="form-control" type="text"></input>
        			</div>
        		</div>
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>비밀번호입력제한회수</label>
        			</div>
        			<div class="col-xs-8">
        				<input id="txtPassLimit" name="txtPassLimit" class="form-control" type="number"></input>
        			</div>
        		</div>
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>관리자용비밀번호</label>
        			</div>
        			<div class="col-xs-8">
        				<input id="txtAdminPass" name="txtAdminPass" class="form-control" type="text"></input>
        			</div>
        		</div>
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>로그인이력보관기간</label>
        			</div>
        			<div class="col-xs-6">
        				<input id="txtLoginHis" name="txtLoginHis" class="form-control" type="number"></input>
        			</div>
        			<div class="col-xs-2">
        				<label>일</label>
        			</div>
        		</div>
        	</div>
        	<div class="row">
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>PORT</label>
        			</div>
        			<div class="col-xs-8">
        				<input id="txtPort" name="txtPort" class="form-control" type="number"></input>
        			</div>
        		</div>
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>이전비밀번호보관횟수</label>
        			</div>
        			<div class="col-xs-8">
        				<input id="txtPassNum" name="txtPassNum" class="form-control" type="number"></input>
        			</div>
        		</div>
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>사용금지특수문자</label>
        			</div>
        			<div class="col-xs-8">
        				<input id="txtSpc" name="txtSpc" class="form-control" type="text"></input>
        			</div>
        		</div>
        		<div class="col-xs-3">
        			<div class="col-xs-4">
        				<label>프로세스총갯수</label>
        			</div>
        			<div class="col-xs-5">
        				<input id="txtProcTot" name="txtProcTot" class="form-control" type="number"></input>
        			</div>
        			<div class="col-xs-3">
        				<button class="btn btn-default" id="btnReq">환경설정등록</button>
        			</div>
        		</div>
        	</div>
        	
        	<div class="row">
        		<div class="col-xs-12">
					<ul class="tabs">
						<label id="lblSysMsg"></label>
				        <li class="active" rel="tab1" id="tab1Li">운영시간관리</li>
				        <li rel="tab2" id="tab2Li">삭제기준관리</li>
				        <li rel="tab3" id="tab3Li">디렉토리정책</li>
				        <li rel="tab4" id="tab4Li">작업서버정보</li>
				        <li rel="tab5" id="tab5Li">알림기준정보</li>
				        <li rel="tab6" id="tab6Li">SR유형관리</li>
				   	</ul>
				   	
				   	<div class="tab_container">
				       	<div id="tab1" class="tab_content">
				       		<iframe src='/webPage/tab/configuration/OperTimeManageTab.jsp' width='100%' height='83%' frameborder="0"></iframe>
				       	</div>
				       	<div id="tab2" class="tab_content">
				       		<iframe src='/webPage/tab/configuration/DelCriteriaManageTab.jsp' width='100%' height='83%' frameborder="0"></iframe>
				       	</div>
				       	<div id="tab3" class="tab_content">
				       		<iframe src='/webPage/tab/configuration/DirectoryPolicyTab.jsp' width='100%' height='83%' frameborder="0"></iframe>
				       	</div>
				       	<div id="tab4" class="tab_content">
				       		<iframe src='/webPage/tab/configuration/JobServerInfoTab.jsp' width='100%' height='83%' frameborder="0"></iframe>
				       	</div>
				       	<div id="tab5" class="tab_content">
				       		<iframe src='/webPage/tab/configuration/AlertCriteriaTab.jsp' width='100%' height='83%' frameborder="0"></iframe>
				       	</div>
				       	<div id="tab6" class="tab_content">
				       		<iframe src='/webPage/tab/configuration/SRTypeManageTab.jsp' width='100%' height='83%' frameborder="0"></iframe>
				       	</div>
				   	</div>
        		</div>
        	</div>
        	
        	
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/Configuration.js"/>"></script>