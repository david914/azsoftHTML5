<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<!-- Header -->
<div id="header"></div>

<div id="wrapper">
    <div class="content">    	
        <!-- history S-->
        <div id="history_wrap">관리자<strong>&gt; 디렉토리등록</strong></div>
        <!-- history E-->    
             
		<div class="half_wrap">
			<div class="l_wrap dib width-38 vat"><!--ver2-->
				<label class="width-10 dib">시스템</label>
				<div class="width-70 dib">
					<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}"></div> 
				</div>
			</div>
			
			<div class="r_wrap dib width-60 vat"><!--ver2-->
				<label class="width-10 dib">프로그램종류</label>
				<div class="width-89 dib">
					<div class="width-20 dib float-right">
						<input type="checkbox" class="checkbox-dir" id="chkAllPrg" data-label="전체선택"/>
					</div>
				</div>
	
				<div class="width-90 dib" style="height: 18%; border: 1px dotted gray;; background-color: white; overflow-y: auto;">
		  			<ul class="list-group" id="ulPrgInfo"></ul>
				</div>
			</div>
			
			<div class="l_wrap dib width-38 vat"><!--ver2-->
				<label class="width-10 dib">Directory</label>
				<input id="txtPath" name="txtPath" type="text" class="width-70 dib">
			</div>
			
			
			<div class="l_wrap dib width-38 vat"><!--ver2-->
				<label class="width-10 dib">업무</label>
				<div class="width-70 dib">
					<div class="float-right">
						<input type="checkbox" class="checkbox-dir float-right" id="chkAllJob" data-label="전체선택"/>
					</div>
				</div>
				<div class="width-81 dib" style="height: 11%; border: 1px dotted gray;; background-color: white; overflow-y: auto;">
		  			<ul class="list-group" id="ulJobInfo"></ul>
				</div>
			</div>
			
			<div class="l_wrap dib width-38 vat"><!--ver2-->
				<label class="width-100">[등록순서]등록/수정할 내용을 입력 후 추가버튼을 목록에 추가한 후 등록버튼을 클릭하여 주십시오.</label>
				<label class="width-100">[참고사항]업무영역이나 프로그램종류만 수정하는 경우 Directory란은 Clear한 후 추가하여 주십시오.</label>
			</div>
			
			<div class="r_wrap dib width-60 vat margin-10-top"><!--ver2-->
				<button id="btnAdd" name="btnAdd" class="btn_basic_s" style="cursor: pointer;">추가</button>
				<button id="btnReq" name="btnReq" class="btn_basic_s" style="cursor: pointer;">등록</button>
				<button id="btnQry" name="btnQry" class="btn_basic_s" style="cursor: pointer;">조회</button>
			</div>
			
		</div>
		<div class="az_board_basic margin-10-top" style="height: 58%;">
			<div data-ax5grid="dirGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%"></div>
		</div>
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/DirectoryReg.js"/>"></script>
	