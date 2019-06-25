<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<c:import url="/js/ecams/common/commonscript.jsp" />

<section>
	<div class="container-fluid">
		<div class="border-style-black">
			<div class="row-fluid">
				<div class="col-sm-1 col-xs-12 margin-10-top text-center"> 
					<label id="lbReqDepart">요청부서</label>
				</div>
				<div class="col-sm-1 col-xs-12 margin-5-top no-padding">
	                <div id="cboReqDepart" data-ax5select="cboReqDepart" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
				</div>
				<div class="col-sm-1 col-xs-12 margin-10-top text-center">
					<label id="lbCatType">분류유형</label>
				</div>
				<div class="col-sm-1 col-xs-12 margin-5-top no-padding">
	                <div id="cboCatType" data-ax5select="cboCatType" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
				</div>
				
				<div class="col-sm-1 col-xs-12 margin-10-top text-center">
					<label id="lbQryGbn">대상구분</label>
				</div>
				<div class="col-sm-1 col-xs-12  margin-5-top no-padding">
	                <div id="cboQryGbn" data-ax5select="cboQryGbn" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
				</div>
				
				<div class="col-sm-1 col-xs-12 text-center margin-10-top">
					<label id="lbAcptDate">등록일</label>
				</div>
				<div class="col-sm-3 col-xs-12 no-padding">
					<div class="input-group" data-ax5picker="basic" style="width:100%;" id="dateDiv">
			            <input id="datStD" name="datStD" type="text" class="form-control" placeholder="yyyy/mm/dd">
			            <span class="input-group-addon">~</span>
			            <input id="datEdD" name="datEdD" type="text" class="form-control" placeholder="yyyy/mm/dd">
			            <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
		     		</div>
				</div>
				<div class="col-sm-1 no-padding">
					<button id="btnQry" class="btn btn-default">조&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;회</button>
				</div>
				<div class="cols-sm-1 no-padding">
					<button id="btnReset" class="btn btn-default">초&nbsp;&nbsp;기&nbsp;&nbsp;화</button>
				</div>
				
				<div class="row margin-10-top">
					<section>
						<div class="container-fluid">
							<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 25%;"></div>
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
</section>
<script type="text/javascript" src="<c:url value="/js/ecams/srcommon/PrjListTab.js"/>"></script>
