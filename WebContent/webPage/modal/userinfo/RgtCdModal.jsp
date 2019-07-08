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
			[사용자직무조회]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-xs-4">
					<div class="col-xs-3">
						<label>시스템</label>
					</div>
					<div class="col-xs-9">
						<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
					</div>
				</div>
				
				<div class="col-xs-4">
					<div class="col-xs-3">
						<label>업무</label>
					</div>
					<div class="col-xs-9">
						<div id="cboJob" data-ax5select="cboJob" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
					</div>
				</div>
				
				<div class="col-xs-4">
					<button class="btn btn-default" id="btnQry">조회</button>
					<button class="btn btn-default" id="btnExcel">엑셀저장</button>
					<button class="btn btn-default" id="btnExit">닫기</button>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-4">
					<div class="col-xs-3">
						<label>직무</label>
					</div>
					<div class="col-xs-9">
						<div id="cboRgtCd" data-ax5select="cboRgtCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
					</div>
				</div>
				
				<div class="col-xs-4">
					<div class="col-xs-3">
						<label>사용자</label>
					</div>
					<div class="col-xs-4">
						<input id="txtUser" name="txtUser" class="form-control" type="text"></input>
					</div>
					<div class="col-xs-5">
						<div id="cboUser" data-ax5select="cboUser" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
					</div>
				</div>
				
				<div class="col-xs-4">
					<label id="lbl">총 0건</label>
				</div>
			</div>
			
			<div class="row">
				<div data-ax5grid="userGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 75%;"></div>
			</div>
			        	
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/userinfo/RgtCdModal.js"/>"></script>