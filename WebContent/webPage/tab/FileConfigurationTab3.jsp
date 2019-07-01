<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="l_wrap width-100 vat write_wrap_100 ">
	<div class="row">
		<dl>
			<dt>
				<label>작업일자</label>
			</dt>
			<dd>
			
				<div id="divPicker" data-ax5picker="dateDeploy" class="width-20 dib">
		            <input id="dateDeploy" name="dateDeploy" type="text" placeholder="yyyy/mm/dd" class="width-80"><span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
				</div>
			
				<div class="width-16 dib">
					<input id="txtDeploy" name="txtDeploy" type="text" class="width-70"><span class="btn_calendar poa_r"><i class="fa fa-clock-o"></i></span>
				</div>
				<div class="dib width-10 margin-3-top">
					<input type="checkbox" class="checkbox-file float-right" id="chkTime" data-label="즉시실행"/>
				</div>
			</dd>
		</dl>
	</div>
	
	<div class="row">
		<dl>
			<dt>
				<label>시스템</label>
			</dt>
			<dd>
				<input id="txtSys" name="txtSys" type="text" class="width-10">
				<div class="width-30 dib">
					<div id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div> 
				</div>
				
			</dd>
		</dl>
	</div>
	<div class="row">
		<dl>
			<dt>
				<label>서버</label>
			</dt>
			<dd>
				<input id="txtSvrIp" name="txtSvrIp" type="text" class="width-34">
				<button id="btnRun" name="btRun" class="btn_basic_s width-3" style="cursor: pointer;">등록</button>
				<button id="btnDel" name="btnDel" class="btn_basic_s width-3" style="cursor: pointer;">삭제</button>
			</dd>
		</dl>
	</div>
	
	
	<div class="row">
		<div class="az_board_basic margin-10-top" style="height: 68%;">
			<div data-ax5grid="handGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/FileConfigurationTab3.js"/>"></script>