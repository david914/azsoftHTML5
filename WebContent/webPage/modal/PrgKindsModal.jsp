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
			[프로그램종류정보]
        </div>
        <div class="panel-body">
			<div class="row">
				<div class="col-sm-4">
					<div class="col-sm-4">
						<label id="lblSysMsg">시스템</label>
					</div>
					<div class="col-sm-8">
						<input id="txtSysMsg" name="txtSysMsg" class="form-control" type="text"></input>
					</div>
					<div class="col-sm-4">
						<label id="lblJawon">프로그램종류</label>
					</div>
					<div class="col-sm-8">
						<div 	id="cboJawon" data-ax5select="cboJawon" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
						</div>
					</div>
					<div class="col-sm-12">
						<label>[처리속성선택]</label>
					</div>
					<div class="col-sm-12">
						<div class="scrollBind" style="height: 495px; border: 1px dotted gray;">
							<ul id="tvInfo" class="ztree"></ul>
						</div>
					</div>
				</div>
				
				<div class="col-sm-8">
					<div class="col-sm-12">
						<input id="empty" class="form-control" type="text" style="visibility: hidden;"></input>
					</div>
					
					<div class="col-sm-3">
						<label id="lblVer">버전관리수</label>
					</div>
					<div class="col-sm-3">
						<input id="txtVer" name="txtVer" class="form-control" type="text"></input>
					</div>
					<div class="col-sm-3">
						<label id="lblTime">정기배포시간</label>
					</div>
					<div class="col-sm-3">
						<input id="txtTime" name="txtTime" class="form-control" type="time" ></input>
					</div>
					
					<div class="col-sm-3">
						<label id="lblExename">대상확장자</label>
					</div>
					<div class="col-sm-9">
						<input id="txtExename" name="txtExename" class="form-control" type="text"></input>
					</div>
					
					<div class="col-sm-3">
						<label id="lblSame">동시적용프로그램종류</label>
					</div>
					<div class="col-sm-7">
						<div 	id="cboSame" data-ax5select="cboSame" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" >
						</div>
					</div>
					<div class="col-sm-2">
						<input type="checkbox" class="checkbox-prg" id="chkCmd" data-label="커맨드사용"  />
					</div>
					
					<div class="col-sm-3">
						<label id="lblBase">동시적용률(기준/경)</label>
					</div>
					<div class="col-sm-4">
						<input id="txtBase" name="txtBase" class="form-control" type="text" ></input>
					</div>
					<div class="col-sm-5">
						<input id="txtChgRule" name="txtChgRule" class="form-control" type="text" ></input>
					</div>
					
					<div class="col-sm-3">
						<label id="lblBaseDir">디렉토리룰(기준/변경)</label>
					</div>
					<div class="col-sm-4">
						<input id="txtBaseDir" name="txtBaseDir" class="form-control" type="text"></input>
					</div>
					<div class="col-sm-5">
						<input id="txtChgDir" name="txtChgDir" class="form-control" type="text" ></input>
					</div>
					
					<div class="col-sm-10">
						<label class="wLabel-left"></label>
						<input id="radioCkOut" tabindex="8" type="radio" name="radioPrg" value="optCkOut" />
						<label for="radioCkOut">실행모듈정보</label>
						<input id="radioCkIn" tabindex="8" type="radio" name="radioPrg" value="optCkIn" checked="checked"/>
						<label for="radioCkIn">동시적용항목정보</label>
						<input id="radioDir" tabindex="8" type="radio" name="radioPrg" value="optDir" />
						<label for="radioDir">자동생성항목정보</label>
						<input id="radioRename" tabindex="8" type="radio" name="radioPrg" value="optRename" />
						<label for="radioRename">확장자변경</label>
					</div>
					<div class="col-sm-2">
						<button class="btn btn-default" id="btnAdd">
							동시등록 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
						</button>
					</div>
					
					<div class="col-sm-12">
						<div data-ax5grid="sameGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 25%;"></div>
					</div>
					
					<div class="col-sm-12">
						<button class="btn btn-default" id="btnReqItem">
							프로그램종류정보등록 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
						</button>
						<button class="btn btn-default" id="btnCls">
							프로그램종류폐기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
						</button>
						<button class="btn btn-default" id="btnQry">
							조회 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
						</button>
						<button class="btn btn-default" id="btnPrgSeq">
							프로그램처리속성트리구조작성 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
						</button>
					</div>
					
					<div class="col-sm-12">
						<label id="lblSysMsg">[등록된 프로그램종류목록]</label>
					</div>
					
					<div class="col-sm-10">
						<div data-ax5grid="prgGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 30%;"></div>
					</div>
					
					<div class="col-sm-2 padding-40-top">
						<div class="col-sm-12">
							<label>우선순위조정</label>
						</div>
						<div class="col-sm-12">
							<button class="btn btn-default" id="btnUp">
								<span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
							</button>
						</div>
						<div class="col-sm-12">
							<button class="btn btn-default" id="btnDown">
								<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
							</button>
						</div>
						<div class="col-sm-12">
							<button class="btn btn-default" id="btnReqSeq">
								우선순위적용 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
							</button>
						</div>
						<div class="col-sm-12">
							<button class="btn btn-default" id="btnExit">
								닫기 <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
							</button>
						</div>
					</div>
				</div>
			</div>        	
        </div>
    </div>
</section>
		
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/PrgKindsModal.js"/>"></script>