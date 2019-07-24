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
	          <dd>100</dd>
	        </dl>
	        <dl>
	          <dt>개발</dt>
	          <dd>1/10</dd>
	        </dl>
	        <dl>
	          <dt>테스트</dt>
	          <dd>1/10</dd>
	        </dl>
	        <dl>
	          <dt>적용</dt>
	          <dd>1/10</dd>
	        </dl>
		</div>
    </div>
    
    <!--line 2-->
	<div class="row half_wrap_cb">
		<div class="l_wrap progressbar" style="width: 70%;">
			<div class="margin-10-right">
				<dl>
					<dt>[R2019-07-23] SR테스트1</dt>
					<dd><span class="org width-25">25%</span></dd>
				</dl>
				<dl>
					<dt>[R2019-07-23] SR테스트2</dt>
					<dd><span class="green width-50">50%</span></dd>
				</dl>
				<dl>
					<dt>[R2019-07-23] SR테스트3</dt>
					<dd><span class="blue width-80">80%</span></dd>
				</dl>
			</div>
		</div>
		<div class="r_wrap timeline width-30">
			<div class="margin-10-left timeline_box">
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
		<div class="l_wrap width-60">
			<div id='calendar'></div>
		</div>
		<div class="r_wrap width-40">
			그래프영역
		</div>
	</div> 
	<!-- <div class="row">
		<div class="width-50 dib">
			
		</div>
	</div> -->
</div>
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/main/eCAMSMainNew.js"/>"></script>