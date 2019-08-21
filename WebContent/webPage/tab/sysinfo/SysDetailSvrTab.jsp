<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:import url="/webPage/common/common.jsp" />
<div class="half_wrap">
	<!--left wrap-->
	<div class="l_wrap width-50">
		<div class="margin-5-right">
			<div class="sm-row">
				<label class="tit_80 poa">서버종류</label>
                <div class="ml_80">
					<div id="cboSvr" data-ax5select="cboSvr" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
				</div>
			</div>
	 		<div class="sm-row por">
			 	<label class="tit_80 poa">서버명/OS</label>
                <div class="ml_80">
                	<input id="txtSvrName" class="vat width-45 dib vat" type="text"></input>
					<div id="cboOs" data-ax5select="cboOs" data-ax5select-config="{size:'sm',theme:'primary'}" class="width-45 dib poa_r"></div>
				</div>
			</div>
		 			
		 	<div class="sm-row half_wrap_cb">
		 		<label class="tit_80 poa">IP/PORT/순서</label>
			 	<div class="ml_80 por">
			 		<div class="l_wrap width-45">
			 			<input id="txtSvrIp" class="width-100" type="text" />
			 		</div>
			 		<div class="l_wrap width-25 tar" style="margin-left: 12px;">
						<input id="txtPort" class="width-100" type="text" />
			 		</div>
			 		<div class="r_wrap width-25 tar">
						<input id="txtSeq" class="width-100" type="text" />
			 		</div>
			 	</div>
			</div>
		 			
		 	<div class="sm-row por">
		 		<label class="tit_80 poa">계정/비밀번호</label>
			 	<div class="ml_80">
			 		<input id="txtUser" class="width-45" type="text" />
			 		<input id="txtPass" class="width-45 poa_r" type="text" />
			 	</div>
			</div>
		 			
		 	<div class="sm-row">
		 		<label class="tit_80 poa">Home-Dir</label>
			 	<div class="ml_80">
		 			<input id="txtHome" class="width-100" type="text"></input>
		 		</div>
		 	</div>
		 			
		 	<div class="sm-row">
		 		<label class="tit_80 poa">Agent-Dir</label>
			 	<div class="ml_80">
		 			<input id="txtDir" class="width-100" type="text"></input>
		 		</div>
		 	</div>

		 	<div class="sm-row">
		 		<label class="tit_80 poa">버퍼사이즈</label>
                <div class="ml_80">
					<div id="cboBuffer" data-ax5select="cboBuffer" data-ax5select-config="{size:'sm',theme:'primary'}" style="width:100%;"></div>
				</div>		 		
		 	</div>
		 			
			<div class="sm-row">
		 		<label class="tit_80 poa">동기화홈경로</label>
		 		<div class="ml_80">
		 			<input id="txtTmp" class="width-100" type="text"></input>
		 		</div>
		 	</div>
	 		<div class="sm-row">
	 			<div class="l_wrap width-50">
		 			<input type="checkbox" class="checkbox-IP" id="chkIp" data-label="IP만변경"  />
			 		<input type="checkbox" class="checkbox-IPC" id="chkIpC" data-label="IP변경하여 복사"  />
	 			</div>
				<div class="r_wrap width-50">
			 		<label id="lblAftIp" class="tit_60 poa">변경IP</label>
			 		<div class="ml_60">
				 		<input id="txtAftIp"class="width-100" type="text"></input>
			 		</div>
				</div>		 		
	 		</div>
		</div>
 	</div>
 	<!--right wrap-->
 	<div class="r_wrap width-50">
 		<div class="margin-5-left">
	 		<div class="por">
	 			<label class="title_s">[서버속성]</label> 
	 			<div class="poa_r">
		 			<input type="checkbox" class="checkbox-IP" id="chkAllSvr" data-label="전체선택"  />
	 			</div>
	 		</div>
	 		<div class="scrollBind sm-row" style="height:211px;">
				<ul class="list-group" id="ulSyrInfo"></ul>
			</div>
	 		<div class="tar">
	 			<div class="dib" id="dibChkBase">
		 			<input type="checkbox" class="checkbox-IP" id="chkBase" data-label="기준서버"  />
	 			</div>
	 			<input type="checkbox" class="checkbox-IP" id="chkErr" data-label="장애"  />
	 			<input type="checkbox" class="checkbox-IP" id="chkStop" data-label="일시정지"  />
	 		</div>
	 		<div class="sm-row tar">
				<button id="btnReq" class="btn_basic_s">등록</button>
				<button id="btnUpdt" class="btn_basic_s margin-5-left">수정</button>
				<button id="btnCls" class="btn_basic_s margin-5-left">폐기</button>
				<button id="btnQry" class="btn_basic_s margin-5-left">조회</button>
				<button id="btnExl" class="btn_basic_s margin-5-left">엑셀저장</button>
				<button id="btnExit" class="btn_basic_s margin-5-left">닫기</button>
	 		</div>
	 	</div>
	</div>
</div>
<!--테이블 S-->
<div class="sm-row">
	<div class="az_board_basic" style="height: 50%;">
		<div data-ax5grid="svrInfoGrid" data-ax5grid-config="{showLineNumber: true, lineNumberColumnWidth: 40}" style="height: 100%;"></div>
	</div>
</div>
<c:import url="/js/ecams/common/commonscript.jsp" />	
<script type="text/javascript" src="<c:url value="/js/ecams/tab/sysinfo/SysDetailSvrTab.js"/>"></script>

