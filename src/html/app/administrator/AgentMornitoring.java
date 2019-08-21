package html.app.administrator;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.common.SysInfo;
import app.eCmm.Cmm1500;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/AgentMornitoring")
public class AgentMornitoring extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
	Cmm1500 cmm1500 = new Cmm1500();
	
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
				case "getAgentState" :
					response.getWriter().write( getAgentState(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}
	
	// [Agent모니터링] 시스템 콤보 가져오기
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String SecuYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SecuYn"));
		String SelMsg 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SelMsg"));
		String CloseYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"CloseYn"));
		String ReqCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"ReqCd"));
		return gson.toJson(sysinfo.getSysInfo(UserId, SecuYn, SelMsg, CloseYn, ReqCd));
	}
	
	// [Agent모니터링] 조회
	private String getAgentState(JsonElement jsonElement) throws SQLException, Exception {
		String sysCD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sysCD"));
		String sType 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sType"));
		return gson.toJson(cmm1500.getAgentState(sysCD, sType));
	}
}
