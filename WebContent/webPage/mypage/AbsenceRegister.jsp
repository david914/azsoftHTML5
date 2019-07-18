<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />


<div id="wrapper">
	<!-- Header -->
    <div class="content">
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
        	<div class="ab_register row">
        		<div>
                    <label id="lbUser">부 재 자</label>
                </div>
                <div>
					<input id="txtUser" name="txtUser" class="input-sm">
					<div id="cboUser" data-ax5select="cboUser" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div>
				</div>
        	</div>
        	<div class="ab_register row">
        		<div>
                    <label id="lbUser">대결재자</label>
                </div>
                <div>
					<input id="txtName" name="txtName" class="input-sm">
					<div id="cboDaeSign" data-ax5select="cboDaeSign" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div>
				</div>
        	</div>
        	<div class="ab_register row">
        		<div>
                    <label id="lbUser">부재사유</label>
                </div>
                <div>
					<div id="cboSayu" data-ax5select="cboSayu" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div>
					<textarea id="txtSayu" name="txtSayu" rows="4" cols="75"></textarea>
				</div>
        	</div>
        	<div class="ab_register row">
                <div>
                    <label id="lbDate">부재기간</label>
                </div>
                <div>
                    <label id="lbFrom">FROM</label>
                    <div class="input-group" data-ax5picker="basic" style="width:100%;">
                        <input id="datStD" name="datStD" type="text" class="form-control" placeholder="yyyy/mm/dd">
                        <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
                    </div>
                    <label id="lbTo">TO</label>
                    <div class="input-group" data-ax5picker="basic2" style="width:100%;">
                        <input id="datEdD" name="datEdD" type="text" class="form-control" placeholder="yyyy/mm/dd">
                        <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
                    </div>
                </div>
            </div>
            <div class="ab_register row">
            	<div class="az_board_basic margin-10-top" style="height: 20%;">
					<div data-ax5grid="absGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%"></div>
				</div>
            </div>
        </div>
        
         <div id="divPw" class="margin-15-top" style="text-align:center">
             <button id="btnReg" name="btnReg" class="btn_basic">등록</button>
         </div>
	</div>
</div>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/mypage/AbsenceRegister.js"/>"></script>