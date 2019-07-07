<!--  
	* 화면명: 대결범위등록
	* 화면호출: 결재정보 -> 대결범위등록 클릭
-->

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
			[대결가능범위등록]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-xs-12">
					<div class="col-xs-4">
						<div class="col-xs-12">
							<input type="radio" class="radio-pie" id="rdoPos" name="group">직위
							<input type="radio" class="radio-pie" id="rdoRgt" name="group">직무
							<input type="checkbox" class="checkbox-pie" id="chkTeam" data-label="동일팀내에서만 가능"/>		
						</div>
					</div>
					
					<div class="col-xs-5">
						<button class="btn_basic_s" id="btnQry">조회</button>
						<button class="btn_basic_s" id="btnClose">닫기</button>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-2">
					<!-- 직위,직무 -->
					<label>직위/직무</label>
				</div>
				
				<div class="col-xs-2">
					<div id="cboPos" data-ax5select="cboPos" data-ax5select-config="{size:'sm',theme:'primary'}"></div>
				</div>
				
				<div class="col-xs-3">
					<label>[등록리스트]</label>
				</div>
			</div>
			
			<div class="row">
				<div class="col-xs-4">
					<!-- 대결가능범위, 전체선택 -->
					<label>대결가능범위</label>
					<input type="checkbox" class="checkbox-pie" id="chkAll" data-label="전체선택"/>
					
					<div class="scrollBind" style="width:100%; height: 70%; border: 1px dotted gray;">
					<ul id="lstPos" class="ztree"></ul>
				</div>
				</div>
				
				<div class="col-xs-8">
					<!-- 등록리스트 -->
					<div data-ax5grid="grdRangeList" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="width:60%; height: 75%;"></div>
				</div>
			</div>
			
			<div class="row">
				<!-- 등록, 폐기 -->
				<button class="btn_basic_s" id="btnReg">등록</button>
				<button class="btn_basic_s" id="btnDel">폐기</button>
			</div>
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/SubApprovalRangeModal.js"/>"></script>