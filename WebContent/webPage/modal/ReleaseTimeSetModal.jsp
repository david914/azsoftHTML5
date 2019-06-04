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
        	
        	<input id="optCheck"  type="radio" name="releaseChk" value="optCheck"/>
			<label for="optCheck" tooltip="정기배포 전체설정" flow="down">전체설정</label>
			<input id="optUnCheck" type="radio" name="releaseChk" value="optUnCheck"/>
			<label for="optUnCheck" class="margin-35-right" tooltip="정기배포 전체해제" flow="down">전체해제</label>
        	
        	<label id="lblTime" >배포시간</label>
        	<input id="txtTime" name="time" class="ecams-input margin-40-right" type="time" ></input>        	
        	
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
</section>
		
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/ReleaseTimeSetModal.js"/>"></script>