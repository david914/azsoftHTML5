<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
   <div id="history_wrap">
      관리자 <strong>&gt; 커맨드수행</strong>
   </div>
   <div class="az_search_wrap">
      	<div class="az_in_wrap">
         	<div class="width-98 dib">
            	<div class="dib" style="min-width:500px;">
	               	<input id="rdocmd"  type="radio" name="cmdRadioGbn" value="1"/>
	               	<label for="rdocmd">커맨드수행</label>
	               	<input id="rdoqry" type="radio" name="cmdRadioGbn" value="2" checked="checked"/>
	               	<label for="rdoqry">쿼리수행</label>
	               	<input id="optfile" type="radio"  name="cmdRadioGbn" value="3"/>
					<label for="optfile">파일송수신</label>
					<input id="opturl" type="radio"  name="cmdRadioGbn" value="3"/>
					<label for="opturl">URL호출</label>
					<label id="lbtit" class="tit_150 poa margin-20-left margin-5-right">[ 조회 할 쿼리문 입력 ]</label>
            	</div>
            	
            	<div class="dib" id="rdo2">
					<input id="rdoap"  type="radio" name="cmdRadioUsr" value="1"/>
			        <label for="rdoap">AP계정</label>
		        	<input id="rdoweb" type="radio" name="cmdRadioUsr" value="2" checked="checked"/>
					<label for="rdoweb">WEB계정</label>
				</div>
				<div class="dib" id="rdo3">
					<input id="rdosend"  type="radio" name="cmdRadioFile" value="1" checked="checked"/>
			        <label for="rdosend">송신</label>
		        	<input id="rdorecive" type="radio" name="cmdRadioFile" value="2"/>
					<label for="rdorecive">수신</label>
				</div>
				<div class="dib"  id="cboDbUsrSel" data-ax5select="cboDbUsrSel" data-ax5select-config="{size:'sm',theme:'primary'}" style="vertical-align: bottom; min-width: 110;"> </div>
				<div id="chkViewDiv" class="dib" style="min-width:200px;">
					<input id="chkView" tabindex="8" class="checkbox-pie" type="checkbox" value="chkView" style="margin-top: 5px;" name="chkView" checked="checked"/>
					<label for="chkView"  id="txtChkView" style="margin-top: -5px;">수신파일 직접보기</label>
				</div>
				
				<button id="btnQry" class="btn_basic_s margin-5-left float-right" style="cursor: pointer;">커맨드실행</button>
				<button id="btnExcel" class="btn_basic_s margin-20-left float-right" style="cursor: pointer;">엑셀저장</button>
			</div>
		</div>
	</div>
   
	<div class="row">
      <form>
         <textarea id="txtcmd" name="txtcmd" style="align-content:left;width:100%;height:150px;resize: none;padding: 12px 20px; box-sizing: border-box; border: 1px solid #ddd; background-color: #fff; font-size: 12px;"></textarea>
      </form>
	</div>
   
	<div class="az_board_basic margin-10-top">
		<div data-ax5grid="cmdGrid" data-ax5grid-config="{showLineNumber : true, lineNumberColumnWidth: 40}" style="height: 500px"></div>
	</div>
	<div class="row">
		<form>
			<textarea id="txtrst" name="txtrst" style="align-content:left;width:100%;height:500px;resize: none;padding: 12px 20px; box-sizing: border-box; border: 1px solid #ddd; background-color: #fff; font-size: 12px;" readonly></textarea>
      	</form>
	</div>
	
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/CommandExcute.js"/>"></script>
