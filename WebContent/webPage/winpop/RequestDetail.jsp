<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ page import = "com.ecams.common.base.StringHelper"%>
<%
	String acptNo = StringHelper.evl(request.getParameter("acptno"),"");
	String userId = StringHelper.evl(request.getParameter("user"),"");
%>

<style>
.fontStyle-error {
	color: #BE81F7;
}
.fontStyle-cncl {
	color: #FF0000;
}
.fontStyle-module {
	color: #FF8080;
}
</style>


<c:import url="/webPage/common/common.jsp" />

<div class="hpanel">
    <div class="panel-body" id="reqInfoDiv">
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12" style="padding: 0;">
	    	<div class="col-lg-4 col-md-4 col-sm-4 col-12">
		    	<div class="row">
			    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
			    		<label id="lblAcptNo" class="padding-5-top float-left">신청번호</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<!-- 배경투명하게할때 style 옵션  background-color:transparent;-->
			    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
		    	</div>
		    	<div class="row" style="padding-top: 2;">
			    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
			    		<label id="lblSysCd" class="padding-5-top float-left">시스템</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<input id="txtSyscd" name="txtSyscd" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
		    	</div>
		    	<div class="row" style="padding-top: 2;">
			    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
			    		<label id="lblEditor" class="padding-5-top float-left">신청자</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<input id="txtEditor" name="txtEditor" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
		    	</div>
		    	<div class="row" style="padding-top: 2;">
			    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
			    		<label id="lblReqGbn" class="padding-5-top float-left">신청구분</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<input id="txtReqGbn" name="txtReqGbn" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
		    	</div>
		    	<div class="row" style="padding-top: 2;">
			    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
			    		<label id="lblStatus" class="padding-5-top float-left">진행상태</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<input id="txtStatus" name="txtStatus" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
		    	</div>
		    </div>
		    
	    	<div class="col-lg-8 col-md-8 col-sm-8 col-12">
		    	<div class="row">
			    	<div class="col-lg-1 col-md-12 col-sm-12 col-12">
			    		<label id="lblSayu" class="padding-5-top float-left">신청사유</label>
			    	</div>
			    	<div class="col-lg-11 col-md-12 col-sm-12 col-12" style="padding-left: 2;">
			    		<input id="txtSayu" name="txtSayu" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
			    </div>
		    	<div class="col-lg-6 col-md-6 col-sm-6 col-12" style="padding: 0;">
			    	<div class="row" style="padding-top: 2;">
				    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
				    		<label id="lblAcptDate" class="padding-5-top float-left">신청일시</label>
				    	</div>
				    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
				    		<input id="txtAcptDate" name="txtAcptDate" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
				    	</div>
			    	</div>
			    	<div class="row" style="padding-top: 2;">
				    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
				    		<label id="lblReqPass" class="padding-5-top float-left">처리구분</label>
				    	</div>
				    	<div class="col-lg-3 col-md-12 col-sm-12 col-12" style="padding: 0;">
			    			<div id="cboReqPass" data-ax5select="cboReqPass" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
				    	</div>
				    	<div id="reqgbnDiv" class="col-lg-6 dis-i-b" style="padding: 0;visibility: hidden">
				    		<div class="col-lg-6 col-md-12 col-sm-12 col-12" style="padding: 0;">
				    			<div class="input-group" data-ax5picker="basic" >
						            <input id="txtReqDate" type="text" class="form-control" placeholder="yyyy/mm/dd">
						            <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
						        </div>
				    		</div>
				    		<div class="col-lg-6 col-md-12 col-sm-12 col-12" style="padding: 0;">
					      		<div class="input-group bootstrap-timepicker timepicker" style="width:89%; float:left;">
									<input  id="txtReqTime"  name="txtReqTime" type="text" class="form-control input-small" required="required" readonly></input>
									<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
								</div>
				    		</div>
			    		</div>
				    	<div class="col-lg-1 col-md-12 col-sm-12 col-12" style="padding: 0;visibility: hidden;" id="reqBtnDiv">
							<button id="btnUpdate"  class="btn btn-default">
								수정 <span class="glyphicon" aria-hidden="true"></span>
							</button>
				    	</div>
			    	</div>
		    	</div>
		    	<div class="col-lg-6 col-md-6 col-sm-6 col-12" style="padding-right: 0;">
			    	<div class="row" style="padding-top: 2;">
				    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
				    		<label id="lblPrcDate" class="padding-5-top float-left">완료일시</label>
				    	</div>
				    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
				    		<input id="txtPrcDate" name="txtPrcDate" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
				    	</div>
			    	</div>
			    	<div class="row" style="padding-top: 2;">
				    	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
							<div class="float-right">
								<button id="btnTestDoc"  class="btn btn-default" disabled>
									테스트결과서 <span class="glyphicon" aria-hidden="true"></span>
								</button>
								<button id="btnBefJob"  class="btn btn-default" disabled>
									선후행작업확인 <span class="glyphicon" aria-hidden="true"></span>
								</button>
							</div>
				    	</div>
			    	</div>
		    	</div>
		    	<div class="col-lg-12 col-md-12 col-sm-12 col-12" style="padding: 2 0 0 0;visibility: hidden" id="SrDiv">
			    	<div class="col-lg-1 col-md-12 col-sm-12 col-12" style="padding-left: 0;width:70px;">
			    		<label id="lblSR" class="padding-5-top float-left">SR-ID</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<input id="txtSR" name="txtSR" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
			    	<div class="col-lg-1 col-md-12 col-sm-12 col-12" style="padding: 0;">
						<div class="float-right" style="padding: 0;">
							<button id="btnSR"  class="btn btn-default">
								SR정보확인 <span class="glyphicon" aria-hidden="true"></span>
							</button>
						</div>
			    	</div>
			    </div>
		    	<div class="col-lg-12 col-md-12 col-sm-12 col-12" style="padding: 2 0 0 0;">
	    			<label id="lblErrMsg" class="padding-5-top float-left" style="color:#ff0000;padding-top: 0px;"></label>
		    	</div>
		    </div>
	   </div>
   	</div>
