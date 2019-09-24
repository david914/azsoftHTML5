<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<%@ page import="com.ecams.common.base.StringHelper"%>
<link type="text/css" rel="stylesheet" href="/vendor/highlight/styles/vs.css" />
<script type="text/javascript" src="/vendor/highlight/highlight.pack.js"></script>
<style>
body{min-width: 0;}
</style>

<div id="L_wrap width-70" style="overflow-y: hidden;">
	<div class="row por">					
		<div class="dib vat" style="width:34%">
			<label class="tit_80 poa">&nbsp;&nbsp;프로그램명</label>
			<div class="ml_30">
				<div class="ml_80">
					<input id="txtProgId" name="txtProgId" type="text" class="width-100" readonly="readonly">
				</div>
			</div>
		</div>
		
		<div class="dib vat margin-30-left" style="width:34%">
			<label class="tit_80 poa">기준프로그램</label>
			<div class="ml_30">
				<div class="ml_80">
					<input id="txtBaseId" name="txtBaseId" type="text" class="width-100" readonly="readonly">
				</div>
			</div>
		</div>
		<div class="dib vat margin-30-left" style="width:21%">
			<label class="tit_40 poa">버전</label>
			<div class="ml_20">
				<div class="margin-30-left">
					<input id="txtVer" name="txtVer" type="text" class="width-100" readonly="readonly" style="text-align:center;">
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="row scrollBind" style="align-content:left;width:100%;height:94%;resize: none;overflow:auto;" id="htmlView"  >
		    <pre style="width:100%;height:100%;"><code id="htmlSrc"></code></pre>
		</div>
	</div>			
</div>		

<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/tab/sourceview/SourceViewTab.js"/>"></script>
