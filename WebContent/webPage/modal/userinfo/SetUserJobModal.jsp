<!--  
	* 화면명: 업무권한일괄등록
	* 화면호출: 사용자정보 -> 업무권한일괄등록 클릭
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
			[업무권한일괄등록]
        </div>
        <div class="panel-body">
			<div class="row">
			
				<div class="col-xs-6">
					<div class="col-xs-8">
						<div id="cboUserDiv" data-ax5select="cboUserDiv" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
					</div>
					<div class="col-xs-4">
						<input id="txtUser" name="txtUser" class="form-control" type="text"></input>
					</div>
					<div class="col-xs-8">
						<div id="cboUser" data-ax5select="cboUser" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
					</div>
					<div class="col-xs-4">
						<button class="btn btn-default float-right" id="btnSel">선택</button>
					</div>
					<div class="col-xs-12">
						<div class="float-right">
							<input type="checkbox" class="checkbox-setjob float-right" id="chkAllUser" data-label="전체선택"/>
						</div>
					</div>
					
					<div class="col-xs-12">
						<div class="scrollBind" style="height: 30%; border: 1px dotted gray;;">
				  			<ul class="list-group" id="ulUserInfo"></ul>
				 		</div>
					</div>
				</div>
				
				<div class="col-xs-6">
					<div class="col-xs-12">
						<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
					</div>
					<div class="col-xs-12">
						<div class="float-right">
							<input type="checkbox" class="checkbox-setjob float-right" id="chkAllJob" data-label="전체선택"/>
						</div>
					</div>
					<div class="col-xs-12">
						<div class="scrollBind" style="height: 30%; border: 1px dotted gray;;">
				  			<ul class="list-group" id="ulJobInfo"></ul>
				 		</div>
					</div>
					
					<div class="col-xs-12">
						<div class="float-right">
							<button class="btn btn-default" id="btnReq">등록</button>
							<button class="btn btn-default" id="btnDel">폐기</button>
							<button class="btn btn-default" id="btnQry">조회</button>
							<button class="btn btn-default" id="btnExit">닫기</button>
						</div>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-12">
					<div data-ax5grid="jobGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 50%;"></div>
				</div>
			</div>
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/userinfo/SetUserJobModal.js"/>"></script>