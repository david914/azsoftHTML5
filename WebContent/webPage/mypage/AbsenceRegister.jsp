<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />

<div class="contentFrame">

	<div id="history_wrap">기본관리 <strong>&gt; 부재등록</strong></div>
	       
	<div class="padding-40-top">
		<div id="opt">
			<input id="optReg"  type="radio" name="radio" value="reg"/>
			<label for="optReg">등록</label>
			<input id="optUnReg" type="radio" name="radio" value="unReg"/>
			<label for="optUnReg">해제</label>
		</div>
	</div>
       
	<div id="divContent">
		<div class="row">
			<label class="tit_60 dib poa">부 재 자</label>
			<div class="ml_60">
				<input id="txtUser" name="txtUser" class="width-100">
				<div id="cboUser" data-ax5select="cboUser" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div>
			</div>
		</div>
		<div class="row">
			<label class="tit_60 dib poa">대결재자</label>
			<div class="ml_60">
				<input id="txtName" name="txtName" class="width-100">
				<div id="cboDaeSign" data-ax5select="cboDaeSign" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div>
			</div>
		</div>
		<div class="row">
			<label class="tit_60 dib poa">부재사유</label>
			<div class="ml_60">
				<div id="cboSayu" data-ax5select="cboSayu" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div>
				<textarea id="txtSayu" name="txtSayu"  class="width-100" rows="4" cols="75" style="padding: 12px 20px; box-sizing: border-box; border: 1px solid #ddd; background-color: #fff; font-size: 12px;">
				</textarea>
			</div>
		</div>
		<div class="row">
			<label class="tit_60 dib poa">부재기간</label>
			<div class="ml_60">
				<label id="lbFrom">FROM</label>
				<div data-ax5picker="datStD" class="dib width-100">
					<input id="datStD" type="text" class="f-cal" autocomplete="off">
					<span class="btn_calendar" style="margin-left: -5px;"><i class="fa fa-calendar-o"></i></span>
				</div>
				
				<label id="lbTo">TO</label>
				<div data-ax5picker="datEdD" class="dib width-100">
					<input id="datEdD" type="text" class="f-cal" autocomplete="off">
					<span class="btn_calendar" style="margin-left: -5px;"><i class="fa fa-calendar-o"></i></span>
				</div>
			</div>
		</div>
		<div class="ab_register sm-row">
			<div class="az_board_basic margin-10-top" style="height: 20%;">
				<div data-ax5grid="absGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%"></div>
			</div>
		</div>
	</div>
	    
	<div id="divPw" class="margin-15-top" style="text-align:center">
		<button id="btnReg" name="btnReg" class="btn_basic">등록</button>
	</div>

</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/mypage/AbsenceRegister.js"/>"></script>