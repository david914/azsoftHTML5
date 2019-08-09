<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<!-- tab E-->
<div class="half_wrap">
	<!--left wrap-->
	<div class="l_wrap width-50">
		<div class="margin-5-right">
			<div>
				<label class="tit_80 poa">서버종류</label>
                <div class="ml_80">
					<div id="cboSvrItem" data-ax5select="cboSvrItem" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100 dib"></div>
				</div>
			</div>					
			<!--테이블 S-->
			<div class="row">
				<div class="az_board_basic" style="height: 30%;">
					<div data-ax5grid="svrItemGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
				</div>
			</div>					
			<div class="row">
				<label class="tit_80 poa">홈디렉토리</label>
				<div class="ml_80">
					<input id="txtVolpath" class="width-100" type="text"></input>
				</div>
			</div>
		</div>
 	</div>
 	<!--right wrap-->
 	<div class="r_wrap width-50">	
		<div class="margin-5-left">
			<div class="por">
				<label class="title_s">[프로그램종류]</label>
				<div class="poa_r">
					<input type="checkbox" class="checkbox-prg" id="chkAllItem" data-label="전체선택"  />
				</div>
			</div>
			<div class="scrollBind row" style="height: 210px;">
    			<ul class="list-group" id="ulItemInfo"></ul>
   			</div>
   		</div>
 		<div class="row tar">
			<button id="btnReqItem" class="btn_basic_s" data-grid-control="excel-export">등록</button>
			<button id="btnClsItem" class="btn_basic_s margin-5-left" data-grid-control="excel-export">폐기</button>
			<button id="btnQryItem" class="btn_basic_s margin-5-left" data-grid-control="excel-export">조회</button>
			<button id="btnExitItem" class="btn_basic_s margin-5-left" data-grid-control="excel-export">닫기</button>
 		</div>
	</div>
</div>
<!--테이블 S-->
<div class="row">
	<div class="az_board_basic" style="height: 55%;">
		<div data-ax5grid="itemGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
	</div>
</div>
<!--테이블 E-->

<!-- 
<div class="row">
	<div class="col-sm-7">
		<div class="col-sm-3">
			<label id="lblSvrItem">서버종류</label>
		</div>
		<div class="col-sm-5">
			<div 	id="cboSvrItem" data-ax5select="cboSvrItem" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
			</div>
		</div>
		<div class="col-sm-4">
			<input type="checkbox" class="checkbox-prg" id="chkAllSvrItem" data-label="전체선택"  />
		</div>
		<div class="col-sm-12">
			<div data-ax5grid="svrItemGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 45%;"></div>
		</div>
	</div>
	
	<div class="col-sm-5">
		<div class="col-sm-8">
			<label id="lblItem">[프로그램종류]</label>
		</div>
		<div class="col-sm-4">
			<input type="checkbox" class="checkbox-prg" id="chkAllItem" data-label="전체선택"  />
		</div>
		<div class="col-sm-12">
			<div class="scrollBind" style="height: 235px; border: 1px solid black;">
				<ul class="list-group" id="ulItemInfo"></ul>
			</div>
		</div>
	</div>
	
	<div class="col-sm-1">
		<label id="lblHome">홈디렉토리</label>
	</div>
	<div class="col-sm-7">
		<input id="txtVolpath" name="txtVolpath" class="form-control" type="text"></input>
	</div>
	<div class="col-sm-4">
		<button class="btn btn-default" id="btnReqItem">
			등록 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
		<button class="btn btn-default" id="btnClsItem">
			폐기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
		<button class="btn btn-default" id="btnQryItem">
			조회 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
		<button class="btn btn-default" id="btnExitItem">
			닫기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
		</button>
	</div>
	
	<div class="col-sm-12">
		<div data-ax5grid="itemGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 45%;"></div>
	</div>
</div>
 -->
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/sysinfo/SysDetailPrgTab.js"/>"></script>