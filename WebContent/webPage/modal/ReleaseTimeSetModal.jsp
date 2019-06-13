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
			[정기배포 일괄등록]
        </div>
        
        <div class="panel-body text-center">
        	<div data-ax5grid="releaseGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 85%;"></div>
        </div>
        <div class="panel-body">
        	<div class="row">
	        	<div class="col-xs-4">
		        	<input id="optCheck"  type="radio" name="releaseChk" value="optCheck"/>
					<label for="optCheck" >전체설정</label>
					<input id="optUnCheck" type="radio" name="releaseChk" value="optUnCheck"/>
					<label for="optUnCheck" class="margin-35-right" >전체해제</label>
	        	</div>
				        	
				<div class="col-xs-1 no-padding">
		        	<label id="lblTime" >배포시간</label>
				</div>			        	
				<div class="col-xs-3 no-padding">
		        	<div class='input-group date'>
		    			<input id="txtTime" type='text' class="form-control" />
		                 <span class="input-group-addon">
		                     <span class="glyphicon glyphicon-time"></span>
		                 </span>
		    		</div>
				</div>			        	
	        	
	        	<div class="col-xs-4 no-padding">
		        	<button class="btn btn-default" id="btnSearch">
						조회<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
					</button>
		        	<button class="btn btn-default" id="btnReleaseTimeSet">
						등록 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
					</button>
		        	<button class="btn btn-default" id="btnClose">
						닫기 <span class="fa fa-times" aria-hidden="true"></span>
					</button>
	        	</div>
        	</div>
       	</div>
	</div>
</section>
		
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/ReleaseTimeSetModal.js"/>"></script>