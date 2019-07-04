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
import app.common.TeamInfo;
import app.common.UserInfo;
import app.eCmp.Cmp1400;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/report/SRStandardReport")
public class SRStandardReport extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	UserInfo userinfo = new UserInfo();
	TeamInfo teaminfo = new TeamInfo();
	CodeInfo codeinfo = new CodeInfo();
	Cmp1400 cmp1400 = new Cmp1400();
	
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
				case "getTeamInfo1" :
					response.getWriter().write( getTeamInfo1() );
					break;
				case "getTeamInfo2" :
					response.getWriter().write( getTeamInfo2() );
					break;
				case "getCodeInfo" :
					response.getWriter().write( getCodeInfo() );
					break;
				case "isAdmin" :
					response.getWriter().write( isAdmin(jsonElement) );
					break;
				case "getProgCnt" :
					response.getWriter().write( getProgCnt(jsonElement) );
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
	
	private String getTeamInfo1() throws SQLException, Exception {
		return gson.toJson(teaminfo.getTeamInfoGrid2("ALL", "Y", "DEPT", "N"));
	}
	
	private String getTeamInfo2() throws SQLException, Exception {
		return gson.toJson(teaminfo.getTeamInfoGrid2("ALL", "Y", "req", "N"));
	}
	
	private String getCodeInfo() throws SQLException, Exception {
		return gson.toJson(codeinfo.getCodeInfo("RPTPRGGB,ISRSTA", "ALL", "N"));
	}
	
	private String getProgCnt(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	DataInfoMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "inputData") );
		String userid = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userId"));
		String reqCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "reqCd"));
		String secuYn = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "secuYn"));
		return gson.toJson( cmp1400.getProgCnt(userid, reqCd, secuYn, DataInfoMap) );
	}
}
