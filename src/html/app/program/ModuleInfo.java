package html.app.program;

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

import app.eCmd.Cmd0900;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/program/ModuleInfo")
public class ModuleInfo extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
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
				case "getRsrcList" :
					response.getWriter().write( getRsrcList(jsonElement) );
					break;
				case "getRelatList" :
					response.getWriter().write( getRelatList(jsonElement) );
					break;
				case "getProgList" :
					response.getWriter().write( getProgList(jsonElement) );
					break;
				case "getModList" :
					response.getWriter().write( getModList(jsonElement) );
					break;
				case "updtRelat" :
					response.getWriter().write( updtRelat(jsonElement) );
					break;
				case "delRelat" :
					response.getWriter().write( delRelat(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [실행모듈정보] 시스템 콤보 정보 가져오기
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String SecuYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SecuYn"));
		String SelMsg 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SelMsg"));
		return gson.toJson(cmd0900.getSysInfo(UserId, SecuYn, SelMsg));
	}
	
	// [실행모듈정보] 프로그램종류 콤보 정보 가져오기
	private String getRsrcList(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysCd"));
		String SelMsg 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SelMsg"));
		return gson.toJson(cmd0900.getRsrcList(SysCd, SelMsg));
	}
	
	// [실행모듈정보] 연관등록목록 가져오기
	private String getRelatList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysCd"));
		String GbnCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"GbnCd"));
		String ProgId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"ProgId"));
		String subSw 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"subSw"));
		return gson.toJson(cmd0900.getRelatList(UserId, SysCd, GbnCd, ProgId, Boolean.valueOf(subSw)));
	}
	
	// [실행모듈정보] 프로그램목록 가져오기
	private String getProgList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysCd"));
		String ProgId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"ProgId"));
		String subSw 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"subSw"));
		String rsrcCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"rsrcCd"));
		return gson.toJson(cmd0900.getProgList(UserId, SysCd, ProgId, Boolean.valueOf(subSw), rsrcCd));
	}
	// [실행모듈정보] 모듈목록 가져오기
	private String getModList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysCd"));
		String ProgId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"ProgId"));
		String subSw 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"subSw"));
		String rsrcCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"rsrcCd"));
		return gson.toJson(cmd0900.getModList(UserId, SysCd, ProgId, Boolean.valueOf(subSw), rsrcCd));
	}
	// [실행모듈정보] 등록
	private String updtRelat(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysCd"));
		ArrayList<HashMap<String, String>>  progList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement,"progList"));
		return gson.toJson(cmd0900.updtRelat(UserId, SysCd, progList));
	}
	// [실행모듈정보] 폐기
	private String delRelat(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		ArrayList<HashMap<String, String>>  progList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement,"progList"));
		return gson.toJson(cmd0900.delRelat(UserId, progList));
	}
}
