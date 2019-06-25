<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<c:import url="/webPage/common/common.jsp" />

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

#tip {
	position:absolute;
  	color:#FFFFFF;
	padding:5px;
	display:none;
	background:#450e4c;
  	border-radius: 5px;
}

.loding-div{
    width:100%;
    height:100%;
    background-color: white;
    position: absolute;
    z-index:1;
}

.loding-img{
    position: absolute;
	z-index: 1;
    left: calc(50% - 436px/2);
    top:25%;
}

</style>
<section>

<div class="container-fluid">
	<div class="border-style-black">
		<div class="form-inline">
			<div class="row">
				<div class="col-sm-3">
					<div class="col-sm-2">
					<div class="margin-15-left margin-15-top">
						<label id="idx_lbl_system">*시스템</label>
					</div>
					<div class="form-group col-sm-10 no-padding">
						 <div id="cboSysCd" data-ax5select="cboSysCd" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
				<div class="col-sm-3">
					<div class="col-sm-2">
						<label id="idx_lbl_srid">*SR-ID</label>
					</div>
					</div>
					<div class="form-group col-sm-10 no-padding">
						<div id="cboSrId" data-ax5select="cboSrId" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;" ></div>
					</div>
				</div>
				<div class="col-sm-2">
					<div class="col-sm-4">
						<button id="btnSrInfo" name="button_search" class="width-100">SR정보</button>
						<button id="btnExcelLoad" name="button_excelLoad" class="width-100">일괄 체크아웃</button>
						<form id='ajaxform' method='post' enctype='multypart/form-data'>
							<input type='file' id='excelFile' name='excelFile' style='display:none;' onchange='fileTypeCheck(this)' accept='.xls,.xlsx' accept-charset='UTF-8'/>
						</form>
					</div>
					
					</div>
					<div class="form-group col-sm-8 no-padding">
					</div>
				</div>
				<div class="col-sm-2">
					<div class="col-sm-3">
						<label id="idx_lbl_request_text" >*신청사유</label>
					</div>
					<div class="form-group col-sm-9 no-padding">
						<input class="input-sm" id="reqText" name="idx_request_text" type="text" class="form-control" placeholder="신청사유을 입력하세요."/>
					</div>
				</div>
				
				<div class="col-sm-1 col-sm-offset-1">
					<div class="form-group">
						<input type="checkbox" name = 'chkbox_subnode' id ='chkbox_subnode' checked/><label for='chkbox_subnode'>하위폴더포함하여조회</label>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-sm-3">
					<div class="col-sm-2">
						<label id="idx_lbl_prg">프로그램유형</label>
					</div>
					<div class="form-group col-sm-10 no-padding">
						<div data-ax5select="cboProg" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
					</div>
				</div>
				
				<div class="col-sm-3">
					<div class="col-sm-2">
						<label id="idx_lbl_prg_exp" >*프로그램명/설명</label>
					</div>
					<div class="form-group col-sm-10 no-padding">
						<input 
							id="progName" 
							name="idx_lbl_prg_exp_txt"
							class="input-sm form-control" 
							placeholder="프로그램설명 을 입력"/>
					</div>
				</div>
				<div class="col-sm-4">
					<div class="col-sm-2">
						<button id="btnSearch" class="btn btn-default" >검&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;색</button>
					</div>
					<div class="form-group col-sm-10 no-padding">
						
					</div>
				</div>
				<div class="col-sm-1 col-sm-offset-1">
					
				</div>
			</div>		
		</div>
	</div>
</section>

<section>
	<div class="container-fluid">
		<div class="row-fulid" >
			<div class="col-xs-12 col-md-3 file-tree" >
			
			<ul id="treeDemo" class="ztree"></ul>				
			</pre>
			<!-- 
				<sbux-tree 
				  	id="idxFileTree" 
				  	name="fileTree" 
				  	uitype="normal" 
				  	jsondata-ref="treeJsonData" 
				  	empty-message="시스템에 등록된 프로그램종류가 없습니다."
				  	onclick="fileTreeClick()">
				</sbux-tree>
			-->
			</div>
			
			<div class="col-xs-12 col-md-9 no-padding container-fluid">
				<div data-ax5grid="first-grid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" id="fileGrid" class="default-grid-height"></div>
			</div>
			
		</div>
	</div>
</section>

<section>
	<div class="container-fluid">
		<div class="row-fulid" >
			<div class="col-xs-12 col-md-3">
				<label 
					id="idx_lbl_path" 
					style="padding: 5px;">	
				</label>	
			</div>
			
			<div class="col-xs-12 col-md-7">
			<input type="checkbox" name = 'chkbox_checkDetail' id ='chkDetail'/><label for='chkDetail'>체크아웃항목상세보기</label>
			</div>
			
			<div class="col-xs-12 col-md-2">
				<div class="row">
					<div class="float-right">
						<div class="form-group">
							<button class="btn btn-default" id="btnDel" name="idx_del_btn" >제거</button>
						</div>
					</div>
					<div class="float-right">
						<div class="form-group">
							<button class="btn btn-default" id="btnAdd" name="idx_add_btn" >추가</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section>
	<div class="container-fluid">
		<div class="row-fulid" >
			<div class="col-xs-12 col-md-12 no-padding container-fluid">
				<div data-ax5grid="second-grid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40, showRowSelector:true}" id="requestGrid" class="default-grid-height">
				</div>
			</div>
		</div>
	</div>
</section>


<section>
	<div class="container-fluid">
		<div class="row-fulid" >
			<div class="float-right">
					<div class="form-group">
						<button class="btn btn-default" id="btndiff" style='display:none'>파일비교</button>
						<button class="btn btn-default" id="btnReq">체크아웃</button>
					</div>
			</div>
		</div>
	</div>
</section>
<c:import url="/js/ecams/common/commonscript.jsp" />
<script type="text/javascript" src="<c:url value="/js/ecams/dev/CheckOut.js"/>"></script>
