<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp"/>
<c:import url="/js/ecams/common/commonscript.jsp"/>

<script type="text/javascript" src="<c:url value="/js/ecams/register/SRRegister.js"/>"></script>

<!-- contener S -->
<div class="contentFrame">
	<!-- history S-->
	<div id="history_wrap"></div>
	<!-- history E-->         

	<!-- PrjListTab.jsp -->
  	<div class="az_board_basic" style="height:28%">
		<div class="l_wrap width-48 dib vat" style="width:100%; height:100%">
			<div id="divPicker" data-ax5picker="basic" class="az_input_group dib poa" style=" right:119px; top: 11px;">
					<input id="datStD" name="datStD" type="text"
						placeholder="yyyy/mm/dd" style="width: 100px;"> <button
						id="btnStD" class="btn_calendar"><i class="fa fa-calendar-o"></i></button> <span
						class="sim">∼</span> <input id="datEdD" name="datEdD" type="text"
						placeholder="yyyy/mm/dd" style="width: 100px;"> <button
						id="btnEdD" class="btn_calendar"><i class="fa fa-calendar-o"></i></button>
				</div>
				<!-- frmPrjList -->
   				<iframe id="frmPrjList" name="frmPrjList" src='/webPage/tab/sr/PrjListTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
   		</div>
    </div>        
    
    <div class="half_wrap" style="height:68%; margin-top:10px;">
	 	<!-- SR등록/접수 START -->
		<iframe id="frmSRRegister" name="frmSRRegister" src='/webPage/tab/sr/SRRegisterTab.jsp' width='100%' height='100%' frameborder="0"></iframe>
	    <!-- SR등록/접수  END -->
	</div>
</div>
<!-- contener E -->