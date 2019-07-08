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
			[시스템정보복사]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-sm-2">
					<label id="lblSys">시스템[From]</label>
				</div>
				<div class="col-sm-5">
					<div 	id="cboSys" data-ax5select="cboSys" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
					</div>
				</div>
				<div class="col-sm-5">
					<label>시스템속성은 선택한 내용 그대로 복사됩니다.</label>
				</div>
			</div>
			
			<div class="row">
				<div class="col-sm-4">
					<label>[시스템-To]</label>
					<div class="float-right">
						<input type="checkbox" class="checkbox-all" id="chkAllToSys" data-label="전체선택"  />
					</div>
				</div>
				<div class="col-sm-4">
					<label>[시스템속성]</label>
					<div class="float-right">
						<input type="checkbox" class="checkbox-all" id="chkCopy" data-label="복사" checked="checked" />
						<input type="checkbox" class="checkbox-all" id="chkAllProp" data-label="전체선택"  />
					</div>
				</div>
				<div class="col-sm-4">
					<label>[프로그램종류]</label>
					<div class="float-right">
						<input type="checkbox" class="checkbox-all" id="chkAllPrg" data-label="전체선택"  />
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-sm-4">
					<div class="scrollBind" style="height: 280px; border: 1px dotted gray;">
						<ul class="list-group" id="ulToSys">
	    				</ul>
					</div>
				</div>
				<div class="col-sm-4">
					<div class="scrollBind" style="height: 280px; border: 1px dotted gray;">
						<ul class="list-group" id="ulProp">
	    				</ul>
					</div>
				</div>
				<div class="col-sm-4">
					<div class="scrollBind" style="height: 280px; border: 1px dotted gray;">
						<ul class="list-group" id="ulPrg">
	    				</ul>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-sm-8">
					<label id="lblSysMsg">[시스템상세정보]</label>
				</div>
				<div class="col-sm-4">
					<label id="lblSysMsg">[공통디렉토리]</label>
				</div>
			</div>
			
			<div class="row">
				<div class="col-sm-8">
					<div data-ax5grid="detailGrid" data-ax5grid-config="{showLineNumber: false , lineNumberColumnWidth: 40}" style="height: 43%;"></div>
				</div>
				<div class="col-sm-4">
					<div data-ax5grid="dirGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 43%;"></div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-sm-10">
					<input type="checkbox" class="checkbox-all" id="chkItem" data-label="선택한 서버에 대한 형상항목 연결정보도 복사합니다."  checked="checked"/>
					<input type="checkbox" class="checkbox-all" id="chkMonitor" data-label="선택한 시스템에 대한 모니터링 체크리스트도 복사합니다." checked="checked"/>
				</div>
				<div class="col-sm-2">
					<button class="btn btn-default" id="btnReq">
						복사<span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
					</button>
					<button class="btn btn-default" id="btnExit">
						닫기<span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
					</button>
				</div>
			</div>
        </div>
    </div>
</section>

<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/sysinfo/SysCopyModal.js"/>"></script>

