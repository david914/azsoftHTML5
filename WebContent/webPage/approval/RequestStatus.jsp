<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />
<c:import url="/js/ecams/common/commonscript.jsp" />

<!-- contener S -->
<div id="wrapper">
    <div class="content">
        <!-- history S-->
        <div id="history_wrap">결재확인 <strong>&gt; 신청현황</strong></div>
        <!-- history E-->         
	    <!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap">
				<div class="l_wrap width-65 dib">
	                <div class="por">
	                	<!--신청부서S-->
	                	<div class="width-25 dib vat">
		                	<label class="tit-80 dib poa">신청부서</label>
		                	<div class="ml_80">
			                    <div id="cboDept" data-ax5select="cboDept" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		                	</div>
						</div>
						<!--시스템S-->
						<div class="width-25 dib vat">
							<label class="tit-80 dib poa">시스템</label>
							<div class="ml_80">
								<div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
							</div>
						</div>	
						<!--처리구분S-->
						<div class="width-25 dib vat">
		                	<label class="tit-80 dib poa">처리구분</label>
		                	<div class="ml_80">
								<div data-ax5select="cboGbn" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		                	</div>
						</div>
						<!--신청인S-->
						<div class="width-25 dib vat">
		                	<label class="tit-80 dib poa">신청인</label>
		                	<div class="ml_80 vat">
								<input id="txtUser" type="text" placeholder="신청인을 입력하세요." class="width-100" />
		                	</div>
						</div>
					</div>
	                <div class="row por">
	                	<!--신청종류S-->
	                	<div class="width-25 dib vat">
		                	<label class="tit-80 dib poa">신청종류</label>
		                	<div class="ml_80">
			                    <div data-ax5select="cboSin" data-ax5select-config="{size:'sm', theme:'primary'}" style="width:100%;"></div> 	
		                	</div>
						</div>
						<!--진행상태S-->
						<div class="width-25 dib vat">
							<label class="tit-80 dib poa">진행상태</label>
							<div class="ml_80">
								<div data-ax5select="cboSta" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
		                	</div>
						</div>
						<!--SR-ID/SR명 S-->
						<div class="width-50 dib vat">
		                	<label class="tit-80 dib poa">SR-ID/SR명</label>
		                	<div class="ml_80 vat">
								<input id="txtSpms" type="text" placeholder="SR-ID/SR명을 입력하세요." class="width-100" />
		                	</div>
						</div>
					</div>					
					<div class="row thumbnail">
						<span class="r_nail">반려 또는 취소</span>
						<span class="p_nail">시스템처리 중 에러발생</span>
						<span class="g_nail">처리완료</span>
						<span class="b_nail">진행중</span>
					</div>			
				</div>
				<div class="r_wrap width-35 poa_r vat">
					<div class="height-30 tar">
						<input id="rdoStrDate"  type="radio" name="rdoDate" value="0" checked="checked"/>
						<label for="rdoStrDate" >신청일기준</label>
						<input id="rdoEndDate" type="radio" name="rdoDate" value="1"/>
						<label for="rdoEndDate">완료일기준</label>
					</div>
					<div class="row tar">
						<div id="divPicker" data-ax5picker="basic" class="az_input_group dib">
				            <input id="datStD" name="datStD" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
				            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>
				            <span class="sim">∼</span>
				            <input id="datEdD" name="datEdD" type="text" placeholder="yyyy/mm/dd" style="width:100px;">
				            <span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>		
						</div>
					</div>
					<div class="row tar">
						<div class="all_num dib" id="lbTotalCnt">
				      		<strong>총 0건</strong>
						</div>
						<div class="vat dib margin-5-left">
							<button class="btn_basic_s" data-grid-control="excel-export" id="btnExcel">엑셀저장</button>
						</div>
						<div class="vat dib margin-5-left">
							<button class="btn_basic_s" id="btnQry">조회</button>
						</div>
						<div class="vat dib margin-5-left">
							<button class="btn_basic_s" id="btnReset">초기화</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--검색E-->		

	    <!-- 게시판 S-->
	    <div class="az_board_basic" style="height: 85%">
	    	<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 82%;"></div>
		</div>	
	</div>
</div>


<!-- 

<style>
select,input[type="text"] {
	width: 100% !important;
}

label{
	margin-top : 8px; !important;
}

div[class^="col"] { 
	padding: 0px 10px 0px 0px !important;
}

div[class^="row"] { 
	margin: 0px 0px 5px 5px !important;
}

.fontStyle-error {
	color: #BE81F7;
}
.fontStyle-ing {
	color: #0000FF;
}
.fontStyle-cncl {
	color: #FF0000;
}
</style>

