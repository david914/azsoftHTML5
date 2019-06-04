<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<section>
	<div class="hpanel">
		<div class="panel-heading">
            <div class="panel-tools width-5">
                <a class="closebox width-100" onclick="popClose()"><i class="fa fa-times"></i></a>
            </div>
			[시스템상세정보]
        </div>
        <div class="panel-body">
        	
			<ul class="tabs">
				<label id="lblSysMsg"></label>
		        <li class="active" rel="tab1" id="tab1Li">서버정보</li>
		        <li rel="tab2" id="tab2Li">계정정보</li>
		        <li rel="tab3" id="tab3Li">서버별 프로그램종류 연결정보</li>
		   	</ul>
		   	
		   	<div class="tab_container">
		       	<!-- 서버정보 START -->
		       	<div id="tab1" class="tab_content">
		       		<iframe src='/webPage/modal/sysdetail/SysDetailSvr.jsp' width='100%' height='83%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 서버정보 END -->
		       	
		       	<!-- 계정정보 START -->
		       	<div id="tab2" class="tab_content">
		       		<iframe src='/webPage/modal/sysdetail/SysDetailUsr.jsp' width='100%' height='83%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 계정정보 END -->
		       	
		       	<!-- 서버별 프로그램종류 연결정보 START -->
		       	<div id="tab3" class="tab_content">
					<iframe src='/webPage/modal/sysdetail/SysDetailUsr.jsp' width='100%' height='83%' frameborder="0"></iframe>
		       	</div>
		       	<!-- 서버별 프로그램종류 연결정보 END -->
		   	</div>
        </div>
    </div>
</section>
		
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/SysDetailModal.js"/>"></script>