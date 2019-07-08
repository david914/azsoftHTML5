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
			[사용자정보 전체조회]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-xs-12">
					<div class="col-xs-3">
						<div class="col-xs-4">
							<label>팀명</label>
						</div>
						<div class="col-xs-8">
							<div id="cboTeam" data-ax5select="cboTeam" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
					<div class="col-xs-5">
						<input id="optAll"  type="radio" name="userRadio"  value="all" checked="checked"/>
						<label for="optAll" >전체</label>
						<input id="optActive" type="radio"  name="userRadio"  value="active"/>
						<label for="optActive">폐쇄사용자제외</label>
						<input id="optInActive" type="radio"  name="userRadio"  value="inActive"/>
						<label for="optInActive">폐쇄사용자만</label>
					</div>
					<div class="col-xs-4">
						<button class="btn btn-default" id="btnExcel">엑셀저장</button>
						<button class="btn btn-default" id="btnQry">조회</button>
						<button class="btn btn-default" id="btnExit">닫기</button>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-12">
					<div data-ax5grid="userGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 80%;"></div>
				</div>
			</div>
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/userinfo/AllUserInfoModal.js"/>"></script>