<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
	 <!--line 1-->
	<div class="half_wrap_cb">
		<div class="l_wrap txt_info">
			<ul>
				<li><i class="fas fa-angle-right"></i> 미결<span id="lblApproval">[5]</span></li>
				<li><i class="fas fa-angle-right"></i> SR<span id="lblSr">[5]</span></li>
				<li><i class="fas fa-angle-right"></i> 오류<span id="lblErr">[5]</span></li>
			</ul>
		</div>
		<div class="r_wrap card_info">
	        <dl>
	          <dt>등록</dt>
	          <dd id="srRegCnt">100</dd>
	        </dl>
	        <dl>
	          <dt>개발</dt>
	          <dd id="devSrCnt">1/10</dd>
	        </dl>
	        <dl>
	          <dt>테스트</dt>
	          <dd id="testSrCnt">1/10</dd>
	        </dl>
	        <dl>
	          <dt>적용</dt>
	          <dd id="appySrCnt">1/10</dd>
	        </dl>
		</div>
    </div>
    
    <!--line 2-->
	<div class="row half_wrap_cb">
		<div class="l_wrap progressbar scrollBind" style="width: 59%; height: 35%; margin-right: 2px;">
			<div class="margin-10-right" id="divSrList">
			</div>
		</div>
		<div class="r_wrap timeline width-39 scrollBind" style="background-color: #f8f8f8; height: 35%; margin-left: 2px;">
			<div class="margin-10-left timeline_box" id="divTimeLine">
				<h4>timeline</h4>
				<div class="item">
					<i class="fas fa-clock"></i>
					<div class="item_info">
						<p>제목나옵니다.</p>
						<small>내용나옵니다.</small>
					</div>
				</div>
				<div class="item">
					<i class="fas fa-clock time_icon"></i>
					<div class="item_info">
						<p>제목나옵니다.</p>
						<small>내용나옵니다.</small>
					</div>
				</div>
			</div>
		</div>
		
	</div>
	
	<!--line 3-->
	<div class="row half_wrap_cb">
		<div class="l_wrap width-59" id="divCal" style="margin-right: 2px;">
			<div id='calendar'></div>
		</div>
		<div class="r_wrap width-39" style="margin-left: 2px;">
			<div style="height: 30px; background: linear-gradient(to bottom, #f0f0f0, #fff, #f0f0f0)">
				<label class="sm-font margin-20-left" style="vertical-align: middle;" id="lblPieTitle"></label>
			</div>
			<div class="panel-body text-center dib margin-20-left" id="pieDiv" style="width: 95%;">
		    	<div id="pieAppliKinds"></div>
		    </div>
		</div>
	</div> 
</div>
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/main/eCAMSMainNew.js"/>"></script>