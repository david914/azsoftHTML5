package html.app.mypage;

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

import app.common.UserInfo;
import app.common.SysInfo;
import app.eCmd.Cmd1300;

import html.app.common.ParsingCommon;

@WebServlet("/webPage/mypage/UserConfig")
public class UserConfig extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	UserInfo userinfo = new UserInfo();
	SysInfo sysinfo = new SysInfo();
	Cmd1300 cmd1300= new Cmd1300();
	
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
				case "UserInfo" :
					response.getWriter().write( checkAdmin(jsonElement) );
					break;
				case "getSysInfo" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "getUserConfigList" :
					response.getWriter().write( getUserConfigList(jsonElement) );
					break;
				case "insertUserConfig" :
					response.getWriter().write( insertUserConfig(jsonElement) );
					break;
				case "deleteUserConfig" :
					response.getWriter().write( deleteUserConfig(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			requestType = null;
		}
		
	}


	private String checkAdmin(JsonElement jsonElement) throws SQLException, Exception {
		String userId = null;
		userId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(userinfo.isAdmin(userId));
	}
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String secuYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"secuYn"));
		String SelMsg 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SelMsg"));
		String CloseYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"CloseYn"));
		String ReqCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"ReqCd"));
		return gson.toJson(sysinfo.getSysInfo(UserId, secuYn, SelMsg, CloseYn, ReqCd));
	}
	
	private String getUserConfigList(JsonElement jsonElement) throws SQLException, Exception {
		String userId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"userId"));
		return gson.toJson(cmd1300.getSql_Qry(userId));
	}
	
	private String insertUserConfig(JsonElement jsonElement) throws SQLException, Exception {
		String userId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"userId"));
		String sysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sysCd"));
		String devDir 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"devDir"));
		String agentDir = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"agentDir"));
		return gson.toJson(cmd1300.getTblUpdate(userId, sysCd, devDir, agentDir));
	}
	private String deleteUserConfig(JsonElement jsonElement) throws SQLException, Exception {
		String userId 								= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"userId"));
		ArrayList<HashMap<String, String>> delList 	= ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"delList"));
		return gson.toJson(cmd1300.getTblDelete(userId, delList));
	}
}
