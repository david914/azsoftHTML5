<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
    <!-- history S-->
	<div id="history_wrap">
		관리자 <strong>&gt; 커맨드수행</strong>
	</div>
	
	
	<div class="row dib width-100">
		<input id="optManCheck"  type="radio" name="comRadio"  value="man"/>
		<label for="optManCheck" >직원</label>
		<input id="optOutCheck" type="radio"  name="comRadio"  value="outSour"/>
		<label for="optOutCheck">외주직원</label>
	
		<button class="btn_basic_s float-right" id="btnDelJob">쿼리실행</button>
	</div>
	
	<div class="row">
		<textarea id="txtBlankSayu" class="width-100" style="padding: 12px 20px; box-sizing: border-box; border: 1px solid #ddd; background-color: #fff; font-size: 12px; height: 400px;">
		</textarea>
	</div>
	
	<div class="az_board_basic margin-10-top" style="height: 40%">
		<div data-ax5grid="comGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%"></div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/CommandExcute.js"/>"></script>