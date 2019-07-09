<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:import url="/webPage/common/common.jsp" />

<div id="header"></div>

<!-- contener S -->
<div id="wrapper">
    <div class="content">
        <!-- history S-->
        <div id="history_wrap">관리자 <strong>&gt; 사용자정보</strong></div>
        <!-- history E-->
        <!-- 검색 S-->
		<div class="az_search_wrap">
			<div class="az_in_wrap checkout_tit">
				<div class="row vat cb">	
                    <!--cell1-->
                    <div class="width-25 float-left">
                    	<div class="margin-10-right">
	                    	<div>
		                    	<label class="tit_80 poa">사원번호</label>
		                        <div class="ml_80">
									<input id="txtUserId" type="text" class="width-100">
									<div class="row">
										<input id="optManCheck"  type="radio" name="userRadioMan"  value="man"/>
										<label for="optManCheck" >직원</label>
										<input id="optOutCheck" type="radio"  name="userRadioMan"  value="outSour"/>
										<label for="optOutCheck">외주직원</label>
									</div>
								</div>
							</div>
	                    	<div class="row">
		                    	<label id="lbUser" class="tit_80 poa">소속조직</label>
		                        <div class="ml_80">
									<input id="txtOrg" name="txtOrg" type="text" class="width-100">
								</div>
							</div>
	                    	<div class="row">
		                    	<label id="lbUser" class="tit_80 poa">소속(겸직)</label>
		                        <div class="ml_80">
									<input id="txtOrgAdd" name="txtOrgAdd" type="text" class="width-100">
								</div>
							</div>
						</div>
					</div>
                    <!--cell2-->
                    <div class="width-25 float-left">
                    	<div class="margin-10-right">
	                    	<div>
		                    	<label id="lbUser" class="tit_80 poa">성명</label>
		                        <div class="ml_80">
									<input id="txtUserName" name="txtUserName" type="text" class="width-100">
									<div class="row">
										<input type="checkbox" class="checkbox-user" id="chkManage" data-label="시스템관리자"/>
									</div>
									<div class="row">
										<input type="checkbox" class="checkbox-user" id="chkHand" data-label="동기화제외사용자"/>
									</div>
								</div>
							</div>
	                    	<div class="row">
		                    	<label id="lbUser" class="tit_80 poa">최종로그인</label>
		                        <div class="ml_80">
									<input id="txtLogin" name="txtLogin" type="text" class="width-100">
								</div>
							</div>
						</div>
					</div>	
                    <div class="width-25 float-left">
                    	<div class="margin-10-right">
	                    	<div>
	                        	<label class="tit_80 poa">직급</label>
		                        <div class="ml_80 tal">
									<div id="cboPosition" data-ax5select="cboPosition" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
								</div>
							</div>
	                    	<div class="row">
		                    	<label id="lbUser" class="tit_80 poa">IP Address</label>
		                        <div class="ml_80">
									<input id="txtIp" name="txtIp" type="text" class="width-100">
								</div>
							</div>
	                    	<div class="row">
		                    	<label id="lbUser" class="tit_80 poa">전화번호1</label>
		                        <div class="ml_80">
									<input id="txtTel1" name="txtTel1" type="text" class="width-100">
								</div>
							</div>
	                    	<div class="row">
		                    	<label id="lbUser" class="tit_80 poa">*전화번호2</label>
		                        <div class="ml_80">
									<input id="txtTel2" name="txtTel2" type="text" class="width-100">
								</div>
							</div>
						</div>
					</div>
                    <div class="width-25 float-left">
                    	<div class="margin-10-right">
	                    	<div>
	                        	<label id="lbUser" class="tit_80 poa">직위</label>
		                        <div class="ml_80 tal">
		                        	<div id="cboDuty" data-ax5select="cboDuty" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
								</div>
							</div>
	                    	<div class="row">
		                    	<label id="lbUser" class="tit_80 poa">E-mail</label>
		                        <div class="ml_80">
									<input id="txtEMail" name="txtEMail" type="text" class="width-100">
								</div>
							</div>
	                    	<div class="row">
		                    	<label id="lbUser" class="tit_80 poa">비번오류횟수</label>
		                        <div class="ml_80">
									<input id="txtErrCnt" name="txtErrCnt" type="text" class="width-100">
								</div>
							</div>
	                    	<div class="row">
		                    	<label id="lbUser" class="tit_80 poa">활성여부</label>
		                        <div class="ml_80">
									<input id="optActCheck"  type="radio" name="userRadio" value="active"/>
									<label for="optActCheck" >사용자 활성화</label>
									<input id="optDiCheck" type="radio" name="userRadio" value="disable"/>
									<label for="optDiCheck" >사용자 비활성화</label>
								</div>
							</div>
						</div>
					</div>	
				</div>	
			</div>
		</div>    
        <!-- 검색 E-->
        <!-- 리스트 S-->
        <div class="cb">
        	<!--담당직무-->
			<div class="float-left width-25">
				<div class="margin-10-right">
					<div>
						<label class="title">[담장직무]</label>
					</div>
					<div class="scrollBind row" style="height:550px;">
						<ul class="list-group" id="ulDutyInfo"></ul>
					</div>
				</div>
			</div>
        	<!--담당업무추가-->
			<div class="float-left width-25">
				<div class="margin-10-right">
					<div>
						<label class="title">[담당업무추가]</label>
					</div>
	            	<div class="row">
	                	<label class="tit_80 poa">시스템</label>
	                    <div class="ml_80 tal">
							<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
						</div>
					</div>
					<div class="por">
						<label class="dib">업무</label>
						<div class="poa_r">
							<input type="checkbox" class="checkbox-user" id="chkAllJob" data-label="전체선택"/>
						</div>
					</div>
					<div class="scrollBind" style="height:500px;">
						<ul class="list-group" id="ulJobInfo"></ul>
					</div>
				</div>
			</div>
			<div class="float-left width-50">
				<div class="cb">
					<!--부재등록정보-->
					<div class="float-left width-50">
						<div class="margin-5-right">
							<label class="title">부재등록정보</label>
							<div class="row">
		                    	<label class="tit_80 poa">대결지정</label>
		                        <div class="ml_80">
									<input id="txtDaeGyul" name="txtDaeGyul" type="text" class="width-100">
								</div>
							</div>
							<div class="row">
		                    	<label id="lbUser" class="tit_80 poa">부재기간</label>
		                        <div class="ml_80">
									<input id="txtBlankTerm" name="txtBlankTerm" type="text" class="width-100">
								</div>
							</div>
							<div class="row">
		                    	<label class="tit_80 poa">부재사유</label>
		                        <div class="ml_80">
		                        	<textarea id="txtBlankSayu" class="width-100" rows="8" style="border: 1px solid #ddd;"></textarea>
								</div>
							</div>
						</div>
					</div>
					<!--사용자조회결과-->
					<div class="float-left width-50">
						<div>
							<label class="title">사용자조회결과</label>
							<div class="az_board_basic az_board_basic_in row" style="height: 193px;">
						    	<div data-ax5grid="userGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%;"></div>	
							</div>
						</div>
					</div>
				</div>
				<div class="row dib width-100">
					<!--등록된담당업무 S-->
					<div>
						<label class="title">등록된담당업무</label>
						<button class="btn_basic_s float-right" id="btnDelJob">담당업무삭제</button>
						<div class="az_board_basic az_board_basic_in row" style="height: 312px;">
					    	<div data-ax5grid="jobGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>	
						</div>
					</div>		
					<!--등록된담당업무 E-->			
				</div>
			</div>
		</div>
        <!-- 리스트 E-->                  
        <!-- 페이지버튼 S-->
        <div class="row tar dib width-100">
			<button class="btn_basic" id="btnQryRgtCd">사용자직무조회</button>
			<button class="btn_basic" id="btnSignUp">사용자일괄등록</button>
			<button class="btn_basic" id="btnDept">조직정보등록</button>
			<button class="btn_basic" id="btnJobCopy">권한복사</button>
			<button class="btn_basic" id="btnPassInit">비밀번호초기화</button>
			<button class="btn_basic" id="btnSetJob">업무권한일괄등록</button>
			<button class="btn_basic" id="btnAllUser">전체사용자조회</button>
			<button class="btn_basic" id="btnSave">저장</button>
			<button class="btn_basic" id="btnDel">폐기</button>
		</div>
		<!-- 페이지버튼 E-->
	</div>
