<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>사원번호</label>
		</div>
		<div class="col-sm-9">
			<input id="txtUserId" name="txtUserId" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>성명</label>
		</div>
		<div class="col-sm-9">
			<input id="txtUserName" name="txtUserName" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>직급</label>
		</div>
		<div class="col-sm-9">
			<div id="cboPosition" data-ax5select="cboPosition" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>직위</label>
		</div>
		<div class="col-sm-9">
			<div id="cboDuty" data-ax5select="cboDuty" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-3">
		<input id="optManCheck"  type="radio" name="userRadioMan"  value="man"/>
		<label for="optManCheck" >직원</label>
		<input id="optOutCheck" type="radio"  name="userRadioMan"  value="outSour"/>
		<label for="optOutCheck">외주직원</label>
	</div>
	<div class="col-sm-3">
		<input type="checkbox" class="checkbox-user" id="chkManage" data-label="시스템관리자"/>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>IP Address</label>
		</div>
		<div class="col-sm-9">
			<input id="txtIp" name="txtIp" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>E-mail</label>
		</div>
		<div class="col-sm-9">
			<input id="txtEMail" name="txtComp" class="form-control" type="text"></input>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>소속조직</label>
		</div>
		<div class="col-sm-9">
			<input id="txtOrg" name="txtOrg" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<input type="checkbox" class="checkbox-user" id="chkHand" data-label="동기화제외사용자"/>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>전화번호1</label>
		</div>
		<div class="col-sm-9">
			<input id="txtTel1" name="txtTel1" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>비밀번호오류횟수</label>
		</div>
		<div class="col-sm-9">
			<input id="txtErrCnt" name="txtErrCnt" class="form-control" type="text"></input>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>소속(겸직)</label>
		</div>
		<div class="col-sm-9">
			<input id="txtOrgAdd" name="txtOrgAdd" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>최종로그인</label>
		</div>
		<div class="col-sm-9">
			<input id="txtLogin" name="txtLogin" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>*전화번호2</label>
		</div>
		<div class="col-sm-9">
			<input id="txtTel2" name="txtTel2" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<input id="optActCheck"  type="radio" name="userRadio" value="active"/>
		<label for="optActCheck" >사용자 활성화</label>
		<input id="optDiCheck" type="radio" name="userRadio" value="disable"/>
		<label for="optDiCheck" >사용자 비활성화</label>
	</div>
</div>

<div class="row">
	<div class="col-sm-3">
		<label>담당직무</label>
	</div>
	<div class="col-sm-3">
		<label>담당업무추가</label>
	</div>
	<div class="col-sm-3">
		<label>부재등록정보</label>
	</div>
	<div class="col-sm-3">
		<label>사용자조회결과</label>
	</div>
</div>

<div class="row">
	<div class="col-sm-3">
		<div class="scrollBind" style="height: 65%; border: 1px dotted gray;;">
  			<ul class="list-group" id="ulDutyInfo"></ul>
 		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>시스템</label>
		</div>
		<div class="col-sm-9">
			<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		</div>
		<div class="col-sm-3">
			<label>업무</label>
		</div>
		<div class="col-sm-9">
			<input type="checkbox" class="checkbox-user" id="chkAllJob" data-label="전체선택"/>
		</div>
		<div class="col-sm-12">
			<div class="scrollBind" style="height: 60%; border: 1px dotted gray;;">
	  			<ul class="list-group" id="ulJobInfo"></ul>
	 		</div>
		</div>
	</div>
	
	<div class="col-sm-6">
		<div class="col-sm-6">
			<div class="col-sm-4">
				<label>대결지정</label>
			</div>
			<div class="col-sm-8">
				<input id="txtDaeGyul" name="txtDaeGyul" class="form-control" type="text"></input>
			</div>
			<div class="col-sm-4">
				<label>부재기간</label>
			</div>
			<div class="col-sm-8">
				<input id="txtBlankTerm" name="txtBlankTerm" class="form-control" type="text"></input>
			</div>
			<div class="col-sm-4">
				<label>부재사유</label>
			</div>
			<div class="col-sm-8">
				<textarea id="txtBlankSayu" rows="2" cols="35"></textarea>
			</div>
		</div>
		<div class="col-sm-6">
			<div class="col-sm-12">
				<div data-ax5grid="userGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 20%;"></div>
			</div>
		</div>
		<div class="col-sm-12">
			<div class="col-sm-8">
				<label>등록된 담당업무</label>
			</div>
			<div class="col-sm-4">
				<button class="btn btn-default float-right" id="btnDelJob">담당업무삭제</button>
			</div>
		</div>
		<div class="col-sm-12">
			<div data-ax5grid="jobGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 35%;"></div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-12">
		<div class="float-right">
			<button class="btn btn-default" id="btnQryRgtCd">사용자직무조회</button>
			<button class="btn btn-default" id="btnSignUp">사용자일괄등록</button>
			<button class="btn btn-default" id="btnDept">조직정보등록</button>
			<button class="btn btn-default" id="btnJobCopy">권한복사</button>
			<button class="btn btn-default" id="btnPassInit">비밀번호초기화</button>
			<button class="btn btn-default" id="btnSetJob">업무권한일괄등록</button>
			<button class="btn btn-default" id="btnAllUser">전체사용자조회</button>
			<button class="btn btn-default" id="btnSave">저장</button>
			<button class="btn btn-default" id="btnDel">폐기</button>
		</div>
	</div>
</div>

<form name="popPam">
	<input type="hidden" name="userId"/>
</form>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"	src="<c:url value="/js/ecams/administrator/UserInfo.js"/>"></script>