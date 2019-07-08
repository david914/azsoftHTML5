<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
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

<style>
.font-blue {
	color: blue;
}

.font-red {
	color: red;
}
</style>

</head>
<body>

<div id="header"></div>
<div id="wrapper">
	<div class="content">
		<div id="history_wrap">보고서 <strong>&gt; 형상관리운영현황</strong></div>
		<div class="az_search_wrap">
			<div class="az_in_wrap sr_status">
				<div class="l-wrap width-100 vat">
					<div class="row">
						<div class="width-20 dib por">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*조회구분</label>
	                        </div>
							<div id="dateStd" data-ax5select="dateStd" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>
						    
						</div>
						<div class="width-20 dib por">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*1단계</label>
	                        </div>
							<div id="step1" data-ax5select="step1" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>
						    
						</div>
						<div class="width-20 dib por">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*3단계</label>
	                        </div>
							<div id="step3" data-ax5select="step3" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>						    
						</div>
						<div class="width-20 dib por">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*시스템</label>
	                        </div>
							<div id="systemSel" data-ax5select="systemSel" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>						    
						</div>
						<div class="width-20 dib vat">
							<label id="lbUser">개발시작월</label>
							<div id="picker1" data-ax5picker="picker1" class="az_input_group dib margin-10-left">
					            <input id="datStD" name="start_date" type="text" placeholder="yyyy/mm/dd" style="width:120px;"><span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>						
							</div>
							<div class="vat dib margin-5-right float-right"><!--수정-->
								<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnSearch">조회</button>
							</div>
						</div>
					</div>
					
					
					<div class="row margin-10-bottom">
						<div class="width-20 dib por">
						    
						</div>
						<div class="width-20 dib por">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*2단계</label>
	                        </div>
							<div id="step2" data-ax5select="step2" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>						    
						</div>
						<div class="width-20 dib por">
							<div class="tit_80 poa">
	                        	<label id="lbUser">*4단계</label>
	                        </div>
							<div id="step4" data-ax5select="step4" data-ax5select-config="{size:'sm',theme:'primary'}" onchange="" class="width-70 ml_80 dib">
						    </div>						    
						</div>
						<div class="width-20 dib por">
					    
						</div>

						<div class="width-20 dib vat">
							<label id="lbUser">개발종료월</label>
							<div id="picker2" data-ax5picker="picker2" class="az_input_group dib margin-10-left">
					            <input id="datEdD" name="start_date" type="text" placeholder="yyyy/mm/dd" style="width:120px;"><span class="btn_calendar"><i class="fa fa-calendar-o"></i></span>						
							</div>
							<div class="vat dib margin-5-right float-right"><!--수정-->
								<button class="btn_basic_s" data-grid-control="excel-export" style="width: 70px;" id="btnExcel">엑셀저장</button>
							</div>
						</div>
					</div>
				</div>
						
			</div>
		</div>
	
	</div>
	
	<div class="az_board_basic">
		<div id="mainGrid" data-ax5grid="mainGrid" data-ax5grid-config="{}" style="width:100%; height: 600px;">
		
		</div>
	</div>
</div>


<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/report/ConfigOpReport.js"/>"></script>
</body>
</html>