package html.app.report;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ecams.service.list.LoginManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.common.CodeInfo;
import app.common.SysInfo;
import app.common.TeamInfo;
import app.common.UserInfo;
import app.eCmp.Cmp3500;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/report/ConfigOpReport")
public class ConfigOpReport extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	UserInfo userinfo = new UserInfo();
	TeamInfo teaminfo = new TeamInfo();
	CodeInfo codeinfo = new CodeInfo();
	SysInfo sysinfo = new SysInfo();
	Cmp3500 cmp3500 = new Cmp3500();
	
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
				case "isAdmin" :
					response.getWriter().write( isAdmin( jsonElement ));
					break;
				case "getCodeInfo" :
					response.getWriter().write( getCodeInfo() );
					break;
				case "getSysInfo" :
					response.getWriter().write( getSysInfo( jsonElement ) );
					break;
				case "getRsrcCd" :
					response.getWriter().write( getRsrcCd( jsonElement ) );
					break;
				case "getProgList" :
					response.getWriter().write( getProgList( jsonElement ) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String isAdmin(JsonElement jsonElement) throws SQLException, Exception {
		String user = null;
		user = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(userinfo.isAdmin(user));
	}
	
	private String getCodeInfo() throws SQLException, Exception {
		return gson.toJson(codeinfo.getCodeInfo("RPTPRGGB,RPTSTEP1,RPTDOCGB", "SEL", "N"));
	}
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String user = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String secuYn = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		return gson.toJson(sysinfo.getSysInfo(user, secuYn,"ALL","N",""));
	}
	
	private String getRsrcCd(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> jsonMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "inputData"));
		return gson.toJson(cmp3500.getRsrcCd_New(jsonMap.get("userid"), jsonMap.get("syscd"), jsonMap.get("dateGbn"), jsonMap.get("strDate"), jsonMap.get("endDate")));
	}
	private String getProgList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> jsonMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "inputData"));
		return gson.toJson(cmp3500.getProgList(
				jsonMap.get("userid"), jsonMap.get("dateGbn"), jsonMap.get("strDate"), jsonMap.get("endDate"),
				jsonMap.get("step1"), jsonMap.get("step2"), jsonMap.get("step3"), jsonMap.get("step4"), jsonMap.get("syscd"), jsonMap.get("strJob")));
	}
}
