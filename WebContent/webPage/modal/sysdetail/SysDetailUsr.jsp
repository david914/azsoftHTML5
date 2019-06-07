<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<div class="row">
	<div class="col-sm-4">
		<div class="col-sm-3 padding-5-top">
			<label id="lblSvrUsr">서버종류</label>
		</div>
		<div class="col-sm-5">
			<div 	id="cboSvrUsr" data-ax5select="cboSvrUsr" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
			</div>
		</div>
		<div class="col-sm-4 padding-5-top">
			<input type="checkbox" class="checkbox-usr" id="chkAllUsr" data-label="전체선택"  />
		</div>
		<div class="col-sm-12">
			<div data-ax5grid="svrUsrGrid" data-ax5grid-config="{showLineNumber: false lineNumberColumnWidth: 40}" style="height: 40%;"></div>
		</div>
	</div>
	<div class="col-sm-5">
		<div class="col-sm-8">
			<label id="lblSvrUsr" class="padding-5-top">사용업무</label>
		</div>
		<div class="col-sm-4">
			<input type="checkbox" class="checkbox-usr" id="chkAllSvrJob" data-label="전체선택"  />
		</div>
		<div class="col-sm-12">
			<div class="scrollBind" style="height: 245px; border: 1px solid black;">
   				<ul class="list-group" id="ulSvrInfo"></ul>
   			</div>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-5">
			<label id="lblSvrUsr" class="padding-5-top">계정</label>
		</div>
		<div class="col-sm-7">
			<input id="txtSvrUsr" name="txtSvrIp" class="form-control" type="text"></input>
		</div>
		<div class="col-sm-5">
			<label id="lblGroup" class="padding-5-top">그룹</label>
		</div>
		<div class="col-sm-7">
			<input id="txtGroup" name="txtSvrIp" class="form-control" type="text"></input>
		</div>
		<div class="col-sm-5">
			<label id="lblMode" class="padding-5-top">권한</label>
		</div>
		<div class="col-sm-7">
			<input id="txtMode" name="txtSvrIp" class="form-control" type="text"></input>
		</div>
		<div class="col-sm-5">
			<label id="lbltDbUsr" class="padding-5-top">DB계정</label>
		</div>
		<div class="col-sm-7">
			<input id="txtDbUsr" name="txtSvrIp" class="form-control" type="text"></input>
		</div>
		<div class="col-sm-5">
			<label id="lblDbPass" class="padding-5-top">DB비밀번호</label>
		</div>
		<div class="col-sm-7">
			<input id="txtDbPass" name="txtSvrIp" class="form-control" type="password"></input>
		</div>
		<div class="col-sm-5">
			<label id="lblDbConn" class="padding-5-top">DB연결자</label>
		</div>
		<div class="col-sm-7">
			<input id="txtDbConn" name="txtSvrIp" class="form-control" type="text"></input>
		</div>
		
		<div class="col-sm-8"></div>
		<div class="col-sm-4">
			<button class="btn btn-default" id="btnExitUsr">
				닫기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
			</button>
		</div>
		<div class="col-sm-12">
			<button class="btn btn-default" id="btnReqUsr">
				등록 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
			</button>
			<button class="btn btn-default" id="btnUsrClose">
				폐기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
			</button>
			<button class="btn btn-default" id="btnQryUsr">
				조회 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
			</button>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-sm-12">
		<div data-ax5grid="accGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 45%;"></div>
 	</div>
</div>
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/sysdetail/SysDetailUsr.js"/>"></script>