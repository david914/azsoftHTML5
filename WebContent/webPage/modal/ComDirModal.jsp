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
			[공통디렉토리정보]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-sm-2">
					<label id="lblSysMsg">시스템</label>
				</div>
				<div class="col-sm-10">
					<input id="txtSysMsg" name="txtSysMsg" class="form-control" type="text" ></input>
				</div>
			</div>        	
			<div class="row">
				<div class="col-sm-2">
					<label id="lblDir">디렉토리구분</label>
				</div>
				<div class="col-sm-10">
					<div 	id="cboDir" data-ax5select="cboDir" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
					</div>
				</div>
			</div>        	
			<div class="row">
				<div class="col-sm-2">
					<label id="lblSvrIp">서버IP</label>
				</div>
				<div class="col-sm-4">
					<input id="txtSvrIp" name="txtSvrIp" class="form-control" type="text" ></input>
				</div>
				<div class="col-sm-2">
					<label id="lblPort">Port</label>
				</div>
				<div class="col-sm-4">
					<input id="txtPort" name="txtPort" class="form-control" type="text" ></input>
				</div>
			</div>        	
			<div class="row">
				<div class="col-sm-2">
					<label id="lblUser">계정</label>
				</div>
				<div class="col-sm-4">
					<input id="txtUser" name="txtUser" class="form-control" type="text" ></input>
				</div>
				<div class="col-sm-2">
					<label id="lblPass">비밀번호</label>
				</div>
				<div class="col-sm-4">
					<input id="txtPass" name="txtPass" class="form-control" type="text" ></input>
				</div>
			</div>        	
			<div class="row">
				<div class="col-sm-2">
					<label>디렉토리명</label>
				</div>
				<div class="col-sm-10">
					<input id="txtDir" name="txtDir" class="form-control" type="text" ></input>
				</div>
			</div>        	
			<div class="row">
				<div class="col-sm-2">
					<label id="lblShell">실행파일명</label>
				</div>
				<div class="col-sm-4">
					<input id="txtShell" name="txtShell" class="form-control" type="text" ></input>
				</div>
				<div class="col-sm-6">
					<button class="btn btn-default" id="btnReq">
						등록 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
					</button>
					<button class="btn btn-default" id="btnCls">
						폐기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
					</button>
					<button class="btn btn-default" id="btnQry">
						조회 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
					</button>
					<button class="btn btn-default" id="btnExit">
						닫기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
					</button>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-12">
					<div data-ax5grid="dirGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 55%;"></div>
				</div>
			</div>     	
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/ComDirModal.js"/>"></script>

