<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<style>

.progressbar .org{
	background: #ff9a9a;

}
.progressbar .green{
	background: #8bffde;
}

.progressbar .blue{
	background: #9aa2ff;
}

.progDiv{
	width:35%;
	height: 260px;
	margin-right:20px;
	float: none;
	display:inline-block;
	text-align: center;
}

::-webkit-scrollbar {
	display:none;
}

.progTop {
	display: inline-block;
	text-align: left;
	width: 100%;
}

.timeline{
	height: 260px;
	margin-left:-1px;
	overflow: hidden;
	float: none;
	width:25%;
	display: inline-block;
	text-align: left;
}

.timeline #divTimeLine{
	background: #fff;
}

.timeline .item{
	margin-bottom: 12px;
	/*padding-top: 1px;
	padding-bottom: 1px;*/
	box-shadow: 1px 1px 2px 1px #eee !important;
}

.timeline .item i{
	position: absolute;
    margin-top: 29px;
    margin-left: 26px;
}

.fa-clock:before{
	font-size:13px;
}

.timeline .item_info{
	margin:0px 0 4px 10px;
	white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.timeline .item_info p{
	display: inline-block;
    font-size: 13px;
    width: 81px;
    margin-left: 40px;
    padding: 4px;
}

.timeline .item_info div {
	padding: 3px;
	font-family: 'Noto Sans KR', sans-serif;
	font-size: 13px;
}

.timeline .item:before{
	background-color: #fff;
}

.timeline .item_info small{
	font-size:12px;
	
}

.timeline .timeline_box h4{
	font-size:13px;
	margin-bottom:10px;
	color: #666;
}

#divCal{
	padding:8px;
	width:36%;
	margin-right:35px !important;
	display:inline-block;
	border : 1px solid #ddd;
	float: none;
	vertical-align: top;
	
}

td.fc-more-cell{
	background-color: transparent !important;
}
/*
.piechart{

	margin-left:-1px;
	overflow: hidden;
	width:30%;
	margin-right:7px;
	float : none;
	display: inline-block;
	border : 1px solid #ddd;
}
*/
.card_info {
	float:none;
	height: 100px;
}

.card_info dl{
	width:20%;
	height:80px;
	margin: 0 10px;
	border: 1px solid #eee;
}


.card_info dl dt{
	width:44%;
	height:80px;
	background: transparent;
	vertical-align: top;
	padding-top:7px;
	background: #fff;
}
/*
.piechart div:first-child{
	background: transparent !important;
}
*/

.tui-chart .tui-chart-tooltip-area .tui-chart-tooltip .tui-chart-default-tooltip{
    -webkit-border-radius: 3px !important;
    border-radius: 3px !important;
    background-clip: padding-box !important;
    background-color: #5f5f5f !important;
    background-color: rgba(85, 85, 85, 0.95) !important;
}

.angle-double-right:before{
	content: "\f101";
    font-size: 46px;
    background: #fff;
    color: #39afd1;
    border-radius: 20px;
}

.fa-deviantart:before{
	content: "\f1bd";
    font-size: 46px;
    background: #fff;
    color: #39afd1;
    border-radius: 20px;
}

.fa-git:before{
    font-size: 46px;
}

.fa-file-movie-o:before{
    font-size: 46px;
}
.card_info dl dd{
	width:50%;
	text-align: right;
	padding: 0 0 0 0;
	padding-top:4px;
	padding-right:30px;
}

.half_wrap_cb{
	text-align: center;
}

.progressbar dl dd{
	margin-left: 0px;
	height:20px;
	margin-top:20px;
	line-height: 21px;
	border-radius: 3px;
	overflow: hidden;
}

.progressbar dl dt{
	height:20px;
	top:-22px;
}

.progressbar dl dd span{
	height:20px !important;
   	border-top-left-radius: 3px;
   border-bottom-left-radius: 3px;
}

.mainBorder {
	box-shadow: 1px 1px 4px 1px lightgrey !important;
}

.sm-font {
	font-family: 'Noto Sans KR', sans-serif;
	font-size: 14px;
	margin-top: 0.5%;
	text-align: left !important;
	color: #000;
	line-height: 37px;
}

.titleLb {
	height: 40px; 
	margin-left: 7px;
	margin-right: 7px;
	border-bottom: 1px solid #ddd;
}

.contntBd {
	border: 1px solid #eee;
}

.scauto {
	overflow: auto;
	height: 215px;
}

tr:first-child > td > .fc-day-grid-event:hover {
	width: 130px;
}

