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
import app.eCmm.Cmm1200;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/DirectoryReg")
public class DirectoryRegServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
	Cmm1200 cmm1200 = new Cmm1200();
	
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
			case "getBaseInfo" :
				response.getWriter().write( getBaseInfo(jsonElement) );
				break;
			case "getPathList" :
				response.getWriter().write( getPathList(jsonElement) );
				break;
			case "removePath" :
				response.getWriter().write( removePath(jsonElement) );
				break;
			case "savePath" :
				response.getWriter().write( savePath(jsonElement) );
				break;
			default:
				break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	// [디렉토리등록] 시스템 콤보 가져오기
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String SecuYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SecuYn"));
		String SelMsg 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SelMsg"));
		String CloseYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"CloseYn"));
		String ReqCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"ReqCd"));
		return gson.toJson(sysinfo.getSysInfo(UserId, SecuYn, SelMsg, CloseYn, ReqCd));
	}
	// [디렉토리등록] 디렉토리, 프로그램, 업무 정보 가져오기
	private String getBaseInfo(JsonElement jsonElement) throws SQLException, Exception {
		String sysCD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sysCD"));
		String baseCD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"baseCD"));
		return gson.toJson(cmm1200.getBaseInfo(sysCD, baseCD));
	}
	// [디렉토리등록] 디렉토리 리스트 가져오기
	private String getPathList(JsonElement jsonElement) throws SQLException, Exception {
		String sysCD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sysCD"));
		String spath 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"spath"));
		return gson.toJson(cmm1200.getPathList(sysCD, spath));
	}
	// [디렉토리등록] 디렉토리 삭제
	private String removePath(JsonElement jsonElement) throws SQLException, Exception {
		String sysCD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sysCD"));
		String spath 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"spath"));
		String dsnCD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"dsnCD"));
		return gson.toJson(cmm1200.removePath(sysCD, spath, dsnCD));
	}
	// [디렉토리등록] 디렉토리 등록
	private String savePath(JsonElement jsonElement) throws SQLException, Exception {
		String sysCD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sysCD"));
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		ArrayList<HashMap<String, String>> saveList = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"saveList"));
		return gson.toJson(cmm1200.savePath(sysCD, UserId, saveList));
	}
}
