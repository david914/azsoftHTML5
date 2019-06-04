<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
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
	 		<input id="txtPass" name="txtTitle" class="form-control" type="text"></input>
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
 	</div>
 	<div class="col-sm-5">
 	</div>
</div>