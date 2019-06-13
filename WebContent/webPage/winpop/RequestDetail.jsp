<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="hpanel">
    <div class="panel-body" id="reqInfoDiv">
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12" style="padding: 0;">
	    	<div class="col-lg-4 col-md-4 col-sm-4 col-12">
		    	<div class="row">
			    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
			    		<label id="lblBefApproval" class="padding-5-top float-left">신청번호</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    	<!-- 배경투명하게할때 style 옵션  background-color:transparent;-->
			    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
		    	</div>
		    	<div class="row" style="padding-top: 2;">
			    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
			    		<label id="lblSayu" class="padding-5-top float-left">시스템</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
		    	</div>
		    	<div class="row" style="padding-top: 2;">
			    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
			    		<label id="lblAftApproval" class="padding-5-top float-left">신청자</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
		    	</div>
		    	<div class="row" style="padding-top: 2;">
			    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
			    		<label id="lblBefApproval" class="padding-5-top float-left">신청구분</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
		    	</div>
		    	<div class="row" style="padding-top: 2;">
			    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
			    		<label id="lblAftApproval" class="padding-5-top float-left">진행상태</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
		    	</div>
		    </div>
		    
	    	<div class="col-lg-8 col-md-8 col-sm-8 col-12">
		    	<div class="row">
			    	<div class="col-lg-1 col-md-12 col-sm-12 col-12">
			    		<label id="lblBefApproval" class="padding-5-top float-left">신청사유</label>
			    	</div>
			    	<div class="col-lg-11 col-md-12 col-sm-12 col-12" style="padding-left: 2;">
			    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
			    </div>
		    	<div class="col-lg-6 col-md-6 col-sm-6 col-12" style="padding: 0;">
			    	<div class="row" style="padding-top: 2;">
				    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
				    		<label id="lblBefApproval" class="padding-5-top float-left">신청일시</label>
				    	</div>
				    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
				    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
				    	</div>
			    	</div>
			    	<div class="row" style="padding-top: 2;">
				    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
				    		<label id="lblBefApproval" class="padding-5-top float-left">처리구분</label>
				    	</div>
				    	<div class="col-lg-4 col-md-12 col-sm-12 col-12" style="padding: 0;">
			    			<div id="cboSayu" data-ax5select="cboSayu" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
				    	</div>
				    	<div id="reqgbnDiv" class="col-lg-6 dis-i-b" style="padding: 0;">
				    		<div class="col-lg-6 col-md-12 col-sm-12 col-12" style="padding: 0;">
				    			<div class="input-group" data-ax5picker="txtReqDate" >
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
			    	</div>
		    	</div>
		    	<div class="col-lg-6 col-md-6 col-sm-6 col-12" style="padding-right: 0;">
			    	<div class="row" style="padding-top: 2;">
				    	<div class="col-lg-2 col-md-12 col-sm-12 col-12">
				    		<label id="lblBefApproval" class="padding-5-top float-left">완료일시</label>
				    	</div>
				    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
				    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
				    	</div>
			    	</div>
			    	<div class="row" style="padding-top: 2;">
				    	<div class="col-lg-12 col-md-12 col-sm-12 col-12">
							<div class="float-right">
								<button id="btnUpdate"  class="btn btn-default">
									테스트결과서 <span class="glyphicon" aria-hidden="true"></span>
								</button>
								<button id="btnUpdate"  class="btn btn-default">
									선후행작업확인 <span class="glyphicon" aria-hidden="true"></span>
								</button>
							</div>
				    	</div>
			    	</div>
		    	</div>
		    	<div class="col-lg-12 col-md-12 col-sm-12 col-12" style="padding: 2 0 0 0;">
			    	<div class="col-lg-1 col-md-12 col-sm-12 col-12" style="padding-left: 0;width:70px;">
			    		<label id="lblAftApproval" class="padding-5-top float-left">SR-ID</label>
			    	</div>
			    	<div class="col-lg-10 col-md-12 col-sm-12 col-12" style="padding-left: 0;">
			    		<input id="txtAcptNo" name="txtAcptNo" class="form-control" type="text" style="align-content:left;width:100%;" readonly onfocus="this.blur()"></input>
			    	</div>
			    	<div class="col-lg-1 col-md-12 col-sm-12 col-12" style="padding: 0;">
						<div class="float-right" style="padding: 0;">
							<button id="btnUpdate"  class="btn btn-default">
								SR정보확인 <span class="glyphicon" aria-hidden="true"></span>
							</button>
						</div>
			    	</div>
			    </div>
		    	<div class="col-lg-12 col-md-12 col-sm-12 col-12" style="padding: 2 0 0 0;">
	    			<label id="lblAftApproval" class="padding-5-top float-left" style="color:#ff0000;padding-top: 0px;">오류메시지: </label>
		    	</div>
		    </div>
	   </div>
   	</div>
