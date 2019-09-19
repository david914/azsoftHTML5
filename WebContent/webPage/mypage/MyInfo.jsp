<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<style>
.ml_100>label{
	font-weight: normal;
	height: 25px;
}
.ml_100>textarea{
	width: 98%;
	border: 0px;
	resize: none;
	margin-top: 5px;
}
</style>

<div class="contentFrame">
	<div id="history_wrap">기본관리<strong>&gt; 내 기본정보 보기</strong></div>
	
	
	<div style="width:54%;margin:auto; background-color: #f8f8f8; padding: 5px; min-width:1009px;">
		<div class="cb">
			<div class="float-left width-30 margin-10-top">
				<fieldset style="border:3px #2477c1;">
					<legend>기본정보</legend>
	               	<div class="sm-row">
						<label class="tit_80 poa">사용자ID</label>
	                	<div class="ml_100">
							<label id="txtUserId"></label>
						</div>
					</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">이름</label>
		                <div class="ml_100">
							<label id="txtUserName"></label>
						</div>
	               	</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">IP Address</label>
		                <div class="ml_100">
							<label id="txtIp"></label>
						</div>
	               	</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">E-mail</label>
		                <div class="ml_100">
							<label id="txtEMail"></label>
						</div>
	               	</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">전화번호1</label>
		                <div class="ml_100">
							<label id="txtTel1"></label>
						</div>
	               	</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">전화번호2</label>
		                <div class="ml_100">
							<label id="txtTel2"></label>
						</div>
	               	</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">비밀번호</label>
		              	<div class="ml_100">
							<label id="txtPassWd" style="color:#0000ff;font-weight:bold;text-decoration:underline;cursor: pointer;">변경하기</label>
						</div>
					</div>
				</FIELDSET>
			</div>
			
			<div class="float-left width-33 margin-20-left margin-10-top">
				<fieldset style="border:3px #2477c1;">
					<legend>조직정보</legend>
	               	<div class="sm-row">
						<label class="tit_80 poa">직급</label>
	                	<div class="ml_100">
							<label id="txtPosition"></label>
						</div>
					</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">직위</label>
	                	<div class="ml_100">
							<label id="txtDuty"></label>
						</div>
					</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">소속조직</label>
	                	<div class="ml_100">
							<label id="txtOrg"></label>
						</div>
					</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">소속(겸직)</label>
	                	<div class="ml_100">
							<label id="txtOrgAdd"></label>
						</div>
					</div>
				</fieldset>
			</div>
			
			<div class="float-left width-33 margin-20-left margin-10-top">
				<fieldset style="border:3px #2477c1;">
					<legend>부재등록정보</legend>
	               	<div class="sm-row">
						<label class="tit_80 poa">대결지정</label>
	                	<div class="ml_100">
							<label id="txtDaeGyul"></label>
						</div>
					</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">부재기간</label>
	                	<div class="ml_100">
							<label id="txtBlankTerm"></label>
						</div>
					</div>
	               	<div class="sm-row">
						<label class="tit_80 poa">부재사유</label>
	                	<div class="ml_100 margin-5-right">
							<textarea id="txtBlankSayu" rows="6" style="overflow-y:auto; width:100%; border: 1px solid #ddd; padding: 5px;" readonly></textarea>
						</div>
					</div>
	               	<div class="sm-row">
						<button class="btn_basic_s" style="margin-top:10px;" id="btnDaeGyul">부재설정하기</button>
					</div>
				</fieldset>
			</div>
		</div>
		
		<div class="cb" style="margin-top:20px;">
			<div class="float-left width-100 margin-10-top">
				<fieldset style="border:3px #2477c1;">
					<legend>권한정보</legend>
					<label id="basicInfo" style="color:#2477c1;font-size:15;"></label>
		            <div class="sm-row" style="margin-top:20px;">
						<label class="tit_80 poa">담당직무</label>
		              	<div class="ml_100 margin-5-right">
							<textarea id="txtRgtCd" rows="2" style="width:100%; border: 1px solid #ddd; padding: 5px;" readonly></textarea>
						</div>
					</div>
		            <div class="sm-row" style="margin-top:10px;">
						<label class="tit_80 poa">당당업무</label>
		              	<div class="ml_100 margin-5-right">
							<div data-ax5grid="jobGrid" class="width-100" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 300px;"></div>	
						</div>
					</div>
		    	</fieldset>
			</div>
		</div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/mypage/MyInfo.js"/>"></script>