<!--  
	* 화면명: 업무정보
	* 화면호출: 시스템정보 -> 업무등록 클릭
-->
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
			[업무정보]
        </div>
        
        <div class="panel-body text-center">
        	<div data-ax5grid="jobGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 85%;"></div>
        </div>
        <div class="panel-body">
        	<div class="float-right">
	        	<button class="btn btn-default" id="btnIn">
					새로만들기<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
				</button>
	        	<button class="btn btn-default" id="btnUp">
					편집<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
				</button>
	        	<button class="btn btn-default" id="btnDel">
					삭제 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
				</button>
	        	<button class="btn btn-default" id="btnClose">
					닫기 <span class="fa fa-times" aria-hidden="true"></span>
				</button>
        	
        	</div>
       	</div>
	</div>
</section>
		
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/sysinfo/JobModal.js"/>"></script>