<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp"/>


<div class="hpanel">
    <div class="panel-body" id="sysDetailDiv">
    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
    		<!-- 결재종류,시스템,정상결재시,결재조직 -->
    		<div class="row">
    			<div class="col-lg-3 col-md-12 col-sm-12 col-12">
    				<label id="lbSignCd" class="padding-5-top float-right">결재종류</label>
    			</div>
    			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<div id="selReqCd" data-ax5select="selReqCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div> <!-- cboReq -->
		    	</div>
    		</div>
    		
    		<div class="row">
    			<div class="col-lg-3 col-md-12 col-sm-12 col-12">
    				<label id="lbSys" class="padding-5-top float-right">시스템</label>
    			</div>
    			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<div id="selSys" data-ax5select="selSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		    	</div>
    		</div>
    		
    		<div class="row">
    			<div class="col-lg-3 col-md-12 col-sm-12 col-12">
    				<label id="lbCommon" class="padding-5-top float-right">정상결재시</label>
    			</div>
    			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<div id="selCommon" data-ax5select="selCommon" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		    	</div>
    		</div>
    		
    		<div class="row">
    			<div class="col-lg-3 col-md-12 col-sm-12 col-12">
    				<label id="lbDept" class="padding-5-top float-right">결재조직</label>
    			</div>
    			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<input id="txtDept" name="txtDept" class="form-control" type="text"></input> <!-- 특정팀/특정권한일때 활성화되고, 트리 노드 선택값으로 셋팅 -->
		    	</div>
    		</div>
    		
    		<div class="row">
    			<div class="col-lg-12 col-md-12 col-sm-12 col-12">
    				<div class="scrollBind" style="height: 200px; border: 1px dotted gray;" id="treeDeptDiv">
						<ul id="treeDept" class="ztree"></ul>
					</div>
    			</div>
    		</div>
    	</div>
    	
    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
    		<!-- 결재단계,직원구분,부재처리시,결재직무 -->
    		<div class="row">
    			<div class="col-lg-3 col-md-12 col-sm-12 col-12">
    				<label id="lbSignStep" class="padding-5-top float-right">결재단계</label>
    			</div>
    			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<div id="selSignStep" data-ax5select="selSignStep" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div> <!-- cboStep -->
		    	</div>
    		</div>
    		
    		<div class="row">
	    		<div class="col-lg-12 col-md-12 col-sm-12 col-12">
    				<input type="checkbox" class="checkbox-pie" id="chkSys" data-label="시스템과관련없음"/>
				    <input type="checkbox" class="checkbox-pie" id="chkMember" data-label="직원"/>
				    <input type="checkbox" class="checkbox-pie" id="chkOutsourcing" data-label="외주"/>
    			</div>
    		</div>
    		
    		<div class="row">
    			<div class="col-lg-3 col-md-12 col-sm-12 col-12">
    				<label id="lbBlank" class="padding-5-top float-right">부재처리시</label>
    			</div>
    			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<div id="selBlank" data-ax5select="selBlank" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		    	</div>
    		</div>
    		
    		<div class="row">
    			<div class="col-lg-3 col-md-12 col-sm-12 col-12">
    				<label id="lbRgtCd" class="padding-5-top float-right">결재직무</label>
    			</div>
    			
    			<div class="col-lg-2 col-md-12 col-sm-12 col-12">
    			</div>
    			
    			<div class="col-lg-7 col-md-12 col-sm-12 col-12 float-right">
    				<input type="checkbox" class="checkbox-pie" id="chkAllRgt" data-label="전체선택"/> <!-- chkAll1 -->
    			</div>
    		</div>
    		
    		<div class="row">
	    		<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    			<div class="scrollBind" id="lstRgtDiv">
	    				<ul class="list-group" id="lstRgt" style="height: 90%; border: 1px dotted gray;"> <!-- 결재직무 -->
		    			</ul>
	    			</div>
	    		</div>
	    	</div>
	    	
	    	<div class="row">
	    		<input type="checkbox" class="checkbox-pie" id="chkEnd" data-label="완료처리단계"/>
	    		<div id="chkDelDiv" class="dis-i-b">
	    			<input type="checkbox" class="checkbox-pie" id="chkDel" data-label="삭제가능"/>
	    		</div>
	    	</div>
    	</div>
    	
    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
    		<!-- 단계명칭,정상,긴급,프로그램등급 -->
    		<div class="row">
    			<div class="col-lg-3 col-md-12 col-sm-12 col-12">
    				<label id="lbStepName" class="padding-5-top float-right">단계명칭</label>
    			</div>
    			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<input id="txtStepName" name="txtStepName" class="form-control" type="text"></input>
		    	</div>
    		</div>
    		
    		<div class="row">
    			<div class="col-lg-3 col-md-12 col-sm-12 col-12">
    				<label id="lbComAft" class="padding-5-top float-right">정상(업무후)</label>
    			</div>
    			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<div id="selComAft" data-ax5select="selComAft" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div> <!-- cboHoli -->
		    	</div>
    		</div>
    		
    		<div class="row">
    			<div class="col-lg-3 col-md-12 col-sm-12 col-12">
    				<label id="lbEmgAft" class="padding-5-top float-right">긴급(업무후)</label>
    			</div>
    			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<div id="selEmgAft" data-ax5select="selEmgAft" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div> <!-- cboEmg2 -->
		    	</div>
    		</div>
    		
    		<div class="row">
    			<div class="col-lg-6 col-md-12 col-sm-12 col-12">
    				<input type="checkbox" class="checkbox-pie" id="chkGrade" data-label="프로그램등급선택"/> <!-- chkType -->
    			</div>
    			
    			<div class="col-lg-6 col-md-12 col-sm-12 col-12 float-right">
    				<input type="checkbox" class="checkbox-pie" id="chkAllGrade" data-label="전체선택"/>  <!-- chkAll2 -->
    			</div>
    		</div>
    		
    		<div class="row">
	    		<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    			<div class="scrollBind" id="lstGradeDiv">
	    				<ul class="list-group" id="lstGrade" style="height: 90%; border: 1px dotted gray;"> <!-- lstType -->
		    			</ul>
	    			</div>
	    		</div>
	    	</div>
    	</div>
    	
    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
    		<!-- 결재구분,자동처리,긴급,프로그램종류 -->
    		<div class="row">
	    		<div class="col-lg-3 col-md-12 col-sm-12 col-12">
	    			<label id="lbEmgAft" class="padding-5-top float-right">결재구분</label>
	   			</div>
	   			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<div id="selSgnGbn" data-ax5select="selSgnGbn" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div> <!-- cboGubun -->
		    	</div>
	    	</div>
	    	
	    	<div class="row">
	    		<div class="col-lg-3 col-md-12 col-sm-12 col-12">
	    			<label id="lbSysGbn" class="padding-5-top float-right">자동처리</label>
	   			</div>
	   			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<div id="selSysGbn" data-ax5select="selSysGbn" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div> <!-- cboSysGbn -->
		    	</div>
	    	</div>
	    	
	    	<div class="row">
	    		<div class="col-lg-3 col-md-12 col-sm-12 col-12">
	    			<label id="lbEmg" class="padding-5-top float-right">긴급(업무중)</label>
	   			</div>
	   			<div class="col-lg-9 col-md-12 col-sm-12 col-12">
		    		<div id="selEmg" data-ax5select="selEmg" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div> <!-- cboEmg -->
		    	</div>
	    	</div>
	    	
	    	<div class="row">
    			<div class="col-lg-6 col-md-12 col-sm-12 col-12">
    				<input type="checkbox" class="checkbox-pie" id="chkJawon" data-label="프로그램종류선택"/>  <!-- chkProg -->
    			</div>
    			
    			<div class="col-lg-6 col-md-12 col-sm-12 col-12 float-right">
    				<input type="checkbox" class="checkbox-pie" id="chkAllJawon" data-label="전체선택"/>  <!-- chkAll3 -->
    			</div>
    		</div>
    		
    		<div class="row">
	    		<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    			<div class="scrollBind" id="lstJawonDiv">
	    				<ul class="list-group" id="lstJawon" style="height: 90%; border: 1px dotted gray;"> <!-- lstProg --> 
		    			</ul>
	    			</div>
	    		</div>
	    	</div>
	    	
	    	<div class="row">
		    	<button class="btn btn-default" id="btnReq">등록</button>
				<button class="btn btn-default" id="btnDel">폐기</button>
				<button class="btn btn-default" id="btnQry">조회</button>
				<button class="btn btn-default" id="btnAllQry">전체조회</button>
				<button class="btn btn-default" id="btnCopy">결재정보복사</button>
				<button class="btn btn-default" id="btnBlank">대결범위등록</button>
	    	</div>
    	</div>
    </div>
</div>

<!-- 결재정보 그리드 -->
<div class="row" style="padding-top: 5px;">
	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
		<div data-ax5grid="grdSign" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 45%;"></div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/ApprovalInfo.js"/>"></script>