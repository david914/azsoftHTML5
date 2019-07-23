<!--  
	* 화면명: 정기배포설정
	* 화면호출: 시스템정보 -> 정기배포설정 클릭
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<div class="pop-header">
	<div>
		<label>정기배포설정</label>
	</div>
	<div>
		<button type="button" class="close" aria-label="닫기" onclick="popClose()">
		  <span aria-hidden="true">&times;</span>
		</button>
	</div> 
</div>
<div class="container-fluid pop_wrap">
	<!--line1-->					
	<div class="half_wrap_cb">
		<div class="l_wrap width-30">
	     	<input id="optAll"  type="radio" name="releaseChkS" value="all"/>
			<label for="optAll" >전체</label>
			<input id="optRelease" type="radio" name="releaseChkS" value="release"/>
			<label for="optRelease">정기배포대상</label>
			<input id="optUnRelease" type="radio" name="releaseChkS" value="unRelease"/>
			<label for="optUnRelease">정기배포비대상</label>
		</div>
		<div class="l_wrap width-70">
			<label class="tit_80 poa">시스템</label>
			<div class="ml_80">
				<input id="txtSysMsg" type="text" class="width-80"><button id="btnSearch" class="btn_basic_s margin-5-left poa_r">조회</button>
			</div>
		</div>
	</div>
	<!--line2-->
	<div class="row az_board_basic" style="height: 80%">
		<div data-ax5grid="releaseGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
	</div>
	<div class="row cb">
		<div class="l_wrap width-10">
			<input id="optCheck"  type="radio" name="releaseChk" value="optCheck"/>
			<label for="optCheck" >설정</label>
			<input id="optUnCheck" type="radio" name="releaseChk" value="optUnCheck"/>
			<label for="optUnCheck">해제</label>
		</div>
		<div class="l_wrap width-30">
	     	<input type="checkbox" class="checkbox-rel" id="chkSun" data-label="일"/>
			<input type="checkbox" class="checkbox-rel" id="chkMon" data-label="월"/>
			<input type="checkbox" class="checkbox-rel" id="chkTue" data-label="화"/>
			<input type="checkbox" class="checkbox-rel" id="chkWed" data-label="수"/>
			<input type="checkbox" class="checkbox-rel" id="chkThu" data-label="목"/>
			<input type="checkbox" class="checkbox-rel" id="chkFri" data-label="금"/>
			<input type="checkbox" class="checkbox-rel" id="chkSat" data-label="토"/>
		</div>
		<div class="r_wrap width-60 tar">
			<div class="width-40 dib">
				<label class="tit_80 poa">빌드시간</label>
				<div class="ml_80 dib">
					<input id="txtBuildTime" type="text" class="f-cal"><span class="btn_calendar"><i class="fa fa-clock-o"></i></span>
				</div>
			</div>
			<div class="width-40 dib">
				<label class="tit_80 poa">배포시간</label>
				<div class="ml_80 dib">
					<input id="txtDeployTime" type="text" class="f-cal"><span class="btn_calendar"><i class="fa fa-clock-o"></i></span>
				</div>
			</div>
		</div>
	</div>
	<!--button-->
	<div class="row tac">
		<button id="btnReleaseTimeSet" class="btn_basic">등록</button>
		<button id="btnClose" class="btn_basic margin-5-left">닫기</button>
	</div>
</div>

<!-- 
<section>
	<div class="hpanel">
		 <div class="panel-heading">
            <div class="panel-tools width-5">
                <a class="closebox width-100" onclick="popClose()"><i class="fa fa-times"></i></a>
            </div>
			[정기배포설정]
        </div>
        
        <div class="panel-body">
        	<div class="row">
        		<div class="col-xs-4">
        			<input id="optAll"  type="radio" name="releaseChkS" value="all"/>
					<label for="optAll" >전체</label>
					<input id="optRelease" type="radio" name="releaseChkS" value="release"/>
					<label for="optRelease">정기배포대상</label>
					<input id="optUnRelease" type="radio" name="releaseChkS" value="unRelease"/>
					<label for="optUnRelease">정기배포비대상</label>
        		</div>
        		<div class="col-xs-6">
        			<div class="col-xs-2">
        				<label>시스템</label>
        			</div>
        			<div class="col-xs-10">
        				<input id="txtSysMsg" type='text' class="form-control" />
        			</div>
    		     </div>
        		<div class="col-xs-2">
        			<button class="btn btn-default float-right" id="btnSearch">조회</button>
        		</div>
        	</div>
        	<div class="row">
        		<div class="col-xs-12">
        			<div data-ax5grid="releaseGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 80%;"></div>
        		</div>
        	</div>
        </div>
        <div class="panel-body">
        	<div class="row">
	        	<div class="col-xs-5">
		        	<input id="optCheck"  type="radio" name="releaseChk" value="optCheck"/>
					<label for="optCheck" >설정</label>
					<input id="optUnCheck" type="radio" name="releaseChk" value="optUnCheck"/>
					<label for="optUnCheck">해제</label>
					<input type="checkbox" class="checkbox-rel" id="chkSun" data-label="일"/>
					<input type="checkbox" class="checkbox-rel" id="chkMon" data-label="월"/>
					<input type="checkbox" class="checkbox-rel" id="chkTue" data-label="화"/>
					<input type="checkbox" class="checkbox-rel" id="chkWed" data-label="수"/>
					<input type="checkbox" class="checkbox-rel" id="chkThu" data-label="목"/>
					<input type="checkbox" class="checkbox-rel" id="chkFri" data-label="금"/>
					<input type="checkbox" class="checkbox-rel" id="chkSat" data-label="토"/>
	        	</div>
				
				<div class="col-xs-5">
					<div class="col-xs-2 no-padding">
						<label id="lblTime" >빌드시간</label>
					</div>
					<div class="col-xs-4 no-padding">
						<div class='input-group date'>
			    			<input id="txtBuildTime" type='text' class="form-control" />
			                 <span class="input-group-addon">
			                     <span class="glyphicon glyphicon-time"></span>
			                 </span>
			    		</div>
					</div>
					<div class="col-xs-2 no-padding">
						<label id="lblTime" >배포시간</label>
					</div>
					<div class="col-xs-4 no-padding">
						<div class='input-group date'>
			    			<input id="txtDeployTime" type='text' class="form-control" />
			                 <span class="input-group-addon">
			                     <span class="glyphicon glyphicon-time"></span>
			                 </span>
			    		</div>
					</div>
				</div>			        	
				        	
	        	<div class="col-xs-2">
	        		<div class="float-right">
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
	</div>
</section>
 -->
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/modal/sysinfo/ReleaseTimeSetModal.js"/>"></script>