<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
	<!-- history S-->
	<div id="history_wrap">관리자 <strong>&gt; 환경설정</strong></div>
	<!-- history E-->         
    
    <!-- 검색 S-->    
	<div class="az_search_wrap">
		<div class="az_in_wrap por">
			<!-- cell1 -->		
               <div class="width-25 dib vat">
               	<div>
                    <label class="tit_150 poa">IP Address(내부망)</label>
                    <div class="ml_150">
						<input id="txtIpIn" type="text" class="width-100">
					</div>
				</div>
               	<div class="row">
                    <label class="tit_150 poa">IP Address(외부망)</label>
                    <div class="ml_150">
						<input id="txtIpOut" type="text" class="width-100">
					</div>
				</div>
               	<div class="row">
                    <label class="tit_150 poa">PORT</label>
                    <div class="ml_150">
						<input id="txtPort" type="text" class="width-100">
					</div>
				</div>
			</div>
			<!-- cell2 -->		
               <div class="width-25 dib vat">
               	<div class="margin-5-left">
                	<div>
	                    <label class="tit_150 poa">비밀번호변경주기</label>
	                    <div class="ml_150 por">
							<input id="txtPassCycle" type="text" class="width-45 dib">
		                    <div class="poa_r width-50 dib">
								<div id="cboPassCycle" data-ax5select="cboPassCycle" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-100" ></div>
							</div>
						</div>
					</div>
                	<div class="row">
	                    <label class="tit_150 poa">비밀번호입력제한횟수</label>
	                    <div class="ml_150">
							<input id="txtPassLimit" type="text" class="width-100">
						</div>
					</div>
                	<div class="row">
	                    <label class="tit_150 poa">이전비밀번호보관횟수</label>
	                    <div class="ml_150">
							<input id="txtPassNum" type="text" class="width-100">
						</div>
					</div>
				</div>
			</div>
			<!-- cell3 -->		
               <div class="width-25 dib vat">
               	<div class="margin-5-left">
                	<div>
	                    <label class="tit_150 poa">초기비밀번호</label>
	                    <div class="ml_150">
							<input id="txtInitPass" type="text" class="width-100">
						</div>
					</div>
                	<div class="row">
	                    <label class="tit_150 poa">관리자용비밀번호</label>
	                    <div class="ml_150">
							<input id="txtAdminPass" type="text" class="width-100">
						</div>
					</div>
                	<div class="row">
	                    <label class="tit_150 poa">사용금지특수문자</label>
	                    <div class="ml_150">
							<input id="txtSpc" type="text" class="width-100">
						</div>
					</div>
				</div>
			</div>
			<!-- cell4 -->		
               <div class="width-25 dib vat">
               	<div class="margin-5-left">
                	<div>
	                    <label class="tit_150 poa">미사용ID잠금기준일</label>
	                    <div class="ml_150">
							<input id="txtLockBaseDt" type="text" class="width-100">
						</div>
					</div>
                	<div class="row">
	                    <label class="tit_150 poa">로그인이력보관기간</label>
	                    <div class="ml_150">
							<input id="txtLoginHis" type="text" class="width-100">
						</div>
					</div>
                	<div class="row">
	                    <label class="tit_150 poa">프로세스총갯수</label>
	                    <div class="ml_150">
							<input id="txtProcTot" type="text" class="width-100">
						</div>
					</div>
				</div>
			</div>
			<!--컨텐츠버튼 S-->
			<div class="row tar">
				<button id="btnReq" class="btn_basic_s margin-5-left">환경설정등록</button>
			</div>
			<!--컨텐츠버튼 E-->
		</div>
	</div>
    <!-- 검색 E-->
    <!-- tab S-->
    <div class="tab_wrap">
		<ul class="tabUl">
			<li class="on" rel="tab1" id="tab1Li">운영시간관리</li>
	        <li rel="tab2" id="tab2Li">삭제기준관리</li>
	        <li rel="tab3" id="tab3Li">디렉토리정책</li>
	        <li rel="tab4" id="tab4Li">작업서버정보</li>
	        <li rel="tab5" id="tab5Li">알림기준정보</li>
	        <li rel="tab6" id="tab6Li">SR유형관리</li>
		</ul>
	</div>
	<!-- tab E-->
	
	
	<!-- tab E-->			
	<div style="height:72%"> <!--  tab_container -->
		<div id="tab1" class="tab_content">
       		<iframe src='/webPage/tab/configuration/OperTimeManageTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
       	</div>
       	<div id="tab2" class="tab_content">
       		<iframe src='/webPage/tab/configuration/DelCriteriaManageTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
       	</div>
       	<div id="tab3" class="tab_content">
       		<iframe src='/webPage/tab/configuration/DirectoryPolicyTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
       	</div>
       	<div id="tab4" class="tab_content">
       		<iframe src='/webPage/tab/configuration/JobServerInfoTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
       	</div>
       	<div id="tab5" class="tab_content">
       		<iframe src='/webPage/tab/configuration/AlertCriteriaTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
       	</div>
       	<div id="tab6" class="tab_content">
       		<iframe src='/webPage/tab/configuration/SRTypeManageTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
       	</div>
   	</div>
</div>

 <c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/Configuration.js"/>"></script>