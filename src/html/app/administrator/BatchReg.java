package html.app.administrator;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.common.SysInfo;
import app.common.SystemPath;
import app.common.excelUtil;
import app.eCmd.Cmd0900;
import app.eCmm.Cmm1600;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/BatchReg")
public class BatchReg extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
	SystemPath systemPath = new SystemPath();
	excelUtil excelUtil = new excelUtil();
	Cmm1600 cmm1600 = new Cmm1600();
	Cmd0900 cmd0900 = new Cmd0900();
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
		doPost(req, resp);
	}
	
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonParser jsonParser = new JsonParser();
		JsonElement jsonElement = jsonParser.parse(ParsingCommon.getJsonStr(request));
		String requestType	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "requestType") );
		
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("UTF-8");
			
			switch (requestType) {
				case "getSysInfo" :
					response.getWriter().write( getSysInfo(jsonElement) );
				break;
				case "getSvrInfo" :
					response.getWriter().write( getSvrInfo(jsonElement) );
					break;
				case "getTmpDir" :
					response.getWriter().write( getTmpDir(jsonElement) );
					break;
				case "getArrayCollection" :
					response.getWriter().write( getArrayCollection(jsonElement) );
					break;
				case "getFileListExcel" :
					response.getWriter().write( getFileListExcel(jsonElement) );
					break;
				case "requestCheckIn" :
					response.getWriter().write( requestCheckIn(jsonElement) );
					break;
				case "getSysInfoMap" :
					response.getWriter().write( getSysInfoMap(jsonElement) );
					break;
				case "getModListExcel" :
					response.getWriter().write( getModListExcel(jsonElement) );
					break;
				case "relatUpdt" :
					response.getWriter().write( relatUpdt(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [관리자 > 일괄등록] 시스템 콤보 정보 가져오기
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String SecuYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String SelMsg 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		String CloseYn	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "CloseYn") );
		String ReqCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ReqCd") );
		return gson.toJson(sysinfo.getSysInfo(UserId, SecuYn, SelMsg, CloseYn, ReqCd));
	}
	
	// [관리자 > 일괄등록] 서버정보 가져오기
	private String getSvrInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserID 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserID") );
		String SysCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String SecuYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String SelMsg 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		return gson.toJson(sysinfo.getsvrInfo(UserID, SysCd, SecuYn, SelMsg));
	}
	
	// [관리자 > 일괄등록] 서버정보 가져오기
	private String getTmpDir(JsonElement jsonElement) throws SQLException, Exception {
		String pCode 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pCode") );
		return gson.toJson(systemPath.getTmpDir(pCode));
	}
	
	// [관리자 > 일괄등록] 사용자가 올린 엑셀 파일 가져오기
	private String getArrayCollection(JsonElement jsonElement) throws SQLException, Exception {
		String filePath 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "filePath") );
		ArrayList<String> headerDef = ParsingCommon.jsonStrToArrStr( ParsingCommon.jsonEtoStr(jsonElement, "headerDef") );
		return gson.toJson(excelUtil.getArrayCollection(filePath, headerDef));
	}
	
	// [관리자 > 일괄등록] 사용자가 올린 엑셀 파일 가져오기
	private String getFileListExcel(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> fileList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "fileList") );
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm1600.getFileList_excel(fileList, dataObj));
	}
	
	// [관리자 > 일괄등록] 사용자가 올린 엑셀 파일 가져오기
	private String requestCheckIn(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> chkInList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "chkInList") );
		HashMap<String, String> etcData = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		return gson.toJson(cmm1600.request_Check_In(chkInList, etcData));
	}
	
	// [관리자 > 소스모듈 일괄등록] 시스템 정보 가져오기
	private String getSysInfoMap(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String SecuYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String SelMsg 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		return gson.toJson(cmd0900.getSysInfo(UserId, SecuYn, SelMsg));
	}
	// [관리자 > 소스모듈 일괄등록] 모듈리스트 유효성 검사
	private String getModListExcel(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> fileList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "fileList") );
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm1600.getModList_excel(fileList, dataObj));
	}
	// [관리자 > 소스모듈 일괄등록] 모듈리스트 유효성 검사
	private String relatUpdt(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> chkInList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "chkInList") );
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm1600.relatUpdt(chkInList, UserId));
	}
}
