<!--  
	* 화면명: 업무정보 편집
	* 화면호출: 업무정보 -> 새로만들기/편집 클릭
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />


<section>
	<div class="hpanel">
		 <div class="panel-heading">
            <div class="panel-tools width-5">
                <a class="closebox width-100" onclick="popClose('jobUpModal')"><i class="fa fa-times"></i></a>
            </div>
			[업무정보편집]
        </div>
        
        <div class="panel-body">
	       	<div class="row padding-5-top">
	       		<div class="col-xs-3">
		    		<label id="lblSysMsg">업무코드</label>
		    	</div>
		    	<div class="col-xs-9">
		    		<label id="lblSysMsg">업무명</label>
		    	</div>
	       	</div>
	       	<div class="row padding-5-top">
	       		<div class="col-xs-3">
		    		<input id="txtCode" name="txtCode" class="form-control" type="text"></input>
		    	</div>
	       		<div class="col-xs-9">
		    		<input id="txtVal" name="txtVal" class="form-control" type="text"></input>
		    	</div>
	       	</div>
	        
	       	<div class="float-right padding-5-top">
	        	<button class="btn btn-default" id="btnJobUp">
					적용<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
				</button>
	        	<button class="btn btn-default" id="btnJobUpClose">
					취소 <span class="fa fa-times" aria-hidden="true"></span>
				</button>
	       	
	       	</div>
        </div>
	</div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/sysinfo/JobUpModal.js"/>"></script>