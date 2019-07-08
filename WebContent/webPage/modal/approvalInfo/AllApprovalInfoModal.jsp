<!--  
	* 화면명: 전체조회
	* 화면호출: 결재정보 -> 전체조회 클릭
-->

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp"/>

<section>
	<div class="hpanel">
		<div class="panel-heading">
            <div class="panel-tools width-5">
                <a class="closebox width-100" onclick="btnClose_Click()"><i class="fa fa-times"></i></a>
            </div>
			[결재정보 전체조회]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-xs-12">
					<div class="col-xs-3">
						<div class="col-xs-4">
							<label>시스템</label>
						</div>
						<div class="col-xs-8">
							<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
					
					<div class="col-xs-3">
						<div class="col-xs-4">
							<label>결재종류</label>
						</div>
						<div class="col-xs-8">
							<div id=cboReqCd data-ax5select="cboReqCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
					
					<div class="col-xs-3">
						<input type="checkbox" class="checkbox-pie" id="chkMember" data-label="직원"/>
				    	<input type="checkbox" class="checkbox-pie" id="chkOutsourcing" data-label="외주"/>
					</div>
					
					<div class="col-xs-3">
						<button class="btn btn-default" id="btnQry">조회</button>
						<button class="btn btn-default" id="btnClose">닫기</button>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-12">
					<div data-ax5grid="grdAllApprovalInfo" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 80%;"></div>
				</div>
			</div>
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/approvalInfo/AllApprovalInfoModal.js"/>"></script>