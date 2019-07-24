<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<body style="height: 95% !important">

	<div class="row half_wrap_cb">			
		<div class="l_wrap width-20">
            <label class="tit_100 poa">SMS발신번호</label>
            <div class="ml_100 por">
            	<input id="txtSMSSend" type="text" class="width-100 dib">
			</div>
		</div>		
		<div class="l_wrap width-50 margin-15-left">
            <label class="tit_100 poa">발신사용자</label>
            <div class="ml_100 por">
				<input id="txtUser" type="text" class="width-50 dib">
                <div class="dib">
					<div id="cboUser" data-ax5select="cboUser" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
				</div>
				<div class="dib vat">
					<button id="btnReqUser" class="btn_basic_s">등록</button>
				</div>
			</div>
		</div>
	</div>
	
	<div class="az_search_wrap row">
		<div class="az_in_wrap por">
			<!-- cell1 -->		
			<div class="width-33 dib vat">
				<div class="por">
					<label>신청구분</label>
					<div class="poa_r">
						<input type="checkbox" class="checkbox-noti float-right" id="chkAll" data-label="전체선택"/>
					</div>
				</div>
				<div class="row scrollBind" style="height:150px;">
					<ul class="list-group" id="ulReqInfo"></ul>
				</div>
			</div>
			<!-- cell2 -->		
			<div class="width-33 dib vat">
               	<div class="margin-10-left">
                	<div class="por">
	                    <label>알림구분</label>
					</div>
					<div class="row scrollBind" style="height:150px;">
						<ul class="list-group" id="ulNotiInfo"></ul>
					</div>
				</div>
			</div>
			<!-- cell3 -->		
			<div class="width-33 dib vat">
               	<div class="margin-10-left">
                	<div>
	                    <label class="tit_80 poa">업무중</label>
	                    <div class="ml_80">
							<div id="cboCommon" data-ax5select="cboCommon" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:80%;" ></div>
						</div>
					</div>
                	<div class="row">
	                    <label class="tit_80 poa">업무후</label>
	                    <div class="ml_80">
							<div id="cboHoli" data-ax5select="cboHoli" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:80%;" ></div>
						</div>
					</div>
				</div>
			</div>
			<!--컨텐츠버튼 S-->
			<div class="row tar">
				<button id="btnReq" class="btn_basic_s">등록</button>
				<button id="btnDel" class="btn_basic_s margin-5-left">폐기</button>
			</div>
			<!--컨텐츠버튼 E-->
		</div>
	</div>

    <div class="row az_board_basic" style="height: 40%;">
    	<div data-ax5grid="notiGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
	</div>
</body>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/configuration/AlertCriteriaTab.js"/>"></script>