<section>
<div class="container-fluid">
	<div class="border-style-black">
		<div class="form-inline">
			<div class="row">
				<div class="col-sm-3">
					<div class="col-sm-2">
						<label  id="lbDept" name="lbDept" >신청부서</label>
					</div>
					<div class="form-group col-sm-10 no-padding">
						 <div id="cboDept" data-ax5select="cboDept" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
				
				<div class="col-sm-3">
					<div class="col-sm-2">
						<label  id="lbSysCd" name="lbSysCd">시스템</label>
					</div>
					<div class="form-group col-sm-10 no-padding">
						 <div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
				<div class="col-sm-2">
					<div class="col-sm-4">
						<label  id="lbgbn" name="lbgbn">처리구분</label>
					</div>
					<div class="form-group col-sm-8 no-padding">
						<div data-ax5select="cboGbn" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
				<div class="col-sm-2">
					<div class="col-sm-3">
						<label  id="lbEditor" name="lbEditor">신청인</label>
					</div>
					<div class="form-group col-sm-9 no-padding">
						<input class="input-sm" id="txtUser" name="txtUser" type="text" class="form-control" placeholder="신청인을 입력하세요."/>
					</div>
				</div>
				<div class="col-sm-1 col-sm-offset-1">
					<div class="form-group">
						<button class="btn btn-default" data-grid-control="excel-export" id="btnExcel">엑셀저장</button>
					</div>
				</div>
			</div>
			 
			<div class="row">
				<div class="col-sm-3">
					<div class="col-sm-2">
						<label  id="lbBlank" name="lbBlank">신청종류</label>
					</div>
					<div class="form-group col-sm-10 no-padding"> 
						<div data-ax5select="cboSin" data-ax5select-config="{size:'sm', theme:'primary'}" style="width:100%;"></div> data-ax5select-config="{multiple: true, size:'sm', theme:'primary'}" 	
					</div>
				</div>
				
				<div class="col-sm-3">
					<div class="col-sm-2">
						<label  id="lbSta" name="lbSta">진행상태</label>
					</div>
					<div class="form-group col-sm-10 no-padding">
						<div data-ax5select="cboSta" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
				<div class="col-sm-4">
					<div class="col-sm-6 form-group">
						<label><input style="vertical-align: middle;" id="rdoStrDate" name="rdoDate" type="radio" value="0" checked/>&nbsp;&nbsp;신청일기준</label>
					</div>
					<div class="col-sm-6 form-group">
						<label><input style="vertical-align: middle;" id="rdoEndDate" name="rdoDate"  type="radio" value="1"/>&nbsp;&nbsp;완료일기준</label>
					</div>	
				</div>
				<div class="col-sm-1 col-sm-offset-1">
					<button id="btnQry" class="btn btn-default">조&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;회</button>
				</div>
			</div>
			
			<div class="row">
				<div class="col-sm-3">
					<div class="form-group">
						<label  id="lbCnl" class="no-padding" name="lbCnl" style="color:white;  white-space: pre; background-color: #FF0000;">반려 또는 취소</label>
						<label  id="lbCnl" class="no-padding" name="lbCnl" style="color:white;  white-space: pre; background-color: #BE81F7;">처리 중 에러발생</label>
						<label  id="lbCnl" class="no-padding" name="lbCnl" style="color:white;  white-space: pre; background-color: #000000;">처리완료</label>
						<label  id="lbCnl" class="no-padding" name="lbCnl" style="color:white;  white-space: pre; background-color: #0000FF;">진행중</label>
					</div>
				</div>
				<div class="col-sm-3">
					<div class="col-sm-3">
						<label  id="lbSpms" name="lbSpms">SR-ID/SR명</label>
					</div>
					<div class="form-group col-sm-9 no-padding">
						<input class="input-sm" id="txtSpms" name="txtSpms" type="text" class="form-control" placeholder="SR-ID/SR명을 입력하세요."/>
					</div>
				</div>
				<div class="col-sm-4">
					<div class="input-group" data-ax5picker="basic" style="width:100%;">
			            <input id="datStD" name="datStD" type="text" class="form-control" placeholder="yyyy/mm/dd">
			            <span class="input-group-addon">~</span>
			            <input id="datEdD" name="datEdD" type="text" class="form-control" placeholder="yyyy/mm/dd">
			            <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
			        </div>
				</div>
				<div class="col-sm-1">
					<label  id="lbTotalCnt" name="lbTotalCnt" style="width: 100%;  text-align: right;">총0건</label>
				</div>
				<div class="cols-sm-1">
					<div class="form-group">
						<button id="btnReset" class="btn btn-default">초&nbsp;&nbsp;기&nbsp;&nbsp;화</button>
					</div>
				</div>
			</div>		
		</div>
	</div>
</div>
</section>

<section>
	<div class="container-fluid">
		<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 82%;"></div>
	</div>
</section>
 -->
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>

<script type="text/javascript" src="<c:url value="/js/ecams/approval/RequestStatus.js"/>"></script>