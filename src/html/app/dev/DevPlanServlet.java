package html.app.dev;

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

import app.eCmc.Cmc0200;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/dev/DevPlanServlet")
public class DevPlanServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmc0200 cmc0200 = new Cmc0200();
	
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
				case "GETWORKER" :
					response.getWriter().write( getWorker(jsonElement) );
					break;
				case "GETWORKTIME" :
					response.getWriter().write( getWorktime(jsonElement) );
					break;
				case "GETWORKDAYS" :
					response.getWriter().write( getWorkdays(jsonElement) );
					break;
				case "SETDEVPLAN" :
					response.getWriter().write( setDevplan(jsonElement) );
					break;
				case "SETWORKRESULT" :
					response.getWriter().write( setWorkresult(jsonElement) );
					break;
				case "DELETEWORKRESULT" :
					response.getWriter().write( deleteWorkresult(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}
	
	private String getWorker(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> SRInfoMap = new HashMap<String, String>();
		SRInfoMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"SRInfo"));
		return gson.toJson(cmc0200.getSelectList(SRInfoMap.get("srId"), 
												 SRInfoMap.get("userId"), 
												 SRInfoMap.get("reqCd")));
	}
	
	private String getWorktime(JsonElement jsonElement) throws SQLException, Exception {
		String srId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "srId"));
		return gson.toJson(cmc0200.get_Worktime(srId));
	}
	
	private String getWorkdays(JsonElement jsonElement) throws SQLException, Exception {
		String year = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "year"));
		return gson.toJson(cmc0200.getWorkDays(year));
	}
	
	private String setDevplan(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> PlanInfoMap = new HashMap<String, String>();
		PlanInfoMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"PlanInfo"));
		return gson.toJson(cmc0200.setInsertList(PlanInfoMap));
	}
	
	private String setWorkresult(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> WorkResultInfoMap = new HashMap<String, String>();
		WorkResultInfoMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"WorkResultInfo"));
		return gson.toJson(cmc0200.setTimeInsertList(WorkResultInfoMap));
	}
	
	private String deleteWorkresult(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> WorkResultInfoMap = new HashMap<String, String>();
		WorkResultInfoMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"WorkResultInfo"));
		return gson.toJson(cmc0200.setTimeDeleteList(WorkResultInfoMap));
	}
}
