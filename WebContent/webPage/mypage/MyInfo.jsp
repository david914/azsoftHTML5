<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">
	<div id="history_wrap">기본관리<strong>&gt; 내 기본정보 보기</strong></div>
	
	<div class="az_search_wrap">
		<div class="az_in_wrap checkout_tit">
			<div class="sm-row vat cb">	
                   <!--cell1-->
                   <div class="width-25 float-left">
                   	<div class="margin-10-right">
                    	<div>
	                    	<label class="tit_80 poa">사원번호</label>
	                        <div class="ml_80">
								<input id="txtUserId" type="text" class="width-100" readonly>
								<div class="sm-row">
									<input id="optManCheck"  type="radio" name="userRadioMan"  value="man" disabled/>
									<label for="optManCheck" >직원</label>
									<input id="optOutCheck" type="radio"  name="userRadioMan"  value="outSour" disabled/>
									<label for="optOutCheck">외주직원</label>
								</div>
							</div>
						</div>
                    	<div class="sm-row">
	                    	<label id="lbUser" class="tit_80 poa">소속조직</label>
	                        <div class="ml_80">
								<input id="txtOrg" name="txtOrg" type="text" class="width-100" readonly>
							</div>
						</div>
                    	<div class="sm-row">
	                    	<label id="lbUser" class="tit_80 poa">소속(겸직)</label>
	                        <div class="ml_80">
								<input id="txtOrgAdd" name="txtOrgAdd" type="text" class="width-100" readonly>
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
								<input id="txtUserName" name="txtUserName" type="text" class="width-100" readonly>
								<div class="sm-row">
									<input type="checkbox" class="checkbox-user" id="chkManage" data-label="시스템관리자" disabled/>
								</div>
								<div class="sm-row">
									<input type="checkbox" class="checkbox-user" id="chkHand" data-label="동기화제외사용자" disabled/>
								</div>
							</div>
						</div>
                    	<div class="sm-row">
	                    	<label id="lbUser" class="tit_80 poa">계정생성일시</label>
	                        <div class="ml_80">
								<input id="txtCreatdt" name="txtCreatdt" type="text" class="width-100" readonly>
							</div>
						</div>
					</div>
				</div>	
                   <div class="width-25 float-left">
                   	<div class="margin-10-right">
                    	<div>
                        	<label class="tit_80 poa">직급</label>
	                        <div class="ml_80 tal">
								<div id="cboPosition" data-ax5select="cboPosition" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
							</div>
						</div>
                    	<div class="sm-row">
	                    	<label id="lbUser" class="tit_80 poa">IP Address</label>
	                        <div class="ml_80">
								<input id="txtIp" name="txtIp" type="text" class="width-100" readonly>
							</div>
						</div>
                    	<div class="sm-row">
	                    	<label id="lbUser" class="tit_80 poa">전화번호1</label>
	                        <div class="ml_80">
								<input id="txtTel1" name="txtTel1" type="text" class="width-100" readonly>
							</div>
						</div>
                    	<div class="sm-row">
	                    	<label id="lbUser" class="tit_80 poa">최종로그인</label>
	                        <div class="ml_80">
								<input id="txtLogin" name="txtLogin" type="text" class="width-100" readonly>
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
                    	<div class="sm-row">
	                    	<label id="lbUser" class="tit_80 poa">E-mail</label>
	                        <div class="ml_80">
								<input id="txtEMail" name="txtEMail" type="text" class="width-100" readonly>
							</div>
						</div>
                    	<div class="sm-row">
	                    	<label id="lbUser" class="tit_80 poa">전화번호2</label>
	                        <div class="ml_80">
								<input id="txtTel2" name="txtTel2" type="text" class="width-100" readonly>
							</div>
						</div>
					</div>
				</div>	
			</div>	
		</div>
	</div>    
	
	<div class="cb">
		<!--부재등록정보-->
		<div class="float-left width-25">
			<div class="margin-10-right">
				<div>
					<label class="title">부재등록정보</label>
				</div>
				<div class="sm-row">
                   	<label class="tit_80 poa">대결지정</label>
                       <div class="ml_80">
						<input id="txtDaeGyul" name="txtDaeGyul" type="text" class="width-100" readonly>
					</div>
				</div>
				<div class="sm-row">
                   	<label id="lbUser" class="tit_80 poa">부재기간</label>
                       <div class="ml_80">
						<input id="txtBlankTerm" name="txtBlankTerm" type="text" class="width-100" readonly>
					</div>
				</div>
				<div class="sm-row">
                   	<label class="tit_80 poa">부재사유</label>
                       <div class="ml_80">
                       	<textarea id="txtBlankSayu" class="width-100" rows="8" style="padding: 12px 20px; box-sizing: border-box; border: 1px solid #ddd; background-color: #fff; font-size: 12px;" readonly></textarea>
					</div>
				</div>
			</div>
		</div>
		<!--담당직무-->
		<div class="float-left width-25">
			<div class="margin-10-right">
				<div>
					<label class="title">담당직무</label>
				</div>
				<div class="scrollBind sm-row" style="height:200px;">
					<ul class="list-group" id="ulDutyInfo"></ul>
				</div>
			</div>
		</div>
		<!--등록된담당업무-->
		<div class="float-left width-50">
			<div class="margin-10-right">
				<div>
					<label class="title">담당업무</label>
				</div>
				<div class="az_board_basic az_board_basic_in sm-row" style="height: 200px;">
			    	<div data-ax5grid="jobGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>	
				</div>
			</div>
		</div>
	</div>
	<div class="cb">
		<!--개발중인 프로그램목록-->
		<div class="float-left width-100">
			<div class="margin-10-right margin-10-top">
				<div>
					<label class="title">현재 개발중인 프로그램목록</label>
				</div>
				<div class="az_board_basic az_board_basic_in sm-row" style="height: 45%;">
			    	<div data-ax5grid="pgmGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>	
				</div>
			</div>
		</div>
	</div>
</div>
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="itemid"/>
	<input type="hidden" name="user"/>
</form>


<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/mypage/MyInfo.js"/>"></script>