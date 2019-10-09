<!--  
	* 화면명: 시스템상세정보
	* 화면호출: 시스템정보 -> 시스템상세정보 클릭
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

        
        
<body style="width: 100% !important; min-width: 0px !important">
	<div class="pop-header">
		<div>
			<label class="margin-5-left">[시스템상세정보]</label>
		</div>
		<div>
			<button type="button" class="close" aria-label="닫기" onclick="popClose()">
				<span aria-hidden="true">&times;</span>
			</button>
		</div> 
	</div>
	<div class="container-fluid pop_wrap">
		<div class="az_search_wrap">
			<div class="az_in_wrap width-100 dib vat">
	            <label id="lbSysMsg" class="tit_60 poa">시스템</label>
	            <div class="ml_60">
			          <input id="txtSysMsg" name="txtSysMsg" type="text" style="width:calc(100% - 80px);" readonly>
				</div>
			    <button id="btnExit" name="btnExit" class="btn_basic_s poa_r">닫기</button>
			</div>		
		</div>
		<div class="tab_wrap">
			<ul class="tabs">
				<li rel="baseTab" id="tab1Li" class="on">시스템기본정보</li>
				<li rel="progTab" id="tab2Li">프로그램유형정보</li>
				<li rel="svrTab" id="tab3Li">서버정보</li>
				<li rel="usrTab" id="tab4Li">계정정보</li>
				<li rel="svrprgTab" id="tab5Li">서버별 프로그램종류 연결정보</li>
				<li rel="dirTab" id="tab6Li">공통디렉토리</li>
			</ul>
		</div>
		<div>
	       	<div id="baseTab" class="tab_content" style="width:100%">
	       		<iframe src='/webPage/tab/sysinfo/SysDetailTab.jsp' width='100%' height='90%' frameborder="0"></iframe>
	       	</div>
	       	<div id="progTab" class="tab_content" style="width:100%">
	       		<iframe src='/webPage/tab/sysinfo/SysDetailPrgTab.jsp' width='100%' height='90%' frameborder="0"></iframe>
	       	</div>
	       	<div id="svrTab" class="tab_content" style="width:100%">
	       		<iframe src='/webPage/tab/sysinfo/SysDetailSvrTab.jsp' width='100%' height='90%' frameborder="0"></iframe>
	       	</div>
	       	<div id="usrTab" class="tab_content" style="width:100%">
	       		<iframe src='/webPage/tab/sysinfo/SysDetailUsrTab.jsp' width='100%' height='90%' frameborder="0"></iframe>
	       	</div>
	       	<div id="svrprgTab" class="tab_content" style="width:100%">
	       		<iframe src='/webPage/tab/sysinfo/SysDetailSvrPrgTab.jsp' width='100%' height='90%' frameborder="0"></iframe>
	       	</div>
	       	<div id="dirTab" class="tab_content" style="width:100%">
	       		<iframe src='/webPage/tab/sysinfo/SysDetailComDirTab.jsp' width='100%' height='90%' frameborder="0"></iframe>
	       	</div>
	   	</div>
	</div>
</body>			
		
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/sysinfo/SysDetailModal.js"/>"></script>