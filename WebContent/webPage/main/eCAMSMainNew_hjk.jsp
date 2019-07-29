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

.progTop{
	width:51%;
	height: 209px;
	margin-right:35px;
	overflow:hidden;
	float: none;
	display:inline-block;
	text-align: left;
}

.timeline{
	height: 209px;
	margin-left:-1px;
	overflow: hidden;
	float: none;
	width:30%;
	display: inline-block;
	text-align: left;
	margin-right:7px;
}

.timeline #divTimeLine{
	background: #fff;
}

.timeline .item{
	margin-top:6px;
}

.timeline .item i{
	margin-left:96px;
	position: absolute;
	
}

.fa-clock:before{
	font-size:13px;
}

.timeline .item_info{
	margin:0px 0 7px 20px;
	white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.timeline .item_info p{
	display: inline-block;
	font-size:11px;
	width:81px;
}

.timeline .item:before{
	background-color: #fff;
}

.timeline .item_info small{
	margin-left:17px;
	font-size:11px;
	
}

.timeline .timeline_box h4{
	font-size:11px;
	margin-bottom:4px;
}

#divCal{
	padding:4px;
	width:51%;
	margin-right:35px !important;
	display:inline-block;
	border : 1px solid #ddd;
	float: none;
	vertical-align: top;
	
}

td.fc-more-cell{
	background-color: transparent !important;
}

.piechart{

	margin-left:-1px;
	overflow: hidden;
	width:30%;
	margin-right:7px;
	float : none;
	display: inline-block;
	border : 1px solid #ddd;
}

.card_info {
	float:none;
	height: 60px;
}

.card_info dl{
	width:20%;
	height:60px;
}

.card_info dl:first-child{
	margin-left:0px;
}

.card_info dl dt{
	width:44%;
	height:60px;
	background: transparent;
	vertical-align: top;
	padding-top:7px;
}
.piechart div:first-child{
	background: transparent !important;
}

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
</style>
<div class="contentFrame">
	 <!--line 1-->
	<div class="half_wrap_cb">
	
	<!-- 
		<div class="l_wrap txt_info">
			<ul>
				<li><i class="fas fa-angle-right"></i> 미결<span id="lblApproval">[5]</span></li>
				<li><i class="fas fa-angle-right"></i> SR<span id="lblSr">[5]</span></li>
				<li><i class="fas fa-angle-right"></i> 오류<span id="lblErr">[5]</span></li>
			</ul>
		</div>
	 -->
	 
		<div class="r_wrap card_info">
	        <dl>
	          <dt><i class="fas angle-double-right"></i></dt>
	          <dd><div style="font-size:24px; color:black;">100</div><div style="font-size:11px;">SR등록</div></dd>
	        </dl>
	        <dl>
	          <dt><i class="fas fa-file-movie-o"></i></dt>
	          <dd><div style="font-size:24px; color:black;">2</div><div style="font-size:11px;">체크아웃</div></dd>
	        </dl>
	        <dl>
	          <dt><i class="fas fa-deviantart"></i></dt>
	          <dd><div style="font-size:24px; color:black;">3</div><div style="font-size:11px;">운영배포</div></dd>
	        </dl>
	        <dl>
	          <dt><i class="fas fa-git"></i></dt>
	          <dd><div style="font-size:24px; color:black;">11</div><div style="font-size:11px;">SR완료</div></dd>
	        </dl>
		</div>
    </div>
    
    <!--line 2-->
	<div class="row half_wrap_cb ">
		<div class="l_wrap progressbar scrollBind progTop">
			<div class="margin-10-right" id="divSrList">
			</div>
		</div>
		<div class="r_wrap timeline width-39 scrollBind">
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
	
	<!--line 3-->
	<div class="row half_wrap_cb">
		<div class="l_wrap width-59" id="divCal">
			<div id='calendar'></div>
		</div>
		<div class="r_wrap width-39 piechart">
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
</form>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/main/eCAMSMainNew.js"/>"></script>