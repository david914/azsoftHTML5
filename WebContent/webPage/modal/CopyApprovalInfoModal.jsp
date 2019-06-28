<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<section>
	<div class="hpanel">
		<div class="panel-heading">
            <div class="panel-tools width-5">
                <a class="closebox width-100" onclick="btnClose_Click()"><i class="fa fa-times"></i></a>
            </div>
			[결재정보복사]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-xs-12">
					<div class="col-xs-3">
						<div class="col-xs-6">
							<label>시스템[From]</label>
						</div>
						<div class="col-xs-6">
							<div id="cboFromSys" data-ax5select="cboFromSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
					
					<div class="col-xs-3">
						<div class="col-xs-4">
							<label>결재종류</label>
						</div>
						<div class="col-xs-8">
							<div id=cboFromReqCd data-ax5select="cboFromReqCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
					
					<div class="col-xs-3">
						<input type="checkbox" class="checkbox-pie" id="chkMember" data-label="직원"/>
				    	<input type="checkbox" class="checkbox-pie" id="chkOutsourcing" data-label="외주"/>
					</div>
					
					<div class="col-xs-1">
						<button class="btn btn-default" id="btnQry">조회</button>
					</div>
					
					<div class="col-xs-2">
						<input type="checkbox" class="checkbox-pie" id="chkAllInfo" data-label="전체선택"/>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-12">
					<div data-ax5grid="grdApprovalInfo" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 30%;"></div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-8">
					<div class="col-xs-3">
						<label>결재종류(To)</label>
					</div>
					
					<div class="col-xs-6">
						<div id="cboToReqCd" data-ax5select="cboToReqCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
					</div>
					
					<div class="col-xs-3">
						<input type="checkbox" class="checkbox-pie" id="chkAllCopy" data-label="결재정보전체복사"/>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-8">
					<div class="col-xs-3">
						<label>시스템(To)</label><br>
						<input type="checkbox" class="checkbox-pie" id="chkNoSys" data-label="시스템관련없음"/><br><br>
						<input type="checkbox" class="checkbox-pie" id="chkAllSys" data-label="전체선택"/>
					</div>
					
					<div class="col-xs-9">
						<div class="scrollBind" id="lstSysDiv">
		    				<ul class="list-group" id="lstSys" style="height: 90%; border: 1px dotted gray;">
			    			</ul>
		    			</div>
		    			
		    			<button class="btn btn-default" id="btnCopy">복사</button>
						<button class="btn btn-default" id="btnClose">닫기</button>
					</div>
				</div>
			</div>
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/CopyApprovalInfoModal.js"/>"></script>