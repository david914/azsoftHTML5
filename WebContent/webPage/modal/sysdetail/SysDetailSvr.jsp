<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="row">
	<div class="col-sm-7">
		<div class="col-sm-2">
			<label id="lblSvr">서버종류</label>
		</div>
		<div class="col-sm-10">
			<div 	id="cboSvr" data-ax5select="cboSvr" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
			</div>
		</div>
 			
	 	<div class="col-sm-2">
			<label id="lblSvrName">서버명/OS</label>
	 	</div>
	 	<div class="col-sm-5">
	 		<input id="txtSvrName" name="txtSvrName" class="form-control" type="text"></input>
	 	</div>
	 	<div class="col-sm-5">
	 		<div 	id="cboOs" data-ax5select="cboOs" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
			</div>
	 	</div>
	 			
	 	<div class="col-sm-2">
	 		<label id="lblIp">IP/PORT/순서</label>
	 	</div>
	 	<div class="col-sm-5">
	 		<input id="txtSvrIp" name="txtSvrIp" class="form-control" type="text"></input>
	 	</div>
	 	<div class="col-sm-3">
	 		<input id="txtPort" name="txtPort" class="form-control" type="text"></input>
	 	</div>
	 	<div class="col-sm-2">
	 		<input id="txtSeq" name="txtSeq" class="form-control" type="text"></input>
	 	</div>
	 			
	 	<div class="col-sm-2">
	 		<label id="lblUser">계정/비밀번호</label>
	 	</div>
	 	<div class="col-sm-5">
	 		<input id="txtUser" name="txtTitle" class="form-control" type="text"></input>
	 	</div>
	 	<div class="col-sm-5">
	 		<input id="txtPass" name="txtTitle" class="form-control" type="password"></input>
	 	</div>
	 			
	 	<div class="col-sm-2">
	 		<label id="lblHome">Home-Dir</label>
	 	</div>
	 	<div class="col-sm-10">
	 		<input id="txtHome" name="txtHome" class="form-control" type="text"></input>
	 	</div>
	 			
	 	<div class="col-sm-2">
	 		<label id="lblDir">Agent-Dir</label>
	 	</div>
	 	<div class="col-sm-10">
	 		<input id="txtDir" name="txtDir" class="form-control" type="text"></input>
	 	</div>
	 			
	 	<div class="col-sm-2">
	 		<label id="lblBuffer">버퍼사이즈</label>
	 	</div>
	 	<div class="col-sm-10">
	 		<div 	id="cboBuffer" data-ax5select="cboBuffer" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;">
			</div>
	 	</div>
	 			
		<div class="col-sm-2">
	 		<label id="lblTmp">동기화홈경로</label>
	 	</div>
		<div class="col-sm-10">
	 		<input id="txtTmp" name="txtTmp" class="form-control" type="text"></input>
	 	</div>
	 	
	 	<div class="col-sm-8">
	 		<input type="checkbox" class="checkbox-IP" id="chkIp" data-label="IP만변경"  />
	 		<input type="checkbox" class="checkbox-IPC" id="chkIpC" data-label="IP변경하여 복사"  />
	 		<label id="lblAftIp">변경IP</label>
	 		<input id="txtAftIp" name="txtDir" class="ecams-input" type="text"></input>
	 	</div>
	 	<div class="col-sm-4">
	 	</div>
 	</div>
 	<div class="col-sm-5">
 		<div class="col-sm-7">
 			<label id="lblSvrList">서버속성</label>
 		</div>
 		<div class="col-sm-5">
 			<input type="checkbox" class="checkbox-IP" id="chkAllSvr" data-label="전체선택"  />
 		</div>
 		
 		<div class="col-sm-12">
	 		<div class="scrollBind">
   				<ul class="list-group" id="ulSyrInfo">
    			</ul>
   			</div>
 		</div>
 		
 		<div class="col-sm-12">
 			<input type="checkbox" class="checkbox-IP" id="chkBase" data-label="기준서버"  />
 			<input type="checkbox" class="checkbox-IP" id="chkErr" data-label="장애"  />
 			<input type="checkbox" class="checkbox-IP" id="chkStop" data-label="일시정지"  />
 		</div>
 		
 		<div class="col-sm-12">
 			<button class="btn btn-default" id="btnReq">
				등록 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
			</button>
 			<button class="btn btn-default" id="btnUpdt">
				수정 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
			</button>
 			<button class="btn btn-default" id="btnCls">
				폐기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
			</button>
 			<button class="btn btn-default" id="btnQry">
				조회 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
			</button>
 			<button class="btn btn-default" data-grid-control="excel-export" id="btnExl">
				엑셀저장 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
			</button>
 			<button class="btn btn-default" id="btnExit">
				닫기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
			</button>
 		</div>
 	</div>
 	
 	<div class="col-sm-12">
 		<div data-ax5grid="svrInfoGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 45%;"></div>
 	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/sysdetail/SysDetailSvr.js"/>"></script>

