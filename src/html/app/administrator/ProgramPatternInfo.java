package html.app.administrator;

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

import app.common.SysInfo;
import app.eCmd.Cmd1200;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/ProgramPatternInfo")
public class ProgramPatternInfo extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
	Cmd1200 cmd1200 = new Cmd1200();
	
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
				case "getProgInfo" :
					response.getWriter().write( getProgInfo(jsonElement) );
					break;
				case "getProgInfoChk" :
					response.getWriter().write( getProgInfoChk(jsonElement) );
					break;
				case "getRsrcScript" :
					response.getWriter().write( getRsrcScript(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [프로그램유형정보] 시스템 콤보 가져오기
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String SecuYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SecuYn"));
		String SelMsg 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SelMsg"));
		String CloseYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"CloseYn"));
		String ReqCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"ReqCd"));
		return gson.toJson(sysinfo.getSysInfo(UserId, SecuYn, SelMsg, CloseYn, ReqCd));
	}
	
	// [프로그램유형정보] 프로그램유형정보가져오기
	private String getProgInfo(JsonElement jsonElement) throws SQLException, Exception {
		String sysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sysCd"));
		return gson.toJson(cmd1200.getProgInfo(sysCd));
	}
	
	// [프로그램유형정보] 점검리스트 가져오기
	private String getProgInfoChk(JsonElement jsonElement) throws SQLException, Exception {
		String sysCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sysCd"));
		return gson.toJson(cmd1200.getProgInfo_Chk(sysCd));
	}
	// [프로그램유형정보] 스크립트 리스트가져오기
	private String getRsrcScript(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"etcData"));
		return gson.toJson(cmd1200.getRsrccdScript(etcData));
	}
}
