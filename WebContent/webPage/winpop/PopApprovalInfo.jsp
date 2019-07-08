<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="hpanel">
    <div class="panel-body" id="detailDiv">
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
	    	<div class="row">
		    	<div class="col-lg-1 col-md-1 col-sm-1 col-12">
		    		<label id="lblAcptNo" class="padding-5-top float-left">신청번호</label>
		    	</div>
		    	<div class="col-lg-3 col-md-3 col-sm-3 col-12" style="padding-left: 0;">
		    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;"></input>
		    	</div>
		    	<div class="col-lg-8 col-md-8 col-sm-8 col-12" style="padding-left: 0;">
		    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;"></input>
		    	</div>
	    	</div>
	    	
	    	<div class="row" style="padding-top: 2;">
		    	<div class="col-lg-1 col-md-1 col-sm-1 col-12">
		    		<label id="lblStatus" class="padding-5-top float-left">현재상황</label>
		    	</div>
		    	<div class="col-lg-11 col-md-11 col-sm-11 col-12" style="padding-left: 0;">
		    		<input id="txtStatus" name="txtStatus" class="form-control" type="text" style="align-content:left;width:100%;"></input>
		    	</div>
	    	</div>
    	</div>
   	</div>
</div>
	
<div class="hpanel">
    <div class="panel-body text-center" id="gridDiv" style="border: 0px;border-style: none;">
    	<div data-ax5grid="approvalGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 65%;"></div>
    </div>
</div>

<div class="hpanel">
    <div class="panel-body" id="chgApprovalDiv">
    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
	    	<div class="row">
		    	<div class="col-lg-3 col-md-12 col-sm-12 col-12">
		    		<label id="lblBefApproval" class="padding-5-top float-left">변경후결재</label>
		    	</div>
		    	<div class="col-lg-9 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    	<div id="cboBefApproval" data-ax5select="cboBefApproval" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		    	</div>
	    	</div>
	    </div>
    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
	    	<div class="row">
		    	<div class="col-lg-3 col-md-12 col-sm-12 col-12">
		    		<label id="lblSayu" class="padding-5-top float-left">사유구분</label>
		    	</div>
		    	<div class="col-lg-9 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    	<div id="cboSayu" data-ax5select="cboSayu" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		    	</div>
	    	</div>
	    </div>
    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
	    	<div class="row">
		    	<div class="col-lg-3 col-md-12 col-sm-12 col-12">
		    		<label id="lblAftApproval" class="padding-5-top float-left">대결재</label>
		    	</div>
		    	<div class="col-lg-9 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    	<div id="cboAftApproval" data-ax5select="cboAftApproval" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		    	</div>
	    	</div>
	    </div>
    	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
	    	<div class="row">
				<div class="float-right">
					<button id="btnUpdate"  class="btn btn-default">
						수정 <span class="glyphicon" aria-hidden="true"></span>
					</button>
				</div>
	    	</div>
	    </div>
   	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"	src="<c:url value="/js/ecams/winpop/ApprovalInfo.js"/>"></script>