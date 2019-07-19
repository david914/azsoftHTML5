<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:import url="/webPage/common/common.jsp" />

<style>

    .fc-today {
	    background: #FFF !important;
	    border: none !important;
	    border-top: 1px solid #ddd !important;
	    font-weight: bold;
	    color: blue;
	}
	 
	td.fc-more-cell {
		background-color : #FDFF7F !important;
	}
	
	/* 토요일 */
	.fc-sat { 
		color:#0000FF; 
	}
    /* 일요일 */
    .fc-sun,.holiday { 
    	color:#FF0000; 
    }
    /* 달력 일자 헤더 */
	.fc-day-header {
		background-color: #f4f6f7;
	}
</style>

<div class="contentFrame">
	<div id="wrapper">
		<div class="row">
			<div class="width-50 dib">
				<div id='calendar'></div>
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