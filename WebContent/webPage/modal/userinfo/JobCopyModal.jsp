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
			[사용자권한복사]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-xs-2">
					<label>사용자[From]</label>
				</div>
				<div class="col-xs-4">
					<input id="txtFromUser" name="txtFromUser" class="form-control" type="text"></input>
				</div>
				<div class="col-xs-4">
					<div id="cboFromUser" data-ax5select="cboFromUser" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-5">
					<div class="col-xs-6">
						<label>[담당직무]</label>
					</div>
					<div class="col-xs-6">
						<input type="checkbox" class="checkbox-jobcopy float-right" id="chkAllDuty" data-label="전체선택"/>
					</div>
				</div>
				<div class="col-xs-7">
					<label>[담당업무]</label>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-5">
					<div class="scrollBind" style="height: 72%; border: 1px dotted gray;;">
			  			<ul class="list-group" id="ulDutyInfo"></ul>
			 		</div>
				</div>
				<div class="col-xs-7">
					<div data-ax5grid="jobGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 72%;"></div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-2">
					<label>사용자[From]</label>
				</div>
				<div class="col-xs-4">
					<input id="txtToUser" name="txtToUser" class="form-control" type="text"></input>
				</div>
				<div class="col-xs-4">
					<div id="cboToUser" data-ax5select="cboToUser" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
				</div>
				<div class="col-xs-2">
					<button class="btn btn-default float-right" id="btnExit">닫기</button>
					<button class="btn btn-default float-right" id="btnCopy">복사</button>
				</div>
			</div>
			        	
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/userinfo/JobCopyModal.js"/>"></script>