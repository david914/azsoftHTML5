<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta  name="input1" model-name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>azsoft_형상관리시스템</title>

<!-- Vendor styles -->
<link rel="stylesheet" href="../../vendor/fontawesome/css/font-awesome.css" />
<link rel="stylesheet" href="../../vendor/metisMenu/dist/metisMenu.css" />
<link rel="stylesheet" href="../../vendor/animate.css/animate.css" />
<!-- <link rel="stylesheet" href="../../vendor/bootstrap/dist/css/bootstrap.css" /> -->
<link rel="stylesheet" href="../../vendor/wCheck-master/wCheck.css" />

<!-- App styles -->
<link rel="stylesheet" href="../../fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css" />
<link rel="stylesheet" href="../../fonts/pe-icon-7-stroke/css/helper.css" />
<!-- <link rel="stylesheet" href="../../styles/style.css"> -->

<!--  AX5UI -->
<link rel="stylesheet" href="../../styles/ax5/ax5calendar.css">
<link rel="stylesheet" href="../../styles/ax5/ax5select.css">
<link rel="stylesheet" href="../../styles/ax5/ax5menu.css">
<link rel="stylesheet" href="../../styles/ax5/ax5grid.css"><!-- openGrid -->
<link rel="stylesheet" href="../../styles/ax5/ax5toast.css">
<link rel="stylesheet" href="../../styles/ax5/ax5modal.css">
<link rel="stylesheet" href="../../styles/ax5/ax5mask.css">
<link rel="stylesheet" href="../../styles/ax5/ax5dialog.css">
<link rel="stylesheet" href="../../styles/ax5/ax5picker.css">

<!-- Toast UI Chart -->
<link rel="stylesheet" href="../../styles/tui-chart.css" />

<!-- FILE TREE -->
<link rel="stylesheet" href="../../styles/filetree/zTreeStyle.css">

<link rel="stylesheet" href="../../styles/jquery-ui.css">
<!-- eCAMS js, css -->
<link rel="stylesheet" href="../../css/ecams/common/ecamsStyle.css">
<link rel="stylesheet" href="../../css/ecams/common/toolTip2.css">
<link rel="stylesheet" href="../../css/ecams/login/loginPage.css">
</head>

<body>
<!-- contener S -->
<div id="wrapper">
    <div class="content">
        <!-- 검색 S-->    
		<div class="az_search_wrap">
			<div class="az_in_wrap sr_status">
				<div class="l_wrap width-48 dib vat">
					<!-- 요청부서 -->		
                    <div class="width-30 dib">
                        <label id="lbReqDepart">요청부서</label>
						<div id="cboReqDepart" data-ax5select="cboReqDepart" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-15 dib" style="width:50%;">
					    </div>
					</div>
				    <!-- 분류유형 -->
                    <div class="width-30 dib">
                        <label id="lbCatType">분류유형</label>
						<div id="cboCatType" data-ax5select="cboCatType" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-15 dib" style="width:50%;">
					    </div>
					</div>
				    <!-- 대상구분 -->
                    <div class="width-30 dib">
                        <label id="lbQryGbn">대상구분</label>
						<div id="cboQryGbn" data-ax5select="cboQryGbn" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-15 dib" style="width:50%;">
					    </div>
					</div>
				</div>	
				<div class="r_wrap width-48 dib vat">
					<label id="lbAcptDate">등록일</label>
					<div id="divPicker" data-ax5picker="basic" class="az_input_group dib">
			            <input id="datStD" name="datStD" type="text" placeholder="yyyy/mm/dd" style="width:100px;"><span class="btn_calendar"><i class="fa fa-calendar-o"></i></span><span class="sim">∼</span><input id="datEdD" name="datEdD" type="text" placeholder="yyyy/mm/dd" style="width:100px;"><span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>						
					</div>
					<div class="vat dib margin-5-left"><!---수정-->
						<button id="btnQry" name="btnQry" class="btn_basic_s">조회</button>
					</div>
					<div class="vat dib margin-5-left"><!---수정-->
						<button id="btnReset" name="btnReset" class="btn_basic_s">초기화</button>
					</div>
				</div>
			</div>
		</div>
	    <!-- 검색 E-->
	    <!-- 게시판 S-->
	    <div class="az_board_basic" style="height: 65%">
	    	<div data-ax5grid="firstGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
		</div>	
		<!-- 게시판 E -->
	</div>
</div>

<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/srcommon/PrjListTab.js"/>"></script>

</body>
</html>