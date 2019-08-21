package html.app.modal.sysinfo;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.eCmm.Cmm0100;
import app.eCmm.Cmm0200_Copy;
import app.eCmm.Cmm0200_Prog;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/sysinfo/PrgSeqServlet")
public class PrgSeqServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */
	Gson gson = new Gson();
	Cmm0100 cmm0100 = new Cmm0100();
	Cmm0200_Copy cmm0200_copy = new Cmm0200_Copy();
	Cmm0200_Prog cmm0200_prog = new Cmm0200_Prog();
	
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
				case "getProgInfoTree" :
					response.getWriter().write(getProgInfoTree(jsonElement));
					break;
				case "getCodeSelInfo" :
					response.getWriter().write(getCodeSelInfo(jsonElement));
					break;
				case "insertNewDir" :
					response.getWriter().write(insertNewDir(jsonElement));
					break;
				case "checkDelDir" :
					response.getWriter().write(checkDelDir(jsonElement));
					break;
				case "delDir" :
					response.getWriter().write(delDir(jsonElement));
					break;
				case "updateProgInfo" :
					response.getWriter().write(updateProgInfo(jsonElement));
					break;
				case "reNameDir" :
					response.getWriter().write(reNameDir(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [시스템정보 > 프로그램종류정보 > 프로그램유형별처리속성관리]  처리속성 트리 가져오기
	private String getProgInfoTree(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0100.getProgInfoZTree());
	}
	
	// [시스템정보 > 프로그램종류정보 > 프로그램유형별처리속성관리]  처리속성 코드 가져오기
	private String getCodeSelInfo(JsonElement jsonElement) throws SQLException, Exception {
		String res = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "res") );
		return gson.toJson(cmm0100.getCodeSelInfo(res));
	}
	
	// [시스템정보 > 프로그램종류정보 > 프로그램유형별처리속성관리]  처리속성 트리 추가 / 서브추가
	private String insertNewDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.subNewDir(dataObj));
	}
	
	// [시스템정보 > 프로그램종류정보 > 프로그램유형별처리속성관리]  처리속성 트리 삭제 확인
	private String checkDelDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.subDelDir_Check(dataObj));
	}
	
	// [시스템정보 > 프로그램종류정보 > 프로그램유형별처리속성관리]  처리속성 트리 삭제
	private String delDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.subDelDir(dataObj));
	}
	
	// [시스템정보 > 프로그램종류정보 > 프로그램유형별처리속성관리]  처리속성 업데이트
	private String updateProgInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.updtProgInfo(dataObj));
	}
	
	// [시스템정보 > 프로그램종류정보 > 프로그램유형별처리속성관리]  처리속성 트리구분명 변경
	private String reNameDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.subRename(dataObj));
	}
	
	
}