</div>

<div class="panel-body" id="grdDiv" style="padding-top:0;padding-right:20;">
	<div class="col-lg-3 col-md-12 col-sm-12 col-12" style="padding: 0;">
		<ul class="tabs">
	       	<li class="active" rel="tab1" id="tab1Li">체크인목록</li>
	       	<li rel="tab2" id="tab2Li">처리결과확인</li>
	  	</ul>
	</div>
	<div class="col-lg-9 col-md-12 col-sm-12 col-12" style="padding: 0;">
		<div class="float-right">
			<button id="btnSrcView"  class="btn btn-default" disabled>
				소스보기 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnSrcDiff"  class="btn btn-default" disabled>
				소스비교 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnAllCncl"  class="btn btn-default" disabled>
				전체회수 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnRetry"  class="btn btn-default" disabled>
				전체재처리 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnNext"  class="btn btn-default" disabled>
				다음단계진행 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnErrRetry"  class="btn btn-default" disabled>
				오류건재처리 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnStepEnd"  class="btn btn-default" disabled>
				단계완료 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnLog"  class="btn btn-default" disabled>
				로그확인 <span class="glyphicon" aria-hidden="true"></span>
			</button>
		</div>
	</div>
  	<div class="tab_container" style="height: 60%;">
      	<div id="tab1" class="tab_content">
			<div class="content" style="padding: 5;">
				<div class="hpanel" style="padding: 10;">
		    		<div class="row" style="padding-top: 5;padding-bottom: 5;">
				    	<div class="col-lg-6 col-12" style="padding: 0;">
							<div class="float-left">
				    			<input type="checkbox" class="checkbox-pie" id="chkDetail" data-label="항목상세보기"  />
								<button id="btnSelCncl"  class="btn btn-default" disabled>
									선택건회수<span class="glyphicon" aria-hidden="true"></span>
								</button>
					    	</div>
					    </div>
			    		<div class="col-lg-6 col-12" style="padding-right: 5;">
							<div class="float-right">
								<button id="btnPriorityOrder"  class="btn btn-default" disabled>
									우선순위적용<span class="glyphicon" aria-hidden="true"></span>
								</button>
								<input style="width: 10;border-style: none;"/>
				    			<label id="lblCnt" class="padding-5-top">총 0건</label>
				    		</div>
			    		</div>
			    	</div>
		    		<div class="row" style="padding-top: 5;">
					    <div class="panel-body text-center" id="gridDiv1">
					    	<div data-ax5grid="reqGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 82%;">
					    	</div>
					    </div>
				    </div>
				</div>
			</div>
       	</div>
       	<div id="tab2" class="tab_content">
			<div class="content" style="padding-top: 5;padding: 5;">
				<div class="hpanel" style="padding: 10;">
		    		<div class="row" style="padding-bottom: 5;">
	    				<label id="lblPrcSys" class="padding-5-top">배포구분</label>
	    				<div id="cboPrcSys" data-ax5select="cboPrcSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		    		</div>
		    		<div class="row" style="padding-top: 5;">
					    <div class="panel-body text-center" id="gridDiv2">
					    	<div data-ax5grid="resultGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 82%;">
					    	</div>
					    </div>
				    </div>
				</div>
			</div>
       	</div>
   	</div>
</div>

<div class="hpanel" style="padding: 0;">
    <div class="panel-body" id="approvalDiv" style="border-style: none;padding: 0;">
    	<div class="col-lg-1 col-12">
    		<label id="lblApprovalMsg" class="padding-5-top float-left">결재/반려의견</label>
	    </div>
    	<div class="col-lg-7 col-12" style="padding: 0;">
    		<textarea id="txtApprovalMsg" name="txtApprovalMsg" class="form-control" style="align-content:left;width:100%;"></textarea>
	    </div>
    	<div class="col-lg-4 col-12" >
			<div class="float-right">
				<button id="btnQry"  class="btn btn-default">
					새로고침 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnApprovalInfo"  class="btn btn-default">
					결재정보 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnPriority"  class="btn btn-default">
					우선적용 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnApproval"  class="btn btn-default" disabled>
					결재 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnCncl"  class="btn btn-default" disabled>
					반려 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnClose"  class="btn btn-default">
					닫기 <span class="glyphicon" aria-hidden="true"></span>
				</button>
			</div>
	    </div>
	</div>
</div>

<form name="reqData">
	<input type="hidden" name="acptno" value="<%=acptNo%>"/>
	<input type="hidden" name="user" value="<%=userId%>"/>
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"	src="<c:url value="/js/ecams/winpop/RequestDetail.js"/>"></script>