</div>
<!--  
<div class="hpanel">
    <div class="panel-body" id="actionDiv" style="border: 0; border-style: none;padding: 0 20 0 0;">
    	<div class="col-lg-12 col-md-12 col-sm-12 col-12" style="padding: 0;">
    		<div class="float-right">
				<button id="btnUpdate"  class="btn btn-default">
					소스보기 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					소스비교 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					전체회수 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					전체재처리 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					다음단계진행 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					오류건재처리 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					단계완료 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					로그확인 <span class="glyphicon" aria-hidden="true"></span>
				</button>
			</div>
    	</div>
    </div>
</div>
-->
<div class="panel-body" id="grdDiv" style="padding-top:0;padding-right:20;">
	<div class="col-lg-3 col-md-12 col-sm-12 col-12" style="padding: 0;">
		<ul class="tabs">
	       	<li class="active" rel="tab1" id="tab1Li">체크인목록</li>
	       	<li rel="tab2" id="tab2Li">처리결과확인</li>
	  	</ul>
	</div>
	<div class="col-lg-9 col-md-12 col-sm-12 col-12" style="padding: 0;">
		<div class="float-right">
			<button id="btnUpdate"  class="btn btn-default">
				소스보기 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnUpdate"  class="btn btn-default">
				소스비교 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnUpdate"  class="btn btn-default">
				전체회수 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnUpdate"  class="btn btn-default">
				전체재처리 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnUpdate"  class="btn btn-default">
				다음단계진행 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnUpdate"  class="btn btn-default">
				오류건재처리 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnUpdate"  class="btn btn-default">
				단계완료 <span class="glyphicon" aria-hidden="true"></span>
			</button>
			<button id="btnUpdate"  class="btn btn-default">
				로그확인 <span class="glyphicon" aria-hidden="true"></span>
			</button>
		</div>
	</div>
  	<div class="tab_container" style="height: 60%;">
      	<div id="tab1" class="tab_content">
      		<section>
			<div class="content" style="padding: 5;">
				<div class="hpanel" style="padding: 10;">
		    		<div class="row">
		    			<input type="checkbox" class="checkbox-pie" id="chkOpen" data-label="항목상세보기"  />
						<button id="btnUpdate"  class="btn btn-default">
							선택건회수 <span class="glyphicon" aria-hidden="true"></span>
						</button>
						<button id="btnUpdate"  class="btn btn-default">
							우선순위적용 <span class="glyphicon" aria-hidden="true"></span>
						</button>
			    		<label id="lblAftApproval" class="padding-5-top float-left">총 0건</label>
			    	</div>
		    		<div class="row">
					    <div class="panel-body text-center" id="gridDiv">
					    	<div data-ax5grid="sysInfoGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 85%;"></div>
						    </div>
					    </div>
					</div>
				</div>
			</section>
       	</div>
       	<div id="tab2" class="tab_content">
	  		<iframe src='../test/LSH_testPage.jsp?reqcd=32' width='100%' height='100%' frameborder="0"></iframe>
       	</div>
   	</div>
</div>

<div class="hpanel" style="padding: 0;">
    <div class="panel-body" id="approvalDiv" style="border-style: none;padding: 0;">
    	<div class="col-lg-1 col-12">
    		<label id="lblAftApproval" class="padding-5-top float-left">결재/반려의견</label>
	    </div>
    	<div class="col-lg-7 col-12" style="padding: 0;">
    		<textarea id="txtAcptNo" name="txtAcptNo" class="form-control" style="align-content:left;width:100%;"></textarea>
	    </div>
    	<div class="col-lg-4 col-12" >
			<div class="float-right">
				<button id="btnUpdate"  class="btn btn-default">
					새로고침 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					결재정보 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					우선적용 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					결재 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					반려 <span class="glyphicon" aria-hidden="true"></span>
				</button>
				<button id="btnUpdate"  class="btn btn-default">
					닫기 <span class="glyphicon" aria-hidden="true"></span>
				</button>
			</div>
	    </div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"	src="<c:url value="/js/ecams/winpop/RequestDetail.js"/>"></script>