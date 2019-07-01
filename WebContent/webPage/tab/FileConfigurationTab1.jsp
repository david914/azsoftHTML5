<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="l_wrap width-100 vat write_wrap_100 ">
	<div class="row">
		<dl>
			<dt>
				<label>작업구분</label>
			</dt>
			<dd>
				<div class="width-47 dib">
					<div id="cboJobDiv" data-ax5select="cboJobDiv" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div> 
				</div>
				<button id="btnSave" name="btnSave" class="btn_basic_s width-3">등록</button>
			</dd>
		</dl>
	</div>
	<div class="row">
		<dl>
			<dt>
				<label>작업주기</label>
			</dt>
			<dd>
				<input id="txtCycle" name="txtCycle" type="number" class="width-10">
				<div class="width-40 dib">
					<div id="cboCycle" data-ax5select="cboCycle" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div> 
				</div>
				
			</dd>
		</dl>
	</div>
	<div class="row">
		<dl>
			<dt>
				<label>작업시간</label>
			</dt>
			<dd>
				<div class="width-10 dib">
					<input id="txtRunTime" name="txtRunTime" type="text" class="width-70"><span class="btn_calendar poa_r"><i class="fa fa-clock-o"></i></span>
				</div>
				<label>예)08:00</label>
			</dd>
		</dl>
	</div>
	<div class="row">
		<dl>
			<dt>
				<label>최종작업일자</label>
			</dt>
			<dd>
				<input id="txtRundate" name="txtRundate" type="text" class="width-10">
			</dd>
		</dl>
	</div>
	<div class="row">
		<dl>
			<dt>
				<label>삭제주기</label>
			</dt>
			<dd>
				<input id="txtDelCycle" name="txtDelCycle" type="number" class="width-10">
				<div class="width-40 dib">
					<div id="cboDelCycle" data-ax5select="cboDelCycle" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div> 
				</div>
				<div class="dib float-right margin-3-top">
					<input type="checkbox" class="checkbox-file" id="chkAllSys" data-label="전체선택"/>
				</div>
			</dd>
		</dl>
	</div>
	<div class="row">
		<dl>
			<dt>
				<label>예외시스템</label>
			</dt>
			<dd>
				<div class="width-100 dib" style="height: 58%; border: 1px dotted gray;; background-color: white; overflow-y: auto;">
    				<ul class="list-group" id="ulSysInfo">
	    			</ul>
				</div>
			</dd>
		</dl>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/FileConfigurationTab1.js"/>"></script>