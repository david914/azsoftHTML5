<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<!-- Header -->
<div id="header"></div>

<div id="wrapper">
    <div class="content">    	
        <!-- history S-->
        <div id="history_wrap">관리자<strong>&gt; 일괄등록</strong></div>
        <!-- history E-->    
        
        <div class="half_wrap">
			<div class="l_wrap dib width-70 vat"><!--ver2-->
				<label class="width-7">시스템</label>
				<div class="width-30 dib">
					<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
				</div>
				<label class="width-7">대상서버</label>
				<div class="width-30 dib">
					<div id="cboSvrCd" data-ax5select="cboSvrCd" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
				</div>
			</div>
			
			<div class="r_wrap dib width-30 vat"><!--ver2-->
				<button id="btnLoadExl" name="btnLoadExl" class="width-20 btn_basic_s" style="cursor: pointer;">엑셀파일</button>
				<button id="btnReq" name="btnReq" class="width-20 btn_basic_s" style="cursor: pointer;">일괄등록</button>
				<button id="btnSmm" name="btnSmm" class="width-20 btn_basic_s" style="cursor: pointer;">맵핑</button>
			</div>
			
			<div class="l_wrap dib width-70 vat"><!--ver2-->
				<label class="width-7" style="visibility: hidden;">구분명</label>
				<div class="width-30 dib margin-3-top">
					<input id="optBase1"  type="radio" name="optradio"  value="1"/>
					<label for="optBase1">최초등록(버전:1)</label>
					<input id="optBase2" type="radio"  name="optradio"  value="2"/>
					<label for="optBase2">목록등록(버전:0)</label>
				</div>
				<label class="width-7" style="visibility: hidden;">구분명</label>
				<div class="width-30 dib margin-3-top">
					<input id="optNomal"  type="radio" name="radio"  value="normal"/>
					<label for="optNomal">정상건</label>
					<input id="optErr" type="radio"  name="radio"  value="err"/>
					<label for="optErr">오류건</label>
					<input id="optAll" type="radio"  name="radio"  value="all"/>
					<label for="optAll">전체</label>
					<input type="checkbox" class="checkbox-batch" id="chkOk" data-label="정상건만등록"/>
				</div>
			</div>
			
			<div class="r_wrap dib width-30 vat"><!--ver2-->
				<button id="btnSaveExl" name="btnSaveExl" class="width-20 btn_basic_s" style="cursor: pointer;">엑셀저장</button>
				<button id="btnExlTmp" name="btnExlTmp" class="width-20 btn_basic_s" style="cursor: pointer;">엑셀템플릿</button>
				<button id="btnDel" name="btnDel" class="width-20 btn_basic_s" style="cursor: pointer;">삭제</button>
			</div>
		
		</div>
        
		<div class="az_board_basic margin-10-top" style="height: 80%;">
			<div data-ax5grid="batchGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>
	</div>
</div>

<form name="popPam">
	<input type="hidden" name="userId"/>
	<input type="hidden" name="userName"/>
	<input type="hidden" name="adminYN"/>
	<input type="hidden" name="strReqCD"/>
</form>
<form id='ajaxform' method='post' enctype='multypart/form-data' style="display: none;">
	<input type="file" id="excelFile" name="excelFile" accept=".xls,.xlsx" accept-charset="UTF-8" />
</form>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/BatchReg.js"/>"></script>
	