</div>

<!-- 
<div class="row">
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>사원번호</label>
		</div>
		<div class="col-sm-9">
			<input id="txtUserId" name="txtUserId" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>성명</label>
		</div>
		<div class="col-sm-9">
			<input id="txtUserName" name="txtUserName" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>직급</label>
		</div>
		<div class="col-sm-9">
			<div id="cboPosition" data-ax5select="cboPosition" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>직위</label>
		</div>
		<div class="col-sm-9">
			<div id="cboDuty" data-ax5select="cboDuty" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-3">
		<input id="optManCheck"  type="radio" name="userRadioMan"  value="man"/>
		<label for="optManCheck" >직원</label>
		<input id="optOutCheck" type="radio"  name="userRadioMan"  value="outSour"/>
		<label for="optOutCheck">외주직원</label>
	</div>
	<div class="col-sm-3">
		<input type="checkbox" class="checkbox-user" id="chkManage" data-label="시스템관리자"/>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>IP Address</label>
		</div>
		<div class="col-sm-9">
			<input id="txtIp" name="txtIp" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>E-mail</label>
		</div>
		<div class="col-sm-9">
			<input id="txtEMail" name="txtComp" class="form-control" type="text"></input>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>소속조직</label>
		</div>
		<div class="col-sm-9">
			<input id="txtOrg" name="txtOrg" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<input type="checkbox" class="checkbox-user" id="chkHand" data-label="동기화제외사용자"/>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>전화번호1</label>
		</div>
		<div class="col-sm-9">
			<input id="txtTel1" name="txtTel1" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>비밀번호오류횟수</label>
		</div>
		<div class="col-sm-9">
			<input id="txtErrCnt" name="txtErrCnt" class="form-control" type="text"></input>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>소속(겸직)</label>
		</div>
		<div class="col-sm-9">
			<input id="txtOrgAdd" name="txtOrgAdd" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>최종로그인</label>
		</div>
		<div class="col-sm-9">
			<input id="txtLogin" name="txtLogin" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>*전화번호2</label>
		</div>
		<div class="col-sm-9">
			<input id="txtTel2" name="txtTel2" class="form-control" type="text"></input>
		</div>
	</div>
	<div class="col-sm-3">
		<input id="optActCheck"  type="radio" name="userRadio" value="active"/>
		<label for="optActCheck" >사용자 활성화</label>
		<input id="optDiCheck" type="radio" name="userRadio" value="disable"/>
		<label for="optDiCheck" >사용자 비활성화</label>
	</div>