.mainBorder{box-shadow: none;}
.angle-double-right:before,
.fa-file-movie-o:before,
.fa-deviantart:before,
.fa-git:before{font-size: 28px; color: #666;}
.card_info dl dt{padding-top: 16px;}
</style>
<link href="https://fonts.googleapis.com/css?family=Noto+Sans+KR:300&display=swap" rel="stylesheet">

<div class="contentFrame">
	 <!--line 1-->
	<div class="half_wrap_cb">
	
		<div class="r_wrap card_info">
	        <dl class="mainBorder">
	          <dt><i class="fas angle-double-right"></i></dt>
	          <dd><div style="font-size:24px; color:black;" id="srRegCnt">100</div><div style="font-size:13px;color: #95aac9;">등록</div></dd><!--ksj-->
	        </dl>
	        <dl class="mainBorder">
	          <dt><i class="fas fa-file-movie-o"></i></dt>
	          <dd><div style="font-size:24px; color:black;" id="devSrCnt">2</div><div style="font-size:13px;color: #95aac9;">개발</div></dd><!--ksj-->
	        </dl>
	        <dl class="mainBorder">
	          <dt><i class="fas fa-deviantart"></i></dt>
	          <dd><div style="font-size:24px; color:black;" id="testSrCnt">3</div><div style="font-size:13px;color: #95aac9;">테스트</div></dd><!--ksj-->
	        </dl>
	        <dl class="mainBorder">
	          <dt><i class="fas fa-git"></i></dt>
	          <dd><div style="font-size:24px; color:black;" id="appySrCnt">11</div><div style="font-size:13px;color: #95aac9;">적용</div></dd><!--ksj-->
	        </dl>
		</div>
    </div>
    
    <!--line 2-->
	<div class=" half_wrap_cb "><!--ksj-->
		<!-- 파이차트 -->
		<div class="dib width-22 piechart margin-15-right contntBd vat">
			<div class="panel-body text-center dib margin-20-right" id="pieDiv" style="width: 100%;">
				<div class="titleLb poa" style="z-index: 2;width: 21%;">
					<label class="sm-font" style="vertical-align: middle; margin-top: 0.7%;" id="lblPieTitle"></label>
				</div>
		    	<div id="pieAppliKinds" style="margin-top: 5px;"></div>
		    </div>
		</div>
		
		<!-- 바차트 -->
		<div class="progressbar progDiv contntBd vat">
			<div class="titleLb">
				<label class="sm-font" style="vertical-align: middle;" id=""> SR진행 현황</label>
			</div>
			<div class="scauto">
				<div class="margin-10-right progTop" id="divSrList">
				</div>
			</div>
		</div>
		
		<!-- 타임라인 -->
		<div class="timeline timelineDiv contntBd">
			<div class="titleLb">
				<label class="sm-font" style="vertical-align: middle;" id="">타임라인</label>
			</div>
			<div class="scauto">
				<div class="margin-5-left margin-5-right timeline_box" id="divTimeLine">
					
				</div>
			</div>
		</div>
		
	</div>
	
	<!--line 3-->
	<div class="margin-10-top half_wrap_cb"><!--ksj-->
		<!-- 캘린더 -->
		<div class="width-35 dib vat margin-15-right contntBd" id="calBg"><!--ksj-->
			<div class="titleLb">
				<label class="sm-font" style="vertical-align: middle;" id="">업무 캘린더</label>
			</div>
			<div id="divCal width-100" style="padding: 10px;">
				<div id='calendar'></div>
			</div>
		</div>	
		
		<!-- 라인차트 -->
		<div class="container-fluid dib contntBd width-48">
			<div class="titleLb">
				<label class="sm-font" style="vertical-align: middle;" id="">월별 업무현황</label>
			</div>
			<div id="line-chart" class="width-100"></div>
		</div>
	</div> 
	
	
</div>
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form>



<!-- 
<div class="contentFrame">
	 line 1
	<div class="half_wrap_cb">
		<div class="l_wrap txt_info">
			<ul>
				<li><i class="fas fa-angle-right"></i> 미결<span id="lblApproval">[5]</span></li>
				<li><i class="fas fa-angle-right"></i> SR<span id="lblSr">[5]</span></li>
				<li><i class="fas fa-angle-right"></i> 오류<span id="lblErr">[5]</span></li>
			</ul>
		</div>
		<div class="r_wrap card_info">
	        <dl>
	          <dt>등록</dt>
	          <dd id="srRegCnt">100</dd>
	        </dl>
	        <dl>
	          <dt>개발</dt>
	          <dd id="devSrCnt">1/10</dd>
	        </dl>
	        <dl>
	          <dt>테스트</dt>
	          <dd id="testSrCnt">1/10</dd>
	        </dl>
	        <dl>
	          <dt>적용</dt>
	          <dd id="appySrCnt">1/10</dd>
	        </dl>
		</div>
    </div>
    
    line 2
	<div class="row half_wrap_cb">
		<div class="l_wrap progressbar" style="width: 59%; height: 35%; margin-right: 2px;">
			<div class="margin-10-right" id="divSrList">
			</div>
		</div>
		<div class="r_wrap timeline width-39 scrollBind" style="background-color: #f8f8f8; height: 35%; margin-left: 2px;">
			<div class="margin-10-left timeline_box" id="divTimeLine">
				<h4>timeline</h4>
				<div class="item">
					<i class="fas fa-clock"></i>
					<div class="item_info">
						<p>제목나옵니다.</p>
						<small>내용나옵니다.</small>
					</div>
				</div>
				<div class="item">
					<i class="fas fa-clock time_icon"></i>
					<div class="item_info">
						<p>제목나옵니다.</p>
						<small>내용나옵니다.</small>
					</div>
				</div>
			</div>
		</div>
		
	</div>
	
	line 3
	<div class="row half_wrap_cb">
		<div class="l_wrap width-59" id="divCal" style="margin-right: 2px;">
			<div id='calendar'></div>
		</div>
		<div class="r_wrap width-39" style="margin-left: 2px;">
			<div style="height: 30px; background: linear-gradient(to bottom, #f0f0f0, #fff, #f0f0f0)">
				<label class="sm-font margin-20-left" style="vertical-align: middle;" id="lblPieTitle"></label>
			</div>
			<div class="panel-body text-center dib margin-20-left" id="pieDiv" style="width: 95%;">
		    	<div id="pieAppliKinds"></div>
		    </div>
		</div>
	</div> 
</div>
<form name="popPam">
	<input type="hidden" name="acptno"/>
	<input type="hidden" name="user"/>
</form> -->
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/main/eCAMSMainNew.js"/>"></script>