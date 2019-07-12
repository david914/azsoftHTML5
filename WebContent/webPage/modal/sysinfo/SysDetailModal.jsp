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
			<label>[시스템상세정보]</label>
		</div>
		<div>
			<button type="button" class="close" aria-label="닫기" onclick="popClose()">
				<span aria-hidden="true">&times;</span>
			</button>
		</div> 
	</div>
	<div class="container-fluid pop_wrap">
		<div class="tab_wrap">
			<ul class="tabs">
				<li rel="svrTab" id="tab1Li" class="on">서버정보</li>
				<li rel="usrTab" id="tab2Li">계정정보</li>
				<li rel="prgTab" id="tab3Li">서버별 프로그램종류 연결정보</li>
			</ul>
		</div>
		<div>
	       	<div id="svrTab" class="tab_content2" style="width:100%">
	       		<iframe src='/webPage/tab/sysinfo/SysDetailSvrTab.jsp' width='100%' height='83%' frameborder="0"></iframe>
	       	</div>
	       	<div id="usrTab" class="tab_content2" style="width:100%">
	       		<iframe src='/webPage/tab/sysinfo/SysDetailUsrTab.jsp' width='100%' height='83%' frameborder="0"></iframe>
	       	</div>
	       	<div id="prgTab" class="tab_content2" style="width:100%">
	       		<iframe src='/webPage/tab/sysinfo/SysDetailPrgTab.jsp' width='100%' height='83%' frameborder="0"></iframe>
	       	</div>
	   	</div>
	</div>
</body>
        
        
        
			
		
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/sysinfo/SysDetailModal.js"/>"></script>