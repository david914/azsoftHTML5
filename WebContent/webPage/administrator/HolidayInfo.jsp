<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />


<div id="header"></div>


<div id="wrapper">
    <div class="content">    	
	    <div id="history_wrap">관리자 <strong>&gt; 휴일정보</strong></div>
		<div class="padding-40-top">
			<div id="divContent">
				<div class="row-fluid">
					<div class="row">
						<div class="input-group" data-ax5picker="basic">
				            <input id="txtYear" type="text" class="form-control" data-picker-date="year" placeholder="yyyy">
				            <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
				        </div>
					</div>
					<div class="row">
						<div class="az_board_basic" style="height: 40%;">
							<div data-ax5grid="holidayGrid" data-ax5grid-config="{showLineNumber: false, lineNumberColumnWidth: 40}" style="height: 100%; padding-top: 20px;"></div>
						</div>
					</div>
					
					<div class="row">
						<div>
							<label>휴일</label>
						</div>
						<div>
							<div class="input-group" data-ax5picker="basic2">
					           <input id="txtHoliDate" type="text" class="form-control" placeholder="yyyy-mm-dd">
					           <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
					    	</div>
						</div>
					</div>
					
					<div class="row">
						<div>
							<label>휴일종류</label>
						</div>
						<div>
							<div id="cboHoli" data-ax5select="cboHoli" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div>
						</div>
					</div>
					
					<div class="row">
						<div>
							<label>휴일구분</label>
						</div>
						<div>
							<div id="cboHoliDiv" data-ax5select="cboHoliDiv" data-ax5select-config="{size:'sm',theme:'primary'}" style="width: 100%"></div>
						</div>
					</div>
					
					<div class="row">
						<div>
							<button class="btn_basic" id="btnReg">등록</button>
	    					<button class="btn_basic" id="btnDel">삭제</button>
						</div>
					</div>
					
				</div>
			</div>
		</div>
	</div>
</div>



<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/administrator/HolidayInfo.js"/>"></script>