</div>

<div class="row">
	<div class="col-sm-3">
		<label>담당직무</label>
	</div>
	<div class="col-sm-3">
		<label>담당업무추가</label>
	</div>
	<div class="col-sm-3">
		<label>부재등록정보</label>
	</div>
	<div class="col-sm-3">
		<label>사용자조회결과</label>
	</div>
</div>

<div class="row">
	<div class="col-sm-3">
		<div class="scrollBind" style="height: 65%; border: 1px dotted gray;;">
  			<ul class="list-group" id="ulDutyInfo"></ul>
 		</div>
	</div>
	<div class="col-sm-3">
		<div class="col-sm-3">
			<label>시스템</label>
		</div>
		<div class="col-sm-9">
			<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
		</div>
		<div class="col-sm-3">
			<label>업무</label>
		</div>
		<div class="col-sm-9">
			<input type="checkbox" class="checkbox-user" id="chkAllJob" data-label="전체선택"/>
		</div>
		<div class="col-sm-12">
			<div class="scrollBind" style="height: 60%; border: 1px dotted gray;;">
	  			<ul class="list-group" id="ulJobInfo"></ul>
	 		</div>
		</div>
	</div>
	
	<div class="col-sm-6">
		<div class="col-sm-6">
			<div class="col-sm-4">
				<label>대결지정</label>
			</div>
			<div class="col-sm-8">
				<input id="txtDaeGyul" name="txtDaeGyul" class="form-control" type="text"></input>
			</div>
			<div class="col-sm-4">
				<label>부재기간</label>
			</div>
			<div class="col-sm-8">
				<input id="txtBlankTerm" name="txtBlankTerm" class="form-control" type="text"></input>
			</div>
			<div class="col-sm-4">
				<label>부재사유</label>
			</div>
			<div class="col-sm-8">
				<textarea id="txtBlankSayu" rows="2" cols="35"></textarea>
			</div>
		</div>
		<div class="col-sm-6">
			<div class="col-sm-12">
				<div data-ax5grid="userGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 20%;"></div>
			</div>
		</div>
		<div class="col-sm-12">
			<div class="col-sm-8">
				<label>등록된 담당업무</label>
			</div>
			<div class="col-sm-4">
				<button class="btn btn-default float-right" id="btnDelJob">담당업무삭제</button>
			</div>
		</div>
		<div class="col-sm-12">
			<div data-ax5grid="jobGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 35%;"></div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-12">
		<div class="float-right">
			<button class="btn btn-default" id="btnQryRgtCd">사용자직무조회</button>
			<button class="btn btn-default" id="btnSignUp">사용자일괄등록</button>
			<button class="btn btn-default" id="btnDept">조직정보등록</button>
			<button class="btn btn-default" id="btnJobCopy">권한복사</button>
			<button class="btn btn-default" id="btnPassInit">비밀번호초기화</button>
			<button class="btn btn-default" id="btnSetJob">업무권한일괄등록</button>
			<button class="btn btn-default" id="btnAllUser">전체사용자조회</button>
			<button class="btn btn-default" id="btnSave">저장</button>
			<button class="btn btn-default" id="btnDel">폐기</button>
		</div>
	</div>
</div>
 -->
<form name="popPam">
	<input type="hidden" name="userId"/>
</form>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript"	src="<c:url value="/js/ecams/administrator/UserInfo.js"/>"></script>